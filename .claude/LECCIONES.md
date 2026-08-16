# Lecciones

Trampas que ya nos costaron tiempo en este repo. Cada una: **síntoma → causa →
qué hacer**. Se agregan a medida que aparecen; si una vuelve a morder, es que
está mal escrita.

---

## Datos y calendario

### El modelo contradijo a la fuente cinco veces, y las cinco estaba mal el modelo

**Síntoma:** el afinado dejaba melón, sandía o choclo sin ventana de siembra, o
recortaba octubre para el tomate cuando INTA lo da como ideal.

**Causa:** en todos los casos, el criterio se estaba evaluando en el momento
equivocado del ciclo.

- La helada se evaluaba en la fecha de **siembra**. Una semilla enterrada no se
  hiela; el plantín sí. → se evalúa en la **emergencia** (`corrida()`).
- El rango de crecimiento se evaluaba en la siembra. La sandía se siembra en
  octubre pero necesita los 21 °C que llegan en noviembre. → se evalúa a
  **mitad de ciclo**.
- La frutilla quedaba sin ventana porque `helada: 'sensible'` penalizaba una
  planta que aguanta −10 °C, y su ciclo de 150-240 días ponía el "mitad de
  ciclo" en pleno invierno, que es justamente el punto. → guardas por
  `tolera_min <= 0` y por ciclo largo.

**Qué hacer:** cuando el modelo y una fuente no coinciden, **gana la fuente**.
Buscá en qué momento del ciclo está actuando el criterio antes de tocar
umbrales; el bug casi siempre es *cuándo* se evalúa, no *cuánto*.

### Dos varas para el mismo riesgo

**Síntoma:** al tomate le faltaba la primera década de octubre, con vecinas
ideales de los dos lados. Un hueco así se ve raro y erosiona la confianza en
todo el calendario.

**Causa:** agosto seguía ideal con **100 %** de riesgo de helada (almácigo
protegido, exento total) mientras octubre bajaba a "posible" con **33 %**
(`directa|almacigo`, exento solo del descarte). Dos criterios distintos para el
mismo riesgo.

**Qué hacer:** después de cualquier cambio en el afinado, corré el escaneo de
huecos. Un hueco de una década rodeada de ideales es casi siempre un criterio
incoherente, no un dato. Hay una pasada de monotonía que lo verifica: si una
década quedó degradada por helada pero la anterior —que es *más* riesgosa—
sigue ideal, la degradación es incoherente y se revierte.

### No existe temperatura de suelo publicada para el AMBA

Verificado: la palabra "suelo" no aparece en las 847 páginas de las normales
1991-2020 del SMN, y no hay publicado ningún offset aire→suelo para la región
pampeana. Por eso el modelo **no estima temperatura de suelo**.

El criterio primario y bien fundado es el de **heladas** (FAUBA, umbral
agrometeorológico de 3 °C, series de 50-63 años). La temperatura del aire es
secundaria, y la suposición sobre el suelo está declarada en el código y solo
puede degradar, nunca descartar. No la asciendas sin una fuente nueva.

---

## Service worker y offline

### La app abre en blanco sin conexión aunque el precache esté completo

**Síntoma:** el documento carga (el título aparece) pero la pantalla queda
vacía; en la consola, dos `net::ERR_FAILED` sobre el JS y el CSS.

**Causa:** `Vary: Origin`. El servidor declara que la respuesta depende del
header `Origin`. Vite marca sus `<script>` y `<link>` con `crossorigin`, así
que el navegador los pide en modo CORS y **manda** `Origin`; el precache los
guardó con un pedido que **no** lo lleva. Para el algoritmo de match de la
Cache API son representaciones distintas: no coinciden, `caches.match` devuelve
`undefined`, se cae a `fetch()` y sin red eso es un error.

**Qué hacer:** `caches.match(req, { ignoreVary: true })`. Es seguro justo acá
porque los assets llevan hash en el nombre: una URL corresponde a un contenido
y a uno solo, no hay negociación que perderse. **No lo saques.**

**La lección más general:** esto no lo encuentra ninguna revisión de código.
Probá offline de verdad — cargar, cortar la red, recargar, recorrer la app
entera. Está en `e2e/pwa.spec.ts`.

### El plugin dejó los marcadores sin reemplazar

**Síntoma:** `dist/sw.js` idéntico a la plantilla, con `__PRECACHE__` literal.
El plugin igual imprimía la versión, como si hubiera funcionado.

**Causa:** `String.prototype.replace` con un string reemplaza **la primera**
aparición, y la primera estaba en el comentario de cabecera que explicaba los
marcadores. El código quedaba intacto.

**Qué hacer:** `replaceAll`, y un chequeo que haga fallar el build si algún
marcador sobrevive. Regla general: **cuando generás código por sustitución,
verificá el resultado, no la ejecución.** Que el generador no tire error no
quiere decir que haya hecho algo.

### Los tests de e2e se pisan entre sí

**Síntoma:** `net::ERR_INTERNET_DISCONNECTED` intermitente en el test de
offline, solo al correr la suite completa.

**Causa:** el test de actualización reescribe `dist/sw.js` para simular un
deploy nuevo. En paralelo, otro test se encuentra el service worker cambiado
abajo de los pies.

**Qué hacer:** `workers: 1` en `playwright.config.ts`. La suite tarda 11 s; no
vale la pena paralelizar algo que comparte un `dist/` y un servidor.

---

## Frontend

### Un test que pasa por llegar temprano es peor que no tenerlo

**Síntoma:** los tests de accesibilidad pasaban. Al agregarles una espera real,
aparecieron tres problemas que llevaban semanas ahí: un botón de 38 px,
tarjetas `h3` colgando de un `h1`, y más.

**Causa:** `waitForLoadState('networkidle')` vuelve antes de que React haya
pintado la lista. El test medía el esqueleto vacío y no encontraba nada malo
porque no había nada.

**Qué hacer:** todo test que mida el DOM espera a que haya contenido de verdad
(el helper `abrir()` en `e2e/accesibilidad.spec.ts`). Si un test nunca falló,
sospechá de él antes de festejarlo.

### El contraste flojo casi nunca es un caso suelto

107 textos por debajo de AA resultaron ser **seis tokens de color**. Arreglar
caso por caso hubiera sido semanas de parches; arreglar los tokens fueron seis
líneas.

Los colores que son solo relleno o borde (`--sol`, `--salvia`) se rigen por
3:1, que es lo que pide WCAG para objetos gráficos — por eso el amarillo de
"se puede" puede seguir siendo amarillo. Los de texto van a 4,5:1 con margen.

### `display: grid` o `flex` en un `<li>` con texto rico

**Síntoma:** una lista de pasos numerados se desarmó en una columna de palabras
sueltas.

**Causa:** con el `li` como grid, **cada hijo** se vuelve un ítem de grilla —
incluidos los `<strong>` del medio de la oración.

**Qué hacer:** contador con `position: absolute` y `padding-left`, que deja el
texto en flujo normal. O envolver el contenido en un solo elemento.

### Medir antes de optimizar, y también después

Precargar el catálogo con `modulepreload` parecía la mejora obvia. Medido en
CPU 4× más lenta y 1,6 Mbps salió **133 ms peor**: en un enlace angosto, los
574 KB del catálogo le compiten el ancho de banda al bundle que hace falta para
dibujar. Está anotado en `src/lib/data/especies.ts` para que no se
"optimice" de vuelta.

---

## Entorno

### `pkill -f` no distingue de quién es el proceso

Un `pkill -f vite` para limpiar el dev server propio se llevó puesto el de otro
proyecto abierto en la misma máquina. El daño cae fuera del repo, donde no se
ve. Hay un hook que lo bloquea; usá puerto propio y matá por PID.

### `controller` no significa que el service worker vaya a responder

**Síntoma:** `page.reload: net::ERR_INTERNET_DISCONNECTED` en el test de
offline, solo en CI y nunca en la Mac. La página del snapshot aparecía cargada
entera, así que "el precache está roto" no explicaba nada.

**Causa:** el test esperaba `navigator.serviceWorker.controller`. Pero
`clients.claim()` llena `controller` mientras el worker todavía está en estado
**`activating`** —el `waitUntil` del handler de activate no terminó— y en ese
estado **el navegador no le despacha eventos `fetch`**. La navegación se va
derecho a la red. En una máquina rápida la ventana dura milisegundos; en un
runner de CI se abre lo suficiente.

**Qué hacer:** esperar `registration.active.state === 'activated'`. Y de paso
verificar que **`index.html` esté en la caché** en vez de contar entradas: es el
archivo del que depende que una navegación offline funcione.

**La lección general:** cuando un test falla solo en CI, la diferencia suele ser
tiempo, no entorno. Buscá qué condición estabas dando por cumplida.

# Huerta GBA

### 👉 [facundo-p.github.io/huertapp](https://facundo-p.github.io/huertapp/)

Una app para planificar y mantener una huerta casera en el **Gran Buenos Aires**.
Se instala en el celular, **funciona sin internet** y no tiene cuentas, servidor
ni nube: todo lo que cargás vive en tu aparato.

Responde tres preguntas, que son las que uno se hace con tierra en las manos:

- **¿Qué siembro esta semana?** — el calendario de 55 especies, afinado a
  períodos de 10 días y a tu zona del GBA.
- **¿Esto ya se trasplanta?** — tus plantas con sus fechas estimadas, y avisos
  cuando cada una entra en ventana.
- **¿Qué le pasa a mi tomate?** — la ficha completa de cada especie, con las
  fuentes y el índice de confianza de cada dato a la vista.

---

## Instalarla en el celular

No está en Play Store ni en App Store: es una PWA, se instala desde el navegador.
Entrá a **[facundo-p.github.io/huertapp](https://facundo-p.github.io/huertapp/)**
y seguí los pasos según el teléfono. (Los mismos pasos están dentro de la app, en
**Ajustes → Instalar en el celu**.)

### Android (Chrome, Edge, Samsung Internet)

1. Abrí la app en el navegador.
2. Tocá el **menú** (los tres puntitos, arriba a la derecha).
3. Elegí **"Instalar app"** o **"Agregar a la pantalla de inicio"**.
4. Confirmá.

También puede aparecer un botón **Instalar la app** en Ajustes: es el mismo
diálogo, más a mano.

### iPhone y iPad (Safari)

En iOS **hay que usar Safari** — Chrome o Firefox en iPhone no pueden instalar
PWAs, es una restricción del sistema.

1. Abrí la app en **Safari**.
2. Tocá el botón **Compartir** (el cuadradito con la flecha para arriba, abajo
   en el centro).
3. Bajá en la lista hasta **"Agregar a inicio"**.
4. Tocá **Agregar**.

### ¿Cómo sé que quedó instalada?

Abre sin la barra de direcciones del navegador, y en **Ajustes** dice
*"Ya está instalada"*.

---

## Tus datos

Todo se guarda en **IndexedDB**, en el navegador de ese aparato. No hay copia en
ningún otro lado, y eso tiene una contra concreta:

- Si borrás los datos del navegador, se van.
- En iPhone, el sistema puede vaciar el almacenamiento de un sitio que pasa
  varias semanas sin usarse.

**Por eso el backup no es un extra.** En Ajustes hay un botón que baja un único
archivo `.json` con todo adentro —plantas, diario y fotos en base64— y otro que
lo restaura. Guardátelo cada tanto donde uses: mail, Drive, lo que sea. El
archivo sirve solo, no necesita nada más para restaurarse.

Restaurar **reemplaza todo** lo que haya, y nunca lo hace sin confirmación:
primero valida el archivo, después te muestra qué trae (cuántas plantas, cuántas
entradas, cuántas fotos, de qué fecha) y recién ahí aparece el botón.

La app también le pide al navegador que **no borre** estos datos —la primera vez
que cargás una planta, que es cuando hay algo que perder—, pero eso es una mejora
de probabilidad, no una garantía. El backup sigue siendo la red de seguridad.

---

## Avisos: qué esperar

Se pueden prender en Ajustes, y son opcionales por diseño: **la app no depende de
ellos**. Al abrirla, la pantalla Hoy siempre muestra lo pendiente.

| Dónde | Qué pasa |
|---|---|
| Android + Chrome, **instalada** | Anda. Un aviso por día como mucho, y solo los días en que aparece algo nuevo. La hora la decide el navegador. |
| Android, en una pestaña común | No. El navegador no despierta una pestaña. |
| **iPhone / iPad** | **No.** iOS no implementa Periodic Background Sync: una PWA instalada no puede despertarse sola. No hay forma de darle la vuelta sin un servidor de push. |
| Escritorio (Chrome/Edge) | Igual que Android instalada. |

---

## Los datos agronómicos

Las 55 especies salen de una base de conocimiento investigada aparte
(`data/huerta_gba.json`): cada campo tiene su **valor**, sus **fuentes con URL**
y un **índice de confianza** del 1 al 10, todo accesible desde la ficha. INTA,
ProHuerta, UNLu, UNLP, FAUBA, universidades y extensiones agrícolas.

Sobre esa base, la app agrega dos capas —y la diferencia entre ellas está a la
vista en todas partes:

**1. Lo que dijeron las fuentes.** Los meses de siembra y trasplante, tal cual se
derivaron de los textos. Es la capa citable y no se toca nunca.

**2. El afinado a décadas.** Las fuentes hablan en meses, pero no es lo mismo
sembrar a principios que a fines de septiembre. Un modelo climático del GBA
—construido sobre las **normales 1991–2020 del SMN** y la **estadística de
heladas de FAUBA** (umbral agrometeorológico de 3 °C, series de 50 a 63 años)—
recorta esos meses a períodos de **10 días**, que es la unidad decádica que usa
INTA.

La regla de oro que hace todo esto defendible: **el modelo solo puede recortar lo
que dijeron las fuentes, nunca agregar**. Está verificada por un test sobre las
55 especies × 3 zonas, y el build falla si alguna década se sale de los meses de
origen. Cada recorte queda registrado con su regla y su motivo en
`data/REVISION_CALENDARIO.md`.

Precisión honesta del afinado: **±10 días**. Va declarado en el glosario y al pie
de cada ficha, y nunca se presenta como dato de fuente.

**Las tres zonas importan.** Dentro del AMBA la última helada cambia **71 días**
entre el centro porteño y La Plata. Sin elegir zona, la precisión sub-mensual le
erraría a media ciudad. Se elige en Ajustes; por defecto, Conurbano.

---

## Para desarrollar

```bash
npm install
npm run dev          # servidor de desarrollo (sin service worker, a propósito)
npm run build        # dist/ listo para cualquier hosting estático
npm run preview      # sirve dist/ en :4173 — necesario para los e2e
```

| Comando | Qué hace |
|---|---|
| `npm test` | 537 tests de lógica pura con vitest: modelo climático, afinado del calendario, motor de tareas, agenda de avisos, estimaciones. |
| `npm run e2e` | Playwright: backup de ida y vuelta, offline real, flujo de actualización, y accesibilidad en las 7 pantallas. |
| `npm run shots` | 27 screenshots en 390×844 para revisión visual (`e2e/shots/`). |
| `npm run data:build` | Regenera `data/huerta_gba_enriquecido.json` desde el JSON base + el enriquecimiento + el modelo climático. |
| `npm run data:tabla` | Regenera `data/REVISION_CALENDARIO.md` para revisar el calendario a mano. |
| `npm run iconos` | Regenera los PNG del ícono desde `scripts/icono-app.mjs`. |

### Cómo está armado

- **Vite 7 + React 19 + TypeScript**, `HashRouter` y `base: './'` → anda en
  cualquier hosting estático, en cualquier subcarpeta, sin configurar rutas.
- **Service worker propio** (`scripts/sw.js` + `scripts/plugins-build.mjs`), sin
  Workbox: la app es estática y con nombres hasheados, así que la estrategia son
  tres decisiones que caben en 100 líneas legibles. Precache total en install,
  cache primero, y **la versión nueva nunca se activa sola** —espera a que la
  persona la acepte.
- **IndexedDB** vía `idb`. Las fotos van como Blobs, redimensionadas a 1280 px y
  convertidas a webp al guardar.
- **CSS propio con design tokens** en `src/theme.css`. Sin librerías de
  componentes.
- **Íconos SVG propios**, todos con la misma gramática (viewBox 24, trazo 1.75,
  puntas redondeadas, `currentColor`). El Glosario los explica todos.
- Tipografías **self-hosted** (Nunito y Quicksand variables, subconjunto latin):
  nada por CDN, que rompería el offline.

Números del build: **1200 KB** precacheados (el catálogo de 55 especies es la
mayor parte), 1,6 s hasta contenido útil en la primera visita simulando un
teléfono medio (CPU 4× más lenta, 1,6 Mbps), **0,15 s** de ahí en adelante.

### Cómo se publica

Cada push a `main` dispara `.github/workflows/publicar.yml`, que en una máquina
limpia corre `npm ci`, **los 537 tests unitarios + el chequeo de que el JSON
generado esté al día**, **los 12 e2e** (offline y actualización incluidos), y
recién ahí buildea y publica en GitHub Pages.

Los e2e antes del deploy no son ceremonia: un service worker roto le deja una
pantalla en blanco a quien ya tiene la app instalada, **y esa persona no lo
puede arreglar desde su lado**. Dos minutos de Playwright son el seguro.

`dist/` nunca se commitea. El repo guarda código fuente y GitHub arma el resto.
Para republicar sin cambios, "Run workflow" en la pestaña Actions.

Notas del hosting:

- La URL es `…github.io/**huertapp**/` porque en una Page de proyecto la ruta
  *es* el nombre del repo. Cambiar el nombre cambia la URL, y eso rompe las
  instalaciones existentes: para el navegador, otro origen es **otra app**, con
  otro service worker y otra base de datos. Los datos se mudan con el backup.
- GitHub Pages cachea 10 minutos en su CDN, así que un deploy puede tardar
  ese rato en verse.
- Un dominio propio posicionaría mejor que un subdirectorio de `github.io` y se
  configura en Pages con dos clicks — pero conviene decidirlo **antes** de que
  la URL circule, por lo mismo del punto anterior.

### Accesibilidad

No es una pasada final: son cinco tests que corren en las 7 pantallas con datos
cargados (`e2e/accesibilidad.spec.ts`) y fallan si algo baja.

- Contraste **AA** en todo el texto — los tokens de color están calibrados a
  ~4,6:1 para no vivir en el borde. La jerarquía visual se hace con tamaño y
  peso, nunca bajando el contraste.
- Targets táctiles de **44 px**.
- El color nunca es el único canal: ideal/posible se distinguen también por
  forma y relleno.
- Foco de teclado visible, jerarquía de encabezados sin saltos, nombre accesible
  en todo lo que se toca.

---

## Qué NO hace

Dicho de frente, porque son decisiones y no pendientes:

- **No hay cuentas, servidor ni sync.** Dos teléfonos son dos huertas distintas;
  se pasan con el archivo de backup.
- **No inventa datos agronómicos.** Si un dato no está, la ficha dice "sin dato"
  con su estilo propio en vez de completarlo.
- **No hay notificaciones en iPhone** con la app cerrada. Ver la tabla de arriba.
- **No pide la hora del aviso**, porque sin un servidor de push no se puede
  cumplir.

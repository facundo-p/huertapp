# 02 · Funcionalidad: qué cambia respecto de la app actual

Referencia del código actual: `facundo-p/huertapp`, branch `staging`, subárbol
`src`. Cada sección dice qué se conserva (para que no se reimplemente) y qué hay
que agregar o mover. **El diseño de los dos temas es indiferente a todo esto**:
las cinco pantallas se ven igual en día y en noche.

Principio general: los cambios piden **más datos derivados**, no más datos
cargados por el usuario. Nada de lo que sigue agrega un campo al alta de planta
ni pide una cuenta. Todo sale de lo que ya está en IndexedDB más el catálogo.

---

## 1. Hoy — de lista de tareas a carril de la semana

**Hoy:** `src/screens/Hoy.tsx` apila tres bloques independientes: `<Pronostico>`
(su propia tarjeta con los 7 días), la sección "Para hacer" (`tareasVisibles` en
una `<ul>`) y el carrusel "Para sembrar ahora" (`paraSembrarAhora`).

**El rediseño los cruza:** un solo eje vertical de 7 días donde el clima de cada
día y las cosas de ese día viven en la misma fila. El pronóstico deja de ser una
tarjeta aparte; "Sembrá ahora" queda como lista al pie, ordenada por lo que
primero se cierra.

### Lo que hay que agregar

1. **Fechar las tareas.** Hoy `derivarTareas()` devuelve tareas del día
   (`hoy: iso`) sin fecha propia. El carril necesita ubicar cada tarea en un día
   de la ventana de 7. Agregar al tipo `Tarea` un campo:

   ```ts
   /** día en que cae, ISO corta. Para las atrasadas: hoy. */
   fecha: string
   ```

   Reglas: una tarea **atrasada** o en ventana se ancla en hoy (no se muestra en
   el pasado, que quedaría fuera del carril); una tarea que **va a entrar en
   ventana** dentro de los 6 días se ancla en el día en que entra — eso es
   material nuevo que el motor hoy descarta porque solo mira el día actual.
   Es decir: `derivarTareas({ ..., hasta })` con una ventana, no un solo día.

2. **Los avisos de clima entran al carril.** `derivarAvisos(p, iso, nombres)` ya
   sabe de qué día habla cada aviso; hoy los pinta dentro de `<Pronostico>`.
   Ahora se emiten como items del día correspondiente (helada el viernes va en la
   fila del viernes), con el molde de fila de aviso y sin botón `Hecho`.
   `suprimirHeladaEstadistica(tareas, avisos)` se conserva tal cual: si el
   pronóstico avisa helada, la tarea estadística no se duplica.

3. **Días vacíos visibles.** Un día sin nada muestra `—`. No colapsa: la lectura
   que se busca es "cómo viene la semana", y para eso los huecos importan.

4. **Frescura del pronóstico.** Si `frescura(p, ahora) === 'vencido'` o no hay
   ubicación, las columnas de clima van sin ícono ni temperaturas (solo el día y
   el número) y el carril sigue funcionando con las tareas. El carril **no** puede
   depender de que haya pronóstico.

### Lo que se conserva

- El motor: `derivarTareas` / `tareasVisibles` / `useEstadoTareas` con
  `completar` y `posponer`. Sigue siendo la única fuente de tareas, compartida
  con Mi huerta.
- `Hecho` con el festejo `brotar` (700 ms) y `Más tarde`. En el carril, `Hecho`
  es un botón de píldora en la fila; **`Más tarde` pasa a un menú de la fila**
  (long-press o `⋯`) porque dos botones no entran en 340 px de ancho. No se
  elimina: posponer es la válvula de escape de una app que manda.
- La línea de procedencia (`t.fuente`) debajo de cada tarea. Es la que sostiene
  el tono de la app: dice de dónde sale lo que pide.
- El link de la tarea a `/huerta/:plantaId` cuando la tarea es de una planta.
- Estados vacíos: sin plantas, `EmptyState`; con plantas y sin tareas, el texto
  de "nada urgente hoy" pasa a ser el estado de un carril con siete `—`, más
  el bloque de "Sembrá ahora".

---

## 2. Explorar — el año como anillo

**Hoy:** `EspecieCard` muestra nombre + 3 íconos + `MonthStrip`, una tira lineal
de 12 meses × 3 décadas. Los filtros viven en `explorar__controles`: buscador,
chip "Se siembra ahora", chip "Filtros (n)" que despliega un panel con tres
`FilaChips` (Grupo / Suelo / Luz).

**El rediseño** reemplaza la tira por el `AnilloAnual` de 56 px (ver `01`,
sección 5.1) y deja los tres filtros de categoría siempre a la vista como chips
en línea, sin panel desplegable.

### Lo que hay que agregar

1. **`AnilloAnual` con la aguja en la década de hoy.** El dato ya está:
   `decadaDe(hoy)` y `estadosDelMes(especie, mes, zona, 'siembra')`. Lo que
   cambia es la proyección: 36 décadas a 10° cada una. Conviene una función pura
   `decadasDelAnio(especie, zona): EstadoMes[36]` en `src/lib/data/especies.ts`,
   que es lo que consumen el anillo chico y el grande.
2. **Barras de mes dentro del anillo.** No es decoración: sin ellas el anillo no
   se puede leer. Detalle exacto en `01`, sección 5.1.
3. **El mes en el centro.** El anillo chico lleva la abreviatura del mes actual
   en el hueco (`MES_CORTO[mes]`), que es la referencia que ancla la aguja.
4. **Filtros en línea.** Los tres `FilaChips` se colapsan a tres chips
   ("Grupo", "Suelo", "Luz") que abren cada uno su propia hoja de opciones. El
   contador de filtros activos y `Limpiar` se conservan.

### Lo que se conserva

- Toda la lógica de `resultados`: búsqueda normalizada sobre `textoBusqueda`,
  `indice.padres` sin búsqueda e `indice.todas` con texto (las variedades
  aparecen solo cuando se busca), y los filtros `soloAhora` / grupo / suelo / luz.
- La cuenta `N de 55 especies` con `aria-live="polite"`.
- El estado `ideal` con `diasHastaCierre` → `quedan N días` / `último día`, y
  `posible` → `se puede`.
- El contador de variedades y el link a `/explorar/:slug`.

---

## 3. Mi huerta — de barra de etapas a gantt del ciclo

Es el cambio funcional más grande.

**Hoy:** `MiHuerta.tsx` agrupa por ubicación, la tarjeta arranca **plegada** y al
abrirla muestra `<CycleProgress>` (las 5 etapas de `ETAPAS`) más una línea de
hito de `estimar()` o de `germinacion()`.

**El rediseño:** cada planta es una fila de gantt siempre visible, con su ciclo
proyectado sobre una ventana de 180 días (−60 a +120) y la línea de hoy. El
`CycleProgress` de 5 etapas no desaparece: se mueve al **detalle de planta**,
donde tiene lugar para las etiquetas.

### Lo que hay que agregar

1. **Ventanas completas en `estimar()`.** Hoy `estimar(planta, especie)` devuelve
   el **próximo** hito (`est.proximo` con `titulo`, `enVentana`, y `textoHito()`).
   El gantt necesita los tramos, en días relativos a hoy:

   ```ts
   interface Ventanas {
     /** [desde, hasta] en días desde hoy; negativo = pasado */
     trasplante?: [number, number]
     cosecha: [number, number]
     /** día de la siembra, siempre ≤ 0 */
     siembra: number
   }
   ```

   Sale de los mismos datos con que hoy se calcula `proximo`: días de almácigo
   de la especie, días a cosecha, y el corrimiento por germinación tardía que ya
   aplica `germinacion()`. **Que sea una función pura y testeada**: es la que
   dibuja, y un error de tres días acá se ve como una barra corrida.

2. **Corrimiento por germinación.** Si la planta germinó más tarde que el plazo
   de la ficha (el caso de "Los del cajón": 6 días), todas las ventanas
   posteriores se corren ese delta. Hoy eso ya está implícito en `estimar`;
   ahora tiene que ser explícito y visible: el detalle de planta lo enuncia
   ("corrido 6 días porque asomó tarde") y el gantt lo refleja.

3. **Siembra directa.** Cuando `planta.metodo` es `directa` o `plantacion` no hay
   ventana de trasplante: la barra de crecer va directo a la de cosecha. El
   prototipo lo muestra en Lechuga, Rúcula y Zanahoria.

4. **El eje en meses.** Siete etiquetas cada 30 días con el nombre del mes
   calculado desde hoy (no fijas: `jul…ene` es lo que corresponde a septiembre).
   Va una sola vez por grupo de ubicación.

5. **Las filas ya no se plegan.** El gantt cerrado no tiene sentido: la fila
   entera mide 74 px, que es menos que la tarjeta plegada de hoy más su detalle.
   El plegado **de ubicación** se conserva (`plegado.ubicacionesCerradas` y
   `alternarUbicacion`); `plegado.plantasAbiertas` y `alternarPlanta` quedan sin
   uso — dejalos en el módulo y podá el estado guardado, no rompas los backups.

### Lo que se conserva

- El agrupado por ubicación con el nombre, el detalle (`maceta · media sombra ·
  resguardada`) y la cuenta, más el lápiz para editar la ubicación.
- La cuenta de pendientes por planta salida del **mismo motor** que Hoy
  (`derivarTareas` + `tareasVisibles` + `estadoTareas`), con el triangulito que
  lleva el número como texto. Eso no se toca: es lo que evita que las dos
  pantallas digan cosas distintas de la misma planta.
- El texto de germinación tal cual (`textoGerminacion`, con "Hace 12 días que
  debería haber asomado") como hito de la fila.
- El link al detalle (`/huerta/:id`) desde el nombre.
- `resumenHuerta(activas)` como sobretítulo, `cantidadCorta(planta)` como `~4`,
  y el orden por fecha de siembra descendente.
- El `EmptyState` y el CTA de sumar planta.

---

## 4. Ficha de especie

`FichaEspecie.tsx` + `DatoSection.tsx` + `ConfidenceBadge.tsx` ya existen. El
rediseño fija cómo se presentan:

1. **Los 13 campos del catálogo, en el orden del prototipo**: cuándo sembrar,
   cómo sembrar, trasplante, germinación, cosecha, suelo, luz, riego y maceta,
   ciclo de vida, todos los trucos, riesgos, plagas, asociaciones. Cada uno con
   su índice de confianza y sus fuentes.
2. **Confianza como fila de 10 puntos** (`01`, sección 5.4), no como pastilla.
   `s/d` cuando el campo no tiene dato: el caso de riego y maceta, que se enuncia
   como "todavía no encontramos fuentes que digan…" en vez de esconderse. Ese
   estado vacío honesto es parte del producto.
3. **Fuentes como chips enlazados** al PDF del organismo (INTA, UNLu, UNIDA,
   FIQ-UNL, Fecoagro). Son `<a target="_blank" rel="noreferrer">`.
4. **Anillo doble**: siembra afuera, trasplante adentro, con las iniciales de los
   meses y la aguja de hoy. La leyenda al lado explica los cuatro estados
   (ideal, se puede, trasplante, trasplante posible).
5. **Aviso de reparo**: cuando `necesitaProteccion(especie, mes)` es verdadero en
   el mes en curso, un bloque `--sol` arriba de los campos, con el ícono
   `protegido` y el texto de almácigo protegido. Hoy eso es una cupulita en la
   tira de meses; se convierte en una recomendación en palabras.
6. **Escala térmica** para los umbrales de germinación de la ficha (mínimo,
   óptimo, máximo) como una barra con los tres puntos marcados.
7. **Asociaciones** en dos listas de chips, buenas y malas, con el motivo cuando
   la fuente lo da ("Papa · comparten tizón").

---

## 5. Detalle de planta

`DetallePlanta.tsx` + `BloqueGerminacion.tsx`. El rediseño lo ordena así, de
arriba a abajo:

1. **Ciclo de 5 etapas** horizontal (el `CycleProgress` que sale de Mi huerta),
   con la etapa actual rellena en `--sol` y las etapas omitidas por siembra
   directa en borde punteado.
2. **Germinación con el corrimiento explicado**: cuántos días declaraba la ficha,
   cuántos tardó, y qué se corrió como consecuencia.
3. **Datos de la siembra**: fecha, método, cantidad a ojo, lugar.
4. **Ventana de trasplante** con el hito y el botón de acción primaria
   (`--sol`, 52 px), más una acción secundaria de contorno para anotar la
   cantidad.
5. **Diario** como línea de tiempo: punto del color del tipo de entrada
   (`TIPOS_ENTRADA` ya define el color de cada uno), fecha, texto y foto cuando
   hay. Los tipos y colores se conservan; en tema noche usan `--frambuesa`,
   `--agua`, `--verde-hoja`, `--terracota`, `--sol` de la tabla del tema.

---

## 6. Cosas transversales

- **Tema.** Un control en Ajustes (`Día` / `Noche` / `Automático`), persistido en
  `localStorage`, aplicado antes del primer paint. Detalle en `01`, sección 2.
- **Nada de red nueva.** El catálogo sigue siendo el JSON local y la huerta sigue
  en IndexedDB, sin cuenta ni servidor. El único fetch externo sigue siendo
  Open-Meteo para el pronóstico.
- **El backup no cambia de versión.** Ninguno de estos cambios agrega campos a
  `Planta`, `Ubicacion` o `EntradaDiario`: todo lo nuevo es derivado. Si algo te
  obliga a guardar un campo, paralo y consultalo — probablemente se pueda
  calcular.
- **Tests.** Las funciones nuevas (`decadasDelAnio`, `marcas`, `pct`, las
  `Ventanas` de `estimar`) son puras y van con test unitario. `e2e/accesibilidad.
  spec.ts` corre dos veces, una por tema, sobre las 7 pantallas con datos
  cargados.
- **Calendario, Glosario y Ajustes** no están diseñados. Aplicá tokens y patrones;
  si hace falta layout nuevo, consultá antes de inventarlo.

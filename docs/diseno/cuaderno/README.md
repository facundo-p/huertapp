# Cuaderno de huerta — propuesta visual

Un render, no código de la app. Muestra cómo se vería Huerta GBA si se sintiera
como un cuaderno de anotaciones, y cómo se vería «Mi huerta» como un croquis de
la huerta real en vez de una lista.

**Abrilo:** `cuaderno-referencia.html`, con doble clic. Es un solo archivo, con
las fuentes adentro: anda sin red. Arriba hay dos conmutadores, **Día / Noche**
y **títulos manuscritos / redondeados** (la manuscrita es la decisión más de
gusto de toda la propuesta, y conviene compararla en el momento). Las casillas,
los días de la semana y el croquis responden.

Los datos son los de la huerta de ejemplo (`src/lib/huerta/demo.ts`) el jueves
24 de septiembre, y las tareas son las que el motor le da ese día, con los
textos tal cual los arman `src/lib/tareas/engine.ts`, `compost.ts` y
`src/lib/pronostico/derivar.ts`. El pronóstico (helada el martes, lluvia el
domingo) es inventado para mostrar los avisos.

## Por qué

La dirección «Cantero» (v2.0.0, `docs/diseno/cantero/`) dejó la app prolija,
pero no cálida. El brief pedía «cuaderno de campo bonito, no corporativo».
Leído en el código, lo que enfría es:

- **Unbounded**, una display geométrica, con sobretítulos en mayúsculas
  espaciadas y etiquetas de navegación de 9 px: se lee como panel de control.
- Nada hecho a mano. Los dibujos aparecen sólo cuando no hay datos.
- **«Esta semana» está saturada por construcción**: siete filas siempre
  visibles (los días vacíos con «—»), hasta siete elementos por tarea y nueve
  tamaños de letra en la misma pantalla.
- **Mi huerta** es un gantt: responde «cuándo», nunca «dónde».

## La dirección

**Letra.** Caveat, la manuscrita, **sólo en títulos y rótulos de pocas
palabras, de 21 px para arriba**: la fecha de cabecera, los títulos de pantalla
y de sección, el número del día en la tira, el título del post-it y el nombre
de cada lugar en el croquis. Todo lo que se lee de corrido va en Nunito, la
redonda: detalles, fuentes, el diario, las fechas chicas, los nombres de las
plantas en el croquis y los avisos. La manuscrita chica cuesta leerla, y la
calidez ya la ponen los títulos. Por pantalla, tres tamaños de manuscrita y
tres de redonda (16, 14 y 12). Unbounded sale.
Nunito ya está en `package.json` sin usarse; Caveat se sumaría igual que las
otras, self-hosted y en subset latin.

**Papel.** Renglones cada 28 px sólo en las listas que son «páginas», con el
texto apoyado sobre la línea, y un margen terracota a la izquierda.

**Papel reciclado de fondo**, muy leve y sobre todo de día. Una tesela de
256 × 256 con tres capas: nubes (el papel que no es parejo), fibras cortas y
motas. Está en `papel-reciclado-dia.svg` y `papel-reciclado-noche.svg`, para
`body::before`, donde hoy vive el grano, con `--grano-fuerza` en 1: la tesela ya
trae su intensidad, y con el 0,02 de hoy quedaría invisible.

La regla que la hace posible: **de día, ninguna mancha es más oscura que el
papel.** El grano negro de día tiene techo en 0,021 (`src/theme.css`), porque
oscurecer el papel le baja el contraste a `--tinta-tenue` y a `--tinta-suave`.
La textura se ve por tono y por claridad, con colores como `#fffdf6`, `#eef6fb`,
`#fff2f0` y `#fff4cf`, todos igual de claros o más que el papel: no le cobra
contraste a ningún texto. De noche es al revés, nada más claro que el papel,
porque ahí el texto es el claro. El grano negro de siempre sigue, con nubes y
fibras apenas más oscuras. Se verificó color por color, en los dos temas, al
armar el render.

**Cosas hechas a mano, con función:**

| Pieza | Qué hace |
|---|---|
| Casilla dibujada | Es «Hecho», con 44 px de target. Tildada, la tarea se tacha. |
| Post-it | Lo único que se destaca en la pantalla: los avisos que piden proteger algo. Tocarlo lleva el scroll a ese día, y el post-it se queda donde está. |
| Pestañas de separador | La barra de navegación, con la misma altura que hoy (59 + zona segura). La activa se une a la página. |
| Sello | Un hito cumplido («3 al balcón», «cosechada»). |
| Cinta | Pega las fotos del diario. |
| Plantitas | 19 dibujos: 6 grupos × 3 etapas (brote, creciendo, dando), más la semilla que no asomó. La etapa y la semilla dicen algo, así que van al Glosario; el grupo no, porque la especie va siempre en el nombre. |

**Color.** La paleta no cambia: está calibrada AA en los dos temas y está bien.
Cambia el uso: menos tinte a sangre, más papel, el ocre vuelve a ser sólo
«acá estás». Los tokens nuevos están abajo.

## Esta semana, des-saturada

- Cabecera manuscrita con la fecha y el tiempo de hoy en una línea.
- **Tira de la semana** en vez de siete filas: sigla, número, cielo, y un
  puntito por tarea (el aviso va con su propio ícono: copo, gota). Hoy dice
  «hoy» en lugar de la sigla.
- **La semana entera se lee scrolleando.** Cada día es una sección de la misma
  página («Para hoy», «Viernes 25»…). Un día sin nada ocupa un renglón: «Nada
  anotado · 21° · 9° · despejado». Después del último día la página sigue con
  renglones vacíos, para que el último también pueda llegar arriba.
- **La tira queda pegada arriba y el día redondeado es el que estás
  leyendo**: cambia solo al scrollear. Tocar un día lleva el scroll ahí y el
  foco a su título, para que el lector de pantalla lo anuncie; mientras dura
  el scroll suave, el seguimiento no le discute el día. El día leído va con
  `aria-current`.
- **La lista del día**: casilla, título y una línea corta. La línea dice dónde
  (el lugar) o cuánto (lo atrasado). El detalle y la fuente, con su confianza,
  se abren al tocar la tarea, y ahí también están «Más tarde» y «Asomó». La
  regla de decir de dónde sale cada consejo se cumple igual, a un toque.
- **Post-it** arriba, con el resumen. Tocarlo lleva el scroll a su día, donde
  está el aviso entero con su fuente, y el post-it no desaparece.
- **Para sembrar ahora**, como nota al margen después de hoy: cuatro nombres
  con «+» y «ver las 31».

### Más de un post-it

- Post-it sólo para lo que pide proteger algo: helada y calor. La lluvia es
  un ahorro, no un peligro: va en su día y en la tira, con su gota.
- Uno por tipo, no por día. Dos heladas en la semana son un solo post-it,
  «Puede helar el martes y el miércoles», y lleva al primero.
- Si coinciden helada y calor, se apilan en el orden de gravedad de
  `derivarAvisos` (la helada arriba). El de abajo asoma con su título, y cada
  uno lleva a su día. Como son dos tipos, nunca hay más de dos.

## Mi huerta como croquis

**¿Pixel art? No.** Choca con el trazo 1,75 de todos los íconos y dibujos, no
se tiñe con `currentColor` en los dos temas y pediría un sprite por especie. Lo
que encaja con el cuaderno es un croquis a lápiz visto desde arriba, sobre hoja
cuadriculada. La cuadrícula del papel es la misma grilla en la que se acomodan
las plantas, así que el dibujo y la interacción coinciden.

**Va arriba de la lista, no en vez de ella.** El croquis responde «dónde está
cada cosa y qué pide atención». La lista con el gantt, que ya existe, responde
«cuándo». Se pliega igual que un lugar.

### Nivel 0: sale solo de lo que ya está cargado

Una grilla gruesa por lugar, según su clase (`lugarDe`, `src/lib/huerta/lugar.ts`):

| Clase | Grilla | Una planta ocupa |
|---|---|---|
| almaciguera | 6 columnas a página entera × ⌈capacidad / 6⌉ filas. Con 6 celdas o menos, 3 columnas a media página | `ocupa ?? 1` celdas seguidas |
| macetas | 3 × ⌈N / 3⌉ a media página (N = capacidad, o las plantas si no hay). Con más de 6, 6 columnas a página entera. La maceta arriba y el nombre abajo | `ocupa ?? 1` macetas |
| bancal en surcos | Un surco por fila, 44 px de alto, a media página. Con más de 4 surcos, página entera | `ocupa ?? 1` surcos |
| bancal libre | 6 columnas a página entera × filas según largo / ancho (acotado entre 1,3 y 2,5). Sin medidas, 6 × 3 | ⌈superficie / m² por celda⌉, mínimo 1, redondeando antes a 6 decimales: en coma flotante 1,12 / 0,16 da 7,000…1 y `Math.ceil` devuelve 8 |
| bancal sin disposición cargada | como «otro»: no promete surcos que nadie declaró (`lugar.ts`) | 1 celda |
| otro, o sin lugar | 3 columnas, una celda por planta | 1 celda |

- Paso de celda: `clamp(ancho / columnas, 44, 56)` px. Ningún target baja de
  44 ni se solapa.
- Si lo sembrado pide más celdas que las que hay, primero cada planta recibe
  una y después se reparten las que quedan, en orden. Si ni una por planta
  alcanza (30 plantas en un bancal de 6 × 3), la grilla suma filas: el croquis
  deja de estar a escala antes que dejar una planta sin enlace ni banderita.
- Las columnas de macetas y almaciguera cambian con la capacidad (3 o 6). Por
  eso se fijan en `plano.cols` la primera vez que se acomoda el lugar: después,
  si cambia la capacidad, cambian las filas y no el ancho, y `celdas` no se
  corre.
- Orden de las plantas: `sembrada` ascendente, con el `id` de desempate (sin
  él, dos siembras del mismo día se reordenan solas, el bug que ya resolvió
  `agruparPorLugar`). Una siembra nueva va al final y no corre a las demás. Un
  bloque no se corta entre filas si entra entero en la siguiente.
- Los lugares van en dos columnas: los de media página de a dos y los de
  página entera solos. Si a uno de media le sigue uno entero, sube el próximo
  de media a llenar el hueco. Se empaqueta en el orden de los datos, no con
  `grid-auto-flow: dense`, que deja el foco saltando para arriba. El orden de
  base es el de `agruparPorLugar` (o `plano.orden`), y la lista de abajo usa
  el mismo empaquetado: el orden a la vista, el del foco y el de la lista son
  uno solo.
- Sin capacidad no se dibujan celdas vacías (la misma regla que el medidor).
  Las composteras no van en el croquis.
- En la demo: el Bancal del fondo mide 120 × 240, son 6 × 3 celdas de 0,16 m².
  La lechuga (0,8 m²) ocupa 5, la rúcula y la zanahoria (0,6 m²) 4 cada una.

### Nivel 1: acomodar, si querés

Dos campos opcionales en `src/lib/huerta/tipos.ts`. Viajan en el backup sin
subir de versión, igual que los otros campos aditivos
(`tests/huerta.test.ts`):

```ts
// Planta
celdas?: { col: number; fila: number }[]   // las celdas que ocupa en la grilla de su lugar
// Ubicacion
plano?: { orden?: number; cols?: number } // antes o después en la hoja; el ancho de su grilla
```

Por celda, no por bloque. Así el croquis puede decir lo que hoy sólo dice la
nota de la demo: «rúcula intercalada entre las lechugas», «zanahoria en
manchones sueltos». En una huerta agroecológica intercalar es lo común.

Columna y fila, no un índice plano (se desordena si cambia la capacidad) ni una
posición libre x/y (no existe en celdas, macetas ni surcos). Cuando los datos no
cierran, se ordena de izquierda a derecha y de arriba abajo:

- Sobran celdas (porque bajó `ocupa`, la superficie o raleaste): se quedan las
  primeras.
- Faltan: se completa con las primeras libres.
- Una celda que quedó fuera de la grilla se descarta, y se completa igual.
- Si dos plantas quieren la misma celda, gana la siembra más vieja; a igual
  fecha, el `id` menor.
- Trasplantar, dividir la tanda o borrar el lugar limpian el campo.
- Sin los campos, el nivel 0 exacto.

**«Acomodar» se hace tocando, nunca arrastrando.**

- Tocás una o varias celdas con plantas y quedan elegidas. Tocar otra vez
  una elegida la saca.
- Las celdas libres donde entra lo elegido llevan una marca «+». Tocás una: la
  primera elegida va ahí y las demás la siguen con la misma forma. Con más de
  una elegida, la primera lleva un «1».
- Si no entra, la barra dice por qué («se sale del lugar», «pisa la
  lechuga»).
- Una barra abajo dice qué elegiste y ofrece «Toda la rúcula» (elige todas
  las de esa planta), «Intercambiar» (con dos celdas de plantas distintas, para
  cuando no queda lugar libre) y «Soltar».
- Tocás dos nombres de lugar y se cambian de orden en la hoja.

Elegir una sola celda es mover por celda; elegir toda la planta es mover el
grupo. Así no pelea con el scroll, y anda con teclado y lector de pantalla:
cada celda es un botón con `aria-pressed`, y la barra es `aria-live`. Pasar
plantas a otro lugar sigue siendo «Trasplantar»: cambia `ubicacionId`, no es
acomodar el dibujo.

### Marcas

- **Nombre** abajo de cada manchón (celdas vecinas de la misma planta),
  centrado en su primera fila. Si no entra en ese ancho se corta con «…», y el
  nombre entero sigue en el nombre accesible y en la lista. Con plantas
  intercaladas dos hojas se dibujan igual: el nombre es lo que las distingue.
- **Etapa** del dibujo: la semilla mientras `germinacionPendiente`; brote en
  almácigo y ya asomada; creciendo si está trasplantada o creciendo; dando si
  está cosechando. Las terminadas no se dibujan.
- **Banderita** con el número de `pendientes` (el mismo de `GanttPlanta`),
  adentro de la primera celda de la planta, arriba a la derecha, sin asomar
  sobre la celda de arriba. Si hay algo atrasado es terracota y lleva un «!»
  después del número. La forma dice lo mismo que el color, también con
  `prefers-reduced-motion`, cuando se apaga el `pulso`.
- **Copo** en las plantas de `expuestasAHelada` mientras haya helada en la
  semana (tarea o aviso), en la primera celda.
- El tipo de tarea va en el nombre accesible, no en el dibujo.
- Van al Glosario, como todo ícono con significado: la banderita, la atrasada,
  el copo, la semilla y las tres etapas.

### Estructura accesible

El DOM ya es la lista equivalente: la sección con su encabezado plegable; un
`article` por lugar con su encabezado y la ocupación en texto
(`sr-solo`); cada planta un `<a>` de 44 × 44 o más, con nombre como «Zanahoria ·
todavía no asomó · 1 para atender, atrasada: fijate si asomó». El SVG sólo
dibuja papel y plantas. La identidad y la atención van en HTML, que es lo que
recorre el lector de pantalla y lo que mide `e2e/accesibilidad.spec.ts`
(`button, a[href]`, 44 px).

### Riesgos anotados

- Los e2e que buscan una planta por nombre van a encontrar dos enlaces (croquis
  y lista): acotarlos por sección.
- `--papel-alto` de noche es semitransparente: el croquis usa `--hoja-cuadros`
  y `--papel-opaco`, que son opacos.
- `e2e/accesibilidad.spec.ts` compone sólo `backgroundColor`, y el renglón es
  un `background-image`: el test no lo ve. Hasta que lo mida, la regla va a
  mano: **sobre un renglón no va texto en `--tinta-tenue`** (ver la tabla de
  contrastes). `GanttPlanta` y `TarjetaLugar` lo usan a 11 px: si la lista por
  lugar pasa a ser página con renglones, esos textos pasan a `--tinta-suave`.
- Sin `<filter>` por viñeta: el grano ya está en `body::before`.

## Qué no cambia

- **El motor de tareas**: el croquis y la semana leen lo que ya calcula.
- **El backup**: los dos campos son opcionales y aditivos, sin subir de versión.
- **El catálogo** y todo el pipeline de datos.
- La paleta, el contraste AA en los dos temas, los targets de 44 px y la
  gramática de trazo 1,75.

## Tokens nuevos

Lo que no está en esta tabla sale de `src/theme.css`.

| Token | Día | Noche | Para qué |
|---|---|---|---|
| `--renglon` | `rgba(79,127,149,.16)` | `rgba(127,176,200,.15)` | renglones. Tiene techo, ver abajo |
| `--margen` | `rgba(161,88,61,.5)` | `rgba(212,145,122,.45)` | línea de margen |
| `--cuadro` / `--cuadro-fuerte` | `.13` / `.3` de `--agua` | `.10` / `.22` de `--agua` | cuadriculado del croquis |
| `--hoja-cuadros` | `#fffdf5` | `#243021` | fondo de la hoja cuadriculada |
| `--postit` | `#f3d98b` | `#e6c872` | el post-it es papel amarillo en los dos temas |
| `--sobre-postit` / `-suave` | `#2a2110` / `#5a4a1e` | igual | texto del post-it |
| `--cinta` | `rgba(222,208,168,.8)` | `rgba(214,202,166,.42)` | cinta de las fotos y del croquis |
| `--bandera` / `--bandera-atrasada` | `--sol` / `--terracota` | igual | banderita de atención |
| `--sobre-bandera` / `--sobre-bandera-atrasada` | `#2a2110` / `#fffdf5` | `#2a2110` / `#2a2110` | el número de la banderita |
| `--papel-opaco` | `#fffdf5` | `#222e1f` | lo que no puede transparentar: la barra de Acomodar, la almaciguera, el copo |
| `--sobre-salvia` | `#fffdf5` | `#1f2a1c` | texto del botón lleno («Asomó»). Con `--papel` de día da 4,87; con éste, 5,3 |
| `--foto-borde` | `#fbfaf4` | `#e7e2d2` | el borde blanco de las fotos del diario |
| pestañas | `color-mix(<token> 20 %, --papel)` | igual | una pestaña por sección: sol, verde, agua, terracota, oliva |
| papel reciclado | `papel-reciclado-dia.svg`, nada más oscuro que `--papel` | `papel-reciclado-noche.svg`, nada más claro | fondo, en lugar del grano |

Contrastes medidos (WCAG, texto):

| Par | Día | Noche |
|---|---|---|
| texto del post-it | 11,4 | 9,7 |
| texto suave del post-it | 6,2 | 5,3 |
| número de la banderita | 5,3 | 7,3 |
| número de la banderita atrasada | 5,2 | 6,1 |
| rótulo de pestaña sobre su tinte (el peor de los cinco) | 5,8 | 6,3 |
| texto del botón lleno (`--sobre-salvia` sobre `--salvia`) | 5,3 | 8,5 |
| `--tinta-suave` justo encima de un renglón | 4,68 | 6,0 |
| `--tinta-tenue` justo encima de un renglón | **3,86, no pasa** | **4,10, no pasa** |

El renglón de día es el que manda: a 0,2 de opacidad la línea bajaba
`--tinta-suave` a 4,46 y no pasaba AA. Con 0,16 queda en 4,68. `--tinta-tenue`
no pasa en ningún tema, así que sobre un renglón no va.

## Cómo seguir

Si la dirección gusta, un epic con una issue por pantalla, como se hizo con
«Cantero»: primero tokens, letra y pestañas; después «Esta semana»; después el
croquis, que es lo único que toca el modelo (los dos campos opcionales).

## Capturas

Con el hash el render muestra un solo teléfono, sin marco, a 390 × 844:
`#hoy-dia`, `#croquis-noche`, `#acomodar-dia`, `#planta-noche`, `#piezas-dia`,
y con `-redondos` al final, con los títulos redondeados. Por ejemplo, con
Playwright:

```ts
await page.setViewportSize({ width: 390, height: 844 })
await page.goto('file:///…/docs/diseno/cuaderno/cuaderno-referencia.html#hoy-noche')
await page.screenshot({ path: 'hoy-noche.png' })
```

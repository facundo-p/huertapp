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
domingo) es inventado para mostrar los avisos. El ciclo del tomate sigue lo que
la demo quiere contar (asomó el 18/9, seis días tarde); hoy `demo.ts` pisa esa
fecha al dividir la tanda, y el motor da asomó 10/9 sin corrimiento. Es un bug
de la demo: #151. El mismo bug deja a la rúcula sin la fecha en que asomó:
`cambiarCantidad` (`demo.ts:197`) guarda la planta como estaba antes de
`marcarGerminada`. Con la demo tal cual, el motor suma «Rúcula: fijate si
asomó», atrasada, y el croquis la dibujaría como semilla con banderita «2 !».
El render la muestra asomada hace 25 días, que es lo que la demo quiere contar.

Y una sola fuente no sale tal cual: la del corralito, porque `compost.ts`
(~línea 52) arma «según la guía: A los 3 meses… FAO, 3 a 6. ·»,
con mayúscula y punto; el render la muestra como la arma la línea 35 del mismo
archivo, en minúscula y sin punto. Es parte de la propuesta.

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
tres de redonda (16, 14 y 12). Salen Unbounded y también Manrope, la del cuerpo
de hoy (`--font-cuerpo`): todo lo que se lee va en Nunito, que ya está en
`package.json` sin usarse. Las dos que salen se van también del precache.
Caveat se sumaría igual que las otras, self-hosted y en subset latin.

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
La textura se ve por tono y por claridad, con colores como `#fffdf6`, `#f9fbff`,
`#fff5f0` y `#fff8e9`. Tienen **cada canal** dos unidades o más por encima del
papel, y no sólo la luminancia: el borde de una fibra se mezcla con el papel, y
si un canal baja, la mezcla puede quedar más oscura que los dos. De noche es al
revés, cada canal por debajo, porque ahí el texto es el claro. El grano negro
de siempre sigue, con nubes y fibras apenas más oscuras.

Dos trampas medidas sobre la tesela dibujada, píxel por píxel:
- los filtros de las nubes llevan `color-interpolation-filters="sRGB"`: por
  defecto interpolan en linearRGB, y de noche la mitad de los píxeles salía
  más clara que el papel;
- de noche hay que medir el píxel **más claro**, no el más oscuro (el que mira
  `e2e/textura.spec.ts`).

Medido así sobre la tesela sola, de noche ningún píxel cruza y de día unos
pocos, por una unidad. Compuesta en la página cruzan más (de día ~1,4 %,
alguno por dos unidades; de noche menos de 0,1 %, por una): es redondeo en el
borde de nubes y fibras, y no le mueve ningún contraste a la tabla.

**Cosas hechas a mano, con función:**

| Pieza | Qué hace |
|---|---|
| Casilla dibujada | Es «Hecho», o «Asomó» en la tarea de germinación, como en `CarrilSemana`, con 44 px de target. Tildada, la tarea se tacha y brota una hojita, y a los 700 ms se va, como hoy en la app: tildar es definitivo, porque girar el compost pisa la fecha anterior y «Asomó» escribe `germino`. En el render no se va, para poder destildarla y probarla de nuevo, y la tira no recuenta. |
| Post-it | Lo único que se destaca en la pantalla: los avisos que piden proteger algo. Qué hace al tocarlo, en la lista de abajo; cuántos hay, en «Más de un post-it». |
| Pestañas de separador | La barra de navegación, con la misma altura que hoy (59 + zona segura). La activa se une a la página. |
| Sello | Un hito cumplido («3 al balcón», «cosechada»). |
| Cinta | Pega las fotos del diario. |
| Plantitas | 19 dibujos: 6 grupos × 3 etapas (brote, creciendo, dando), más la semilla que no asomó. La especie y la etapa van siempre en el nombre accesible. Si la etapa es ícono o dibujo está por decidir: ver «Marcas». |

**Color.** La paleta no cambia: está calibrada AA en los dos temas y está bien.
Cambia el uso: menos tinte a sangre, más papel, y el ocre vuelve a ser, sobre
todo, atención: «acá estás» (el día que leés, el hoy del ciclo, el subrayado de
la pestaña activa), la banderita de algo para hacer y el termómetro del calor,
como en el carril de hoy. Fuera de eso sólo tiñe la pestaña de «Esta semana»
(cada sección tiene la suya), el sol del pronóstico (`--cielo-sol`, como hoy
en `src/icons/clima.tsx`) y detalles de los dibujos, como raíces y pétalos.
Lo que se cierra («última semana») no es atención sino urgencia: va en
terracota, como `.es-cierra` en `Hoy.css`. El post-it no es ocre: es papel
amarillo, con su token. Lo elegido en «Acomodar» va en tinta. Los tokens nuevos
están abajo.

## Esta semana, des-saturada

- Cabecera manuscrita con la fecha y el tiempo de hoy en una línea.
- **Tira de la semana** en vez de siete filas: sigla, número, cielo y hasta
  tres marcas. Primero los avisos con su ícono (copo, gota, y el termómetro
  del calor en `--sol-texto`, como en el carril de hoy), después un punto por
  tarea; con más de tres, la tercera es «+N». Las columnas van en
  `minmax(0, 1fr)`: con `1fr` a secas, un día cargado se ensanchaba y los
  vecinos bajaban de 44 px. Hoy dice «hoy» en lugar de la sigla. Ancho mínimo,
  340 px, el que ya asume `Hoy.tsx`: a 320 un día baja de 44.
- **La semana entera se lee scrolleando.** Cada día es una sección de la misma
  página («Para hoy», «Viernes 25»…). Un día sin nada ocupa un renglón: «Nada
  anotado · 21° · 9° · despejado». Después del último día la página sigue con
  renglones vacíos, para que el último también pueda llegar arriba.
- **La tira queda pegada arriba y el día redondeado es el que estás
  leyendo**: cambia solo al scrollear. Tocar un día lleva el scroll ahí y el
  foco a su título, para que el lector de pantalla lo anuncie; mientras dura
  el scroll suave, el seguimiento no le discute el día, y al terminar
  (`scrollend` o 900 ms, lo que llegue primero) recalcula. El día leído
  va con `aria-current`.
- Al scrollear, la tira **no se rearma**: se mueven `aria-current` y el
  círculo sobre los botones que ya están. Rearmarla con `innerHTML` le saca el
  foco a quien la usa con teclado.
- La tira y la barra de «Acomodar» son pegajosas: la hoja lleva
  `scroll-padding-top` y `scroll-padding-bottom` con su alto, para que el foco
  nunca quede tapado (WCAG 2.4.11).
- **La lista del día**: casilla, título y una línea corta. La línea dice dónde
  (el lugar) o cuánto (lo atrasado). El detalle y la fuente, con su confianza,
  se abren al tocar la tarea, y ahí también está «Más tarde». En la de
  germinación la casilla es «Asomó» y escribe `germino`, no `completadas`; en
  el detalle queda «Todavía no asomó», el rótulo que ya usa `Hoy.tsx`. La regla
  de decir de dónde sale cada consejo se cumple igual, a un toque.
- Hoy el cuerpo de la tarea lleva a su planta o compostera. Acá abre el
  detalle, así que el camino pasa ahí: «Ver la zanahoria», «Ver el Corralito
  del fondo». El render dibuja una sola página de planta, la de Los del cajón,
  y a ésa lleva cualquier «Ver» de planta; el de compostera se queda en Esta
  semana, porque no está dibujada.
- **Post-it** arriba, con el resumen. Tocarlo lleva el scroll a su día, donde
  está el aviso entero con su fuente. No se descarta: vuelve a verse al subir.
- **Para sembrar ahora**, como nota al margen después de hoy: cuatro nombres
  con «+» y «Ver todas en Explorar». Cada nombre lleva a su ficha, como en
  `Hoy.tsx`. No lleva número porque cada lugar cuenta distinto: hoy la app
  lista 12 (el tope por defecto de `paraSembrarAhora`), sin tope son 31
  contando variedades, y el filtro «Ahora» de Explorar muestra 37 especies, 29
  ideales y 8 posibles.

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
| almaciguera | 6 columnas a página entera × ⌈N / 6⌉ filas. Con N de 6 o menos, 3 columnas a media página | `ocupa ?? 1` celdas seguidas |
| macetas | 3 × ⌈N / 3⌉ a media página. Con N de más de 6, 6 columnas a página entera. La maceta arriba y el nombre abajo | `ocupa ?? 1` macetas |
| bancal en surcos | N surcos, uno por fila, 44 px de alto, a media página. Con más de 4, página entera | `ocupa ?? 1` surcos |
| bancal libre | 6 columnas a página entera, a lo largo del lado mayor; filas = `Math.round(6 / proporción)`, con proporción = lado mayor / lado menor, acotada entre 1,3 y 2,5. Sin medidas pero con `capacidad` en m², 6 × 3. m² por celda = la superficie del lugar / las celdas, con la misma cuenta que el medidor (`superficieDe`, en `lugar.ts`: primero la capacidad, si no las medidas redondeadas a un decimal; hoy no se exporta). Sin ninguna de las dos, como «otro» | ⌈superficie / m² por celda⌉, mínimo 1, redondeando antes a 6 decimales: en coma flotante 1,12 / 0,16 da 7,000…1 y `Math.ceil` devuelve 8 |
| bancal sin disposición cargada | como «otro»: no promete surcos que nadie declaró (`lugar.ts`) | 1 celda |
| otro, o sin lugar | 3 columnas, una celda por planta | 1 celda |

- N es la capacidad del lugar. Sin capacidad, la suma de `ocupa ?? 1` de sus
  plantas.
- Paso de celda: `clamp(ancho / columnas, 44, 56)` px, salvo dos: el surco es
  una fila de media página (entera con más de 4) por 44 de alto, y la maceta
  va a 70 de alto, para que entre el nombre abajo. Ningún target baja de 44 ni
  se solapa.
- Si lo sembrado pide más celdas que las que hay, primero cada planta recibe
  una y después se reparten las que quedan, en orden. Si ni una por planta
  alcanza (30 plantas en un bancal de 6 × 3), la grilla suma filas: el croquis
  deja de estar a escala antes que dejar una planta sin enlace ni banderita.
- Las columnas de macetas y almaciguera cambian con la capacidad (3 o 6). Por
  eso se fijan en `plano.cols` la primera vez que se acomoda el lugar: después,
  si cambia la capacidad, cambian las filas y no el ancho, y `celdas` no se
  corre. `cols` vale sólo en almaciguera y macetas, y sólo si es un entero de 1
  a 6 (llega por backup). Si el lugar cambia de clase, ver `plano.grilla` en el
  nivel 1.
- Orden de las plantas: por `creada`, con el `id` de desempate (sin él, dos
  cargadas en el mismo instante se reordenan solas, el bug que ya resolvió
  `agruparPorLugar`). No por `sembrada`: la fecha de siembra se edita en el
  alta, y una siembra vieja cargada hoy correría a las demás. Así una siembra
  nueva va siempre al final. Un bloque no se corta entre filas si entra entero
  en la siguiente, salvo que saltar deje sin lugar a las que siguen: entonces
  se corta.
- Los lugares van en dos columnas: los de media página de a dos y los de
  página entera solos. Si a uno de media le sigue uno entero, sube el próximo
  de media a llenar el hueco. Se empaqueta en el orden de los datos, no con
  `grid-auto-flow: dense`, que deja el foco saltando para arriba. El orden de
  base es el de `agruparPorLugar` (o `plano.orden`), y la lista de abajo usa
  el mismo empaquetado: el orden a la vista, el del foco y el de la lista son
  uno solo.
- Sin capacidad (ni medidas, en un bancal) no se dibujan celdas vacías: la
  misma regla que el medidor.
  Una planta sin `superficie` ocupa 1 celda. Las composteras no van en el
  croquis.
- En la demo: el Bancal del fondo mide 120 × 240 (2,9 m² para el medidor),
  son 6 × 3 celdas de 2,9 / 18 ≈ 0,161 m². La lechuga (0,8 m²) ocupa 5, la rúcula y la
  zanahoria (0,6 m²) 4 cada una, en bloques y en ese orden, que es el de
  `creada`.

### Nivel 1: acomodar, si querés

Dos campos opcionales en `src/lib/huerta/tipos.ts`. Viajan en el backup sin
subir de versión, igual que los otros campos aditivos
(`tests/huerta.test.ts`):

```ts
// Planta
celdas?: {                                 // las celdas que ocupa en la grilla de su lugar
  ubicacionId: string                      // de qué lugar son: si no coincide, se ignoran
  en: { col: number; fila: number }[]
}
// Ubicacion
plano?: {
  orden?: number                           // antes o después en la hoja
  grilla?: 'almaciguera' | 'macetas' | 'surcos' | 'libre' | 'otro'  // con qué fila de la tabla se acomodó
  cols?: number                            // el ancho de su grilla: sólo almaciguera y macetas
}
```

`grilla` es la fila de la tabla del nivel 0 con que se acomodó el lugar, no la
clase de `lugarDe`: un bancal que pasa de surcos a sin disposición sigue siendo
`bancal`, pero su grilla cambia. Si al dibujar la grilla ya no es esa (cambió
el tipo, la disposición o se borraron las medidas), se descartan `cols` y las
`celdas` de sus plantas y se vuelve al nivel 0. Es la misma guarda que el
`ubicacionId` de las celdas, y anda aunque el cambio lo haya hecho una versión
vieja de la app, que copia `plano` entero sin mirarlo.

Por celda, no por bloque. Así el croquis puede decir lo que hoy sólo dice la
nota de la demo: «rúcula intercalada entre las lechugas», «zanahoria en
manchones sueltos». En una huerta agroecológica intercalar es lo común.

Columna y fila, no un índice plano (se desordena si cambia la capacidad) ni una
posición libre x/y (no existe en celdas, macetas ni surcos). Cuando los datos no
cierran, se ordena de izquierda a derecha y de arriba abajo:

- Sobran celdas (porque bajó `ocupa` o la superficie): se quedan las primeras.
- Faltan: se completa con las primeras libres.
- Una celda que quedó fuera de la grilla se descarta, y se completa igual.
- Si dos plantas quieren la misma celda, gana la que se cargó primero
  (`creada`); a igual `creada`, el `id` menor.
- Trasplantar o mudar la tanda entera y borrar el lugar limpian el campo. Al
  dividirla, la madre no cambia de lugar ni de `ocupa` y conserva sus celdas;
  la hija nace sin ellas. Y como una versión vieja de la app puede restaurar
  un backup nuevo y trasplantar sin saber de `celdas`, las celdas llevan el
  `ubicacionId` de su lugar: si no coincide con el de la planta, se ignoran.
  Un `celdas` con forma rota también se ignora (`validar()` del backup no
  mira su forma).
- Los lugares sin `plano.orden`, por ejemplo uno creado después de acomodar, van
  después de los que lo tienen, en el orden de `agruparPorLugar`. A igual
  `orden`, también manda ese. Un `orden` que no es número se trata como
  ausente.
- Sin los campos, el nivel 0 exacto.

**«Acomodar» se hace tocando, nunca arrastrando.**

- Tocás una o varias celdas con plantas y quedan elegidas. Tocar otra vez
  una elegida la saca. Lo elegido se tiñe, y el trazo lo rodea como grupo:
  entre dos vecinas elegidas de la misma planta no va, porque ahí pasa el
  nombre. Si elegís parte de un manchón, esa parte lleva su nombre aparte,
  adentro del trazo, y el resto el suyo.
- Las celdas libres donde entra lo elegido llevan una marca «+». Tocás una: la
  primera en orden de lectura (arriba a la izquierda) va ahí y las demás la
  siguen con la misma forma. Con más de una elegida, ésa lleva un «1» montado
  sobre su esquina de arriba a la izquierda, debajo del copo si lo hay:
  adentro ya no queda lugar.
- Si no entra, la barra dice por qué («se sale del lugar», «pisa la
  lechuga»).
- La primera cae siempre en una libre. Así, un bloque se corre sobre sí mismo
  hacia atrás (a la izquierda o arriba), pero no hacia adelante, donde la
  primera caería sobre otra elegida: ahí se lleva la punta de atrás al otro
  lado, que con una sola planta da lo mismo; con plantas intercaladas, cambia
  el orden. Si no queda ninguna libre donde entre, no hay marcas, y la barra
  dice «soltá alguna»; con una sola, que toques otra para intercambiarlas.
- Una barra abajo dice qué elegiste y ofrece «Toda la rúcula» (elige todas
  las de esa planta), «Intercambiar» (con dos celdas de plantas distintas;
  sirve sobre todo cuando no queda lugar libre) y «Soltar».
- Para mover un lugar en la hoja, tocás su nombre y después el del lugar que
  va a quedar después, o «Al final de la hoja», que aparece en la barra. Tocar
  otra vez el nombre lo suelta. Como los lugares chicos van de a dos, el
  empaquetado puede dejarlo más arriba o más abajo de lo pedido, o correr a
  otros. La barra dice en qué puesto quedó («está ahora en el puesto 3 de 4,
  más abajo de lo que pediste») y nombra sólo a los que el empaquetado subió
  para llenar el hueco, si de verdad cambiaron de fila o de lado. Si el
  empaquetado lo devuelve a su lugar dice «Quedó donde estaba» y por qué; si
  ya estaba ahí, «Ya estaba ahí». Nunca anuncia un cambio que no pasó, y las
  frases no concuerdan con el nombre, que lo pone la persona. El foco queda en
  el lugar movido.
- La barra habla en la unidad del lugar: «1 maceta de tomate», «2 surcos»,
  «3 celdas».

Elegir una sola celda es mover por celda; elegir toda la planta es mover el
grupo. Así no pelea con el scroll, y anda con teclado y lector de pantalla:
cada celda es un botón, con `aria-pressed` si tiene planta (una libre no se
elige: dice si entra lo elegido), y la barra es `aria-live`. Pasar
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
  `prefers-reduced-motion`, cuando se apaga el `pulso-bandera`. De día lleva
  contorno en `--tinta-media`: el ocre da 2,49:1 contra la celda teñida donde
  se apoya, y un gráfico necesita 3:1. Lo cumple el contorno, con 6,91. De
  noche no lleva: el relleno solo da 4,91, y 4,12 el de la atrasada.
- **Copo** en las plantas de `expuestasAHelada` mientras haya helada en la
  semana (tarea o aviso): adentro de la primera celda, arriba a la izquierda,
  sin asomar, y la plantita se corre a la derecha. Con copo y banderita queda
  al medio, una marca en cada esquina. En la maceta nunca se corre, porque
  saldría de la tierra: las marcas quedan sobre el borde.
- El tipo de tarea y la etapa van en el nombre accesible: la plantita es
  `aria-hidden`.
- La banderita, la atrasada y el copo van al Glosario, como todo ícono con
  significado.
- **Por decidir: la etapa y la maceta vacía, ¿ícono o dibujo?** Hoy la
  plantita porta un dato (la etapa), y `src/dibujos/base.tsx` dice que un
  dibujo que porta un dato se vuelve ícono. Dos salidas:
  - **(a)** la etapa, la semilla y la maceta vacía como íconos: viewBox 24, en
    `src/icons`, con su entrada en el Glosario. El dibujo de cada grupo queda
    decorativo, e `IconoGrupo` sigue igual en la app y en el Glosario;
  - **(b)** todo como dibujo, con la gramática de `base.tsx` (viewBox 96,
    `aria-hidden`), sin Glosario. La etapa se dice sólo en el nombre accesible
    y en la lista.
- La maceta vacía se distingue por el trazo punteado, sin bajarle la opacidad.
  El `pulso-bandera` de lo atrasado anima sólo `transform`: con opacidad, el
  número bajaba a 3,7:1 en el valle.

### Estructura accesible

El DOM ya es la lista equivalente: la sección con su encabezado plegable; un
`article` por lugar con su encabezado y la ocupación en texto
(`sr-solo`); cada planta un `<a>` de 44 × 44 o más en su primera celda, con
nombre como «Zanahoria · todavía no asomó · 1 para atender, atrasada: fijate
si asomó» o «Rúcula · creciendo · 1 para atender: ya estaría para cosechar».
Las otras celdas de la planta abren lo mismo al dedo, sin foco ni nombre: el
teclado y el lector encuentran cada planta una vez. El SVG sólo dibuja papel y
plantas. La identidad y la atención van en HTML, que es lo que
recorre el lector de pantalla y lo que mide `e2e/accesibilidad.spec.ts`
(`button, a[href]`, 44 px).

### Riesgos anotados

- Los e2e que buscan una planta por nombre van a encontrar dos enlaces (croquis
  y lista): acotarlos por sección.
- `--papel-alto` de noche es semitransparente, y encima de una página rayada
  el renglón se ve a través y cruza las letras. El croquis usa `--hoja-cuadros`,
  y los botones a lápiz y la nota al margen, `--papel-opaco`.
- `e2e/accesibilidad.spec.ts` compone sólo `backgroundColor`, y el renglón es
  un `background-image`: el test no lo ve. Hasta que lo mida, dos reglas van a
  mano:
  - **El renglón cae debajo de la línea de base**, en el pie de cada fila de
    28 px. Nada puede correr la trama: margen sí, `padding` arriba de la
    página no, y lo que corta la página (la nota al margen, las fotos del
    diario, los botones de una tarea también cuando bajan a dos filas) ocupa
    un múltiplo de 28. El título de página ocupa dos filas y se apoya en la
    segunda: centrado en los 56 px, el primer renglón le cruzaba las
    mayúsculas. Y el «Ver la …» de una tarea va abajo en sus 44 px: no es
    opaco como el botón de al lado, y centrado el renglón le pasaba por el
    medio. Así el renglón no cruza el cuerpo de ninguna letra; en la
    manuscrita, algún descendente lo roza.
  - **Los tokens que no pasan justo encima de un renglón** (ver la tabla de
    contrastes) sólo sirven en página rayada si el renglón no los toca:
    `--tinta-tenue`, y de día `--verde-hoja` y `--sol-texto`, de noche
    `--terracota-texto`. Así pasa «Atrasada», en terracota.
  `GanttPlanta` y `TarjetaLugar` usan `--tinta-tenue` a 11 px: si la lista por
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
| `--sobre-bandera` / `--sobre-bandera-atrasada` | `--sobre-sol` / `#fffdf5` | `--sobre-sol` / `#2a2110` | el número de la banderita |
| `--bandera-borde` | `--tinta-media` | `transparent` | contorno de la banderita: de día el relleno no llega a 3:1 |
| `--papel-opaco` | `#fffdf5` | `#222e1f` | lo que no puede transparentar: la barra de Acomodar, la almaciguera, el copo, los botones a lápiz, la nota al margen |
| `--foto-borde` | `#fbfaf4` | `#e7e2d2` | el borde blanco de las fotos del diario |
| `--sombra-postit` / `-croquis` / `-barra` / `-foto` | `rgba()` propias | igual | sombras con forma, que `--sombra-1` y `-2` no tienen: el post-it levanta la punta, la barra sombrea para arriba |
| pestañas | `color-mix(<token> 20 %, --papel)` | igual | una pestaña por sección: sol, verde, agua, terracota, oliva |
| papel reciclado | `papel-reciclado-dia.svg`, nada más oscuro que `--papel` | `papel-reciclado-noche.svg`, nada más claro | fondo, en lugar del grano |

Contrastes medidos (WCAG: 4,5 para texto, 3 para rellenos y trazos):

| Par | Día | Noche |
|---|---|---|
| texto del post-it | 11,4 | 9,7 |
| texto suave del post-it | 6,2 | 5,3 |
| número de la banderita | 5,3 | 7,3 |
| número de la banderita atrasada | 5,2 | 6,1 |
| rótulo de pestaña sobre su tinte (el peor de los cinco) | 5,8 | 6,3 |
| texto del botón lleno («Listo»: `--papel` sobre `--verde-hoja`, el par de `.boton-primario`) | 4,87 | 7,0 |
| `--tinta-suave` justo encima de un renglón | 4,68 | 6,0 |
| `--tinta-tenue` justo encima de un renglón | **3,86, no pasa** | **4,10, no pasa** |
| `--verde-hoja` justo encima de un renglón | **4,06, no pasa** | 5,3 |
| `--sol-texto` justo encima de un renglón | **4,44, no pasa** | 5,2 |
| `--terracota-texto` justo encima de un renglón | 6,3 | **4,38, no pasa** |
| círculo del día leído (`--sol-texto`, trazo) | 5,3 | 6,9 |
| relleno de la banderita contra su celda teñida | **2,49, no pasa**: el 3:1 lo cumple el contorno (`--bandera-borde`, 6,91) | 4,91, sin contorno |
| relleno de la banderita atrasada contra su celda teñida | 4,36, con el mismo contorno | 4,12, sin contorno |

El renglón de día es el que manda: a 0,2 de opacidad la línea bajaba
`--tinta-suave` a 4,46 y no pasaba AA. Con 0,16 queda en 4,68. Los que no
pasan justo encima de un renglón sólo sirven si el renglón no los toca. El
círculo del día leído va en `--sol-texto` y no en `--sol`, que de día da 2,7
y es la única marca de qué día estás leyendo.

## Cómo seguir

Si la dirección gusta, un epic con una issue por pantalla, como se hizo con
«Cantero»: primero tokens, letra y pestañas; después «Esta semana»; después el
croquis, que es lo único que toca el modelo (los dos campos opcionales).

## Capturas

Acomodar arranca con el Bancal del fondo ya acomodado como dice la nota de la
demo, y el croquis en nivel 0: «Listo» pasa lo acomodado al croquis.

Con el hash el render muestra un solo teléfono, sin marco, a 390 × 844:
`#hoy-dia`, `#croquis-noche`, `#acomodar-dia`, `#planta-noche`, `#piezas-dia`,
y con `-redondos` al final, con los títulos redondeados. Por ejemplo, con
Playwright:

```ts
await page.setViewportSize({ width: 390, height: 844 })
await page.goto('file:///…/docs/diseno/cuaderno/cuaderno-referencia.html#hoy-noche')
await page.screenshot({ path: 'hoy-noche.png' })
```

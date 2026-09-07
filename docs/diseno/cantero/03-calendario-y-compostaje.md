# 03 · Segunda entrega: calendario de siembra en grilla, Compostaje, y "Esta semana"

Esto se **suma** a `01` y `02`. Nada de lo anterior se invalida salvo lo que
este documento nombra explícitamente. Tres cambios:

1. La pestaña **Hoy** pasa a llamarse **Esta semana** (sólo el nombre).
2. La pestaña **Calendario** cambia de diseño: la lista "qué sembrar, mes a mes"
   (`02`, sección 7) se reemplaza por una **grilla clásica de calendario de
   siembra**, y la lista pasa a vivir dentro de ella, colapsada.
3. Nace una **quinta pestaña, Compost**: una guía de consulta, sin datos del
   usuario. **Su contenido es provisorio** (ver sección 3.5).

Las pantallas están en `cantero-referencia.html`, turno 4, en los dos temas
(día a la izquierda, noche a la derecha), y en `capturas/*-07-*`, `*-08-*`,
`*-09-*`. Los tokens son los mismos de `01`: acá sólo aparecen los que se usan
de manera nueva.

---

## 1. Hoy → Esta semana

Sólo cambia la etiqueta de la pestaña en `TabBar` y el título de la ruta. El
título grande de la pantalla ya decía "La semana"; la pestaña ahora coincide.
La ruta puede seguir siendo `/` — no renombres archivos por esto.

Con cinco pestañas la barra queda: **Esta semana · Explorar · Calendario ·
Compost · Mi huerta**. Íconos 22 px, rótulo display 9 px. La pestaña activa
lleva fondo `--sol` y radio 14, como hasta ahora; con cinco items cada una mide
~75 px de ancho, y "Esta semana" entra en una línea a 9 px.

---

## 2. Calendario: la grilla

### 2.1 Qué es

Una fila por especie, doce columnas de meses. La unidad sigue siendo la década
(tercio de mes): cada mes son tres celdas invisibles, y las barras se dibujan
en múltiplos de 1/36 del ancho. **Reemplaza** la lista de doce meses de `02`,
sección 7; esa lista no se pierde, se colapsa dentro del mes (2.4).

Con Explorar se unifican **por dato, no por pantalla**: el `AnilloAnual` de
Explorar es la misma fila de esta grilla enrollada (`decadasDelAnio(especie,
zona)` alimenta a los dos). La ficha de especie enlaza a ambas vistas y cada
una enlaza a la ficha. No hace falta un conmutador "anillos / grilla" en
Explorar: cada pestaña responde una pregunta distinta (Explorar: "¿qué es
esto?"; Calendario: "¿cuándo?").

### 2.2 Anatomía (medidas en px, dos temas iguales)

```
encabezado        26 + 22 lateral · sobretítulo display 10 · título display 30
                  a la derecha, segmentado Siembra | Cosecha (2.3)
fila de controles 16 arriba · chip "Solo mi huerta" 30 alto, radio 999
                  leyenda a la derecha, 10 px --tinta-baja
cabecera de meses 26 alto · sticky arriba · fondo --fondo · hairline abajo
                  12 letras (E F M A M J J A S O N D) display 9, --tinta-baja
                  el mes actual en --sol, 800
[panel del mes]   ver 2.4
fila de grupo     30 alto · hairline --linea arriba
                  ícono 12 + nombre del grupo display 8.5 uppercase .08em,
                  en el color del grupo
fila de especie   28 alto · hairline --linea-suave arriba (#ebe6d4 / #2b3826)
                  columna de nombre 96 (22 de margen + 74 útiles),
                  texto 11.5 / 700, con elipsis
                  punto --sol 6 px antes del nombre si está en mi huerta
                  pista: fondo con 11 hairlines verticales al 8 % de la tinta
                  (una por límite de mes)
                  barras 10 alto, radio 999, centradas (top 9)
aguja de hoy      1.5 px --sol, cruza grupo y especie, de arriba a abajo
                  posición: (décadaDeHoy − 0.5) / 36
pie               hairline · 10.5 px --tinta-baja · "Tocá una especie…"
```

Colores de las barras:

| Estado | Día | Noche |
|---|---|---|
| Siembra ideal | `#5d8a48` (`--verde-hoja`) | `#8fbf6f` |
| Siembra posible | `#e6c98f` | `#a86a10` |
| Ventana de cosecha | rayado `#c98718` / `#a86a10` cada 4 px | igual (`#e3a52f` / `#a86a10`) |

"Posible" se dibuja **debajo** de "ideal" (primero en el DOM) porque los tramos
se tocan: agosto posible + septiembre ideal se leen como una sola barra
bicolor, que es la lectura correcta.

### 2.3 Siembra | Cosecha

Segmentado de dos botones en el encabezado, 32 alto, radio 14, sobre una
bandeja `--superficie-2` con 3 px de padding. El activo es `--sol` con tinta
`#2a2110`. Cambia **qué barras** se dibujan, no las filas: mismas especies,
mismo orden, misma aguja. La leyenda cambia con él (una sola entrada,
"ventana de cosecha").

Dato: `cosecha` por especie **hoy no existe como ventana anual** en el
catálogo; existe `dias_a_cosecha` (rango) desde la siembra. La ventana de
cosecha del calendario es derivada: para cada tramo de siembra (ideal +
posible), sumale `dias_a_cosecha` y proyectá sobre las 36 décadas. Sale de una
función pura `decadasDeCosecha(especie, zona): EstadoMes[36]` al lado de
`decadasDelAnio`. **Si una especie no tiene `dias_a_cosecha`, no dibujes nada
en su fila** (fila vacía, no fila oculta): es preferible mostrar el hueco a
inventar.

### 2.4 Tocar el mes

Tocar la cabecera abre, debajo de ella, el **panel del mes**: fondo `--sol` al
8 %, nombre del mes display 11 uppercase `--sol`, y los tres tercios en filas de
`62 + 1fr`: rótulo display 9 uppercase (Principios / Mediados / Fines) con
"· estás acá" debajo en el tercio actual, y el texto 11.5 / 1.4 `--tinta-media`.
"cerrar" a la derecha, 10 px.

El texto de cada tercio es el que describía `02`, sección 7 para el mes en
curso: la lista en palabras de lo que se siembra en ese tercio, ordenada por
relevancia y cortada en ~7 nombres, más la línea "en tu huerta" si hay
`Ventanas` de alguna planta activa que caigan en el tercio. Un solo mes abierto
a la vez; **arranca abierto en el mes actual**. La grilla queda debajo, se
scrollea normal; la cabecera de meses es `position: sticky`.

Con esto, `02` sección 7 queda **reemplazada** por esta sección. Lo que ahí se
llamaba "fila de mes" es ahora el contenido del panel.

### 2.5 Solo mi huerta

Chip de contorno (30 alto, radio 999). Activo: fondo `--tinta-alta`, texto
`--fondo`. Filtra las filas a las especies con al menos una `Planta` activa en
IndexedDB; los grupos vacíos desaparecen. La cuenta del sobretítulo
("Conurbano · 25 especies") se actualiza.

### 2.6 Tocar una especie

Toda la fila es link a `/explorar/:slug`. Área táctil 28 px de alto: está por
debajo de los 44 recomendados, y se acepta a cambio de que entren 25 filas en
pantalla — pero **agregá `padding` invisible** para que la zona clicable llegue
a 44 sin mover la fila (o usá el nombre como target con `min-height: 44px` y
margen negativo).

### 2.7 Datos

Las 25 especies del prototipo y sus tramos están **hardcodeados** en
`cantero-referencia.html` (`CAL`) y son aproximaciones para dibujar. En la app
salen del catálogo con `decadasDelAnio` y `decadasDeCosecha`. El orden de
grupos del prototipo: hoja, fruto, raíz y bulbo, legumbre, aromática, flor.
Dentro del grupo, alfabético.

---

## 3. Compost

### 3.1 Qué es y qué no es

Una **guía de consulta**. No registra tachos, no fecha volteos, no manda
tareas, no guarda nada en IndexedDB. Es texto estructurado con un par de
diagramas, que vale igual para 20 L o para 750 L. Si más adelante se quiere una
"mi compostera" con estados y recordatorios, se diseña aparte y se conecta con
el motor de tareas; **no lo anticipes en esta pasada**.

### 3.2 Portada (`/compost`)

De arriba a abajo, todo reglado (hairlines `--linea`, sin tarjetas):

1. **Encabezado**: sobretítulo "Guía de consulta", título "Compostaje", y un
   párrafo de una línea que enuncia la receta.
2. **Qué vas a compostar**: dos filas `38 + 1fr + chevron`, ícono en pastilla
   `--superficie-2` radio 14: *Restos de cocina* (ícono fruto, `--frambuesa`)
   y *Restos del jardín* (ícono hoja, `--verde-hoja`). Cada una con una línea
   de descripción `--tinta-baja` 11.5.
3. **En qué sistema**: dos filas iguales: *Tachos rotativos* (ícono tacho,
   `--verde`) y *Compostera a suelo* (ícono huerta, `--terracota`).
4. **La receta**: bloque a sangre `--sol` con tinta `#2a2110` (el mismo molde
   que el aviso de helada en Esta semana). Adentro: una barra de proporción
   (dos segmentos flex 1 : 2.5, radio 999, 22 alto: "1 verde" en `--verde`,
   "2 a 3 secos" en `#8a5a12` día / `#2a2110` con texto `--sol` noche) y tres
   columnas de 11 px: Proporción, Humedad, Aire, cada una con ícono 14 y dos
   líneas.
5. **Guía**: seis filas de 13.5 / 700 con chevron: *Qué poner y qué no ·
   Proporción y humedad · Cuándo girar o voltear, y cuándo no hace falta · Qué
   lo acelera y qué lo frena · Problemas frecuentes · ¿Está listo?*

Las cuatro filas de 2 y 3 son **atajos a los mismos capítulos**, entrando con
el material o el sistema preseleccionado (3.3). No son cuatro guías distintas.

### 3.3 Capítulo (`/compost/:capitulo`)

El prototipo muestra el capítulo compuesto para *restos de cocina · tachos
rotativos*. El molde es uno solo y los textos varían con dos parámetros
(`material: cocina | jardin`, `sistema: tachos | suelo`). Bloques, en orden:

1. **Encabezado** con volver (40 px, radio 14), sobretítulo con los dos
   parámetros ("Restos de cocina · tachos rotativos"), título display 26.
2. **Tres estados**: tres celdas `--superficie-2` radio 14 en una fila:
   *Llenando · Cocinando · Madurando*, cada una con rótulo display 9 (en
   `--verde-hoja`, `--sol`, `--terracota`), una duración en 12 / 800 y una
   línea de qué hacer. Para `suelo`, las duraciones cambian (semanas → meses);
   los tres estados son los mismos, porque los tres compartimentos cumplen
   la misma función que los tres tachos.
3. **Qué poner**: cuatro filas regladas `64 + 1fr`: *Verdes* (rótulo
   `--verde-hoja`, sub "nitrógeno"), *Secos* (rótulo `#8a5a12` / `#f6d97a`,
   sub "carbono"), *Poco* (chips de contorno punteado), *Nunca* (texto corrido
   en `--terracota`). Los chips son 11 / 700 sobre `--superficie-2`, radio 999.
   Para `jardin`, verdes y secos cambian de lista (pasto fresco y yuyos vs.
   hojas secas, poda picada, ramas).
4. **Girar: cuándo y por qué**: dos párrafos 12.5 / 1.5 con la primera frase
   en 800. El segundo es *¿Se puede no girar?*, y dice sí, con la condición y
   el costo en tiempo.
5. **Va bien / Algo falla**: tabla reglada de dos columnas (`1fr 1fr`),
   cabecera display 9 en `--verde-hoja` y `--terracota`. Izquierda: la señal
   sana con ícono 15 (termómetro, hoja, gota, compost). Derecha: el síntoma en
   800 y la corrección en `--tinta-media`. Cuatro filas en el prototipo.
6. **¿Está listo?**: bloque a sangre de cierre, `--tinta-alta` con texto
   `--fondo` en día (`#22301c` / `#f7f3e7`), `--superficie-2` con
   `--tinta-alta` en noche. Sobretítulo `--sol`, título display 17, cinco
   señales con tilde `--verde-hoja` (`#8fbf6f` en los dos temas), y una línea
   final en `--tinta-baja` sobre el compost inmaduro.

Íconos nuevos que el prototipo dibuja y que hay que sumar a `src/icons` con el
mismo trazo 1.75: `compost` (dos flechas circulares con brote), `tacho`,
`termo`, `check`, `cruz`.

### 3.4 Navegación

Quinta pestaña, entre Calendario y Mi huerta. Un ícono `compost` en la barra.
Al pie de la portada no hay nada más: la guía es finita.

### 3.5 Sobre el contenido: es provisorio

**Todo el texto de compostaje del prototipo (proporciones, tiempos, frecuencias
de giro, listas de qué va y qué no, señales, pruebas de madurez) fue escrito
para dar forma a la sección, no está respaldado por fuentes.** No lo copies a
producción tal cual. Ya existe un issue que pide la investigación; este diseño
es el molde en el que esa investigación tiene que caber:

- Cada bloque de texto debe poder llevar **fuentes citables** con el mismo
  mecanismo de la ficha de especie: chips enlazados al documento del organismo
  (INTA / ProHuerta, universidades, municipios con programa de compostaje) y,
  si aplica, el índice de confianza de 10 puntos. Reservá el lugar aunque hoy
  no se muestre.
- Las cifras (1:2–3 por volumen, girar cada 2–3 días, 4–6 semanas cocinando,
  3–4 madurando, 9–12 meses sin voltear, "esponja escurrida", prueba del
  frasco 3 días, prueba de germinación con rabanitos) son **placeholders
  plausibles**. Confirmalas o reemplazalas; si una fuente da un rango
  distinto, gana la fuente.
- Las listas de *Verdes / Secos / Poco / Nunca* deben salir de la
  investigación, no del prototipo. En particular *Poco* (cítricos, cebolla y
  ajo, pan y cocidos) es lo más discutible.
- La variante `jardin` y la variante `suelo` **no están redactadas**: el
  prototipo sólo muestra `cocina · tachos`. El molde alcanza; el texto no.

Hasta que la investigación esté, la sección puede entrar detrás de un flag o
con el texto marcado como borrador en la propia pantalla (una línea
`--tinta-baja` al pie: "Contenido en revisión"). Lo que no puede pasar es que
la app afirme cifras sin fuente en la misma pantalla en la que la ficha de
especie sí las cita: rompe el contrato de tono de la app.

---

## 4. Qué hacer con `02`

- Sección 1 (Hoy): vale entera; el nombre de la pestaña es "Esta semana".
- Sección 7 (Calendario): **reemplazada** por la sección 2 de este documento.
  Lo que ahí era una fila por mes es ahora el panel del mes dentro de la
  grilla. `estadosDelMes` y las `Ventanas` de `estimar()` siguen siendo los
  dos datos que lo alimentan.
- Todo lo demás, sin cambios.

## 5. Funciones puras nuevas (con test)

- `decadasDeCosecha(especie, zona): EstadoMes[36]` — deriva la ventana de
  cosecha de las ventanas de siembra + `dias_a_cosecha`.
- `filasCalendario(catalogo, plantasActivas, { vista, soloMia })` — devuelve
  los grupos y filas con sus tramos en fracciones de 36; es lo que renderiza
  la grilla y lo que se testea contra casos como "agosto posible + septiembre
  ideal = dos tramos contiguos".
- `terciosDelMes(mes, catalogo, plantasActivas)` — los tres textos del panel.

Ninguna toca IndexedDB ni agrega campos al modelo. El backup no cambia.

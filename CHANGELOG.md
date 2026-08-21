# Changelog

Qué cambió en cada versión de Huerta GBA.

Está escrito **para quien usa la app**, no como volcado de commits: si un cambio
no se nota desde afuera, no va acá (para eso está el historial de git). Formato
inspirado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/), y las
versiones siguen [SemVer](https://semver.org/lang/es/) de tres partes.

Qué significa cada parte en este proyecto:

- **MAYOR** — cambia lo que ya sabías usar, o los datos guardados necesitan
  migración.
- **MENOR** — funciones nuevas, y **también datos nuevos o corregidos**: sumar
  una especie o corregir una ventana de siembra no es un detalle técnico, es de
  lo que se trata la app.
- **PARCHE** — arreglos, textos, accesibilidad, performance.

---

> Mientras se trabaja en `staging`, los cambios se anotan bajo una sección
> `## [Sin publicar]` acá arriba. Al hacer un release, esa sección pasa a ser la
> versión nueva con su fecha.

## [Sin publicar]

### Agregado

- **El glosario ahora explica "ahilarse".** La palabra aparece 39 veces en las
  fichas —*"con poca luz se ahíla"*— y no estaba definida en ningún lado. Ahora
  dice qué es, que le pasa igual al plantín en la bandeja que a la planta grande
  a la sombra, y que no se arregla después: o hay luz desde el principio, o no.
- **"El de la bandeja germinadora es otro".** La receta de tierra del glosario
  lleva compost, que es lo correcto para la maceta y lo contrario de lo que
  quiere una semilla germinando. Faltaba decirlo: quien leía la receta y la usaba
  para llenar el semillero hacía justo lo que hay que evitar. La aclaración va
  debajo de la receta, con su fuente y su confianza como cualquier otro dato.

- **Cuando falta un dato, ahora la ficha lo dice.** La app promete que un dato
  que no está se muestra como tal, y no lo estaba cumpliendo: el dato faltante
  desaparecía en silencio. En el romero, la menta, el laurel y la lavanda eso
  dejaba **la fila de tiempos completamente en blanco**, sin una palabra que
  explicara por qué.

  Y distingue las dos cosas, que no son la misma: **"s/d"** cuando no
  encontramos una fuente que lo diga, y **"no aplica"** cuando a esa planta no
  le corresponde. Que la zanahoria no tenga días a trasplante no es un hueco
  de la investigación: es que a la zanahoria no se la trasplanta.

### Cambiado

- **La acelga vuelve a mostrar cuándo trasplantarla según la fuente**, con la
  altura incluida: *"3-4 hojas verdaderas y ~8-10 cm"*. Antes mostraba un
  criterio propio de confianza baja que tapaba el dato investigado.

### Arreglado

- **La leyenda de confianza del glosario enseñaba un código de formas distinto
  del que usa la app.** El borde de "confianza media" salía sólido y el de
  "baja" rayado, cuando en las fichas son rayado y punteado. Era el único lugar
  donde se explica ese código, y explicaba el equivocado — justo en el canal
  que existe para no depender del color.

---

## [1.1.1] — 2026-08-18

### Arreglado

- **La huerta podía aparecer vacía y ya no volvía a guardar nada.** En Android,
  con la app instalada, el aviso en segundo plano abría la base de datos de una
  forma que —si la base no existía en ese momento— la dejaba creada pero
  incompleta. A partir de ahí la app no podía leer ni escribir: los datos se
  veían perdidos, guardar no hacía nada, y **ni siquiera restaurar un backup lo
  arreglaba**, porque ese estado sobrevivía a todo.

  Se arregló de los dos lados: el aviso ya no crea la base nunca, y la app,
  cuando encuentra una base incompleta, **la repara sola al abrirse**. Si te
  pasó, con actualizar alcanza: no hay que borrar nada ni reinstalar.

---

## [1.1.0] — 2026-08-17

La 1.0 decía **qué** sembrar y **cuándo**. Esta versión se mete con lo que pasa
en el medio: qué hacer mientras la planta crece, y por qué esa semilla puede no
estar saliendo.

### Agregado

- **"Mientras crece" en cada ficha**: qué hay que ir haciendo entre la siembra
  y la cosecha, práctica por práctica y con el momento en que toca. Raleo,
  aporque, tutorado, poda, mulch, blanqueo, riego, abonado, desmalezado,
  rotación, polinización, reparo, contención y división de mata: **123
  cuidados en las 55 especies**. La información estaba, pero en un párrafo
  corrido que servía para leer una vez y no para el sábado a la mañana con la
  tijera en la mano.
- **"¿Por qué no germina?" ahora contesta distinto según la planta.** Antes
  decía lo mismo para las 55: fijate la humedad, la profundidad y la edad de
  la semilla. Ahora el berro avisa que **no germina si lo tapaste** —necesita
  luz—, la zanahoria que tarda hasta 20 días y que es la que más gente da por
  perdida antes de tiempo, la melisa que germina al 30 % **de fábrica**, y la
  menta que directamente no se siembra. **56 pistas propias en 42 especies**,
  cada una con sus fuentes.
- **El glosario ahora también explica las palabras**, no solo los íconos. Las
  catorce labores (raleo, aporque, blanqueo, mulch…) con **qué son y cómo se
  hacen**, veinte términos de las fichas —espigado, cuaje, pella, pan de
  tierra, chupón—, y una sección de **cómo se arma la tierra** con la mezcla
  base, su fuente, y hacia dónde correrla según lo que pida cada planta. Desde
  "Mientras crece" se salta directo a la palabra que no entendiste.
- **Mi huerta se pliega.** Cada lugar y cada planta se abren y se cierran con un
  toque, así una huerta de diez macetas entra en una pantalla en vez de ser un
  scroll largo. Se acuerda de cómo lo dejaste.
- Si una planta tiene algo para atender, **el aviso se ve igual con la tarjeta
  cerrada** —y con el lugar cerrado también—, con la cuenta de cuántas cosas
  son. Plegar ordena; no esconde.

### Cambiado

- Al pie de Ajustes ahora va **solo el número de versión**. El código raro que
  lo acompañaba era el commit del build; no le decía nada a nadie y le sacaba
  claridad a la única línea que tiene que poder leerse de un vistazo.

### Notas

- Todo lo que se sumó sale de las mismas fuentes que ya estaban investigadas y
  conserva su índice de confianza. Cuando una recomendación no tenía respaldo
  —el consejo de rotar crucíferas en el repollo, sin cita— **se sacó** en vez
  de publicarla.
- Tu huerta no se toca: no hay migración ni cambia nada de lo que tengas
  cargado.

---

## [1.0.0] — 2026-08-17

La primera versión completa. La app hace las tres cosas para las que se pensó:
decir qué sembrar esta semana, seguir lo que ya plantaste, y explicar de dónde
sale cada dato.

### Agregado

**El calendario, que es el corazón.** 55 especies con sus ventanas de siembra y
trasplante, afinadas a **períodos de 10 días** en vez de meses enteros — porque
no es lo mismo sembrar a principios que a fines de septiembre. El afinado sale
de un modelo climático del GBA construido sobre las normales 1991-2020 del SMN y
la estadística de heladas de FAUBA.

**Tres zonas del AMBA.** Entre el centro porteño y La Plata hay 71 días de
diferencia en la última helada. Se elige en Ajustes; por defecto, Conurbano.

**Trazabilidad completa.** Cada dato lleva sus fuentes con link y su índice de
confianza del 1 al 10, accesibles desde la ficha. El calendario afinado nunca
agrega una fecha que las fuentes no dijeran: solo puede recortar.

**Mi huerta.** Tus plantas con su etapa, fechas estimadas de trasplante y
cosecha, diario con fotos, y avisos de compatibilidad entre lo que tenés
plantado.

**Vigilancia de germinación.** Si una siembra se pasó del plazo, la app lo dice
y explica las causas posibles — distinguiendo lo que puede afirmar con datos
(la temperatura estuvo por debajo del óptimo) de lo que es una lista para ir a
chequear (humedad, profundidad, edad de la semilla).

**Hoy y el motor de tareas.** Qué toca hacer cada día, derivado de tus plantas y
del clima de tu zona. Toda tarea dice de dónde sale.

**Backup completo.** Un archivo JSON con todo adentro, fotos incluidas. Es la
red de seguridad: los datos viven solo en tu aparato.

**Funciona sin internet.** Después de la primera visita entra completa —las 55
especies incluidas— y se instala en la pantalla de inicio.

**Avisos opcionales**, con la letra chica adelante: en iPhone no llegan con la
app cerrada, y se dice antes de que toques el botón.

**Número de versión** al pie de Ajustes, con el commit exacto del build — para
que un reporte se pueda reproducir.

### Notas

- Precisión declarada del afinado: **±10 días**. Es un modelo, y está dicho en
  el glosario y al pie de cada ficha.
- Nada de cuentas, servidores ni nube. Dos teléfonos son dos huertas distintas;
  se pasan con el archivo de backup.

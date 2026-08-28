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

- **Tus lugares ahora tienen ficha propia.** Una ubicación ya no es solo un
  nombre: le podés decir qué es (maceta, bancal elevado, bancal a tierra,
  almácigo), sus medidas en centímetros —en el bancal elevado el volumen de
  sustrato se calcula solo—, cuánto sol recibe, cómo la agarra una helada (a
  cielo abierto, resguardada o invernadero) y notas libres. Todo opcional y
  editable cuando quieras, con el lápiz que aparece al lado de cada lugar en
  Mi huerta. Al crear un lugar desde el alta de una planta o un trasplante se
  abre la misma ficha completa. Y desde ahí también podés borrar un lugar: sus
  plantas quedan "sin lugar asignado", no se borran.

- **Una siembra ya no es "una planta".** Ahora podés anotarle a cada siembra
  cuántas plantitas tiene, más o menos (~8), y cuando trasplantás **una parte**
  —del semillero a las macetitas, de las macetitas al bancal— esa parte pasa a
  su propia tarjeta, con su lugar y su fecha, y el movimiento queda anotado en
  el diario de las dos. La cuenta se ajusta cuando germinan, cuando raleás o
  cuando se pierde alguna, también con nota automática. Todo a ojo y nada
  obligatorio: sin cantidades, la app sigue andando como siempre. Mi huerta
  ahora cuenta en serio: "3 siembras · ~24 plantas".

- **El pronóstico de la semana, si vos querés.** En Ajustes le decís a la app
  más o menos dónde está tu huerta —tu zona así nomás, tu localidad, o el GPS—
  y Hoy te muestra los próximos 7 días, con avisos cuando viene una helada,
  lluvia que te ahorra un riego o un calor que pide regar dos veces. Cada día
  se toca y abre su detalle: humedad, viento, UV, presión, rocío al amanecer y
  hasta la temperatura del suelo.

  Es **opcional y es lo único que sale de tu teléfono**: el pedido va directo a
  Open-Meteo (CC BY 4.0), sin pasar por ningún otro lado. Si no lo activás, la
  app sigue sin tocar internet, como siempre. Y sin señal muestra lo último que
  trajo, diciendo de cuándo es.

- **Riego y maceta, dos datos que la app no tenía.** Cuánta agua pide cada
  especie, en una barrita de cuatro niveles que va de *escaso* a *constante*, y
  en qué maceta entra: profundidad mínima, litros y cuántas plantas. Para quien
  tiene la huerta en un balcón, **"¿me entra?" es la primera pregunta**, y hasta
  ahora ninguna de las siete pantallas la contestaba.

  **Riego en 33 especies y maceta en 26**; 41 de las 55 tienen al menos uno de
  los dos. Las que faltan dicen **"s/d"** en vez de esconder la sección: las
  aromáticas —romero, tomillo, salvia— no tienen tamaño de maceta publicado en
  ninguna fuente seria, y decirlo es más útil que inventarlo.

  El riego sale de lo que ya estaba investigado: la mitad de las fichas tenían
  el dato enterrado en un párrafo largo, y ahora está afuera y se puede comparar
  de un vistazo. Los litros y la profundidad son investigación nueva, de dos
  servicios de extensión universitaria.

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

- **Un registro de arranques, en Ajustes → "Si algo se rompe".** Hay reportes de
  huertas que aparecen vacías sin que se sepa reproducirlo. La app ahora anota
  cada vez que abre tus datos —cuándo, qué versión, cuántas plantas encontró y
  si el navegador los está protegiendo—, y ese registro **sobrevive aunque se
  borre la base**. Si te llega a pasar, con copiarlo y mandarlo alcanza para
  saber qué pasó. No sale de tu aparato.

- **Siete especies más te dicen cuándo ralear.** Cuando una planta va de siembra
  directa no hay trasplante que esperar: la labor que decide el resultado es el
  raleo, y en la espinaca, la rúcula, el radicchio, el melón, la sandía, el
  eneldo y la borraja la ficha no lo mencionaba en ninguna parte. Ahora está en
  **"Mientras crece"**, con el número que da cada fuente y no con un "dale
  espacio" genérico: *5-8 cm entre plantas* en la espinaca, *la mejor de cada
  hoyo cuando tienen 2 hojas verdaderas* en el melón y la sandía, *45-60 cm* en
  la borraja. Van **13 de las 55** con raleo, contra 6 que había antes.

  Las que se pueden sembrar de las dos formas lo dicen en el "cuándo" —*"si la
  sembraste directa…"*—, porque a la que hiciste en almácigo la trasplantás en
  vez de ralearla.

- **La distancia entre planta y planta, ahora en todas las fichas (menos una).**
  De las 55 especies, 17 no decían a cuánto dejar las plantas al trasplantar o
  ralear: berenjena, cebolla, haba, berro, zapallito de tronco, girasol, seis
  aromáticas y cuatro flores. Ahora lo dicen, cada una con el número de su
  fuente —*8-10 cm* la cebolla, *~25 cm* el copete, *0,60-1,20 m* el romero, que
  es un arbusto—. La única que quedó igual es el laurel: ninguna fuente
  confiable da una distancia, y acá no se inventa.

### Cambiado

- **El trasplante y la cosecha se cuentan desde que la semilla asomó, no desde
  que la sembraste.** Si germinó más tarde de lo que decía la ficha, todas las
  fechas de esa planta se corren ese mismo tanto —y con ellas la tarea de Hoy y
  el aviso que llega al teléfono. Dos semillas del mismo sobre sembradas el
  mismo día, una que asomó a los 5 y otra a los 22, ya no comparten fecha de
  trasplante: la segunda tiene diecisiete días menos de plantín encima.

  La ficha no cambia lo que dice: sigue siendo *"25-35 días desde la siembra"*,
  con su fuente y su confianza. Lo que se le suma es **tu** dato, y la app
  aclara de cuánto fue el corrimiento y por qué.

- **Al marcar que asomó ya se puede decir qué día fue.** Antes el botón anotaba
  siempre hoy, así que marcar tres días tarde metía tres días de error en todo
  lo que venía después. Ahora son **Hoy · Ayer · Otro día**, y la fecha se puede
  corregir después desde la misma ficha.

- **La acelga vuelve a mostrar cuándo trasplantarla según la fuente**, con la
  altura incluida: *"3-4 hojas verdaderas y ~8-10 cm"*. Antes mostraba un
  criterio propio de confianza baja que tapaba el dato investigado.

### Arreglado

- **La ficha de una planta ahora cumple accesibilidad como el resto.** Tres
  botones quedaban abajo de los 44 px y el plazo de germinación no llegaba al
  contraste mínimo sobre el fondo del aviso. Se medían las siete pantallas
  principales y ésta no estaba en la lista; ahora sí.

- **Restaurar un backup ya no puede costarte la huerta que tenías.** La
  restauración borraba todo *antes* de escribir lo del archivo, y de a un
  registro por vez. Si el archivo estaba cortado o traía algo que el navegador
  rechazaba, te quedabas **sin lo viejo y sin lo nuevo** — la propia pantalla lo
  admitía ("tus datos anteriores pueden haberse perdido"). Ahora se reemplaza
  todo de una sola vez: **o entra entero, o tu huerta queda exactamente como
  estaba.**

- **Cuando la app no puede leer tus datos, ahora te lo dice.** Antes, si la
  lectura fallaba, la pantalla quedaba en blanco o —peor— te mostraba *"Todavía
  no plantaste nada"*, el mismo cartel que ve alguien que recién empieza. A
  quien no le podemos leer la huerta no se le dice que nunca plantó nada: ahora
  aclara que **lo tuyo sigue guardado en el aparato**, muestra el nombre del
  error y te deja **probar de nuevo**. Antes ni siquiera reintentaba: un fallo
  de un segundo dejaba la app sin datos hasta que la cerrabas.

- **Un guardado que falla ya no se ve igual que un botón que no anda.** Si algo
  no se puede guardar aparece un aviso con el motivo, y cuando hay algo que
  hacer, lo dice: si no entra más en el aparato, que bajes un backup y borres
  fotos viejas.

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

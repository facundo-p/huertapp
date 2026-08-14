# Revisión del calendario derivado — Fase 0

> **Cómo leer:** por celda-mes: **●** siembra ideal · **○** siembra posible · **▲** trasplante ideal · **△** trasplante posible.
> Meses E(ne)…D(ic). **Días** = a trasplante / a cosecha / de germinación (desde siembra; — = sin dato confiable).
> Corregí lo que quieras acá mismo o decímelo por chat; después aplico los cambios a `data/enriquecimiento.json` y regenero todo.

Convenciones usadas: estaciones hemisferio sur (primavera = sep-nov); heladas GBA ~jun-sep, última ~sep; donde la fuente no separa ideal/posible quedó todo en **ideal** y está anotado.


## Hortaliza de hoja (13)

| Especie | E | F | M | A | M | J | J | A | S | O | N | D | Método | Días T / C / G | Conf |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|---|---|:-:|
| **Lechuga** |   | ○ | ●△ | ●▲ | ○▲ | ○△ | ○△ | ●△ | ●▲ | ●▲ | ●▲ | ▲ | directa o almácigo · almácigo protegido | 25-35 / 50-120 / 4-10 | 7 |
| **Espinaca** |   | ○ | ●△ | ●▲ | ●▲ | ●▲ | ○▲ | ○△ | △ |   |   |   | almácigo · directa o almácigo | 28-42 / 45-100 / 7-14 | 8 |
| **Acelga** | ○△ | ○△ | ●△ | ●▲ | ●▲ | ○▲ | ○△ | ○△ | ●△ | ●▲ | ●▲ | ○▲ | directa o almácigo | 30-40 / 60-130 / 7-15 | 7 |
| **Rúcula** |   | ○ | ● | ● | ● | ● | ● | ● | ● | ● | ● |   | directa | — / 20-60 / 4-8 | 7 |
| **Kale (col rizada)** |   | ● | ●▲ | ○▲ | ○△ | ○△ | ○△ | ○△ | ○△ | ○△ | △ |   | almácigo · directa o almácigo | 28-42 / 30-70 / 4-7 | 6 |
| **Repollo** |   | ● | ●▲ | ▲ |   |   |   |   |   |   |   |   | almácigo | 28-42 / 90-130 / 5-10 | 8 |
| **Radicchio / Achicoria** | ○ | ● | ● | ● | ● | ○ | ○ |   |   | ○ | ○ | ○ | directa · directa o almácigo | — / 65-90 / 7-14 | 6 |
| **Berro** | ○ | ○ | ● | ● | ● | ○ | ○ | ○ | ● | ● | ● | ○ | directa o almácigo | — / 30-45 / 5-10 | 5 |
| **Apio** | ●▲ | ●▲ | ●▲ | ▲ | ▲ | ▲ |   |   | ● | ● | ●△ | ●▲ | almácigo | 70-90 / 120-150 / 15-20 | 8 |
| **Brócoli** | △ | ● | ●▲ | ●▲ | ▲ |   |   |   | ● | ●▲ | ○▲ | △ | almácigo | 30-45 / 90-160 / 5-10 | 8 |
| **Coliflor** | ▲ | ●△ | ● | ●▲ | ▲ | ▲ |   |   | ● | ● | ○▲ | ○▲ | almácigo | 30-45 / 90-200 / 5-10 | 7 |
| **Repollitos de Bruselas** | ●▲ | ●▲ | ○▲ | △ |   |   |   |   |   |   |   | ● | almácigo | 35-45 / 90-160 / 5-10 | 4 |
| **Cebolla de verdeo** |   | ● | ● | ● | ● | ● |   |   |   |   |   |   | almácigo · directa o almácigo | — / 60-150 / 7-15 | 7 |

<details><summary>Derivaciones de hortaliza de hoja</summary>

- **Lechuga** (`lechuga`): De fecha_siembra: siembras principales otoño (almácigo mar-abr) y fin de invierno-primavera (ago-nov) → ideal; 'casi todo el año' → resto posible, salvo pleno verano (dic-ene, espigado). Invierno como almácigo protegido (criterio heladas GBA). Trasplante = siembra + 25-35 días.
- **Espinaca** (`espinaca`): De fecha_siembra: almácigo feb-mar a junio, directa abr-may → núcleo otoñal ideal (mar-jun); feb (calor residual) y la extensión a fin de invierno (jul-ago) → posible. Trasplante = siembra + 4-6 semanas (solo si va en almácigo).
- **Acelga** (`acelga`): De fecha_siembra: 'todo el año' con mejores resultados en otoño y primavera → otoño (mar-may) y primavera (sep-nov) ideal, resto posible. Trasplante = siembra + ~30-40 días (si va en almácigo; lo habitual es directa con raleo). Señal de trasplante ajustada por el usuario a ~4 hojas verdaderas (confianza baja).
- **Rúcula** (`rucula`): De fecha_siembra: conviene otoño, invierno y primavera, evitar pleno verano → mar-nov ideal, feb (fin de verano) posible, dic-ene excluidos. Siembra directa siempre, sin trasplante. CORRECCIÓN: el 25-27 °C que la ficha daba como óptimo de crecimiento es en realidad de GERMINACIÓN; la hoja tierna se da con 10-20 °C (UNLu).
- **Kale (col rizada)** (`kale`): De fecha_siembra: siembra principal recomendada feb-mar → ideal; 'casi todo el año' típico de otoño-invierno → abr-oct posible, evitando nov-ene (calor). Trasplante = siembra + ~4-6 semanas. Fechas de INTA EEA Anguil, no del calendario GBA oficial.
- **Repollo** (`repollo`): De fecha_siembra: calendario oficial INTA/ProHuerta almácigo feb-mar, trasplante mar-abr. La ficha menciona variedades de otras estaciones sin fechas → no se agregan meses posibles (sin inventar precisión).
- **Radicchio / Achicoria** (`radicchio`): De fecha_siembra: directa feb-may (ciclo otoño-invierno, mejor respaldada) → ideal; otras ediciones agregan oct-ene y jun-jul → posible. El radicchio de cabeza admite almácigo (fin de verano-otoño) pero sin plazo de trasplante en la ficha → sin ventana de trasplante.
- **Berro** (`berro`): De fecha_siembra: 'casi todo el año', ideal primavera y otoño → sep-nov y mar-may ideal, resto posible. El pase de plantines al agua/suelo encharcado no tiene plazo en la ficha → sin ventana de trasplante. También se propaga por esquejes. Fuentes no locales, confianza media.
- **Apio** (`apio`): De fecha_siembra: INTA sep-dic y ene-mar, todo en almácigo → ideal (sin base para separar posible). Trasplante = siembra + ~80 días (ficha, conf 7): siembra sep→trasplante dic, siembra mar→trasplante jun.
- **Brócoli** (`brocoli`): De fecha_siembra: INTA sep-oct y feb-abr → ideal; El Brote Urbano agrega almácigo en noviembre (trasplante enero) → posible. Trasplante = siembra + ~30-45 días (plantín 4-6 hojas).
- **Coliflor** (`coliflor`): De fecha_siembra: INTA sep-oct y feb-abr → ideal; El Brote Urbano: tempranas almácigo oct-dic (trasplante dic-ene) → nov-dic posible; tardías almácigo mar-abr, trasplante may-jun. Trasplante = siembra + ~30-45 días.
- **Repollitos de Bruselas** (`repollitos-de-bruselas`): De fecha_siembra: almácigo dic-feb (fin de primavera a verano) para cosecha otoño-invierno → ideal; marzo como cola de ventana → posible. Trasplante = siembra + ~5 semanas. LA FICHA MISMA MARCA BAJA CONFIANZA (sin calendario argentino específico).
- **Cebolla de verdeo** (`cebolla-de-verdeo`): De fecha_siembra: INTA almácigo feb-jun y directa mar-may → unión feb-jun toda ideal (sin base para separar). Sin ventana de trasplante: la ficha no da plazo confiable (conf 4) y también se cultiva directa.

</details>

## Hortaliza de raíz/bulbo (9)

| Especie | E | F | M | A | M | J | J | A | S | O | N | D | Método | Días T / C / G | Conf |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|---|---|:-:|
| **Nabo** |   | ● | ● | ● | ● |   |   | ○ | ○ |   |   |   | directa | — / 60-90 / 4-7 | 4 |
| **Zanahoria** | ○ | ○ | ● | ● | ● | ● | ● | ● | ○ | ○ | ○ | ○ | directa | — / 50-150 / 10-20 | 7 |
| **Remolacha** |   |   | ● | ● | ● | ○ |   | ○ | ● | ● | ● | ○ | directa | — / 60-130 / 7-14 | 8 |
| **Rabanito** | ○ | ● | ● | ● | ● | ● | ○ | ○ | ● | ● | ● | ● | directa | — / 25-40 / 4-7 | 8 |
| **Papa** | ○ | ○ |   |   |   |   |   | ● | ● | ○ | ○ |   | plantación | — / 120-150 / 14-28 | 7 |
| **Batata** |   |   |   |   |   |   | ● | ● | ○ | ▲ | △ |   | almácigo protegido · almácigo | 50-70 / 190-270 / — | 7 |
| **Cebolla** |   |   | ● | ● | ▲ | ▲ | △ |   |   |   |   |   | almácigo · directa o almácigo | 50-60 / 230-270 / 7-15 | 8 |
| **Ajo** |   |   | ● | ● |   |   |   |   |   |   |   |   | plantación | — / 150-210 / 7-14 | 8 |
| **Puerro** |   | ● | ● | ● | ▲ | ▲ | ▲ |   |   |   |   |   | almácigo | 50-70 / 120-150 / 10-14 | 8 |

<details><summary>Derivaciones de hortaliza de raíz/bulbo</summary>

- **Nabo** (`nabo`): De fecha_siembra: principal fin de verano-otoño (feb-may) → ideal; también fin de invierno-primavera (ago-sep) → posible. Siembra directa (el trasplante daña la raíz). LA FICHA MARCA CONFIANZA REDUCIDA (no figura en calendarios oficiales).
- **Zanahoria** (`zanahoria`): De fecha_siembra: 'todo el año' con época ideal otoño-invierno → mar-ago ideal, resto posible (verano viable con riego y sombreo). Siembra directa siempre (el trasplante deforma la raíz). Cosecha 50-150 días según variedad (cortas 50-90; Chantenay ~110; Criolla ~150).
- **Remolacha** (`remolacha`): De fecha_siembra: óptimas primavera y otoño (UNLu/Fecoagro) → sep-nov y mar-may ideal; ventana INTA ago-dic/mar-jun completa el resto como posible, evitando pleno invierno (jul) y pleno verano (ene-feb). Directa; se ralea el glomérulo.
- **Rabanito** (`rabanito`): De fecha_siembra: INTA feb-jun y sep-dic → ideal; Fecoagro 'todo el año' en siembras escalonadas cada 15 días → resto posible. Directa siempre, ciclo muy corto.
- **Papa** (`papa`): Se PLANTA el tubérculo-semilla, no se siembra. INTA ago-sep y ene-feb; en Bs.As. el grueso comercial va oct-nov (semitardía) → ago-sep ideal (huerta, evitando heladas en emergencia), oct-nov y ene-feb posible. dias_germinacion = emergencia del tubérculo (2-4 semanas).
- **Batata** (`batata`): Propagación vegetativa: almácigo de batatas-semilla en invierno (INTA jul-ago; Brote ago-sep) → jul-ago ideal, sep posible; trasplante de los brotes en oct-nov pasadas las heladas. Los plantines alcanzan tamaño de trasplante (~25-30 cm) en ~60 días. Sin dias_germinacion (brotación, no semilla).
- **Cebolla** (`cebolla`): De fecha_siembra: INTA almácigo mar-abr y directa en abril → todo ideal (sin base para separar). Trasplante = siembra + 50-60 días (may-jun, jul como cola).
- **Ajo** (`ajo`): Se PLANTA el diente en otoño: INTA mar-abr; La Nación marca desde mediados de abril como ideal → mar-abr ideal. Directa en lugar definitivo, sin trasplante. dias_germinacion = brotación del diente.
- **Puerro** (`puerro`): De fecha_siembra: INTA almácigo feb-abr y trasplante may-jul → todo ideal (sin base para separar). Trasplante = siembra + ~2 meses (grosor de lápiz).

</details>

## Hortaliza de fruto (11)

| Especie | E | F | M | A | M | J | J | A | S | O | N | D | Método | Días T / C / G | Conf |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|---|---|:-:|
| **Tomate** | ○ |   |   |   |   |   |   | ● | ●▲ | ●▲ | ○▲ | ○△ | directa · almácigo protegido · directa o almácigo | 30-60 / 80-100 / 6-10 | 9 |
| **Pimiento / Morrón** |   |   |   |   |   |   | ● | ● | ●▲ | ▲ | △ |   | almácigo protegido | 40-50 / 80-135 / 8-12 | 8 |
| **Ají picante** |   |   |   |   |   |   |   | ● | ● | ○▲ | ○▲ | △ | almácigo protegido · almácigo | 45-60 / 90-120 / 8-12 | 5 |
| **Berenjena** |   |   |   |   |   |   | ● | ● | ○▲ | ▲ | △ |   | almácigo protegido | 50-60 / 90-120 / 8-14 | 8 |
| **Zapallito de tronco** | ○ |   |   |   |   |   |   |   | ● | ● | ● | ● | directa · directa o almácigo | — / 45-60 / 5-8 | 8 |
| **Zapallo / Calabaza** |   |   |   |   |   |   |   |   | ○ | ● | ● |   | directa | — / 120-150 / 5-8 | 8 |
| **Pepino** |   | ○ |   |   |   |   |   |   | ● | ● |   |   | directa | — / 50-70 / 5-10 | 7 |
| **Melón** |   |   |   |   |   |   |   | ○ | ○ | ● |   |   | almácigo protegido · directa | — / ~100 / 5-10 | 8 |
| **Sandía** |   |   |   |   |   |   |   | ○ | ● | ● |   |   | almácigo protegido · directa | — / 90-100 / 5-10 | 8 |
| **Choclo / Maíz dulce** | ○ |   |   |   |   |   |   | ○ | ○ | ● | ● | ● | directa · almácigo protegido | — / 100-130 / 7-12 | 8 |
| **Frutilla** |   |   | ○ | ● | ● | ○ |   |   |   |   |   |   | plantación | — / 150-240 / — | 9 |

<details><summary>Derivaciones de hortaliza de fruto</summary>

- **Tomate** (`tomate`): De fecha_siembra: almácigo protegido ago-oct (INTA) → ideal; directa a golpes oct-ene → nov-ene posible. Trasplante sep-nov tras la última helada (~sep en GBA), dic como cola. Trasplante a 30-60 días del almácigo según época.
- **Pimiento / Morrón** (`pimiento`): De fecha_siembra: almácigo protegido jul-sep (Fecoagro/UNIDA jul-ago, INTA ago-sep) → todo ideal. Trasplante sep-oct pasadas las heladas; nov como cola. Almácigo ~45 días.
- **Ají picante** (`aji-picante`): De fecha_siembra: almácigo ago-sep (criterio del pimiento) → ideal; la ficha admite siembra 'hasta comienzos del verano' → oct-nov posible. Trasplante oct-nov pasadas las heladas. Días a trasplante inferidos del pimiento (plantín 10 cm, 4-6 hojas). Ficha con confianza intermedia (se asimila al pimiento).
- **Berenjena** (`berenjena`): De fecha_siembra: almácigo protegido jul-ago (UNLu y El Brote Urbano) → ideal; INTA extiende a septiembre → posible. Trasplante sep-nov pasado el riesgo de heladas, a los 50-60 días del almácigo.
- **Zapallito de tronco** (`zapallito-de-tronco`): De fecha_siembra: directa sep-dic (UNLu) → ideal; INTA extiende a enero → posible. En septiembre admite almácigo en vasitos para adelantar. Sin ventana de trasplante: tolera mal el trasplante y la ficha no da plazos. CORRECCIÓN: el 18-24 °C que la ficha daba como germinación es en realidad temperatura de AIRE (crecimiento); el suelo pide 21-32 °C para germinar (UNLu).
- **Zapallo / Calabaza** (`zapallo`): De fecha_siembra: directa oct-nov (UNLu e INTA) → ideal; El Brote Urbano arranca en septiembre → posible. Ciclo largo que necesita 4-5 meses sin heladas. Siembra directa de asiento (tolera mal el trasplante). CORRECCIÓN: el 18-24 °C de la ficha es temperatura de AIRE (crecimiento), no de suelo; germinar pide 21-32 °C (UNLu).
- **Pepino** (`pepino`): De fecha_siembra: directa oct (INTA) y sep-oct (El Brote Urbano) → ideal; segunda ventana de febrero (El Brote Urbano) → posible. Siembra directa (tolera mal el trasplante), con suelo templado y sin heladas.
- **Melón** (`melon`): De fecha_siembra: directa sep-oct con octubre como ideal explícito → ideal [10], sep posible; almácigo protegido en vasito en agosto → posible. Sin ventana de trasplante: si se usa vasito se pasa con cepellón intacto, sin plazo en la ficha.
- **Sandía** (`sandia`): De fecha_siembra: directa sep-oct junto con el melón → ideal; adelanto con almácigo protegido en agosto → posible. Sin ventana de trasplante (mala tolerancia; solo con cepellón intacto).
- **Choclo / Maíz dulce** (`choclo`): De fecha_siembra: calendario INTA directa oct-dic → ideal; Planificador amplía sep-ene y almácigo protegido en agosto → posible. Sembrar en bloque para polinización. Sin ventana de trasplante (se prefiere directa; sin plazos en ficha).
- **Frutilla** (`frutilla`): No se siembra: se PLANTAN plantines en otoño. INTA abr-may → ideal; UNLu amplía mar-jun → posible. La plantación es el inicio del ciclo, no hay etapa de trasplante posterior. Cosecha principal oct-dic desde plantación de otoño (~150-240 días).

</details>

## Legumbre (3)

| Especie | E | F | M | A | M | J | J | A | S | O | N | D | Método | Días T / C / G | Conf |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|---|---|:-:|
| **Chaucha (poroto / judía)** | ○ |   |   |   |   |   |   |   | ● | ● | ○ | ○ | directa | — / 60-80 / 5-10 | 8 |
| **Arveja** |   |   |   | ● | ● | ● | ○ | ○ |   |   |   |   | directa | — / 120-150 / 7-10 | 8 |
| **Haba** |   |   |   | ● | ● | ● | ● |   |   |   |   |   | directa | — / 150-180 / 7-14 | 8 |

<details><summary>Derivaciones de legumbre</summary>

- **Chaucha (poroto / judía)** (`chaucha`): De fecha_siembra: ideal sep-oct explícito en la ficha (INTA), con escalonadas posibles hasta nov-ene. Siembra directa siempre (raíz sensible al trasplante), pasado el peligro de heladas.
- **Arveja** (`arveja`): De fecha_siembra: INTA abr-jun → ideal; extensión a jul-ago en zonas templadas-frías (FIQ-UNL jun-ago) → posible. Siembra directa de asiento.
- **Haba** (`haba`): De fecha_siembra: INTA abr-jul → todo ideal (sin base en la ficha para separar posible). Siembra directa de asiento; la legumbre que mejor pasa el invierno.

</details>

## Aromática (13)

| Especie | E | F | M | A | M | J | J | A | S | O | N | D | Método | Días T / C / G | Conf |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|---|---|:-:|
| **Albahaca** |   | ○ | ○△ | △ |   |   |   | ● | ● | ○▲ | ○▲ |   | directa o almácigo · almácigo protegido | 28-42 / 90-100 / 7-14 | 7 |
| **Perejil** | ○ | ○ | ● | ● | ● | ○ | ○ | ○ | ○ | ○ | ● | ○ | directa | — / 60-130 / 10-18 | 7 |
| **Cilantro** |   |   | ● | ● | ● |   |   |   | ● | ● | ● |   | directa | — / 40-60 / 12-18 | 6 |
| **Orégano** |   |   | ○ | ○ |   |   |   |   | ● | ● | ● |   | plantación | — / — / 20-23 | 6 |
| **Tomillo** | ○ | ○ | ○ |   |   |   |   | ○ | ● | ● | ● | ○ | plantación · almácigo | — / — / 14-28 | 5 |
| **Romero** |   | ○ | ○ | ○ |   |   |   | ○ | ● | ● | ● |   | plantación | — / — / — | 6 |
| **Salvia** |   |   |   |   |   |   |   |   | ● | ● | ● |   | directa o almácigo | — / — / 14-21 | 6 |
| **Menta** |   |   | ○ | ○ |   |   |   | ○ | ● | ● | ● |   | plantación | — / — / — | 5 |
| **Melisa (toronjil)** |   |   |   | ○ | ○ | ○ |   |   | ● | ● | ● |   | almácigo protegido · almácigo | — / — / 14-21 | 5 |
| **Ciboulette (cebollín)** |   |   | ○ | ○ |   |   |   | ● | ● | ● | ● |   | directa o almácigo | — / 60-90 / 7-10 | 5 |
| **Laurel** |   |   | ○ | ○ |   |   |   |   | ● | ● | ● |   | plantación | — / — / — | 5 |
| **Eneldo** |   |   | ● | ● | ● |   |   | ○ | ○ |   |   |   | directa | — / 40-60 / 10-21 | 7 |
| **Lavanda** |   |   | ● | ● | ○ |   |   |   | ● | ● | ○ |   | plantación | — / — / — | 6 |

<details><summary>Derivaciones de aromática</summary>

- **Albahaca** (`albahaca`): De fecha_siembra: almácigo protegido ago-sep con trasplante oct-nov (INTA y Brote) → ideal; siembra tardía de primavera (oct-nov, ya sin heladas) y la ventana feb-mar del Brote → posible. Trasplante = siembra + 4-6 semanas.
- **Perejil** (`perejil`): De fecha_siembra: 'casi todo el año', mejores épocas fines de primavera (nov) y otoño (mar-may) → ideal; resto posible. Siembra directa (raíz pivotante que se resiente al trasplante). El rango es hasta el primer corte; la planta sigue produciendo por cortes varios meses más (experiencia del usuario).
- **Cilantro** (`cilantro`): De fecha_siembra: otoño y primavera, evitando pleno verano (florece con calor) → mar-may y sep-nov ideal, sin meses posibles sourceados. Directa (raíz pivotante); partir el 'grano' doble mejora la germinación.
- **Orégano** (`oregano`): Multiplicación vegetativa (esqueje/acodo/división): plantación en primavera → ideal; esquejes y división también a inicio de otoño → posible. La semilla (solo tipos europeos) es rara: dias_germinacion 20-23 informativo. Perenne: sin días a cosecha (corte principal en floración, dic-feb).
- **Tomillo** (`tomillo`): Principalmente esqueje/división/plantín: primavera → ideal; división oct-mar y semilla en almácigo a fines de invierno (ago) → posible. Perenne: sin días a cosecha (cortes escalonados desde que se establece).
- **Romero** (`romero`): Por gajo/estaca o plantín: plantar en primavera → ideal; gajos a fines de invierno (ago) y fines de verano-otoño temprano (feb-abr) → posible. Semilla no práctica: sin dias_germinacion. Perenne: sin días a cosecha (hojas desde el segundo año).
- **Salvia** (`salvia`): De fecha_siembra: primavera (La Rural/UNIDA) → ideal, sin base para posible. Admite directa, almácigo, esqueje y división (muchos prefieren plantín). Trasplante sin plazo confiable (conf 3) → sin ventana. Perenne: sin días a cosecha (no conviene cosechar hasta el 2º año).
- **Menta** (`menta`): Propagación vegetativa (esqueje/estolón/rizoma): primavera → ideal; esquejes a fin de invierno (ago) y estolones/rizomas a inicio de otoño (mar-abr) → posible. Semilla no recomendable (híbrida): sin dias_germinacion. Perenne: sin días a cosecha.
- **Melisa (toronjil)** (`melisa`): De fecha_siembra: almácigo en primavera → ideal; otoño-invierno bajo invernadero → posible (protegido). También división de matas (más segura). Trasplante con plántulas de 10-15 cm pero sin plazo en días → sin ventana. Perenne: sin días a cosecha (1er año un solo corte).
- **Ciboulette (cebollín)** (`ciboulette`): De fecha_siembra: fines de invierno y primavera (ago-nov) → ideal; otoño (mar-abr) → posible. Fechas adaptadas por la propia fuente (sin meses exactos). También división de matas cada 2-3 años. Trasplante sin plazo → sin ventana.
- **Laurel** (`laurel`): Por esqueje en primavera → ideal; trasplante del arbolito también en otoño → posible. Semilla muy lenta, no práctica: sin dias_germinacion. Perenne: sin días a cosecha (hojas a demanda una vez establecido). Fuente del hemisferio norte adaptada, menor confianza.
- **Eneldo** (`eneldo`): De fecha_siembra: preferentemente otoño → ideal; también fines de invierno-principios de primavera (ago-sep) → posible. Siembra directa (raíz pivotante). Cosecha de hoja ~40-60 días (referencias generales, conf baja en la fuente). CONFIRMACIÓN externa: se espiga por fotoperíodo (día largo, crítico 11-14 h), no solo por calor; en GBA se superan las 12 h desde ~21-sep. Un ensayo del INTA San Pedro (Paunero 2023) midió 4 cortes sembrando el 2-mar contra 2 cortes en abril.
- **Lavanda** (`lavanda`): Plantines/gajos en otoño o primavera (infocampo) → mar-abr y sep-oct ideal, may y nov como cola → posible. Plantación definitiva tras las heladas. Semilla rara y lenta: sin dias_germinacion. Perenne: sin días a cosecha (flores dic-feb desde que se establece).

</details>

## Flor polinizadora (6)

| Especie | E | F | M | A | M | J | J | A | S | O | N | D | Método | Días T / C / G | Conf |
|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|---|---|:-:|
| **Caléndula** |   |   | ○ | ○ | ○△ | △ | △ | ● | ● | ●▲ | ▲ | ▲ | directa o almácigo | 42-56 / — / 7-14 | 6 |
| **Copete / Tagetes** | ○ | ○ |   |   |   |   |   | ○ | ●△ | ●▲ | ●▲ | ●△ | directa · almácigo protegido · directa o almácigo | 30-45 / — / 5-10 | 6 |
| **Borraja** |   |   | ● | ● | ● | ● | ● | ● | ● | ● | ● |   | directa | — / 50-120 / 5-10 | 5 |
| **Capuchina (taco de reina)** |   |   | ● | ● | ● |   |   |   | ○ | ○ |   |   | directa o almácigo · directa | — / — / 7-14 | 7 |
| **Cosmos** |   |   |   |   |   |   |   | ● | ●▲ | ●▲ | ●▲ | △ | directa o almácigo | 21-35 / 60-90 / 7-21 | 5 |
| **Girasol** |   |   |   |   |   |   |   |   | ● | ● | ● | ○ | directa | — / 40-75 / 5-10 | 6 |

<details><summary>Derivaciones de flor polinizadora</summary>

- **Caléndula** (`calendula`): De fecha_siembra: fin de invierno-primavera (ago-oct, respaldada por el semillero) → ideal; las ventanas de otoño (mar-may) están INFERIDAS en la propia ficha → posible. Trasplante = siembra + 6-8 semanas. Flores sin días a cosecha en fuentes.
- **Copete / Tagetes** (`copete`): De fecha_siembra: primavera sep-dic → ideal; almácigo a fin de invierno (ago) y directa hasta fin de verano (ene-feb, fuente uruguaya) → posible. Trasplante = siembra + 1-1,5 meses, pasadas las heladas. Flores: sin días a cosecha (floración continua).
- **Borraja** (`borraja`): De fecha_siembra: 'de otoño a primavera' sin distinción de meses ideales → TODO en ideal (regla del BRIEF: sin datos para separar, no inventar). Directa preferida (raíz pivotante); se resiembra sola.
- **Capuchina (taco de reina)** (`capuchina`): De fecha_siembra: otoño mar-may (dos fuentes argentinas coinciden) → ideal; primavera en zonas de heladas fuertes → posible. Directa habitual; floración jul-oct. Sin días a cosecha (se cosechan hojas y flores al desarrollarse).
- **Cosmos** (`cosmos`): De fecha_siembra: fines de invierno-primavera (ago-nov, adaptado del hemisferio norte por la propia fuente) → ideal, sin base para posible. Trasplante = siembra + 3-5 semanas, sin heladas. Cosecha = primeras flores a los 2-3 meses.
- **Girasol** (`girasol`): De fecha_siembra: primavera sin riesgo de heladas, sep-nov/dic → sep-nov ideal, dic posible. Directa (raíz pivotante, germina muy rápido). Cosecha = floración a los ~40 días + 20-35 de floración; semillas más tarde.

</details>

## 🌡️ Temperaturas (°C)

> **Germinación** = temperatura del suelo (mínima · ideal · máxima). **Crecimiento** = temperatura del aire (tolera · ideal · tolera).
> **Helada**: cómo responde al frío del GBA. Conf = confianza del dato.


### Hortaliza de hoja

| Especie | Germina (suelo) | Ideal germ. | Crece ideal (aire) | Tolera | Helada | Conf |
|---|:-:|:-:|:-:|:-:|---|:-:|
| **Lechuga** | 4–30 | 15–20 | 13–18 | -6–30 | ✔️ la aguanta | 9 |
| **Espinaca** | 2–26 | 10–20 | 15–18 | -5–24 | ✔️ la aguanta | 9 |
| **Acelga** | 5–35 | 18–22 | 15–22 | -5–35 | ✔️ la aguanta | 8 |
| **Rúcula** | 5–35 | 25–27 | 10–20 | -3–30 | ✔️ la aguanta | 7 |
| **Kale (col rizada)** | 4–35 | 10–25 | 10–20 | -10–30 | ⭐ la mejora | 8 |
| **Repollo** | 5–35 | 18–25 | 15–20 | -6–27 | ✔️ la aguanta | 7 |
| **Radicchio / Achicoria** | ≥5 | 20–28 | 15–20 | ≥-8 | ⭐ la mejora | 6 |
| **Berro** | ≥8 | 15–20 | 10–20 | -10–30 | ✔️ la aguanta | 6 |
| **Apio** | 4–30 | 15–20 | 15–18 | -2–28 | ⚠️ la daña | 8 |
| **Brócoli** | 5–35 | 15–25 | 16–18 | -2–30 | ✔️ la aguanta | 9 |
| **Coliflor** | 5–35 | 18–25 | 15–21 | -2–26 | ⚠️ la daña | 7 |
| **Repollitos de Bruselas** | 6–35 | 18–25 | 14–18 | -10–30 | ⭐ la mejora | 7 |
| **Cebolla de verdeo** | 2–35 | 18–24 | 13–24 | -5–30 | ✔️ la aguanta | 8 |

<details><summary>Notas de hortaliza de hoja</summary>

- **Lechuga**: Si la sembrás en pleno verano la semilla se duerme por el calor del suelo: hacé almácigo a la sombra y trasplantá cuando afloje, que además con calor y poca luz no te acogolla.
- **Espinaca**: Sembrala de otoño y olvidate del verano: en cuanto los días se alargan y sube el termómetro se va a flor, las hojas se achican y el tallo se estira.
- **Acelga**: Es la más rústica de las de hoja y te la bancás casi todo el año, pero si viene un golpe de frío justo después de una racha calurosa se te sube a flor.
- **Rúcula**: Nace rápido con el suelo tibio pero la hoja tierna te la da el fresco: con calor sale amarga y se va a flor enseguida.
- **Kale (col rizada)**: Cuanto más frío pase, mejor: después de las primeras heladas la hoja se pone dulce y pierde el amargor, así que no lo saques apurado.
- **Repollo**: Nace bien con el suelo tibio pero recién arma cabeza compacta con el fresco: sembralo a fin de verano para que cierre en otoño-invierno.
- **Radicchio / Achicoria**: Sembralo con el suelo todavía tibio de fin de verano: la semilla necesita calor para nacer, pero la cabeza recién cierra y se pone bien colorada cuando entra el frío.
- **Berro**: Quiere fresco y agua permanente todo el tiempo; apenas aprieta el calor la hoja se endurece, se pone picante y la planta se va a flor, por eso rinde mucho más en invierno.
- **Apio**: Es lento y desparejo para nacer, y si el plantín chico se come varias semanas de frío se te va derecho a flor; con calor, en cambio, se ahíla y los tallos salen finitos y fibrosos.
- **Brócoli**: De chico aguanta bien las heladitas, pero apuntá a que la pella se arme en pleno fresco: con calor se te abre en flores amarillas antes de que la puedas cortar.
- **Coliflor**: Es la más delicada de las coles: no le banca ni el calor fuerte ni el frío duro, así que calculá la siembra para que la pella caiga justo en pleno otoño.
- **Repollitos de Bruselas**: Es la col que más frío aguanta y conviene cosecharla después de las primeras heladas: el frío le convierte el almidón en azúcar y los repollitos dejan de amargar.
- **Cebolla de verdeo**: Arrancá recién cuando aflojen los días de calor del verano, porque con el suelo caliente la semilla tarda un montón en nacer; la planta se banca las heladas aunque la hoja te quede algo rojiza.

</details>

### Hortaliza de raíz/bulbo

| Especie | Germina (suelo) | Ideal germ. | Crece ideal (aire) | Tolera | Helada | Conf |
|---|:-:|:-:|:-:|:-:|---|:-:|
| **Nabo** | 4–40 | 16–29 | 16–20 | ≥-4 | ⭐ la mejora | 5 |
| **Zanahoria** | 5–35 | 15–26 | 15–20 | -5–28 | ✔️ la aguanta | 9 |
| **Remolacha** | 4–29 | 15–25 | 15–22 | ≤30 | ✔️ la aguanta | 8 |
| **Rabanito** | 4–35 | 20–25 | 18–22 | -2–30 | ✔️ la aguanta | 8 |
| **Papa** | 7–30 | 15–20 | 13–20 | -2–30 | ⚠️ la daña | 9 |
| **Batata** | 15–35 | 21–30 | 21–30 | 10–35 | ☠️ la mata | 9 |
| **Cebolla** | 2–35 | 18–24 | 13–24 | ≤30 | ✔️ la aguanta | 9 |
| **Ajo** | ≥0 | 15–18 | 10–16 | ≤40 | ✔️ la aguanta | 8 |
| **Puerro** | ≥7 | 15–18 | 13–24 | — | ✔️ la aguanta | 6 |

<details><summary>Notas de hortaliza de raíz/bulbo</summary>

- **Nabo**: Dejalo para otoño-invierno: con calor se pone fibroso y picante, y en cambio el frío fuerte le sube el azúcar y lo deja más dulce.
- **Zanahoria**: Le cuesta nacer y tarda: mantené la superficie siempre húmeda hasta que emerja, porque si se seca una sola vez perdés la línea entera.
- **Remolacha**: Es de clima fresco pero cuidado con sembrarla muy al filo del invierno: si le toca frío de chiquita se va a flor y no te engorda la raíz.
- **Rabanito**: Es lo más rápido de la huerta pero odia el calor: sembrado en pleno verano te sale picante y hueco, así que dejalo para las medias estaciones.
- **Papa**: Ojo que estos valores de germinación son de brotación del tubérculo-semilla, no de semilla: plantá cuando el suelo ya templó y buscá que engorde con noches frescas, porque con noches calurosas hace mucha mata y poca papa.
- **Batata**: Los valores de germinación son de brotación de la batata-semilla en el almácigo: es tropical, plantá los plantines recién cuando pasó todo peligro de helada porque con frío queda parada sin crecer.
- **Cebolla**: Respetá la fecha de siembra de tu variedad: si la planta pasa mucho frío siendo chica se va a flor y no te hace bulbo, porque el bulbo lo arma después con días largos y calor.
- **Ajo**: Estos valores de germinación son de brotación del diente, no de semilla: plantalo en otoño para que le entre el frío del invierno, porque sin ese frío te hace un montón de hoja y no arma la cabeza.
- **Puerro**: Es de los más rústicos para el invierno: el almácigo tarda un montón en nacer, pero después podés dejarlo plantado en el cantero e ir cosechando a medida que lo necesitás.

</details>

### Hortaliza de fruto

| Especie | Germina (suelo) | Ideal germ. | Crece ideal (aire) | Tolera | Helada | Conf |
|---|:-:|:-:|:-:|:-:|---|:-:|
| **Tomate** | 10–35 | 18–27 | 18–25 | 2–35 | ☠️ la mata | 9 |
| **Pimiento / Morrón** | 13–37 | 20–30 | 18–28 | 1–35 | ☠️ la mata | 9 |
| **Ají picante** | 13–37 | 22–30 | 18–30 | 1–38 | ☠️ la mata | 7 |
| **Berenjena** | 15–35 | 20–30 | 20–30 | 1–43 | ☠️ la mata | 8 |
| **Zapallito de tronco** | 15–37 | 21–32 | 18–24 | 2–35 | ☠️ la mata | 9 |
| **Zapallo / Calabaza** | 15–37 | 21–32 | 18–24 | 2–35 | ☠️ la mata | 9 |
| **Pepino** | 15–40 | 22–32 | 18–28 | 2–35 | ☠️ la mata | 8 |
| **Melón** | 15–39 | 22–30 | 20–30 | 2–38 | ☠️ la mata | 8 |
| **Sandía** | 15–40 | 21–33 | 21–30 | 2–38 | ☠️ la mata | 8 |
| **Choclo / Maíz dulce** | 12–30 | 16–24 | 18–28 | 1–35 | ☠️ la mata | 8 |
| **Frutilla** | 7–30 | 10–20 | 15–25 | -10–30 | ⚠️ la daña | 9 |

<details><summary>Notas de hortaliza de fruto</summary>

- **Tomate**: Si adelantás el trasplante con las noches todavía frescas la planta te florece pero no cuaja, y con las olas de calor del verano se le muere el polen igual: apuntá a que florezca en tiempo templado.
- **Pimiento / Morrón**: Es más friolento que el tomate: si lo sacás afuera antes de tiempo se queda parado y voltea las flores, y en pleno golpe de calor también las pierde.
- **Ají picante**: Tarda bastante más en asomar que el pimiento dulce, así que hacé el almácigo con calor de abajo y bien temprano, y no lo des por perdido en la primera semana.
- **Berenjena**: Es la más calurienta de las solanáceas: si la trasplantás con frío se queda quieta y los primeros frutos te salen deformes, así que esperá a que el verano arranque en serio.
- **Zapallito de tronco**: La semilla quiere la tierra mucho más caliente de lo que uno cree: si sembrás de asiento con el suelo frío se te pudre antes de nacer, aunque después la planta crezca cómoda en tiempo templado.
- **Zapallo / Calabaza**: Necesita muchos meses seguidos sin heladas para llenar el fruto, así que sembralo apenas la tierra se templa y no lo dejes para el final de la primavera.
- **Pepino**: Con las noches todavía frescas te tira hojas y pepinos torcidos, así que conviene sembrarlo bien entrada la primavera y no pelearle al calendario.
- **Melón**: Tiene la raíz friolenta: si el suelo está frío la planta se queda parada aunque el aire venga lindo, así que no te apures con la siembra y regá con agua que no esté helada.
- **Sandía**: Pide más calor y más semanas que el melón, así que sembrala apenas pasó todo riesgo de helada para que alcance a madurar antes de que refresque el otoño.
- **Choclo / Maíz dulce**: Sembralo recién con la tierra templada, porque en suelo frío nace despareja y te quedan claros en la línea justo donde después no hay choclo.
- **Frutilla**: Acá los valores de germinación son en realidad los de arraigo del plantín: plantalo en otoño con el suelo fresco, porque el frío del invierno es justamente lo que le arma las flores para la primavera, y cuidá esas flores de las heladas tardías.

</details>

### Legumbre

| Especie | Germina (suelo) | Ideal germ. | Crece ideal (aire) | Tolera | Helada | Conf |
|---|:-:|:-:|:-:|:-:|---|:-:|
| **Chaucha (poroto / judía)** | 10–35 | 15–24 | 16–26 | 2–30 | ☠️ la mata | 9 |
| **Arveja** | 5–30 | 15–24 | 15–20 | -4–30 | ✔️ la aguanta | 9 |
| **Haba** | 7–36 | 22–28 | 15–20 | -5–28 | ✔️ la aguanta | 7 |

<details><summary>Notas de legumbre</summary>

- **Chaucha (poroto / judía)**: No la apures en primavera: con el suelo todavía frío la semilla se pudre antes de nacer, y una helada te liquida la planta en cualquier momento del ciclo.
- **Arveja**: Sembrala en otoño para que llegue a llenar vainas antes del calor: de chiquita banca bien el frío, pero si la helada la agarra en flor te quedás sin cosecha.
- **Haba**: Se siembra de otoño y aguanta bien el invierno cuando es chica, pero si la helada la pesca en plena floración se le caen las flores y no cuaja las vainas.

</details>

### Aromática

| Especie | Germina (suelo) | Ideal germ. | Crece ideal (aire) | Tolera | Helada | Conf |
|---|:-:|:-:|:-:|:-:|---|:-:|
| **Albahaca** | 15–35 | 20–25 | 20–30 | 10–35 | ☠️ la mata | 8 |
| **Perejil** | 4–35 | 15–25 | 15–21 | -12–30 | ✔️ la aguanta | 8 |
| **Cilantro** | 10–30 | 15–20 | 15–22 | -5–30 | ✔️ la aguanta | 8 |
| **Orégano** | ≤30 | 18–22 | 18–28 | ≥-15 | ✔️ la aguanta | 9 |
| **Tomillo** | 10–30 | 15–22 | 15–25 | ≥-15 | ✔️ la aguanta | 8 |
| **Romero** | — | 18–21 | 6–25 | ≥-8 | ✔️ la aguanta | 8 |
| **Salvia** | — | 18–22 | 15–25 | -15–36 | ✔️ la aguanta | 7 |
| **Menta** | — | — | 20–28 | ≥-15 | ✔️ la aguanta | 7 |
| **Melisa (toronjil)** | — | — | — | ≥-15 | ✔️ la aguanta | 6 |
| **Ciboulette (cebollín)** | 2–35 | 18–24 | 13–24 | -15–30 | ✔️ la aguanta | 6 |
| **Laurel** | — | — | 17–25 | -5–30 | ⚠️ la daña | 7 |
| **Eneldo** | — | 20–22 | 16–18 | -4–35 | ✔️ la aguanta | 7 |
| **Lavanda** | ≥15 | 18–24 | 15–30 | -15–35 | ✔️ la aguanta | 7 |

<details><summary>Notas de aromática</summary>

- **Albahaca**: No la apures en septiembre: hasta que el suelo no se calienta se queda clavada, y la primera helada del otoño te la lleva puesta.
- **Perejil**: Tené paciencia con el almácigo porque tarda muchísimo en asomar, pero después te banca todo el invierno dándote hoja.
- **Cilantro**: Sembralo escalonado de otoño a principios de primavera: apenas pega el calor se va a flor y te quedás sin hoja.
- **Orégano**: Multiplicalo por gajo o mata dividida en vez de semilla; el frío no lo despeina, lo que le arruina la cosecha es la humedad del verano.
- **Tomillo**: Hacelo por gajo porque de semilla nace despareja, y plantalo alto y bien drenado: el problema acá no es el invierno sino el verano húmedo.
- **Romero**: El frío de acá no lo toca: lo que lo mata es el suelo encharcado en invierno, así que dale cantero drenado y aire entre plantas.
- **Salvia**: Dale el rincón más drenado y aireado de la huerta y cortala seguido: el invierno lo pasa de taquito, pero la mata quieta en verano húmedo se llena de hongos.
- **Menta**: Se planta por estolón y no por semilla, y aunque la helada le queme toda la parte de arriba el rizoma rebrota solo en primavera.
- **Melisa (toronjil)**: Metela a media sombra pensando en enero: de cualquier helada rebrota sola desde la corona, pero el sol pleno del verano se la come.
- **Ciboulette (cebollín)**: Es de las pocas que te sigue dando en pleno invierno, así que no la levantes: cortala al ras y rebrota sola del bulbo.
- **Laurel**: Con las heladas de acá pierde hoja y se le queman los brotes tiernos, pero no se muere: aunque lo cortes a ras rebrota desde la base.
- **Eneldo**: Se va a flor por días largos y no solo por calor: sembrado en primavera se espiga aunque esté fresco, por eso rinde mucho más la siembra de otoño.
- **Lavanda**: Su problema en el GBA no es el frío ni el calor sino la humedad: pide la mitad de la que hay acá, así que va sí o sí en lomo drenado, con mulch de piedra y aire entre plantas.

</details>

### Flor polinizadora

| Especie | Germina (suelo) | Ideal germ. | Crece ideal (aire) | Tolera | Helada | Conf |
|---|:-:|:-:|:-:|:-:|---|:-:|
| **Caléndula** | 5–30 | 15–24 | 10–24 | -5–30 | ✔️ la aguanta | 7 |
| **Copete / Tagetes** | ≥15 | 20–25 | 18–30 | 0–35 | ☠️ la mata | 6 |
| **Borraja** | 9–37 | 15–23 | 15–25 | -5–32 | ✔️ la aguanta | 6 |
| **Capuchina (taco de reina)** | ≥10 | 13–20 | 15–21 | -1–30 | ☠️ la mata | 6 |
| **Cosmos** | 16–27 | 21–24 | 15–30 | 0–35 | ☠️ la mata | 7 |
| **Girasol** | ≥6 | 15–25 | 20–25 | -5–35 | ⚠️ la daña | 8 |

<details><summary>Notas de flor polinizadora</summary>

- **Caléndula**: Sembrala en otoño y vas a tener flor todo el invierno del GBA: la helada no la voltea, lo que la termina es el calorón del verano.
- **Copete / Tagetes**: Esperá a que el suelo se temple en primavera para sembrarlo: te florece todo el verano si no le falta agua, pero la primera helada del otoño te lo liquida.
- **Borraja**: Banca el invierno del GBA con alguna hoja quemada y se resiembra sola, así que te garpa como fuente de flor para las abejas casi todo el año.
- **Capuchina (taco de reina)**: Aprovechala en otoño y en la primavera fresca: con el calor fuerte deja de florecer y con la primera helada en serio se te va, así que sembrala escalonada.
- **Cosmos**: No lo apures: si sembrás con el suelo todavía frío te falla la germinación, pero una vez arrancado te florece hasta que llega el frío del otoño.
- **Girasol**: Podés adelantar la siembra porque la plantita recién nacida banca una helada suave, pero si el frío o el calor extremo la agarran en floración te arruina el capítulo.

</details>

## ⚠️ Puntos que piden tu criterio

- **Lechuga**: Cosecha 50-120 según tipo (hoja/cabeza) — revisado OK 2026-08-14.
- **Espinaca**: Remolacha quitada de buenas y malas (conflicto en fuente) — decisión del usuario 2026-08-14.
- **Acelga**: Remolacha quitada de buenas y malas; señal de trasplante ~4 hojas verdaderas — decisión del usuario 2026-08-14.
- **Rúcula**: 'Coles, rábano y nabo' (crucíferas) expandido a los 7 slugs de crucíferas de la base.
- **Rúcula**: El 25-27 °C era de germinación, no de crecimiento: corregido.
- **Kale (col rizada)**: 'Legumbres' expandido a chaucha/arveja/haba.
- **Brócoli**: Cosecha: la ficha da 50-150+ días DESDE TRASPLANTE según ciclo; se unificó a 90-160 desde siembra (sumando ~40 días de almácigo).
- **Repollitos de Bruselas**: Toda la ventana de siembra es de baja confianza (conf 4 en la fuente): revisar con criterio propio.
- **Nabo**: CONFLICTO en la fuente: col/coliflor aparece en buenas asociaciones y las crucíferas (incl. coliflor) en malas. Se dejó coliflor solo en malas; revisar.
- **Pimiento / Morrón**: Cosecha: INTA dice 80-100 desde siembra pero UNLu 70-90 desde trasplante (~115-135 total); rango unificado 80-135.
- **Berenjena**: Papa quedó solo en malas, confianza baja — decisión del usuario 2026-08-14.
- **Zapallito de tronco**: CONFLICTO en la fuente: papa y rabanito aparecen como buenas en unas fuentes y malas en otras. Se excluyeron de ambas listas; decidí vos.
- **Zapallito de tronco**: Aire vs suelo corregido en la derivación tras la investigación de temperaturas.
- **Zapallo / Calabaza**: Aire vs suelo corregido en la derivación tras la investigación de temperaturas.
- **Frutilla**: Días a cosecha derivados del calendario del cinturón hortícola (plantación abr-may → cosecha oct-dic), no de un dato directo.
- **Haba**: CONFLICTO en la fuente: el ajo figura como buena asociación (repelente de pulgón en entresurco) y también desaconsejado para producción de grano. Se dejó en buenas; revisar.
- **Zanahoria**: Cosecha ampliada a 50-150 según variedad; eneldo aclarado "solo al semillar" — decisión del usuario 2026-08-14.
- **Remolacha**: Cosecha: Fecoagro inicia ~60 días (primaverales); INTA 100-130. Rango unificado 60-130.
- **Batata**: Cosecha: 130-150 días desde trasplante (Brote/FIQ) ≈ 190-210 desde almácigo; INTA da 250-270 total. Rango unificado 190-270 desde inicio de almácigo.
- **Ajo**: Cosecha: INTA 150-180; La Nación 6-7 meses. Rango unificado 150-210. El ajo tierno se cosecha a los 60-90 días.
- **Perejil**: Cosecha: primer corte 60-70 días (Brote) vs 85-130 (INTA); rango unificado 60-130.
- **Laurel**: Semilla recalcitrante: se siembra fresca en otoño, despulpada, y tarda 60-80 días. Sin dato publicado de temperatura de germinación (ni Kew lo tiene). Los esquejes piden 19 °C de sustrato y prenden a fin de verano (75 %), no en primavera (0 %).
- **Eneldo**: Distinción zanahoria buena/mala aclarada con nota "solo al semillar" — decisión del usuario 2026-08-14.
- **Borraja**: Sin separación ideal/posible (la fuente no distingue): todo quedó en ideal.

## Asociaciones "externas" (no resuelven a una especie de la base)

Se muestran como chips no navegables. Avisame si alguna debería mapearse a especies concretas.

- **borde de la huerta (atrae polinizadores)** ← Melisa (toronjil) (+)
- **bordes de la huerta (polinizadores)** ← Cosmos (+)
- **brasicáceas** ← Tomate (−)
- **brásicas en general** ← Eneldo (+)
- **bulbos, raíces y legumbres (rotación)** ← Frutilla (−)
- **cantero abierto: es invasiva, confinarla en maceta** ← Menta (−)
- **coles** ← Espinaca (+), Chaucha (poroto / judía) (+), Orégano (+), Ciboulette (cebollín) (+)
- **coles (repele la oruga)** ← Menta (+)
- **coles (repelente de plagas)** ← Tomillo (+)
- **coles/crucíferas** ← Cebolla (−)
- **colirábano** ← Pimiento / Morrón (−)
- **crucíferas y frutales (planta trampa)** ← Capuchina (taco de reina) (+)
- **cultivos muy abonados (reduce su floración)** ← Cosmos (−)
- **escarola** ← Berenjena (+)
- **espárrago** ← Pepino (+), Ajo (−)
- **frambuesa** ← Frutilla (−)
- **hinojo** ← Tomate (−), Chaucha (poroto / judía) (−), Zanahoria (−), Eneldo (−)
- **hortalizas de fruto de verano** ← Melón (+), Sandía (+)
- **hortalizas de hoja** ← Frutilla (+), Arveja (+), Haba (+)
- **hortalizas de hoja y de raíz (rotación)** ← Choclo / Maíz dulce (−)
- **hortalizas de raíz y de hoja** ← Perejil (+)
- **hortalizas de riego frecuente y suelo húmedo** ← Lavanda (−)
- **hortalizas en general (atrae fauna benéfica)** ← Caléndula (+)
- **hortalizas en general (polinizadores)** ← Borraja (+)
- **maní** ← Choclo / Maíz dulce (+)
- **mostaza (planta trampa)** ← Repollo (+), Brócoli (+)
- **no pegado a hortalizas pequeñas (sombra y raíces)** ← Laurel (−)
- **no sombrear cultivos de pleno sol** ← Girasol (−)
- **otras aliáceas** ← Cebolla (−)
- **otras crucíferas** ← Kale (col rizada) (−), Repollo (−), Brócoli (−), Coliflor (−), Repollitos de Bruselas (−)
- **otras cucurbitáceas** ← Zapallo / Calabaza (−)
- **otras solanáceas** ← Tomate (−), Pimiento / Morrón (−), Ají picante (−)
- **perímetro de la huerta** ← Laurel (+)
- **polinizadores (melífera)** ← Lavanda (+)
- **ruda** ← Romero (+)
- **zinnia** ← Cosmos (+)

## Especies con todo en "ideal" (la fuente no permitió separar)

Repollo · Apio · Pimiento / Morrón · Haba · Cebolla · Ajo · Puerro · Cebolla de verdeo · Cilantro · Salvia · Borraja · Cosmos

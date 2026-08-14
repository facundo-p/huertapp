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
- **Acelga** (`acelga`): De fecha_siembra: 'todo el año' con mejores resultados en otoño y primavera → otoño (mar-may) y primavera (sep-nov) ideal, resto posible. Trasplante = siembra + ~30-40 días (si va en almácigo; lo habitual es directa con raleo).
- **Rúcula** (`rucula`): De fecha_siembra: conviene otoño, invierno y primavera, evitar pleno verano → mar-nov ideal, feb (fin de verano) posible, dic-ene excluidos. Siembra directa siempre, sin trasplante.
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
| **Zanahoria** | ○ | ○ | ● | ● | ● | ● | ● | ● | ○ | ○ | ○ | ○ | directa | — / 100-150 / 10-20 | 7 |
| **Remolacha** |   |   | ● | ● | ● | ○ |   | ○ | ● | ● | ● | ○ | directa | — / 60-130 / 7-14 | 8 |
| **Rabanito** | ○ | ● | ● | ● | ● | ● | ○ | ○ | ● | ● | ● | ● | directa | — / 25-40 / 4-7 | 8 |
| **Papa** | ○ | ○ |   |   |   |   |   | ● | ● | ○ | ○ |   | plantación | — / 120-150 / 14-28 | 7 |
| **Batata** |   |   |   |   |   |   | ● | ● | ○ | ▲ | △ |   | almácigo protegido · almácigo | 50-70 / 190-270 / — | 7 |
| **Cebolla** |   |   | ● | ● | ▲ | ▲ | △ |   |   |   |   |   | almácigo · directa o almácigo | 50-60 / 230-270 / 7-15 | 8 |
| **Ajo** |   |   | ● | ● |   |   |   |   |   |   |   |   | plantación | — / 150-210 / 7-14 | 8 |
| **Puerro** |   | ● | ● | ● | ▲ | ▲ | ▲ |   |   |   |   |   | almácigo | 50-70 / 120-150 / 10-14 | 8 |

<details><summary>Derivaciones de hortaliza de raíz/bulbo</summary>

- **Nabo** (`nabo`): De fecha_siembra: principal fin de verano-otoño (feb-may) → ideal; también fin de invierno-primavera (ago-sep) → posible. Siembra directa (el trasplante daña la raíz). LA FICHA MARCA CONFIANZA REDUCIDA (no figura en calendarios oficiales).
- **Zanahoria** (`zanahoria`): De fecha_siembra: 'todo el año' con época ideal otoño-invierno → mar-ago ideal, resto posible (verano viable con riego y sombreo). Siembra directa siempre (el trasplante deforma la raíz).
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
- **Zapallito de tronco** (`zapallito-de-tronco`): De fecha_siembra: directa sep-dic (UNLu) → ideal; INTA extiende a enero → posible. En septiembre admite almácigo en vasitos para adelantar. Sin ventana de trasplante: tolera mal el trasplante y la ficha no da plazos.
- **Zapallo / Calabaza** (`zapallo`): De fecha_siembra: directa oct-nov (UNLu e INTA) → ideal; El Brote Urbano arranca en septiembre → posible. Ciclo largo que necesita 4-5 meses sin heladas. Siembra directa de asiento (tolera mal el trasplante).
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
- **Perejil** (`perejil`): De fecha_siembra: 'casi todo el año', mejores épocas fines de primavera (nov) y otoño (mar-may) → ideal; resto posible. Siembra directa (raíz pivotante que se resiente al trasplante).
- **Cilantro** (`cilantro`): De fecha_siembra: otoño y primavera, evitando pleno verano (florece con calor) → mar-may y sep-nov ideal, sin meses posibles sourceados. Directa (raíz pivotante); partir el 'grano' doble mejora la germinación.
- **Orégano** (`oregano`): Multiplicación vegetativa (esqueje/acodo/división): plantación en primavera → ideal; esquejes y división también a inicio de otoño → posible. La semilla (solo tipos europeos) es rara: dias_germinacion 20-23 informativo. Perenne: sin días a cosecha (corte principal en floración, dic-feb).
- **Tomillo** (`tomillo`): Principalmente esqueje/división/plantín: primavera → ideal; división oct-mar y semilla en almácigo a fines de invierno (ago) → posible. Perenne: sin días a cosecha (cortes escalonados desde que se establece).
- **Romero** (`romero`): Por gajo/estaca o plantín: plantar en primavera → ideal; gajos a fines de invierno (ago) y fines de verano-otoño temprano (feb-abr) → posible. Semilla no práctica: sin dias_germinacion. Perenne: sin días a cosecha (hojas desde el segundo año).
- **Salvia** (`salvia`): De fecha_siembra: primavera (La Rural/UNIDA) → ideal, sin base para posible. Admite directa, almácigo, esqueje y división (muchos prefieren plantín). Trasplante sin plazo confiable (conf 3) → sin ventana. Perenne: sin días a cosecha (no conviene cosechar hasta el 2º año).
- **Menta** (`menta`): Propagación vegetativa (esqueje/estolón/rizoma): primavera → ideal; esquejes a fin de invierno (ago) y estolones/rizomas a inicio de otoño (mar-abr) → posible. Semilla no recomendable (híbrida): sin dias_germinacion. Perenne: sin días a cosecha.
- **Melisa (toronjil)** (`melisa`): De fecha_siembra: almácigo en primavera → ideal; otoño-invierno bajo invernadero → posible (protegido). También división de matas (más segura). Trasplante con plántulas de 10-15 cm pero sin plazo en días → sin ventana. Perenne: sin días a cosecha (1er año un solo corte).
- **Ciboulette (cebollín)** (`ciboulette`): De fecha_siembra: fines de invierno y primavera (ago-nov) → ideal; otoño (mar-abr) → posible. Fechas adaptadas por la propia fuente (sin meses exactos). También división de matas cada 2-3 años. Trasplante sin plazo → sin ventana.
- **Laurel** (`laurel`): Por esqueje en primavera → ideal; trasplante del arbolito también en otoño → posible. Semilla muy lenta, no práctica: sin dias_germinacion. Perenne: sin días a cosecha (hojas a demanda una vez establecido). Fuente del hemisferio norte adaptada, menor confianza.
- **Eneldo** (`eneldo`): De fecha_siembra: preferentemente otoño → ideal; también fines de invierno-principios de primavera (ago-sep) → posible. Siembra directa (raíz pivotante). Cosecha de hoja ~40-60 días (referencias generales, conf baja en la fuente).
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

## ⚠️ Puntos que piden tu criterio

- **Lechuga**: Cosecha: hoja 50-85 días, cabeza hasta 120 (UNLP); rango unificado 50-120.
- **Lechuga**: Malas asociaciones (repollo/brócoli) son de baja confianza según la ficha.
- **Espinaca**: Cosecha con discrepancia fuerte entre fuentes (45-60 vs 80-100); rango unificado 45-100.
- **Espinaca**: Remolacha figura como buena Y mala asociación (mismo género que acelga): revisar.
- **Acelga**: Cosecha: INTA 110-130 días, La Nación primer corte ~60; rango unificado 60-130.
- **Acelga**: Remolacha figura como buena Y mala asociación: revisar.
- **Acelga**: Días a trasplante inferidos (la ficha solo dice 'varias hojas verdaderas').
- **Rúcula**: 'Coles, rábano y nabo' (crucíferas) expandido a los 7 slugs de crucíferas de la base.
- **Kale (col rizada)**: 'Legumbres' expandido a chaucha/arveja/haba.
- **Brócoli**: Cosecha: la ficha da 50-150+ días DESDE TRASPLANTE según ciclo; se unificó a 90-160 desde siembra (sumando ~40 días de almácigo).
- **Repollitos de Bruselas**: Toda la ventana de siembra es de baja confianza (conf 4 en la fuente): revisar con criterio propio.
- **Nabo**: CONFLICTO en la fuente: col/coliflor aparece en buenas asociaciones y las crucíferas (incl. coliflor) en malas. Se dejó coliflor solo en malas; revisar.
- **Pimiento / Morrón**: Cosecha: INTA dice 80-100 desde siembra pero UNLu 70-90 desde trasplante (~115-135 total); rango unificado 80-135.
- **Berenjena**: CONFLICTO en la fuente: papa aparece en buenas (agrohuerto) y en malas (regla de solanáceas). Se dejó en ambas para que decidas; sugerencia: dejarla solo en malas.
- **Zapallito de tronco**: CONFLICTO en la fuente: papa y rabanito aparecen como buenas en unas fuentes y malas en otras. Se excluyeron de ambas listas; decidí vos.
- **Melón**: Malas asociaciones derivadas del esquema de ROTACIÓN de INTA (no de asociación directa): revisar si querés que cuenten como incompatibilidad.
- **Sandía**: Malas asociaciones derivadas del esquema de ROTACIÓN de INTA: mismo criterio que melón.
- **Frutilla**: Días a cosecha derivados del calendario del cinturón hortícola (plantación abr-may → cosecha oct-dic), no de un dato directo.
- **Haba**: CONFLICTO en la fuente: el ajo figura como buena asociación (repelente de pulgón en entresurco) y también desaconsejado para producción de grano. Se dejó en buenas; revisar.
- **Zanahoria**: Cosecha: variedades cortas 50-90 días; rango principal 100-150 (Chantenay ~110, Criolla ~150).
- **Zanahoria**: CONFLICTO entre fichas: acá el eneldo es mala asociación, pero la ficha del eneldo lo da como bueno contra plagas del repollo/zanahoria (el conflicto real es solo al dejar semillar). Revisar.
- **Remolacha**: Cosecha: Fecoagro inicia ~60 días (primaverales); INTA 100-130. Rango unificado 60-130.
- **Batata**: Cosecha: 130-150 días desde trasplante (Brote/FIQ) ≈ 190-210 desde almácigo; INTA da 250-270 total. Rango unificado 190-270 desde inicio de almácigo.
- **Ajo**: Cosecha: INTA 150-180; La Nación 6-7 meses. Rango unificado 150-210. El ajo tierno se cosecha a los 60-90 días.
- **Perejil**: Cosecha: primer corte 60-70 días (Brote) vs 85-130 (INTA); rango unificado 60-130.
- **Eneldo**: La zanahoria es buena compañera para control de plagas PERO mala si se dejan semillar ambas (se cruzan). Se dejó solo en buenas; la ficha de zanahoria lo tiene en malas. Decidí el criterio.
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
- **otras cucurbitáceas (rotación)** ← Melón (−), Sandía (−)
- **otras solanáceas** ← Tomate (−), Pimiento / Morrón (−), Ají picante (−)
- **perímetro de la huerta** ← Laurel (+)
- **polinizadores (melífera)** ← Lavanda (+)
- **ruda** ← Romero (+)
- **zinnia** ← Cosmos (+)

## Especies con todo en "ideal" (la fuente no permitió separar)

Repollo · Apio · Pimiento / Morrón · Haba · Cebolla · Ajo · Puerro · Cebolla de verdeo · Cilantro · Salvia · Borraja · Cosmos

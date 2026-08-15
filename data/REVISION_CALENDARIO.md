# Revisión del calendario afinado por décadas

> **Cómo leer.** Cada mes se parte en tres décadas (principios · mediados · fines).
> Dentro de la celda: **●** ideal · **○** se puede · **·** no.
> Las tablas muestran la zona **Conurbano** (Ezeiza Aero (SMN) · Ezeiza Aero 3 °C (FAUBA)), que es la de referencia.
> Al final están los recortes que hizo el modelo, las especies que quedaron sin afinar y la comparación entre zonas.
> Corregí lo que quieras acá mismo o decímelo por chat; después lo aplico sobre `data/enriquecimiento.json` o sobre las reglas del afinado y regenero todo.

## De dónde sale esto

**Regla de oro:** el modelo solo puede *recortar* lo que dijeron las fuentes. Nunca agrega una década fuera de los meses que la fuente ya había habilitado. En el peor caso poda de más; nunca inventa una ventana.

| Criterio | Qué puede hacer | Fuente |
|---|---|---|
| Riesgo de helada por década | descartar y degradar | FAUBA, umbral agrometeorológico de 3 °C, series de 50-63 años |
| Rango de crecimiento (aire) | descartar si excede lo tolerado, degradar si sale del ideal por más de 4 °C | Normales SMN 1991-2020 |
| Piso de germinación (suelo) | solo degradar | **supuesto propio**: no existen normales de suelo para el AMBA |

Cada criterio se evalúa en el momento del ciclo en que actúa: la germinación en la siembra, la helada en la emergencia (una semilla enterrada no se hiela), el crecimiento a mitad de ciclo. El almácigo protegido está exento del recorte por helada, que es justamente para lo que existe.

**Precisión honesta: ±10 días.** No existe ningún calendario de siembra argentino publicado con resolución sub-mensual (revisados ProHuerta, Cambio Rural y los calendarios provinciales del INTA, todos mensuales), así que esto no tiene antecedente citable: la trazabilidad del método es todo lo que hay.

## Hortaliza de hoja (13)

| Especie | E | F | M | A | M | J | J | A | S | O | N | D | Estado | Conf |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|:-:|
| **Acelga** | ○○○ | ○○○ | ●●● | ●●○ | ○○○ | ○○○ | ○○○ | ○○○ | ●●● | ●●● | ●●● | ○○○ | afinado (4) | 7 |
| **Apio** | ●●● | ●●● | ●●● | ··· | ··· | ··· | ··· | ··· | ●●● | ●●● | ●●● | ●●● | afinado (0) | 7 |
| **Berro** | ○○○ | ○○○ | ●●● | ●●● | ●●● | ○○○ | ○○○ | ○○○ | ●●● | ●●● | ●●● | ○○○ | afinado (0) | 7 |
| **Brócoli** | ··· | ●●● | ●●● | ●●● | ··· | ··· | ··· | ··· | ●●● | ●●● | ○○○ | ··· | afinado (0) | 7 |
| **Cebolla de verdeo** | ··· | ●●● | ●●● | ●●● | ●●● | ●●● | ··· | ··· | ··· | ··· | ··· | ··· | afinado (0) | 7 |
| **Coliflor** | ··· | ●●● | ●●● | ●●● | ··· | ··· | ··· | ··· | ●●● | ●●● | ○○○ | ○○○ | afinado (0) | 7 |
| **Espinaca** | ··· | ○○○ | ●●● | ●●● | ○○○ | ○○● | ○○○ | ○○○ | ··· | ··· | ··· | ··· | afinado (5) | 7 |
| **Kale (col rizada)** | ··· | ●●● | ●●● | ○○○ | ○○○ | ○○○ | ○○○ | ○○○ | ○○○ | ○○○ | ··· | ··· | afinado (0) | 7 |
| **Lechuga** | ··· | ○○○ | ●●● | ●●● | ○○○ | ○○○ | ○○○ | ●●● | ●●● | ●●○ | ○○○ | ··· | afinado (4) | 7 |
| **Radicchio / Achicoria** | ○○○ | ●●● | ●●● | ●●○ | ○○○ | ○○○ | ○○○ | ··· | ··· | ○○○ | ○○○ | ○○○ | afinado (4) | 7 |
| **Repollitos de Bruselas** | ●●● | ●●● | ○○○ | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ●●● | afinado (0) | 7 |
| **Repollo** | ··· | ●●● | ●●● | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· | afinado (0) | 7 |
| **Rúcula** | ··· | ○○○ | ●●● | ●●● | ●●● | ●●● | ●●● | ●●● | ●●● | ●●● | ●●● | ··· | afinado (0) | 7 |

<details><summary>Trasplante de este grupo</summary>

| Especie | E | F | M | A | M | J | J | A | S | O | N | D |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Acelga** | ○○○ | ○○○ | ○○○ | ●●● | ●●● | ●●● | ○○○ | ○○○ | ○○○ | ●●● | ●●● | ●●● |
| **Apio** | ●●● | ●●● | ●●● | ●●● | ●●● | ●●● | ··· | ··· | ··· | ··· | ○○○ | ●●● |
| **Brócoli** | ○○○ | ··· | ●●● | ●●● | ●●● | ··· | ··· | ··· | ··· | ●●● | ●●● | ○○○ |
| **Coliflor** | ●●● | ○○○ | ··· | ●●● | ●●● | ●●● | ··· | ··· | ··· | ··· | ●●● | ●●● |
| **Espinaca** | ··· | ··· | ○○○ | ●●● | ●●● | ●●● | ●●● | ○○○ | ○○○ | ··· | ··· | ··· |
| **Kale (col rizada)** | ··· | ··· | ●●● | ●●● | ○○○ | ○○○ | ○○○ | ○○○ | ○○○ | ○○○ | ○○○ | ··· |
| **Lechuga** | ··· | ··· | ○○○ | ●●● | ●●● | ○○○ | ○○○ | ○○○ | ●●● | ●●● | ●●● | ●●● |
| **Repollitos de Bruselas** | ●●● | ●●● | ●●● | ○○○ | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· |
| **Repollo** | ··· | ··· | ●●● | ●●● | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· |

</details>

## Hortaliza de raíz/bulbo (9)

| Especie | E | F | M | A | M | J | J | A | S | O | N | D | Estado | Conf |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|:-:|
| **Ajo** | ··· | ··· | ○○○ | ○●● | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· | fuente explicita | 9 |
| **Batata** | ··· | ··· | ··· | ··· | ··· | ··· | ●●● | ●●● | ○○○ | ··· | ··· | ··· | afinado (2) | 8 |
| **Cebolla** | ··· | ··· | ●●● | ●●● | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· | sin afinar | 5 |
| **Nabo** | ··· | ●●● | ●●● | ●●○ | ○○○ | ··· | ··· | ○○○ | ○○○ | ··· | ··· | ··· | afinado (4) | 7 |
| **Papa** | ○○○ | ○○○ | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ●●● | ●●● | ··· | fuente explicita | 9 |
| **Puerro** | ··· | ●●● | ●●● | ●●● | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· | afinado (0) | 7 |
| **Rabanito** | ○○○ | ●●● | ●●● | ●●○ | ○○○ | ○○○ | ○○○ | ○○○ | ●●● | ●●● | ●●● | ●●● | afinado (7) | 7 |
| **Remolacha** | ··· | ··· | ●●● | ●●○ | ○○○ | ○○○ | ··· | ○○○ | ●●● | ●●● | ●●● | ○○○ | afinado (4) | 7 |
| **Zanahoria** | ○○○ | ○○○ | ●●● | ●○○ | ○○○ | ●●● | ●●● | ●●● | ○○○ | ○○○ | ··· | ○○○ | afinado (8) | 7 |

<details><summary>Trasplante de este grupo</summary>

| Especie | E | F | M | A | M | J | J | A | S | O | N | D |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Batata** | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ·○● | ○○○ | ··· |
| **Cebolla** | ··· | ··· | ··· | ··· | ●●● | ●●● | ○○○ | ··· | ··· | ··· | ··· | ··· |
| **Puerro** | ··· | ··· | ··· | ··· | ●●● | ●●● | ●●● | ··· | ··· | ··· | ··· | ··· |

</details>

## Hortaliza de fruto (11)

| Especie | E | F | M | A | M | J | J | A | S | O | N | D | Estado | Conf |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|:-:|
| **Ají picante** | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ●●● | ●●● | ○○○ | ○○○ | ··· | afinado (2) | 8 |
| **Berenjena** | ··· | ··· | ··· | ··· | ··· | ··· | ·●● | ●●● | ○○○ | ··· | ··· | ··· | fuente explicita | 9 |
| **Choclo / Maíz dulce** | ○○○ | ··· | ··· | ··· | ··· | ··· | ··· | ○○○ | ··· | ○●● | ●●● | ●●● | afinado (4) | 8 |
| **Frutilla** | ··· | ··· | ○○○ | ●●● | ●●● | ○○○ | ··· | ··· | ··· | ··· | ··· | ··· | afinado (0) | 7 |
| **Melón** | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ○○○ | ··· | ○●● | ··· | ··· | afinado (4) | 8 |
| **Pepino** | ··· | ○○○ | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ○●● | ··· | ··· | afinado (4) | 8 |
| **Pimiento / Morrón** | ··· | ··· | ··· | ··· | ··· | ··· | ●●● | ●●● | ●●● | ··· | ··· | ··· | afinado (5) | 8 |
| **Sandía** | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ○○○ | ··· | ○●● | ··· | ··· | afinado (4) | 8 |
| **Tomate** | ○○○ | ··· | ··· | ··· | ··· | ··· | ··· | ●●● | ●●● | ●●● | ○○○ | ○○○ | afinado (5) | 8 |
| **Zapallito de tronco** | ○○○ | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ○●● | ●●● | ●●● | ●●● | afinado (1) | 6 |
| **Zapallo / Calabaza** | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ○●● | ●●● | ··· | afinado (4) | 8 |

<details><summary>Trasplante de este grupo</summary>

| Especie | E | F | M | A | M | J | J | A | S | O | N | D |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Ají picante** | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ·○● | ●●● | ○○○ |
| **Berenjena** | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ·○● | ○○○ | ··· |
| **Pimiento / Morrón** | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ·○● | ○○○ | ··· |
| **Tomate** | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ·○● | ●●● | ○○○ |

</details>

## Legumbre (3)

| Especie | E | F | M | A | M | J | J | A | S | O | N | D | Estado | Conf |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|:-:|
| **Arveja** | ··· | ··· | ··· | ●○○ | ○○○ | ●●● | ○○○ | ○○○ | ··· | ··· | ··· | ··· | afinado (5) | 7 |
| **Chaucha (poroto / judía)** | ○○○ | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ○●● | ○○○ | ○○○ | afinado (4) | 8 |
| **Haba** | ··· | ··· | ··· | ●●● | ●●● | ●●● | ●●● | ··· | ··· | ··· | ··· | ··· | afinado (0) | 7 |

## Aromática (13)

| Especie | E | F | M | A | M | J | J | A | S | O | N | D | Estado | Conf |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|:-:|
| **Albahaca** | ··· | ○○○ | ○○○ | ··· | ··· | ··· | ··· | ●●● | ●●● | ○○○ | ○○○ | ··· | afinado (5) | 8 |
| **Ciboulette (cebollín)** | ··· | ··· | ○○○ | ○○○ | ··· | ··· | ··· | ●●● | ●●● | ●●● | ●●● | ··· | afinado (0) | 7 |
| **Cilantro** | ··· | ··· | ●●● | ●●● | ○○○ | ··· | ··· | ··· | ●●● | ●●● | ●●● | ··· | afinado (3) | 7 |
| **Eneldo** | ··· | ··· | ●●● | ●●● | ●●● | ··· | ··· | ○○○ | ○○○ | ··· | ··· | ··· | sin afinar | 5 |
| **Laurel** | ··· | ··· | ○○○ | ○○○ | ··· | ··· | ··· | ··· | ●●● | ●●● | ●●● | ··· | sin afinar | 5 |
| **Lavanda** | ··· | ··· | ●●● | ●●● | ○○○ | ··· | ··· | ··· | ●●● | ●●● | ○○○ | ··· | sin afinar | 5 |
| **Melisa (toronjil)** | ··· | ··· | ··· | ○○○ | ○○○ | ○○○ | ··· | ··· | ●●● | ●●● | ●●● | ··· | afinado (0) | 7 |
| **Menta** | ··· | ··· | ○○○ | ○○○ | ··· | ··· | ··· | ○○○ | ●●● | ●●● | ●●● | ··· | afinado (0) | 7 |
| **Orégano** | ··· | ··· | ○○○ | ○○○ | ··· | ··· | ··· | ··· | ●●● | ●●● | ●●● | ··· | sin afinar | 5 |
| **Perejil** | ○○○ | ○○○ | ●●● | ●○○ | ○○○ | ○○○ | ○○○ | ○○○ | ○○○ | ○○○ | ●●● | ○○○ | afinado (5) | 7 |
| **Romero** | ··· | ○○○ | ○○○ | ○○○ | ··· | ··· | ··· | ○○○ | ●●● | ●●● | ●●● | ··· | sin afinar | 5 |
| **Salvia** | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ●●● | ●●● | ●●● | ··· | sin afinar | 5 |
| **Tomillo** | ○○○ | ○○○ | ○○○ | ··· | ··· | ··· | ··· | ○○○ | ●●● | ●●● | ●●● | ○○○ | sin afinar | 5 |

<details><summary>Trasplante de este grupo</summary>

| Especie | E | F | M | A | M | J | J | A | S | O | N | D |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Albahaca** | ··· | ··· | ○○○ | ○○○ | ··· | ··· | ··· | ··· | ··· | ·○● | ●●● | ··· |

</details>

## Flor polinizadora (6)

| Especie | E | F | M | A | M | J | J | A | S | O | N | D | Estado | Conf |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|:-:|
| **Borraja** | ··· | ··· | ●●● | ●●○ | ○○○ | ○●● | ●●● | ●●● | ●●● | ●●● | ●●● | ··· | afinado (5) | 7 |
| **Caléndula** | ··· | ··· | ○○○ | ○○○ | ○○○ | ··· | ··· | ●●● | ●●● | ●●● | ··· | ··· | afinado (0) | 7 |
| **Capuchina (taco de reina)** | ··· | ··· | ●●● | ●●● | ○○○ | ··· | ··· | ··· | ○○○ | ○○○ | ··· | ··· | afinado (3) | 7 |
| **Copete / Tagetes** | ○○○ | ○○○ | ··· | ··· | ··· | ··· | ··· | ○○○ | ○●● | ●●● | ●●● | ●●● | afinado (1) | 6 |
| **Cosmos** | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ○○○ | ○○● | ●●● | ●●● | ··· | afinado (5) | 6 |
| **Girasol** | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ○●● | ●●● | ●●● | ○○○ | afinado (1) | 7 |

<details><summary>Trasplante de este grupo</summary>

| Especie | E | F | M | A | M | J | J | A | S | O | N | D |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Caléndula** | ··· | ··· | ··· | ··· | ○○○ | ○○○ | ○○○ | ··· | ··· | ●●● | ●●● | ●●● |
| **Copete / Tagetes** | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ○○○ | ●●● | ●●● | ○○○ |
| **Cosmos** | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ··· | ●●● | ●●● | ●●● | ○○○ |

</details>

---

## Qué recortó el modelo

Cada línea es una década que el afinado sacó o degradó respecto de lo que decía la fuente. Es la lista para vetar caso por caso.

Son 29 especies con recortes; las otras 26 quedaron tal cual las dejó la fuente.

### Lechuga

Fuente: siembra ideal en los meses 3, 4, 8, 9, 10, 11 · confianza del calendario 7/10

| Década | Regla | Por qué |
|---|---|---|
| fines de octubre | `aire_caluroso` | El grueso del ciclo transcurre a 22.7 °C de media, por encima de los 18 °C que quiere para crecer. |
| principios de noviembre | `aire_caluroso` | El grueso del ciclo transcurre a 23.2 °C de media, por encima de los 18 °C que quiere para crecer. |
| mediados de noviembre | `aire_caluroso` | El grueso del ciclo transcurre a 23.6 °C de media, por encima de los 18 °C que quiere para crecer. |
| fines de noviembre | `aire_caluroso` | El grueso del ciclo transcurre a 24.1 °C de media, por encima de los 18 °C que quiere para crecer. |

### Espinaca

Fuente: siembra ideal en los meses 3, 4, 5, 6 · confianza del calendario 8/10

| Década | Regla | Por qué |
|---|---|---|
| principios de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.8 °C de media, por debajo de los 15 °C que quiere para crecer. |
| mediados de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.4 °C de media, por debajo de los 15 °C que quiere para crecer. |
| fines de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.1 °C de media, por debajo de los 15 °C que quiere para crecer. |
| principios de junio | `aire_fresco` | El grueso del ciclo transcurre a 9.8 °C de media, por debajo de los 15 °C que quiere para crecer. |
| mediados de junio | `aire_fresco` | El grueso del ciclo transcurre a 10.5 °C de media, por debajo de los 15 °C que quiere para crecer. |

### Acelga

Fuente: siembra ideal en los meses 3, 4, 5, 9, 10, 11 · confianza del calendario 7/10

| Década | Regla | Por qué |
|---|---|---|
| fines de abril | `aire_fresco` | El grueso del ciclo transcurre a 10.8 °C de media, por debajo de los 15 °C que quiere para crecer. |
| principios de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.4 °C de media, por debajo de los 15 °C que quiere para crecer. |
| mediados de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.1 °C de media, por debajo de los 15 °C que quiere para crecer. |
| fines de mayo | `aire_fresco` | El grueso del ciclo transcurre a 9.8 °C de media, por debajo de los 15 °C que quiere para crecer. |

### Radicchio / Achicoria

Fuente: siembra ideal en los meses 2, 3, 4, 5 · confianza del calendario 6/10

| Década | Regla | Por qué |
|---|---|---|
| fines de abril | `aire_fresco` | El grueso del ciclo transcurre a 10.8 °C de media, por debajo de los 15 °C que quiere para crecer. |
| principios de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.4 °C de media, por debajo de los 15 °C que quiere para crecer. |
| mediados de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.1 °C de media, por debajo de los 15 °C que quiere para crecer. |
| fines de mayo | `aire_fresco` | El grueso del ciclo transcurre a 9.8 °C de media, por debajo de los 15 °C que quiere para crecer. |

### Nabo

Fuente: siembra ideal en los meses 2, 3, 4, 5 · confianza del calendario 4/10

| Década | Regla | Por qué |
|---|---|---|
| fines de abril | `aire_fresco` | El grueso del ciclo transcurre a 11.7 °C de media, por debajo de los 16 °C que quiere para crecer. |
| principios de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.8 °C de media, por debajo de los 16 °C que quiere para crecer. |
| mediados de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.4 °C de media, por debajo de los 16 °C que quiere para crecer. |
| fines de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.1 °C de media, por debajo de los 16 °C que quiere para crecer. |

### Tomate

Fuente: siembra ideal en los meses 8, 9, 10 · confianza del calendario 9/10

| Década | Regla | Por qué |
|---|---|---|
| principios de septiembre | `helada_trasplante` | Trasplantar a principios de septiembre expone el plantín a un 90 % de probabilidad de helada. |
| mediados de septiembre | `helada_trasplante` | Trasplantar a mediados de septiembre expone el plantín a un 81 % de probabilidad de helada. |
| fines de septiembre | `helada_trasplante` | Trasplantar a fines de septiembre expone el plantín a un 65 % de probabilidad de helada. |
| principios de octubre | `helada_trasplante` | Trasplantar a principios de octubre expone el plantín a un 50 % de probabilidad de helada. |
| mediados de octubre | `helada_trasplante_riesgo` | 33 % de probabilidad de helada a mediados de octubre. |

### Pimiento / Morrón

Fuente: siembra ideal en los meses 7, 8, 9 · confianza del calendario 8/10

| Década | Regla | Por qué |
|---|---|---|
| principios de septiembre | `helada_trasplante` | Trasplantar a principios de septiembre expone el plantín a un 90 % de probabilidad de helada. |
| mediados de septiembre | `helada_trasplante` | Trasplantar a mediados de septiembre expone el plantín a un 81 % de probabilidad de helada. |
| fines de septiembre | `helada_trasplante` | Trasplantar a fines de septiembre expone el plantín a un 65 % de probabilidad de helada. |
| principios de octubre | `helada_trasplante` | Trasplantar a principios de octubre expone el plantín a un 50 % de probabilidad de helada. |
| mediados de octubre | `helada_trasplante_riesgo` | 33 % de probabilidad de helada a mediados de octubre. |

### Ají picante

Fuente: siembra ideal en los meses 8, 9 · confianza del calendario 5/10

| Década | Regla | Por qué |
|---|---|---|
| principios de octubre | `helada_trasplante` | Trasplantar a principios de octubre expone el plantín a un 50 % de probabilidad de helada. |
| mediados de octubre | `helada_trasplante_riesgo` | 33 % de probabilidad de helada a mediados de octubre. |

### Berenjena

Fuente: siembra ideal en los meses 7, 8 · confianza del calendario 8/10

| Década | Regla | Por qué |
|---|---|---|
| principios de septiembre | `helada_trasplante` | Trasplantar a principios de septiembre expone el plantín a un 90 % de probabilidad de helada. |
| mediados de septiembre | `helada_trasplante` | Trasplantar a mediados de septiembre expone el plantín a un 81 % de probabilidad de helada. |
| fines de septiembre | `helada_trasplante` | Trasplantar a fines de septiembre expone el plantín a un 65 % de probabilidad de helada. |
| principios de octubre | `helada_trasplante` | Trasplantar a principios de octubre expone el plantín a un 50 % de probabilidad de helada. |
| mediados de octubre | `helada_trasplante_riesgo` | 33 % de probabilidad de helada a mediados de octubre. |

### Zapallito de tronco

Fuente: siembra ideal en los meses 9, 10, 11, 12 · confianza del calendario 8/10

| Década | Regla | Por qué |
|---|---|---|
| principios de septiembre | `suelo_frio` | Con 13.2 °C de media, el suelo de principios de septiembre probablemente no llegue a los 15 °C que necesita para germinar. |

### Zapallo / Calabaza

Fuente: siembra ideal en los meses 10, 11 · confianza del calendario 8/10

| Década | Regla | Por qué |
|---|---|---|
| principios de septiembre | `helada` | Sembrando a principios de septiembre emerge a mediados de septiembre, cuando todavía hay 81 % de probabilidad de helada — y la helada la mata. |
| mediados de septiembre | `helada` | Sembrando a mediados de septiembre emerge a fines de septiembre, cuando todavía hay 65 % de probabilidad de helada — y la helada la mata. |
| fines de septiembre | `helada` | Sembrando a fines de septiembre emerge a principios de octubre, cuando todavía hay 50 % de probabilidad de helada — y la helada la mata. |
| principios de octubre | `helada_riesgo` | Emerge a mediados de octubre, con 33 % de probabilidad de helada. |

### Pepino

Fuente: siembra ideal en los meses 9, 10 · confianza del calendario 7/10

| Década | Regla | Por qué |
|---|---|---|
| principios de septiembre | `helada` | Sembrando a principios de septiembre emerge a mediados de septiembre, cuando todavía hay 81 % de probabilidad de helada — y la helada la mata. |
| mediados de septiembre | `helada` | Sembrando a mediados de septiembre emerge a fines de septiembre, cuando todavía hay 65 % de probabilidad de helada — y la helada la mata. |
| fines de septiembre | `helada` | Sembrando a fines de septiembre emerge a principios de octubre, cuando todavía hay 50 % de probabilidad de helada — y la helada la mata. |
| principios de octubre | `helada_riesgo` | Emerge a mediados de octubre, con 33 % de probabilidad de helada. |

### Melón

Fuente: siembra ideal en los meses 10 · confianza del calendario 8/10

| Década | Regla | Por qué |
|---|---|---|
| principios de septiembre | `helada` | Sembrando a principios de septiembre emerge a mediados de septiembre, cuando todavía hay 81 % de probabilidad de helada — y la helada la mata. |
| mediados de septiembre | `helada` | Sembrando a mediados de septiembre emerge a fines de septiembre, cuando todavía hay 65 % de probabilidad de helada — y la helada la mata. |
| fines de septiembre | `helada` | Sembrando a fines de septiembre emerge a principios de octubre, cuando todavía hay 50 % de probabilidad de helada — y la helada la mata. |
| principios de octubre | `helada_riesgo` | Emerge a mediados de octubre, con 33 % de probabilidad de helada. |

### Sandía

Fuente: siembra ideal en los meses 9, 10 · confianza del calendario 8/10

| Década | Regla | Por qué |
|---|---|---|
| principios de septiembre | `helada` | Sembrando a principios de septiembre emerge a mediados de septiembre, cuando todavía hay 81 % de probabilidad de helada — y la helada la mata. |
| mediados de septiembre | `helada` | Sembrando a mediados de septiembre emerge a fines de septiembre, cuando todavía hay 65 % de probabilidad de helada — y la helada la mata. |
| fines de septiembre | `helada` | Sembrando a fines de septiembre emerge a principios de octubre, cuando todavía hay 50 % de probabilidad de helada — y la helada la mata. |
| principios de octubre | `helada_riesgo` | Emerge a mediados de octubre, con 33 % de probabilidad de helada. |

### Choclo / Maíz dulce

Fuente: siembra ideal en los meses 10, 11, 12 · confianza del calendario 8/10

| Década | Regla | Por qué |
|---|---|---|
| principios de septiembre | `helada` | Sembrando a principios de septiembre emerge a mediados de septiembre, cuando todavía hay 81 % de probabilidad de helada — y la helada la mata. |
| mediados de septiembre | `helada` | Sembrando a mediados de septiembre emerge a fines de septiembre, cuando todavía hay 65 % de probabilidad de helada — y la helada la mata. |
| fines de septiembre | `helada` | Sembrando a fines de septiembre emerge a principios de octubre, cuando todavía hay 50 % de probabilidad de helada — y la helada la mata. |
| principios de octubre | `helada_riesgo` | Emerge a mediados de octubre, con 33 % de probabilidad de helada. |

### Chaucha (poroto / judía)

Fuente: siembra ideal en los meses 9, 10 · confianza del calendario 8/10

| Década | Regla | Por qué |
|---|---|---|
| principios de septiembre | `helada` | Sembrando a principios de septiembre emerge a mediados de septiembre, cuando todavía hay 81 % de probabilidad de helada — y la helada la mata. |
| mediados de septiembre | `helada` | Sembrando a mediados de septiembre emerge a fines de septiembre, cuando todavía hay 65 % de probabilidad de helada — y la helada la mata. |
| fines de septiembre | `helada` | Sembrando a fines de septiembre emerge a principios de octubre, cuando todavía hay 50 % de probabilidad de helada — y la helada la mata. |
| principios de octubre | `helada_riesgo` | Emerge a mediados de octubre, con 33 % de probabilidad de helada. |

### Arveja

Fuente: siembra ideal en los meses 4, 5, 6 · confianza del calendario 8/10

| Década | Regla | Por qué |
|---|---|---|
| mediados de abril | `aire_fresco` | El grueso del ciclo transcurre a 10.8 °C de media, por debajo de los 15 °C que quiere para crecer. |
| fines de abril | `aire_fresco` | El grueso del ciclo transcurre a 10.4 °C de media, por debajo de los 15 °C que quiere para crecer. |
| principios de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.1 °C de media, por debajo de los 15 °C que quiere para crecer. |
| mediados de mayo | `aire_fresco` | El grueso del ciclo transcurre a 9.8 °C de media, por debajo de los 15 °C que quiere para crecer. |
| fines de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.5 °C de media, por debajo de los 15 °C que quiere para crecer. |

### Zanahoria

Fuente: siembra ideal en los meses 3, 4, 5, 6, 7, 8 · confianza del calendario 7/10

| Década | Regla | Por qué |
|---|---|---|
| mediados de abril | `aire_fresco` | El grueso del ciclo transcurre a 10.8 °C de media, por debajo de los 15 °C que quiere para crecer. |
| fines de abril | `aire_fresco` | El grueso del ciclo transcurre a 10.4 °C de media, por debajo de los 15 °C que quiere para crecer. |
| principios de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.1 °C de media, por debajo de los 15 °C que quiere para crecer. |
| mediados de mayo | `aire_fresco` | El grueso del ciclo transcurre a 9.8 °C de media, por debajo de los 15 °C que quiere para crecer. |
| fines de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.5 °C de media, por debajo de los 15 °C que quiere para crecer. |
| principios de noviembre | `calor_extremo` | Sembrando a principios de noviembre la planta crece con máximas de 29.9 °C, por encima de lo que tolera (28 °C). |
| mediados de noviembre | `calor_extremo` | Sembrando a mediados de noviembre la planta crece con máximas de 30.3 °C, por encima de lo que tolera (28 °C). |
| fines de noviembre | `calor_extremo` | Sembrando a fines de noviembre la planta crece con máximas de 29.8 °C, por encima de lo que tolera (28 °C). |

### Remolacha

Fuente: siembra ideal en los meses 3, 4, 5, 9, 10, 11 · confianza del calendario 8/10

| Década | Regla | Por qué |
|---|---|---|
| fines de abril | `aire_fresco` | El grueso del ciclo transcurre a 10.8 °C de media, por debajo de los 15 °C que quiere para crecer. |
| principios de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.4 °C de media, por debajo de los 15 °C que quiere para crecer. |
| mediados de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.1 °C de media, por debajo de los 15 °C que quiere para crecer. |
| fines de mayo | `aire_fresco` | El grueso del ciclo transcurre a 9.8 °C de media, por debajo de los 15 °C que quiere para crecer. |

### Rabanito

Fuente: siembra ideal en los meses 2, 3, 4, 5, 6, 9, 10, 11, 12 · confianza del calendario 8/10

| Década | Regla | Por qué |
|---|---|---|
| fines de abril | `aire_fresco` | El grueso del ciclo transcurre a 13.6 °C de media, por debajo de los 18 °C que quiere para crecer. |
| principios de mayo | `aire_fresco` | El grueso del ciclo transcurre a 12.6 °C de media, por debajo de los 18 °C que quiere para crecer. |
| mediados de mayo | `aire_fresco` | El grueso del ciclo transcurre a 11.7 °C de media, por debajo de los 18 °C que quiere para crecer. |
| fines de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.8 °C de media, por debajo de los 18 °C que quiere para crecer. |
| principios de junio | `aire_fresco` | El grueso del ciclo transcurre a 10.4 °C de media, por debajo de los 18 °C que quiere para crecer. |
| mediados de junio | `aire_fresco` | El grueso del ciclo transcurre a 10.1 °C de media, por debajo de los 18 °C que quiere para crecer. |
| fines de junio | `aire_fresco` | El grueso del ciclo transcurre a 9.8 °C de media, por debajo de los 18 °C que quiere para crecer. |

### Batata

Fuente: siembra ideal en los meses 7, 8 · confianza del calendario 7/10

| Década | Regla | Por qué |
|---|---|---|
| principios de octubre | `helada_trasplante` | Trasplantar a principios de octubre expone el plantín a un 50 % de probabilidad de helada. |
| mediados de octubre | `helada_trasplante_riesgo` | 33 % de probabilidad de helada a mediados de octubre. |

### Albahaca

Fuente: siembra ideal en los meses 8, 9 · confianza del calendario 7/10

| Década | Regla | Por qué |
|---|---|---|
| principios de septiembre | `helada_trasplante` | Trasplantar a principios de septiembre expone el plantín a un 90 % de probabilidad de helada. |
| mediados de septiembre | `helada_trasplante` | Trasplantar a mediados de septiembre expone el plantín a un 81 % de probabilidad de helada. |
| fines de septiembre | `helada_trasplante` | Trasplantar a fines de septiembre expone el plantín a un 65 % de probabilidad de helada. |
| principios de octubre | `helada_trasplante` | Trasplantar a principios de octubre expone el plantín a un 50 % de probabilidad de helada. |
| mediados de octubre | `helada_trasplante_riesgo` | 33 % de probabilidad de helada a mediados de octubre. |

### Perejil

Fuente: siembra ideal en los meses 3, 4, 5, 11 · confianza del calendario 7/10

| Década | Regla | Por qué |
|---|---|---|
| mediados de abril | `aire_fresco` | El grueso del ciclo transcurre a 10.8 °C de media, por debajo de los 15 °C que quiere para crecer. |
| fines de abril | `aire_fresco` | El grueso del ciclo transcurre a 10.4 °C de media, por debajo de los 15 °C que quiere para crecer. |
| principios de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.1 °C de media, por debajo de los 15 °C que quiere para crecer. |
| mediados de mayo | `aire_fresco` | El grueso del ciclo transcurre a 9.8 °C de media, por debajo de los 15 °C que quiere para crecer. |
| fines de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.5 °C de media, por debajo de los 15 °C que quiere para crecer. |

### Cilantro

Fuente: siembra ideal en los meses 3, 4, 5, 9, 10, 11 · confianza del calendario 6/10

| Década | Regla | Por qué |
|---|---|---|
| principios de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.8 °C de media, por debajo de los 15 °C que quiere para crecer. |
| mediados de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.4 °C de media, por debajo de los 15 °C que quiere para crecer. |
| fines de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.1 °C de media, por debajo de los 15 °C que quiere para crecer. |

### Copete / Tagetes

Fuente: siembra ideal en los meses 9, 10, 11, 12 · confianza del calendario 6/10

| Década | Regla | Por qué |
|---|---|---|
| principios de septiembre | `suelo_frio` | Con 13.2 °C de media, el suelo de principios de septiembre probablemente no llegue a los 15 °C que necesita para germinar. |

### Borraja

Fuente: siembra ideal en los meses 3, 4, 5, 6, 7, 8, 9, 10, 11 · confianza del calendario 5/10

| Década | Regla | Por qué |
|---|---|---|
| fines de abril | `aire_fresco` | El grueso del ciclo transcurre a 10.8 °C de media, por debajo de los 15 °C que quiere para crecer. |
| principios de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.4 °C de media, por debajo de los 15 °C que quiere para crecer. |
| mediados de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.1 °C de media, por debajo de los 15 °C que quiere para crecer. |
| fines de mayo | `aire_fresco` | El grueso del ciclo transcurre a 9.8 °C de media, por debajo de los 15 °C que quiere para crecer. |
| principios de junio | `aire_fresco` | El grueso del ciclo transcurre a 10.5 °C de media, por debajo de los 15 °C que quiere para crecer. |

### Capuchina (taco de reina)

Fuente: siembra ideal en los meses 3, 4, 5 · confianza del calendario 7/10

| Década | Regla | Por qué |
|---|---|---|
| principios de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.8 °C de media, por debajo de los 15 °C que quiere para crecer. |
| mediados de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.4 °C de media, por debajo de los 15 °C que quiere para crecer. |
| fines de mayo | `aire_fresco` | El grueso del ciclo transcurre a 10.1 °C de media, por debajo de los 15 °C que quiere para crecer. |

### Cosmos

Fuente: siembra ideal en los meses 8, 9, 10, 11 · confianza del calendario 5/10

| Década | Regla | Por qué |
|---|---|---|
| principios de agosto | `suelo_frio` | Con 11.2 °C de media, el suelo de principios de agosto probablemente no llegue a los 16 °C que necesita para germinar. |
| mediados de agosto | `suelo_frio` | Con 11.8 °C de media, el suelo de mediados de agosto probablemente no llegue a los 16 °C que necesita para germinar. |
| fines de agosto | `suelo_frio` | Con 12.5 °C de media, el suelo de fines de agosto probablemente no llegue a los 16 °C que necesita para germinar. |
| principios de septiembre | `suelo_frio` | Con 13.2 °C de media, el suelo de principios de septiembre probablemente no llegue a los 16 °C que necesita para germinar. |
| mediados de septiembre | `suelo_frio` | Con 13.8 °C de media, el suelo de mediados de septiembre probablemente no llegue a los 16 °C que necesita para germinar. |

### Girasol

Fuente: siembra ideal en los meses 9, 10, 11 · confianza del calendario 6/10

| Década | Regla | Por qué |
|---|---|---|
| principios de septiembre | `aire_fresco` | El grueso del ciclo transcurre a 15.8 °C de media, por debajo de los 20 °C que quiere para crecer. |

---

## Especies sin afinar

El modelo no las representa bien, así que quedan a resolución mensual. Un "sin afinar" honesto es mejor que una precisión falsa.

| Especie | Por qué |
|---|---|
| **Cebolla** | Cultivo fotoperiódico clásico: el bulbo se forma por duración del día, según el tipo de variedad. |
| **Orégano** | Perenne leñosa: tolera el invierno del GBA sin problema; el límite es la humedad, no el frío. |
| **Tomillo** | Perenne leñosa: tolera de sobra el invierno del GBA; lo que la complica es la humedad del verano. |
| **Romero** | Perenne leñosa: en el GBA no la limita el frío sino la humedad del verano, que este modelo no mide. |
| **Salvia** | Perenne leñosa: el invierno no la limita; en La Plata está documentada la antracnosis por humedad estival. |
| **Laurel** | Perenne leñoso de crecimiento muy lento: la fecha exacta de plantación casi no incide. |
| **Eneldo** | Se va a flor por fotoperíodo (día largo, umbral crítico de 11-14 h), no por calor. La temperatura sola no explica su ventana. |
| **Lavanda** | Perenne leñosa: la limita la humedad estival del GBA (72-76 % contra el 40-50 % que prefiere), no la temperatura. |

## Especies con precisión sub-mensual dicha por la fuente

Acá no hubo que estimar: alguien lo publicó. La cita manda sobre el modelo.

- **Berenjena** — Manual UNLu: "mediados de julio-agosto" para el almácigo protegido.
- **Papa** — UNLP: "más del 96 % de la superficie de Buenos Aires se planta entre octubre y noviembre" (papa semitardía). El modelo, por su lado, degrada agosto y septiembre porque la emergencia cae en riesgo de helada — que es exactamente lo que la papa semitardía viene a esquivar.
- **Ajo** — La Nación, sobre criterio INTA: "a partir de mediados de abril es el período ideal". Marzo y principios de abril quedan como posibles.

---

## Cuánto cambia según la zona

| Zona | Estación de referencia | Última helada (3 °C) | Días de helada/año |
|---|---|---|---|
| **Núcleo urbano** | Buenos Aires Observatorio (SMN) · Observatorio 3 °C (FAUBA) | 6-sep | 1 |
| **Conurbano** | Ezeiza Aero (SMN) · Ezeiza Aero 3 °C (FAUBA) | 5-oct | 12.4 |
| **Periurbano o rural** | La Plata Aero (SMN) · La Plata Aero 3 °C (FAUBA) | 11-oct | 10.7 |

Entre el Observatorio y La Plata hay 35 días de diferencia en la última helada agrometeorológica, y doce veces más días de helada al año. (En el extremo, tomando Aeroparque en vez del Observatorio, la brecha dentro del AMBA llega a 71 días.) Estas son las especies donde más se nota:

| Especie | Núcleo urbano | Conurbano | Periurbano |
|---|---|---|---|
| **Zapallito de tronco** | principios de septiembre → fines de diciembre | mediados de septiembre → fines de diciembre | fines de septiembre → fines de diciembre |
| **Zapallo / Calabaza** | principios de octubre → fines de noviembre | mediados de octubre → fines de noviembre | fines de octubre → fines de noviembre |
| **Pepino** | mediados de septiembre → fines de octubre | mediados de octubre → fines de octubre | fines de octubre → fines de octubre |
| **Melón** | principios de octubre → fines de octubre | mediados de octubre → fines de octubre | fines de octubre → fines de octubre |
| **Sandía** | mediados de septiembre → fines de octubre | mediados de octubre → fines de octubre | fines de octubre → fines de octubre |
| **Choclo / Maíz dulce** | principios de octubre → fines de diciembre | mediados de octubre → fines de diciembre | fines de octubre → fines de diciembre |
| **Chaucha (poroto / judía)** | mediados de septiembre → fines de octubre | mediados de octubre → fines de octubre | fines de octubre → fines de octubre |
| **Copete / Tagetes** | principios de septiembre → fines de diciembre | mediados de septiembre → fines de diciembre | fines de septiembre → fines de diciembre |
| **Capuchina (taco de reina)** | principios de marzo → fines de mayo | principios de marzo → fines de abril | principios de marzo → fines de abril |
| **Cosmos** | mediados de septiembre → fines de noviembre | fines de septiembre → fines de noviembre | principios de octubre → fines de noviembre |

---

<details><summary>El modelo climático, década por década</summary>

| Década | Media urbano | Media conurbano | Media periurbano | Helada urbano | Helada conurbano | Helada periurbano |
|---|--:|--:|--:|--:|--:|--:|
| principios de enero | 24.5 | 23.6 | 22.6 | 0 % | 0 % | 0 % |
| mediados de enero | 24.9 | 24.1 | 23.1 | 0 % | 0 % | 0 % |
| fines de enero | 24.5 | 23.7 | 22.8 | 0 % | 0 % | 0 % |
| principios de febrero | 24.2 | 23.4 | 22.5 | 0 % | 0 % | 0 % |
| mediados de febrero | 23.8 | 23.0 | 22.2 | 0 % | 0 % | 0 % |
| fines de febrero | 23.2 | 22.3 | 21.5 | 0 % | 0 % | 0 % |
| principios de marzo | 22.6 | 21.7 | 20.9 | 0 % | 0 % | 0 % |
| mediados de marzo | 22.0 | 21.0 | 20.2 | 0 % | 0 % | 0 % |
| fines de marzo | 20.7 | 19.6 | 18.9 | 0 % | 2 % | 2 % |
| principios de abril | 19.4 | 18.4 | 17.6 | 1 % | 7 % | 6 % |
| mediados de abril | 18.2 | 17.1 | 16.4 | 2 % | 19 % | 16 % |
| fines de abril | 17.0 | 15.8 | 15.2 | 6 % | 43 % | 34 % |
| principios de mayo | 15.9 | 14.8 | 14.1 | 13 % | 65 % | 52 % |
| mediados de mayo | 14.8 | 13.6 | 13.0 | 25 % | 84 % | 72 % |
| fines de mayo | 13.8 | 12.6 | 12.0 | 44 % | 95 % | 88 % |
| principios de junio | 12.9 | 11.7 | 11.0 | 63 % | 99 % | 95 % |
| mediados de junio | 12.0 | 10.8 | 10.1 | 79 % | 100 % | 99 % |
| fines de junio | 11.6 | 10.4 | 9.8 | 91 % | 100 % | 100 % |
| principios de julio | 11.3 | 10.1 | 9.5 | 96 % | 100 % | 100 % |
| mediados de julio | 11.0 | 9.8 | 9.2 | 98 % | 100 % | 100 % |
| fines de julio | 11.7 | 10.5 | 9.8 | 96 % | 100 % | 100 % |
| principios de agosto | 12.4 | 11.2 | 10.4 | 92 % | 100 % | 100 % |
| mediados de agosto | 13.0 | 11.8 | 11.0 | 83 % | 99 % | 100 % |
| fines de agosto | 13.7 | 12.5 | 11.6 | 68 % | 96 % | 99 % |
| principios de septiembre | 14.3 | 13.2 | 12.2 | 52 % | 90 % | 96 % |
| mediados de septiembre | 14.9 | 13.8 | 12.8 | 35 % | 81 % | 90 % |
| fines de septiembre | 16.0 | 14.9 | 13.9 | 19 % | 65 % | 77 % |
| principios de octubre | 16.9 | 15.8 | 14.9 | 10 % | 50 % | 62 % |
| mediados de octubre | 17.9 | 16.8 | 15.9 | 5 % | 33 % | 42 % |
| fines de octubre | 19.0 | 17.9 | 16.9 | 2 % | 18 % | 23 % |
| principios de noviembre | 19.9 | 19.0 | 17.9 | 1 % | 9 % | 11 % |
| mediados de noviembre | 20.9 | 20.0 | 18.8 | 0 % | 4 % | 4 % |
| fines de noviembre | 21.9 | 21.0 | 19.8 | 0 % | 1 % | 1 % |
| principios de diciembre | 22.7 | 21.8 | 20.7 | 0 % | 0 % | 0 % |
| mediados de diciembre | 23.6 | 22.7 | 21.6 | 0 % | 0 % | 0 % |
| fines de diciembre | 24.1 | 23.2 | 22.1 | 0 % | 0 % | 0 % |

</details>

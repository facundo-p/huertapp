# Compostaje: qué dijeron las fuentes y qué quedó afuera

La sección Compost de la app sale de `data/compostaje.json`. Este archivo es
la trastienda: qué fuente se leyó, qué dijo cada una en los puntos que
importan, dónde se contradicen, y qué afirmaba el prototipo de diseño que
ninguna fuente respalda y por eso quedó en `null` (la app lo muestra como
«s/d»).

Fecha de la investigación: 2026-09-07. Criterio: el mismo del catálogo. Sin
fuente no hay dato; entre fuentes que discrepan, el rango con la confianza
que corresponda; ante el prototipo, gana la fuente.

## Fuentes

| id | Quién | Qué | Año |
|---|---|---|---|
| `inti-inta` | INTI Córdoba + INTA ProHuerta Córdoba (Benitez, Silbert) | *Instructivo para la producción de compost domiciliario* | s/f |
| `opds` | OPDS, Provincia de Buenos Aires | *Manual de compostaje domiciliario*, v1.29 | 2020 |
| `gcba` | Ciudad de Buenos Aires, Higiene Urbana | *Guía de compostaje domiciliario* | 2022 |
| `santafe` | Ministerio de Ambiente de Santa Fe | *Guía para compostaje domiciliario* | 2024 |
| `fao` | FAO RLC (Román, Martínez, Pantoja) | *Manual de compostaje del agricultor* | 2013 |

Las tres primeras son del AMBA o de Argentina y hablan de tachos y balcones.
Santa Fe es de otro clima: se cita solo en lo que no depende de él. FAO es
escala de finca: se cita para el proceso (fases, carbono/nitrógeno, humedad,
madurez) y no para volúmenes de balcón.

Se buscó y no se consiguió: material de la FAUBA sobre compostaje domiciliario
(no apareció una guía citable); la nota de INTA Informa «Cómo armar una
abonera en cinco pasos» (la URL ya no existe); el instructivo de la UNLP en su
aula virtual resultó ser una copia del de INTI-INTA.

## Lo que dicen, punto por punto

**Proporción verdes/secos.** INTI-INTA: 1 verde por 2 secos. OPDS: por cada
volumen de húmedos, 1 o 2 de secos. Santa Fe: 2 secos por 1 húmedo. GCBA: 3
marrones por 1 verde. FAO: relación C/N inicial de 25:1 a 35:1; los restos de
cocina solos están en 14:1, el pasto recién cortado en 43:1, las hojas de
árbol en 47:1, el aserrín en 638:1. → *«De 1 a 3 partes de secos por 1 de
verdes; lo más repetido, 2.»* Confianza 9.

**Humedad.** OPDS: «esponja recién exprimida». GCBA: al apretar tiene que
compactarse sin soltar gotas. FAO: 45 a 60 % de agua; prueba del puño: queda
apelmazado sin escurrir. **INTI-INTA discrepa**: dice que si al apretar «se
produce un goteo de agua entre los dedos» la humedad es cercana al 40 % y es
correcta. Se tomó la versión de las otras tres, que coinciden entre sí y con
el rango numérico de FAO. Anotado en el JSON con confianza 9 y acá.

**Aire y volteo.** INTI-INTA y GCBA: mezclar cada 2 o 3 días, sobre todo
mientras se carga. OPDS: 1 o 2 veces por semana. Santa Fe: semanalmente.
FAO: semanal las primeras 3 o 4 semanas, después quincenal. → Se dan los dos
extremos con quién dice cada uno. Confianza 8.

**¿Se puede no girar?** OPDS: los secos aportan estructura y porosidad, y
reducen el apelmazamiento. FAO documenta la «pila sin volteo» (estudio de
caso 6.3): capas alternadas y una chimenea de aire en el centro, lista en 4 a
6 meses, a escala de campo. Para tacho cerrado ninguna fuente da un tiempo sin
girar: **`sin_girar_tiempo` es `null` en tachos.**

**Tiempos.** OPDS: 4 a 6 meses desde que el compartimento dejó de recibir
restos; en verano más rápido, en invierno más lento. GCBA: 3 a 5 meses. Santa
Fe: 3 a 6 meses (cálido / frío). FAO: bidón de 220 L a maduración en 6 a 10
semanas; compost maduro, 3 a 6 meses; fases: mesófila 2 a 8 días, termófila
(>45 °C) de días a meses, enfriamiento varias semanas, maduración meses.
GCBA advierte que una compostera domiciliaria casi nunca llega a los 45 °C
por la poca masa, y que el producto «técnicamente no es compost sino un
bioestabilizado». Se cuenta igual, con la advertencia en el estado
«Cocinando».

**Volúmenes.** OPDS: tacho de pintura de 20 L; corralito de hasta 1 m³. INTI-
INTA: 325 g de restos de cocina por persona y día → 50 L por persona; cajón de
0,7 × 0,8 × 0,5 m para hasta 3 personas, 0,7 × 1,2 para 5, 0,7 × 1,5 para 7.
FAO: pilas de 1,5 a 2 m de alto (finca).

**Qué va.** Las cuatro guías argentinas coinciden en lo básico: restos de
frutas y verduras, yerba, café, té, cáscaras de huevo, servilletas y papel de
cocina manchado, hojas secas, ramitas, pasto, aserrín sin tratar. OPDS: la
cáscara de huevo es «el único residuo animal que compostamos». OPDS y GCBA:
papel y cartón compostan, pero si están limpios mejor reciclarlos.

**Qué no.** Todas: carnes, huesos, pescado, lácteos, grasas y aceites (lentos,
vectores; OPDS explica que en casa no se alcanza la temperatura que
higieniza), heces de perros y gatos (patógenos), residuos sanitarios, químicos
y medicamentos. OPDS: cenizas (alcalinas). GCBA: tabaco (nicotina biocida).
INTI-INTA: malezas con semilla y maderas tratadas. INTI-INTA excluye también
el guano de cerdo y gallina; Santa Fe lo admite de animales no confinados →
confianza 6 en «poco» para jardín.

**Poco.** Cítricos: OPDS (moderados y trozados), GCBA (hasta 20 %), Santa Fe
(bajas cantidades o triturados). Pan y cocidos: OPDS (vegetales, muy poca
proporción), GCBA (panificados, poca cantidad); **INTI-INTA y Santa Fe los
excluyen** (sales, vectores) → confianza 6. Carozos y cáscaras de frutos secos:
tardan (GCBA).

**Señales y problemas.** Las tablas de INTI-INTA, Santa Fe y OPDS coinciden:
mal olor = exceso de humedad o falta de aire (secos + mezclar); mosquitas =
humedad (secos arriba; OPDS agrega la trampa de vinagre); hormigas = seco
(regar); descomposición lenta = seco, frío o exceso de secos; roedores = carne
o lácteos. OPDS suma lo que es buena señal: filamentos blancos (hongos),
larvas de mosca soldado negra, lombrices y bichos bolita en compostera a
suelo, y que levantar temperatura es bueno y no levantarla no es problema.

**Listo.** INTI-INTA, Santa Fe y OPDS: temperatura ambiente, no se reconoce lo
que entró, color oscuro y homogéneo, olor a tierra mojada; OPDS: 4 a 6 meses.
FAO: no vuelve a calentar aunque se voltee; prueba de la bolsa (dos días
cerrada: si se hincha, inmaduro); prueba de la barra (10 minutos al centro:
si sale caliente, sigue). FAO: el compost semimaduro tiene pH ácido y afecta
la germinación; no va para semillas ni plantas delicadas.

**Lixiviado.** OPDS: no aplicar directo en macetas (puede ser ácido o
tóxico); Santa Fe: al jardín diluido 1 en 10; GCBA: si el proceso va bien casi
no aparece. Confianza 7.

## Lo que decía el prototipo y qué pasó con eso

| Prototipo | Fuentes | Resultado |
|---|---|---|
| 1 verde : 2–3 secos | 1:1 a 1:3 según la guía | «1 a 3, lo más repetido 2» |
| Girar cada 2–3 días cocinando, semanal madurando | 2–3 días (INTI-INTA, GCBA) a 1–2/semana (OPDS) | Se dan los dos extremos con su fuente |
| 4–6 semanas cocinando, 3–4 madurando | Nadie separa así; FAO 6–10 semanas en bidón; OPDS 4–6 meses total | Duraciones por sistema con las fuentes |
| 9–12 meses sin voltear | Ninguna fuente | `null` en tachos; a suelo, 4–6 meses (FAO, pila con chimenea) |
| Compostera a suelo «de 300 L en adelante, 3 a 12 meses» | OPDS ≤ 1 m³; 3–6 meses | Corregido |
| «Esponja escurrida» | OPDS, GCBA, FAO | Confirmado |
| Prueba del frasco 3 días sin amoníaco | FAO: bolsa cerrada dos días, se hincha | Reemplazado por la de FAO |
| Prueba de germinación con rabanitos | Ninguna fuente | `null` (`prueba_germinacion`) |
| Poco: cítricos, cebolla y ajo, pan y cocidos | Cítricos sí (3 fuentes); cebolla y ajo, nadie; pan y cocidos, 2 a favor y 2 en contra | Cebolla y ajo fuera; pan y cocidos con confianza 6 |
| Verdes: 1 · Secos: 2 a 3 en la barra de proporción | Ídem primera fila | La barra dibuja 1 : 2 |
| «Si falla una sola, dejalo madurar dos semanas más. El compost inmaduro quema raíces y roba nitrógeno» | FAO: pH ácido, afecta germinación | Reescrito con lo que dice FAO |

## Huecos

- **Tiempo sin girar en tacho** (`sistemas.tachos.girar.sin_girar_tiempo`).
- **Prueba de germinación** (`comun.listo.prueba_germinacion`).
- Cebolla y ajo: ninguna fuente los menciona; no aparecen.
- Plantas enfermas: ninguna guía doméstica las nombra; no aparecen.
- FAUBA: sin documento citable sobre compostaje domiciliario.

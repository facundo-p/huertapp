# 🌱 Especies de huerta urbana — Gran Buenos Aires

> Base de conocimiento por especie con **fuentes** e **índice de confianza (1–10)** por cada dato. Región: **Gran Buenos Aires, Argentina** (clima templado húmedo, hemisferio sur, ~zona USDA 9b–10a). Generado el 2026-08-06. Total: **55 especies**.

Este documento acompaña al archivo `huerta_gba.json` (mismos datos en formato estructurado, pensado como input para una base de datos consultable).

## Cómo leer este documento

Cada dato lleva un **índice de confianza** con este código de color:

- 🟢 **8–10**: fuentes oficiales/técnicas concuerdan — muy confiable.
- 🟡 **5–7**: fuente confiable única o leve discrepancia.
- 🔴 **1–4**: dato divulgativo, inferido o con discrepancia notable — tomar con cautela.
- ⚪ **s/d**: sin dato confiable.

Escala completa: **10** = varias fuentes oficiales independientes concuerdan (prácticamente indiscutible); **1** = tranquilamente podría ser falso. Cuando dos fuentes confiables difieren, se incluyen **ambos valores** con su cita.

### 🗂️ Categorías de suelo (para agrupar cultivos)

- 🟫 **`ARENOSO_DRENANTE`** — Arenoso / drenante: Suelto, arenoso-franco, drenaje libre, no encharcable.
- 🟩 **`FRANCO_FERTIL`** — Franco fértil: Franco equilibrado, fértil, con materia orgánica, retención media.
- 🟦 **`HUMEDO_RICO`** — Húmedo y rico: Muy rico en materia orgánica, retiene bien la humedad (no se seca).
- 🟧 **`PROFUNDO_SUELTO`** — Profundo y suelto: Profundo, mullido y sin piedras/terrones; clave para raíces.
- ⬜ **`RUSTICO_TOLERANTE`** — Rústico / tolerante: Se adapta a suelos pobres o poco exigentes.

### ☀️ Categorías de luz

- ☀️ **`PLENO_SOL`** — Pleno sol: Necesita ≥6 h de sol directo.
- 🌤️ **`SOL_PARCIAL`** — Sol parcial: 4–6 h de sol directo.
- ⛅ **`MEDIA_SOMBRA`** — Media sombra: 2–4 h de sol directo / tolera media sombra.
- 🌑 **`TOLERA_SOMBRA`** — Tolera sombra: Crece con luz indirecta / sin sol directo.

## Índice

**Hortaliza de hoja** (13): [Lechuga](#lechuga), [Espinaca](#espinaca), [Acelga](#acelga), [Rúcula](#rucula), [Kale (col rizada)](#kale-col-rizada), [Repollo](#repollo), [Radicchio / Achicoria](#radicchio-achicoria), [Berro](#berro), [Apio](#apio), [Brócoli](#brocoli), [Coliflor](#coliflor), [Repollitos de Bruselas](#repollitos-de-bruselas), [Cebolla de verdeo](#cebolla-de-verdeo)

**Hortaliza de raíz/bulbo** (9): [Nabo](#nabo), [Zanahoria](#zanahoria), [Remolacha](#remolacha), [Rabanito](#rabanito), [Papa](#papa), [Batata](#batata), [Cebolla](#cebolla), [Ajo](#ajo), [Puerro](#puerro)

**Hortaliza de fruto** (11): [Tomate](#tomate), [Pimiento / Morrón](#pimiento-morron), [Ají picante](#aji-picante), [Berenjena](#berenjena), [Zapallito de tronco](#zapallito-de-tronco), [Zapallo / Calabaza](#zapallo-calabaza), [Pepino](#pepino), [Melón](#melon), [Sandía](#sandia), [Choclo / Maíz dulce](#choclo-maiz-dulce), [Frutilla](#frutilla)

**Legumbre** (3): [Chaucha (poroto / judía)](#chaucha-poroto-judia), [Arveja](#arveja), [Haba](#haba)

**Aromática** (13): [Albahaca](#albahaca), [Perejil](#perejil), [Cilantro](#cilantro), [Orégano](#oregano), [Tomillo](#tomillo), [Romero](#romero), [Salvia](#salvia), [Menta](#menta), [Melisa (toronjil)](#melisa-toronjil), [Ciboulette (cebollín)](#ciboulette-cebollin), [Laurel](#laurel), [Eneldo](#eneldo), [Lavanda](#lavanda)

**Flor polinizadora** (6): [Caléndula](#calendula), [Copete / Tagetes](#copete-tagetes), [Borraja](#borraja), [Capuchina (taco de reina)](#capuchina-taco-de-reina), [Cosmos](#cosmos), [Girasol](#girasol)


---

# Hortaliza de hoja

<a id="lechuga"></a>
## Lechuga  ·  *Lactuca sativa*

- **Fecha/s de siembra** (🟢 8/10): En el Gran Buenos Aires se puede cultivar casi todo el año; las siembras principales son otoño (almácigo en marzo-abril) y fin de invierno-primavera. La UNLP indica que en Buenos Aires se cultiva todo el año, suspendiéndose generalmente entre abril y mayo. INTA/ProHuerta ejemplifica almácigo en marzo con trasplante en mayo. Conviene evitar el pleno verano por subida a flor (espigado).
  - 📚 [Cultivo de lechuga (Lactuca sativa)](https://aulavirtual.agro.unlp.edu.ar/mod/resource/view.php?id=96157) — Facultad de Ciencias Agrarias y Forestales, UNLP; [Calendario de siembra INTA-ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA ProHuerta / Ministerio de Agricultura de la Nación; [Calendario de siembra](https://www.mihuerta.org.ar/wp-content/uploads/2013/11/Calendario-de-siembra.pdf) — Mi Huerta (basado en ProHuerta)
- **Forma/s de siembra** (🟢 9/10): Almácigo y trasplante, o siembra directa (al voleo o en líneas, a menos de 1,5 cm de profundidad). En huerta familiar suele preferirse almácigo y trasplante para aprovechar mejor el espacio y ralear; la directa se usa para lechugas de hoja. INTA/ProHuerta indica 'almácigo y transplante o siembra directa'.
  - 📚 [Cultivo de lechuga (Lactuca sativa)](https://aulavirtual.agro.unlp.edu.ar/mod/resource/view.php?id=96157) — Facultad de Ciencias Agrarias y Forestales, UNLP; [Calendario de siembra INTA-ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA ProHuerta / Ministerio de Agricultura de la Nación
- **Suelo** (🟢 8/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Suelos arcillo-arenosos (franco), con buen contenido de materia orgánica, pH 6 a 7,5 y buen drenaje.
  - ⚠️ *Si no se cumple:* En suelos pesados y encharcados aparecen podredumbres de cuello y raíz (Sclerotinia, Rhizoctonia, Botrytis); con poca materia orgánica el crecimiento es lento y las hojas quedan pobres.
  - 📚 [Cultivo de lechuga (Lactuca sativa)](https://aulavirtual.agro.unlp.edu.ar/mod/resource/view.php?id=96157) — Facultad de Ciencias Agrarias y Forestales, UNLP
- **Luz** (🟡 7/10): 🌤️ **`SOL_PARCIAL`** (Sol parcial) — Requiere buena luz; en huerta urbana tolera sol parcial. La Nación indica que las hojas de hoja son menos exigentes que las de fruto, pidiendo al menos ~5 h de sol. La UNLP advierte que con más de 20 °C y baja iluminación acogolla mal. _(luz directa: mín 4 h, ideal 6 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz se ahíla (se estira), forma hojas laxas y no acogolla bien; las cabezas quedan flojas.
  - 📚 [Huerta urbana: qué necesitás para hacer una en tu balcón](https://www.lanacion.com.ar/sociedad/huerta-urbana-que-necesitas-hacer-tu-balcon-nid2389761/) — La Nación (divulgativa); [Cultivo de lechuga (Lactuca sativa)](https://aulavirtual.agro.unlp.edu.ar/mod/resource/view.php?id=96157) — Facultad de Ciencias Agrarias y Forestales, UNLP
- **Cosecha** (🟢 8/10): Según UNLP, en Buenos Aires: lechugas de hoja ~2 meses (primavera-verano) a 3 meses (otoño-invierno); lechugas de cabeza 3 a 4 meses. Mi Huerta indica 50-85 días. (El calendario INTA cita 25-30 días, valor bajo que probablemente refiera solo a la fase post-trasplante.)
  - ✅ *Listo para cosechar:* Hojas de tamaño de consumo o cabeza compacta y firme; cosechar antes de que la planta 'suba a flor' (emisión del tallo floral).
  - 📚 [Cultivo de lechuga (Lactuca sativa)](https://aulavirtual.agro.unlp.edu.ar/mod/resource/view.php?id=96157) — Facultad de Ciencias Agrarias y Forestales, UNLP; [Calendario de siembra](https://www.mihuerta.org.ar/wp-content/uploads/2013/11/Calendario-de-siembra.pdf) — Mi Huerta (basado en ProHuerta)
- **Germinación** (🟡 6/10): Germina bien con temperaturas de suelo de 15 a 20 °C; no germina con suelo por encima de 30 °C (por eso falla en verano). La semilla puede tener latencia hasta ~2 meses tras la cosecha. Sin dato oficial de días exactos; en la práctica suele emerger en 4-10 días con temperatura adecuada.
  - 📚 [Cultivo de lechuga (Lactuca sativa)](https://aulavirtual.agro.unlp.edu.ar/mod/resource/view.php?id=96157) — Facultad de Ciencias Agrarias y Forestales, UNLP
- **Trasplante** (🟢 8/10): Se trasplanta a los ~25-35 días del almácigo, a 20-30 cm entre plantas y 25-30 cm entre hileras.
  - 🌱 *Listo para trasplantar:* Plantines de 8-10 cm de altura con 5-6 hojas verdaderas.
  - 📚 [Cultivo de lechuga (Lactuca sativa)](https://aulavirtual.agro.unlp.edu.ar/mod/resource/view.php?id=96157) — Facultad de Ciencias Agrarias y Forestales, UNLP
- **Longevidad** (🟡 6/10): Anual; se cosecha una vez (cabeza) o por cortes sucesivos de hojas externas en los tipos de hoja. No rebrota tras espigar.
  - 📚 [Cultivo de lechuga (Lactuca sativa)](https://aulavirtual.agro.unlp.edu.ar/mod/resource/view.php?id=96157) — Facultad de Ciencias Agrarias y Forestales, UNLP
- **Trucos** (🟡 6/10): Sembrar de forma escalonada cada 15-20 días para cosecha continua; no enterrar la semilla (menos de 1,5 cm); en verano dar media sombra y mantener humedad para retrasar la subida a flor; regar de forma pareja evitando encharcar.
  - 📚 [Cultivo de lechuga (Lactuca sativa)](https://aulavirtual.agro.unlp.edu.ar/mod/resource/view.php?id=96157) — Facultad de Ciencias Agrarias y Forestales, UNLP; [Huerta urbana: qué necesitás para hacer una en tu balcón](https://www.lanacion.com.ar/sociedad/huerta-urbana-que-necesitas-hacer-tu-balcon-nid2389761/) — La Nación (divulgativa)
- **Riesgos / a evitar** (🟢 8/10): Subida a flor prematura (espigado) con calor y días largos, que amarga las hojas; encharcamiento que favorece podredumbres de cuello y raíz. Suspender siembras en pleno verano.
  - 📚 [Cultivo de lechuga (Lactuca sativa)](https://aulavirtual.agro.unlp.edu.ar/mod/resource/view.php?id=96157) — Facultad de Ciencias Agrarias y Forestales, UNLP
- **Plagas y enfermedades** (🟢 9/10): Plagas: pulgones (vectores de virus), gusanos grises (Agrotis sp.), larvas de lepidópteros, babosas y caracoles. Enfermedades: Sclerotinia sclerotiorum, Botrytis cinerea, Rhizoctonia solani, mildiu (Bremia lactucae) y virus del mosaico de la lechuga (LMV).
  - 📚 [Cultivo de lechuga (Lactuca sativa)](https://aulavirtual.agro.unlp.edu.ar/mod/resource/view.php?id=96157) — Facultad de Ciencias Agrarias y Forestales, UNLP
- **Se asocia bien con** (🟡 6/10): Se asocia bien con hortalizas de raíz como zanahoria, rabanito y remolacha (se intercalan las hojas entre las líneas de raíces).
  - 📚 [Asociaciones de cultivos en nuestra huerta](https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/) — Fecoagro (Federación de Cooperativas Agropecuarias)
- **Evitar cerca de** (🔴 3/10): Sin dato confiable de fuente argentina consultada. La bibliografía divulgativa suele desaconsejar ubicarla junto a crucíferas grandes (repollo, brócoli) por competencia; tomar con baja confianza.
  - 📚 _(sin fuente registrada)_

<a id="espinaca"></a>
## Espinaca  ·  *Spinacia oleracea*

- **Fecha/s de siembra** (🟢 9/10): Cultivo de estación fría. En GBA se siembra sobre todo en otoño-invierno: almácigo de febrero-marzo a junio y siembra directa a golpe en abril-mayo (INTA/ProHuerta). Evitar temperaturas altas (se espiga). Se puede extender a fin de invierno.
  - 📚 [Calendario de siembra INTA-ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA ProHuerta / Ministerio de Agricultura de la Nación; [Calendario de siembra](https://www.mihuerta.org.ar/wp-content/uploads/2013/11/Calendario-de-siembra.pdf) — Mi Huerta (basado en ProHuerta)
- **Forma/s de siembra** (🟢 8/10): Siembra directa (al voleo o en líneas separadas 0,20 m; INTA la llama 'directa a golpe') o almácigo. En huerta familiar suele preferirse la siembra directa por su rapidez, con raleo posterior a 5-8 cm entre plantas.
  - 📚 [Huerta en casa: cómo cultivar acelga y espinaca](https://www.lanacion.com.ar/revista-jardin/huerta-en-casa-como-cultivar-acelga-y-espinaca-las-preferidas-para-preparar-rellenos-de-tartas-y-nid28052021/) — La Nación - Revista Jardín (divulgativa); [Calendario de siembra INTA-ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA ProHuerta / Ministerio de Agricultura de la Nación
- **Suelo** (🟡 7/10): 🟦 **`HUMEDO_RICO`** (Húmedo y rico) — Suelo profundo, rico en humus (materia orgánica) y con buen drenaje.
  - ⚠️ *Si no se cumple:* En suelo pobre o que se seca produce hojas chicas y se espiga (sube a flor) rápidamente; sin drenaje sufre enfermedades de raíz.
  - 📚 [Huerta en casa: cómo cultivar acelga y espinaca](https://www.lanacion.com.ar/revista-jardin/huerta-en-casa-como-cultivar-acelga-y-espinaca-las-preferidas-para-preparar-rellenos-de-tartas-y-nid28052021/) — La Nación - Revista Jardín (divulgativa)
- **Luz** (🟡 7/10): ⛅ **`MEDIA_SOMBRA`** (Media sombra) — Tolera la sombra y prefiere clima fresco; conviene evitar el sol fuerte y las temperaturas altas del verano. En huerta urbana funciona con sol parcial o media sombra. _(luz directa: mín 3 h, ideal 5-6 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con calor y días largos se espiga muy rápido; en sombra muy densa el crecimiento se enlentece.
  - 📚 [Huerta en casa: cómo cultivar acelga y espinaca](https://www.lanacion.com.ar/revista-jardin/huerta-en-casa-como-cultivar-acelga-y-espinaca-las-preferidas-para-preparar-rellenos-de-tartas-y-nid28052021/) — La Nación - Revista Jardín (divulgativa)
- **Cosecha** (🟡 6/10): Hay discrepancia entre fuentes: INTA/ProHuerta indica 80-100 días; Mi Huerta 45-60 días; La Nación ~2 meses. En la práctica en GBA la primera cosecha suele darse a los 45-70 días según la época.
  - ✅ *Listo para cosechar:* Hojas de tamaño suficiente para consumo (roseta desarrollada); cosechar hojas externas o la planta entera antes de que emita el tallo floral.
  - 📚 [Calendario de siembra INTA-ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA ProHuerta / Ministerio de Agricultura de la Nación; [Calendario de siembra](https://www.mihuerta.org.ar/wp-content/uploads/2013/11/Calendario-de-siembra.pdf) — Mi Huerta (basado en ProHuerta); [Huerta en casa: cómo cultivar acelga y espinaca](https://www.lanacion.com.ar/revista-jardin/huerta-en-casa-como-cultivar-acelga-y-espinaca-las-preferidas-para-preparar-rellenos-de-tartas-y-nid28052021/) — La Nación - Revista Jardín (divulgativa)
- **Germinación** (🔴 4/10): Se siembra a 1-2 cm de profundidad. Sin dato de días exacto en fuente oficial argentina; germina mejor con clima fresco y suele emerger en ~7-14 días (dato adaptado de bibliografía general, baja confianza).
  - 📚 [Huerta en casa: cómo cultivar acelga y espinaca](https://www.lanacion.com.ar/revista-jardin/huerta-en-casa-como-cultivar-acelga-y-espinaca-las-preferidas-para-preparar-rellenos-de-tartas-y-nid28052021/) — La Nación - Revista Jardín (divulgativa)
- **Trasplante** (🟡 6/10): Suele ir en siembra directa y no requerir trasplante (solo raleo a 5-8 cm entre plantas). Si se hace almácigo, se trasplanta cuando el plantín tiene varias hojas verdaderas, a las ~4-6 semanas.
  - 🌱 *Listo para trasplantar:* Plantín con 4-5 hojas verdaderas bien formadas.
  - 📚 [Huerta en casa: cómo cultivar acelga y espinaca](https://www.lanacion.com.ar/revista-jardin/huerta-en-casa-como-cultivar-acelga-y-espinaca-las-preferidas-para-preparar-rellenos-de-tartas-y-nid28052021/) — La Nación - Revista Jardín (divulgativa)
- **Longevidad** (🟡 7/10): Anual. Permite corte selectivo de hojas externas durante 1 a 2 meses, con un rendimiento aproximado de 1 kg de hojas por mes por metro lineal; termina su ciclo al espigar.
  - 📚 [Huerta en casa: cómo cultivar acelga y espinaca](https://www.lanacion.com.ar/revista-jardin/huerta-en-casa-como-cultivar-acelga-y-espinaca-las-preferidas-para-preparar-rellenos-de-tartas-y-nid28052021/) — La Nación - Revista Jardín (divulgativa)
- **Trucos** (🟡 6/10): Sembrar en épocas frescas; mantener riegos frecuentes y regulares; cosechar hojas externas de forma escalonada para prolongar la producción; sembrar de forma escalonada.
  - 📚 [Huerta en casa: cómo cultivar acelga y espinaca](https://www.lanacion.com.ar/revista-jardin/huerta-en-casa-como-cultivar-acelga-y-espinaca-las-preferidas-para-preparar-rellenos-de-tartas-y-nid28052021/) — La Nación - Revista Jardín (divulgativa)
- **Riesgos / a evitar** (🟡 6/10): Se espiga (sube a flor) rápidamente con calor y días largos, perdiendo calidad. Contiene oxalatos: no se recomienda consumir el agua de cocción.
  - 📚 [Huerta en casa: cómo cultivar acelga y espinaca](https://www.lanacion.com.ar/revista-jardin/huerta-en-casa-como-cultivar-acelga-y-espinaca-las-preferidas-para-preparar-rellenos-de-tartas-y-nid28052021/) — La Nación - Revista Jardín (divulgativa)
- **Plagas y enfermedades** (🟡 5/10): Pulgones, babosas y caracoles; entre las enfermedades es común el mildiu (Peronospora). Dato parcialmente adaptado de bibliografía general para hortalizas de hoja.
  - 📚 [Huerta en casa: cómo cultivar acelga y espinaca](https://www.lanacion.com.ar/revista-jardin/huerta-en-casa-como-cultivar-acelga-y-espinaca-las-preferidas-para-preparar-rellenos-de-tartas-y-nid28052021/) — La Nación - Revista Jardín (divulgativa)
- **Se asocia bien con** (🟡 6/10): Se asocia bien con hortalizas de raíz (rabanito, zanahoria, remolacha), intercalándola entre las líneas; buena vecina de coles y frutilla.
  - 📚 [Asociaciones de cultivos en nuestra huerta](https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/) — Fecoagro (Federación de Cooperativas Agropecuarias)
- **Evitar cerca de** (🔴 3/10): Sin dato confiable de fuente argentina consultada; conviene evitar plantarla junto a la acelga/remolacha (mismo género, comparten plagas y compiten). Tomar con baja confianza.
  - 📚 _(sin fuente registrada)_

<a id="acelga"></a>
## Acelga  ·  *Beta vulgaris var. cicla*

- **Fecha/s de siembra** (🟢 8/10): En GBA se puede sembrar prácticamente todo el año (Mi Huerta y La Nación: 'todo el año'). El calendario INTA/ProHuerta ejemplifica siembra en septiembre. Los mejores resultados se dan en otoño y primavera.
  - 📚 [Calendario de siembra INTA-ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA ProHuerta / Ministerio de Agricultura de la Nación; [Calendario de siembra](https://www.mihuerta.org.ar/wp-content/uploads/2013/11/Calendario-de-siembra.pdf) — Mi Huerta (basado en ProHuerta); [Huerta en casa: cómo cultivar acelga y espinaca](https://www.lanacion.com.ar/revista-jardin/huerta-en-casa-como-cultivar-acelga-y-espinaca-las-preferidas-para-preparar-rellenos-de-tartas-y-nid28052021/) — La Nación - Revista Jardín (divulgativa)
- **Forma/s de siembra** (🟢 9/10): Siembra directa 'a chorrillo' con raleo posterior (INTA/ProHuerta), o almácigo y trasplante. Cada 'semilla' es un glomérulo del que nacen varias plantitas juntas, por eso se ralea. Distancia orientativa 0,25 m entre plantas y 0,40-0,50 m entre líneas.
  - 📚 [Calendario de siembra INTA-ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA ProHuerta / Ministerio de Agricultura de la Nación; [Huerta en casa: cómo cultivar acelga y espinaca](https://www.lanacion.com.ar/revista-jardin/huerta-en-casa-como-cultivar-acelga-y-espinaca-las-preferidas-para-preparar-rellenos-de-tartas-y-nid28052021/) — La Nación - Revista Jardín (divulgativa)
- **Suelo** (🟡 7/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Suelo profundo y fértil, con compost incorporado; es rústica y soporta suelos algo pesados e incluso salinos.
  - ⚠️ *Si no se cumple:* Tolera suelos pobres o pesados mejor que otras hojas, pero con poca materia orgánica produce menos hojas y más chicas.
  - 📚 [Huerta en casa: cómo cultivar acelga y espinaca](https://www.lanacion.com.ar/revista-jardin/huerta-en-casa-como-cultivar-acelga-y-espinaca-las-preferidas-para-preparar-rellenos-de-tartas-y-nid28052021/) — La Nación - Revista Jardín (divulgativa)
- **Luz** (🟡 7/10): 🌤️ **`SOL_PARCIAL`** (Sol parcial) — Crece a pleno sol o a media sombra. _(luz directa: mín 3-4 h, ideal 6 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* En sombra densa produce hojas más chicas, laxas y de pencas finas; tarda más.
  - 📚 [Huerta en casa: cómo cultivar acelga y espinaca](https://www.lanacion.com.ar/revista-jardin/huerta-en-casa-como-cultivar-acelga-y-espinaca-las-preferidas-para-preparar-rellenos-de-tartas-y-nid28052021/) — La Nación - Revista Jardín (divulgativa)
- **Cosecha** (🟢 8/10): INTA/ProHuerta y Mi Huerta indican 110-130 días hasta la primera cosecha, con 3 a 5 cortes; La Nación menciona un primer corte hacia los ~2 meses. Luego se cosecha de forma escalonada durante varios meses.
  - ✅ *Listo para cosechar:* Hojas grandes y desarrolladas; se cortan las hojas externas dejando el cogollo central para que rebrote.
  - 📚 [Calendario de siembra INTA-ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA ProHuerta / Ministerio de Agricultura de la Nación; [Calendario de siembra](https://www.mihuerta.org.ar/wp-content/uploads/2013/11/Calendario-de-siembra.pdf) — Mi Huerta (basado en ProHuerta); [Huerta en casa: cómo cultivar acelga y espinaca](https://www.lanacion.com.ar/revista-jardin/huerta-en-casa-como-cultivar-acelga-y-espinaca-las-preferidas-para-preparar-rellenos-de-tartas-y-nid28052021/) — La Nación - Revista Jardín (divulgativa)
- **Germinación** (🟡 5/10): Cada glomérulo da varias plantitas juntas (por eso hay que ralear). Sin dato oficial de días exacto; suele emerger en ~7-15 días (dato adaptado de bibliografía general).
  - 📚 [Huerta en casa: cómo cultivar acelga y espinaca](https://www.lanacion.com.ar/revista-jardin/huerta-en-casa-como-cultivar-acelga-y-espinaca-las-preferidas-para-preparar-rellenos-de-tartas-y-nid28052021/) — La Nación - Revista Jardín (divulgativa)
- **Trasplante** (🟡 6/10): Puede ir en siembra directa (solo raleo, sin trasplante) o en almácigo; en ese caso las plántulas se separan y trasplantan cuando tienen varias hojas verdaderas.
  - 🌱 *Listo para trasplantar:* Plantín con 3-4 hojas verdaderas y ~8-10 cm de altura.
  - 📚 [Huerta en casa: cómo cultivar acelga y espinaca](https://www.lanacion.com.ar/revista-jardin/huerta-en-casa-como-cultivar-acelga-y-espinaca-las-preferidas-para-preparar-rellenos-de-tartas-y-nid28052021/) — La Nación - Revista Jardín (divulgativa)
- **Longevidad** (🟡 7/10): Bianual, cultivada como anual de ciclo largo: una misma planta produce hojas por cortes sucesivos (3 a 5 cortes o más) durante varios meses. En el segundo año o con calor florece y termina su ciclo.
  - 📚 [Calendario de siembra INTA-ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA ProHuerta / Ministerio de Agricultura de la Nación; [Huerta en casa: cómo cultivar acelga y espinaca](https://www.lanacion.com.ar/revista-jardin/huerta-en-casa-como-cultivar-acelga-y-espinaca-las-preferidas-para-preparar-rellenos-de-tartas-y-nid28052021/) — La Nación - Revista Jardín (divulgativa)
- **Trucos** (🟡 7/10): Cosechar siempre las hojas externas dejando el cogollo central para prolongar la producción; ralear para dar espacio; prevenir la 'viruela' (Cercospora) con caldo bordelés; mantener riego regular.
  - 📚 [Huerta en casa: cómo cultivar acelga y espinaca](https://www.lanacion.com.ar/revista-jardin/huerta-en-casa-como-cultivar-acelga-y-espinaca-las-preferidas-para-preparar-rellenos-de-tartas-y-nid28052021/) — La Nación - Revista Jardín (divulgativa)
- **Riesgos / a evitar** (🟡 7/10): Ataque de pájaros, babosas y caracoles sobre plantas jóvenes; la 'viruela' o mancha foliar (Cercospora); se espiga con el calor o en el segundo año.
  - 📚 [Huerta en casa: cómo cultivar acelga y espinaca](https://www.lanacion.com.ar/revista-jardin/huerta-en-casa-como-cultivar-acelga-y-espinaca-las-preferidas-para-preparar-rellenos-de-tartas-y-nid28052021/) — La Nación - Revista Jardín (divulgativa)
- **Plagas y enfermedades** (🟡 6/10): Pájaros, babosas y caracoles; 'viruela' (mancha por Cercospora beticola); también pulgones y minador de la hoja (parcialmente adaptado de bibliografía general).
  - 📚 [Huerta en casa: cómo cultivar acelga y espinaca](https://www.lanacion.com.ar/revista-jardin/huerta-en-casa-como-cultivar-acelga-y-espinaca-las-preferidas-para-preparar-rellenos-de-tartas-y-nid28052021/) — La Nación - Revista Jardín (divulgativa)
- **Se asocia bien con** (🟡 6/10): Se asocia bien con hortalizas de raíz (zanahoria, rabanito, remolacha) y con lechuga, combinando hojas y raíces en el mismo cantero.
  - 📚 [Asociaciones de cultivos en nuestra huerta](https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/) — Fecoagro (Federación de Cooperativas Agropecuarias)
- **Evitar cerca de** (🔴 3/10): Sin dato confiable de fuente argentina consultada; conviene no ubicarla junto a espinaca/remolacha (mismo género, comparten plagas y enfermedades). Tomar con baja confianza.
  - 📚 _(sin fuente registrada)_

<a id="rucula"></a>
## Rúcula  ·  *Eruca sativa*

- **Fecha/s de siembra** (🟡 7/10): Según la Cátedra de Horticultura de la UNLu germina rápido y sin problemas en cualquier época del año, pero el exceso de calor y sol la hacen florecer y amargar; por eso en GBA conviene sembrarla en otoño, invierno y primavera (temperaturas suaves) y evitar el pleno verano.
  - 📚 [Cultivo de rúcula](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/R%C3%BAcula.pdf) — Cátedra de Horticultura, Universidad Nacional de Luján
- **Forma/s de siembra** (🟢 8/10): Siembra directa de asiento en líneas separadas entre 20 y 40 cm, a 5 cm entre plantas y a una profundidad menor a 1 cm. No se hace almácigo.
  - 📚 [Cultivo de rúcula](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/R%C3%BAcula.pdf) — Cátedra de Horticultura, Universidad Nacional de Luján
- **Suelo** (🟡 7/10): ⬜ **`RUSTICO_TOLERANTE`** (Rústico / tolerante) — No tiene mayores exigencias de suelo: se adapta a todos los tipos y soporta suelos alcalinos. Igualmente rinde hojas más tiernas en suelo suelto y con materia orgánica.
  - ⚠️ *Si no se cumple:* Es muy rústica y crece igual; en suelos pobres o secos las hojas quedan más chicas, duras y tienden a amargar/florecer antes.
  - 📚 [Cultivo de rúcula](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/R%C3%BAcula.pdf) — Cátedra de Horticultura, Universidad Nacional de Luján
- **Luz** (🟡 7/10): ⛅ **`MEDIA_SOMBRA`** (Media sombra) — Tolera bien la sombra; el exceso de sol y calor le da sabor muy amargo y favorece la floración. Temperaturas óptimas de crecimiento 25-27 °C, con buen desarrollo con temperaturas suaves. _(luz directa: mín 2-3 h, ideal 4-6 h; sin sol directo: sí)_
  - ⚠️ *Si no se cumple:* Con exceso de sol y calor amarga y se va a flor rápido; con muy poca luz crece más lento y las hojas quedan laxas.
  - 📚 [Cultivo de rúcula](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/R%C3%BAcula.pdf) — Cátedra de Horticultura, Universidad Nacional de Luján
- **Cosecha** (🟡 7/10): Ciclo de cultivo de 20 a 60 días. Se cosecha por cortes: 4 a 5 cortes con intervalos de 10 a 20 días. Puede consumirse desde estado juvenil.
  - ✅ *Listo para cosechar:* Hojas tiernas de tamaño de consumo (aprox. 8-15 cm), cortadas antes de que la planta emita la vara floral (que amarga las hojas).
  - 📚 [Cultivo de rúcula](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/R%C3%BAcula.pdf) — Cátedra de Horticultura, Universidad Nacional de Luján
- **Germinación** (🟡 6/10): Germinación rápida y sin problemas en cualquier época del año. Sin dato de días exacto en la fuente; en la práctica suele emerger en ~4-8 días.
  - 📚 [Cultivo de rúcula](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/R%C3%BAcula.pdf) — Cátedra de Horticultura, Universidad Nacional de Luján
- **Trasplante** (🟢 8/10): No requiere trasplante: se hace siempre en siembra directa. Solo se ralea si nace muy densa.
  - 🌱 *Listo para trasplantar:* No aplica (siembra directa).
  - 📚 [Cultivo de rúcula](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/R%C3%BAcula.pdf) — Cátedra de Horticultura, Universidad Nacional de Luján
- **Longevidad** (🟡 7/10): Anual, de ciclo corto; una misma siembra permite 4 a 5 cortes sucesivos antes de que suba a flor.
  - 📚 [Cultivo de rúcula](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/R%C3%BAcula.pdf) — Cátedra de Horticultura, Universidad Nacional de Luján
- **Trucos** (🟡 7/10): Cosechar joven y hacer cortes sucesivos para prolongar la producción; sembrar de forma escalonada; en verano darle media sombra y buen riego para retrasar la floración y el amargor.
  - 📚 [Cultivo de rúcula](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/R%C3%BAcula.pdf) — Cátedra de Horticultura, Universidad Nacional de Luján
- **Riesgos / a evitar** (🟢 8/10): El exceso de calor y sol provoca sabor excesivamente amargo y favorece la floración (espigado) prematura, que corta la vida útil de la planta.
  - 📚 [Cultivo de rúcula](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/R%C3%BAcula.pdf) — Cátedra de Horticultura, Universidad Nacional de Luján
- **Plagas y enfermedades** (🟡 7/10): Presencia de pulgones; entre las enfermedades, oídio y roya. Por ser crucífera también suele sufrir 'pulguilla' o vaquita de las coles (adaptado de bibliografía general para la familia).
  - 📚 [Cultivo de rúcula](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/R%C3%BAcula.pdf) — Cátedra de Horticultura, Universidad Nacional de Luján
- **Se asocia bien con** (🟡 7/10): Compatible con solanáceas: tomate, pimiento y berenjena.
  - 📚 [Cultivo de rúcula](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/R%C3%BAcula.pdf) — Cátedra de Horticultura, Universidad Nacional de Luján
- **Evitar cerca de** (🟡 7/10): Evitar plantarla cerca de plantas de su misma familia (crucíferas), como las coles, el rábano o el nabo, porque comparten plagas y enfermedades.
  - 📚 [Cultivo de rúcula](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/R%C3%BAcula.pdf) — Cátedra de Horticultura, Universidad Nacional de Luján

<a id="kale-col-rizada"></a>
## Kale (col rizada)  ·  *Brassica oleracea var. sabellica (grupo Acephala)*

- **Fecha/s de siembra** (🟡 7/10): En el clima templado del GBA puede sembrarse casi todo el año, pero es un cultivo típico de otoño-invierno; la siembra principal recomendada es febrero-marzo (óptimo de temperatura 10-20 °C, tolera heladas suaves). Conviene escalonar la siembra cada 2-3 semanas. No figura como especie propia en el calendario oficial de ProHuerta/INTA, por lo que las fechas se toman de material técnico del INTA EEA Anguil.
  - 📚 [Cómo cultivar kale en la huerta familiar](https://www.perfil.com/noticias/agro/como-cultivar-kale-en-la-huerta-familiar.phtml) — Perfil (nota técnica atribuida a INTA EEA Anguil / AER Santa Rosa); [Una fuente de hierro en casa: cómo cultivar kale en la huerta familiar](https://www.infocampo.com.ar/una-fuente-de-hierro-en-casa-como-cultivar-kale-en-la-huerta-familiar/) — Infocampo (cita INTA/ProHuerta)
- **Forma/s de siembra** (🟡 7/10): Se puede hacer en almácigo (recomendado, para trasplantar) o siembra directa. En directa aprox. 40 cm entre plantas y 60 cm entre hileras; en trasplante 20-25 cm entre plantas según variedad. Profundidad ~3 veces el tamaño de la semilla.
  - 📚 [Cómo cultivar kale en la huerta familiar](https://www.perfil.com/noticias/agro/como-cultivar-kale-en-la-huerta-familiar.phtml) — Perfil (INTA EEA Anguil); [Una fuente de hierro en casa: cómo cultivar kale](https://www.infocampo.com.ar/una-fuente-de-hierro-en-casa-como-cultivar-kale-en-la-huerta-familiar/) — Infocampo (cita INTA)
- **Suelo** (🟡 6/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Suelo bien abonado, con buen aporte de nitrógeno, rico en materia orgánica (compost) y con buen drenaje; se adapta a macetas de mínimo 30 cm de profundidad.
  - ⚠️ *Si no se cumple:* En suelos pobres o con poco nitrógeno las plantas crecen poco y las hojas quedan pequeñas y de menor calidad; con drenaje deficiente y encharcamiento aparecen pudriciones de raíz.
  - 📚 [Cómo cultivar kale en la huerta familiar](https://www.perfil.com/noticias/agro/como-cultivar-kale-en-la-huerta-familiar.phtml) — Perfil (INTA EEA Anguil)
- **Luz** (🟡 6/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Requiere al menos 6 horas de sol directo para desarrollo pleno (INTA EEA Anguil). Otra nota que cita al INTA lo ubica entre las hortalizas de hoja que toleran bien la sombra; en verano conviene ubicarlo en lugares con sombra parcial para evitar estrés. Hay discrepancia entre ambas fuentes INTA. _(luz directa: mín 4 h, ideal 6+ h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz las plantas se ahílan (tallos largos y débiles) y las hojas quedan más laxas y menos productivas; sin embargo tolera media sombra mejor que las hortalizas de fruto.
  - 📚 [Cómo cultivar kale en la huerta familiar](https://www.perfil.com/noticias/agro/como-cultivar-kale-en-la-huerta-familiar.phtml) — Perfil (INTA EEA Anguil); [A la sombra: hortalizas que se pueden cultivar sin luz directa](https://www.infocampo.com.ar/a-la-sombra-cuales-son-las-hortalizas-que-se-pueden-cultivar-en-el-hogar-sin-luz-directa/) — Infocampo (cita INTA)
- **Cosecha** (🟡 7/10): Aproximadamente 30-70 días desde la siembra según variedad y época. Se cosechan primero las hojas externas dejando la yema apical (punto de crecimiento) para que la planta rebrote; en plena producción rinde unas 3 hojas por semana durante meses.
  - ✅ *Listo para cosechar:* La planta supera las 5 hojas verdaderas; las hojas externas alcanzan buen tamaño. Se cortan las externas y se deja el cogollo central.
  - 📚 [Cómo cultivar kale en la huerta familiar](https://www.perfil.com/noticias/agro/como-cultivar-kale-en-la-huerta-familiar.phtml) — Perfil (INTA EEA Anguil); [Una fuente de hierro en casa: cómo cultivar kale](https://www.infocampo.com.ar/una-fuente-de-hierro-en-casa-como-cultivar-kale-en-la-huerta-familiar/) — Infocampo (cita INTA)
- **Germinación** (🟡 6/10): Entre 4 y 7 días en condiciones adecuadas de temperatura (10-20 °C).
  - 📚 [Cómo cultivar kale en la huerta familiar](https://www.perfil.com/noticias/agro/como-cultivar-kale-en-la-huerta-familiar.phtml) — Perfil (INTA EEA Anguil)
- **Trasplante** (🟡 6/10): Se trasplanta a las pocas semanas del almácigo, cuando el plantín desarrolló el segundo par de hojas verdaderas (unos 4 hojas / ~20 cm de altura).
  - 🌱 *Listo para trasplantar:* Plantín con 4 hojas verdaderas / segundo par de hojas verdaderas, aprox. 20 cm de altura y tallo firme.
  - 📚 [Cómo cultivar kale en la huerta familiar](https://www.perfil.com/noticias/agro/como-cultivar-kale-en-la-huerta-familiar.phtml) — Perfil (INTA EEA Anguil)
- **Longevidad** (🟡 5/10): Bienal, pero se cultiva como anual. Produce hojas de manera escalonada durante varios meses cosechando siempre las externas; se descarta al espigar/subir a flor.
  - 📚 [Una fuente de hierro en casa: cómo cultivar kale](https://www.infocampo.com.ar/una-fuente-de-hierro-en-casa-como-cultivar-kale-en-la-huerta-familiar/) — Infocampo (cita INTA)
- **Trucos** (🟡 6/10): Cosechar solo hojas externas conservando la yema central para producción prolongada; escalonar siembras cada 2-3 semanas; las heladas suaves mejoran el sabor de las hojas; mantener buena humedad sin encharcar.
  - 📚 [Cómo cultivar kale en la huerta familiar](https://www.perfil.com/noticias/agro/como-cultivar-kale-en-la-huerta-familiar.phtml) — Perfil (INTA EEA Anguil)
- **Riesgos / a evitar** (🟡 6/10): Evitar períodos de heladas extremas y el encharcamiento del suelo (pudre raíces). Como crucífera, no conviene repetirla en el mismo cantero año tras año para prevenir enfermedades del suelo.
  - 📚 [Cómo cultivar kale en la huerta familiar](https://www.perfil.com/noticias/agro/como-cultivar-kale-en-la-huerta-familiar.phtml) — Perfil (INTA EEA Anguil)
- **Plagas y enfermedades** (🟡 6/10): Pulgones, caracoles y babosas; como crucífera también la afectan orugas/lagartas de la col. Se recomiendan estrategias de control ecológico promovidas por INTA.
  - 📚 [Una fuente de hierro en casa: cómo cultivar kale](https://www.infocampo.com.ar/una-fuente-de-hierro-en-casa-como-cultivar-kale-en-la-huerta-familiar/) — Infocampo (cita INTA)
- **Se asocia bien con** (🟡 6/10): Remolacha, apio, pepino, cebolla, espinaca, acelga y papa. Aromáticas como menta, tomillo, salvia y eneldo ayudan a repeler plagas de las coles.
  - 📚 [Cómo cultivar kale en la huerta familiar](https://www.perfil.com/noticias/agro/como-cultivar-kale-en-la-huerta-familiar.phtml) — Perfil (INTA EEA Anguil); [Asociaciones de cultivos en nuestra huerta](https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/) — Fecoagro (Federación de Cooperativas Agropecuarias San Juan)
- **Evitar cerca de** (🟡 5/10): Evitar cerca de legumbres, tomate y frutilla; tampoco conviene junto a otras crucíferas (comparten plagas y enfermedades).
  - 📚 [Cómo cultivar kale en la huerta familiar](https://www.perfil.com/noticias/agro/como-cultivar-kale-en-la-huerta-familiar.phtml) — Perfil (INTA EEA Anguil)

<a id="repollo"></a>
## Repollo  ·  *Brassica oleracea var. capitata*

- **Fecha/s de siembra** (🟢 8/10): Cultivo de otoño-invierno en Argentina. Según el calendario de siembra de ProHuerta/INTA: almácigo en febrero-marzo y trasplante en marzo-abril. (Existen también variedades de otras estaciones, pero la fecha oficial del calendario es feb-mar.)
  - 📚 [Calendario de siembra (Plan Nacional de Seguridad Alimentaria)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / ProHuerta / Ministerio de Desarrollo Social; [Calendario de siembra](https://www.mihuerta.org.ar/wp-content/uploads/2013/11/Calendario-de-siembra.pdf) — Mi Huerta (reproduce calendario ProHuerta-INTA); [El Suelo: calendario de siembra, abono y fertilizantes](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — FIQ - Universidad Nacional del Litoral (reproduce calendario INTA)
- **Forma/s de siembra** (🟢 8/10): Almácigo y posterior trasplante (no se recomienda siembra directa). Distancia de plantación: aprox. 40 cm entre plantas y 50-70 cm entre hileras (35x70 en otra edición del mismo calendario).
  - 📚 [Calendario de siembra (Seguridad Alimentaria)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / ProHuerta; [Calendario de siembra](https://www.mihuerta.org.ar/wp-content/uploads/2013/11/Calendario-de-siembra.pdf) — Mi Huerta (calendario ProHuerta-INTA)
- **Suelo** (🟡 5/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Prefiere suelo franco, fértil, profundo y rico en materia orgánica, con buena retención de humedad y buen drenaje. Dato no detallado en el calendario INTA; se toma de bibliografía hortícola general.
  - ⚠️ *Si no se cumple:* En suelos pobres o compactados las cabezas quedan chicas y sueltas; el déficit hídrico y la fertilidad baja reducen el tamaño y la compacidad de la pella.
  - 📚 [El Suelo: calendario de siembra, abono y fertilizantes](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — FIQ - UNL
- **Luz** (🟡 6/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Prefiere pleno sol para formar cabezas compactas, pero según material que cita al INTA tolera bien la sombra parcial (3-6 horas de luz diaria). _(luz directa: mín 3-6 h, ideal 6+ h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz las plantas se ahílan y forman cabezas flojas o no llegan a acogollar; en verano el exceso de calor y días largos favorece que suban a flor.
  - 📚 [A la sombra: hortalizas que se pueden cultivar sin luz directa](https://www.infocampo.com.ar/a-la-sombra-cuales-son-las-hortalizas-que-se-pueden-cultivar-en-el-hogar-sin-luz-directa/) — Infocampo (cita INTA)
- **Cosecha** (🟢 8/10): Aproximadamente 90-130 días desde la siembra (dato del calendario INTA).
  - ✅ *Listo para cosechar:* Cabeza (pella) bien formada, compacta y firme al tacto; se corta antes de que se abra o suba a flor.
  - 📚 [Calendario de siembra (Seguridad Alimentaria)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / ProHuerta; [El Suelo: calendario de siembra](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — FIQ - UNL (calendario INTA)
- **Germinación** (🔴 3/10): Sin dato específico en el calendario INTA; las crucíferas suelen germinar en aproximadamente 5-10 días con buena temperatura (dato de bibliografía general, no de fuente argentina oficial).
  - 📚 _(sin fuente registrada)_
- **Trasplante** (🟡 6/10): Trasplante en marzo-abril, unas 4-6 semanas después del almácigo de febrero-marzo (según calendario INTA).
  - 🌱 *Listo para trasplantar:* Plantín con 4-6 hojas verdaderas y unos 10-15 cm de altura, con buen sistema radicular (señal de referencia general).
  - 📚 [Calendario de siembra (Seguridad Alimentaria)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / ProHuerta
- **Longevidad** (🟡 5/10): Bienal cultivada como anual; cada planta produce una sola cabeza (aunque algunas variedades pueden dar rebrotes menores tras el corte principal).
  - 📚 _(sin fuente registrada)_
- **Trucos** (🟡 5/10): Mantener riego regular y parejo para evitar el rajado de la cabeza; aporcar y controlar malezas; asociar con aromáticas (eneldo, menta, tomillo, salvia) para reducir plagas de las coles.
  - 📚 [Asociaciones de cultivos en nuestra huerta](https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/) — Fecoagro
- **Riesgos / a evitar** (🔴 4/10): El riego irregular o el exceso de nitrógeno hacen que la cabeza se raje; conviene rotar y no repetir crucíferas en el mismo lugar para evitar la hernia de la col (Plasmodiophora) y otras enfermedades del suelo.
  - 📚 _(sin fuente registrada)_
- **Plagas y enfermedades** (🟡 6/10): Pulgones (áfidos), orugas y lagartas de la col (incluida la polilla Plutella xylostella), y moscas. Se controlan con manejo ecológico y plantas repelentes.
  - 📚 [Asociaciones de cultivos en nuestra huerta](https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/) — Fecoagro
- **Se asocia bien con** (🟡 6/10): Eneldo (reduce gusanos del repollo), menta y tomillo (alejan plagas de las coles y la lagarta de las hojas), salvia (aleja moscas/dípteros), mostaza como planta trampa de pulgones; también zanahoria, remolacha y lechuga.
  - 📚 [Asociaciones de cultivos en nuestra huerta](https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/) — Fecoagro
- **Evitar cerca de** (🔴 3/10): Conviene no juntarlo con otras crucíferas (comparten plagas y enfermedades) ni, según bibliografía general, con frutilla y tomate. Datos parciales.
  - 📚 _(sin fuente registrada)_

<a id="radicchio-achicoria"></a>
## Radicchio / Achicoria  ·  *Cichorium intybus*

- **Fecha/s de siembra** (🟡 7/10): Según el calendario de ProHuerta/INTA la achicoria/radicheta se siembra directa a chorrillo de febrero a mayo (ciclo otoño-invierno); otras ediciones agregan siembras de primavera-verano (octubre-enero) y otoño (junio-julio). Para el radicchio de cabeza (tipo italiano) conviene sembrar a fin de verano-otoño, de modo que acogolle con el frío. Discrepancia: la fecha de siembra otoñal está mejor respaldada que la de primavera.
  - 📚 [Calendario de siembra (Seguridad Alimentaria)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / ProHuerta; [El Suelo: calendario de siembra, abono y fertilizantes](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — FIQ - UNL (calendario INTA)
- **Forma/s de siembra** (🟢 8/10): Siembra directa a chorrillo (en línea) y posterior raleo; también puede sembrarse a golpes. La radicheta se maneja para cortes sucesivos; el radicchio de cabeza puede ir en almácigo y trasplante.
  - 📚 [Calendario de siembra (Seguridad Alimentaria)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / ProHuerta; [El Suelo: calendario de siembra](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — FIQ - UNL (calendario INTA)
- **Suelo** (🟡 5/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Suelo húmedo, bien preparado y moderadamente fértil, de textura franca. Se adapta bien a distintos suelos por su rusticidad.
  - ⚠️ *Si no se cumple:* En suelos muy secos o pobres las plantas quedan chicas, con hojas más duras y amargas y mayor tendencia a subir a flor.
  - 📚 [Cómo cultivar Achicoria roja (radicchio) de manera orgánica](https://www.ecojardinmagico.com/como-cultivar-achicoria-roja-radicchio-de-manera-organica/) — Eco Jardín Mágico (divulgación)
- **Luz** (🟡 5/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Prefiere ubicación soleada (pleno sol) para desarrollo ideal, aunque como hortaliza de hoja tolera bien la media sombra, sobre todo en verano. _(luz directa: mín 3-4 h, ideal 6 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz las plantas se ahílan y las cabezas quedan flojas; con calor y días largos, sumado a estrés, tienden a espigar (subir a flor) y a amargar.
  - 📚 [Cómo cultivar Achicoria roja (radicchio) de manera orgánica](https://www.ecojardinmagico.com/como-cultivar-achicoria-roja-radicchio-de-manera-organica/) — Eco Jardín Mágico (divulgación)
- **Cosecha** (🟡 7/10): Radicheta (hojas): aprox. 70-90 días desde la siembra, admitiendo unos 3 cortes sucesivos (calendario INTA). Radicchio de cabeza: alrededor de 65 días o más hasta formar la cabeza.
  - ✅ *Listo para cosechar:* Radicheta: hojas de tamaño para corte. Radicchio: cabezas firmes y compactas al tacto, de color rojo intenso con nervaduras blancas marcadas.
  - 📚 [El Suelo: calendario de siembra (achicoria/radicheta 70 días, 3 cortes)](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — FIQ - UNL (calendario INTA); [Cómo cultivar Achicoria roja (radicchio) de manera orgánica](https://www.ecojardinmagico.com/como-cultivar-achicoria-roja-radicchio-de-manera-organica/) — Eco Jardín Mágico (divulgación)
- **Germinación** (🟡 5/10): Aproximadamente 1-2 semanas (7-14 días) según temperatura.
  - 📚 [Cómo cultivar Achicoria roja (radicchio) de manera orgánica](https://www.ecojardinmagico.com/como-cultivar-achicoria-roja-radicchio-de-manera-organica/) — Eco Jardín Mágico (divulgación)
- **Trasplante** (🟡 6/10): La radicheta suele ir por siembra directa y raleo, sin trasplante. El radicchio de cabeza puede trasplantarse cuando el plantín tiene 4-5 hojas verdaderas; en directa se ralea cuando las plántulas alcanzan unos 5 cm dejando ~30 cm entre plantas.
  - 🌱 *Listo para trasplantar:* Plantín con 4-5 hojas verdaderas; en siembra directa, plántulas de ~5 cm listas para ralear.
  - 📚 [Cómo cultivar Achicoria roja (radicchio) de manera orgánica](https://www.ecojardinmagico.com/como-cultivar-achicoria-roja-radicchio-de-manera-organica/) — Eco Jardín Mágico (divulgación)
- **Longevidad** (🟡 6/10): Especie perenne en estado silvestre, cultivada como anual o bienal. La radicheta permite varios cortes en una misma temporada; el radicchio de cabeza se cosecha una vez.
  - 📚 [Cómo cultivar Achicoria roja (radicchio) de manera orgánica](https://www.ecojardinmagico.com/como-cultivar-achicoria-roja-radicchio-de-manera-organica/) — Eco Jardín Mágico (divulgación); [Achicoria (Cichorium intybus)](https://sib.gob.ar/especies/cichorium-intybus) — SIB - Parques Nacionales, Argentina
- **Trucos** (🟡 6/10): Para el radicchio, el forzado/blanqueo (tapar o atar las plantas para que acogollen sin luz) reduce el amargor y mejora la cabeza; cosechar tras las primeras heladas endulza el sabor; en radicheta, cortar por encima del cuello permite el rebrote para varios cortes.
  - 📚 [Cómo cultivar Achicoria roja (radicchio) de manera orgánica](https://www.ecojardinmagico.com/como-cultivar-achicoria-roja-radicchio-de-manera-organica/) — Eco Jardín Mágico (divulgación)
- **Riesgos / a evitar** (🟡 5/10): Sabor muy amargo en cabezas viejas o cultivadas con calor; con altas temperaturas y días largos tiende a subir a flor (bolting), perdiendo calidad. Cosechar joven y en clima fresco.
  - 📚 [Cómo cultivar Achicoria roja (radicchio) de manera orgánica](https://www.ecojardinmagico.com/como-cultivar-achicoria-roja-radicchio-de-manera-organica/) — Eco Jardín Mágico (divulgación)
- **Plagas y enfermedades** (🟡 5/10): Rara vez afectada seriamente por plagas y enfermedades; pueden aparecer pulgones y babosas/caracoles.
  - 📚 [Cómo cultivar Achicoria roja (radicchio) de manera orgánica](https://www.ecojardinmagico.com/como-cultivar-achicoria-roja-radicchio-de-manera-organica/) — Eco Jardín Mágico (divulgación)
- **Se asocia bien con** (🟡 6/10): Se asocia bien con lechuga y caléndula (ayudan contra pulgones), y en general con hortalizas de raíz superficial como rabanito, zanahoria y remolacha.
  - 📚 [El Suelo: calendario de siembra y asociaciones](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — FIQ - UNL (material INTA)
- **Evitar cerca de** (🔴 2/10): Sin dato confiable de fuentes consultadas.
  - 📚 _(sin fuente registrada)_

<a id="berro"></a>
## Berro  ·  *Nasturtium officinale*

- **Fecha/s de siembra** (🟡 5/10): Puede sembrarse casi todo el año en clima templado, pero rinde mejor en las estaciones frescas; la siembra ideal es en primavera y otoño, y la cosecha de mejor calidad se da en otoño-invierno. No figura en el calendario oficial de ProHuerta/INTA; datos de fuentes de jardinería (hemisferio norte y general), por lo que la confianza para el GBA es media.
  - 📚 [Berro, Berros - Nasturtium officinale (fichas)](https://fichas.infojardin.com/hortalizas-verduras/berros-nasturtium-officinale.htm) — Infojardín (divulgación); [Berro — Guía de Cultivo y Cuidados](https://plotmygarden.com/es/plants/watercress-herb) — PlotMyGarden (divulgación)
- **Forma/s de siembra** (🟡 6/10): Dos formas: por semilla, esparcida en superficie sobre sustrato húmedo (necesita luz para germinar, no se cubre) y presionando suavemente; o por esquejes/tallos de 10-20 cm colocados en agua o suelo encharcado. Luego se pasa a un medio con agua constante (macetas en bandeja con agua, borde de estanque o suelo siempre húmedo).
  - 📚 [Berro, Berros - Nasturtium officinale (fichas)](https://fichas.infojardin.com/hortalizas-verduras/berros-nasturtium-officinale.htm) — Infojardín (divulgación); [Berro — Guía de Cultivo y Cuidados](https://plotmygarden.com/es/plants/watercress-herb) — PlotMyGarden (divulgación)
- **Suelo** (🟡 6/10): 🟦 **`HUMEDO_RICO`** (Húmedo y rico) — Sustrato rico en humus/materia orgánica, con base de barro arenoso (al menos ~8 cm), que retenga mucha agua y se mantenga permanentemente húmedo o encharcado; agua limpia y sin cloro.
  - ⚠️ *Si no se cumple:* Si el sustrato se seca la planta se marchita y muere rápidamente: la humedad constante es el factor crítico del cultivo.
  - 📚 [Berro, Berros - Nasturtium officinale (fichas)](https://fichas.infojardin.com/hortalizas-verduras/berros-nasturtium-officinale.htm) — Infojardín (divulgación); [Cómo sembrar berros](https://www.mundohuerto.com/cultivos/berro/como-sembrar) — Mundo Huerto (divulgación)
- **Luz** (🟡 6/10): 🌤️ **`SOL_PARCIAL`** (Sol parcial) — Sol parcial (aprox. 3-6 horas); tolera bien la media sombra y la luz indirecta. En verano conviene darle sombra para evitar que florezca (espigue) y amargue. _(luz directa: mín 3 h, ideal 4-6 h; sin sol directo: sí)_
  - ⚠️ *Si no se cumple:* A pleno sol de verano florece antes de tiempo y las hojas se vuelven amargas; con sombra muy profunda el crecimiento es débil y ahilado.
  - 📚 [Berro — Guía de Cultivo y Cuidados](https://plotmygarden.com/es/plants/watercress-herb) — PlotMyGarden (divulgación)
- **Cosecha** (🟡 6/10): Cosecha rápida: primeros cortes a partir de ~30 días de la siembra; se cortan los tallos jóvenes por encima de la línea de agua y rebrotan, permitiendo cortes cada 3-5 días. La mejor calidad es en otoño-invierno.
  - ✅ *Listo para cosechar:* Tallos y hojas jóvenes, tiernos y todavía sin flor; se cosecha antes de la floración para que no amargue.
  - 📚 [Berro — Guía de Cultivo y Cuidados](https://plotmygarden.com/es/plants/watercress-herb) — PlotMyGarden (divulgación); [Berro, Berros - Nasturtium officinale (fichas)](https://fichas.infojardin.com/hortalizas-verduras/berros-nasturtium-officinale.htm) — Infojardín (divulgación)
- **Germinación** (🟡 6/10): Aproximadamente 5-10 días a 15-20 °C. La semilla necesita luz para germinar (sembrar en superficie sin cubrir).
  - 📚 [Berro — Guía de Cultivo y Cuidados](https://plotmygarden.com/es/plants/watercress-herb) — PlotMyGarden (divulgación)
- **Trasplante** (🟡 5/10): Cuando los plantines tienen algunas hojas se pasan al agua o a suelo encharcado, cuidando que las hojas superiores queden por encima de la superficie del agua. También se propaga directamente por esquejes en agua sin necesidad de almácigo.
  - 🌱 *Listo para trasplantar:* Plantín con varias hojas verdaderas y raíces visibles; en esquejes, cuando emiten raicillas en los nudos.
  - 📚 [Berro, Berros - Nasturtium officinale (fichas)](https://fichas.infojardin.com/hortalizas-verduras/berros-nasturtium-officinale.htm) — Infojardín (divulgación)
- **Longevidad** (🟡 7/10): Planta perenne acuática/semiacuática; rebrota de los nudos incluso tras florecer y continúa creciendo en la siguiente estación fresca, permitiendo cosechas repetidas. Suele manejarse renovando plantas cada temporada.
  - 📚 [Berro — Guía de Cultivo y Cuidados](https://plotmygarden.com/es/plants/watercress-herb) — PlotMyGarden (divulgación); [Nasturtium officinale (berro)](https://sib.gob.ar/especies/nasturtium-officinale) — SIB - Parques Nacionales, Argentina
- **Trucos** (🟡 6/10): Mantener el sustrato o el agua siempre húmedos (nunca dejar secar); usar agua limpia sin cloro; dar sombra en verano y cosechar antes de la floración para evitar el amargor; propagar fácilmente por esquejes en agua.
  - 📚 [Berro — Guía de Cultivo y Cuidados](https://plotmygarden.com/es/plants/watercress-herb) — PlotMyGarden (divulgación); [Cómo sembrar berros](https://www.mundohuerto.com/cultivos/berro/como-sembrar) — Mundo Huerto (divulgación)
- **Riesgos / a evitar** (🟡 7/10): No consumir crudo berro silvestre de arroyos, zanjas o acequias sin control: puede transmitir la duela/distomatosis hepática (Fasciola hepatica). Cultivar con agua limpia. Además se seca con facilidad y en verano florece y amarga.
  - 📚 [Berro — Guía de Cultivo y Cuidados](https://plotmygarden.com/es/plants/watercress-herb) — PlotMyGarden (divulgación)
- **Plagas y enfermedades** (🟡 5/10): Pulguilla/escarabajo del berro, mildiu velloso (Peronospora), pulgones y caracoles/babosas.
  - 📚 [Berro — Guía de Cultivo y Cuidados](https://plotmygarden.com/es/plants/watercress-herb) — PlotMyGarden (divulgación)
- **Se asocia bien con** (🔴 4/10): Se lleva bien con menta y perejil (plantas que también gustan de humedad).
  - 📚 [Berro — Guía de Cultivo y Cuidados](https://plotmygarden.com/es/plants/watercress-herb) — PlotMyGarden (divulgación)
- **Evitar cerca de** (🔴 2/10): Sin dato confiable de asociaciones negativas documentadas en las fuentes consultadas.
  - 📚 _(sin fuente registrada)_

<a id="apio"></a>
## Apio  ·  *Apium graveolens var. dulce*

- **Fecha/s de siembra** (🟢 8/10): GBA: siembra en almácigo de primavera a otoño temprano. INTA (Planificador de huerta): Septiembre-Diciembre y Enero-Marzo. El Brote Urbano: almácigos de septiembre a enero (para trasplante en verano-otoño, con media sombra en almácigos de fin de verano). Cultivo de clima fresco/templado (óptimo 15-18 °C).
  - 📚 [Planificador de huerta (ProHuerta)](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [¿Cómo cultivar Apio?](https://www.elbroteurbano.com/como-cultivar-apio/) — El Brote Urbano
- **Forma/s de siembra** (🟢 8/10): Almácigo, luego trasplante (no conviene siembra directa). Semilla muy fina (1 g ~3.000 semillas); no cubrir en exceso porque requiere algo de luz para germinar. Densidad 1-2 g/m2 en almácigo.
  - 📚 [Planificador de huerta (ProHuerta)](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [¿Cómo cultivar Apio?](https://www.elbroteurbano.com/como-cultivar-apio/) — El Brote Urbano
- **Suelo** (🟡 7/10): 🟦 **`HUMEDO_RICO`** (Húmedo y rico) — Suelo fértil, profundo, bien preparado y muy rico en materia orgánica; exigente en humedad pero sin encharcamientos. Agregar compost abundante y abono orgánico durante el ciclo.
  - ⚠️ *Si no se cumple:* En suelo pobre o seco los peciolos salen delgados, fibrosos y amargos; con drenaje deficiente/encharcamiento las raíces se pudren.
  - 📚 [¿Cómo cultivar Apio?](https://www.elbroteurbano.com/como-cultivar-apio/) — El Brote Urbano
- **Luz** (🟡 5/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Prefiere pleno sol; tolera algo de media sombra (conviene media sombra en almácigos de verano). Cultivo de clima fresco. _(luz directa: mín 4 h, ideal 6 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz se ahíla, produce peciolos delgados y débiles y menor desarrollo.
  - 📚 [¿Cómo cultivar Apio?](https://www.elbroteurbano.com/como-cultivar-apio/) — El Brote Urbano
- **Cosecha** (🟢 8/10): Aprox. 120-150 días desde siembra (INTA). El Brote Urbano: variedades verdes ~120 días desde trasplante; amarillas/autoblanqueo 80-100 días desde trasplante.
  - ✅ *Listo para cosechar:* Plantas bien desarrolladas, peciolos de buen tamaño; se corta al ras del suelo. En variedades verdes se realiza blanqueo (fajado del peciolo) 15-20 días antes.
  - 📚 [Planificador de huerta (ProHuerta)](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [¿Cómo cultivar Apio?](https://www.elbroteurbano.com/como-cultivar-apio/) — El Brote Urbano
- **Germinación** (🟡 7/10): Lenta: 15-20 días.
  - 📚 [¿Cómo cultivar Apio?](https://www.elbroteurbano.com/como-cultivar-apio/) — El Brote Urbano
- **Trasplante** (🟡 7/10): Trasplante aprox. 80 días después de la siembra en almácigo, a 25-30 cm entre plantas y 70-80 cm entre hileras (INTA: 20-25 cm entre plantas, 40-50 cm entre surcos).
  - 🌱 *Listo para trasplantar:* Plantín firme con varias hojas verdaderas y buen enraizamiento; se extrae con tierra adherida a las raíces.
  - 📚 [¿Cómo cultivar Apio?](https://www.elbroteurbano.com/como-cultivar-apio/) — El Brote Urbano; [Planificador de huerta (ProHuerta)](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Longevidad** (🟡 6/10): Bianual, cultivada como anual (se cosecha en el primer año antes de florecer).
  - 📚 [¿Cómo cultivar Apio?](https://www.elbroteurbano.com/como-cultivar-apio/) — El Brote Urbano
- **Trucos** (🟡 7/10): Blanqueo: fajar el peciolo (dejando libres las hojas) cuando la planta llega a ~30 cm, 15-20 días antes de cosechar, para peciolos tiernos y menos amargos. Riego abundante y parejo (800-1000 mm/ciclo), sin mojar el follaje. Carpidas y aporques ligeros. Absorbe la mitad de los nutrientes el último mes.
  - 📚 [¿Cómo cultivar Apio?](https://www.elbroteurbano.com/como-cultivar-apio/) — El Brote Urbano
- **Riesgos / a evitar** (🟡 7/10): No tolera encharcamientos (pudrición). Cultivo de clima fresco (óptimo 15-18 °C): con calor y estrés hídrico se ahíla, se pone fibroso o se adelanta a flor. Peciolos delgados por contenedor chico, poca luz, riego o sustrato deficiente.
  - 📚 [¿Cómo cultivar Apio?](https://www.elbroteurbano.com/como-cultivar-apio/) — El Brote Urbano
- **Plagas y enfermedades** (🔴 2/10): sin dato confiable en las fuentes argentinas consultadas (comúnmente pulgones, babosas y septoriosis, pero no verificado en fuente citada)
  - 📚 _(sin fuente registrada)_
- **Se asocia bien con** (🔴 3/10): Se asocia bien con crucíferas (repollo, coliflor, brócoli), puerro y tomate según literatura de asociaciones; no hallado en fuente argentina específica.
  - 📚 _(sin fuente registrada)_
- **Evitar cerca de** (🔴 1/10): sin dato confiable
  - 📚 _(sin fuente registrada)_

<a id="brocoli"></a>
## Brócoli  ·  *Brassica oleracea var. italica*

- **Fecha/s de siembra** (🟢 8/10): GBA: principalmente otoño-invierno. INTA (Planificador): Septiembre-Octubre y Febrero-Abril. El Brote Urbano: para producción invernal, almácigo en febrero-marzo y trasplante en abril; para trasplante en enero, almácigo en noviembre. Óptimo de crecimiento 16-18 °C.
  - 📚 [Planificador de huerta (ProHuerta)](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [¿Cómo cultivar Brócoli?](https://www.elbroteurbano.com/como-cultivar-brocoli/) — El Brote Urbano
- **Forma/s de siembra** (🟢 8/10): Almácigo y luego trasplante (no siembra directa). Trasplante a 70 cm entre surcos y 40-50 cm entre plantas.
  - 📚 [Planificador de huerta (ProHuerta)](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [¿Cómo cultivar Brócoli?](https://www.elbroteurbano.com/como-cultivar-brocoli/) — El Brote Urbano
- **Suelo** (🟡 6/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Requerimientos similares al repollo/coliflor: suelo franco, fértil, profundo y rico en materia orgánica, con buena retención de humedad y buen drenaje.
  - ⚠️ *Si no se cumple:* En suelo pobre o compactado la planta crece poco y forma pellas/cabezas chicas; con exceso de agua hay pudriciones.
  - 📚 [¿Cómo cultivar Brócoli?](https://www.elbroteurbano.com/como-cultivar-brocoli/) — El Brote Urbano
- **Luz** (🟡 5/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Pleno sol para buen desarrollo de la cabeza. _(luz directa: mín 6 h, ideal 6 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz se ahíla, hace mucha hoja y poca inflorescencia, con cabezas laxas.
  - 📚 [¿Cómo cultivar Brócoli?](https://www.elbroteurbano.com/como-cultivar-brocoli/) — El Brote Urbano
- **Cosecha** (🟡 7/10): Según ciclo de la variedad, desde el trasplante: ciclo corto 50-75 días, mediano 80-120 días, largo más de 150 días. (INTA agrupa brócoli/coliflor en 250-270 días desde siembra para ciclos largos.)
  - ✅ *Listo para cosechar:* Se cosecha cuando la inflorescencia (cabeza) está bien desarrollada, compacta y con las yemas/florcitas aún cerradas, antes de que amarilleen o abran.
  - 📚 [¿Cómo cultivar Brócoli?](https://www.elbroteurbano.com/como-cultivar-brocoli/) — El Brote Urbano; [Planificador de huerta (ProHuerta)](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Germinación** (🟡 5/10): Rápida en general (crucíferas ~5-10 días con calor). El Brote Urbano indica alcanzar tamaño de plantín en ~30 días en verano y ~45 días en invierno (incluye desarrollo, no solo emergencia).
  - 📚 [¿Cómo cultivar Brócoli?](https://www.elbroteurbano.com/como-cultivar-brocoli/) — El Brote Urbano
- **Trasplante** (🟡 6/10): Se trasplanta cuando el plantín tiene desarrollo suficiente (aprox. 4-6 hojas verdaderas), a 70 cm entre surcos y 40-50 cm entre plantas.
  - 🌱 *Listo para trasplantar:* Plantín con 4-6 hojas verdaderas, tallo firme y bien enraizado.
  - 📚 [¿Cómo cultivar Brócoli?](https://www.elbroteurbano.com/como-cultivar-brocoli/) — El Brote Urbano
- **Longevidad** (🟡 6/10): Anual (bianual botánica cultivada como anual). Da una cabeza principal y luego rebrotes laterales durante varias semanas.
  - 📚 [¿Cómo cultivar Brócoli?](https://www.elbroteurbano.com/como-cultivar-brocoli/) — El Brote Urbano
- **Trucos** (🟡 5/10): Cosechar la cabeza central con tallo largo para estimular brotes laterales y prolongar la cosecha. Mantener humedad pareja; asociar con menta/mostaza cercana para ahuyentar plagas.
  - 📚 [¿Cómo cultivar Brócoli?](https://www.elbroteurbano.com/como-cultivar-brocoli/) — El Brote Urbano; [Asociaciones de cultivos en nuestra huerta](https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/) — Fecoagro
- **Riesgos / a evitar** (🟡 6/10): Cultivo de clima fresco: con calor (>30 °C) o estrés las cabezas se abren y florecen prematuramente. Evitar exceso de nitrógeno tardío y encharcamientos.
  - 📚 [¿Cómo cultivar Brócoli?](https://www.elbroteurbano.com/como-cultivar-brocoli/) — El Brote Urbano
- **Plagas y enfermedades** (🟡 5/10): Comunes en crucíferas: pulgones, orugas (isoca/gusanos de la col), babosas y caracoles; enfermedad de podredumbre negra. (Verificado para el grupo de coles en fuente de coliflor.)
  - 📚 [¿Cómo cultivar Coliflor?](https://www.elbroteurbano.com/como-cultivar-coliflor/) — El Brote Urbano
- **Se asocia bien con** (🟡 6/10): Menta, tomillo, salvia, eneldo y mostaza cerca de las coles ayudan a repeler o regular plagas (pulgón, lagarta, dípteros/gusanos).
  - 📚 [Asociaciones de cultivos en nuestra huerta](https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/) — Fecoagro
- **Evitar cerca de** (🔴 3/10): Evitar cerca de otras crucíferas en misma parcela (comparten plagas/enfermedades) y de tomate/frutilla según literatura de asociaciones; no verificado en fuente argentina específica.
  - 📚 _(sin fuente registrada)_

<a id="coliflor"></a>
## Coliflor  ·  *Brassica oleracea var. botrytis*

- **Fecha/s de siembra** (🟢 8/10): GBA: INTA (Planificador, brócoli/coliflor): Septiembre-Octubre y Febrero-Abril. El Brote Urbano: variedades tempranas almácigo octubre-diciembre (trasplante dic-ene, cosecha mar-abr); tardías almácigo marzo-abril (trasplante may-jun, cosecha ago-sep).
  - 📚 [Planificador de huerta (ProHuerta)](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [¿Cómo cultivar Coliflor?](https://www.elbroteurbano.com/como-cultivar-coliflor/) — El Brote Urbano
- **Forma/s de siembra** (🟢 8/10): Almácigo y luego trasplante (no siembra directa).
  - 📚 [¿Cómo cultivar Coliflor?](https://www.elbroteurbano.com/como-cultivar-coliflor/) — El Brote Urbano; [Planificador de huerta (ProHuerta)](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Suelo** (🟡 6/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Suelo fértil, bien abonado con compost, con buena retención de agua; exigente en nutrientes.
  - ⚠️ *Si no se cumple:* En suelo pobre o desbalanceado forma pellas chicas, sueltas o no forma cabeza; con encharcamiento aparece podredumbre negra.
  - 📚 [¿Cómo cultivar Coliflor?](https://www.elbroteurbano.com/como-cultivar-coliflor/) — El Brote Urbano
- **Luz** (🟡 5/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Pleno sol para buen desarrollo, aunque la pella se protege del sol directo con las hojas para que quede blanca. _(luz directa: mín 6 h, ideal 6 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz la planta se ahíla y no forma pella; el exceso de sol directo sobre la pella la torna amarillenta.
  - 📚 [¿Cómo cultivar Coliflor?](https://www.elbroteurbano.com/como-cultivar-coliflor/) — El Brote Urbano
- **Cosecha** (🟡 7/10): Variedades tempranas ~90 días desde el almácigo/trasplante; tardías ~200 días. (INTA agrupa brócoli/coliflor hasta 250-270 días desde siembra en ciclos largos.)
  - ✅ *Listo para cosechar:* La pella alcanza su máximo tamaño pero se mantiene firme y compacta a la presión de los dedos, antes de aflojarse o amarillear.
  - 📚 [¿Cómo cultivar Coliflor?](https://www.elbroteurbano.com/como-cultivar-coliflor/) — El Brote Urbano; [Planificador de huerta (ProHuerta)](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Germinación** (🔴 3/10): sin dato numérico en fuente citada; en crucíferas generalmente 5-10 días con temperatura templada.
  - 📚 _(sin fuente registrada)_
- **Trasplante** (🟡 6/10): Trasplante a surcos distanciados 70-90 cm; 50 cm entre plantas en variedades tempranas y 70-80 cm en tardías. Aporcar cuando la planta alcanza ~25 cm de altura.
  - 🌱 *Listo para trasplantar:* Plantín con varias hojas verdaderas y buen enraizamiento (aprox. 4-6 hojas).
  - 📚 [¿Cómo cultivar Coliflor?](https://www.elbroteurbano.com/como-cultivar-coliflor/) — El Brote Urbano
- **Longevidad** (🟡 6/10): Anual (bianual botánica cultivada como anual). Produce una única pella por planta.
  - 📚 [¿Cómo cultivar Coliflor?](https://www.elbroteurbano.com/como-cultivar-coliflor/) — El Brote Urbano
- **Trucos** (🟡 6/10): Blanqueo: atar o quebrar las hojas sobre la pella unos 3 días antes de cosechar para que no se ponga amarilla por el sol. Aporcar a los ~25 cm. Menta/mostaza cercana como repelentes de plagas.
  - 📚 [¿Cómo cultivar Coliflor?](https://www.elbroteurbano.com/como-cultivar-coliflor/) — El Brote Urbano; [Asociaciones de cultivos en nuestra huerta](https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/) — Fecoagro
- **Riesgos / a evitar** (🟡 6/10): Muy sensible a cambios (calor, sequía, frío intenso, trasplante tardío): forma pellas chicas, sueltas o granulosas ('arroz') o florece. Evitar encharcamientos (podredumbre negra).
  - 📚 [¿Cómo cultivar Coliflor?](https://www.elbroteurbano.com/como-cultivar-coliflor/) — El Brote Urbano
- **Plagas y enfermedades** (🟡 7/10): Pulgones (control biológico por parásitos), orugas (controlables con tierra de diatomeas) y podredumbre negra (oxicloruro de cobre y evitar encharcamientos).
  - 📚 [¿Cómo cultivar Coliflor?](https://www.elbroteurbano.com/como-cultivar-coliflor/) — El Brote Urbano
- **Se asocia bien con** (🟡 6/10): Menta, tomillo, salvia, eneldo y mostaza cerca de las coles ayudan a repeler/regular plagas.
  - 📚 [Asociaciones de cultivos en nuestra huerta](https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/) — Fecoagro
- **Evitar cerca de** (🔴 3/10): Evitar concentrar varias crucíferas juntas (comparten plagas/enfermedades); según literatura general, evitar cerca de tomate y frutilla. No verificado en fuente argentina específica.
  - 📚 _(sin fuente registrada)_

<a id="repollitos-de-bruselas"></a>
## Repollitos de Bruselas  ·  *Brassica oleracea var. gemmifera*

- **Fecha/s de siembra** (🔴 4/10): Cultivo de ciclo largo y muy resistente al frío. Para GBA (hemisferio sur): siembra en almácigo de fin de primavera a verano (aprox. dic-feb) para trasplante y cosecha en otoño-invierno; el frío mejora la calidad. Flor de Planta recomienda sembrar en almácigo bajo cubierta 'en temporada invernal', con dudas sobre otoño vs. primavera. Fuente hemisferio norte (Mundo Huerto): de inicio de primavera a mediados de verano para cosechar otoño-invierno. DATO CON BAJA CONFIANZA por falta de calendario argentino específico.
  - 📚 [Repollitos de Bruselas: cultivo, riego y cuidados](https://www.flordeplanta.com.ar/huerta/repollitos-de-bruselas-cultivo-riego-y-cuidados/) — Flor de Planta; [Cómo cultivar coles de bruselas o repollitos](https://www.mundohuerto.com/cultivos/col-bruselas) — Mundo Huerto (España, hemisferio norte)
- **Forma/s de siembra** (🟡 6/10): Almácigo bajo cubierta y luego trasplante (no siembra directa). Semilla a 0,5-1 cm de profundidad; ~5 semanas hasta trasplante (dato hemisferio norte).
  - 📚 [Repollitos de Bruselas: cultivo, riego y cuidados](https://www.flordeplanta.com.ar/huerta/repollitos-de-bruselas-cultivo-riego-y-cuidados/) — Flor de Planta; [Cómo cultivar coles de bruselas o repollitos](https://www.mundohuerto.com/cultivos/col-bruselas) — Mundo Huerto (España, hemisferio norte)
- **Suelo** (🟡 6/10): 🟧 **`PROFUNDO_SUELTO`** (Profundo y suelto) — Suelo profundo, de textura franca (media), rico en materia orgánica y ligeramente ácido. Evitar sustratos con exceso de nitrógeno (provoca desarrollo foliar excesivo en desmedro de los repollitos).
  - ⚠️ *Si no se cumple:* En suelo poco profundo o suelto la planta alta se cae/tumba y forma repollitos flojos; con exceso de nitrógeno hace mucha hoja y repollitos abiertos y laxos.
  - 📚 [Repollitos de Bruselas: cultivo, riego y cuidados](https://www.flordeplanta.com.ar/huerta/repollitos-de-bruselas-cultivo-riego-y-cuidados/) — Flor de Planta; [Cómo cultivar coles de bruselas o repollitos](https://www.mundohuerto.com/cultivos/col-bruselas) — Mundo Huerto (España, hemisferio norte)
- **Luz** (🔴 3/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Pleno sol para buen cuajado de los repollitos. _(luz directa: mín 6 h, ideal 6 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz la planta se ahíla, forma repollitos flojos, abiertos y de menor tamaño.
  - 📚 _(sin fuente registrada)_
- **Cosecha** (🟡 6/10): Aprox. 90 a 160 días desde la siembra; primeras coles hacia fines del verano/otoño y se cosecha escalonadamente durante el invierno.
  - ✅ *Listo para cosechar:* Repollitos firmes y compactos de ~2,5-4 cm de diámetro; se cosechan de abajo hacia arriba del tallo cuando aún están tiernos, apenas madurados. El frío mejora el sabor.
  - 📚 [Repollitos de Bruselas: cultivo, riego y cuidados](https://www.flordeplanta.com.ar/huerta/repollitos-de-bruselas-cultivo-riego-y-cuidados/) — Flor de Planta
- **Germinación** (🔴 3/10): Buena y rápida; sin dato numérico en fuente citada (en crucíferas generalmente 5-10 días con temperatura templada).
  - 📚 [Cómo cultivar coles de bruselas o repollitos](https://www.mundohuerto.com/cultivos/col-bruselas) — Mundo Huerto (España, hemisferio norte)
- **Trasplante** (🟡 5/10): Trasplante cuando el plantín mide ~15 cm de alto y está bien enraizado (Flor de Planta), o con 40+ días y 4-6 hojas (Mundo Huerto). Marco amplio: ~60 cm entre plantas y hasta 100-120 cm entre hileras (planta alta, hasta ~70 cm).
  - 🌱 *Listo para trasplantar:* Plantín de ~15 cm, con 4-6 hojas verdaderas y buen enraizamiento.
  - 📚 [Repollitos de Bruselas: cultivo, riego y cuidados](https://www.flordeplanta.com.ar/huerta/repollitos-de-bruselas-cultivo-riego-y-cuidados/) — Flor de Planta; [Cómo cultivar coles de bruselas o repollitos](https://www.mundohuerto.com/cultivos/col-bruselas) — Mundo Huerto (España, hemisferio norte)
- **Longevidad** (🟡 6/10): Planta bianual, cultivada como anual; una misma planta produce repollitos de forma escalonada a lo largo del tallo durante varias semanas del invierno.
  - 📚 [Repollitos de Bruselas: cultivo, riego y cuidados](https://www.flordeplanta.com.ar/huerta/repollitos-de-bruselas-cultivo-riego-y-cuidados/) — Flor de Planta
- **Trucos** (🟡 6/10): Aporcar cada ~15 días amontonando tierra alrededor del tallo para dar sostén. Entutorar en zonas de vientos fuertes. Riego regular sin saturar. Cosechar de abajo hacia arriba dejando repollitos en la parte superior. El frío/heladas mejoran la calidad y el sabor.
  - 📚 [Repollitos de Bruselas: cultivo, riego y cuidados](https://www.flordeplanta.com.ar/huerta/repollitos-de-bruselas-cultivo-riego-y-cuidados/) — Flor de Planta
- **Riesgos / a evitar** (🟡 6/10): Planta alta que se tumba con viento si no se aporca/entutora. El exceso de nitrógeno y el calor dan repollitos abiertos y flojos. Ciclo muy largo: requiere planificación y paciencia. Evitar encharcamientos.
  - 📚 [Repollitos de Bruselas: cultivo, riego y cuidados](https://www.flordeplanta.com.ar/huerta/repollitos-de-bruselas-cultivo-riego-y-cuidados/) — Flor de Planta
- **Plagas y enfermedades** (🟡 5/10): Como toda crucífera: pulgones, orugas (gusanos de la col), babosas y caracoles.
  - 📚 [Cómo cultivar coles de bruselas o repollitos](https://www.mundohuerto.com/cultivos/col-bruselas) — Mundo Huerto (España, hemisferio norte)
- **Se asocia bien con** (🟡 5/10): Como el resto de las coles: menta, tomillo, salvia, eneldo y mostaza cercanas ayudan a repeler/regular plagas.
  - 📚 [Asociaciones de cultivos en nuestra huerta](https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/) — Fecoagro
- **Evitar cerca de** (🔴 3/10): Evitar agrupar con otras crucíferas (comparten plagas/enfermedades); según literatura general, evitar cerca de tomate y frutilla. No verificado en fuente argentina específica.
  - 📚 _(sin fuente registrada)_

<a id="cebolla-de-verdeo"></a>
## Cebolla de verdeo  ·  *Allium cepa (tipo verdeo; en algunos casos Allium fistulosum)*

- **Fecha/s de siembra** (🟢 8/10): GBA (hemisferio sur): almácigo de febrero a junio y siembra directa de marzo a mayo, según INTA. Amplia ventana, principalmente otoño.
  - 📚 [Calendario de siembra (ProHuerta)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta
- **Forma/s de siembra** (🟡 7/10): Admite siembra directa en línea o almácigo con trasplante. Marco de plantación aproximado 5x40 cm (alta densidad).
  - 📚 [Calendario de siembra (ProHuerta)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta
- **Suelo** (🟡 5/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Suelo suelto, fértil y rico en materia orgánica, con buen drenaje (análogo a la cebolla).
  - ⚠️ *Si no se cumple:* En suelo pesado o encharcado el crecimiento se frena y aparecen pudriciones de base.
  - 📚 [Cultivo, cuidados y siembra de la cebolla](https://www.fecoagro.com.ar/cultivo-cuidados-y-siembra-de-la-cebolla/) — Fecoagro (Argentina)
- **Luz** (🔴 4/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Pleno sol; tolera algo de sol parcial. Al cosecharse por hoja/tallo tierno no depende del fotoperíodo de día largo como la cebolla de bulbo. _(luz directa: mín 4-6 h, ideal 6 o más h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz se ahíla, con tallos débiles y delgados.
  - 📚 [Cultivo, cuidados y siembra de la cebolla](https://www.fecoagro.com.ar/cultivo-cuidados-y-siembra-de-la-cebolla/) — Fecoagro (Argentina)
- **Cosecha** (🟡 7/10): 60-150 días desde la siembra según INTA (cosecha escalonada según grosor deseado).
  - ✅ *Listo para cosechar:* Cuando los tallos/hojas alcanzan grosor y altura de consumo (fuste de ~1 cm de diámetro, 20-30 cm de alto); se cosecha antes de que engrose el bulbo.
  - 📚 [Calendario de siembra (ProHuerta)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta
- **Germinación** (🔴 4/10): Emergencia en torno a 7-15 días (similar a la cebolla).
  - 📚 [Cultivo, cuidados y siembra de la cebolla](https://www.fecoagro.com.ar/cultivo-cuidados-y-siembra-de-la-cebolla/) — Fecoagro (Argentina)
- **Trasplante** (🔴 4/10): Si se hace en almácigo, se trasplanta cuando el plantín tiene grosor de lápiz; también se cultiva por siembra directa sin trasplante.
  - 🌱 *Listo para trasplantar:* Plantín con grosor de lápiz.
  - 📚 [Calendario de siembra (ProHuerta)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta
- **Longevidad** (🔴 3/10): Según el tipo: la de bulbo (A. cepa) se maneja como anual/bienal; la de mata perenne (A. fistulosum) rebrota tras el corte y puede durar varias temporadas, cosechándose por macollos. Sin dato oficial único; valor a confirmar por variedad.
  - 📚 [Calendario de siembra (ProHuerta)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta
- **Trucos** (🔴 3/10): Aporcar la base para blanquear la parte blanca y hacerla más tierna; cosechar por macollos dejando parte de la planta para el rebrote (en tipos perennes); siembras escalonadas para disponibilidad continua.
  - 📚 [Calendario de siembra (ProHuerta)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta
- **Riesgos / a evitar** (🔴 4/10): Exceso de humedad que pudre la base; competencia de malezas por follaje delgado.
  - 📚 [Cultivo, cuidados y siembra de la cebolla](https://www.fecoagro.com.ar/cultivo-cuidados-y-siembra-de-la-cebolla/) — Fecoagro (Argentina)
- **Plagas y enfermedades** (🔴 4/10): Trips y mildiu (comunes a las aliáceas), además de podredumbres de base por humedad.
  - 📚 [Cultivo, cuidados y siembra de la cebolla](https://www.fecoagro.com.ar/cultivo-cuidados-y-siembra-de-la-cebolla/) — Fecoagro (Argentina)
- **Se asocia bien con** (🟡 5/10): Zanahoria, tomate, lechuga y frutilla (las aliáceas repelen plagas de estos cultivos).
  - 📚 [Cómo hacer asociaciones de cultivos en la huerta orgánica](https://medioambienteenaccion.com.ar/contenido/3938/como-hacer-asociaciones-de-cultivos-en-la-huerta-organica) — Medio Ambiente en Acción (Argentina)
- **Evitar cerca de** (🟡 5/10): Legumbres (arvejas, porotos, habas); en general se evita asociar aliáceas con leguminosas.
  - 📚 [Cómo hacer asociaciones de cultivos en la huerta orgánica](https://medioambienteenaccion.com.ar/contenido/3938/como-hacer-asociaciones-de-cultivos-en-la-huerta-organica) — Medio Ambiente en Acción (Argentina)


---

# Hortaliza de raíz/bulbo

<a id="nabo"></a>
## Nabo  ·  *Brassica rapa subsp. rapa*

- **Fecha/s de siembra** (🔴 4/10): Cultivo de estación fresca. En GBA se siembra principalmente de fin de verano a otoño (febrero-mayo) para cosecha otoño-invierno, y también a fin de invierno-primavera (agosto-septiembre). Nota: el nabo NO figura en los calendarios de siembra de INTA/ProHuerta, UNIDA ni FIQ-UNL consultados, por lo que las fechas provienen de fuentes de jardinería y del criterio general para brasicáceas de raíz; confianza reducida.
  - 📚 [Nabo (Brassica rapa): Cultivo, riego y cosecha](https://www.flordeplanta.com.ar/huerta/nabo-brassica-rapa-cultivo-riego-y-cosecha/) — Flor de Planta (jardinería, Argentina); [Que sembrar en Otoño-Invierno / Hemisferio Sur](https://www.huertadecero.com/que-sembrar-en-otono-invierno-hemisferio-sur/) — Huerta de Cero
- **Forma/s de siembra** (🟡 5/10): Siembra directa en el lugar definitivo (no conviene almácigo/trasplante por ser raíz). En líneas separadas 40 cm, a 2 cm de profundidad; a las ~2 semanas se ralea dejando las plantas a 15 cm entre sí.
  - 📚 [Nabo (Brassica rapa): Cultivo, riego y cosecha](https://www.flordeplanta.com.ar/huerta/nabo-brassica-rapa-cultivo-riego-y-cosecha/) — Flor de Planta
- **Suelo** (🟡 5/10): 🟧 **`PROFUNDO_SUELTO`** (Profundo y suelto) — Suelos francos, profundos, ligeramente alcalinos y bien provistos de materia orgánica, con buen drenaje. Deben evitarse los terrenos con poco drenaje.
  - ⚠️ *Si no se cumple:* En suelos compactos, pedregosos o con mal drenaje la raíz se deforma, se bifurca o se pudre, y el engrosamiento es pobre.
  - 📚 [Nabo (Brassica rapa): Cultivo, riego y cosecha](https://www.flordeplanta.com.ar/huerta/nabo-brassica-rapa-cultivo-riego-y-cosecha/) — Flor de Planta
- **Luz** (🔴 3/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Prefiere pleno sol, aunque tolera algo de sombra; como cultivo de raíz de estación fresca necesita buena luz para engrosar. Las fuentes argentinas consultadas no precisan horas, dato inferido del hábito de la especie. _(luz directa: mín 4-6 h, ideal >=6 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz la planta desarrolla mucha hoja y poca raíz, se ahíla y el nabo queda pequeño.
  - 📚 [Nabo (Brassica rapa): Cultivo, riego y cosecha](https://www.flordeplanta.com.ar/huerta/nabo-brassica-rapa-cultivo-riego-y-cosecha/) — Flor de Planta
- **Cosecha** (🟡 5/10): 60 a 90 días desde la siembra según la variedad.
  - ✅ *Listo para cosechar:* Cuando la raíz asoma sobre el suelo y alcanza tamaño de consumo (aprox. 5-8 cm de diámetro); conviene cosechar tierno, antes de que se ponga fibroso o leñoso.
  - 📚 [Nabo (Brassica rapa): Cultivo, riego y cosecha](https://www.flordeplanta.com.ar/huerta/nabo-brassica-rapa-cultivo-riego-y-cosecha/) — Flor de Planta
- **Germinación** (🔴 4/10): Germinación rápida, aproximadamente 4-7 días; el raleo de plántulas se realiza a las 2 semanas de la siembra.
  - 📚 [Nabo (Brassica rapa): Cultivo, riego y cosecha](https://www.flordeplanta.com.ar/huerta/nabo-brassica-rapa-cultivo-riego-y-cosecha/) — Flor de Planta
- **Trasplante** (🟡 5/10): No requiere trasplante: es de siembra directa porque el trasplante daña la raíz pivotante. En lugar de trasplantar se ralea a los ~15 días dejando 15 cm entre plantas.
  - 🌱 *Listo para trasplantar:* No aplica (sin trasplante).
  - 📚 [Nabo (Brassica rapa): Cultivo, riego y cosecha](https://www.flordeplanta.com.ar/huerta/nabo-brassica-rapa-cultivo-riego-y-cosecha/) — Flor de Planta
- **Longevidad** (🟡 5/10): Planta bianual, cultivada como anual: se cosecha la raíz en la primera temporada (60-90 días). Una sola cosecha por planta.
  - 📚 [Nabo (Brassica rapa): Cultivo, riego y cosecha](https://www.flordeplanta.com.ar/huerta/nabo-brassica-rapa-cultivo-riego-y-cosecha/) — Flor de Planta
- **Trucos** (🟡 5/10): Mantener el suelo húmedo sin encharcar para un engrosamiento parejo; ralear a tiempo (15 cm) para dar espacio a la raíz; cosechar joven para que quede tierno. Lavar los nabos poco antes de consumirlos para evitar pérdida de nutrientes.
  - 📚 [Nabo (Brassica rapa): Cultivo, riego y cosecha](https://www.flordeplanta.com.ar/huerta/nabo-brassica-rapa-cultivo-riego-y-cosecha/) — Flor de Planta
- **Riesgos / a evitar** (🔴 4/10): Evitar suelos encharcados (pudre la raíz) y la falta de raleo (nabos pequeños). El calor y los días largos inducen el espigado (floración prematura) que endurece la raíz; por eso conviene sembrarlo en épocas frescas.
  - 📚 [Nabo (Brassica rapa): Cultivo, riego y cosecha](https://www.flordeplanta.com.ar/huerta/nabo-brassica-rapa-cultivo-riego-y-cosecha/) — Flor de Planta
- **Plagas y enfermedades** (🔴 3/10): Como brasicácea sufre pulgones, oruga/gusano y mosca de las coles; entre las flea beetles (vaquitas saltonas) que perforan las hojas. Fuentes argentinas específicas de plagas del nabo escasas; dato general de brasicáceas.
  - 📚 [Asociaciones de cultivos en nuestra huerta](https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/) — Fecoagro (Federación de Cooperativas Agropecuarias San Juan)
- **Se asocia bien con** (🟡 5/10): Arveja, col/coliflor, espinaca, judía/poroto verde, puerro, tomate, apio y mostaza. La menta y el tomillo cerca de las coles/brasicáceas ahuyentan sus plagas.
  - 📚 [Ejemplos de asociaciones de cultivos](https://www.ecoagricultor.com/ejemplos-de-asociaciones-de-cultivos-a-la-hora-de-planificar-el-diseno-del-huerto/) — Ecoagricultor; [Asociaciones de cultivos en nuestra huerta](https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/) — Fecoagro
- **Evitar cerca de** (🔴 3/10): Como brasicácea conviene no acompañarlo con otras brasicáceas (rábano, coliflor, brócoli) por competencia y plagas compartidas, ni con ajo/cebolla. Las fuentes no listan malas asociaciones específicas del nabo; dato inferido del grupo de las coles.
  - 📚 [Ejemplos de asociaciones de cultivos](https://www.ecoagricultor.com/ejemplos-de-asociaciones-de-cultivos-a-la-hora-de-planificar-el-diseno-del-huerto/) — Ecoagricultor

<a id="zanahoria"></a>
## Zanahoria  ·  *Daucus carota subsp. sativus*

- **Fecha/s de siembra** (🟡 7/10): En GBA se puede sembrar prácticamente todo el año; el Manual de huertas de Bs.As. la marca como 'todo el año'. La época ideal es otoño-invierno (clima fresco). En verano es viable con suelo bien preparado, riego y sombreo parcial. Se recomienda evitar los picos de calor para la germinación.
  - 📚 [Mi huerta agroecológica - Manual de huertas](https://www.ms.gba.gov.ar/sitios/alimentacionsaludable/wp-content/uploads/sites/251/2023/12/MANUAL-DE-HUERTAS.pdf) — Ministerio de Salud de la Provincia de Buenos Aires; [El cultivo de las zanahoria todo el año](https://infoagro.com.ar/como-cultivar-zanahorias/) — Infoagro Argentina
- **Forma/s de siembra** (🟡 7/10): Siembra directa (NO se trasplanta), a chorrillo en líneas separadas 15-40 cm; se cubre con ~0,5-1 cm de tierra fina (fuentes indican surcos a 5x40 cm; profundidad de siembra somera). Luego se ralea. Truco de distribución: mezclar la semilla con arena seca (~1:3) para sembrar más parejo.
  - 📚 [Calendario de siembra](https://www.mihuerta.org.ar/wp-content/uploads/2013/11/Calendario-de-siembra.pdf) — Mi Huerta; [El Suelo - Calendario de siembra, abono y fertilizantes](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — Universidad Nacional del Litoral (FIQ); [Cómo cultivar zanahorias en el huerto | Guía 2026](https://www.portalfruticola.com/noticias/2026/02/23/zanahorias/) — Portal Frutícola
- **Suelo** (🟢 8/10): 🟧 **`PROFUNDO_SUELTO`** (Profundo y suelto) — Suelo profundo (mínimo ~30 cm), suelto, mullido y libre de piedras y terrones, fértil y con buen drenaje. La materia orgánica debe estar bien descompuesta (no estiércol fresco).
  - ⚠️ *Si no se cumple:* En suelos pedregosos, compactados o con estiércol fresco las raíces salen delgadas, deformes, bifurcadas o ramificadas al chocar con obstáculos. En suelos pesados/encharcados se pudren o crecen mal.
  - 📚 [El cultivo de las zanahoria todo el año](https://infoagro.com.ar/como-cultivar-zanahorias/) — Infoagro Argentina; [Cómo cultivar zanahorias en el huerto | Guía 2026](https://www.portalfruticola.com/noticias/2026/02/23/zanahorias/) — Portal Frutícola
- **Luz** (🟡 6/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Requiere pleno sol, al menos 6-8 horas de luz directa diaria; tolera algo de sol parcial pero rinde menos. _(luz directa: mín 6 h, ideal 6-8 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con luz insuficiente el follaje crece vigoroso pero la raíz queda delgada, pálida y poco dulce; la planta se ahíla.
  - 📚 [Cómo cultivar zanahorias en el huerto | Guía 2026](https://www.portalfruticola.com/noticias/2026/02/23/zanahorias/) — Portal Frutícola
- **Cosecha** (🟡 7/10): Aproximadamente 100-150 días desde la siembra según variedad (calendarios argentinos: ~110 días Chantenay-Nantesa, ~150 días Criolla; variedades cortas 50-90 días). Cosecha escalonada según se necesite.
  - ✅ *Listo para cosechar:* El 'hombro' o cuello de la raíz asoma en la superficie y alcanza buen diámetro (~1,5-2 cm o más en variedades medianas); color intenso y tamaño de la variedad. Conviene cosechar antes de que se pasen (se ponen fibrosas/leñosas).
  - 📚 [Calendario de siembra](https://www.mihuerta.org.ar/wp-content/uploads/2013/11/Calendario-de-siembra.pdf) — Mi Huerta; [El Suelo - Calendario de siembra, abono y fertilizantes](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — Universidad Nacional del Litoral (FIQ); [Cómo cultivar zanahorias en el huerto | Guía 2026](https://www.portalfruticola.com/noticias/2026/02/23/zanahorias/) — Portal Frutícola
- **Germinación** (🟡 7/10): Lenta e irregular: aproximadamente 10-15 días (puede extenderse a 20). Necesita humedad constante en superficie durante todo ese período.
  - 📚 [El cultivo de las zanahoria todo el año](https://infoagro.com.ar/como-cultivar-zanahorias/) — Infoagro Argentina
- **Trasplante** (🟢 8/10): No se trasplanta: al ser una raíz, el trasplante deforma o daña la raíz. Se siembra siempre directa y se ralea en su lugar definitivo.
  - 🌱 *Listo para trasplantar:* No aplica. En lugar de trasplante se realiza raleo: cuando las plántulas tienen unos 4-6 cm / 4-6 semanas, se entresacan dejando 5-10 cm entre plantas.
  - 📚 [Mi huerta agroecológica - Manual de huertas](https://www.ms.gba.gov.ar/sitios/alimentacionsaludable/wp-content/uploads/sites/251/2023/12/MANUAL-DE-HUERTAS.pdf) — Ministerio de Salud de la Provincia de Buenos Aires; [Cómo cultivar zanahorias en el huerto | Guía 2026](https://www.portalfruticola.com/noticias/2026/02/23/zanahorias/) — Portal Frutícola
- **Longevidad** (🟡 7/10): Bianual, pero se cultiva como anual: se cosecha la raíz en el primer año. Solo florece y da semilla en el segundo año si se la deja. Cada planta produce una raíz.
  - 📚 [El cultivo de las zanahoria todo el año](https://infoagro.com.ar/como-cultivar-zanahorias/) — Infoagro Argentina
- **Trucos** (🟡 6/10): Mezclar la semilla con arena seca (~1:3) para sembrar pareja. Mantener humedad constante hasta la emergencia (la germinación es lenta). Ralear a tiempo para dejar espacio y evitar raíces chicas y torcidas. Suelo mullido y sin piedras es clave. No abonar con estiércol fresco. Asociar con romero/aromáticas y cebolla para confundir a la mosca de la zanahoria.
  - 📚 [Cómo cultivar zanahorias en el huerto | Guía 2026](https://www.portalfruticola.com/noticias/2026/02/23/zanahorias/) — Portal Frutícola; [El Suelo - Calendario de siembra, abono y fertilizantes](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — Universidad Nacional del Litoral (FIQ)
- **Riesgos / a evitar** (🟡 7/10): Suelo pedregoso/compactado o abonado con materia orgánica fresca produce raíces bifurcadas y deformes. No ralear a tiempo da zanahorias pequeñas y torcidas. La germinación lenta se pierde si el suelo se seca. El exceso de nitrógeno favorece follaje y raíces ramificadas.
  - 📚 [Cómo cultivar zanahorias en el huerto | Guía 2026](https://www.portalfruticola.com/noticias/2026/02/23/zanahorias/) — Portal Frutícola; [El cultivo de las zanahoria todo el año](https://infoagro.com.ar/como-cultivar-zanahorias/) — Infoagro Argentina
- **Plagas y enfermedades** (🟡 6/10): Plaga principal: mosca de la zanahoria (Psila rosae), cuyas larvas excavan galerías en la raíz. También pulgones y nematodos. Enfermedades: oídio, alternaria (tizón foliar) y podredumbres en suelos húmedos.
  - 📚 [Cómo cultivar zanahorias en el huerto | Guía 2026](https://www.portalfruticola.com/noticias/2026/02/23/zanahorias/) — Portal Frutícola
- **Se asocia bien con** (🟡 6/10): Se asocia bien con cebolla, puerro, ajo y aromáticas como el romero (enmascaran el olor y repelen la mosca de la zanahoria), y también con lechuga, rabanito, arveja y tomate.
  - 📚 [El Suelo - Calendario de siembra, abono y fertilizantes](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — Universidad Nacional del Litoral (FIQ); [Especies hortícolas, asociaciones favorables entre ellas](https://www.portalfruticola.com/noticias/2020/09/24/asociaciones-favorables-entre-especies-horticolas/) — Portal Frutícola
- **Evitar cerca de** (🔴 3/10): Se desaconseja asociarla con eneldo y otras umbelíferas emparentadas (apio, perejil, hinojo) por competencia y plagas/enfermedades compartidas. Sin dato oficial argentino específico; confianza baja.
  - 📚 [Especies hortícolas, asociaciones favorables entre ellas](https://www.portalfruticola.com/noticias/2020/09/24/asociaciones-favorables-entre-especies-horticolas/) — Portal Frutícola

<a id="remolacha"></a>
## Remolacha  ·  *Beta vulgaris var. conditiva*

- **Fecha/s de siembra** (🟢 9/10): En el GBA se siembra prácticamente todo el año evitando pleno invierno y pleno verano; épocas óptimas primavera y otoño. INTA (Planificador): 'Agosto-Diciembre / Marzo-Junio'. UNLu: 'primavera y otoño, aunque en la práctica se siembra todo el año salvo pleno invierno o pleno verano'. Fecoagro: 'Todo el año, debiendo evitarse las siembras durante los meses más calurosos'.
  - 📚 [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [Cultivo de remolacha](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Remolacha.pdf) — Cátedra de Horticultura - Universidad Nacional de Luján; [Impulsando el cultivo de remolachas con éxito](https://www.fecoagro.com.ar/impulsando-el-cultivo-de-remolachas-con-exito/) — Fecoagro
- **Forma/s de siembra** (🟢 8/10): Siembra directa (no requiere almácigo), en línea/chorrillo o al voleo, enterrando el 'glomérulo' (fruto que contiene varias semillas). Por eso hay que ralear luego de la emergencia. INTA: directa en surco, 8-10 cm entre plantas, 35-45 cm entre líneas. Fecoagro: hileras a ~40 cm.
  - 📚 [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [Cultivo de remolacha](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Remolacha.pdf) — Cátedra de Horticultura - Universidad Nacional de Luján; [Impulsando el cultivo de remolachas con éxito](https://www.fecoagro.com.ar/impulsando-el-cultivo-de-remolachas-con-exito/) — Fecoagro
- **Suelo** (🟢 8/10): 🟧 **`PROFUNDO_SUELTO`** (Profundo y suelto) — Suelos sueltos, profundos, fértiles (altos en potasio) y de buen drenaje; conviene incorporar materia orgánica bien descompuesta. 'Las raíces de mejor calidad se obtienen en suelos sueltos' (UNLu).
  - ⚠️ *Si no se cumple:* En suelos compactos, pedregosos o con estiércol fresco las raíces salen deformes, fibrosas/leñosas y pueden presentar 'zonado' (anillos claros y oscuros). El estiércol fresco deforma las raíces.
  - 📚 [Cultivo de remolacha](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Remolacha.pdf) — Cátedra de Horticultura - Universidad Nacional de Luján; [Impulsando el cultivo de remolachas con éxito](https://www.fecoagro.com.ar/impulsando-el-cultivo-de-remolachas-con-exito/) — Fecoagro
- **Luz** (🟡 6/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Requiere buena exposición solar; el Planificador INTA la clasifica como 'poco' tolerante a la sombra. Se recomienda ubicar la huerta hacia el norte para buena exposición. _(luz directa: mín 6 h, ideal 6-8 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz la planta ahíla el follaje y engrosa poco la raíz, dando remolachas pequeñas.
  - 📚 [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [Manual del ProHuerta 3. La Huerta Orgánica Intensiva](https://huertasescolares.wordpress.com/wp-content/uploads/2010/02/la-huerta-organica-intensiva-cerbas.pdf) — INTA ProHuerta - EEA Cerbas
- **Cosecha** (🟡 7/10): Aproximadamente 100-130 días desde siembra (INTA); ~130 días (FIQ-UNL); Fecoagro: 70-90 días en siembras primaverales y 90-110 en otoñales, iniciando a los ~60 días.
  - ✅ *Listo para cosechar:* Raíz de unos 5-8 cm de diámetro que asoma en la superficie del suelo; se cosecha antes de que se ponga fibrosa/leñosa.
  - 📚 [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [El Suelo - Calendario de siembra, abono y fertilizantes](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — Facultad de Ingeniería Química - UNL; [Impulsando el cultivo de remolachas con éxito](https://www.fecoagro.com.ar/impulsando-el-cultivo-de-remolachas-con-exito/) — Fecoagro
- **Germinación** (🔴 3/10): No hallé dato preciso de fuente argentina confiable; en general germina en torno a 7-14 días. Dato aproximado, verificar.
  - 📚 _(sin fuente registrada)_
- **Trasplante** (🟡 7/10): No requiere trasplante: se siembra directa. La única labor equivalente es el raleo de plántulas (dejando una planta cada 8-10 cm) por tratarse de un fruto con varias semillas.
  - 🌱 *Listo para trasplantar:* No aplica (siembra directa). Ralear cuando las plántulas tienen 2-4 hojas verdaderas.
  - 📚 [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [Cultivo de remolacha](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Remolacha.pdf) — Cátedra de Horticultura - Universidad Nacional de Luján
- **Longevidad** (🟢 8/10): Bianual, cultivada como anual para consumo de raíz. Resistente a heladas. Cada planta produce una raíz principal.
  - 📚 [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Trucos** (🟡 6/10): Ralear temprano para obtener raíces uniformes; usar suelo suelto y profundo con materia orgánica descompuesta (nunca estiércol fresco, que deforma la raíz); siembras escalonadas para cosecha continua; riego regular para evitar raíces fibrosas.
  - 📚 [Cultivo de remolacha](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Remolacha.pdf) — Cátedra de Horticultura - Universidad Nacional de Luján; [Impulsando el cultivo de remolachas con éxito](https://www.fecoagro.com.ar/impulsando-el-cultivo-de-remolachas-con-exito/) — Fecoagro
- **Riesgos / a evitar** (🟡 7/10): Floración prematura ('subida a flor') si sufre bajas temperaturas siendo pequeña; raíces leñosas/fibrosas si se cosecha tarde o falta agua; 'zonado' (anillos claros y oscuros) en condiciones desfavorables; deformación por estiércol fresco.
  - 📚 [Cultivo de remolacha](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Remolacha.pdf) — Cátedra de Horticultura - Universidad Nacional de Luján
- **Plagas y enfermedades** (🟡 7/10): Plagas: pulgones, hormigas, bichos moros, tucuras, alquiche chico. Enfermedades: viruela o cercospora (Cercospora beticola) y virosis.
  - 📚 [Cultivo de remolacha](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Remolacha.pdf) — Cátedra de Horticultura - Universidad Nacional de Luján
- **Se asocia bien con** (🟡 7/10): Repollo, coliflor, brócoli, lechuga y ajo (INTA); también cebolla y apio (tabla de asociaciones).
  - 📚 [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [Tabla de asociación de cultivos](https://diario.madrid.es/huertosescolares/wp-content/uploads/sites/46/2021/11/TABLA-ASOCIACION-CULTIVOS-1.pdf) — Huertos Escolares - Ayuntamiento de Madrid
- **Evitar cerca de** (🟡 5/10): Se desaconseja junto a espinaca, acelga, tomate y puerro (tabla de asociaciones; fuente del hemisferio norte, confianza reducida).
  - 📚 [Tabla de asociación de cultivos](https://diario.madrid.es/huertosescolares/wp-content/uploads/sites/46/2021/11/TABLA-ASOCIACION-CULTIVOS-1.pdf) — Huertos Escolares - Ayuntamiento de Madrid

<a id="rabanito"></a>
## Rabanito  ·  *Raphanus sativus*

- **Fecha/s de siembra** (🟢 9/10): En el GBA se puede sembrar casi todo el año en siembras escalonadas. INTA (Planificador): 'Febrero-Junio / Septiembre-Diciembre'. Fecoagro: 'agosto a octubre y de febrero a mayo, aunque pueden sembrarse durante todo el año', con siembras cada 15 días.
  - 📚 [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [Cómo cultivar Rabanito en nuestra huerta](https://www.fecoagro.com.ar/como-cultivar-rabanito-en-nuestra-huerta/) — Fecoagro
- **Forma/s de siembra** (🟢 9/10): Siembra directa (no requiere almácigo), en chorrillo ralo o al voleo, a 1-1,5 cm de profundidad (~2 g/m2). INTA: 30-40 cm entre líneas, ~5 cm entre plantas.
  - 📚 [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [Cómo cultivar Rabanito en nuestra huerta](https://www.fecoagro.com.ar/como-cultivar-rabanito-en-nuestra-huerta/) — Fecoagro
- **Suelo** (🟡 7/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Prefiere suelos fértiles, sueltos, profundos y frescos, aunque no es muy exigente (Fecoagro).
  - ⚠️ *Si no se cumple:* En suelo duro, seco o pobre las raíces salen leñosas, ahuecadas y con sabor muy picante; el déficit de agua acentúa el picor y la fibrosidad.
  - 📚 [Cómo cultivar Rabanito en nuestra huerta](https://www.fecoagro.com.ar/como-cultivar-rabanito-en-nuestra-huerta/) — Fecoagro
- **Luz** (🟡 5/10): 🌤️ **`SOL_PARCIAL`** (Sol parcial) — Cultivo de climas templados a templado-frescos; el Planificador INTA lo clasifica como 'poco' tolerante a la sombra, pero por su ciclo corto admite algo de media sombra, sobre todo en verano. _(luz directa: mín 4 h, ideal 6 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz se ahíla: desarrolla mucha hoja y una raíz pequeña o nula.
  - 📚 [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [Cómo cultivar Rabanito en nuestra huerta](https://www.fecoagro.com.ar/como-cultivar-rabanito-en-nuestra-huerta/) — Fecoagro
- **Cosecha** (🟢 8/10): Cultivo muy rápido: 30-40 días desde siembra (INTA); 25-30 días (FIQ-UNL); 30-60 días (Fecoagro).
  - ✅ *Listo para cosechar:* Raíz de 1-1,5 cm de diámetro que asoma en la superficie; cosechar a tiempo evita el sabor picante excesivo y el ahuecado.
  - 📚 [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [El Suelo - Calendario de siembra, abono y fertilizantes](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — Facultad de Ingeniería Química - UNL; [Cómo cultivar Rabanito en nuestra huerta](https://www.fecoagro.com.ar/como-cultivar-rabanito-en-nuestra-huerta/) — Fecoagro
- **Germinación** (🔴 4/10): Germinación rápida, en torno a 4-7 días. No hallé dato preciso de fuente argentina; valor aproximado.
  - 📚 _(sin fuente registrada)_
- **Trasplante** (🟢 9/10): No requiere trasplante: se siembra directo en su lugar definitivo por ser de ciclo muy corto. Sólo conviene ralear las plántulas para dar espacio a cada raíz.
  - 🌱 *Listo para trasplantar:* No aplica (siembra directa).
  - 📚 [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [Cómo cultivar Rabanito en nuestra huerta](https://www.fecoagro.com.ar/como-cultivar-rabanito-en-nuestra-huerta/) — Fecoagro
- **Longevidad** (🟢 8/10): Anual, resistente a heladas (INTA). De ciclo muy corto: una siembra rinde una cosecha; se maneja con siembras escalonadas.
  - 📚 [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Trucos** (🟡 7/10): Sembrar escalonado cada ~15 días para cosecha continua; ralear; mantener el suelo fresco con riegos frecuentes (sobre todo en verano) para evitar el picor; cosechar apenas alcanza el tamaño para que no se endurezca.
  - 📚 [Cómo cultivar Rabanito en nuestra huerta](https://www.fecoagro.com.ar/como-cultivar-rabanito-en-nuestra-huerta/) — Fecoagro
- **Riesgos / a evitar** (🟡 7/10): Se endurece y ahueca si permanece demasiado tiempo en el suelo; sabor picante fuerte por falta de agua o cosecha tardía; tiende a espigar (subir a flor) con calor o días largos.
  - 📚 [Cómo cultivar Rabanito en nuestra huerta](https://www.fecoagro.com.ar/como-cultivar-rabanito-en-nuestra-huerta/) — Fecoagro
- **Plagas y enfermedades** (🟡 6/10): Plagas: pulgones (control con alcohol de ajo) y orugas/vaquitas que comen el follaje. Enfermedades: mildew (manchas amarillas que pardean; se trata con caldo bordelés al 1%).
  - 📚 [Cómo cultivar Rabanito en nuestra huerta](https://www.fecoagro.com.ar/como-cultivar-rabanito-en-nuestra-huerta/) — Fecoagro
- **Se asocia bien con** (🟡 7/10): Zanahoria, lechuga, arvejas y taco de reina (INTA); también espinaca, guisantes, tomate, pepino y habas (tabla de asociaciones). Se asocia bien con cultivos de crecimiento más lento como espinaca o zanahoria (Fecoagro).
  - 📚 [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [Cómo cultivar Rabanito en nuestra huerta](https://www.fecoagro.com.ar/como-cultivar-rabanito-en-nuestra-huerta/) — Fecoagro; [Tabla de asociación de cultivos](https://diario.madrid.es/huertosescolares/wp-content/uploads/sites/46/2021/11/TABLA-ASOCIACION-CULTIVOS-1.pdf) — Huertos Escolares - Ayuntamiento de Madrid
- **Evitar cerca de** (🟡 5/10): Se desaconseja junto a crucíferas: coliflor, repollo y brócoli (tabla de asociaciones; fuente del hemisferio norte, confianza reducida).
  - 📚 [Tabla de asociación de cultivos](https://diario.madrid.es/huertosescolares/wp-content/uploads/sites/46/2021/11/TABLA-ASOCIACION-CULTIVOS-1.pdf) — Huertos Escolares - Ayuntamiento de Madrid

<a id="papa"></a>
## Papa  ·  *Solanum tuberosum*

- **Fecha/s de siembra** (🟢 8/10): INTA (Planificador): plantación 'Agosto-Septiembre / Enero-Febrero'. En la provincia de Buenos Aires más del 96% de la superficie se planta entre octubre y noviembre (papa semitardía), según UNLP. En huerta del GBA se usa una plantación de fin de invierno/primavera (ago-oct) y otra de fin de verano (ene-feb) evitando heladas en emergencia y cosecha.
  - 📚 [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [Guía didáctica: cultivo y manejo de la papa (2022)](https://aulavirtual.agro.unlp.edu.ar/pluginfile.php/101164/mod_folder/content/0/Gu%C3%ADa%20papa%202022.pdf) — Facultad de Ciencias Agrarias y Forestales - UNLP
- **Forma/s de siembra** (🟢 9/10): No se usa semilla botánica: se planta el tubérculo-semilla entero o en trozos, cada uno con al menos 2 yemas. Los trozos se dejan cicatrizar ~4 días a 15 °C con alta humedad antes de plantar. INTA: 20-30 cm entre plantas, 70-75 cm entre líneas.
  - 📚 [Guía didáctica: cultivo y manejo de la papa (2022)](https://aulavirtual.agro.unlp.edu.ar/pluginfile.php/101164/mod_folder/content/0/Gu%C3%ADa%20papa%202022.pdf) — Facultad de Ciencias Agrarias y Forestales - UNLP; [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Suelo** (🟢 8/10): 🟧 **`PROFUNDO_SUELTO`** (Profundo y suelto) — Suelos profundos, sueltos, no salinos, bien drenados, con buena estructura y retención de agua; la raíz llega a ~90 cm. Se aporca para formar un camellón de 20-30 cm donde se desarrollan los tubérculos.
  - ⚠️ *Si no se cumple:* En suelo compacto o encharcado los tubérculos salen chicos y deformes y aumentan las pudriciones por exceso de humedad; sin aporque los tubérculos quedan expuestos a la luz y se verdean.
  - 📚 [Guía didáctica: cultivo y manejo de la papa (2022)](https://aulavirtual.agro.unlp.edu.ar/pluginfile.php/101164/mod_folder/content/0/Gu%C3%ADa%20papa%202022.pdf) — Facultad de Ciencias Agrarias y Forestales - UNLP
- **Luz** (🟡 7/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Requiere pleno sol para buen desarrollo del follaje y la tuberización. El Planificador INTA le asigna tolerancia media a la sombra, pero rinde mejor a pleno sol. _(luz directa: mín 6 h, ideal 6-8 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz el follaje se ahíla y disminuye la tuberización. Atención: los tubérculos expuestos a la luz solar se ponen verdes (clorofila y solanina) y no son aptos para consumo.
  - 📚 [Guía didáctica: cultivo y manejo de la papa (2022)](https://aulavirtual.agro.unlp.edu.ar/pluginfile.php/101164/mod_folder/content/0/Gu%C3%ADa%20papa%202022.pdf) — Facultad de Ciencias Agrarias y Forestales - UNLP; [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Cosecha** (🟢 8/10): Aproximadamente 120-150 días desde la plantación (INTA), según sea variedad precoz o tardía.
  - ✅ *Listo para cosechar:* El amarilleo y secado del follaje indica que el tubérculo llegó a su máximo tamaño; se deja orear/madurar la piel antes de arrancar.
  - 📚 [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [Guía didáctica: cultivo y manejo de la papa (2022)](https://aulavirtual.agro.unlp.edu.ar/pluginfile.php/101164/mod_folder/content/0/Gu%C3%ADa%20papa%202022.pdf) — Facultad de Ciencias Agrarias y Forestales - UNLP
- **Germinación** (🟡 5/10): No germina de semilla: brota de las yemas del tubérculo. La brotación depende del estado fisiológico (dormancia) del tubérculo-semilla; la emergencia del cultivo suele ocurrir unas 2-4 semanas tras la plantación. Dato aproximado.
  - 📚 [Guía didáctica: cultivo y manejo de la papa (2022)](https://aulavirtual.agro.unlp.edu.ar/pluginfile.php/101164/mod_folder/content/0/Gu%C3%ADa%20papa%202022.pdf) — Facultad de Ciencias Agrarias y Forestales - UNLP
- **Trasplante** (🟢 8/10): No se trasplanta: se planta directamente el tubérculo-semilla en el lugar definitivo. La labor clave posterior es el aporque (formar camellón de 20-30 cm) a medida que crece la planta.
  - 🌱 *Listo para trasplantar:* No aplica (no hay plantín). Conviene 'preverdear'/brotar el tubérculo-semilla antes de plantar para acelerar la emergencia.
  - 📚 [Guía didáctica: cultivo y manejo de la papa (2022)](https://aulavirtual.agro.unlp.edu.ar/pluginfile.php/101164/mod_folder/content/0/Gu%C3%ADa%20papa%202022.pdf) — Facultad de Ciencias Agrarias y Forestales - UNLP
- **Longevidad** (🟢 8/10): Anual, sensible a heladas (INTA). Cada mata produce varios tubérculos en una única temporada.
  - 📚 [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Trucos** (🟡 7/10): Usar tubérculo-semilla sano/certificado y preverdearlo para que brote; dejar cicatrizar los trozos antes de plantar; aporcar para aumentar la producción y evitar el verdeado de los tubérculos; rotar (no repetir solanáceas en el mismo cantero).
  - 📚 [Guía didáctica: cultivo y manejo de la papa (2022)](https://aulavirtual.agro.unlp.edu.ar/pluginfile.php/101164/mod_folder/content/0/Gu%C3%ADa%20papa%202022.pdf) — Facultad de Ciencias Agrarias y Forestales - UNLP
- **Riesgos / a evitar** (🟡 7/10): Heladas (planta y cosecha); verdeo de tubérculos por exposición a la luz (acumulan solanina, tóxica); exceso de humedad que provoca pudriciones; brotes largos y débiles si se almacena mal. Conviene rotar para no acumular plagas y enfermedades del suelo.
  - 📚 [Guía didáctica: cultivo y manejo de la papa (2022)](https://aulavirtual.agro.unlp.edu.ar/pluginfile.php/101164/mod_folder/content/0/Gu%C3%ADa%20papa%202022.pdf) — Facultad de Ciencias Agrarias y Forestales - UNLP; [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Plagas y enfermedades** (🟢 8/10): Enfermedad más importante: tizón tardío (Phytophthora infestans). Plagas/vectores: pulgones (especialmente Myzus persicae); polilla de la papa. Virus: enrollamiento de la hoja y mosaico rugoso.
  - 📚 [Guía didáctica: cultivo y manejo de la papa (2022)](https://aulavirtual.agro.unlp.edu.ar/pluginfile.php/101164/mod_folder/content/0/Gu%C3%ADa%20papa%202022.pdf) — Facultad de Ciencias Agrarias y Forestales - UNLP
- **Se asocia bien con** (🟡 6/10): Lechuga (INTA); habas, arvejas, maíz, coliflor, brócoli, repollo, ajo y rábanos (tabla de asociaciones).
  - 📚 [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [Tabla de asociación de cultivos](https://diario.madrid.es/huertosescolares/wp-content/uploads/sites/46/2021/11/TABLA-ASOCIACION-CULTIVOS-1.pdf) — Huertos Escolares - Ayuntamiento de Madrid
- **Evitar cerca de** (🟡 6/10): Se desaconseja junto a otras solanáceas: tomate, pimiento y berenjena (comparten plagas y enfermedades como el tizón). Tabla de asociaciones (fuente del hemisferio norte).
  - 📚 [Tabla de asociación de cultivos](https://diario.madrid.es/huertosescolares/wp-content/uploads/sites/46/2021/11/TABLA-ASOCIACION-CULTIVOS-1.pdf) — Huertos Escolares - Ayuntamiento de Madrid

<a id="batata"></a>
## Batata  ·  *Ipomoea batatas*

- **Fecha/s de siembra** (🟢 8/10): Se hace primero el almácigo/brotación de batatas-semilla en invierno y luego se trasplanta en primavera. INTA (Planificador): almácigo julio-agosto. FIQ-UNL: almácigo agosto, trasplante octubre. El Brote Urbano: almácigo agosto-septiembre y trasplante hacia octubre-noviembre, una vez pasado el riesgo de heladas.
  - 📚 [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [El Suelo - Calendario de siembra, abono y fertilizantes](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — Facultad de Ingeniería Química - UNL; [¿Cómo cultivar Batata?](https://www.elbroteurbano.com/como-cultivar-batata/) — El Brote Urbano
- **Forma/s de siembra** (🟢 8/10): No se siembra por semilla: se propaga vegetativamente. Se hace un almácigo con batatas-semilla (batatas del año anterior conservadas) que emiten brotes/plantines; esos brotes (o esquejes/gajos de plantas existentes) se trasplantan. INTA/FIQ: distancia ~0,3-0,4 m entre plantas y ~0,8-0,9 m entre líneas (camellón).
  - 📚 [¿Cómo cultivar Batata?](https://www.elbroteurbano.com/como-cultivar-batata/) — El Brote Urbano; [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [El Suelo - Calendario de siembra, abono y fertilizantes](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — Facultad de Ingeniería Química - UNL
- **Suelo** (🟡 7/10): 🟫 **`ARENOSO_DRENANTE`** (Arenoso / drenante) — Tolera gran variedad de suelos, pero son ideales los de buena fertilidad, sueltos en los primeros 30 cm y con buen drenaje. Se planta en camellón/lomo.
  - ⚠️ *Si no se cumple:* En suelo pesado, compacto o encharcado las raíces engrosadas salen deformes y aumenta el riesgo de pudrición.
  - 📚 [¿Cómo cultivar Batata?](https://www.elbroteurbano.com/como-cultivar-batata/) — El Brote Urbano
- **Luz** (🟡 7/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Necesita pleno sol y temperaturas cálidas. El Planificador INTA le asigna tolerancia media a mucha luz; detiene su crecimiento por debajo de 15 °C. _(luz directa: mín 6 h, ideal 6-8 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con frío (<15 °C) o poca luz el crecimiento se detiene; es muy sensible a las heladas, que la dañan gravemente.
  - 📚 [¿Cómo cultivar Batata?](https://www.elbroteurbano.com/como-cultivar-batata/) — El Brote Urbano; [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Cosecha** (🟡 6/10): El Brote Urbano: 130-150 días desde el trasplante. FIQ-UNL: 140-150 días. INTA (Planificador): 250-270 días (ciclo total incluyendo almácigo). La cosecha debe completarse antes de las primeras heladas otoñales.
  - ✅ *Listo para cosechar:* El follaje empieza a amarillear y se cosecha antes de las heladas; las raíces alcanzan buen tamaño (rinde ~2-2,5 kg/m2).
  - 📚 [¿Cómo cultivar Batata?](https://www.elbroteurbano.com/como-cultivar-batata/) — El Brote Urbano; [El Suelo - Calendario de siembra, abono y fertilizantes](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — Facultad de Ingeniería Química - UNL; [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Germinación** (🟡 6/10): No germina de semilla. En el almácigo, las batatas-semilla emiten brotes que se convierten en plantines; estos alcanzan tamaño de trasplante (25-30 cm) en unos 60 días.
  - 📚 [¿Cómo cultivar Batata?](https://www.elbroteurbano.com/como-cultivar-batata/) — El Brote Urbano
- **Trasplante** (🟡 7/10): Sí requiere trasplante: los brotes/plantines del almácigo se llevan al lugar definitivo (camellón) en primavera, cuando ya no hay riesgo de heladas.
  - 🌱 *Listo para trasplantar:* Plantines de unos 25-30 cm de alto (aprox. 60 días desde el almácigo), con varias hojas y raíces.
  - 📚 [¿Cómo cultivar Batata?](https://www.elbroteurbano.com/como-cultivar-batata/) — El Brote Urbano
- **Longevidad** (🟡 7/10): Especie perenne cultivada como anual en clima templado (se levanta antes de las heladas). Sensible a heladas (INTA). Una temporada de cultivo por planta.
  - 📚 [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [¿Cómo cultivar Batata?](https://www.elbroteurbano.com/como-cultivar-batata/) — El Brote Urbano
- **Trucos** (🟡 6/10): Conservar batatas-semilla del año anterior para producir los brotes; plantar en camellón/lomo alto para favorecer el engrosamiento de las raíces y el drenaje; ubicar a pleno sol; controlar las malezas los primeros 40 días y cosechar antes de las heladas.
  - 📚 [¿Cómo cultivar Batata?](https://www.elbroteurbano.com/como-cultivar-batata/) — El Brote Urbano
- **Riesgos / a evitar** (🟡 7/10): Muy sensible a las heladas (dañan follaje y raíces); el frío por debajo de 15 °C detiene el crecimiento; las malezas son la principal amenaza en la etapa inicial. Exceso de agua o suelo pesado favorece pudriciones.
  - 📚 [¿Cómo cultivar Batata?](https://www.elbroteurbano.com/como-cultivar-batata/) — El Brote Urbano
- **Plagas y enfermedades** (🟡 5/10): En la región central del país la batata no suele presentar plagas significativas y las malezas son la principal amenaza inicial (El Brote Urbano). Plaga clave del cultivo a nivel general: el gorgojo de la batata (Cylas/Euscepes). Confianza reducida por falta de detalle de fuente local.
  - 📚 [¿Cómo cultivar Batata?](https://www.elbroteurbano.com/como-cultivar-batata/) — El Brote Urbano
- **Se asocia bien con** (🟡 5/10): Choclo/maíz; INTA la ubica en la 'chacra de verano' junto al choclo.
  - 📚 [Planificador de huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Evitar cerca de** (🔴 2/10): sin dato confiable
  - 📚 _(sin fuente registrada)_

<a id="cebolla"></a>
## Cebolla  ·  *Allium cepa*

- **Fecha/s de siembra** (🟢 8/10): GBA (hemisferio sur): almácigo en marzo-abril y siembra directa en abril, según el calendario de INTA/ProHuerta. Cultivo de otoño-invierno para bulbo de cosecha primavera-verano.
  - 📚 [Calendario de siembra (ProHuerta)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta / Ministerio de Agricultura de la Nación
- **Forma/s de siembra** (🟡 7/10): Conviene almácigo y posterior trasplante (mejor control de plántulas y densidad); también admite siembra directa en línea en abril. Se trasplanta cuando el plantín alcanza grosor de lápiz.
  - 📚 [Calendario de siembra (ProHuerta)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta; [Cultivo, cuidados y siembra de la cebolla](https://www.fecoagro.com.ar/cultivo-cuidados-y-siembra-de-la-cebolla/) — Fecoagro (Argentina)
- **Suelo** (🟡 6/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Suelo suelto, permeable y rico en materia orgánica, sin problemas de drenaje.
  - ⚠️ *Si no se cumple:* En suelos pesados, compactados o mal drenados se producen pudriciones de bulbo (podredumbre blanca/botrytis) y bulbos pequeños o deformes.
  - 📚 [Cultivo, cuidados y siembra de la cebolla](https://www.fecoagro.com.ar/cultivo-cuidados-y-siembra-de-la-cebolla/) — Fecoagro (Argentina)
- **Luz** (🟡 6/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Pleno sol. La cebolla necesita días largos (12-16 h de luz según variedad) para formar bulbo. _(luz directa: mín 6 h, ideal 12-16 (fotoperíodo de día largo para bulbificar) h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con luz insuficiente no bulbifica bien: se ahíla, da bulbos pequeños o solo follaje.
  - 📚 [Cultivo, cuidados y siembra de la cebolla](https://www.fecoagro.com.ar/cultivo-cuidados-y-siembra-de-la-cebolla/) — Fecoagro (Argentina)
- **Cosecha** (🟡 7/10): Aproximadamente 270 días desde la siembra (INTA); unos 180-210 días desde el trasplante (Fecoagro).
  - ✅ *Listo para cosechar:* El cuello del bulbo se ablanda y el follaje se vuelca sobre el suelo; se cosecha cuando cerca del 60% del follaje se ha volcado.
  - 📚 [Calendario de siembra (ProHuerta)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta; [Cultivo, cuidados y siembra de la cebolla](https://www.fecoagro.com.ar/cultivo-cuidados-y-siembra-de-la-cebolla/) — Fecoagro (Argentina)
- **Germinación** (🟡 5/10): Emergencia en torno a 7-15 días. El plantín llega a tamaño de trasplante (~10-15 cm de alto y 0,5 cm de diámetro) a los 40-50 días.
  - 📚 [Cultivo, cuidados y siembra de la cebolla](https://www.fecoagro.com.ar/cultivo-cuidados-y-siembra-de-la-cebolla/) — Fecoagro (Argentina)
- **Trasplante** (🟡 5/10): Se trasplanta a los ~50-60 días de almácigo.
  - 🌱 *Listo para trasplantar:* Plantín con grosor de lápiz (aprox. 15 cm de alto y 0,5 cm de diámetro).
  - 📚 [Cultivo, cuidados y siembra de la cebolla](https://www.fecoagro.com.ar/cultivo-cuidados-y-siembra-de-la-cebolla/) — Fecoagro (Argentina)
- **Longevidad** (🟡 5/10): Bienal, cultivada como anual: forma el bulbo en el primer ciclo y florece/semilla al segundo año. Produce un bulbo por planta.
  - 📚 [Cultivo, cuidados y siembra de la cebolla](https://www.fecoagro.com.ar/cultivo-cuidados-y-siembra-de-la-cebolla/) — Fecoagro (Argentina)
- **Trucos** (🟡 6/10): Suspender el riego unos 30 días antes de la cosecha para que el bulbo cierre; aportar compost durante la bulbificación; mantener libre de malezas por su follaje escaso; para prevenir mildiu, ventilar el cultivo.
  - 📚 [Cultivo, cuidados y siembra de la cebolla](https://www.fecoagro.com.ar/cultivo-cuidados-y-siembra-de-la-cebolla/) — Fecoagro (Argentina)
- **Riesgos / a evitar** (🟡 6/10): Exceso de humedad y mal drenaje que provocan pudriciones; competencia de malezas por su follaje delgado; cosechar con lluvia favorece podredumbres en almacenamiento.
  - 📚 [Cultivo, cuidados y siembra de la cebolla](https://www.fecoagro.com.ar/cultivo-cuidados-y-siembra-de-la-cebolla/) — Fecoagro (Argentina)
- **Plagas y enfermedades** (🟡 6/10): Plagas: trips (dejan follaje plateado) y nematodos. Enfermedades: mildiu, podredumbre blanca y podredumbre del cuello (botrytis).
  - 📚 [Cultivo, cuidados y siembra de la cebolla](https://www.fecoagro.com.ar/cultivo-cuidados-y-siembra-de-la-cebolla/) — Fecoagro (Argentina)
- **Se asocia bien con** (🟡 5/10): Zanahoria, remolacha, lechuga, frutilla, tomate y papa (las aliáceas repelen plagas de la zanahoria).
  - 📚 [Cómo hacer asociaciones de cultivos en la huerta orgánica](https://medioambienteenaccion.com.ar/contenido/3938/como-hacer-asociaciones-de-cultivos-en-la-huerta-organica) — Medio Ambiente en Acción (Argentina)
- **Evitar cerca de** (🟡 5/10): Legumbres (arvejas, porotos, habas) y coles/crucíferas; conviene no plantarla junto a otras aliáceas para evitar competencia y plagas comunes.
  - 📚 [Cómo hacer asociaciones de cultivos en la huerta orgánica](https://medioambienteenaccion.com.ar/contenido/3938/como-hacer-asociaciones-de-cultivos-en-la-huerta-organica) — Medio Ambiente en Acción (Argentina)

<a id="ajo"></a>
## Ajo  ·  *Allium sativum*

- **Fecha/s de siembra** (🟢 9/10): GBA (hemisferio sur): siembra directa en otoño, marzo-abril (INTA); a partir de mediados de abril es el período ideal (La Nación). Cosecha hacia fin de año.
  - 📚 [Calendario de siembra (ProHuerta)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta; [Ajos en la huerta: por qué el otoño es el mejor momento para plantarlos](https://www.lanacion.com.ar/revista-jardin/aprovecha-el-otono-para-plantar-ajos-en-tu-huerta-nid01042023/) — La Nación - Revista Jardín (Argentina)
- **Forma/s de siembra** (🟢 8/10): Siembra directa por diente ('ajo semilla'), colocado con la parte plana (raíces) hacia abajo, a 5-7 cm de profundidad, cada ~12 cm (5 cm si es ajo tierno). No se hace almácigo.
  - 📚 [Ajos en la huerta: por qué el otoño es el mejor momento para plantarlos](https://www.lanacion.com.ar/revista-jardin/aprovecha-el-otono-para-plantar-ajos-en-tu-huerta-nid01042023/) — La Nación - Revista Jardín (Argentina)
- **Suelo** (🟡 7/10): 🟧 **`PROFUNDO_SUELTO`** (Profundo y suelto) — Suelo muy suelto, profundamente labrado y permeable; no prospera en terrenos pesados y húmedos.
  - ⚠️ *Si no se cumple:* En suelo pesado, compacto o encharcado el diente se pudre y da bulbos pequeños o mal formados.
  - 📚 [Ajos en la huerta: por qué el otoño es el mejor momento para plantarlos](https://www.lanacion.com.ar/revista-jardin/aprovecha-el-otono-para-plantar-ajos-en-tu-huerta-nid01042023/) — La Nación - Revista Jardín (Argentina)
- **Luz** (🟡 6/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Pleno sol; requiere un sector soleado para bulbificar. _(luz directa: mín 6 h, ideal 6 o más h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con sombra o poca luz da bulbos pequeños y desarrollo pobre, con predominio de follaje.
  - 📚 [Ajos en la huerta: por qué el otoño es el mejor momento para plantarlos](https://www.lanacion.com.ar/revista-jardin/aprovecha-el-otono-para-plantar-ajos-en-tu-huerta-nid01042023/) — La Nación - Revista Jardín (Argentina)
- **Cosecha** (🟢 8/10): 150-180 días desde la plantación (INTA); unos 6-7 meses, cosecha hacia fin de año en GBA (La Nación). El ajo tierno se cosecha a los 2-3 meses.
  - ✅ *Listo para cosechar:* Cuando aproximadamente ¾ partes del follaje amarillean y toman aspecto pajizo/seco.
  - 📚 [Calendario de siembra (ProHuerta)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta; [Ajos en la huerta: por qué el otoño es el mejor momento para plantarlos](https://www.lanacion.com.ar/revista-jardin/aprovecha-el-otono-para-plantar-ajos-en-tu-huerta-nid01042023/) — La Nación - Revista Jardín (Argentina)
- **Germinación** (🔴 4/10): El diente brota en torno a 1-2 semanas según temperatura del suelo.
  - 📚 [Ajos en la huerta: por qué el otoño es el mejor momento para plantarlos](https://www.lanacion.com.ar/revista-jardin/aprovecha-el-otono-para-plantar-ajos-en-tu-huerta-nid01042023/) — La Nación - Revista Jardín (Argentina)
- **Trasplante** (🟢 8/10): No requiere trasplante: se planta directamente el diente en su lugar definitivo.
  - 🌱 *Listo para trasplantar:* No aplica (siembra directa por diente).
  - 📚 [Ajos en la huerta: por qué el otoño es el mejor momento para plantarlos](https://www.lanacion.com.ar/revista-jardin/aprovecha-el-otono-para-plantar-ajos-en-tu-huerta-nid01042023/) — La Nación - Revista Jardín (Argentina)
- **Longevidad** (🟡 6/10): Anual: se planta el diente y se cosecha el bulbo en un ciclo (~6-7 meses); no se conserva la planta.
  - 📚 [Ajos en la huerta: por qué el otoño es el mejor momento para plantarlos](https://www.lanacion.com.ar/revista-jardin/aprovecha-el-otono-para-plantar-ajos-en-tu-huerta-nid01042023/) — La Nación - Revista Jardín (Argentina)
- **Trucos** (🟡 6/10): Cortar el escapo floral estimula el engrose de los dientes; en climas fríos usar mulch de paja; trenzar en ristras favorece el secado y almacenamiento; plantar el diente con la parte plana hacia abajo.
  - 📚 [Ajos en la huerta: por qué el otoño es el mejor momento para plantarlos](https://www.lanacion.com.ar/revista-jardin/aprovecha-el-otono-para-plantar-ajos-en-tu-huerta-nid01042023/) — La Nación - Revista Jardín (Argentina)
- **Riesgos / a evitar** (🟡 5/10): Exceso de humedad y suelos pesados que pudren el diente; plantar en fecha muy tardía reduce el tamaño del bulbo.
  - 📚 [Ajos en la huerta: por qué el otoño es el mejor momento para plantarlos](https://www.lanacion.com.ar/revista-jardin/aprovecha-el-otono-para-plantar-ajos-en-tu-huerta-nid01042023/) — La Nación - Revista Jardín (Argentina)
- **Plagas y enfermedades** (🟡 5/10): Trips, ácaros y nematodo del tallo; enfermedades: roya (Puccinia) y podredumbre blanca. (Fuente principal de sanidad tomada de aliáceas afines como cebolla/puerro).
  - 📚 [El cultivo del puerro (sanidad de aliáceas)](https://www.infoagro.com/hortalizas/puerro.htm) — Infoagro (España, hemisferio norte); [Cultivo, cuidados y siembra de la cebolla](https://www.fecoagro.com.ar/cultivo-cuidados-y-siembra-de-la-cebolla/) — Fecoagro (Argentina)
- **Se asocia bien con** (🟡 5/10): Repollos, brócoli, coliflor, acelga, remolacha, lechuga, apio y zanahoria (el ajo ayuda a repeler plagas).
  - 📚 [Ajos en la huerta: por qué el otoño es el mejor momento para plantarlos](https://www.lanacion.com.ar/revista-jardin/aprovecha-el-otono-para-plantar-ajos-en-tu-huerta-nid01042023/) — La Nación - Revista Jardín (Argentina)
- **Evitar cerca de** (🟡 5/10): Legumbres (arvejas, porotos, habas) y espárrago; en general se evita asociar aliáceas con leguminosas.
  - 📚 [Cómo hacer asociaciones de cultivos en la huerta orgánica](https://medioambienteenaccion.com.ar/contenido/3938/como-hacer-asociaciones-de-cultivos-en-la-huerta-organica) — Medio Ambiente en Acción (Argentina)

<a id="puerro"></a>
## Puerro  ·  *Allium porrum (Allium ampeloprasum var. porrum)*

- **Fecha/s de siembra** (🟢 8/10): GBA (hemisferio sur): almácigo de febrero a abril y trasplante de mayo a julio, según INTA. Cultivo de ciclo otoño-invierno.
  - 📚 [Calendario de siembra (ProHuerta)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta
- **Forma/s de siembra** (🟡 7/10): Almácigo y posterior trasplante (es lo habitual y recomendado); se trasplanta cuando el plantín tiene grosor de lápiz. Marco de plantación 20x40 o 10x40 cm.
  - 📚 [Calendario de siembra (ProHuerta)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta; [El cultivo del puerro](https://www.infoagro.com/hortalizas/puerro.htm) — Infoagro (España, hemisferio norte)
- **Suelo** (🟡 6/10): 🟧 **`PROFUNDO_SUELTO`** (Profundo y suelto) — Suelos profundos, frescos y ricos en materia orgánica; pH cercano a 6. Evitar suelos pedregosos, poco profundos o mal drenados.
  - ⚠️ *Si no se cumple:* En suelos pedregosos o superficiales el tallo se deforma y se acorta; con mal drenaje aparecen pudriciones y patógenos.
  - 📚 [El cultivo del puerro](https://www.infoagro.com/hortalizas/puerro.htm) — Infoagro (España, hemisferio norte)
- **Luz** (🟡 5/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Pleno sol, aunque tolera algo de sol parcial; prefiere clima suave y húmedo. _(luz directa: mín 4-6 h, ideal 6 o más h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz el desarrollo es lento y las plantas se ahílan, dando tallos delgados.
  - 📚 [El cultivo del puerro](https://www.infoagro.com/hortalizas/puerro.htm) — Infoagro (España, hemisferio norte)
- **Cosecha** (🟡 7/10): 120-150 días (INTA); alrededor de 5 meses desde la siembra (Infoagro).
  - ✅ *Listo para cosechar:* Plantas de aproximadamente 50 cm de alto y 3-5 cm de grosor del fuste blanco (según destino/mercado).
  - 📚 [Calendario de siembra (ProHuerta)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta; [El cultivo del puerro](https://www.infoagro.com/hortalizas/puerro.htm) — Infoagro (España, hemisferio norte)
- **Germinación** (🟡 5/10): Emergencia en torno a 10-14 días. El plantín permanece unos 2 meses en el semillero hasta alcanzar 15-20 cm de altura.
  - 📚 [El cultivo del puerro](https://www.infoagro.com/hortalizas/puerro.htm) — Infoagro (España, hemisferio norte)
- **Trasplante** (🟡 6/10): Se trasplanta a los ~2 meses de almácigo (mayo-julio en GBA).
  - 🌱 *Listo para trasplantar:* Plantín de 15-20 cm de altura con grosor de lápiz.
  - 📚 [El cultivo del puerro](https://www.infoagro.com/hortalizas/puerro.htm) — Infoagro (España, hemisferio norte); [Calendario de siembra (ProHuerta)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta
- **Longevidad** (🟡 5/10): Bienal, cultivada como anual: se cosecha el fuste blanco en el primer ciclo; florecería y semillaría al segundo año.
  - 📚 [El cultivo del puerro](https://www.infoagro.com/hortalizas/puerro.htm) — Infoagro (España, hemisferio norte)
- **Trucos** (🟡 6/10): Blanquear el fuste mediante aporque (aportar tierra sobre las plantas ~1 mes antes de la cosecha) para obtener mayor porción blanca y tierna; trasplantar en surco/hoyo profundo ayuda al blanqueo.
  - 📚 [El cultivo del puerro](https://www.infoagro.com/hortalizas/puerro.htm) — Infoagro (España, hemisferio norte)
- **Riesgos / a evitar** (🟡 5/10): Sensible a exceso de humedad y a suelos pedregosos/mal drenados; en poscosecha puede afectarlo la bacteria Pseudomonas syringae.
  - 📚 [El cultivo del puerro](https://www.infoagro.com/hortalizas/puerro.htm) — Infoagro (España, hemisferio norte)
- **Plagas y enfermedades** (🟡 6/10): Plagas: trips (Thrips tabaci) y polilla del puerro/cebolla (Acrolepia assectella). Enfermedades: mildiu (Peronospora) y roya (Puccinia porri).
  - 📚 [El cultivo del puerro](https://www.infoagro.com/hortalizas/puerro.htm) — Infoagro (España, hemisferio norte)
- **Se asocia bien con** (🟡 6/10): Zanahoria (protección mutua: el puerro aleja moscas y áfidos de la zanahoria), apio, remolacha y lechuga.
  - 📚 [Cómo hacer asociaciones de cultivos en la huerta orgánica](https://medioambienteenaccion.com.ar/contenido/3938/como-hacer-asociaciones-de-cultivos-en-la-huerta-organica) — Medio Ambiente en Acción (Argentina)
- **Evitar cerca de** (🟡 5/10): Legumbres (arvejas, porotos, habas); en general se evita asociar aliáceas con leguminosas.
  - 📚 [Cómo hacer asociaciones de cultivos en la huerta orgánica](https://medioambienteenaccion.com.ar/contenido/3938/como-hacer-asociaciones-de-cultivos-en-la-huerta-organica) — Medio Ambiente en Acción (Argentina)


---

# Hortaliza de fruto

<a id="tomate"></a>
## Tomate  ·  *Solanum lycopersicum*

- **Fecha/s de siembra** (🟢 9/10): Almácigo protegido: agosto-octubre (INTA/ProHuerta indican almácigo ago-oct y trasplante sep-nov, siempre después de la última helada; en GBA la última helada suele darse hacia septiembre). Siembra directa 'a golpes': octubre a enero. UNIDA coincide: almácigo sep-oct, trasplante oct-dic.
  - 📚 [INTA - Calendario de siembra (Seguridad Alimentaria)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Ministerio de Desarrollo Social; [El Suelo - Calendario de siembra, abono y fertilizantes](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — FIQ - Universidad Nacional del Litoral; [Calendarios de Siembra (aptos zona Argentina)](https://www.unida.org.ar/Virtuales/Huerta/Calendarios%20de%20Siembra.pdf) — UNIDA
- **Forma/s de siembra** (🟢 9/10): Preferentemente almácigo y luego trasplante (recomendado en INTA/ProHuerta); también admite siembra directa 'a golpes' en primavera-verano. El almácigo permite adelantar el cultivo y proteger de heladas.
  - 📚 [INTA - Calendario de siembra](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Min. Desarrollo Social; [El Suelo - Calendario de siembra (FIQ-UNL)](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — FIQ - UNL
- **Suelo** (🟢 8/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Suelos sueltos, profundos, con buen nivel de materia orgánica y bien drenados. pH óptimo 6,5-6,9 (tolera desde 5,5).
  - ⚠️ *Si no se cumple:* En suelos pesados, encharcados o pobres crece débil, es más susceptible a enfermedades de raíz (Phytophthora, marchitez) y baja el rendimiento; el mal drenaje favorece la podredumbre.
  - 📚 [Ficha de cultivo Tomate](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Tomate.pdf) — Cátedra de Horticultura - Universidad Nacional de Luján
- **Luz** (🟡 7/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Cultivo exigente en luz; requiere pleno sol para florecer y fructificar bien. _(luz directa: mín 6 h, ideal >=6-8 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz la planta se ahíla (tallos largos y débiles), atrasa y reduce la floración/cuaje y produce pocos frutos, más blandos y de peor color.
  - 📚 [Ficha de cultivo Tomate](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Tomate.pdf) — Cátedra de Horticultura - UNLu
- **Cosecha** (🟢 8/10): 80 a 100 días desde la siembra hasta la cosecha (INTA/ProHuerta). Desde la apertura de la flor a la maduración del fruto transcurren 50-60 días (UNLu).
  - ✅ *Listo para cosechar:* Fruto de color rojo (o el color de la variedad) uniforme, firme pero que cede levemente a la presión; se desprende con facilidad del pedúnculo.
  - 📚 [INTA - Calendario de siembra](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Min. Desarrollo Social; [Ficha de cultivo Tomate](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Tomate.pdf) — Cátedra de Horticultura - UNLu
- **Germinación** (🟡 7/10): Germina con temperatura óptima de 18-20 °C, aproximadamente en 6-10 días. Por debajo de 8,5-12 °C o por encima de 35-37 °C el crecimiento de la radícula es muy lento.
  - 📚 [Ficha de cultivo Tomate](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Tomate.pdf) — Cátedra de Horticultura - UNLu
- **Trasplante** (🟢 8/10): Se trasplanta desde el almácigo: siembras tempranas ~60 días de almácigo, siembras tardías ~30 días. Marco final: surcos a 0,80-1,20 m y 25-50 cm entre plantas (INTA: 30-50 x 70 cm), densidad media ~3 plantas/m2.
  - 🌱 *Listo para trasplantar:* Plantín con el segundo par de hojas verdaderas expandidas (aprox. 10-15 cm de altura) y pasado el riesgo de heladas.
  - 📚 [Ficha de cultivo Tomate](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Tomate.pdf) — Cátedra de Horticultura - UNLu; [INTA - Calendario de siembra](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Min. Desarrollo Social
- **Longevidad** (🟡 7/10): Anual en cultivo de huerta (en clima templado con heladas). Produce durante toda la temporada primavera-verano-otoño; las variedades indeterminadas siguen dando frutos escalonadamente hasta las primeras heladas.
  - 📚 [Ficha de cultivo Tomate](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Tomate.pdf) — Cátedra de Horticultura - UNLu
- **Trucos** (🟡 7/10): Trasplantar después de la última helada; tutorar y realizar desbrote/poda en variedades indeterminadas; intercalar albahaca entre las líneas para reducir insectos y flores de copete (tagetes) contra arañuela roja y ácaros. Riego regular y parejo para evitar podredumbre apical y rajado del fruto.
  - 📚 [El Suelo - Calendario de siembra (FIQ-UNL)](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — FIQ - UNL; [Asociaciones de cultivos en nuestra huerta](https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/) — Fecoagro
- **Riesgos / a evitar** (🟡 6/10): Evitar heladas (mata la planta), exceso o falta de agua (podredumbre apical / rajado), y suelos mal drenados. No repetir tomate/solanáceas en el mismo cantero años seguidos por acumulación de enfermedades de suelo. Sensible a hongos en ambientes húmedos sin aireación.
  - 📚 [Ficha de cultivo Tomate](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Tomate.pdf) — Cátedra de Horticultura - UNLu
- **Plagas y enfermedades** (🟡 6/10): Pulgones, mosca blanca, arañuela roja/ácaros, chinches y polilla del tomate (Tuta absoluta); enfermedades fúngicas como tizón (Phytophthora), oídio, botritis; y virosis. La podredumbre apical (blossom-end rot) es un desorden fisiológico por falta de calcio/riego irregular.
  - 📚 [El Suelo - Calendario de siembra (FIQ-UNL)](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — FIQ - UNL; [Ficha de cultivo Tomate](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Tomate.pdf) — Cátedra de Horticultura - UNLu
- **Se asocia bien con** (🟡 6/10): Albahaca (repele insectos y chinches), flores de copete/tagetes y caléndula (control de plagas), zanahoria, apio, cebolla, ajo, puerro, lechuga y espinaca.
  - 📚 [Asociaciones de cultivos en nuestra huerta](https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/) — Fecoagro; [Ejemplos de asociaciones de cultivos](https://www.ecoagricultor.com/ejemplos-de-asociaciones-de-cultivos-a-la-hora-de-planificar-el-diseno-del-huerto/) — Ecoagricultor
- **Evitar cerca de** (🟡 6/10): Papa (comparten plagas y tizón), otras solanáceas, brócoli/coliflor y brasicáceas, arveja, remolacha y calabacín/zapallo. El hinojo también se cita como desfavorable para casi toda la huerta.
  - 📚 [Ejemplos de asociaciones de cultivos](https://www.ecoagricultor.com/ejemplos-de-asociaciones-de-cultivos-a-la-hora-de-planificar-el-diseno-del-huerto/) — Ecoagricultor

<a id="pimiento-morron"></a>
## Pimiento / Morrón  ·  *Capsicum annuum*

- **Fecha/s de siembra** (🟢 8/10): Almácigo protegido a fin de invierno: julio-septiembre (Fecoagro y UNIDA: jul-ago; INTA/ProHuerta: ago-sep). Trasplante en primavera: septiembre-octubre, pasado el riesgo de heladas.
  - 📚 [INTA - Calendario de siembra](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Min. Desarrollo Social; [El Suelo - Calendario de siembra (FIQ-UNL)](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — FIQ - UNL; [Calendarios de Siembra (zona Argentina)](https://www.unida.org.ar/Virtuales/Huerta/Calendarios%20de%20Siembra.pdf) — UNIDA
- **Forma/s de siembra** (🟢 8/10): Almácigo y posterior trasplante (recomendado): la semilla germina lento y el plantín necesita protección de las heladas antes de llevarlo al lugar definitivo.
  - 📚 [PIMIENTO (Capsicum annuum L.) - Ficha de cultivo](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Pimiento.pdf) — Cátedra de Horticultura - UNLu; [INTA - Calendario de siembra](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Min. Desarrollo Social
- **Suelo** (🟢 8/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Suelos con abundante materia orgánica, buen drenaje y aireación. Resiste cierta acidez hasta pH 5,5 (óptimo cercano a la neutralidad).
  - ⚠️ *Si no se cumple:* En suelos encharcados o compactos se asfixian las raíces y aparecen podredumbres (Phytophthora, Pythium); en suelos pobres crece débil y cuaja pocos frutos.
  - 📚 [PIMIENTO - Ficha de cultivo (UNLu)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Pimiento.pdf) — Cátedra de Horticultura - UNLu
- **Luz** (🟢 8/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Muy exigente en luminosidad durante todo el ciclo, principalmente en floración. Requiere pleno sol. _(luz directa: mín 6 h, ideal >=6-8 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con luz insuficiente la planta se ahíla, la floración es escasa y caen las flores/frutos pequeños (mal cuaje), con bajo rendimiento.
  - 📚 [PIMIENTO - Ficha de cultivo (UNLu)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Pimiento.pdf) — Cátedra de Horticultura - UNLu
- **Cosecha** (🟢 8/10): 80 a 100 días desde la siembra (INTA/ProHuerta). Desde el trasplante: 70-90 días para morrón verde y 15-20 días más para que vire a rojo/amarillo (UNLu).
  - ✅ *Listo para cosechar:* Fruto de tamaño y forma propios de la variedad, firme y brillante; se cosecha verde (maduración comercial verde) o esperando el viraje a rojo/amarillo para consumo maduro.
  - 📚 [INTA - Calendario de siembra](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Min. Desarrollo Social; [PIMIENTO - Ficha de cultivo (UNLu)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Pimiento.pdf) — Cátedra de Horticultura - UNLu
- **Germinación** (🟢 8/10): Germina entre los 8 y 12 días posteriores a la siembra, con temperatura óptima de 20-30 °C. Por debajo de 13 °C o por encima de 37 °C puede no germinar.
  - 📚 [PIMIENTO - Ficha de cultivo (UNLu)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Pimiento.pdf) — Cátedra de Horticultura - UNLu
- **Trasplante** (🟢 8/10): El almácigo requiere hasta ~45 días para alcanzar estado de trasplante. Marco: hileras simples a 0,90 m y 0,40-0,50 m entre plantas (INTA: 40 x 70 cm); doble hilera a 0,60 m con pasillo de 1 m.
  - 🌱 *Listo para trasplantar:* Plantín con 5 a 10 hojas verdaderas y 10-15 cm de altura, conviene trasplantar antes de que aparezca el botón floral.
  - 📚 [PIMIENTO - Ficha de cultivo (UNLu)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Pimiento.pdf) — Cátedra de Horticultura - UNLu; [INTA - Calendario de siembra](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Min. Desarrollo Social
- **Longevidad** (🟡 6/10): Botánicamente perenne pero cultivado como anual en clima templado (las heladas lo matan). Produce escalonadamente durante toda la temporada estival hasta el otoño.
  - 📚 [PIMIENTO - Ficha de cultivo (UNLu)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Pimiento.pdf) — Cátedra de Horticultura - UNLu
- **Trucos** (🟡 6/10): Trasplantar con buena temperatura y sin botón floral aún; asociar con menta para reducir pulgones; riego regular sin encharcar y tutorado en plantas cargadas. Aprovecha bien suelos ricos en materia orgánica.
  - 📚 [El Suelo - Calendario de siembra (FIQ-UNL)](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — FIQ - UNL; [PIMIENTO - Ficha de cultivo (UNLu)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Pimiento.pdf) — Cátedra de Horticultura - UNLu
- **Riesgos / a evitar** (🟡 7/10): Muy susceptible a virus; sensible a heladas y a suelos encharcados. Desórdenes fisiológicos: podredumbre apical (falta de calcio/riego irregular) y mancha/golpe de sol en frutos expuestos. No repetir solanáceas en el mismo suelo.
  - 📚 [PIMIENTO - Ficha de cultivo (UNLu)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Pimiento.pdf) — Cátedra de Horticultura - UNLu
- **Plagas y enfermedades** (🟢 8/10): Pulgón y mosca blanca (vectores de virus), trips y arañuela. Hongos: Pythium, Sclerotinia, Phytophthora y Botrytis. Muy susceptible a virosis.
  - 📚 [PIMIENTO - Ficha de cultivo (UNLu)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Pimiento.pdf) — Cátedra de Horticultura - UNLu
- **Se asocia bien con** (🟡 6/10): Zanahoria, berenjena, tomate, cebolla y otras variedades de pimiento; la menta cercana ayuda contra pulgones. Albahaca y caléndula como repelentes de plagas.
  - 📚 [Ejemplos de asociaciones de cultivos](https://www.ecoagricultor.com/ejemplos-de-asociaciones-de-cultivos-a-la-hora-de-planificar-el-diseno-del-huerto/) — Ecoagricultor; [El Suelo - Calendario de siembra (FIQ-UNL)](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — FIQ - UNL
- **Evitar cerca de** (🟡 5/10): Remolacha, arveja, poroto/judías y colirábano; conviene no ubicarlo junto a brasicáceas (col, brócoli) ni repetir con otras solanáceas.
  - 📚 [Ejemplos de asociaciones de cultivos](https://www.ecoagricultor.com/ejemplos-de-asociaciones-de-cultivos-a-la-hora-de-planificar-el-diseno-del-huerto/) — Ecoagricultor

<a id="aji-picante"></a>
## Ají picante  ·  *Capsicum annuum / Capsicum frutescens / Capsicum chinense*

- **Fecha/s de siembra** (🟡 5/10): Almácigo a fin de invierno-primavera: agosto-septiembre (mismos criterios que el pimiento, con el que comparte especie C. annuum), trasplante en primavera (oct-nov) pasado el riesgo de heladas. Fuentes de cultivo de picantes en Argentina recomiendan germinar en primavera cuando la temperatura promedia ~16 °C. El ají NO figura como especie separada en los calendarios de INTA/ProHuerta consultados (se asimila al pimiento); confianza intermedia.
  - 📚 [Cómo cultivar ají/chile en casa (Alta Huerta)](https://altahuerta.com/aji-chile/) — Alta Huerta (Argentina); [¿Cuándo germinar chiles picantes en Argentina?](https://www.locosxelpicante.com/cuando-germinar/) — Locos x el Picante (Argentina); [INTA - Calendario de siembra (referencia pimiento)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Min. Desarrollo Social
- **Forma/s de siembra** (🟡 6/10): Almácigo y posterior trasplante (recomendado): sembrar 2-3 semillas por celda a ~0,5 cm de profundidad, desde fines del invierno hasta comienzos del verano.
  - 📚 [Cómo cultivar ají/chile en casa (Alta Huerta)](https://altahuerta.com/aji-chile/) — Alta Huerta
- **Suelo** (🟡 5/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Como Capsicum, prefiere suelos ricos en materia orgánica, sueltos y con buen drenaje y aireación (dato asimilado del pimiento).
  - ⚠️ *Si no se cumple:* En suelos encharcados o compactos las raíces se asfixian y aparecen podredumbres; en suelos pobres la planta rinde poco.
  - 📚 [PIMIENTO - Ficha de cultivo (UNLu)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Pimiento.pdf) — Cátedra de Horticultura - UNLu
- **Luz** (🟡 6/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Necesita al menos 6 horas diarias de luz solar directa; exigente en luminosidad como todo Capsicum. _(luz directa: mín 6 h, ideal >=6-8 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz se ahíla, florece poco y produce pocos frutos; el picor y la coloración también se resienten.
  - 📚 [Cómo cultivar ají/chile en casa (Alta Huerta)](https://altahuerta.com/aji-chile/) — Alta Huerta; [PIMIENTO - Ficha de cultivo (UNLu)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Pimiento.pdf) — Cátedra de Horticultura - UNLu
- **Cosecha** (🟡 5/10): Ciclo aproximado de 3 a 4 meses hasta los primeros frutos (fuentes de picantes en Argentina); comparable al pimiento (80-120 días desde trasplante según variedad).
  - ✅ *Listo para cosechar:* Frutos con tamaño y color propios de la variedad (verde para consumo temprano; rojo/amarillo/naranja al madurar). El picor aumenta con la maduración completa en la planta.
  - 📚 [¿Cuándo germinar chiles picantes en Argentina?](https://www.locosxelpicante.com/cuando-germinar/) — Locos x el Picante
- **Germinación** (🟡 5/10): Germinación lenta e irregular; como C. annuum ~8-12 días a 20-30 °C. Requiere temperatura templada-cálida (promedios ~16 °C en adelante) para germinar bien; por debajo de 13 °C puede no germinar.
  - 📚 [PIMIENTO - Ficha de cultivo (UNLu)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Pimiento.pdf) — Cátedra de Horticultura - UNLu; [¿Cuándo germinar chiles picantes en Argentina?](https://www.locosxelpicante.com/cuando-germinar/) — Locos x el Picante
- **Trasplante** (🟡 6/10): Se trasplanta cuando los plantines alcanzan unos 10 cm y 4-6 hojas verdaderas, a maceta grande o suelo, dejando 40-50 cm entre plantas.
  - 🌱 *Listo para trasplantar:* Plantín de ~10 cm con 4-6 hojas verdaderas, robusto y con clima sin riesgo de heladas.
  - 📚 [Cómo cultivar ají/chile en casa (Alta Huerta)](https://altahuerta.com/aji-chile/) — Alta Huerta
- **Longevidad** (🟡 5/10): Botánicamente perenne; en clima templado puede sobrevivir inviernos suaves o resguardado y rebrotar la temporada siguiente (fuentes de picantes en Argentina), pero se cultiva habitualmente como anual porque las heladas fuertes lo matan. Produce en abundancia durante primavera-verano-otoño.
  - 📚 [¿Cuándo germinar chiles picantes en Argentina?](https://www.locosxelpicante.com/cuando-germinar/) — Locos x el Picante
- **Trucos** (🟡 5/10): Adelantar el almácigo con calor a fin de invierno para llegar a primavera con plantas medianas y anticipar la cosecha; riego regular sin encharcar, especialmente en floración; asociar con caléndula y albahaca para repeler plagas; evitar tocar las semillas (parte más picante) al manipular.
  - 📚 [Cómo cultivar ají/chile en casa (Alta Huerta)](https://altahuerta.com/aji-chile/) — Alta Huerta; [¿Cuándo germinar chiles picantes en Argentina?](https://www.locosxelpicante.com/cuando-germinar/) — Locos x el Picante
- **Riesgos / a evitar** (🟡 5/10): Sensible a heladas y a suelos encharcados; germinación lenta que exige paciencia y calor. Como Capsicum es muy susceptible a virosis. No repetir solanáceas en el mismo cantero.
  - 📚 [Cómo cultivar ají/chile en casa (Alta Huerta)](https://altahuerta.com/aji-chile/) — Alta Huerta; [PIMIENTO - Ficha de cultivo (UNLu)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Pimiento.pdf) — Cátedra de Horticultura - UNLu
- **Plagas y enfermedades** (🟡 6/10): Pulgones, arañuelas (ácaros) y trips; también mosca blanca. Control casero con jabón potásico o infusiones de ajo y ají. Susceptible a hongos (Pythium, Phytophthora, Botrytis) y a virus como todo Capsicum.
  - 📚 [Cómo cultivar ají/chile en casa (Alta Huerta)](https://altahuerta.com/aji-chile/) — Alta Huerta; [PIMIENTO - Ficha de cultivo (UNLu)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Pimiento.pdf) — Cátedra de Horticultura - UNLu
- **Se asocia bien con** (🟡 5/10): Albahaca y caléndula (repelen plagas), zanahoria, tomate, cebolla y berenjena (asimilado del pimiento).
  - 📚 [Cómo cultivar ají/chile en casa (Alta Huerta)](https://altahuerta.com/aji-chile/) — Alta Huerta; [Ejemplos de asociaciones de cultivos](https://www.ecoagricultor.com/ejemplos-de-asociaciones-de-cultivos-a-la-hora-de-planificar-el-diseno-del-huerto/) — Ecoagricultor
- **Evitar cerca de** (🔴 4/10): Remolacha, arveja, poroto/judías y colirábano; evitar junto a brasicáceas (col, brócoli) y no repetir con otras solanáceas (asimilado del pimiento).
  - 📚 [Ejemplos de asociaciones de cultivos](https://www.ecoagricultor.com/ejemplos-de-asociaciones-de-cultivos-a-la-hora-de-planificar-el-diseno-del-huerto/) — Ecoagricultor

<a id="berenjena"></a>
## Berenjena  ·  *Solanum melongena*

- **Fecha/s de siembra** (🟢 8/10): En almácigo protegido a fines de invierno: julio-agosto (Manual UNLu 'mediados de julio-agosto'; El Brote Urbano 'julio-agosto'); el Calendario INTA/ProHuerta indica almácigo agosto-setiembre. Trasplante en primavera: octubre (UNLu), octubre-noviembre (Calendario INTA), setiembre-octubre (El Brote Urbano), una vez pasado el riesgo de heladas en el GBA.
  - 📚 [Calendario de siembra - INTA/ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta; [Manual para la realización de una huerta-jardín (2021)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Manual%20Huerta-jard%C3%ADn%202021.pdf) — Universidad Nacional de Luján - Cátedra de Horticultura; [¿Cómo cultivar Berenjena?](https://www.elbroteurbano.com/como-cultivar-berenjena/) — El Brote Urbano
- **Forma/s de siembra** (🟢 9/10): Almácigo protegido y posterior trasplante (NO siembra directa): su crecimiento inicial es lento y necesita calor, por eso se adelanta en almácigo protegido a fines de invierno y se trasplanta en primavera. El Calendario INTA la ficha como almácigo + trasplante.
  - 📚 [Manual para la realización de una huerta-jardín (2021)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Manual%20Huerta-jard%C3%ADn%202021.pdf) — Universidad Nacional de Luján - Cátedra de Horticultura; [Calendario de siembra - INTA/ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta; [¿Cómo cultivar Berenjena?](https://www.elbroteurbano.com/como-cultivar-berenjena/) — El Brote Urbano
- **Suelo** (🟡 7/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Suelos sueltos, laboreados en profundidad, bien drenados y con buena presencia de materia orgánica.
  - ⚠️ *Si no se cumple:* En suelos compactados, pobres o mal drenados el desarrollo radicular se limita, la planta crece débil y la fructificación es escasa; los encharcamientos favorecen enfermedades de raíz.
  - 📚 [¿Cómo cultivar Berenjena?](https://www.elbroteurbano.com/como-cultivar-berenjena/) — El Brote Urbano; [Manual para la realización de una huerta-jardín (2021)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Manual%20Huerta-jard%C3%ADn%202021.pdf) — Universidad Nacional de Luján - Cátedra de Horticultura
- **Luz** (🟡 7/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Cultivo de verano exigente en luz y calor (temperatura óptima ~25 °C); requiere pleno sol. _(luz directa: mín 6 h, ideal 8 h o más h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz la planta se ahíla (tallos largos y débiles), florece poco y no cuaja frutos.
  - 📚 [Manual para la realización de una huerta-jardín (2021)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Manual%20Huerta-jard%C3%ADn%202021.pdf) — Universidad Nacional de Luján - Cátedra de Horticultura; [¿Cómo cultivar Berenjena?](https://www.elbroteurbano.com/como-cultivar-berenjena/) — El Brote Urbano
- **Cosecha** (🟢 8/10): Aprox. 70-100 días desde el trasplante (UNLu: 90-100 días; El Brote Urbano: 70-90 días) o 90-120 días desde siembra según el Calendario INTA. Se cosecha escalonadamente hasta los primeros fríos.
  - ✅ *Listo para cosechar:* Frutos lisos y brillantes, de color violáceo intenso, con tamaño comercial; se recolectan antes de la madurez fisiológica plena (cuando aún están tiernos).
  - 📚 [Manual para la realización de una huerta-jardín (2021)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Manual%20Huerta-jard%C3%ADn%202021.pdf) — Universidad Nacional de Luján - Cátedra de Horticultura; [Calendario de siembra - INTA/ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta; [¿Cómo cultivar Berenjena?](https://www.elbroteurbano.com/como-cultivar-berenjena/) — El Brote Urbano
- **Germinación** (🔴 3/10): Germinación lenta, favorecida por calor (~20-25 °C); aproximadamente 8-14 días. Dato general de horticultura, sin fuente argentina específica consultada que precise los días.
  - 📚 _(sin fuente registrada)_
- **Trasplante** (🟢 8/10): Se trasplanta a los ~50-60 días desde la siembra en almácigo, cuando el plantín tiene 4-6 hojas verdaderas.
  - 🌱 *Listo para trasplantar:* Plantín robusto de 4-6 hojas verdaderas, 10-15 cm de altura, y sin riesgo de heladas en el lugar definitivo.
  - 📚 [Manual para la realización de una huerta-jardín (2021)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Manual%20Huerta-jard%C3%ADn%202021.pdf) — Universidad Nacional de Luján - Cátedra de Horticultura; [¿Cómo cultivar Berenjena?](https://www.elbroteurbano.com/como-cultivar-berenjena/) — El Brote Urbano
- **Longevidad** (🟡 6/10): En el clima templado del GBA se cultiva como anual (planta perenne de origen tropical que muere con las heladas). Produce en cosechas escalonadas desde el verano hasta los primeros fríos.
  - 📚 [¿Cómo cultivar Berenjena?](https://www.elbroteurbano.com/como-cultivar-berenjena/) — El Brote Urbano
- **Trucos** (🟡 7/10): Riegos frecuentes y regulares (riego localizado, evitar estrés hídrico, 600-900 mm en el ciclo); tutorado; despunte de ramas; carpidas para controlar malezas; asegurar calor (óptimo ~25 °C).
  - 📚 [Manual para la realización de una huerta-jardín (2021)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Manual%20Huerta-jard%C3%ADn%202021.pdf) — Universidad Nacional de Luján - Cátedra de Horticultura; [¿Cómo cultivar Berenjena?](https://www.elbroteurbano.com/como-cultivar-berenjena/) — El Brote Urbano
- **Riesgos / a evitar** (🟡 6/10): Muy sensible al frío y a las heladas: no trasplantar hasta pasado el riesgo de heladas. El estrés hídrico afecta el cuaje. Necesita mucho calor y espacio.
  - 📚 [¿Cómo cultivar Berenjena?](https://www.elbroteurbano.com/como-cultivar-berenjena/) — El Brote Urbano; [Manual para la realización de una huerta-jardín (2021)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Manual%20Huerta-jard%C3%ADn%202021.pdf) — Universidad Nacional de Luján - Cátedra de Horticultura
- **Plagas y enfermedades** (🟡 6/10): Plagas: pulguilla y pulgones. Enfermedades: tizón/mildew y oídio.
  - 📚 [¿Cómo cultivar Berenjena?](https://www.elbroteurbano.com/como-cultivar-berenjena/) — El Brote Urbano
- **Se asocia bien con** (🟡 5/10): Poroto/judía (medioambienteenaccion y agrohuerto), lechuga, cebolla, ajo, puerro, col, espinaca, escarola, apio, rábano, zanahoria, papa, borraja (agrohuerto). Fuentes de divulgación (una española), sin confirmación de fuente oficial argentina.
  - 📚 [Asociación de Cultivos en el Huerto: compatibilidad entre plantas](https://www.agrohuerto.com/asociacion-de-cultivos-compatibilidad-entre-plantas/) — Agrohuerto (España); [Cómo hacer asociaciones de cultivos en la huerta orgánica](https://medioambienteenaccion.com.ar/contenido/3938/como-hacer-asociaciones-de-cultivos-en-la-huerta-organica) — Medio Ambiente en Acción
- **Evitar cerca de** (🔴 4/10): Pepino y calabacín/zapallito (agrohuerto). Conviene además no plantarla junto a otras solanáceas (tomate, papa) por compartir plagas y enfermedades.
  - 📚 [Asociación de Cultivos en el Huerto: compatibilidad entre plantas](https://www.agrohuerto.com/asociacion-de-cultivos-compatibilidad-entre-plantas/) — Agrohuerto (España)

<a id="zapallito-de-tronco"></a>
## Zapallito de tronco  ·  *Cucurbita maxima var. zapallito*

- **Fecha/s de siembra** (🟢 8/10): Siembra directa a golpe en primavera-verano: setiembre a diciembre (Manual UNLu); octubre a enero (Calendario INTA/ProHuerta); primavera (El Brote Urbano). En el GBA arrancar cuando ya no hay riesgo de heladas y el suelo supera los 15 °C.
  - 📚 [Manual para la realización de una huerta-jardín (2021)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Manual%20Huerta-jard%C3%ADn%202021.pdf) — Universidad Nacional de Luján - Cátedra de Horticultura; [Calendario de siembra - INTA/ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta; [¿Cómo cultivar Zapallito Redondo y Zuccini?](https://www.elbroteurbano.com/como-cultivar-zapallito-redondo-zuccini/) — El Brote Urbano
- **Forma/s de siembra** (🟢 8/10): Siembra directa a golpe, 2-3 semillas por golpe a ~2 cm de profundidad, en surcos separados ~1 m (UNLu y Calendario INTA). Puede hacerse almácigo en vasitos para trasplantar temprano y mejorar el éxito, pero lo habitual y recomendado es la siembra directa.
  - 📚 [Manual para la realización de una huerta-jardín (2021)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Manual%20Huerta-jard%C3%ADn%202021.pdf) — Universidad Nacional de Luján - Cátedra de Horticultura; [Calendario de siembra - INTA/ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta; [¿Cómo cultivar Zapallito Redondo y Zuccini?](https://www.elbroteurbano.com/como-cultivar-zapallito-redondo-zuccini/) — El Brote Urbano
- **Suelo** (🟡 6/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Tierra suelta y bien drenada, que responde muy bien al agregado de materia orgánica.
  - ⚠️ *Si no se cumple:* En suelos compactados o encharcados se pudre el cuello y las raíces; en suelos pobres crece poco y produce frutos escasos.
  - 📚 [¿Cómo cultivar Zapallito Redondo y Zuccini?](https://www.elbroteurbano.com/como-cultivar-zapallito-redondo-zuccini/) — El Brote Urbano
- **Luz** (🟡 6/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Requiere sol directo para un desarrollo óptimo; temperatura de crecimiento óptima 18-24 °C. _(luz directa: mín 6 h, ideal 8 h o más h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con sombra se ahíla, florece y fructifica menos.
  - 📚 [¿Cómo cultivar Zapallito Redondo y Zuccini?](https://www.elbroteurbano.com/como-cultivar-zapallito-redondo-zuccini/) — El Brote Urbano
- **Cosecha** (🟢 9/10): 50-60 días desde la siembra (Manual UNLu y El Brote Urbano); 45-60 días según el Calendario INTA. Cosecha muy escalonada (idealmente a diario).
  - ✅ *Listo para cosechar:* Frutos tiernos de 5-10 cm de diámetro, con piel verde clara; se cosechan jóvenes antes de que endurezcan.
  - 📚 [Manual para la realización de una huerta-jardín (2021)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Manual%20Huerta-jard%C3%ADn%202021.pdf) — Universidad Nacional de Luján - Cátedra de Horticultura; [Calendario de siembra - INTA/ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta; [¿Cómo cultivar Zapallito Redondo y Zuccini?](https://www.elbroteurbano.com/como-cultivar-zapallito-redondo-zuccini/) — El Brote Urbano
- **Germinación** (🟡 5/10): Necesita mínimo ~15 °C en el suelo para germinar; temperatura óptima 18-24 °C. Con calor la emergencia es rápida (aprox. 5-8 días; los días son un dato general, no precisado por la fuente).
  - 📚 [¿Cómo cultivar Zapallito Redondo y Zuccini?](https://www.elbroteurbano.com/como-cultivar-zapallito-redondo-zuccini/) — El Brote Urbano
- **Trasplante** (🟡 6/10): Normalmente NO requiere trasplante (se hace por siembra directa). Si se opta por almácigo, trasplantar muy pequeño porque las cucurbitáceas toleran mal el trasplante.
  - 🌱 *Listo para trasplantar:* Si se hizo almácigo, trasplantar con 1-2 hojas verdaderas, con el cepellón entero para no dañar raíces.
  - 📚 [¿Cómo cultivar Zapallito Redondo y Zuccini?](https://www.elbroteurbano.com/como-cultivar-zapallito-redondo-zuccini/) — El Brote Urbano
- **Longevidad** (🟡 7/10): Anual; la cosecha se prolonga aproximadamente 3 meses desde su inicio.
  - 📚 [¿Cómo cultivar Zapallito Redondo y Zuccini?](https://www.elbroteurbano.com/como-cultivar-zapallito-redondo-zuccini/) — El Brote Urbano
- **Trucos** (🟡 7/10): Aporcar la planta cuando tiene 15-20 cm de altura para afirmarla; evitar mojar el cuello al regar para prevenir hongos; cosechar frecuentemente (a diario) para estimular la producción continua; carpidas y aporque.
  - 📚 [¿Cómo cultivar Zapallito Redondo y Zuccini?](https://www.elbroteurbano.com/como-cultivar-zapallito-redondo-zuccini/) — El Brote Urbano; [Manual para la realización de una huerta-jardín (2021)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Manual%20Huerta-jard%C3%ADn%202021.pdf) — Universidad Nacional de Luján - Cátedra de Horticultura
- **Riesgos / a evitar** (🟡 6/10): Sensible al frío. El exceso de humedad en el cuello provoca hongos y podredumbre. Frutos pequeños que amarillean y caen indican mala polinización.
  - 📚 [¿Cómo cultivar Zapallito Redondo y Zuccini?](https://www.elbroteurbano.com/como-cultivar-zapallito-redondo-zuccini/) — El Brote Urbano
- **Plagas y enfermedades** (🟡 5/10): Vaquita del zapallo (Epilachna paenulata, plaga citada por SINAVIMO para cucurbitáceas), pulgones; enfermedades fúngicas como oídio y mildiu.
  - 📚 [Epilachna paenulata (vaquita del zapallo)](https://www.sinavimo.gob.ar/plaga/epilachna-paenulata) — SINAVIMO - SENASA Argentina
- **Se asocia bien con** (🟡 5/10): Albahaca, cebolla y papa (El Brote Urbano); menta, rábano y poroto/judía (medioambienteenaccion); albahaca, cebolla, guisante, judía, lechuga, papa y maíz (agrohuerto, para calabacín). Nota: el rábano aparece como favorable en unas fuentes y desfavorable en otras.
  - 📚 [¿Cómo cultivar Zapallito Redondo y Zuccini?](https://www.elbroteurbano.com/como-cultivar-zapallito-redondo-zuccini/) — El Brote Urbano; [Cómo hacer asociaciones de cultivos en la huerta orgánica](https://medioambienteenaccion.com.ar/contenido/3938/como-hacer-asociaciones-de-cultivos-en-la-huerta-organica) — Medio Ambiente en Acción; [Asociación de Cultivos en el Huerto: compatibilidad entre plantas](https://www.agrohuerto.com/asociacion-de-cultivos-compatibilidad-entre-plantas/) — Agrohuerto (España)
- **Evitar cerca de** (🔴 4/10): Berenjena y rabanito (El Brote Urbano); papa (medioambienteenaccion); rábano (agrohuerto, para calabacín). Discrepancia sobre el rábano entre fuentes.
  - 📚 [¿Cómo cultivar Zapallito Redondo y Zuccini?](https://www.elbroteurbano.com/como-cultivar-zapallito-redondo-zuccini/) — El Brote Urbano; [Cómo hacer asociaciones de cultivos en la huerta orgánica](https://medioambienteenaccion.com.ar/contenido/3938/como-hacer-asociaciones-de-cultivos-en-la-huerta-organica) — Medio Ambiente en Acción; [Asociación de Cultivos en el Huerto: compatibilidad entre plantas](https://www.agrohuerto.com/asociacion-de-cultivos-compatibilidad-entre-plantas/) — Agrohuerto (España)

<a id="zapallo-calabaza"></a>
## Zapallo / Calabaza  ·  *Cucurbita maxima / Cucurbita moschata*

- **Fecha/s de siembra** (🟢 8/10): Siembra directa a golpe en primavera: octubre-noviembre (Manual UNLu y Calendario INTA/ProHuerta); setiembre a noviembre (El Brote Urbano). Es un cultivo de ciclo largo que necesita 4-5 meses libres de heladas.
  - 📚 [Manual para la realización de una huerta-jardín (2021)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Manual%20Huerta-jard%C3%ADn%202021.pdf) — Universidad Nacional de Luján - Cátedra de Horticultura; [Calendario de siembra - INTA/ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta; [¿Cómo cultivar Zapallo?](https://www.elbroteurbano.com/como-cultivar-zapallo/) — El Brote Urbano
- **Forma/s de siembra** (🟢 8/10): Siembra directa a golpe, 2-5 semillas por golpe a 2-3 cm de profundidad (Manual UNLu: distancia 200x200 cm; El Brote Urbano: 3-5 semillas por golpe). Tolera mal el trasplante, por eso se siembra de asiento.
  - 📚 [Manual para la realización de una huerta-jardín (2021)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Manual%20Huerta-jard%C3%ADn%202021.pdf) — Universidad Nacional de Luján - Cátedra de Horticultura; [¿Cómo cultivar Zapallo?](https://www.elbroteurbano.com/como-cultivar-zapallo/) — El Brote Urbano
- **Suelo** (🟡 6/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Suelos sueltos, profundos y bien drenados; responde bien al agregado de materia orgánica.
  - ⚠️ *Si no se cumple:* En suelos compactados o mal drenados crece poco y sufre pudriciones; en suelos pobres los frutos son chicos y escasos.
  - 📚 [¿Cómo cultivar Zapallo?](https://www.elbroteurbano.com/como-cultivar-zapallo/) — El Brote Urbano
- **Luz** (🟡 6/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Clima templado-cálido; requiere pleno sol (óptimo mensual 18-24 °C, máximas ~32 °C). _(luz directa: mín 6 h, ideal 8 h o más h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con falta de sol la planta vegeta pero cuaja pocos frutos y estos maduran mal.
  - 📚 [¿Cómo cultivar Zapallo?](https://www.elbroteurbano.com/como-cultivar-zapallo/) — El Brote Urbano
- **Cosecha** (🟢 9/10): 120-150 días (Manual UNLu y Calendario INTA); 3-5 meses desde la siembra (El Brote Urbano). Es cosecha única al final del ciclo (frutos de guarda).
  - ✅ *Listo para cosechar:* Cáscara endurecida (no se marca con la uña o se marca solo con esfuerzo), color de piel definido y pedúnculo seco; conviene dejar un trozo de pedúnculo unido al fruto para mejorar la conservación.
  - 📚 [Manual para la realización de una huerta-jardín (2021)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Manual%20Huerta-jard%C3%ADn%202021.pdf) — Universidad Nacional de Luján - Cátedra de Horticultura; [Calendario de siembra - INTA/ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta; [¿Cómo cultivar Zapallo?](https://www.elbroteurbano.com/como-cultivar-zapallo/) — El Brote Urbano
- **Germinación** (🟡 5/10): Temperatura óptima 18-24 °C; remojar la semilla la noche previa mejora la germinación. Emergencia rápida con calor (aprox. 5-8 días; los días son un dato general, no precisado por la fuente).
  - 📚 [¿Cómo cultivar Zapallo?](https://www.elbroteurbano.com/como-cultivar-zapallo/) — El Brote Urbano
- **Trasplante** (🟡 7/10): No requiere trasplante: se hace por siembra directa porque tolera mal el trasplante (el arranque de raíces daña la planta).
  - 🌱 *Listo para trasplantar:* No aplica (siembra directa). Si excepcionalmente se hace almácigo, trasplantar muy chico y con cepellón entero.
  - 📚 [¿Cómo cultivar Zapallo?](https://www.elbroteurbano.com/como-cultivar-zapallo/) — El Brote Urbano
- **Longevidad** (🟡 6/10): Anual; una cosecha principal de frutos de guarda al final del ciclo, que bien curados se conservan varios meses.
  - 📚 [¿Cómo cultivar Zapallo?](https://www.elbroteurbano.com/como-cultivar-zapallo/) — El Brote Urbano
- **Trucos** (🟡 7/10): Dar mucho espacio (hasta ~2 m entre plantas); despunte de guías y aporque; remojar la semilla antes de sembrar; curar los frutos al sol tras la cosecha y almacenarlos ventilados sobre tarimas de madera con separación entre capas.
  - 📚 [Manual para la realización de una huerta-jardín (2021)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Manual%20Huerta-jard%C3%ADn%202021.pdf) — Universidad Nacional de Luján - Cátedra de Horticultura; [¿Cómo cultivar Zapallo?](https://www.elbroteurbano.com/como-cultivar-zapallo/) — El Brote Urbano
- **Riesgos / a evitar** (🟡 6/10): Necesita 4-5 meses libres de heladas. La caída de flores sin cuajar indica mala polinización; frutos pequeños que amarillean señalan deficiencia de nutrientes o riego irregular; el hacinamiento (falta de espacio) frena el crecimiento.
  - 📚 [¿Cómo cultivar Zapallo?](https://www.elbroteurbano.com/como-cultivar-zapallo/) — El Brote Urbano
- **Plagas y enfermedades** (🟡 5/10): Vaquita del zapallo (Epilachna paenulata, plaga registrada por SINAVIMO en cucurbitáceas), pulgones; enfermedades fúngicas como oídio y mildiu.
  - 📚 [Epilachna paenulata (vaquita del zapallo)](https://www.sinavimo.gob.ar/plaga/epilachna-paenulata) — SINAVIMO - SENASA Argentina
- **Se asocia bien con** (🟡 6/10): Maíz, poroto/judía y legumbres (sistema milpa: maíz-poroto-zapallo, mencionado por medioambienteenaccion); albahaca, cebolla, col, guisante, lechuga y maíz (agrohuerto).
  - 📚 [Cómo hacer asociaciones de cultivos en la huerta orgánica](https://medioambienteenaccion.com.ar/contenido/3938/como-hacer-asociaciones-de-cultivos-en-la-huerta-organica) — Medio Ambiente en Acción; [Asociación de Cultivos en el Huerto: compatibilidad entre plantas](https://www.agrohuerto.com/asociacion-de-cultivos-compatibilidad-entre-plantas/) — Agrohuerto (España)
- **Evitar cerca de** (🟡 5/10): Rábano y papa (agrohuerto). Se recomienda no asociar cucurbitáceas entre sí (pepino, zapallito) por compartir plagas y enfermedades.
  - 📚 [Asociación de Cultivos en el Huerto: compatibilidad entre plantas](https://www.agrohuerto.com/asociacion-de-cultivos-compatibilidad-entre-plantas/) — Agrohuerto (España)

<a id="pepino"></a>
## Pepino  ·  *Cucumis sativus*

- **Fecha/s de siembra** (🟡 7/10): Siembra directa a golpe en primavera: octubre (Calendario INTA/ProHuerta); setiembre-octubre, con una segunda ventana en febrero (El Brote Urbano). Cultivo de clima cálido, muy sensible al frío: en el GBA sembrar con suelo ya templado y sin riesgo de heladas.
  - 📚 [Calendario de siembra - INTA/ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta; [¿Cómo cultivar Pepino?](https://www.elbroteurbano.com/como-cultivar-pepino/) — El Brote Urbano
- **Forma/s de siembra** (🟡 7/10): Siembra directa de asiento a golpe: 2-3 semillas cada ~70 cm, en líneas separadas ~1 m (El Brote Urbano; Calendario INTA 50x100 cm). Puede hacerse almácigo, pero tolera mal el trasplante, por lo que se prefiere la siembra directa.
  - 📚 [¿Cómo cultivar Pepino?](https://www.elbroteurbano.com/como-cultivar-pepino/) — El Brote Urbano; [Calendario de siembra - INTA/ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta
- **Suelo** (🟡 7/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Suelos sueltos, profundos, bien drenados y ricos en materia orgánica.
  - ⚠️ *Si no se cumple:* En suelos pobres o mal drenados el crecimiento se resiente, hay pudriciones de raíz y la producción baja; el pepino además demanda humedad constante.
  - 📚 [¿Cómo cultivar Pepino?](https://www.elbroteurbano.com/como-cultivar-pepino/) — El Brote Urbano
- **Luz** (🟡 6/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Cultivo de verano que requiere clima cálido y pleno sol (se desarrolla mejor con temperaturas altas; muy sensible al frío). _(luz directa: mín 6 h, ideal 8 h o más h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz o frío detiene el crecimiento, se ahíla y produce pocos frutos.
  - 📚 [¿Cómo cultivar Pepino?](https://www.elbroteurbano.com/como-cultivar-pepino/) — El Brote Urbano
- **Cosecha** (🟢 8/10): 50-70 días desde la siembra (Calendario INTA); 60-70 días (El Brote Urbano). Producción escalonada durante el verano.
  - ✅ *Listo para cosechar:* Frutos verdes, firmes y de tamaño comercial; se cosechan tiernos, antes de que amarilleen o engrosen; conviene cosechar con frecuencia.
  - 📚 [Calendario de siembra - INTA/ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA - ProHuerta; [¿Cómo cultivar Pepino?](https://www.elbroteurbano.com/como-cultivar-pepino/) — El Brote Urbano
- **Germinación** (🔴 3/10): Requiere suelo cálido para germinar; con calor la emergencia es rápida (aprox. 5-10 días). Muy sensible al frío. Los días son un dato general de horticultura, sin fuente argentina específica consultada.
  - 📚 _(sin fuente registrada)_
- **Trasplante** (🟡 5/10): Preferentemente NO se trasplanta: se hace por siembra directa porque tolera mal el trasplante. Si se hace almácigo, trasplantar muy pequeño y con el cepellón entero.
  - 🌱 *Listo para trasplantar:* No aplica en siembra directa; en almácigo, trasplantar con 1-2 hojas verdaderas sin desarmar las raíces.
  - 📚 [¿Cómo cultivar Pepino?](https://www.elbroteurbano.com/como-cultivar-pepino/) — El Brote Urbano
- **Longevidad** (🟡 6/10): Anual; producción escalonada durante el verano hasta que llega el frío (planta muy sensible a las bajas temperaturas).
  - 📚 [¿Cómo cultivar Pepino?](https://www.elbroteurbano.com/como-cultivar-pepino/) — El Brote Urbano
- **Trucos** (🟡 5/10): Conducir en espaldera o tutor para obtener frutos rectos, sanos y de mejor calidad; riego regular y abundante (el estrés hídrico amarga los frutos); asegurar calor.
  - 📚 [¿Cómo cultivar Pepino?](https://www.elbroteurbano.com/como-cultivar-pepino/) — El Brote Urbano
- **Riesgos / a evitar** (🟡 6/10): Muy sensible al frío y a las heladas: no sembrar hasta que el suelo esté cálido. El estrés hídrico (falta de riego) puede amargar los frutos.
  - 📚 [¿Cómo cultivar Pepino?](https://www.elbroteurbano.com/como-cultivar-pepino/) — El Brote Urbano
- **Plagas y enfermedades** (🟡 6/10): Plagas: vaquita de los melones y chinches. Enfermedades: oídio, mildiu y mosaicos virales.
  - 📚 [¿Cómo cultivar Pepino?](https://www.elbroteurbano.com/como-cultivar-pepino/) — El Brote Urbano
- **Se asocia bien con** (🟡 6/10): Albahaca, maíz y lechuga (medioambienteenaccion); ajo, apio, borraja, cebolla, col, espárrago, guisante, poroto/judía, nabo, rábano, remolacha (agrohuerto).
  - 📚 [Cómo hacer asociaciones de cultivos en la huerta orgánica](https://medioambienteenaccion.com.ar/contenido/3938/como-hacer-asociaciones-de-cultivos-en-la-huerta-organica) — Medio Ambiente en Acción; [Asociación de Cultivos en el Huerto: compatibilidad entre plantas](https://www.agrohuerto.com/asociacion-de-cultivos-compatibilidad-entre-plantas/) — Agrohuerto (España)
- **Evitar cerca de** (🟡 6/10): Berenjena, papa y tomate (agrohuerto); melones, papas y tomates (medioambienteenaccion).
  - 📚 [Asociación de Cultivos en el Huerto: compatibilidad entre plantas](https://www.agrohuerto.com/asociacion-de-cultivos-compatibilidad-entre-plantas/) — Agrohuerto (España); [Cómo hacer asociaciones de cultivos en la huerta orgánica](https://medioambienteenaccion.com.ar/contenido/3938/como-hacer-asociaciones-de-cultivos-en-la-huerta-organica) — Medio Ambiente en Acción

<a id="melon"></a>
## Melón  ·  *Cucumis melo*

- **Fecha/s de siembra** (🟢 9/10): GBA: almácigo protegido en vasito en agosto; siembra directa a golpes de septiembre a octubre (ideal octubre). Cultivo de primavera-verano. Requiere temperaturas por encima de 15°C; germinación se afecta por debajo de 10°C.
  - 📚 [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [Calendario de siembra (Seguridad Alimentaria)](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Ministerio de Desarrollo Social; [Frutas frescas para el verano: los secretos para cultivar melón y sandía](https://www.infocampo.com.ar/frutas-frescas-para-el-verano-los-secretos-para-cultivar-melon-y-sandia-en-la-huerta-en-casa/) — Infocampo (con técnicos INTA)
- **Forma/s de siembra** (🟢 8/10): Siembra directa 'a golpes' (2-3 semillas por hoyo) a 2,5-3 cm de profundidad, raleando a la mejor plántula cuando tiene 2 hojas verdaderas; o almácigo protegido en vasito en agosto para adelantar. La directa es la más habitual por ser una cucurbitácea que no tolera bien el trasplante. Marco: 80-90 cm entre plantas y 120-180 cm entre líneas.
  - 📚 [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [Calendario de siembra](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Min. Desarrollo Social; [Los secretos para cultivar melón y sandía](https://www.infocampo.com.ar/frutas-frescas-para-el-verano-los-secretos-para-cultivar-melon-y-sandia-en-la-huerta-en-casa/) — Infocampo (técnicos INTA)
- **Suelo** (🟡 7/10): 🟫 **`ARENOSO_DRENANTE`** (Arenoso / drenante) — Suelo suelto, bien drenado, de textura arenosa-franca a franca, fértil y con buen aporte de materia orgánica.
  - ⚠️ *Si no se cumple:* En suelos pesados o anegadizos, con mal drenaje, las raíces y el cuello se pudren (fusariosis, damping-off) y el fruto pierde calidad; el encharcamiento favorece enfermedades fúngicas.
  - 📚 [Los secretos para cultivar melón y sandía](https://www.infocampo.com.ar/frutas-frescas-para-el-verano-los-secretos-para-cultivar-melon-y-sandia-en-la-huerta-en-casa/) — Infocampo (técnicos INTA)
- **Luz** (🟡 7/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Pleno sol. Cultivo exigente en calor y luz para acumular azúcares en el fruto. _(luz directa: mín 6 h, ideal >=8 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz se ahíla, cuaja pocos frutos y estos resultan chicos y poco dulces; la maduración se atrasa.
  - 📚 [Los secretos para cultivar melón y sandía](https://www.infocampo.com.ar/frutas-frescas-para-el-verano-los-secretos-para-cultivar-melon-y-sandia-en-la-huerta-en-casa/) — Infocampo (técnicos INTA)
- **Cosecha** (🟢 8/10): Aproximadamente 100 días desde la siembra (fines de verano: enero-marzo).
  - ✅ *Listo para cosechar:* Cambio de color de fondo de verde a amarillento/crema, aroma intenso en el pedúnculo, y en melones tipo reticulado el pedúnculo se desprende con facilidad (zona de abscisión). Dejar 5 cm de pedúnculo al cortar para evitar entrada de patógenos.
  - 📚 [Calendario de siembra](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Min. Desarrollo Social; [Los secretos para cultivar melón y sandía](https://www.infocampo.com.ar/frutas-frescas-para-el-verano-los-secretos-para-cultivar-melon-y-sandia-en-la-huerta-en-casa/) — Infocampo (técnicos INTA)
- **Germinación** (🟡 5/10): Aproximadamente 5 a 10 días con suelo cálido (>15-18°C); se retrasa o falla por debajo de 10°C.
  - 📚 [Los secretos para cultivar melón y sandía](https://www.infocampo.com.ar/frutas-frescas-para-el-verano-los-secretos-para-cultivar-melon-y-sandia-en-la-huerta-en-casa/) — Infocampo (técnicos INTA)
- **Trasplante** (🟡 6/10): Preferentemente NO se trasplanta; se hace siembra directa porque las cucurbitáceas resienten el trasplante. Si se usa almácigo protegido (agosto), llevar a lugar definitivo con cepellón intacto.
  - 🌱 *Listo para trasplantar:* Plantín con 2-3 hojas verdaderas y raíces que toman el cepellón, cuando ya pasó todo riesgo de heladas (después de mediados de octubre en GBA).
  - 📚 [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Longevidad** (🟢 8/10): Anual. Una temporada de producción (primavera-verano); la planta muere con el frío del otoño.
  - 📚 [Calendario de siembra](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Min. Desarrollo Social
- **Trucos** (🟡 7/10): Regar casi a diario al inicio y espaciar a cada 3 días durante la floración-fructificación para concentrar azúcares; conducir o despuntar guías para controlar el espacio; colocar los frutos sobre cama seca (paja o tabla) para evitar pudrición por contacto con suelo húmedo; sembrar con suelo y sustrato limpios/desinfectados.
  - 📚 [Los secretos para cultivar melón y sandía](https://www.infocampo.com.ar/frutas-frescas-para-el-verano-los-secretos-para-cultivar-melon-y-sandia-en-la-huerta-en-casa/) — Infocampo (técnicos INTA)
- **Riesgos / a evitar** (🟡 7/10): Sensible a heladas (no sembrar antes de que pase el riesgo). El exceso de riego o el mal drenaje pudren raíces y frutos y bajan el dulzor. Ocupa mucha superficie por su hábito rastrero. Necesita calor sostenido para madurar.
  - 📚 [Los secretos para cultivar melón y sandía](https://www.infocampo.com.ar/frutas-frescas-para-el-verano-los-secretos-para-cultivar-melon-y-sandia-en-la-huerta-en-casa/) — Infocampo (técnicos INTA)
- **Plagas y enfermedades** (🟡 6/10): Plagas: pulgones (Aphis gossypii, Myzus persicae, vectores de virus), mosca blanca (Bemisia tabaci, Trialeurodes vaporariorum), trips, arañuela roja (Tetranychus urticae), orugas defoliadoras (Spodoptera, Diaphania). Enfermedades: oídio (Podosphaera/Erysiphe), mildiu (Pseudoperonospora cubensis), fusariosis (Fusarium oxysporum), antracnosis (Colletotrichum), y virosis (CMV, WMV, ZYMV).
  - 📚 [Guía sobre plagas y enfermedades en el cultivo de sandía y melón](https://www.portalfruticola.com/noticias/2026/01/29/sandia-y-melon/) — Portal Frutícola
- **Se asocia bien con** (🟡 6/10): Se integra bien en la 'chacra de verano' y cercos; asociaciones tradicionales con maíz y otras hortalizas de fruto de verano.
  - 📚 [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Evitar cerca de** (🟡 5/10): Evitar seguir a/estar junto a la chacra de invierno y legumbres (según el esquema de rotación de INTA). Evitar plantar tras otras cucurbitáceas por enfermedades comunes.
  - 📚 [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA

<a id="sandia"></a>
## Sandía  ·  *Citrullus lanatus*

- **Fecha/s de siembra** (🟢 8/10): GBA/pampa húmeda: siembra directa junto con el melón en septiembre-octubre (puede adelantarse con almácigo protegido en agosto). Cultivo de primavera-verano; requiere temperaturas medias superiores a 21°C (óptimo cerca de 35°C) y días largos y luminosos.
  - 📚 [Los secretos para cultivar melón y sandía](https://www.infocampo.com.ar/frutas-frescas-para-el-verano-los-secretos-para-cultivar-melon-y-sandia-en-la-huerta-en-casa/) — Infocampo (técnicos INTA); [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Forma/s de siembra** (🟡 7/10): Siembra directa a golpes a 2,5-3 cm de profundidad, raleando a la mejor plántula al tener 2 hojas verdaderas; distancia grande entre plantas (hasta ~2 m entre golpes según variedad; el Planificador indica 80-90 cm entre plantas y 120-180 cm entre líneas para el grupo melón/sandía). No conviene almácigo/trasplante salvo en vasito protegido con cepellón.
  - 📚 [Los secretos para cultivar melón y sandía](https://www.infocampo.com.ar/frutas-frescas-para-el-verano-los-secretos-para-cultivar-melon-y-sandia-en-la-huerta-en-casa/) — Infocampo (técnicos INTA); [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Suelo** (🟡 7/10): 🟫 **`ARENOSO_DRENANTE`** (Arenoso / drenante) — Suelo suelto y bien drenado; prospera especialmente en suelos arenoso-francos a francos, fértiles.
  - ⚠️ *Si no se cumple:* En suelos pesados y con drenaje deficiente hay pudrición de raíces y fruto, mayor incidencia de fusariosis y menor dulzor; el anegamiento es muy perjudicial.
  - 📚 [Los secretos para cultivar melón y sandía](https://www.infocampo.com.ar/frutas-frescas-para-el-verano-los-secretos-para-cultivar-melon-y-sandia-en-la-huerta-en-casa/) — Infocampo (técnicos INTA)
- **Luz** (🟡 7/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Pleno sol; requiere muchas horas de luz directa (se menciona 10 o más horas de luz diaria) y alta temperatura. _(luz directa: mín 6 h, ideal >=8-10 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Sin sol y calor suficientes no cuaja o los frutos quedan chicos, pálidos y poco azucarados; la maduración no se completa.
  - 📚 [Los secretos para cultivar melón y sandía](https://www.infocampo.com.ar/frutas-frescas-para-el-verano-los-secretos-para-cultivar-melon-y-sandia-en-la-huerta-en-casa/) — Infocampo (técnicos INTA)
- **Cosecha** (🟡 7/10): Aproximadamente 90-100 días desde la siembra (verano).
  - ✅ *Listo para cosechar:* Al golpear el fruto suena hueco/sordo; el zarcillo más cercano al fruto se seca; la mancha de contacto con el suelo vira de blanco a amarillo cremoso. Cortar dejando 5 cm de pedúnculo.
  - 📚 [Los secretos para cultivar melón y sandía](https://www.infocampo.com.ar/frutas-frescas-para-el-verano-los-secretos-para-cultivar-melon-y-sandia-en-la-huerta-en-casa/) — Infocampo (técnicos INTA)
- **Germinación** (🟡 5/10): Aproximadamente 5 a 10 días con suelo cálido (>18-21°C); no germina bien en frío.
  - 📚 [Los secretos para cultivar melón y sandía](https://www.infocampo.com.ar/frutas-frescas-para-el-verano-los-secretos-para-cultivar-melon-y-sandia-en-la-huerta-en-casa/) — Infocampo (técnicos INTA)
- **Trasplante** (🟡 5/10): No requiere trasplante; se recomienda siembra directa por su mala tolerancia al trasplante. Si se hace almácigo protegido en agosto, trasplantar con cepellón intacto tras las heladas.
  - 🌱 *Listo para trasplantar:* Plantín con 2-3 hojas verdaderas, cepellón bien tomado y sin riesgo de heladas (mediados de octubre en GBA).
  - 📚 [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Longevidad** (🟡 7/10): Anual. Una única temporada productiva de primavera-verano.
  - 📚 [Los secretos para cultivar melón y sandía](https://www.infocampo.com.ar/frutas-frescas-para-el-verano-los-secretos-para-cultivar-melon-y-sandia-en-la-huerta-en-casa/) — Infocampo (técnicos INTA)
- **Trucos** (🟡 7/10): Riego casi diario al principio y luego cada ~3 días dejando secar la superficie durante floración/fructificación; conducir guías para ordenar el espacio; colocar los frutos sobre paja o tabla para evitar pudrición; usar semilla y sustrato limpios/desinfectados; asegurar polinización (flores masculinas y femeninas).
  - 📚 [Los secretos para cultivar melón y sandía](https://www.infocampo.com.ar/frutas-frescas-para-el-verano-los-secretos-para-cultivar-melon-y-sandia-en-la-huerta-en-casa/) — Infocampo (técnicos INTA)
- **Riesgos / a evitar** (🟡 7/10): Muy sensible al frío y a las heladas. Ocupa mucha superficie (hábito rastrero). Exceso de riego/mal drenaje: pudrición y frutos insípidos. Necesita ciclo largo de calor: si se siembra tarde puede no llegar a madurar antes del otoño.
  - 📚 [Los secretos para cultivar melón y sandía](https://www.infocampo.com.ar/frutas-frescas-para-el-verano-los-secretos-para-cultivar-melon-y-sandia-en-la-huerta-en-casa/) — Infocampo (técnicos INTA)
- **Plagas y enfermedades** (🟡 6/10): Plagas: pulgones (Aphis gossypii), mosca blanca (Bemisia tabaci), trips, arañuela roja (Tetranychus urticae), orugas (Spodoptera, Diaphania, Helicoverpa). Enfermedades: fusariosis (Fusarium oxysporum), oídio, mildiu (Pseudoperonospora cubensis), antracnosis (Colletotrichum), mancha bacteriana (Acidovorax citrulli) y virosis (CMV, WMV, ZYMV).
  - 📚 [Guía sobre plagas y enfermedades en el cultivo de sandía y melón](https://www.portalfruticola.com/noticias/2026/01/29/sandia-y-melon/) — Portal Frutícola
- **Se asocia bien con** (🟡 5/10): Se ubica en la 'chacra de verano' y cercos junto a otras hortalizas de fruto de verano (asociación tradicional con maíz).
  - 📚 [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Evitar cerca de** (🟡 5/10): Evitar la sucesión con chacra de invierno y legumbres (esquema de rotación INTA) y no repetir sobre cucurbitáceas por enfermedades del suelo compartidas.
  - 📚 [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA

<a id="choclo-maiz-dulce"></a>
## Choclo / Maíz dulce  ·  *Zea mays*

- **Fecha/s de siembra** (🟢 9/10): GBA: almácigo en vasitos protegidos en agosto y siembra directa a golpe de septiembre a enero (INTA Planificador). El Calendario de siembra indica siembra directa a golpe de octubre a diciembre. Cultivo de primavera-verano; se pueden escalonar siembras.
  - 📚 [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [Calendario de siembra](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Min. Desarrollo Social
- **Forma/s de siembra** (🟢 8/10): Principalmente siembra directa a golpe (2-3 semillas por hoyo), en línea; conviene sembrar en bloque de varias filas cortas y no en una sola fila larga para favorecer la polinización por viento. También admite almácigo protegido en agosto para adelantar. Marco: 20-35 cm entre plantas y 70-80 cm entre líneas (Calendario: 20x25x70; Planificador: 30-35 x 70-80).
  - 📚 [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [Calendario de siembra](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Min. Desarrollo Social
- **Suelo** (🟡 6/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Suelo franco, profundo, fértil y con buena provisión de materia orgánica; cultivo exigente en nitrógeno.
  - ⚠️ *Si no se cumple:* En suelos pobres o con poco nitrógeno las plantas quedan raquíticas, las espigas salen chicas y mal granadas; con mal drenaje se afecta el crecimiento radicular.
  - 📚 [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Luz** (🟡 6/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Pleno sol; planta de metabolismo C4 muy demandante de luz. _(luz directa: mín 6 h, ideal >=8 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con sombra o poca luz se ahíla, produce cañas débiles que se vuelcan y espigas pobres o incompletas.
  - 📚 [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Cosecha** (🟢 8/10): Aproximadamente 100 a 130 días desde la siembra (verano-otoño).
  - ✅ *Listo para cosechar:* Para consumo como choclo (grano lechoso): barbas/estigmas secos y marrones, granos llenos y turgentes que al pincharlos largan un líquido lechoso; la espiga se siente firme y compacta al tacto.
  - 📚 [Calendario de siembra](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Min. Desarrollo Social
- **Germinación** (🔴 4/10): Aproximadamente 7 a 12 días según temperatura del suelo (más rápido con calor).
  - 📚 [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Trasplante** (🟡 5/10): Generalmente NO se trasplanta; se prefiere siembra directa. Si se usó almácigo protegido en agosto, trasplantar temprano con cepellón cuando el plantín es pequeño para no dañar la raíz.
  - 🌱 *Listo para trasplantar:* Plantín pequeño (10-15 cm, 2-3 hojas) y sin riesgo de heladas; cuanto más chico se trasplanta, mejor prende.
  - 📚 [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Longevidad** (🟡 7/10): Anual. Una temporada; cada planta produce típicamente 1-2 espigas y luego se seca.
  - 📚 [Calendario de siembra](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Min. Desarrollo Social
- **Trucos** (🟡 6/10): Sembrar en bloque cuadrado de varias filas (no en fila única) para asegurar polinización por viento y espigas bien granadas; escalonar siembras cada 2-3 semanas para cosecha prolongada; aporcar la base para dar sostén; abonar bien por su alta demanda de nitrógeno; asociar con poroto (que aporta nitrógeno) y zapallo (cobertura del suelo), esquema tipo 'milpa'.
  - 📚 [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Riesgos / a evitar** (🟡 6/10): Sensible a heladas. Susceptible al vuelco por viento si no está bien implantado o en fila única. Alta demanda de agua y nitrógeno. Es de polinización cruzada: si se busca variedad pura, aislar de otros maíces.
  - 📚 [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Plagas y enfermedades** (🟡 6/10): Plaga principal: gusano cogollero (Spodoptera frugiperda), que ataca el cogollo; también isoca de la espiga (Helicoverpa zea), pulgones y gusanos de raíz. Enfermedades: royas y tizones foliares, carbón del maíz (Ustilago maydis).
  - 📚 [Manejo de gusano cogollero en cultivos de maíz](https://www.pioneer.com/cmroot/international/argentina_intl/agronomia/manejo_de_gusano_cogollero_en_maiz.pdf) — Pioneer Argentina; [Manejo integrado de plagas asociadas al cultivo de maíz](http://www.maizar.org.ar/documentos/mip%20maizar.pdf) — MAIZAR
- **Se asocia bien con** (🟡 7/10): Batata, maní, poroto y otras hortalizas de la chacra de verano; asociación clásica con poroto y zapallo/calabaza (milpa).
  - 📚 [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Evitar cerca de** (🟡 5/10): En la rotación conviene no seguir con chacra de invierno, hortalizas de hoja ni de raíz (esquema INTA).
  - 📚 [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA

<a id="frutilla"></a>
## Frutilla  ·  *Fragaria × ananassa*

- **Fecha/s de siembra** (🟢 9/10): GBA: plantación (no siembra por semilla) en otoño, abril-mayo (INTA Planificador); rango amplio de marzo a junio con plantines frescos o frigo (UNLu). El cinturón hortícola de Buenos Aires cosecha de octubre a diciembre y en febrero-marzo. La propagación por semilla no es práctica; se usa plantín.
  - 📚 [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [Frutilla (ficha de cultivo)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Frutilla.pdf) — Universidad Nacional de Luján - Cátedra de Horticultura
- **Forma/s de siembra** (🟢 9/10): No se siembra: se planta a partir de plantines obtenidos por vía vegetativa (estolones), frescos o refrigerados ('frigo'). Plantación en camellón o cama, con mulching plástico negro y riego por goteo. Marco: 25-30 cm entre plantas y filas separadas 40-70 cm (Planificador: 25-30 x 40-45; UNLu: 25-30 con camellones a 65-70).
  - 📚 [Frutilla (ficha de cultivo)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Frutilla.pdf) — Universidad Nacional de Luján; [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Suelo** (🟢 8/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Suelo profundo, franco-arenoso, bien drenado, rico en materia orgánica y con buena retención de humedad; pH 5 a 7.
  - ⚠️ *Si no se cumple:* En suelos pesados, encharcadizos o mal drenados aparecen pudriciones de corona y raíz (hongos de suelo) y el fruto se vuelve blando; la salinidad y el mal drenaje reducen el rendimiento.
  - 📚 [Frutilla (ficha de cultivo)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Frutilla.pdf) — Universidad Nacional de Luján
- **Luz** (🟡 7/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Pleno sol; las plantas en lugares soleados (y en laderas orientadas al norte, en el hemisferio sur) crecen más rápido y producen mejor. _(luz directa: mín 6 h, ideal >=6-8 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz la planta produce mucha hoja y estolón pero pocas flores y frutos, más chicos, ácidos y de maduración lenta; aumenta el riesgo de enfermedades por menor aireación.
  - 📚 [Frutilla (ficha de cultivo)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Frutilla.pdf) — Universidad Nacional de Luján
- **Cosecha** (🟡 7/10): El fruto madura alrededor de 30 días después de la floración (en clima templado); con plantación de otoño, la cosecha principal en GBA va de primavera (octubre) hasta comienzos del verano, con repunte en febrero-marzo.
  - ✅ *Listo para cosechar:* Fruto con color rojo uniforme cubriendo casi toda la superficie, brillante y firme pero cediendo levemente al tacto; se cosecha con el cáliz (corona verde). Cosechar cada 2-3 días.
  - 📚 [Frutilla (ficha de cultivo)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Frutilla.pdf) — Universidad Nacional de Luján
- **Germinación** (🟡 6/10): No aplica en la práctica de huerta: la frutilla se multiplica por estolones/plantines, no por semilla. (La semilla germina, pero es lenta y desuniforme y no reproduce fielmente la variedad.)
  - 📚 [Frutilla (ficha de cultivo)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Frutilla.pdf) — Universidad Nacional de Luján
- **Trasplante** (🟢 8/10): El cultivo se inicia directamente con el trasplante del plantín (estolón enraizado o plantín frigo) a lugar definitivo en otoño (abril-mayo). No hay etapa previa de almácigo por semilla.
  - 🌱 *Listo para trasplantar:* Plantín con corona sana, 2-3 hojas y buen sistema de raíces; los plantines frigo se pueden refrigerar unos ~20 días a 0°C antes de plantar como medida preventiva.
  - 📚 [Frutilla (ficha de cultivo)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Frutilla.pdf) — Universidad Nacional de Luján
- **Longevidad** (🟢 8/10): Planta perenne, pero en producción hortícola comercial de Argentina se maneja como anual o bianual (se replanta cada 1 año, a veces 2); en jardín puede mantenerse y renovarse por estolones 2-3 años, con caída del rendimiento y sanidad con el tiempo.
  - 📚 [Frutilla (ficha de cultivo)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Frutilla.pdf) — Universidad Nacional de Luján
- **Trucos** (🟢 8/10): Usar mulching plástico negro tras la plantación (mantiene humedad, controla malezas y evita contacto del fruto con el suelo); riego por goteo bajo el plástico; en plantas nuevas cortar las primeras flores para que acumulen masa foliar; ralear estolones para concentrar fotoasimilados en el fruto; túneles plásticos para adelantar la cosecha hasta ~10 días; favorecer polinización.
  - 📚 [Frutilla (ficha de cultivo)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Frutilla.pdf) — Universidad Nacional de Luján
- **Riesgos / a evitar** (🟢 8/10): Heladas durante la floración (daño a -1°C, severo a -3°C). Exceso de humedad/encharcamiento: fruto blando y podredumbres. Salinidad. No plantar tras frutilla, frambuesa, papa, tomate, berenjena o pimiento (comparten enfermedades) sin desinfectar el suelo. Los plantines deben ser sanos y certificados para evitar introducir enfermedades de corona.
  - 📚 [Frutilla (ficha de cultivo)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Frutilla.pdf) — Universidad Nacional de Luján
- **Plagas y enfermedades** (🟡 7/10): Plagas: arañuela roja (Tetranychus), trips, y la mosca Drosophila suzukii que ataca el fruto maduro. Enfermedades: botrytis (moho gris) en fruto, podredumbre de la corona (Neopestalotiopsis), y hongos de suelo.
  - 📚 [Boletín INTA-CMCBA N°99 - Frutilla](https://www.mercadocentral.gob.ar/sites/default/files/docs/boletin-INTA-CMCBA-99-frutilla.pdf) — INTA / Corporación del Mercado Central de Buenos Aires
- **Se asocia bien con** (🟡 6/10): Se asocia bien con hortalizas de hoja (según esquema INTA).
  - 📚 [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA
- **Evitar cerca de** (🟡 7/10): Evitar suceder o asociar con bulbos, raíces y legumbres (rotación INTA). Además, malos antecesores: frambuesa, papa, tomate, berenjena y pimiento, por compartir enfermedades del suelo.
  - 📚 [Planificador de Huerta](https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf) — INTA; [Frutilla (ficha de cultivo)](https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Frutilla.pdf) — Universidad Nacional de Luján


---

# Legumbre

<a id="chaucha-poroto-judia"></a>
## Chaucha (poroto / judía)  ·  *Phaseolus vulgaris*

- **Fecha/s de siembra** (🟢 8/10): En GBA (templado húmedo) se siembra en primavera-verano, pasado el peligro de heladas. Ideal: septiembre-octubre, con siembras escalonadas posibles hasta noviembre-enero (INTA/ProHuerta). El Manual de huertas de Bs.As. la ubica en 'primavera-verano'; calendarios de siembra la marcan como directa a golpes de octubre a enero.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas); [Calendario de siembra](https://www.mihuerta.org.ar/wp-content/uploads/2013/11/Calendario-de-siembra.pdf) — Mi Huerta; [El Suelo - Calendario de siembra, abono y fertilizantes](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — Universidad Nacional del Litoral (FIQ); [Mi huerta agroecológica - Manual de huertas](https://www.ms.gba.gov.ar/sitios/alimentacionsaludable/wp-content/uploads/sites/251/2023/12/MANUAL-DE-HUERTAS.pdf) — Ministerio de Salud de la Provincia de Buenos Aires
- **Forma/s de siembra** (🟢 8/10): Siembra directa (no requiere almácigo). Variedades de enrame: 3-4 semillas por golpe cada 30 cm, a 3-4 cm de profundidad, en surcos separados 70 cm. Variedades enanas (mata baja): a chorrillo, 15-20 plantas por metro lineal, surcos a 70 cm. Es sensible al trasplante, por eso conviene siempre a golpe/asiento en su lugar definitivo.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas); [Calendario de siembra](https://www.mihuerta.org.ar/wp-content/uploads/2013/11/Calendario-de-siembra.pdf) — Mi Huerta
- **Suelo** (🟢 8/10): 🟫 **`ARENOSO_DRENANTE`** (Arenoso / drenante) — Suelos franco a franco-arenosos, sueltos y con buen drenaje. Prefiere tierra mullida, fresca y rica en humus (sin materia orgánica fresca sin descomponer).
  - ⚠️ *Si no se cumple:* En suelos pesados, encharcados o fríos la germinación es despareja y la semilla puede pudrirse; el exceso de humedad favorece enfermedades de raíz y podredumbres. En tierras muy secas o compactadas el desarrollo se frena.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas); [Cultivo de Chauchas – Cómo plantar chauchas](https://www.huertadecero.com/cultivo-de-chauchas-como-plantar-chauchas/) — Huerta de Cero
- **Luz** (🟡 6/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Cultivo de sol pleno; requiere parcelas expuestas al sol para que el suelo se caliente y las vainas cuajen bien. _(luz directa: mín 6 h, ideal 6-8 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz las plantas se ahílan (tallos largos y débiles), florecen y cuajan menos, y la producción de vainas cae marcadamente.
  - 📚 [Cultivo de Chauchas – Cómo plantar chauchas](https://www.huertadecero.com/cultivo-de-chauchas-como-plantar-chauchas/) — Huerta de Cero
- **Cosecha** (🟢 8/10): Variedades enanas: ~60 días desde la siembra. Variedades de enrame: 70-80 días. Cosecha escalonada de vainas tiernas durante varias semanas.
  - ✅ *Listo para cosechar:* Vainas con su máximo desarrollo pero cosechadas ANTES de que los granos (porotos) se marquen/abulten en la vaina; deben quebrarse tiernas. No dejarlas endurecer para evitar fibrosidad.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas); [Calendario de siembra](https://www.mihuerta.org.ar/wp-content/uploads/2013/11/Calendario-de-siembra.pdf) — Mi Huerta
- **Germinación** (🟡 5/10): Aproximadamente 5-10 días con suelo templado (>8-10 °C); germina más rápido cuanto más cálido el suelo. Sin dato oficial argentino de días exactos en las fuentes consultadas.
  - 📚 [Cultivo de Chauchas – Cómo plantar chauchas](https://www.huertadecero.com/cultivo-de-chauchas-como-plantar-chauchas/) — Huerta de Cero
- **Trasplante** (🟡 7/10): No requiere trasplante: se siembra siempre directa en su lugar definitivo porque su raíz no tolera bien el trasplante.
  - 🌱 *Listo para trasplantar:* No aplica.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas)
- **Longevidad** (🟢 8/10): Anual. Produce vainas durante varias semanas (cosecha escalonada); las enanas concentran la producción, las de enrame producen por más tiempo.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas)
- **Trucos** (🟡 6/10): Sembrar recién pasado el riesgo de heladas y con suelo templado. Como legumbre fija nitrógeno: no abusar de abonos nitrogenados. Colocar tutores de 2-2,5 m para las variedades de enrame. Usar acolchado/mulch orgánico para conservar humedad y controlar malezas; regar bien especialmente en floración y cuaje.
  - 📚 [Cultivo de Chauchas – Cómo plantar chauchas](https://www.huertadecero.com/cultivo-de-chauchas-como-plantar-chauchas/) — Huerta de Cero
- **Riesgos / a evitar** (🟡 7/10): Muy sensible a heladas (no sembrar antes de que pase el peligro). Evitar exceso de riego/encharcamiento (pudre semilla y raíz). Evitar suelos fríos y compactados. No cosechar tarde (vainas fibrosas).
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas); [Cultivo de Chauchas – Cómo plantar chauchas](https://www.huertadecero.com/cultivo-de-chauchas-como-plantar-chauchas/) — Huerta de Cero
- **Plagas y enfermedades** (🟡 7/10): Plagas: pulgones (verde y negro), arañuela roja y ácaros; también trips y chinches. Enfermedades del poroto documentadas por INTA: antracnosis, tizones bacterianos, mancha angular, oídio y podredumbres de raíz. Controles caseros: jabón potásico, aceite de neem, extracto de cola de caballo.
  - 📚 [Cultivo de Chauchas – Cómo plantar chauchas](https://www.huertadecero.com/cultivo-de-chauchas-como-plantar-chauchas/) — Huerta de Cero; [Enfermedades del poroto (Cap. 12)](https://repositorio.inta.gob.ar/bitstream/handle/20.500.12123/18415/INTA_CIAP_InstitutodePatologiaVegetal_Popler_L.D_Enfermedades_del_poroto.pdf) — INTA - Instituto de Patología Vegetal (CIAP)
- **Se asocia bien con** (🟡 6/10): Se asocia bien con maíz y calabaza/zapallo (esquema tradicional de las 'tres hermanas'), y con zanahoria, coles, pepino, apio, frutilla, perejil, papa y tomate. Como leguminosa aporta nitrógeno al suelo.
  - 📚 [Cultivo de Chauchas – Cómo plantar chauchas](https://www.huertadecero.com/cultivo-de-chauchas-como-plantar-chauchas/) — Huerta de Cero
- **Evitar cerca de** (🟡 6/10): Conviene NO plantarla cerca de las liliáceas: ajo, cebolla, puerro, cebolla de verdeo e hinojo (inhiben su desarrollo).
  - 📚 [Cultivo de Chauchas – Cómo plantar chauchas](https://www.huertadecero.com/cultivo-de-chauchas-como-plantar-chauchas/) — Huerta de Cero

<a id="arveja"></a>
## Arveja  ·  *Pisum sativum*

- **Fecha/s de siembra** (🟢 8/10): Cultivo de estación fría. En GBA (zona templada) se siembra en otoño: abril-junio (INTA/ProHuerta). Calendarios argentinos: mayo (Mi Huerta) o junio-agosto (FIQ-UNL). En zonas templadas-frías puede extenderse a julio-agosto. El Manual de huertas de Bs.As. la ubica en 'otoño-invierno'.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas); [Calendario de siembra](https://www.mihuerta.org.ar/wp-content/uploads/2013/11/Calendario-de-siembra.pdf) — Mi Huerta; [El Suelo - Calendario de siembra, abono y fertilizantes](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — Universidad Nacional del Litoral (FIQ); [Mi huerta agroecológica - Manual de huertas](https://www.ms.gba.gov.ar/sitios/alimentacionsaludable/wp-content/uploads/sites/251/2023/12/MANUAL-DE-HUERTAS.pdf) — Ministerio de Salud de la Provincia de Buenos Aires
- **Forma/s de siembra** (🟢 8/10): Siembra directa 'de asiento' (no requiere almácigo): se deposita la semilla en surcos, a golpes cada ~30 cm y a una profundidad no mayor de 5 cm. Entre hileras 30-40 cm en variedades enanas y hasta 60 cm en las de enrame.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas); [Calendario de siembra](https://www.mihuerta.org.ar/wp-content/uploads/2013/11/Calendario-de-siembra.pdf) — Mi Huerta
- **Suelo** (🟢 8/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Suelos sueltos, fértiles, algo húmedos y con materia orgánica en descomposición. Buen drenaje.
  - ⚠️ *Si no se cumple:* En suelos encharcados o mal drenados la semilla se pudre y aparecen enfermedades de raíz; en suelos muy pobres o secos la planta rinde poco. El exceso de nitrógeno favorece follaje en desmedro de vainas.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas)
- **Luz** (🟡 5/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Prefiere sol pleno, aunque al ser de estación fría tolera algo de sol parcial y no soporta el calor extremo del verano. _(luz directa: mín 5 h, ideal 6 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con luz insuficiente se ahíla, florece y cuaja menos, retrasa la cosecha y baja el rendimiento de vainas.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas)
- **Cosecha** (🟢 8/10): 120-150 días desde la siembra, según la textura del grano (variedades más duras tardan más).
  - ✅ *Listo para cosechar:* Para arveja fresca: vainas bien llenas y verdes, con granos tiernos. Para grano seco: cuando las plantas terminan su ciclo (amarilleo general y la vaina se desgrana con facilidad).
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas); [Calendario de siembra](https://www.mihuerta.org.ar/wp-content/uploads/2013/11/Calendario-de-siembra.pdf) — Mi Huerta
- **Germinación** (🟡 7/10): Aproximadamente 1 semana (7 días) en condiciones óptimas de temperatura y humedad.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas)
- **Trasplante** (🟡 7/10): No requiere trasplante: se hace siembra directa de asiento en el lugar definitivo.
  - 🌱 *Listo para trasplantar:* No aplica.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas)
- **Longevidad** (🟡 7/10): Anual, de ciclo otoño-invernal. Produce durante un período de cosecha acotado hacia el fin del ciclo; conviene siembra escalonada para prolongar la cosecha.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas)
- **Trucos** (🟡 6/10): Sembrar en otoño para aprovechar el fresco; colocar ramas o tutores/enrejado a las variedades trepadoras. Como leguminosa fija nitrógeno, por lo que mejora el suelo para el cultivo siguiente y no necesita fertilización nitrogenada. Escalonar siembras cada 2-3 semanas para cosecha prolongada.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas)
- **Riesgos / a evitar** (🟡 7/10): No sembrar en verano: el calor detiene la floración y frena el cuaje. Evitar exceso de riego/encharcamiento (pudre la semilla y favorece hongos). No abusar de nitrógeno (crece follaje en vez de vainas).
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas)
- **Plagas y enfermedades** (🟡 7/10): Enfermedades más comunes: tizón y antracnosis (se controlan con caldo bordelés u oxicloruro de cobre); también oídio en primaveras húmedas. Plagas: pulgones y, en fructificación, gorgojo de la arveja.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas)
- **Se asocia bien con** (🟡 5/10): Se asocia bien con zanahoria, rabanito, nabo, maíz, pepino y hortalizas de hoja; como leguminosa aporta nitrógeno que beneficia a los cultivos vecinos.
  - 📚 [Especies hortícolas, asociaciones favorables entre ellas](https://www.portalfruticola.com/noticias/2020/09/24/asociaciones-favorables-entre-especies-horticolas/) — Portal Frutícola
- **Evitar cerca de** (🟡 5/10): Conviene NO ubicarla junto a las liliáceas: ajo, cebolla, puerro y cebolla de verdeo (inhiben el crecimiento de las leguminosas).
  - 📚 [Especies hortícolas, asociaciones favorables entre ellas](https://www.portalfruticola.com/noticias/2020/09/24/asociaciones-favorables-entre-especies-horticolas/) — Portal Frutícola

<a id="haba"></a>
## Haba  ·  *Vicia faba*

- **Fecha/s de siembra** (🟢 8/10): Cultivo otoño-invernal de estación fría. En GBA se siembra de abril a julio (INTA/ProHuerta). Calendarios argentinos: abril-junio (Mi Huerta) o junio-julio (FIQ-UNL). Tolera el frío y es la legumbre que mejor pasa el invierno.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas); [Calendario de siembra](https://www.mihuerta.org.ar/wp-content/uploads/2013/11/Calendario-de-siembra.pdf) — Mi Huerta; [El Suelo - Calendario de siembra, abono y fertilizantes](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — Universidad Nacional del Litoral (FIQ)
- **Forma/s de siembra** (🟢 8/10): Siembra directa 'de asiento' (no requiere almácigo), en líneas separadas 0,70-0,80 m, colocando 2-3 semillas por golpe (a razón de 3-4 semillas por metro lineal). Semilla grande, se entierra unos 4-5 cm.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas); [Calendario de siembra](https://www.mihuerta.org.ar/wp-content/uploads/2013/11/Calendario-de-siembra.pdf) — Mi Huerta
- **Suelo** (🟢 8/10): 🟦 **`HUMEDO_RICO`** (Húmedo y rico) — Suelos arcillosos, ricos en humus, profundos y frescos. Es rústica y se adapta a suelos algo pesados mejor que otras legumbres, siempre con buena disponibilidad de humedad.
  - ⚠️ *Si no se cumple:* En suelos muy secos o pobres el desarrollo y el llenado de vainas se reducen. En suelos anegados aparecen podredumbres de raíz y enfermedades fúngicas.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas)
- **Luz** (🟡 5/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Prefiere sol pleno; al ser de invierno aprovecha bien la luz de la estación fría y tolera algo de sol parcial. _(luz directa: mín 5 h, ideal 6 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con sombra excesiva se ahíla, produce tallos débiles que se vuelcan, florece menos y baja el rendimiento de vainas.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas)
- **Cosecha** (🟢 8/10): Aproximadamente 150 días desde la siembra (calendarios argentinos indican 150-180 días). Se pueden alcanzar hasta ~20 legumbres por planta.
  - ✅ *Listo para cosechar:* Para consumo en fresco: vainas verdes bien formadas, con granos que aún se hunden con la uña. Para grano seco: dejar secar las vainas en la planta hasta que se pongan negras/marrones.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas); [Calendario de siembra](https://www.mihuerta.org.ar/wp-content/uploads/2013/11/Calendario-de-siembra.pdf) — Mi Huerta
- **Germinación** (🔴 4/10): Aproximadamente 1-2 semanas (7-14 días) según temperatura del suelo. Sin dato de días exacto en las fuentes oficiales consultadas.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas)
- **Trasplante** (🟡 7/10): No requiere trasplante: se siembra directa de asiento en su lugar definitivo.
  - 🌱 *Listo para trasplantar:* No aplica.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas)
- **Longevidad** (🟢 8/10): Anual, de ciclo otoño-invernal (largo, ~5-6 meses). Cada planta produce hasta unas 20 vainas hacia el final del ciclo.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas)
- **Trucos** (🟡 7/10): Asociar con ajo implantado en el entresurco en mayo para repeler pulgones. Despuntar la planta (cortar la punta tierna) cuando aparecen las primeras vainas para reducir el ataque de pulgón y adelantar el llenado. Como leguminosa fija nitrógeno y es excelente abono verde. Aporcar/tutorar si el viento vuelca las plantas.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas)
- **Riesgos / a evitar** (🟡 7/10): Muy susceptible al pulgón negro, sobre todo en el brote apical (de ahí el despunte). Evitar suelos anegados (favorecen la mancha chocolate/Botrytis). Las plantas altas se vuelcan con viento si no se tutoran.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas)
- **Plagas y enfermedades** (🟢 8/10): Plagas: pulgón del haba (pulgón negro) y trips. Enfermedad principal: mancha chocolate (Botrytis fabae). Control casero: espolvoreos con ceniza de madera y despunte de brotes atacados.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas)
- **Se asocia bien con** (🟡 7/10): Se asocia favorablemente con el ajo (plantado en el entresurco para repeler pulgones); también con lechuga, apio y hortalizas de hoja. Como leguminosa aporta nitrógeno al suelo.
  - 📚 [Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta)](https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html) — INTA / ProHuerta (EEA Cerbas)
- **Evitar cerca de** (🔴 3/10): Se desaconseja ubicarla junto a otras leguminosas y, en general, cerca de cebolla y ajo cuando se busca producción de grano (aunque el ajo se usa puntualmente como repelente de pulgón en el entresurco). Sin dato oficial argentino específico de incompatibilidades para el haba.
  - 📚 [Especies hortícolas, asociaciones favorables entre ellas](https://www.portalfruticola.com/noticias/2020/09/24/asociaciones-favorables-entre-especies-horticolas/) — Portal Frutícola


---

# Aromática

<a id="albahaca"></a>
## Albahaca  ·  *Ocimum basilicum*

- **Fecha/s de siembra** (🟢 8/10): En GBA se siembra en almácigo protegido de agosto a septiembre y se trasplanta en octubre-noviembre (calendario INTA/ProHuerta). El Brote Urbano coincide: almácigo protegido en agosto para trasplantar a mediados de septiembre-octubre, o siembra de febrero-marzo. En general primavera-verano, con temperaturas superiores a 15 °C; muy sensible al frío.
  - 📚 [Calendario de siembra - INTA/ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Ministerio de Desarrollo Social de la Nación; [¿Cómo cultivar Albahaca? - El Brote Urbano](https://www.elbroteurbano.com/como-cultivar-albahaca/) — El Brote Urbano (Argentina); [Cómo cultivar orégano, tomillo y albahaca (contenido INTA)](https://supercampo.perfil.com/2019/11/como-cultivar-oregano-tomillo-y-albahaca/) — Supercampo / INTA
- **Forma/s de siembra** (🟢 8/10): Se inicia en almácigo protegido por semilla (grano fino, siembra superficial) y luego se trasplanta; es la forma recomendada por su sensibilidad al frío. Marco de plantación 50 cm entre surcos y 30 cm entre plantas (INTA indica 15 x 40 cm).
  - 📚 [¿Cómo cultivar Albahaca? - El Brote Urbano](https://www.elbroteurbano.com/como-cultivar-albahaca/) — El Brote Urbano (Argentina); [Calendario de siembra - INTA/ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Ministerio de Desarrollo Social de la Nación
- **Suelo** (🟡 7/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Prefiere suelos ricos, sueltos y fácilmente drenables (El Brote Urbano). El INTA/Supercampo señala que también se adapta a suelos pobres con buen drenaje.
  - ⚠️ *Si no se cumple:* En suelos encharcados o con mal drenaje sufre pudriciones de raíz y hongos; en suelos muy pobres crece débil y con menor producción de hoja y aroma.
  - 📚 [¿Cómo cultivar Albahaca? - El Brote Urbano](https://www.elbroteurbano.com/como-cultivar-albahaca/) — El Brote Urbano (Argentina); [Cómo cultivar orégano, tomillo y albahaca (contenido INTA)](https://supercampo.perfil.com/2019/11/como-cultivar-oregano-tomillo-y-albahaca/) — Supercampo / INTA
- **Luz** (🟡 7/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Se desarrolla en lugares muy soleados; la exposición al sol incrementa el contenido de aceites esenciales y el aroma. _(luz directa: mín 4-6 h, ideal >=6 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz se ahíla (tallos largos y débiles), pierde aroma y aceites esenciales y da hojas más pálidas y escasas.
  - 📚 [Cómo cultivar orégano, tomillo y albahaca (contenido INTA)](https://supercampo.perfil.com/2019/11/como-cultivar-oregano-tomillo-y-albahaca/) — Supercampo / INTA
- **Cosecha** (🟡 7/10): Aproximadamente 90-100 días desde la siembra (calendario INTA). Se cosecha por cortes de la parte apical antes de la floración.
  - ✅ *Listo para cosechar:* Planta con buen desarrollo de hojas (a partir de ~10-15 cm); cosechar antes de que se formen los racimos florales, podando los ápices para prolongar la producción.
  - 📚 [Calendario de siembra - INTA/ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Ministerio de Desarrollo Social de la Nación; [¿Cómo cultivar Albahaca? - El Brote Urbano](https://www.elbroteurbano.com/como-cultivar-albahaca/) — El Brote Urbano (Argentina)
- **Germinación** (🔴 4/10): Generalmente 7-14 días con temperaturas cálidas (>15-20 °C); germinación pobre o nula con frío. No hallé un valor puntual en fuente oficial argentina.
  - 📚 [¿Cómo cultivar Albahaca? - El Brote Urbano](https://www.elbroteurbano.com/como-cultivar-albahaca/) — El Brote Urbano (Argentina)
- **Trasplante** (🟡 7/10): Se trasplanta desde el almácigo unas 4-6 semanas después de la siembra (en GBA, trasplante en octubre-noviembre). Conviene trasplantar con pan de tierra y cuidar los riegos en verano.
  - 🌱 *Listo para trasplantar:* Plantín de aproximadamente 10 cm de altura con 6 a 8 hojas verdaderas.
  - 📚 [¿Cómo cultivar Albahaca? - El Brote Urbano](https://www.elbroteurbano.com/como-cultivar-albahaca/) — El Brote Urbano (Argentina); [Calendario de siembra - INTA/ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Ministerio de Desarrollo Social de la Nación
- **Longevidad** (🟢 8/10): Anual. En GBA cumple su ciclo en la temporada cálida y muere con los primeros fríos/heladas del otoño.
  - 📚 [Cómo cultivar orégano, tomillo y albahaca (contenido INTA)](https://supercampo.perfil.com/2019/11/como-cultivar-oregano-tomillo-y-albahaca/) — Supercampo / INTA
- **Trucos** (🟡 7/10): Podar/pellizcar los ápices y quitar los racimos florales para estimular el rebrote y prolongar la cosecha de hoja. La plena exposición al sol aumenta los aceites esenciales y el aroma. Trasplantar con pan de tierra y regar con cuidado en verano.
  - 📚 [¿Cómo cultivar Albahaca? - El Brote Urbano](https://www.elbroteurbano.com/como-cultivar-albahaca/) — El Brote Urbano (Argentina); [Cómo cultivar orégano, tomillo y albahaca (contenido INTA)](https://supercampo.perfil.com/2019/11/como-cultivar-oregano-tomillo-y-albahaca/) — Supercampo / INTA
- **Riesgos / a evitar** (🟡 7/10): Muy sensible al frío y a las heladas: no sembrar antes de que pasen los fríos. No tolera el encharcamiento (riesgo de pudriciones). La floración adelantada por calor o estrés reduce la calidad de la hoja.
  - 📚 [¿Cómo cultivar Albahaca? - El Brote Urbano](https://www.elbroteurbano.com/como-cultivar-albahaca/) — El Brote Urbano (Argentina)
- **Plagas y enfermedades** (🟡 7/10): En general muy resistente a plagas y enfermedades. Los daños posibles provienen de hormigas y orugas; en exceso de humedad puede sufrir hongos.
  - 📚 [¿Cómo cultivar Albahaca? - El Brote Urbano](https://www.elbroteurbano.com/como-cultivar-albahaca/) — El Brote Urbano (Argentina)
- **Se asocia bien con** (🟡 7/10): Tomate (intercalada entre las líneas de tomate ayuda a repeler insectos); en general actúa como aliada de la huerta repeliendo insectos. También se la asocia con pimiento y otras hortalizas de fruto.
  - 📚 [Asociaciones de cultivos en nuestra huerta - Fecoagro](https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/) — Fecoagro (Argentina); [¿Cómo cultivar Albahaca? - El Brote Urbano](https://www.elbroteurbano.com/como-cultivar-albahaca/) — El Brote Urbano (Argentina)
- **Evitar cerca de** (🔴 2/10): Sin dato confiable específico en las fuentes argentinas consultadas. La divulgación suele desaconsejar su cercanía a la ruda; no hallé fuente técnica que lo confirme.
  - 📚 _(sin fuente registrada)_

<a id="perejil"></a>
## Perejil  ·  *Petroselinum crispum*

- **Fecha/s de siembra** (🟢 8/10): Puede sembrarse casi todo el año, pero las mejores épocas en GBA son fines de primavera y otoño (El Brote Urbano). El calendario INTA lo ubica como siembra directa (primavera-verano).
  - 📚 [¿Cómo cultivar Perejil? - El Brote Urbano](https://www.elbroteurbano.com/como-cultivar-perejil/) — El Brote Urbano (Argentina); [Calendario de siembra - INTA/ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Ministerio de Desarrollo Social de la Nación
- **Forma/s de siembra** (🟢 8/10): Siembra directa (el INTA la indica 'a chorrillo'/en línea). En líneas separadas ~40 cm o al voleo, a no más de 1 cm de profundidad. Germinación lenta (hasta ~18 días). El INTA da distancia 1 x 25 cm.
  - 📚 [¿Cómo cultivar Perejil? - El Brote Urbano](https://www.elbroteurbano.com/como-cultivar-perejil/) — El Brote Urbano (Argentina); [Calendario de siembra - INTA/ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Ministerio de Desarrollo Social de la Nación
- **Suelo** (🟡 7/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Se da bien en casi todos los terrenos, aunque prefiere suelos sueltos, frescos y bien provistos de materia orgánica descompuesta.
  - ⚠️ *Si no se cumple:* Es rústico y tolera suelos diversos; en suelos compactados o pobres el rebrote es más lento y las plantas menos vigorosas.
  - 📚 [¿Cómo cultivar Perejil? - El Brote Urbano](https://www.elbroteurbano.com/como-cultivar-perejil/) — El Brote Urbano (Argentina)
- **Luz** (🟡 5/10): 🌤️ **`SOL_PARCIAL`** (Sol parcial) — Requiere buena luz pero tolera bien la media sombra; es de los cultivos que admite ubicaciones con sol parcial. Las fuentes argentinas consultadas no precisan horas. _(luz directa: mín 3-4 h, ideal 4-6 h; sin sol directo: sí)_
  - ⚠️ *Si no se cumple:* Con muy poca luz crece más lento y ahilado; en exceso de sol y calor tiende a subirse a flor (espigar) antes.
  - 📚 [¿Cómo cultivar Perejil? - El Brote Urbano](https://www.elbroteurbano.com/como-cultivar-perejil/) — El Brote Urbano (Argentina)
- **Cosecha** (🟡 7/10): Primer corte a los 60-70 días de la siembra (el calendario INTA indica ~85-130 días, con 3 a 5 cortes); luego cortes sucesivos cada 10-15 días según temperatura.
  - ✅ *Listo para cosechar:* Matas con hojas bien desarrolladas; se corta manualmente a unos 5 cm del suelo, dejando el centro para el rebrote.
  - 📚 [¿Cómo cultivar Perejil? - El Brote Urbano](https://www.elbroteurbano.com/como-cultivar-perejil/) — El Brote Urbano (Argentina); [Calendario de siembra - INTA/ProHuerta](https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf) — INTA / Ministerio de Desarrollo Social de la Nación
- **Germinación** (🟡 7/10): Lenta: hasta unos 18 días (puede acelerarse remojando la semilla previamente).
  - 📚 [¿Cómo cultivar Perejil? - El Brote Urbano](https://www.elbroteurbano.com/como-cultivar-perejil/) — El Brote Urbano (Argentina)
- **Trasplante** (🟡 6/10): Habitualmente NO requiere trasplante: se hace por siembra directa por su raíz pivotante que se resiente al trasplante. Es posible trasplantar plántulas jóvenes con cuidado, pero no es lo recomendado.
  - 🌱 *Listo para trasplantar:* No aplica en siembra directa; si se trasplanta, hacerlo muy joven y con pan de tierra para no dañar la raíz.
  - 📚 [¿Cómo cultivar Perejil? - El Brote Urbano](https://www.elbroteurbano.com/como-cultivar-perejil/) — El Brote Urbano (Argentina)
- **Longevidad** (🟡 6/10): Bianual: en el primer año produce hojas y en el segundo florece y semilla. En la huerta suele cultivarse como anual, dedicado a la producción de hojas.
  - 📚 [¿Cómo cultivar Perejil? - El Brote Urbano](https://www.elbroteurbano.com/como-cultivar-perejil/) — El Brote Urbano (Argentina)
- **Trucos** (🟡 6/10): Remojar las semillas antes de sembrar para acelerar la germinación (que es lenta). Cortar a 5 cm del suelo dejando el cogollo central para favorecer sucesivos rebrotes; unos 5 metros de surco abastecen a una familia de 4 personas.
  - 📚 [¿Cómo cultivar Perejil? - El Brote Urbano](https://www.elbroteurbano.com/como-cultivar-perejil/) — El Brote Urbano (Argentina)
- **Riesgos / a evitar** (🟡 6/10): Germinación lenta y despareja (riesgo de darlo por perdido). Con calor fuerte se sube a flor perdiendo calidad de hoja. Evitar exceso de humedad que favorece hongos (Septoria).
  - 📚 [¿Cómo cultivar Perejil? - El Brote Urbano](https://www.elbroteurbano.com/como-cultivar-perejil/) — El Brote Urbano (Argentina)
- **Plagas y enfermedades** (🟡 6/10): Cultivo rústico. La enfermedad más importante es la mancha foliar por el hongo Septoria. También pueden aparecer pulgones.
  - 📚 [¿Cómo cultivar Perejil? - El Brote Urbano](https://www.elbroteurbano.com/como-cultivar-perejil/) — El Brote Urbano (Argentina)
- **Se asocia bien con** (🟡 5/10): Tomate, y en general se intercala una o dos líneas de perejil junto a hortalizas de raíz y de hoja; se lo considera buen acompañante en la huerta.
  - 📚 [Asociaciones de cultivos en nuestra huerta - Fecoagro](https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/) — Fecoagro (Argentina)
- **Evitar cerca de** (🔴 2/10): Sin dato confiable en las fuentes argentinas consultadas. La divulgación suele desaconsejar asociarlo con lechuga; no lo confirmé con fuente técnica.
  - 📚 _(sin fuente registrada)_

<a id="cilantro"></a>
## Cilantro  ·  *Coriandrum sativum*

- **Fecha/s de siembra** (🟡 6/10): En GBA conviene sembrar en otoño y primavera, cuando las temperaturas no son extremas (Sitopia). Se evita el pleno verano porque el calor lo hace florecer rápido.
  - 📚 [¿Cómo cultivar cilantro? - Sitopia](https://sitopia.com.ar/como-cultivar-cilantro/) — Sitopia (Argentina)
- **Forma/s de siembra** (🟡 6/10): Preferentemente siembra directa (raíz pivotante que no gusta del trasplante), aunque también se puede en almácigos biodegradables. Truco: el 'grano' son en realidad dos semillas pegadas; conviene partirlas para mejorar la germinación. Separación aproximada 50-60 cm entre filas y 15-20 cm entre plantas.
  - 📚 [¿Cómo cultivar cilantro? - Sitopia](https://sitopia.com.ar/como-cultivar-cilantro/) — Sitopia (Argentina); [El cultivo del cilantro - Infoagro](https://www.infoagro.com/aromaticas/cilantro.htm) — Infoagro (España)
- **Suelo** (🟡 6/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Suelos ricos en nutrientes (con compost/enmiendas), bien drenados y de pH 6,5-7,5 (Sitopia). Infoagro lo describe como poco exigente: crece en suelos francos, ligeros, frescos, permeables y profundos.
  - ⚠️ *Si no se cumple:* No tolera el exceso de humedad: en suelos encharcados o mal drenados es susceptible a enfermedades fúngicas (roya, podredumbre de raíz).
  - 📚 [¿Cómo cultivar cilantro? - Sitopia](https://sitopia.com.ar/como-cultivar-cilantro/) — Sitopia (Argentina); [El cultivo del cilantro - Infoagro](https://www.infoagro.com/aromaticas/cilantro.htm) — Infoagro (España)
- **Luz** (🟡 6/10): 🌤️ **`SOL_PARCIAL`** (Sol parcial) — Exposición a pleno sol o parcial, preferentemente sol de la mañana; tolera bien la media sombra e incluso, si se trasplanta ya mediana, ubicaciones casi sombreadas. _(luz directa: mín 3-4 h, ideal 4-6 h; sin sol directo: sí)_
  - ⚠️ *Si no se cumple:* El sol fuerte y el calor lo hacen subirse a flor (espigar) rápidamente, acortando la producción de hoja; con muy poca luz crece más lento y ahilado.
  - 📚 [¿Cómo cultivar cilantro? - Sitopia](https://sitopia.com.ar/como-cultivar-cilantro/) — Sitopia (Argentina)
- **Cosecha** (🟡 6/10): Cosecha de hoja aproximadamente a los 40-60 días de la siembra (Infoagro); admite varios cortes durante la temporada. Para semilla madura, hasta ~4 meses.
  - ✅ *Listo para cosechar:* Cuando la planta alcanza unos 15 cm de altura; se cortan hojas con tijera o se arrancan a mano, antes de que emita el tallo floral.
  - 📚 [¿Cómo cultivar cilantro? - Sitopia](https://sitopia.com.ar/como-cultivar-cilantro/) — Sitopia (Argentina); [El cultivo del cilantro - Infoagro](https://www.infoagro.com/aromaticas/cilantro.htm) — Infoagro (España)
- **Germinación** (🟡 6/10): Alrededor de 15 días (poder germinativo superior al 90% cerca de 15 °C). Partir las semillas dobles mejora el brotado.
  - 📚 [El cultivo del cilantro - Infoagro](https://www.infoagro.com/aromaticas/cilantro.htm) — Infoagro (España); [¿Cómo cultivar cilantro? - Sitopia](https://sitopia.com.ar/como-cultivar-cilantro/) — Sitopia (Argentina)
- **Trasplante** (🟡 5/10): Generalmente NO se trasplanta: por su raíz pivotante se recomienda siembra directa. Si se usa almácigo, emplear macetas/celdas biodegradables y trasplantar con pan de tierra sin dañar la raíz.
  - 🌱 *Listo para trasplantar:* No aplica en siembra directa; si se trasplanta desde almácigo biodegradable, hacerlo con la plántula pequeña y con todo el cepellón.
  - 📚 [¿Cómo cultivar cilantro? - Sitopia](https://sitopia.com.ar/como-cultivar-cilantro/) — Sitopia (Argentina)
- **Longevidad** (🟡 6/10): Anual, de ciclo corto (para follaje ~35-40 días de crecimiento activo). Tiende a florecer y semillar en una sola temporada, sobre todo con calor.
  - 📚 [El cultivo del cilantro - Infoagro](https://www.infoagro.com/aromaticas/cilantro.htm) — Infoagro (España)
- **Trucos** (🟡 6/10): Partir a la mitad las semillas dobles antes de sembrar para mejorar la germinación. Hacer siembras escalonadas y ubicarlo con sol de la mañana / media sombra en primavera-verano para retrasar el espigado. Riego regular manteniendo el suelo húmedo pero no encharcado; aplicar cola de caballo (equisetum) preventivamente.
  - 📚 [¿Cómo cultivar cilantro? - Sitopia](https://sitopia.com.ar/como-cultivar-cilantro/) — Sitopia (Argentina)
- **Riesgos / a evitar** (🟡 6/10): Se sube a flor (espiga) muy rápido con calor y días largos: temperaturas por encima de ~21 °C aceleran la floración y bajan la calidad. No tolera el exceso de humedad. Evitar el trasplante que daña la raíz pivotante.
  - 📚 [El cultivo del cilantro - Infoagro](https://www.infoagro.com/aromaticas/cilantro.htm) — Infoagro (España); [¿Cómo cultivar cilantro? - Sitopia](https://sitopia.com.ar/como-cultivar-cilantro/) — Sitopia (Argentina)
- **Plagas y enfermedades** (🟡 6/10): Pulgones (áfidos). Enfermedades: roya y podredumbre de raíz (Sitopia); mancha bacteriana por Pseudomonas syringae (Infoagro), favorecidas por el exceso de humedad.
  - 📚 [¿Cómo cultivar cilantro? - Sitopia](https://sitopia.com.ar/como-cultivar-cilantro/) — Sitopia (Argentina); [El cultivo del cilantro - Infoagro](https://www.infoagro.com/aromaticas/cilantro.htm) — Infoagro (España)
- **Se asocia bien con** (🟡 5/10): Repollo, lechuga y tomate.
  - 📚 [¿Cómo cultivar cilantro? - Sitopia](https://sitopia.com.ar/como-cultivar-cilantro/) — Sitopia (Argentina)
- **Evitar cerca de** (🔴 2/10): Sin dato confiable en las fuentes consultadas. La divulgación suele desaconsejarlo cerca del hinojo; no lo confirmé con fuente técnica.
  - 📚 _(sin fuente registrada)_

<a id="oregano"></a>
## Orégano  ·  *Origanum vulgare*

- **Fecha/s de siembra** (🟡 6/10): En GBA se propaga y planta preferentemente en primavera (acodos y esquejes; los esquejes también a inicio del otoño). Solo los oréganos de tipo europeo pueden multiplicarse por semilla. La división de matas se hace en otoño o a principios de primavera.
  - 📚 [Cómo cultivar orégano, tomillo y albahaca (contenido INTA)](https://supercampo.perfil.com/2019/11/como-cultivar-oregano-tomillo-y-albahaca/) — Supercampo / INTA; [El cultivo del orégano - Infoagro](https://www.infoagro.com/aromaticas/oregano.htm) — Infoagro (España)
- **Forma/s de siembra** (🟡 6/10): Se multiplica sobre todo en forma vegetativa: por esquejes, acodo (simple o por amontonamiento) y división de matas, que asegura plantas homogéneas. También por semilla (almácigo superficial, requiere luz para germinar) pero da poblaciones heterogéneas. Marco de plantación ~30 cm entre filas y 20-35 cm entre plantas.
  - 📚 [Cómo cultivar orégano, tomillo y albahaca (contenido INTA)](https://supercampo.perfil.com/2019/11/como-cultivar-oregano-tomillo-y-albahaca/) — Supercampo / INTA; [El cultivo del orégano - Infoagro](https://www.infoagro.com/aromaticas/oregano.htm) — Infoagro (España)
- **Suelo** (🟡 6/10): ⬜ **`RUSTICO_TOLERANTE`** (Rústico / tolerante) — Se adapta a suelos pobres pero con buena granulometría y drenaje (INTA/Supercampo). Infoagro: crece en casi todo tipo de suelo suelto, rico en materia orgánica, incluso calcáreos o algo áridos.
  - ⚠️ *Si no se cumple:* No tolera el encharcamiento: en suelos pesados y con mal drenaje sufre pudriciones de raíz y hongos. En suelos muy sombríos o húmedos pierde aroma y aceites esenciales.
  - 📚 [Cómo cultivar orégano, tomillo y albahaca (contenido INTA)](https://supercampo.perfil.com/2019/11/como-cultivar-oregano-tomillo-y-albahaca/) — Supercampo / INTA; [El cultivo del orégano - Infoagro](https://www.infoagro.com/aromaticas/oregano.htm) — Infoagro (España)
- **Luz** (🟡 7/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Pleno sol. El INTA recomienda ubicarlo en lugares muy soleados y orientados al norte, lo que potencia el aroma y el contenido de aceites esenciales. _(luz directa: mín 4-6 h, ideal >=6 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poco sol crece débil y ahilado, y disminuye notablemente el aroma y los aceites esenciales.
  - 📚 [Cómo cultivar orégano, tomillo y albahaca (contenido INTA)](https://supercampo.perfil.com/2019/11/como-cultivar-oregano-tomillo-y-albahaca/) — Supercampo / INTA; [El cultivo del orégano - Infoagro](https://www.infoagro.com/aromaticas/oregano.htm) — Infoagro (España)
- **Cosecha** (🟡 5/10): El corte principal se hace en plena floración (en GBA, verano: diciembre-febrero), momento de mayor concentración de aceites esenciales; se realizan una o más siegas por temporada. La planta rinde a partir del primer año establecido.
  - ✅ *Listo para cosechar:* Plantas en botón/floración, con las matas bien desarrolladas; se cortan las ramas dejando la base para el rebrote.
  - 📚 [El cultivo del orégano - Infoagro](https://www.infoagro.com/aromaticas/oregano.htm) — Infoagro (España)
- **Germinación** (🟡 5/10): Por semilla, alrededor de 20-23 días a ~20 °C (requiere luz para germinar). En la práctica se prefiere multiplicación vegetativa por su mayor uniformidad y rapidez.
  - 📚 [El cultivo del orégano - Infoagro](https://www.infoagro.com/aromaticas/oregano.htm) — Infoagro (España)
- **Trasplante** (🟡 5/10): Se lleva a lugar definitivo el plantín obtenido de esqueje, acodo, división de mata o almácigo, en primavera.
  - 🌱 *Listo para trasplantar:* Esqueje/plantín con raíces bien formadas y brotación activa; la división de mata debe llevar raíces y varios brotes.
  - 📚 [Cómo cultivar orégano, tomillo y albahaca (contenido INTA)](https://supercampo.perfil.com/2019/11/como-cultivar-oregano-tomillo-y-albahaca/) — Supercampo / INTA; [El cultivo del orégano - Infoagro](https://www.infoagro.com/aromaticas/oregano.htm) — Infoagro (España)
- **Longevidad** (🟡 7/10): Perenne. El cultivo mantiene vida útil productiva de unos 8-10 años; conviene renovar/dividir las matas cada varios años.
  - 📚 [Cómo cultivar orégano, tomillo y albahaca (contenido INTA)](https://supercampo.perfil.com/2019/11/como-cultivar-oregano-tomillo-y-albahaca/) — Supercampo / INTA; [El cultivo del orégano - Infoagro](https://www.infoagro.com/aromaticas/oregano.htm) — Infoagro (España)
- **Trucos** (🟡 7/10): Ubicarlo en el lugar más soleado (orientado al norte en el hemisferio sur) potencia el aroma. Multiplicarlo por división de matas o esquejes para plantas uniformes. Cosechar en floración para máxima concentración de aceites. Evitar el encharcamiento.
  - 📚 [Cómo cultivar orégano, tomillo y albahaca (contenido INTA)](https://supercampo.perfil.com/2019/11/como-cultivar-oregano-tomillo-y-albahaca/) — Supercampo / INTA
- **Riesgos / a evitar** (🟡 6/10): No tolera el encharcamiento (riesgo de pudriciones). La propagación por semilla da poblaciones heterogéneas (mejor multiplicación vegetativa). En sombra o suelos húmedos pierde aroma. Con los años las matas se aclaran y conviene dividirlas.
  - 📚 [Cómo cultivar orégano, tomillo y albahaca (contenido INTA)](https://supercampo.perfil.com/2019/11/como-cultivar-oregano-tomillo-y-albahaca/) — Supercampo / INTA; [El cultivo del orégano - Infoagro](https://www.infoagro.com/aromaticas/oregano.htm) — Infoagro (España)
- **Plagas y enfermedades** (🟡 5/10): Bastante rústico. Enfermedades fúngicas como Colletotrichum, Phytophthora y oídio (Erysiphe); ácaros y algunos artrópodos (p. ej. cicadélido Eupteryx decemnotata).
  - 📚 [El cultivo del orégano - Infoagro](https://www.infoagro.com/aromaticas/oregano.htm) — Infoagro (España)
- **Se asocia bien con** (🔴 3/10): En general es buen acompañante de la huerta como aromática repelente; se lo asocia con hortalizas de fruto (tomate, pimiento) y coles. No hallé una tabla técnica argentina específica.
  - 📚 [Asociaciones de cultivos en nuestra huerta - Fecoagro](https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/) — Fecoagro (Argentina)
- **Evitar cerca de** (🔴 1/10): Sin dato confiable en las fuentes consultadas.
  - 📚 _(sin fuente registrada)_

<a id="tomillo"></a>
## Tomillo  ·  *Thymus vulgaris*

- **Fecha/s de siembra** (🟡 6/10): En el GBA (hemisferio sur) se siembra/planta en primavera (aprox. septiembre-noviembre). Por semilla se puede iniciar a fines de invierno-principios de primavera en almácigo. La división de matas se hace de octubre a marzo. INTA (vía Infocampo) indica que 'las semillas pueden sembrarse directamente en el suelo o en macetas en primavera'; Botanical-online (España, hemisferio norte) coincide en 'finales de invierno o principios de primavera' para semillero y 'octubre a marzo' para división (fechas del hemisferio norte, adaptar restando 6 meses).
  - 📚 [Huerta en casa: cómo cultivar orégano y tomillo (contenido INTA)](https://www.infocampo.com.ar/huerta-en-casa-como-cultivar-oregano-y-tomillo/) — Infocampo (basado en INTA); [El cultivo del tomillo: cómo plantar y cuidados](https://www.botanical-online.com/cultivo/tomillo-como-plantar-cuidados) — Botanical-online (España, divulgativa)
- **Forma/s de siembra** (🟡 6/10): Se multiplica principalmente por esqueje (ramas jóvenes de ~10 cm enraizadas en agua o directas) y por división de matas cada dos años, que son los métodos más fiables. También admite siembra directa en suelo o maceta y almácigo en semillero (la semilla es pequeña y de germinación algo irregular). Para huerta urbana conviene comprar plantín o hacer esqueje antes que sembrar por semilla.
  - 📚 [Huerta en casa: cómo cultivar orégano y tomillo (contenido INTA)](https://www.infocampo.com.ar/huerta-en-casa-como-cultivar-oregano-y-tomillo/) — Infocampo (basado en INTA); [El cultivo del tomillo: cómo plantar y cuidados](https://www.botanical-online.com/cultivo/tomillo-como-plantar-cuidados) — Botanical-online (España, divulgativa)
- **Suelo** (🟡 6/10): 🟫 **`ARENOSO_DRENANTE`** (Arenoso / drenante) — Prefiere suelos pobres, sueltos, bien drenados y algo secos; conviene añadir arena para mejorar el drenaje. Evitar suelos con exceso de nutrientes. INTA (vía Infocampo): 'prefieren suelos pobres, bien drenados y algo secos'.
  - ⚠️ *Si no se cumple:* En suelos pesados, arcillosos o con exceso de riego/nutrientes se encharca y las raíces se pudren; la planta pierde aroma, se debilita y muere. El exceso de fertilidad genera crecimiento blando con menor concentración de aceites esenciales.
  - 📚 [Huerta en casa: cómo cultivar orégano y tomillo (contenido INTA)](https://www.infocampo.com.ar/huerta-en-casa-como-cultivar-oregano-y-tomillo/) — Infocampo (basado en INTA); [El cultivo del tomillo: cómo plantar y cuidados](https://www.botanical-online.com/cultivo/tomillo-como-plantar-cuidados) — Botanical-online (España, divulgativa)
- **Luz** (🟡 7/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Pleno sol. INTA (vía Infocampo) recomienda 'un lugar que reciba al menos 6 horas de luz solar directa al día'. Botanical-online: 'en lugar bien expuesto a la luz solar'. _(luz directa: mín 6 h, ideal >=6 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz se ahíla (tallos largos y débiles), pierde compacidad y aroma, disminuye la producción de aceites esenciales y se vuelve más susceptible a enfermedades por humedad.
  - 📚 [Huerta en casa: cómo cultivar orégano y tomillo (contenido INTA)](https://www.infocampo.com.ar/huerta-en-casa-como-cultivar-oregano-y-tomillo/) — Infocampo (basado en INTA)
- **Cosecha** (🟡 5/10): Se cosecha de forma escalonada durante buena parte del año, cortando ramitas; el mejor momento es antes o al inicio de floración, cuando el aroma es máximo. Conviene recortar las flores para que la planta concentre energía en producir hojas.
  - ✅ *Listo para cosechar:* Planta establecida y ramificada (a partir de unos meses/segundo período de crecimiento); brotes con hojas firmes y aromáticas; botones florales por abrir o inicio de floración indican el punto de mayor concentración aromática.
  - 📚 [Huerta en casa: cómo cultivar orégano y tomillo (contenido INTA)](https://www.infocampo.com.ar/huerta-en-casa-como-cultivar-oregano-y-tomillo/) — Infocampo (basado en INTA)
- **Germinación** (🔴 3/10): sin dato confiable en fuentes argentinas consultadas; en referencias generales de divulgación la germinación por semilla es lenta e irregular (aproximadamente 2-4 semanas), por lo que se prefiere esqueje o división.
  - 📚 [El cultivo del tomillo: cómo plantar y cuidados](https://www.botanical-online.com/cultivo/tomillo-como-plantar-cuidados) — Botanical-online (España, divulgativa)
- **Trasplante** (🔴 4/10): Cuando se hace por almácigo/esqueje, se trasplanta al lugar definitivo una vez que el plantín está bien enraizado y alcanza unos 10 cm. Botanical-online (hemisferio norte) indica trasplantar 'cuando la plántula haya alcanzado los 10 cm' (en su calendario, otoño; en GBA correspondería a fines de primavera-verano tras siembra de primavera).
  - 🌱 *Listo para trasplantar:* Plantín de ~10 cm, con varias ramitas, raíces que ocupan el cepellón y resisten un tironcito suave; esquejes con raíces visibles de 2-3 cm.
  - 📚 [El cultivo del tomillo: cómo plantar y cuidados](https://www.botanical-online.com/cultivo/tomillo-como-plantar-cuidados) — Botanical-online (España, divulgativa)
- **Longevidad** (🟡 6/10): Perenne (subarbusto semi-perenne). Vive y produce varios años; conviene renovar la planta por división cada 2 años aproximadamente para mantener vigor y evitar que se vuelva leñosa.
  - 📚 [Huerta en casa: cómo cultivar orégano y tomillo (contenido INTA)](https://www.infocampo.com.ar/huerta-en-casa-como-cultivar-oregano-y-tomillo/) — Infocampo (basado en INTA); [Las aromáticas en la huerta orgánica y su rol en el manejo de insectos](https://ciaorganico.net/documypublic/366_Aromaticas_y_su_rol_en_la_huerta.pdf) — CIA Orgánico (Argentina)
- **Trucos** (🟡 6/10): Regar solo cuando la capa superior del suelo está seca; agregar arena para mejorar drenaje. Recortar las flores para favorecer hoja. Dividir la mata cada dos años para rejuvenecerla. Por su porte semiperenne, ubicarlo en los extremos de los canteros/tablones donde no moleste al resto de la huerta.
  - 📚 [Huerta en casa: cómo cultivar orégano y tomillo (contenido INTA)](https://www.infocampo.com.ar/huerta-en-casa-como-cultivar-oregano-y-tomillo/) — Infocampo (basado en INTA); [Las aromáticas en la huerta orgánica y su rol en el manejo de insectos](https://ciaorganico.net/documypublic/366_Aromaticas_y_su_rol_en_la_huerta.pdf) — CIA Orgánico (Argentina)
- **Riesgos / a evitar** (🟡 6/10): Muy sensible al encharcamiento y al exceso de riego (pudrición de raíz); resistente al déficit hídrico. Evitar suelos ricos/abonados en exceso y sombra. Con los años tiende a lignificarse si no se poda/divide.
  - 📚 [Huerta en casa: cómo cultivar orégano y tomillo (contenido INTA)](https://www.infocampo.com.ar/huerta-en-casa-como-cultivar-oregano-y-tomillo/) — Infocampo (basado en INTA)
- **Plagas y enfermedades** (🔴 4/10): Es una planta rústica y poco afectada por plagas; su aroma repele varios insectos. En condiciones de exceso de humedad/mal drenaje el principal problema son las enfermedades fúngicas de raíz (pudriciones). Sin dato específico de plagas en fuentes argentinas consultadas.
  - 📚 [Huerta en casa: cómo cultivar orégano y tomillo (contenido INTA)](https://www.infocampo.com.ar/huerta-en-casa-como-cultivar-oregano-y-tomillo/) — Infocampo (basado en INTA)
- **Se asocia bien con** (🟡 5/10): Como labiada aromática cumple rol antialimentario, fungicida y nematicida en la huerta y protege a hortalizas vecinas; se ubica en bordes de canteros junto a otras aromáticas perennes (romero, salvia, lavanda). Repele plagas de las coles y hortalizas cercanas por su aroma.
  - 📚 [Las aromáticas en la huerta orgánica y su rol en el manejo de insectos](https://ciaorganico.net/documypublic/366_Aromaticas_y_su_rol_en_la_huerta.pdf) — CIA Orgánico (Argentina)
- **Evitar cerca de** (🔴 2/10): sin dato confiable. Por sus requerimientos opuestos (suelo seco y pobre) conviene no plantarlo junto a especies que exigen suelo permanentemente húmedo y muy fértil (por ejemplo menta o albahaca de riego frecuente), aunque no se halló fuente que lo indique explícitamente.
  - 📚 _(sin fuente registrada)_

<a id="romero"></a>
## Romero  ·  *Salvia rosmarinus (sin. Rosmarinus officinalis)*

- **Fecha/s de siembra** (🟡 6/10): Se propaga sobre todo por gajo/estaca a fines del invierno o a fines del verano (cuando la planta está en flor). Como aromática perenne, el calendario de siembra argentino (UNIDA) la recomienda para la temporada primavera-verano. En GBA conviene plantar plantines o gajos en primavera (sep-nov) o fines de verano-otoño temprano.
  - 📚 [Aromas de la huerta: Romero](https://municipalidadvgb.gob.ar/aromas-de-la-huerta-romero/) — Municipalidad de Villa Gesell; [Calendarios de Siembra (aptos zona geográfica Argentina)](https://www.unida.org.ar/Virtuales/Huerta/Calendarios%20de%20Siembra.pdf) — UNIDA (Argentina)
- **Forma/s de siembra** (🟡 7/10): Se multiplica principalmente por esqueje/estaca (gajos de ~20 cm con punta floral, enterrando dos terceras partes) porque es rápido y económico; también por semilla de buenos ejemplares, pero la germinación es lenta e irregular. Para huerta se recomienda plantín o gajo, no siembra directa por semilla.
  - 📚 [Aromas de la huerta: Romero](https://municipalidadvgb.gob.ar/aromas-de-la-huerta-romero/) — Municipalidad de Villa Gesell; [Romero: propiedades, cómo cultivarlo y aprovecharlo en la huerta](https://www.infocampo.com.ar/romero-propiedades-como-cultivarlo-y-aprovecharlo-en-la-huerta/) — Infocampo
- **Suelo** (🟡 7/10): 🟫 **`ARENOSO_DRENANTE`** (Arenoso / drenante) — Prefiere suelo arenoso, suelto y bastante seco, con muy buen drenaje; tolera suelos pobres y es muy resistente a la sequía. No tolera el encharcamiento. Se le pueden agregar cenizas de madera y cáscara de huevo.
  - ⚠️ *Si no se cumple:* En suelos pesados o mal drenados con exceso de agua se pudren las raíces y la planta se enferma o muere; el exceso de agua es el error más común y más perjudicial en el romero.
  - 📚 [Aromas de la huerta: Romero](https://municipalidadvgb.gob.ar/aromas-de-la-huerta-romero/) — Municipalidad de Villa Gesell; [Romero: propiedades, cómo cultivarlo y aprovecharlo en la huerta](https://www.infocampo.com.ar/romero-propiedades-como-cultivarlo-y-aprovecharlo-en-la-huerta/) — Infocampo
- **Luz** (🟢 8/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Pleno sol. Infocampo: 'Requiere al menos 6 horas de sol directo al día.' _(luz directa: mín 6 h, ideal >=6 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con sombra o poca luz crece débil y ahilado, florece poco, pierde aroma y aceites esenciales y se vuelve más propenso a hongos por menor ventilación/secado.
  - 📚 [Romero: propiedades, cómo cultivarlo y aprovecharlo en la huerta](https://www.infocampo.com.ar/romero-propiedades-como-cultivarlo-y-aprovecharlo-en-la-huerta/) — Infocampo
- **Cosecha** (🟡 6/10): Las ramas pueden cosecharse en cualquier época del año una vez la planta está establecida; las hojas se recogen desde el segundo año en adelante, siendo el final del verano un momento ideal. Las flores se cosechan al abrirse y se secan a la sombra.
  - ✅ *Listo para cosechar:* Planta establecida (a partir del segundo año); ramas firmes y aromáticas; para flores, cuando los pimpollos comienzan a abrir. Cortar ramitas de los extremos sin dejar la planta desnuda.
  - 📚 [Aromas de la huerta: Romero](https://municipalidadvgb.gob.ar/aromas-de-la-huerta-romero/) — Municipalidad de Villa Gesell; [Romero: propiedades, cómo cultivarlo y aprovecharlo en la huerta](https://www.infocampo.com.ar/romero-propiedades-como-cultivarlo-y-aprovecharlo-en-la-huerta/) — Infocampo
- **Germinación** (🔴 3/10): sin dato confiable en fuentes argentinas consultadas; la semilla germina de forma lenta e irregular, motivo por el cual se prefiere la multiplicación por gajo/esqueje.
  - 📚 [Aromas de la huerta: Romero](https://municipalidadvgb.gob.ar/aromas-de-la-huerta-romero/) — Municipalidad de Villa Gesell
- **Trasplante** (🟡 5/10): Los gajos se mantienen con tierra húmeda (no anegada) para favorecer el enraizado y luego se trasplantan al lugar definitivo. Se lleva a cantero/maceta grande cuando la estaca ha enraizado bien (raíces desarrolladas, brotes nuevos).
  - 🌱 *Listo para trasplantar:* Estaca con raíces formadas y emisión de brotes nuevos; resistencia al tironcito suave; plantín que ya no marchita al sol.
  - 📚 [Aromas de la huerta: Romero](https://municipalidadvgb.gob.ar/aromas-de-la-huerta-romero/) — Municipalidad de Villa Gesell
- **Longevidad** (🟡 7/10): Perenne: es un arbusto que vive muchos años (varios años a más de una década) y produce follaje todo el año una vez establecido. Conviene podar regularmente para evitar que se vuelva demasiado leñoso.
  - 📚 [Romero: propiedades, cómo cultivarlo y aprovecharlo en la huerta](https://www.infocampo.com.ar/romero-propiedades-como-cultivarlo-y-aprovecharlo-en-la-huerta/) — Infocampo; [Las aromáticas en la huerta orgánica y su rol en el manejo de insectos](https://ciaorganico.net/documypublic/366_Aromaticas_y_su_rol_en_la_huerta.pdf) — CIA Orgánico (Argentina)
- **Trucos** (🟡 6/10): Regar poco (prefiere sequía); podar regularmente para que no se vuelva leñoso y para dar forma. Multiplicar por gajo con punta floral es el método más eficaz. Por su gran porte adulto (planta de 2-3 años) ubicarlo en los extremos de los tablones. Atrae abejas y polinizadores.
  - 📚 [Romero: propiedades, cómo cultivarlo y aprovecharlo en la huerta](https://www.infocampo.com.ar/romero-propiedades-como-cultivarlo-y-aprovecharlo-en-la-huerta/) — Infocampo; [Las aromáticas en la huerta orgánica y su rol en el manejo de insectos](https://ciaorganico.net/documypublic/366_Aromaticas_y_su_rol_en_la_huerta.pdf) — CIA Orgánico (Argentina)
- **Riesgos / a evitar** (🟡 6/10): El principal riesgo es el exceso de riego y el suelo mal drenado (pudrición de raíz); es muy resistente a la sequía, así que conviene 'errar' hacia seco. Sin poda, se lignifica y baja la calidad del follaje.
  - 📚 [Romero: propiedades, cómo cultivarlo y aprovecharlo en la huerta](https://www.infocampo.com.ar/romero-propiedades-como-cultivarlo-y-aprovecharlo-en-la-huerta/) — Infocampo; [Aromas de la huerta: Romero](https://municipalidadvgb.gob.ar/aromas-de-la-huerta-romero/) — Municipalidad de Villa Gesell
- **Plagas y enfermedades** (🔴 4/10): Planta rústica y poco atacada; su aroma ayuda a repeler insectos. El problema más frecuente son las pudriciones de raíz por hongos ante exceso de humedad. Sin dato específico de plagas de insectos en fuentes argentinas consultadas.
  - 📚 [Romero: propiedades, cómo cultivarlo y aprovecharlo en la huerta](https://www.infocampo.com.ar/romero-propiedades-como-cultivarlo-y-aprovecharlo-en-la-huerta/) — Infocampo
- **Se asocia bien con** (🟡 7/10): Se asocia bien con repollo/coles y zanahoria: repele la mosca de la zanahoria y la oruga (mariposa) del repollo, y junto a repollo y salvia repele dípteros en general. Atrae abejas e insectos benéficos para control biológico. Combina con otras aromáticas perennes (ruda, salvia, melisa, lavanda) en cercos vivos y bordes de cantero.
  - 📚 [Aromas de la huerta: Romero](https://municipalidadvgb.gob.ar/aromas-de-la-huerta-romero/) — Municipalidad de Villa Gesell; [Las aromáticas en la huerta orgánica y su rol en el manejo de insectos](https://ciaorganico.net/documypublic/366_Aromaticas_y_su_rol_en_la_huerta.pdf) — CIA Orgánico (Argentina)
- **Evitar cerca de** (🔴 2/10): sin dato confiable en fuentes consultadas. Por requerir suelo seco y drenado, evitar plantarlo junto a especies de riego frecuente y suelo húmedo (como la menta), aunque no se halló fuente explícita.
  - 📚 _(sin fuente registrada)_

<a id="salvia"></a>
## Salvia  ·  *Salvia officinalis*

- **Fecha/s de siembra** (🟡 6/10): En primavera (hemisferio sur, aprox. septiembre-noviembre). La semillería argentina La Rural indica siembra en 'Primavera' y ciclo 'Perenne'; el calendario de siembra argentino (UNIDA) la recomienda como aromática de la temporada primavera-verano.
  - 📚 [Salvia (Salvia officinalis) - ficha](https://semillasrural.com.ar/tienda/semillas/semillas-horticolas/semillas-a-granel/salvia-salvia-officinalis/) — La Rural Semillería (Argentina); [Calendarios de Siembra (aptos zona geográfica Argentina)](https://www.unida.org.ar/Virtuales/Huerta/Calendarios%20de%20Siembra.pdf) — UNIDA (Argentina)
- **Forma/s de siembra** (🟡 5/10): Admite siembra directa en primavera (indicado por La Rural Semillería) y también almácigo para luego trasplantar; se multiplica muy bien por esqueje y por división de mata. Para asegurar plantas, muchos prefieren plantín o esqueje antes que semilla.
  - 📚 [Salvia (Salvia officinalis) - ficha](https://semillasrural.com.ar/tienda/semillas/semillas-horticolas/semillas-a-granel/salvia-salvia-officinalis/) — La Rural Semillería (Argentina); [Cultivo de Salvia officinalis en el huerto](https://www.agromatica.es/cultivo-de-salvia-en-el-huerto/) — Agromática (España, divulgativa)
- **Suelo** (🟡 6/10): 🟫 **`ARENOSO_DRENANTE`** (Arenoso / drenante) — Prefiere suelos sueltos, soleados y bien drenados, con fracción arenosa y tendencia a la alcalinidad. No tolera bien suelos pesados o arcillosos. La Rural: 'prefiere suelos sueltos, soleados'.
  - ⚠️ *Si no se cumple:* En suelos pesados/arcillosos o con exceso de humedad se encharca y la raíz se pudre; la planta se debilita, pierde aroma y es más sensible a hongos.
  - 📚 [Salvia (Salvia officinalis) - ficha](https://semillasrural.com.ar/tienda/semillas/semillas-horticolas/semillas-a-granel/salvia-salvia-officinalis/) — La Rural Semillería (Argentina); [Cultivo de Salvia officinalis en el huerto](https://www.agromatica.es/cultivo-de-salvia-en-el-huerto/) — Agromática (España, divulgativa)
- **Luz** (🟡 6/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Pleno sol (plena exposición solar); tolera algo de semisombra pero se desarrolla mejor a pleno sol. Agromática: 'tiene preferencia a plena exposición solar, aunque puede crecer en semisombra'. _(luz directa: mín 4-6 h, ideal >=6 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz se ahíla, crece débil, produce menos hojas y aceites esenciales y es más susceptible a enfermedades fúngicas por menor ventilación.
  - 📚 [Cultivo de Salvia officinalis en el huerto](https://www.agromatica.es/cultivo-de-salvia-en-el-huerto/) — Agromática (España, divulgativa); [Salvia (Salvia officinalis) - ficha](https://semillasrural.com.ar/tienda/semillas/semillas-horticolas/semillas-a-granel/salvia-salvia-officinalis/) — La Rural Semillería (Argentina)
- **Cosecha** (🟡 5/10): No conviene cosechar hasta el segundo año, cuando la planta está bien establecida; luego se cortan hojas frescas según necesidad y se pueden secar en ramilletes en lugar aireado, cálido y seco.
  - ✅ *Listo para cosechar:* Planta establecida (a partir del segundo año); hojas grandes, firmes, aterciopeladas y aromáticas. Cosechar antes de la floración para mayor calidad de hoja.
  - 📚 [Cultivo de Salvia officinalis en el huerto](https://www.agromatica.es/cultivo-de-salvia-en-el-huerto/) — Agromática (España, divulgativa)
- **Germinación** (🔴 2/10): sin dato confiable en fuentes argentinas consultadas; en referencias de divulgación la semilla de salvia suele germinar en torno a 2-3 semanas.
  - 📚 _(sin fuente registrada)_
- **Trasplante** (🔴 3/10): Si se hace por almácigo, se trasplanta cuando el plantín tiene varias hojas verdaderas y está bien enraizado (habitualmente algunas semanas tras la emergencia). Dato aproximado; no se halló fuente argentina que precise plazos.
  - 🌱 *Listo para trasplantar:* Plantín con 4-6 hojas verdaderas y buen cepellón/raíces; resiste el tironcito suave sin desarmarse.
  - 📚 [Cultivo de Salvia officinalis en el huerto](https://www.agromatica.es/cultivo-de-salvia-en-el-huerto/) — Agromática (España, divulgativa)
- **Longevidad** (🟡 6/10): Perenne. Vive varios años produciendo follaje; con el tiempo se lignifica en la base, por lo que suele renovarse cada pocos años por esqueje o división. La Rural indica ciclo 'Perenne'.
  - 📚 [Salvia (Salvia officinalis) - ficha](https://semillasrural.com.ar/tienda/semillas/semillas-horticolas/semillas-a-granel/salvia-salvia-officinalis/) — La Rural Semillería (Argentina)
- **Trucos** (🟡 5/10): Regar con moderación (soporta sequía; 1 a 3 riegos semanales según clima/estación). Plantarla algo apartada del huerto principal por su porte y carácter expansivo. Cosechar antes de floración para hoja de calidad; podar para mantenerla compacta.
  - 📚 [Cultivo de Salvia officinalis en el huerto](https://www.agromatica.es/cultivo-de-salvia-en-el-huerto/) — Agromática (España, divulgativa)
- **Riesgos / a evitar** (🟡 5/10): Sensible al exceso de agua y suelos pesados (pudrición de raíz). Puede resultar expansiva/vigorosa, por lo que conviene ubicarla ligeramente apartada del huerto principal. Con los años se vuelve leñosa si no se renueva.
  - 📚 [Cultivo de Salvia officinalis en el huerto](https://www.agromatica.es/cultivo-de-salvia-en-el-huerto/) — Agromática (España, divulgativa)
- **Plagas y enfermedades** (🔴 4/10): Como labiada aromática es antialimentaria, fungicida y nematicida, por lo que suele ser poco atacada; el riesgo principal son hongos por exceso de humedad. Sin dato específico de plagas de insectos en fuentes argentinas consultadas.
  - 📚 [Las aromáticas en la huerta orgánica y su rol en el manejo de insectos](https://ciaorganico.net/documypublic/366_Aromaticas_y_su_rol_en_la_huerta.pdf) — CIA Orgánico (Argentina)
- **Se asocia bien con** (🟡 6/10): Se asocia bien con repollo/coles y zanahoria: junto a repollo y romero repele dípteros, y la combinación salvia + repollo + zanahoria combate dípteros (moscas). Buena compañera de otras aromáticas perennes (romero, lavanda, melisa) en bordes de cantero.
  - 📚 [Las aromáticas en la huerta orgánica y su rol en el manejo de insectos](https://ciaorganico.net/documypublic/366_Aromaticas_y_su_rol_en_la_huerta.pdf) — CIA Orgánico (Argentina)
- **Evitar cerca de** (🔴 2/10): sin dato confiable en fuentes consultadas. Por su porte y vigor conviene no apretarla contra hortalizas pequeñas y, por requerir suelo drenado, evitar asociarla con especies de riego muy frecuente (como la menta); no se halló fuente explícita.
  - 📚 _(sin fuente registrada)_

<a id="menta"></a>
## Menta  ·  *Mentha spp. (p. ej. Mentha x piperita, Mentha spicata)*

- **Fecha/s de siembra** (🟡 5/10): Se planta/propaga sobre todo en primavera (hemisferio sur, sep-nov). Los esquejes se hacen a fines de invierno-principios de primavera; estolones en primavera o principios de otoño; rizomas en otoño. Rara vez por semilla (las mentas hibridan fácilmente y no salen fieles). Fechas de esqueje/estolón tomadas de fuente del hemisferio norte (Botanical-online): en GBA equivalen a fines de invierno-primavera / otoño.
  - 📚 [El cultivo de la menta piperita](https://www.botanical-online.com/cultivo/menta-como-plantar-cuidados) — Botanical-online (España, divulgativa); [El sembrado y cuidado de la menta en la huerta en casa](https://infoagro.com.ar/el-sembrado-y-cuidado-de-la-menta-en-la-huerta-en-casa/) — Infoagro Argentina
- **Forma/s de siembra** (🟡 7/10): Se multiplica vegetativamente: por esqueje (tallo sumergido en agua unos días hasta que emite raíces), por estolones y por rizomas/división de mata. La siembra por semilla no es recomendable porque las mentas hibridan y no reproducen fielmente la planta madre. Lo habitual y más fiable es plantín o esqueje.
  - 📚 [El sembrado y cuidado de la menta en la huerta en casa](https://infoagro.com.ar/el-sembrado-y-cuidado-de-la-menta-en-la-huerta-en-casa/) — Infoagro Argentina; [El cultivo de la menta piperita](https://www.botanical-online.com/cultivo/menta-como-plantar-cuidados) — Botanical-online (España, divulgativa)
- **Suelo** (🟡 6/10): 🟦 **`HUMEDO_RICO`** (Húmedo y rico) — Suelo fértil, rico en materia orgánica y húmedo, capaz de retener humedad pero con buen drenaje; pH entre 6,5 y 7,5. Requiere bastante abono orgánico. En maceta, tierra negra con sustrato y buen aporte de nutrientes.
  - ⚠️ *Si no se cumple:* En suelo seco o pobre la menta se marchita, crece raquítica y con hojas pequeñas y poco aromáticas; si el suelo se satura de agua (encharcamiento) las raíces se pudren.
  - 📚 [El cultivo de la menta piperita](https://www.botanical-online.com/cultivo/menta-como-plantar-cuidados) — Botanical-online (España, divulgativa); [El sembrado y cuidado de la menta en la huerta en casa](https://infoagro.com.ar/el-sembrado-y-cuidado-de-la-menta-en-la-huerta-en-casa/) — Infoagro Argentina
- **Luz** (🟡 6/10): ⛅ **`MEDIA_SOMBRA`** (Media sombra) — Media sombra / semisombra. Fuente argentina (Infoagro): el sol directo puede quemar y marchitar sus hojas, por lo que se recomienda semisombra o luz tamizada. Botanical-online admite 'al sol o en semisombra', pero necesita veranos cálidos y luminosos para producir buen mentol. En el GBA, con veranos intensos, conviene media sombra. _(luz directa: mín 2-4 h, ideal 4-6 (luz tamizada; evitar sol fuerte del mediodía en verano) h; sin sol directo: sí)_
  - ⚠️ *Si no se cumple:* A pleno sol fuerte y sin humedad suficiente las hojas se queman y la planta se marchita; con demasiada sombra se ahíla y crece débil, con hojas menos aromáticas.
  - 📚 [El sembrado y cuidado de la menta en la huerta en casa](https://infoagro.com.ar/el-sembrado-y-cuidado-de-la-menta-en-la-huerta-en-casa/) — Infoagro Argentina; [El cultivo de la menta piperita](https://www.botanical-online.com/cultivo/menta-como-plantar-cuidados) — Botanical-online (España, divulgativa)
- **Cosecha** (🟡 5/10): Se cosechan hojas y tallos de forma escalonada durante la temporada de crecimiento (de mediados de primavera a principios de otoño), cortando cuando la planta empieza a florecer, momento de mayor aroma. Para uso fresco se corta según necesidad.
  - ✅ *Listo para cosechar:* Plantas de buen porte con tallos frondosos; inicio de floración (máximo aroma); en general se puede empezar a cortar pocas semanas/meses después de plantar el esqueje, una vez bien establecida.
  - 📚 [El cultivo de la menta piperita](https://www.botanical-online.com/cultivo/menta-como-plantar-cuidados) — Botanical-online (España, divulgativa); [El sembrado y cuidado de la menta en la huerta en casa](https://infoagro.com.ar/el-sembrado-y-cuidado-de-la-menta-en-la-huerta-en-casa/) — Infoagro Argentina
- **Germinación** (🟡 5/10): No aplica en la práctica: la menta se propaga vegetativamente (esqueje, estolón, rizoma). La semilla es poco confiable porque las mentas hibridan fácilmente. Los esquejes emiten raíces en agua en pocos días.
  - 📚 [El sembrado y cuidado de la menta en la huerta en casa](https://infoagro.com.ar/el-sembrado-y-cuidado-de-la-menta-en-la-huerta-en-casa/) — Infoagro Argentina; [El cultivo de la menta piperita](https://www.botanical-online.com/cultivo/menta-como-plantar-cuidados) — Botanical-online (España, divulgativa)
- **Trasplante** (🟡 6/10): El esqueje se mantiene con el tallo inferior sumergido en agua durante algunos días hasta que desarrolla raíces, y recién entonces se trasplanta a maceta o suelo. Se lleva a su lugar definitivo cuando el esqueje ya tiene raíces formadas.
  - 🌱 *Listo para trasplantar:* Esqueje con raíces visibles (varios milímetros a centímetros) y, preferentemente, algún brote nuevo; plantín que no marchita tras el trasplante.
  - 📚 [El sembrado y cuidado de la menta en la huerta en casa](https://infoagro.com.ar/el-sembrado-y-cuidado-de-la-menta-en-la-huerta-en-casa/) — Infoagro Argentina
- **Longevidad** (🟡 6/10): Perenne (herbácea). Rebrota año tras año desde sus rizomas/estolones y se expande rápidamente; con la temporada fría puede perder parte aérea y rebrotar en primavera. Se propaga con mucha facilidad.
  - 📚 [El cultivo de la menta piperita](https://www.botanical-online.com/cultivo/menta-como-plantar-cuidados) — Botanical-online (España, divulgativa); [El sembrado y cuidado de la menta en la huerta en casa](https://infoagro.com.ar/el-sembrado-y-cuidado-de-la-menta-en-la-huerta-en-casa/) — Infoagro Argentina
- **Trucos** (🟡 6/10): Cultivar en maceta o contenedor (o con barrera/limitador enterrado) para controlar su carácter invasivo. Mantener la tierra húmeda y ubicarla en media sombra para que no se quemen las hojas. Regar un par de veces antes del primer corte y cada ~10 días entre cortes sucesivos. Cortar antes/al inicio de floración para estimular nuevos brotes tiernos.
  - 📚 [El cultivo de la menta piperita](https://www.botanical-online.com/cultivo/menta-como-plantar-cuidados) — Botanical-online (España, divulgativa); [El sembrado y cuidado de la menta en la huerta en casa](https://infoagro.com.ar/el-sembrado-y-cuidado-de-la-menta-en-la-huerta-en-casa/) — Infoagro Argentina
- **Riesgos / a evitar** (🟡 7/10): Es una planta invasiva: se reproduce rápidamente por estolones/rizomas y puede invadir el resto de la huerta, por lo que debe contenerse (maceta/contenedor o barrera). No tolera el encharcamiento (pudre raíces) ni el sol directo fuerte (quema hojas).
  - 📚 [El sembrado y cuidado de la menta en la huerta en casa](https://infoagro.com.ar/el-sembrado-y-cuidado-de-la-menta-en-la-huerta-en-casa/) — Infoagro Argentina; [El cultivo de la menta piperita](https://www.botanical-online.com/cultivo/menta-como-plantar-cuidados) — Botanical-online (España, divulgativa)
- **Plagas y enfermedades** (🟡 6/10): Los pulgones (áfidos) son la plaga más común. Otras plagas: nematodos, lepidópteros, cigarras, hormigas, pulgones lanígeros y coleópteros. Enfermedades principales: roya de la menta (Puccinia menthae), con manchas amarillas que viran a marrón, y manchas foliares por Phyllosticta menthae.
  - 📚 [El sembrado y cuidado de la menta en la huerta en casa](https://infoagro.com.ar/el-sembrado-y-cuidado-de-la-menta-en-la-huerta-en-casa/) — Infoagro Argentina; [El cultivo de la menta piperita](https://www.botanical-online.com/cultivo/menta-como-plantar-cuidados) — Botanical-online (España, divulgativa)
- **Se asocia bien con** (🟡 6/10): Se asocia bien con el repollo y demás coles: la combinación menta + repollo repele la mariposa (oruga) de las coles. En general su aroma ahuyenta plagas de hortalizas vecinas.
  - 📚 [Las aromáticas en la huerta orgánica y su rol en el manejo de insectos](https://ciaorganico.net/documypublic/366_Aromaticas_y_su_rol_en_la_huerta.pdf) — CIA Orgánico (Argentina)
- **Evitar cerca de** (🔴 4/10): Por su carácter invasivo conviene NO plantarla en cantero abierto junto a otras hortalizas y aromáticas (las tapa y ahoga por sus estolones); mantenerla siempre confinada en maceta/contenedor. Además, por su necesidad de suelo húmedo y sombra, es mala compañera de aromáticas de suelo seco y pleno sol (romero, tomillo, salvia). Riesgo de invasión documentado; asociación específica desaconsejada inferida de sus requerimientos opuestos.
  - 📚 [El sembrado y cuidado de la menta en la huerta en casa](https://infoagro.com.ar/el-sembrado-y-cuidado-de-la-menta-en-la-huerta-en-casa/) — Infoagro Argentina; [El cultivo de la menta piperita](https://www.botanical-online.com/cultivo/menta-como-plantar-cuidados) — Botanical-online (España, divulgativa)

<a id="melisa-toronjil"></a>
## Melisa (toronjil)  ·  *Melissa officinalis L.*

- **Fecha/s de siembra** (🟡 6/10): En almácigo en primavera a campo (aprox. sep-nov en GBA), o en otoño-invierno bajo invernadero; también se propaga por división de matas en otoño o principio de primavera. Herbotecnia no da meses exactos para Argentina, por lo que las fechas para GBA son una adaptación al clima templado local.
  - 📚 [Cultivo de Melisa (Melissa officinalis) y usos](http://www.herbotecnia.com.ar/exo-melisa.html) — Herbotecnia (Argentina)
- **Forma/s de siembra** (🟢 8/10): Almácigo (poder germinativo bajo, 30-40%) y luego trasplante de plántulas de 10-15 cm; también por división de matas, que es más segura y rápida. No conviene siembra directa por la baja y despareja germinación.
  - 📚 [Cultivo de Melisa (Melissa officinalis) y usos](http://www.herbotecnia.com.ar/exo-melisa.html) — Herbotecnia (Argentina)
- **Suelo** (🟢 8/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Suelos de consistencia media, profundos, frescos y fértiles (tierras de aluvión), sin acumulación de humedad. En suelos secos y arenosos el rendimiento es bajo.
  - ⚠️ *Si no se cumple:* En suelos secos, arenosos o pobres el rendimiento de hoja es bajo; con drenaje deficiente y humedad acumulada aparecen enfermedades fúngicas (Septoria).
  - 📚 [Cultivo de Melisa (Melissa officinalis) y usos](http://www.herbotecnia.com.ar/exo-melisa.html) — Herbotecnia (Argentina)
- **Luz** (🟡 7/10): 🌤️ **`SOL_PARCIAL`** (Sol parcial) — Clima templado a templado-cálido; sensible a heladas y fríos intensos. No requiere elevada heliofanía, por lo que tolera algo de media sombra. _(luz directa: mín 4 h, ideal 6 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con muy poca luz se ahíla (tallos débiles y largos) y baja la concentración de aceites esenciales/aroma; a pleno sol intenso y seco puede sufrir estrés hídrico.
  - 📚 [Cultivo de Melisa (Melissa officinalis) y usos](http://www.herbotecnia.com.ar/exo-melisa.html) — Herbotecnia (Argentina)
- **Cosecha** (🟡 7/10): Se cosecha cortando los tallos cerca del suelo, previo a la floración. El primer año se hace un solo corte; en años posteriores dos cortes anuales (primavera y otoño).
  - ✅ *Listo para cosechar:* Planta bien desarrollada y frondosa, antes de que abran las flores (máximo aroma); hojas verdes y turgentes.
  - 📚 [Cultivo de Melisa (Melissa officinalis) y usos](http://www.herbotecnia.com.ar/exo-melisa.html) — Herbotecnia (Argentina)
- **Germinación** (🟡 5/10): Germinación lenta y despareja; poder germinativo promedio bajo (30-40%). No se especifica cantidad exacta de días en la fuente argentina (referencias generales indican 2-3 semanas).
  - 📚 [Cultivo de Melisa (Melissa officinalis) y usos](http://www.herbotecnia.com.ar/exo-melisa.html) — Herbotecnia (Argentina)
- **Trasplante** (🟢 8/10): Se trasplanta cuando las plántulas alcanzan 10-15 cm de altura, a un marco de 0,70 m entre líneas y 0,30-0,40 m entre plantas.
  - 🌱 *Listo para trasplantar:* Plántula de 10-15 cm, con varias hojas verdaderas y buen sistema radicular.
  - 📚 [Cultivo de Melisa (Melissa officinalis) y usos](http://www.herbotecnia.com.ar/exo-melisa.html) — Herbotecnia (Argentina)
- **Longevidad** (🟢 8/10): Perenne; una plantación permanece productiva en el mismo sitio alrededor de 3 a 4 años.
  - 📚 [Cultivo de Melisa (Melissa officinalis) y usos](http://www.herbotecnia.com.ar/exo-melisa.html) — Herbotecnia (Argentina)
- **Trucos** (🟡 7/10): Propagar por división de matas para evitar la germinación lenta; mantener el suelo fresco pero sin encharcar; cosechar antes de floración para máximo aroma; podar los cortes estimula rebrote. Se adapta bien a cultivo en macetas y muros verdes.
  - 📚 [Cultivo de Melisa (Melissa officinalis) y usos](http://www.herbotecnia.com.ar/exo-melisa.html) — Herbotecnia (Argentina); [Mi casa, mi huerta - Técnicas de agricultura urbana](https://www.magyp.gob.ar/sitio/areas/nuestra-huerta/pdf/mi-casa-mi-huerta.pdf) — Ministerio de Agricultura, Ganadería y Pesca de la Nación (MAGyP)
- **Riesgos / a evitar** (🟡 7/10): Sensible a heladas y fríos intensos (proteger en invierno GBA); no tolera suelos secos/arenosos ni humedad acumulada. Puede volverse invasora por semilla y rizomas si no se controla.
  - 📚 [Cultivo de Melisa (Melissa officinalis) y usos](http://www.herbotecnia.com.ar/exo-melisa.html) — Herbotecnia (Argentina)
- **Plagas y enfermedades** (🟢 8/10): Ácaros (arañuela roja, Tetranychus sp.) en condiciones secas y calurosas; enfermedad fúngica por Septoria en suelos con humedad acumulada.
  - 📚 [Cultivo de Melisa (Melissa officinalis) y usos](http://www.herbotecnia.com.ar/exo-melisa.html) — Herbotecnia (Argentina)
- **Se asocia bien con** (🔴 3/10): Como aromática, atrae polinizadores (abejas) y insectos benéficos, por lo que es buena compañera en el borde de la huerta y cerca de hortalizas de fruto. Sin dato específico en fuente oficial argentina para pares concretos.
  - 📚 [Asociaciones de cultivos en nuestra huerta](https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/) — Fecoagro (Argentina)
- **Evitar cerca de** (🔴 1/10): Sin dato confiable en fuentes argentinas para asociaciones desfavorables específicas.
  - 📚 _(sin fuente registrada)_

<a id="ciboulette-cebollin"></a>
## Ciboulette (cebollín)  ·  *Allium schoenoprasum L.*

- **Fecha/s de siembra** (🟡 6/10): Se siembra a fines de invierno y en primavera; también se puede producir en otoño. En GBA (templado): primavera (aprox. ago-nov) y otoño (mar-abr). La fuente consultada es argentina pero no fija meses exactos, por lo que las fechas locales son adaptadas.
  - 📚 [Ciboulette o cebollín: características, cultivo y reproducción](https://www.flordeplanta.com.ar/aromaticas/ciboulette-o-cebollin-caracteristicas-cultivo-y-reproduccion/) — Flor de Planta (Argentina)
- **Forma/s de siembra** (🟡 6/10): Por semilla (a unos 1-3 cm de profundidad, en almácigo o directa en línea) o, más práctico y rápido, por división de matas/bulbos con raíces. La división es el método más recomendado para asegurar plantas.
  - 📚 [Ciboulette o cebollín: características, cultivo y reproducción](https://www.flordeplanta.com.ar/aromaticas/ciboulette-o-cebollin-caracteristicas-cultivo-y-reproduccion/) — Flor de Planta (Argentina)
- **Suelo** (🟡 6/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Prefiere suelos húmedos, fértiles, de constitución ligeramente arcillosa y con buena retención de humedad.
  - ⚠️ *Si no se cumple:* En suelos muy secos o pobres las matas crecen débiles, con hojas finas y menor rebrote tras el corte.
  - 📚 [Ciboulette o cebollín: características, cultivo y reproducción](https://www.flordeplanta.com.ar/aromaticas/ciboulette-o-cebollin-caracteristicas-cultivo-y-reproduccion/) — Flor de Planta (Argentina)
- **Luz** (🟡 6/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Requiere lugares bien soleados; tolera algo de media sombra pero rinde mejor a pleno sol. _(luz directa: mín 4 h, ideal 6 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz las hojas se ahílan (finas y pálidas), la mata se debilita y disminuye el rebrote y el aroma.
  - 📚 [Ciboulette o cebollín: características, cultivo y reproducción](https://www.flordeplanta.com.ar/aromaticas/ciboulette-o-cebollin-caracteristicas-cultivo-y-reproduccion/) — Flor de Planta (Argentina)
- **Cosecha** (🟡 5/10): Se cosechan las hojas (tallos huecos) cortándolas cerca de la base una vez que la mata está establecida; rebrota varias veces. Cosecha escalonada durante toda la temporada. Tiempo exacto desde siembra no especificado (referencias generales: 60-90 días).
  - ✅ *Listo para cosechar:* Hojas de unos 15-20 cm de alto, verdes y firmes; cortar dejando 3-5 cm para que rebrote.
  - 📚 [Ciboulette o cebollín: características, cultivo y reproducción](https://www.flordeplanta.com.ar/aromaticas/ciboulette-o-cebollin-caracteristicas-cultivo-y-reproduccion/) — Flor de Planta (Argentina)
- **Germinación** (🟡 6/10): Las semillas germinan dentro de los 10 días siguientes a la siembra.
  - 📚 [Ciboulette o cebollín: características, cultivo y reproducción](https://www.flordeplanta.com.ar/aromaticas/ciboulette-o-cebollin-caracteristicas-cultivo-y-reproduccion/) — Flor de Planta (Argentina)
- **Trasplante** (🟡 5/10): Si se hace por semilla en almácigo, se trasplanta en matas cuando los plantines tienen varias hojas y buen porte; también se plantan directamente los bulbos/matas divididas. Es planta perenne que se puede dividir cada 2-3 años.
  - 🌱 *Listo para trasplantar:* Plantín con varios tallos de tamaño manejable (varios cm) y raíces desarrolladas.
  - 📚 [Ciboulette o cebollín: características, cultivo y reproducción](https://www.flordeplanta.com.ar/aromaticas/ciboulette-o-cebollin-caracteristicas-cultivo-y-reproduccion/) — Flor de Planta (Argentina)
- **Longevidad** (🟡 7/10): Perenne; la mata rebrota y se cosecha durante años. En invierno la parte aérea puede secarse y rebrota en primavera.
  - 📚 [Ciboulette o cebollín: características, cultivo y reproducción](https://www.flordeplanta.com.ar/aromaticas/ciboulette-o-cebollin-caracteristicas-cultivo-y-reproduccion/) — Flor de Planta (Argentina)
- **Trucos** (🟡 6/10): Reproducir por división de matas para plantas rápidas y vigorosas; mantener humedad constante; cortar seguido estimula el rebrote de hojas tiernas. A inicios de otoño se puede desenterrar la mata, dejar secar y replantar en maceta en lugar soleado para cosechar en invierno. Se cultiva muy bien en macetas y jardineras (sembrar a poca profundidad).
  - 📚 [Ciboulette o cebollín: características, cultivo y reproducción](https://www.flordeplanta.com.ar/aromaticas/ciboulette-o-cebollin-caracteristicas-cultivo-y-reproduccion/) — Flor de Planta (Argentina); [Mi casa, mi huerta - Técnicas de agricultura urbana](https://www.magyp.gob.ar/sitio/areas/nuestra-huerta/pdf/mi-casa-mi-huerta.pdf) — Ministerio de Agricultura, Ganadería y Pesca de la Nación (MAGyP)
- **Riesgos / a evitar** (🟡 5/10): Evitar suelos secos y encharcamiento; la floración (bola lila) endurece las hojas, conviene cortar los escapos florales para mantener hoja tierna. Como todos los Allium, exceso de humedad favorece pudriciones de bulbo.
  - 📚 [Ciboulette o cebollín: características, cultivo y reproducción](https://www.flordeplanta.com.ar/aromaticas/ciboulette-o-cebollin-caracteristicas-cultivo-y-reproduccion/) — Flor de Planta (Argentina)
- **Plagas y enfermedades** (🟡 5/10): Resiste bien a plagas (efecto repelente propio de los Allium); en exceso de humedad puede sufrir hongos (mildiu/pudriciones) y ataques puntuales de trips o mosca de la cebolla. Sin detalle específico en la fuente argentina.
  - 📚 [Ciboulette o cebollín: características, cultivo y reproducción](https://www.flordeplanta.com.ar/aromaticas/ciboulette-o-cebollin-caracteristicas-cultivo-y-reproduccion/) — Flor de Planta (Argentina)
- **Se asocia bien con** (🔴 4/10): Como Allium aromático, funciona bien intercalado con zanahoria, tomate y coles, ayudando a repeler plagas (efecto repelente de las aromáticas). Nota: dato general de asociación de aromáticas/cebollas, no específico de ciboulette en fuente oficial argentina.
  - 📚 [Asociaciones de cultivos en nuestra huerta](https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/) — Fecoagro (Argentina)
- **Evitar cerca de** (🔴 4/10): Se recomienda no asociar los Allium (cebolla, cebollín, ajo) con leguminosas como porotos/chauchas y arvejas, por antagonismo de crecimiento. Dato de reglas generales de asociación (no específico de ciboulette en fuente argentina oficial).
  - 📚 [Asociaciones de cultivos en nuestra huerta](https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/) — Fecoagro (Argentina)

<a id="laurel"></a>
## Laurel  ·  *Laurus nobilis L.*

- **Fecha/s de siembra** (🟡 5/10): No se propaga habitualmente por semilla en huerta (germinación muy lenta). Se multiplica por esqueje de ramas semileñosas de 15 cm tomadas en primavera; el trasplante del arbolito al lugar definitivo conviene en primavera u otoño. Fuente principal del hemisferio norte (España); adaptado al calendario templado del GBA, con menor confianza.
  - 📚 [El cultivo del laurel](https://www.botanical-online.com/cultivo/laurus-nobilis-como-plantar-cultivo) — Botanical-online (España)
- **Forma/s de siembra** (🟡 6/10): Propagación vegetativa por esqueje (método principal): ramas de ~15 cm de plantas adultas de 3+ años, en primavera, en maceta con humedad controlada. Por semilla es posible pero muy lento y poco común. No se hace siembra directa en cantero.
  - 📚 [El cultivo del laurel](https://www.botanical-online.com/cultivo/laurus-nobilis-como-plantar-cultivo) — Botanical-online (España)
- **Suelo** (🟡 6/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Terreno bien abonado y con buen drenaje. Especie rústica, resistente a sequía una vez establecida; en Argentina se ha naturalizado, lo que confirma su rusticidad.
  - ⚠️ *Si no se cumple:* En suelos encharcados o con drenaje deficiente aparece pudrición de raíces y hojas amarillentas; en suelos muy pobres el crecimiento (ya de por sí lento) se retrasa aún más.
  - 📚 [El cultivo del laurel](https://www.botanical-online.com/cultivo/laurus-nobilis-como-plantar-cultivo) — Botanical-online (España); [Laurus nobilis (Lauraceae) especie naturalizada en la República Argentina](https://www.scielo.org.ar/scielo.php?script=sci_arttext&pid=S1851-23722007000200016) — SciELO Argentina / Darwiniana
- **Luz** (🟡 6/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Prefiere exposición soleada y resguardada de vientos fuertes, pero tolera bien la semisombra. Clima cálido a templado; no tolera heladas fuertes. _(luz directa: mín 3 h, ideal 6 h; sin sol directo: sí)_
  - ⚠️ *Si no se cumple:* En sombra profunda crece más lento y desgarbado; a pleno viento o helada intensa sufre daño foliar. Es de las aromáticas que mejor tolera la media sombra.
  - 📚 [El cultivo del laurel](https://www.botanical-online.com/cultivo/laurus-nobilis-como-plantar-cultivo) — Botanical-online (España)
- **Cosecha** (🟡 6/10): Las hojas se cosechan durante todo el año a demanda, una vez que la planta está establecida (esqueje enraizado suele trasplantarse a la primavera siguiente). Luego se pueden secar 15 días en lugar oscuro, fresco y seco, y conservar hasta 1 año.
  - ✅ *Listo para cosechar:* Hojas adultas, coriáceas, verde oscuro y brillantes; se recogen las bien formadas en cualquier época.
  - 📚 [El cultivo del laurel](https://www.botanical-online.com/cultivo/laurus-nobilis-como-plantar-cultivo) — Botanical-online (España)
- **Germinación** (🔴 4/10): Por semilla la germinación es muy lenta e irregular (semanas a meses), motivo por el cual se prefiere el esqueje. Sin dato preciso de días en fuente confiable.
  - 📚 [El cultivo del laurel](https://www.botanical-online.com/cultivo/laurus-nobilis-como-plantar-cultivo) — Botanical-online (España)
- **Trasplante** (🟡 6/10): Los esquejes enraízan en unos 15 días y se trasplantan al lugar definitivo la primavera siguiente. El plantín/arbolito se lleva a tierra cuando tiene raíces bien formadas y algo de porte.
  - 🌱 *Listo para trasplantar:* Esqueje con raíces desarrolladas y brotación de hojas nuevas; arbolito firme al tacto.
  - 📚 [El cultivo del laurel](https://www.botanical-online.com/cultivo/laurus-nobilis-como-plantar-cultivo) — Botanical-online (España)
- **Longevidad** (🟡 7/10): Perenne; árbol/arbusto perennifolio de larga vida que puede alcanzar hasta 15 m de altura. Produce hojas para cosecha durante muchos años (décadas).
  - 📚 [El cultivo del laurel](https://www.botanical-online.com/cultivo/laurus-nobilis-como-plantar-cultivo) — Botanical-online (España)
- **Trucos** (🟡 6/10): Multiplicar por esqueje en primavera (mucho más rápido que semilla). Cultivable en maceta grande para poder resguardarlo de heladas en GBA y controlar su tamaño con poda. Ubicar a resguardo de vientos fríos. Regar moderado, espaciando en otoño-invierno.
  - 📚 [El cultivo del laurel](https://www.botanical-online.com/cultivo/laurus-nobilis-como-plantar-cultivo) — Botanical-online (España)
- **Riesgos / a evitar** (🟡 6/10): No tolera heladas fuertes ni vientos intensos. El exceso de riego provoca pudrición de raíces y hojas amarillas. Crecimiento lento (paciencia). Puede naturalizarse/expandirse; en Argentina figura como especie naturalizada.
  - 📚 [El cultivo del laurel](https://www.botanical-online.com/cultivo/laurus-nobilis-como-plantar-cultivo) — Botanical-online (España); [Laurus nobilis (Lauraceae) especie naturalizada en la República Argentina](https://www.scielo.org.ar/scielo.php?script=sci_arttext&pid=S1851-23722007000200016) — SciELO Argentina / Darwiniana
- **Plagas y enfermedades** (🟡 7/10): Cochinilla algodonosa (plaga habitual) y, como consecuencia de la melaza de cochinillas y pulgones, aparición del hongo negrilla (fumagina) que ennegrece las hojas.
  - 📚 [El cultivo del laurel](https://www.botanical-online.com/cultivo/laurus-nobilis-como-plantar-cultivo) — Botanical-online (España)
- **Se asocia bien con** (🔴 2/10): Como aromática perenne y repelente, se ubica bien en bordes/perímetro de la huerta; sus hojas secas se usan además para repeler gorgojos en granos almacenados. Sin dato específico de pares en fuente oficial argentina.
  - 📚 _(sin fuente registrada)_
- **Evitar cerca de** (🔴 2/10): Sin dato confiable de asociaciones desfavorables específicas. Por su porte de árbol conviene no plantarlo pegado a hortalizas pequeñas que quedarían sombreadas y competidas por raíces.
  - 📚 _(sin fuente registrada)_

<a id="eneldo"></a>
## Eneldo  ·  *Anethum graveolens L.*

- **Fecha/s de siembra** (🟡 7/10): Se siembra preferentemente en otoño, y también a fines de invierno o principios de primavera. En GBA (templado) las siembras de otoño e inicio de primavera son las más adecuadas por su preferencia por clima fresco; estudios de fecha de siembra en San Pedro (Bs.As.) confirman la sensibilidad del rendimiento a la época.
  - 📚 [Cultivo de Eneldo (Anethum graveolens) y usos](http://www.herbotecnia.com.ar/exo-eneldo.html) — Herbotecnia (Argentina); [Influencia de las fechas de siembra sobre la productividad del cultivo de eneldo en invernadero en San Pedro, Buenos Aires, Argentina](https://www.horticulturaar.com.ar/es/articulos/influencia-de-las-fechas-de-siembra-sobre-la-productividad-del-cultivo-de-eneldo-en-invernadero-en-san-pedro-buenos-aires-argentina.html) — Horticultura Argentina (ASAHO)
- **Forma/s de siembra** (🟢 8/10): Siembra directa (no le gusta el trasplante por su raíz pivotante). Preferentemente en líneas distanciadas 60-70 cm y ~30 cm entre plantas; también al voleo, en cuyo caso hay que ralear cuando las plántulas alcanzan unos 10 cm de altura. Cama de siembra bien preparada.
  - 📚 [Cultivo de Eneldo (Anethum graveolens) y usos](http://www.herbotecnia.com.ar/exo-eneldo.html) — Herbotecnia (Argentina)
- **Suelo** (🟡 7/10): 🟧 **`PROFUNDO_SUELTO`** (Profundo y suelto) — Requiere cama de siembra bien preparada, nivelada, mullida (suelta) y libre de malezas; suelo fértil y bien drenado. Su raíz pivotante pide suelo suelto y profundo.
  - ⚠️ *Si no se cumple:* En suelo compacto o pedregoso la raíz pivotante crece deforme, la planta se desarrolla mal y tiende a espigar/florecer prematuramente; con malezas compite y rinde poco.
  - 📚 [Cultivo de Eneldo (Anethum graveolens) y usos](http://www.herbotecnia.com.ar/exo-eneldo.html) — Herbotecnia (Argentina)
- **Luz** (🟡 5/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Prefiere pleno sol. Cultivo de clima templado-fresco; la fuente argentina no detalla horas de luz, pero es especie de plena exposición. _(luz directa: mín 6 h, ideal 6 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz se ahíla (tallos débiles y volcados) y produce poco follaje; en calor intenso y días largos florece/espiga rápido perdiendo hoja tierna.
  - 📚 [Cultivo de Eneldo (Anethum graveolens) y usos](http://www.herbotecnia.com.ar/exo-eneldo.html) — Herbotecnia (Argentina)
- **Cosecha** (🟡 5/10): Se cosecha el follaje (hoja) de forma escalonada una vez que la planta tiene buen desarrollo, y más tarde las semillas cuando maduran las umbelas. La fuente argentina no da el número exacto de días a cosecha (referencias generales: hoja ~40-60 días desde siembra).
  - ✅ *Listo para cosechar:* Para hoja: planta frondosa con follaje bien desarrollado, antes de espigar. Para semilla: umbelas y granos secos y de color pardo.
  - 📚 [Cultivo de Eneldo (Anethum graveolens) y usos](http://www.herbotecnia.com.ar/exo-eneldo.html) — Herbotecnia (Argentina)
- **Germinación** (🔴 3/10): La fuente argentina no especifica días de germinación (referencias generales indican unos 10-21 días). Sin dato preciso confiable.
  - 📚 [Cultivo de Eneldo (Anethum graveolens) y usos](http://www.herbotecnia.com.ar/exo-eneldo.html) — Herbotecnia (Argentina)
- **Trasplante** (🟢 8/10): No requiere trasplante: se hace siembra directa porque su raíz pivotante no tolera bien el trasplante. Si se sembró al voleo, en lugar de trasplantar se ralea cuando las plántulas alcanzan ~10 cm de altura.
  - 🌱 *Listo para trasplantar:* No aplica (siembra directa); el raleo se hace con plántulas de ~10 cm.
  - 📚 [Cultivo de Eneldo (Anethum graveolens) y usos](http://www.herbotecnia.com.ar/exo-eneldo.html) — Herbotecnia (Argentina)
- **Longevidad** (🟢 8/10): Planta herbácea anual; completa su ciclo (crecimiento, floración y semilla) en una temporada.
  - 📚 [Cultivo de Eneldo (Anethum graveolens) y usos](http://www.herbotecnia.com.ar/exo-eneldo.html) — Herbotecnia (Argentina)
- **Trucos** (🟡 6/10): Sembrar directo en cama mullida y sin malezas; hacer siembras escalonadas cada pocas semanas para tener hoja tierna continua antes de que espigue; mantener limpio de malezas y aporcar si hace falta para sostener las plantas. Cosechar la hoja antes de la floración para máximo aroma.
  - 📚 [Cultivo de Eneldo (Anethum graveolens) y usos](http://www.herbotecnia.com.ar/exo-eneldo.html) — Herbotecnia (Argentina)
- **Riesgos / a evitar** (🟡 6/10): Tiende a espigar (florecer) rápido con calor y días largos, acortando la cosecha de hoja. Mala tolerancia al trasplante. Las plantas altas pueden volcarse con viento (aporcar/tutorar). Se resiembra sola con facilidad.
  - 📚 [Cultivo de Eneldo (Anethum graveolens) y usos](http://www.herbotecnia.com.ar/exo-eneldo.html) — Herbotecnia (Argentina)
- **Plagas y enfermedades** (🔴 3/10): La fuente argentina no detalla plagas específicas. En general (apiáceas) puede recibir pulgones y orugas; puede sufrir enfermedades fúngicas foliares en exceso de humedad. Sin dato preciso confiable para GBA.
  - 📚 [Cultivo de Eneldo (Anethum graveolens) y usos](http://www.herbotecnia.com.ar/exo-eneldo.html) — Herbotecnia (Argentina)
- **Se asocia bien con** (🟡 6/10): Se asocia bien con repollo/coles y zanahorias: asociado con repollo y zanahoria disminuye la cantidad de gusanos que atacan al repollo. Buena compañera de las brásicas.
  - 📚 [Asociaciones de cultivos en nuestra huerta](https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/) — Fecoagro (Argentina)
- **Evitar cerca de** (🔴 3/10): Conviene no plantarlo junto a zanahoria si se van a dejar semillar ambas (misma familia, se cruzan y compiten) ni cerca del hinojo, por competencia/cruzamiento entre apiáceas. Nota: la fuente argentina cita al eneldo como favorable con zanahoria para control de plagas; el conflicto se da sobre todo al florecer/semillar, por lo que es una advertencia de reglas generales de asociación.
  - 📚 _(sin fuente registrada)_

<a id="lavanda"></a>
## Lavanda  ·  *Lavandula angustifolia (Lavandula officinalis)*

- **Fecha/s de siembra** (🟡 7/10): Propagación por semilla en almácigo durante el otoño y principio de primavera; el trasplante a lugar definitivo se hace después de las últimas heladas. Fuente Argentina (infocampo): 'Se pueden plantar gajos o plantines de lavanda en primavera u otoño'. Para GBA: plantar plantines/estacas en otoño o en primavera (tras las heladas).
  - 📚 [Cultivo de Lavanda (Lavandula officinalis) y usos](http://www.herbotecnia.com.ar/exotica-lavanda.html) — Herbotecnia (Argentina); [Lavanda: propiedades, cultivo y usos en Argentina](https://www.infocampo.com.ar/lavanda-propiedades-cultivo-y-usos-en-argentina/) — Infocampo (Argentina)
- **Forma/s de siembra** (🟡 7/10): La propagación por semilla se realiza rara vez, 'porque es técnicamente imposible obtener plantas idénticas'. El método más empleado es por estacas/esquejes de 15-20 cm tomadas en otoño-invierno, o plantar plantines/gajos comprados. Para huerta urbana conviene comprar plantín o hacer esquejes, más que sembrar semilla.
  - 📚 [Cultivo de Lavanda (Lavandula officinalis) y usos](http://www.herbotecnia.com.ar/exotica-lavanda.html) — Herbotecnia (Argentina); [Lavanda: propiedades, cultivo y usos en Argentina](https://www.infocampo.com.ar/lavanda-propiedades-cultivo-y-usos-en-argentina/) — Infocampo (Argentina)
- **Suelo** (🟢 8/10): 🟫 **`ARENOSO_DRENANTE`** (Arenoso / drenante) — Suelos ligeros, areno-arcillosos, sílico-calcáreos, con contenido mediano de humus, más bien secos y con adecuado drenaje; prefiere pH ligeramente alcalino. Es fundamental el drenaje libre.
  - ⚠️ *Si no se cumple:* En suelos pesados, húmedos o mal drenados aparecen enfermedades de raíz (pudrición) y la planta languidece; en zonas bajas y frías sufre daño por heladas. El exceso de agua es perjudicial.
  - 📚 [Cultivo de Lavanda (Lavandula officinalis) y usos](http://www.herbotecnia.com.ar/exotica-lavanda.html) — Herbotecnia (Argentina); [Lavanda: propiedades, cultivo y usos en Argentina](https://www.infocampo.com.ar/lavanda-propiedades-cultivo-y-usos-en-argentina/) — Infocampo (Argentina)
- **Luz** (🟡 7/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Requiere excelente luminosidad y clima templado; se planta a pleno sol (en la fuente técnica se recomiendan pendientes con buena exposición). Es una planta de secano y sol pleno. _(luz directa: mín 6 h, ideal 8 o más h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con sombra o poca luz crece débil y ahilada, florece poco y produce menos aceites esenciales/aroma; también aumenta la humedad en la mata y el riesgo de hongos.
  - 📚 [Cultivo de Lavanda (Lavandula officinalis) y usos](http://www.herbotecnia.com.ar/exotica-lavanda.html) — Herbotecnia (Argentina); [Lavanda: propiedades, cultivo y usos en Argentina](https://www.infocampo.com.ar/lavanda-propiedades-cultivo-y-usos-en-argentina/) — Infocampo (Argentina)
- **Cosecha** (🟢 8/10): La cosecha de flores va desde diciembre hasta febrero (fines de primavera a mediados del verano en el hemisferio sur). Se cosecha cuando el 50% de las flores de la espiga están completamente abiertas (floración plena).
  - ✅ *Listo para cosechar:* Aprox. la mitad de las flores de la vara abiertas (floración plena) y buen aroma; se cortan las varas florales por la mañana.
  - 📚 [Cultivo de Lavanda (Lavandula officinalis) y usos](http://www.herbotecnia.com.ar/exotica-lavanda.html) — Herbotecnia (Argentina); [Lavanda: propiedades, cultivo y usos en Argentina](https://www.infocampo.com.ar/lavanda-propiedades-cultivo-y-usos-en-argentina/) — Infocampo (Argentina)
- **Germinación** (🔴 3/10): Sin dato confiable de días exactos en las fuentes consultadas. En general la semilla de lavanda germina lenta e irregularmente (varias semanas), por lo que se prefiere la propagación por estaca. Confianza baja por falta de fuente específica.
  - 📚 [Cultivo de Lavanda (Lavandula officinalis) y usos](http://www.herbotecnia.com.ar/exotica-lavanda.html) — Herbotecnia (Argentina)
- **Trasplante** (🟡 7/10): Los plantines de almácigo se trasplantan a vivero/lugar definitivo durante el otoño-invierno siguiente, y la plantación definitiva se realiza después de las últimas heladas. Las estacas se enraízan en otoño-invierno antes de llevarlas al lugar definitivo.
  - 🌱 *Listo para trasplantar:* Plantín/estaca bien enraizado y endurecido, con brotes nuevos, listo para pasar a suelo definitivo una vez pasado el riesgo de heladas.
  - 📚 [Cultivo de Lavanda (Lavandula officinalis) y usos](http://www.herbotecnia.com.ar/exotica-lavanda.html) — Herbotecnia (Argentina)
- **Longevidad** (🟢 8/10): Perenne (arbusto): una plantación puede mantenerse en producción durante 6-8 años, e incluso más, aunque con la producción en disminución con los años.
  - 📚 [Cultivo de Lavanda (Lavandula officinalis) y usos](http://www.herbotecnia.com.ar/exotica-lavanda.html) — Herbotecnia (Argentina)
- **Trucos** (🟡 7/10): Priorizar drenaje excelente (plantar en camellón/montículo o suelo arenoso). Ubicar a pleno sol y con buena aireación. Riego escaso: prefiere condiciones de déficit hídrico, con riego ocasional. Realizar una poda ligera cada año (tras la floración) para estimular un crecimiento robusto y mantener la mata compacta. Preferir propagación por estaca para conservar la variedad.
  - 📚 [Lavanda: propiedades, cultivo y usos en Argentina](https://www.infocampo.com.ar/lavanda-propiedades-cultivo-y-usos-en-argentina/) — Infocampo (Argentina); [Cultivo de Lavanda (Lavandula officinalis) y usos](http://www.herbotecnia.com.ar/exotica-lavanda.html) — Herbotecnia (Argentina)
- **Riesgos / a evitar** (🟡 7/10): El exceso de agua/riego y los suelos húmedos o mal drenados son perjudiciales y causan enfermedades de raíz. En lugares bajos sufre daño por heladas. El clima templado húmedo del GBA (alta humedad estival) es un factor de riesgo por hongos, por lo que el drenaje y la aireación son claves.
  - 📚 [Cultivo de Lavanda (Lavandula officinalis) y usos](http://www.herbotecnia.com.ar/exotica-lavanda.html) — Herbotecnia (Argentina); [Lavanda: propiedades, cultivo y usos en Argentina](https://www.infocampo.com.ar/lavanda-propiedades-cultivo-y-usos-en-argentina/) — Infocampo (Argentina)
- **Plagas y enfermedades** (🔴 3/10): Las fuentes consultadas no detallan plagas específicas; la principal preocupación son las enfermedades de raíz (pudriciones) asociadas a exceso de humedad y mal drenaje. Sin dato confiable de plagas concretas (insectos).
  - 📚 [Cultivo de Lavanda (Lavandula officinalis) y usos](http://www.herbotecnia.com.ar/exotica-lavanda.html) — Herbotecnia (Argentina)
- **Se asocia bien con** (🔴 2/10): Sin dato confiable en las fuentes argentinas consultadas. Como aromática melífera se la asocia habitualmente con el fomento de polinizadores y abejas en la huerta, pero no se halló fuente técnica específica de asociación de cultivos para GBA.
  - 📚 _(sin fuente registrada)_
- **Evitar cerca de** (🔴 2/10): Sin dato confiable. Por sus requerimientos opuestos (suelo seco, drenante, poco riego), conviene no plantarla junto a hortalizas que exigen riego frecuente y suelo húmedo/rico, ya que ese manejo la perjudica; pero no se halló fuente técnica que lo confirme explícitamente.
  - 📚 _(sin fuente registrada)_


---

# Flor polinizadora

<a id="calendula"></a>
## Caléndula  ·  *Calendula officinalis*

- **Fecha/s de siembra** (🟡 6/10): Anual de estación fresca. En el Gran Buenos Aires se siembra en otoño (marzo-mayo) y a fin de invierno-primavera (agosto-octubre). El semillero argentino Jardín de Campo indica siembra en primavera y almácigo 6-8 semanas antes de la última helada; florece de primavera a verano y puede extenderse al invierno en zonas cálidas. (Las ventanas de otoño se infieren del hábito de estación fresca; por eso baja confianza.)
  - 📚 [Caléndula (Calendula officinalis) - Ficha de cultivo](https://jardindecampo.mitiendanube.com/productos/calendula-calendula-officinalis/) — Jardín de Campo (semillero, Argentina)
- **Forma/s de siembra** (🟡 7/10): Siembra directa o en almácigo, ambas viables; de germinación muy fácil. Enterrar la semilla 2-3 veces su tamaño. Almácigo 6-8 semanas antes de la última helada. Suele resembrarse sola.
  - 📚 [Caléndula (Calendula officinalis) - Ficha de cultivo](https://jardindecampo.mitiendanube.com/productos/calendula-calendula-officinalis/) — Jardín de Campo (semillero, Argentina)
- **Suelo** (🟡 6/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Poco exigente; se adapta a diversos suelos aunque prefiere suelo fértil y bien drenado. Distancia entre plantas 25-30 cm.
  - ⚠️ *Si no se cumple:* Muy rústica: tolera suelos pobres, pero en suelos encharcados o mal drenados la raíz se pudre.
  - 📚 [Caléndula (Calendula officinalis) - Ficha de cultivo](https://jardindecampo.mitiendanube.com/productos/calendula-calendula-officinalis/) — Jardín de Campo (semillero, Argentina)
- **Luz** (🟡 7/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Pleno sol; en zonas de veranos muy calurosos la media sombra la beneficia. _(luz directa: mín 6 h, ideal 6+ h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz se ahíla (tallos largos y débiles) y florece menos; en verano muy caluroso a pleno sol puede detener la floración.
  - 📚 [Caléndula (Calendula officinalis) - Ficha de cultivo](https://jardindecampo.mitiendanube.com/productos/calendula-calendula-officinalis/) — Jardín de Campo (semillero, Argentina)
- **Cosecha** (🟡 5/10): Florece en primavera-verano (y hasta el invierno en zonas cálidas); se cosechan los capítulos florales para consumo, uso medicinal o como flor de corte. No se hallaron días exactos desde siembra en fuente confiable.
  - ✅ *Listo para cosechar:* Flores completamente abiertas, de color intenso.
  - 📚 [Caléndula (Calendula officinalis) - Ficha de cultivo](https://jardindecampo.mitiendanube.com/productos/calendula-calendula-officinalis/) — Jardín de Campo (semillero, Argentina)
- **Germinación** (🟡 5/10): De germinación muy fácil y rápida (aprox. 1-2 semanas en clima templado; los días son inferidos).
  - 📚 [Caléndula (Calendula officinalis) - Ficha de cultivo](https://jardindecampo.mitiendanube.com/productos/calendula-calendula-officinalis/) — Jardín de Campo (semillero, Argentina)
- **Trasplante** (🟡 6/10): Si se hace almácigo, se trasplanta 6-8 semanas después de la siembra. También admite siembra directa sin trasplante.
  - 🌱 *Listo para trasplantar:* Plantín con varias hojas verdaderas; las plántulas resisten heladas leves.
  - 📚 [Caléndula (Calendula officinalis) - Ficha de cultivo](https://jardindecampo.mitiendanube.com/productos/calendula-calendula-officinalis/) — Jardín de Campo (semillero, Argentina)
- **Longevidad** (🟡 7/10): Anual (a veces perenne de vida corta). Produce abundantes flores durante una temporada; poda a fin de verano prolonga la floración.
  - 📚 [Caléndula (Calendula officinalis) - Ficha de cultivo](https://jardindecampo.mitiendanube.com/productos/calendula-calendula-officinalis/) — Jardín de Campo (semillero, Argentina)
- **Trucos** (🟡 7/10): Despuntar flores marchitas y podar a fin de verano estimula nueva floración. Muy recomendada como planta trampa de pulgones intercalada con hortalizas; enriquece aromas y colores de la huerta.
  - 📚 [Caléndula (Calendula officinalis) - Ficha de cultivo](https://jardindecampo.mitiendanube.com/productos/calendula-calendula-officinalis/) — Jardín de Campo (semillero, Argentina); [Cómo combinar flores y aromáticas en la huerta para repeler insectos y controlar plagas](https://www.infocampo.com.ar/como-combinar-flores-y-aromaticas-en-la-huerta-para-repeler-insectos-y-controlar-plagas/) — Infocampo (reproduce contenido de INTA - Agustín Colson)
- **Riesgos / a evitar** (🟡 5/10): Evitar suelos anegados; en pleno verano muy caluroso puede detener la floración (le conviene media sombra). Al ser planta trampa concentra pulgones, hay que monitorearla.
  - 📚 [Caléndula (Calendula officinalis) - Ficha de cultivo](https://jardindecampo.mitiendanube.com/productos/calendula-calendula-officinalis/) — Jardín de Campo (semillero, Argentina)
- **Plagas y enfermedades** (🟡 7/10): Funciona como planta trampa que atrae/desvía pulgones, chinches y gusanos de las hortalizas. Puede sufrir ella misma pulgones y oídio.
  - 📚 [Cómo combinar flores y aromáticas en la huerta para repeler insectos y controlar plagas](https://www.infocampo.com.ar/como-combinar-flores-y-aromaticas-en-la-huerta-para-repeler-insectos-y-controlar-plagas/) — Infocampo (reproduce contenido de INTA - Agustín Colson); [Huerta: prevenir plagas con aromáticas y flores](https://www.noticiasagropecuarias.com/2020/10/14/huerta-prevenir-plagas-con-aromaticas-y-flores/) — Noticias Agropecuarias (contenido INTA)
- **Se asocia bien con** (🟡 7/10): Lechuga (asociación antiplagas contra pulgones), tomate y hortalizas en general; atrae pulgones y fauna benéfica.
  - 📚 [El Suelo - Calendario de siembra, abono y fertilizantes (asociación antiplagas 'Lechuga y caléndula')](https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf) — UNL / material ProHuerta-INTA; [Cómo combinar flores y aromáticas en la huerta para repeler insectos y controlar plagas](https://www.infocampo.com.ar/como-combinar-flores-y-aromaticas-en-la-huerta-para-repeler-insectos-y-controlar-plagas/) — Infocampo (contenido INTA)
- **Evitar cerca de** (🔴 2/10): sin dato confiable
  - 📚 _(sin fuente registrada)_

<a id="copete-tagetes"></a>
## Copete / Tagetes  ·  *Tagetes patula / Tagetes erecta*

- **Fecha/s de siembra** (🟡 6/10): Anual de estación cálida. En el Gran Buenos Aires se siembra en primavera (septiembre-diciembre): en almácigo a fin de invierno para trasplantar pasadas las heladas, o directa en primavera-verano. Una fuente del hemisferio sur (Uruguay) indica siembra desde fin de invierno hasta fin de verano.
  - 📚 [Copete, tagete](https://www.entrejardines.uy/copete-tagete/) — Entrejardines (Uruguay, hemisferio sur)
- **Forma/s de siembra** (🟡 6/10): Almácigo sembrado aprox. 1 a 1,5 meses antes del trasplante; también siembra directa. Germina y enraíza con facilidad; se multiplica además por esquejes (enraízan a 20-22 °C).
  - 📚 [Copete, tagete](https://www.entrejardines.uy/copete-tagete/) — Entrejardines (Uruguay, hemisferio sur)
- **Suelo** (🟡 6/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Tierra común, liviana y bien drenada; poco exigente.
  - ⚠️ *Si no se cumple:* Se adapta a suelos pobres, pero en suelos pesados o encharcados crece mal y puede pudrirse.
  - 📚 [Copete, tagete](https://www.entrejardines.uy/copete-tagete/) — Entrejardines (Uruguay, hemisferio sur)
- **Luz** (🟡 7/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Pleno sol; se adapta a un rango amplio de temperaturas. _(luz directa: mín 6 h, ideal 6+ h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* A la sombra se ahíla y florece poco.
  - 📚 [Copete, tagete](https://www.entrejardines.uy/copete-tagete/) — Entrejardines (Uruguay, hemisferio sur)
- **Cosecha** (🟡 6/10): Florece rápido tras la siembra y de forma prolongada durante toda la temporada cálida; se aprovecha la flor abierta (ornamental y funcional en la huerta).
  - ✅ *Listo para cosechar:* Flores abiertas amarillas, naranjas o rojizas (simples o dobles, hasta 5 cm).
  - 📚 [Copete, tagete](https://www.entrejardines.uy/copete-tagete/) — Entrejardines (Uruguay, hemisferio sur)
- **Germinación** (🟡 5/10): Rápida y fácil (florece pronto después de sembrada; días exactos inferidos, aprox. 1 semana).
  - 📚 [Copete, tagete](https://www.entrejardines.uy/copete-tagete/) — Entrejardines (Uruguay, hemisferio sur)
- **Trasplante** (🟡 6/10): Trasplante aproximadamente 1 a 1,5 meses después de la siembra en almácigo, pasado el riesgo de heladas.
  - 🌱 *Listo para trasplantar:* Plantín con varias hojas verdaderas y buen sistema radicular.
  - 📚 [Copete, tagete](https://www.entrejardines.uy/copete-tagete/) — Entrejardines (Uruguay, hemisferio sur)
- **Longevidad** (🟡 7/10): Anual; completa su ciclo en una temporada con floración extensa.
  - 📚 [Copete, tagete](https://www.entrejardines.uy/copete-tagete/) — Entrejardines (Uruguay, hemisferio sur)
- **Trucos** (🟡 7/10): Intercalar entre hortalizas (aprox. 1 flor cada 3-4 plantas de hortaliza). Sus raíces liberan compuestos que reducen nematodos del suelo. Regar con humedad constante cuando la temperatura supera 25 °C.
  - 📚 [Copete, tagete](https://www.entrejardines.uy/copete-tagete/) — Entrejardines (Uruguay); [Flores que protegen el huerto](https://mundoagropecuario.com/flores-que-protegen-el-huerto/) — Mundo Agropecuario; [Cómo combinar flores y aromáticas en la huerta para repeler insectos y controlar plagas](https://www.infocampo.com.ar/como-combinar-flores-y-aromaticas-en-la-huerta-para-repeler-insectos-y-controlar-plagas/) — Infocampo (contenido INTA)
- **Riesgos / a evitar** (🟡 5/10): Sensible a heladas (sembrar/trasplantar tras la última helada); requiere riego constante en épocas de calor.
  - 📚 [Copete, tagete](https://www.entrejardines.uy/copete-tagete/) — Entrejardines (Uruguay)
- **Plagas y enfermedades** (🟡 7/10): Repele/controla nematodos del suelo, mosca blanca y pulgones por su aroma intenso y sus raíces. Puede sufrir arañuela roja y babosas.
  - 📚 [Flores que protegen el huerto](https://mundoagropecuario.com/flores-que-protegen-el-huerto/) — Mundo Agropecuario; [Cómo combinar flores y aromáticas en la huerta para repeler insectos y controlar plagas](https://www.infocampo.com.ar/como-combinar-flores-y-aromaticas-en-la-huerta-para-repeler-insectos-y-controlar-plagas/) — Infocampo (contenido INTA)
- **Se asocia bien con** (🟢 8/10): Tomate y papa (control de nematodos y pulgones). INTA propone la combinación 'albahaca + tomate + copetes', que ayuda a controlar nematodos, mosca e incluso mosquitos.
  - 📚 [Cómo combinar flores y aromáticas en la huerta para repeler insectos y controlar plagas](https://www.infocampo.com.ar/como-combinar-flores-y-aromaticas-en-la-huerta-para-repeler-insectos-y-controlar-plagas/) — Infocampo (contenido INTA - Agustín Colson); [Huerta: prevenir plagas con aromáticas y flores](https://www.noticiasagropecuarias.com/2020/10/14/huerta-prevenir-plagas-con-aromaticas-y-flores/) — Noticias Agropecuarias (contenido INTA); [Flores que protegen el huerto](https://mundoagropecuario.com/flores-que-protegen-el-huerto/) — Mundo Agropecuario
- **Evitar cerca de** (🔴 2/10): sin dato confiable
  - 📚 _(sin fuente registrada)_

<a id="borraja"></a>
## Borraja  ·  *Borago officinalis*

- **Fecha/s de siembra** (🟡 6/10): En el Gran Buenos Aires se siembra de otoño a primavera (semillero argentino Jardín de Campo); planta de clima fresco que florece en primavera, verano y otoño según la época de siembra. Una fuente española (hemisferio norte, menor aplicabilidad) indica siembra desde fin de verano hasta invierno/primavera.
  - 📚 [Borraja (Borago officinalis) - Ficha de cultivo](https://jardindecampo.mitiendanube.com/productos/borraja-borago-officinalis/) — Jardín de Campo (semillero, Argentina); [Borraja - Borago officinalis - Fichas de plantas](https://fichas.infojardin.com/hortalizas-verduras/borraja-borago-officinalis.htm) — Infojardín (España, hemisferio norte)
- **Forma/s de siembra** (🟡 7/10): Se prefiere siembra directa por su raíz pivotante; si se usa almácigo, en plugs grandes o macetines individuales para no dañar la raíz. Enterrar la semilla 2-3 veces su tamaño y ralear a distancia final (45-60 cm entre plantas). Germinación muy fácil; se resiembra sola espontáneamente.
  - 📚 [Borraja (Borago officinalis) - Ficha de cultivo](https://jardindecampo.mitiendanube.com/productos/borraja-borago-officinalis/) — Jardín de Campo (semillero, Argentina); [Borraja - Borago officinalis - Fichas de plantas](https://fichas.infojardin.com/hortalizas-verduras/borraja-borago-officinalis.htm) — Infojardín (España)
- **Suelo** (🟡 6/10): 🟩 **`FRANCO_FERTIL`** (Franco fértil) — Poco exigente pero bien drenado; prefiere suelos ricos en materia orgánica (arcillo-limosos).
  - ⚠️ *Si no se cumple:* Se adapta a casi todos los suelos, pero con encharcamiento la raíz pivotante se pudre.
  - 📚 [Borraja (Borago officinalis) - Ficha de cultivo](https://jardindecampo.mitiendanube.com/productos/borraja-borago-officinalis/) — Jardín de Campo (semillero, Argentina); [Borraja - Borago officinalis - Fichas de plantas](https://fichas.infojardin.com/hortalizas-verduras/borraja-borago-officinalis.htm) — Infojardín (España)
- **Luz** (🟡 7/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Pleno sol; necesita buena intensidad lumínica para florecer. Altura 50-90 cm. _(luz directa: mín 6 h, ideal 6+ h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz se ahíla y florece poco; el exceso de calor/luz la manda a flor rápido y baja la producción de hoja.
  - 📚 [Borraja (Borago officinalis) - Ficha de cultivo](https://jardindecampo.mitiendanube.com/productos/borraja-borago-officinalis/) — Jardín de Campo (semillero, Argentina); [Borraja - Borago officinalis - Fichas de plantas](https://fichas.infojardin.com/hortalizas-verduras/borraja-borago-officinalis.htm) — Infojardín (España)
- **Cosecha** (🟡 6/10): Ciclo vegetativo aprox. 50-120 días; se cosechan hojas tiernas y flores. Con calor 'sube a flor' y se deprecia la producción de hoja.
  - ✅ *Listo para cosechar:* Hojas jóvenes tiernas (antes de la floración) y flores azules estrelladas abiertas.
  - 📚 [Borraja - Borago officinalis - Fichas de plantas](https://fichas.infojardin.com/hortalizas-verduras/borraja-borago-officinalis.htm) — Infojardín (España)
- **Germinación** (🟡 6/10): Muy rápida y fácil (la semilla germina con gran rapidez).
  - 📚 [Borraja (Borago officinalis) - Ficha de cultivo](https://jardindecampo.mitiendanube.com/productos/borraja-borago-officinalis/) — Jardín de Campo (semillero, Argentina); [Borraja - Borago officinalis - Fichas de plantas](https://fichas.infojardin.com/hortalizas-verduras/borraja-borago-officinalis.htm) — Infojardín (España)
- **Trasplante** (🟡 7/10): Preferentemente NO se trasplanta por su raíz pivotante: conviene siembra directa. Si se hizo almácigo, trasplantar temprano en cepellón/macetín individual sin romper la raíz.
  - 🌱 *Listo para trasplantar:* Plantín pequeño con cepellón intacto (trasplante temprano para no dañar la raíz).
  - 📚 [Borraja (Borago officinalis) - Ficha de cultivo](https://jardindecampo.mitiendanube.com/productos/borraja-borago-officinalis/) — Jardín de Campo (semillero, Argentina)
- **Longevidad** (🟡 7/10): Anual (ocasionalmente se comporta como bienal); una temporada de producción, con abundante resiembra espontánea.
  - 📚 [Borraja (Borago officinalis) - Ficha de cultivo](https://jardindecampo.mitiendanube.com/productos/borraja-borago-officinalis/) — Jardín de Campo (semillero, Argentina); [Borraja - Borago officinalis - Fichas de plantas](https://fichas.infojardin.com/hortalizas-verduras/borraja-borago-officinalis.htm) — Infojardín (España)
- **Trucos** (🟡 7/10): Sembrar directa para no dañar la raíz pivotante. Usar guantes al manipularla (planta urticante). Dejar flores para atraer abejas y favorecer la resiembra: es 'planta maravilla' para polinizadores.
  - 📚 [Borraja (Borago officinalis) - Ficha de cultivo](https://jardindecampo.mitiendanube.com/productos/borraja-borago-officinalis/) — Jardín de Campo (semillero, Argentina)
- **Riesgos / a evitar** (🟡 6/10): Planta urticante al tacto (usar guantes). Con altas temperaturas se va a flor rápido y baja la calidad de hoja. Evitar encharcamiento. Se resiembra mucho y puede volverse invasiva.
  - 📚 [Borraja (Borago officinalis) - Ficha de cultivo](https://jardindecampo.mitiendanube.com/productos/borraja-borago-officinalis/) — Jardín de Campo (semillero, Argentina); [Borraja - Borago officinalis - Fichas de plantas](https://fichas.infojardin.com/hortalizas-verduras/borraja-borago-officinalis.htm) — Infojardín (España)
- **Plagas y enfermedades** (🟡 6/10): Puede sufrir virosis (mosaico del pepino, CMV), Fusarium, gusanos del suelo, orugas masticadoras y pulgones. En la huerta atrae polinizadores y enemigos naturales de plagas.
  - 📚 [Borraja - Borago officinalis - Fichas de plantas](https://fichas.infojardin.com/hortalizas-verduras/borraja-borago-officinalis.htm) — Infojardín (España); [Flores que protegen el huerto](https://mundoagropecuario.com/flores-que-protegen-el-huerto/) — Mundo Agropecuario
- **Se asocia bien con** (🟡 7/10): Tomate (según INTA, 'Borraja + tomate' repele orugas cortadoras); hortalizas en general por atraer polinizadores y fauna benéfica. Tradicionalmente asociada también a la frutilla.
  - 📚 [Cómo combinar flores y aromáticas en la huerta para repeler insectos y controlar plagas](https://www.infocampo.com.ar/como-combinar-flores-y-aromaticas-en-la-huerta-para-repeler-insectos-y-controlar-plagas/) — Infocampo (contenido INTA - Agustín Colson); [Huerta: prevenir plagas con aromáticas y flores](https://www.noticiasagropecuarias.com/2020/10/14/huerta-prevenir-plagas-con-aromaticas-y-flores/) — Noticias Agropecuarias (contenido INTA)
- **Evitar cerca de** (🔴 2/10): sin dato confiable
  - 📚 _(sin fuente registrada)_

<a id="capuchina-taco-de-reina"></a>
## Capuchina (taco de reina)  ·  *Tropaeolum majus*

- **Fecha/s de siembra** (🟡 7/10): En Argentina se siembra en otoño: marzo, abril y mayo (fuentes De Raíz y La Nación coinciden). Ciclo otoño-invierno-primavera, con floración de julio a octubre. En zonas de heladas fuertes también puede sembrarse en primavera, ya que las heladas la queman.
  - 📚 [Taco de reina (Tropaeolum majus): la flor comestible y fácil de cuidar](https://deraiz.ar/taco-de-reina-tropaeolum-majus-la-flor-comestible-y-facil-de-cuidar-que-previene-resfrios-y-es-ideal-para-tener-en-la-huerta/) — De Raíz (deraiz.ar, Argentina); [En la huerta: taco de reina, la flor comestible que reemplaza a las alcaparras](https://www.lanacion.com.ar/revista-jardin/en-la-huerta-taco-de-reina-la-planta-de-flor-comestible-que-reemplaza-las-alcaparras-sabe-a-berro-y-nid06042021/) — La Nación - Revista Jardín (Argentina)
- **Forma/s de siembra** (🟡 7/10): Por semilla: siembra directa (junto a cercos o al pie de frutales), almácigo, o por estacas de tallo. La semilla es grande y germina con facilidad; la siembra directa es habitual.
  - 📚 [En la huerta: taco de reina, la flor comestible que reemplaza a las alcaparras](https://www.lanacion.com.ar/revista-jardin/en-la-huerta-taco-de-reina-la-planta-de-flor-comestible-que-reemplaza-las-alcaparras-sabe-a-berro-y-nid06042021/) — La Nación - Revista Jardín (Argentina); [Taco de reina (Tropaeolum majus): la flor comestible y fácil de cuidar](https://deraiz.ar/taco-de-reina-tropaeolum-majus-la-flor-comestible-y-facil-de-cuidar-que-previene-resfrios-y-es-ideal-para-tener-en-la-huerta/) — De Raíz (Argentina)
- **Suelo** (🟡 7/10): ⬜ **`RUSTICO_TOLERANTE`** (Rústico / tolerante) — Húmedo y con buen drenaje. En suelos pobres florece más; suelos muy ricos en nitrógeno favorecen las hojas en detrimento de las flores.
  - ⚠️ *Si no se cumple:* En suelo muy nitrogenado hace mucha hoja y pocas flores; necesita buen drenaje para no pudrirse.
  - 📚 [Taco de reina (Tropaeolum majus): la flor comestible y fácil de cuidar](https://deraiz.ar/taco-de-reina-tropaeolum-majus-la-flor-comestible-y-facil-de-cuidar-que-previene-resfrios-y-es-ideal-para-tener-en-la-huerta/) — De Raíz (Argentina); [En la huerta: taco de reina, la flor comestible que reemplaza a las alcaparras](https://www.lanacion.com.ar/revista-jardin/en-la-huerta-taco-de-reina-la-planta-de-flor-comestible-que-reemplaza-las-alcaparras-sabe-a-berro-y-nid06042021/) — La Nación - Revista Jardín (Argentina)
- **Luz** (🟡 7/10): 🌤️ **`SOL_PARCIAL`** (Sol parcial) — Crece saludable a pleno sol e incluso a media sombra. _(luz directa: mín 4 h, ideal 6 h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Tolera media sombra, pero con poca luz florece menos y se enreda buscando luz.
  - 📚 [Taco de reina (Tropaeolum majus): la flor comestible y fácil de cuidar](https://deraiz.ar/taco-de-reina-tropaeolum-majus-la-flor-comestible-y-facil-de-cuidar-que-previene-resfrios-y-es-ideal-para-tener-en-la-huerta/) — De Raíz (Argentina); [En la huerta: taco de reina, la flor comestible que reemplaza a las alcaparras](https://www.lanacion.com.ar/revista-jardin/en-la-huerta-taco-de-reina-la-planta-de-flor-comestible-que-reemplaza-las-alcaparras-sabe-a-berro-y-nid06042021/) — La Nación - Revista Jardín (Argentina)
- **Cosecha** (🟡 7/10): Cosecha de hojas y flores entre julio y octubre, cuando están bien desarrolladas. Las semillas verdes se encurten como 'falsas alcaparras'.
  - ✅ *Listo para cosechar:* Hojas y flores desarrolladas; frutos verdes tiernos para encurtir.
  - 📚 [Taco de reina (Tropaeolum majus): la flor comestible y fácil de cuidar](https://deraiz.ar/taco-de-reina-tropaeolum-majus-la-flor-comestible-y-facil-de-cuidar-que-previene-resfrios-y-es-ideal-para-tener-en-la-huerta/) — De Raíz (Argentina); [En la huerta: taco de reina, la flor comestible que reemplaza a las alcaparras](https://www.lanacion.com.ar/revista-jardin/en-la-huerta-taco-de-reina-la-planta-de-flor-comestible-que-reemplaza-las-alcaparras-sabe-a-berro-y-nid06042021/) — La Nación - Revista Jardín (Argentina)
- **Germinación** (🟡 5/10): Fácil, por su semilla grande (aprox. 1-2 semanas; días inferidos).
  - 📚 [Taco de reina (Tropaeolum majus): la flor comestible y fácil de cuidar](https://deraiz.ar/taco-de-reina-tropaeolum-majus-la-flor-comestible-y-facil-de-cuidar-que-previene-resfrios-y-es-ideal-para-tener-en-la-huerta/) — De Raíz (Argentina)
- **Trasplante** (🟡 6/10): Se prefiere siembra directa; si se hace almácigo, trasplantar cuando el plantín tiene varias hojas. También se propaga por estacas de tallo.
  - 🌱 *Listo para trasplantar:* Plantín con varias hojas verdaderas.
  - 📚 [En la huerta: taco de reina, la flor comestible que reemplaza a las alcaparras](https://www.lanacion.com.ar/revista-jardin/en-la-huerta-taco-de-reina-la-planta-de-flor-comestible-que-reemplaza-las-alcaparras-sabe-a-berro-y-nid06042021/) — La Nación - Revista Jardín (Argentina)
- **Longevidad** (🟡 7/10): Herbácea anual (ciclo otoño-invierno-primavera). Las heladas la queman, pero tras fructificar se resiembra naturalmente.
  - 📚 [Taco de reina (Tropaeolum majus): la flor comestible y fácil de cuidar](https://deraiz.ar/taco-de-reina-tropaeolum-majus-la-flor-comestible-y-facil-de-cuidar-que-previene-resfrios-y-es-ideal-para-tener-en-la-huerta/) — De Raíz (Argentina); [En la huerta: taco de reina, la flor comestible que reemplaza a las alcaparras](https://www.lanacion.com.ar/revista-jardin/en-la-huerta-taco-de-reina-la-planta-de-flor-comestible-que-reemplaza-las-alcaparras-sabe-a-berro-y-nid06042021/) — La Nación - Revista Jardín (Argentina)
- **Trucos** (🟡 7/10): Plantar en suelo pobre y no fertilizar en exceso para obtener más flores. Usarla como planta trampa/sacrificio de pulgones cerca de las hortalizas. Ubicarla junto a cercos o al pie de frutales y dejarla semillar para que se resiembre.
  - 📚 [En la huerta: taco de reina, la flor comestible que reemplaza a las alcaparras](https://www.lanacion.com.ar/revista-jardin/en-la-huerta-taco-de-reina-la-planta-de-flor-comestible-que-reemplaza-las-alcaparras-sabe-a-berro-y-nid06042021/) — La Nación - Revista Jardín (Argentina); [Flores que protegen el huerto](https://mundoagropecuario.com/flores-que-protegen-el-huerto/) — Mundo Agropecuario
- **Riesgos / a evitar** (🟡 7/10): Sensible a heladas (la queman). El exceso de nitrógeno inhibe la floración. Atrae pulgones (por eso funciona como trampa), lo que requiere monitoreo; puede extenderse mucho por resiembra.
  - 📚 [Taco de reina (Tropaeolum majus): la flor comestible y fácil de cuidar](https://deraiz.ar/taco-de-reina-tropaeolum-majus-la-flor-comestible-y-facil-de-cuidar-que-previene-resfrios-y-es-ideal-para-tener-en-la-huerta/) — De Raíz (Argentina); [En la huerta: taco de reina, la flor comestible que reemplaza a las alcaparras](https://www.lanacion.com.ar/revista-jardin/en-la-huerta-taco-de-reina-la-planta-de-flor-comestible-que-reemplaza-las-alcaparras-sabe-a-berro-y-nid06042021/) — La Nación - Revista Jardín (Argentina)
- **Plagas y enfermedades** (🟡 7/10): Muy sensible a pulgones (negros) y orugas: funciona como planta trampa/sacrificio que los concentra. A la vez repele la mosca blanca de repollos y crucíferas. Los pulgones se controlan con solución de agua y ajo machacado.
  - 📚 [Taco de reina (Tropaeolum majus): la flor comestible y fácil de cuidar](https://deraiz.ar/taco-de-reina-tropaeolum-majus-la-flor-comestible-y-facil-de-cuidar-que-previene-resfrios-y-es-ideal-para-tener-en-la-huerta/) — De Raíz (Argentina); [En la huerta: taco de reina, la flor comestible que reemplaza a las alcaparras](https://www.lanacion.com.ar/revista-jardin/en-la-huerta-taco-de-reina-la-planta-de-flor-comestible-que-reemplaza-las-alcaparras-sabe-a-berro-y-nid06042021/) — La Nación - Revista Jardín (Argentina); [Flores que protegen el huerto](https://mundoagropecuario.com/flores-que-protegen-el-huerto/) — Mundo Agropecuario
- **Se asocia bien con** (🟡 7/10): Repollo, coliflor y otras crucíferas (repele su mosca blanca y atrae pulgones/orugas de la col como trampa); frutales y hortalizas en general.
  - 📚 [Taco de reina (Tropaeolum majus): la flor comestible y fácil de cuidar](https://deraiz.ar/taco-de-reina-tropaeolum-majus-la-flor-comestible-y-facil-de-cuidar-que-previene-resfrios-y-es-ideal-para-tener-en-la-huerta/) — De Raíz (Argentina); [Flores que protegen el huerto](https://mundoagropecuario.com/flores-que-protegen-el-huerto/) — Mundo Agropecuario; [En la huerta: taco de reina, la flor comestible que reemplaza a las alcaparras](https://www.lanacion.com.ar/revista-jardin/en-la-huerta-taco-de-reina-la-planta-de-flor-comestible-que-reemplaza-las-alcaparras-sabe-a-berro-y-nid06042021/) — La Nación - Revista Jardín (Argentina)
- **Evitar cerca de** (🔴 2/10): sin dato confiable
  - 📚 _(sin fuente registrada)_

<a id="cosmos"></a>
## Cosmos  ·  *Cosmos bipinnatus*

- **Fecha/s de siembra** (🟡 5/10): En GBA (hemisferio sur) sembrar a fines de invierno y principio de primavera, cuando suben las temperaturas y pasa el riesgo de heladas (aprox. agosto-noviembre). Nota: la fuente La Huertina indica marzo-abril (interior) y abril-mayo (exterior), pero corresponde al hemisferio norte, por lo que para GBA debe desplazarse ~6 meses (primavera local).
  - 📚 [¿Cómo cultivar flor cosmos?](https://sitopia.com.ar/como-cultivar-flor-cosmos/) — Sitopia (Argentina); [Flor del Cosmos, el seto perfecto para la huerta](https://www.lahuertinadetoni.es/flor-del-cosmos-el-seto-perfecto-para-la-huerta/) — La Huertina de Toni (España, hemisferio norte)
- **Forma/s de siembra** (🟡 6/10): Admite siembra directa en el suelo o en almácigo/almacigueras (semilleros biodegradables) para luego trasplantar. En huerta suele hacerse siembra directa por su fácil germinación; el almácigo permite adelantar la temporada.
  - 📚 [¿Cómo cultivar flor cosmos?](https://sitopia.com.ar/como-cultivar-flor-cosmos/) — Sitopia (Argentina); [Flor del Cosmos, el seto perfecto para la huerta](https://www.lahuertinadetoni.es/flor-del-cosmos-el-seto-perfecto-para-la-huerta/) — La Huertina de Toni (España)
- **Suelo** (🟡 6/10): ⬜ **`RUSTICO_TOLERANTE`** (Rústico / tolerante) — Se adapta muy bien a suelos pobres; prefiere suelos bien drenados. No conviene un sustrato demasiado rico en nitrógeno. Una fuente argentina recomienda suelo drenado y con nutrientes/compost; otra (España) destaca que 'se adapta bien al suelo pobre' y que 'no se debe echar mucho fertilizante o abono porque se suprime la floración'.
  - ⚠️ *Si no se cumple:* En suelos muy ricos o muy abonados (exceso de nitrógeno) la planta produce mucho follaje pero se suprime/reduce la floración. El exceso de agua o el mal drenaje favorecen la podredumbre de raíz.
  - 📚 [Flor del Cosmos, el seto perfecto para la huerta](https://www.lahuertinadetoni.es/flor-del-cosmos-el-seto-perfecto-para-la-huerta/) — La Huertina de Toni (España); [¿Cómo cultivar flor cosmos?](https://sitopia.com.ar/como-cultivar-flor-cosmos/) — Sitopia (Argentina)
- **Luz** (🟡 6/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Requiere pleno sol; se recomienda al menos 6 horas de sol directo al día. _(luz directa: mín 6 h, ideal 6 o más h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con poca luz se ahíla (tallos largos y débiles), florece poco y las plantas tienden a tumbarse.
  - 📚 [¿Cómo cultivar flor cosmos?](https://sitopia.com.ar/como-cultivar-flor-cosmos/) — Sitopia (Argentina)
- **Cosecha** (🟡 5/10): No es hortaliza; se 'cosechan' las flores. Floración prolongada desde primavera-verano hasta otoño (aprox. 2-3 meses desde la siembra hasta las primeras flores). Podas/despuntes regulares estimulan el crecimiento y prolongan la floración; cortar flores para vaso favorece nueva floración.
  - ✅ *Listo para cosechar:* Flores completamente abiertas y de color pleno; para flor de corte se cortan cuando los pétalos están abiertos y el centro aún firme.
  - 📚 [¿Cómo cultivar flor cosmos?](https://sitopia.com.ar/como-cultivar-flor-cosmos/) — Sitopia (Argentina); [Cosmos: siembra y plantación](https://www.promessedefleurs.es/consejos-plantas-jardin/fichaplanta/cosmos-siembra-y-plantacion/) — Promesse de Fleurs (Francia)
- **Germinación** (🟡 6/10): Aproximadamente 7 a 21 días según la variedad y la temperatura; mantener el suelo moderadamente húmedo durante la germinación.
  - 📚 [¿Cómo cultivar flor cosmos?](https://sitopia.com.ar/como-cultivar-flor-cosmos/) — Sitopia (Argentina); [Flor del Cosmos, el seto perfecto para la huerta](https://www.lahuertinadetoni.es/flor-del-cosmos-el-seto-perfecto-para-la-huerta/) — La Huertina de Toni (España)
- **Trasplante** (🔴 4/10): Si se hace en almácigo, se trasplanta cuando los plantines tienen varias hojas verdaderas y ya no hay riesgo de heladas (aprox. 3-5 semanas desde la siembra). También admite siembra directa, en cuyo caso no requiere trasplante.
  - 🌱 *Listo para trasplantar:* Plantines con 4-6 hojas verdaderas, robustos, y sin riesgo de heladas para pasar a suelo definitivo.
  - 📚 [¿Cómo cultivar flor cosmos?](https://sitopia.com.ar/como-cultivar-flor-cosmos/) — Sitopia (Argentina)
- **Longevidad** (🟡 7/10): Anual: germina, florece abundantemente en primavera-verano-otoño y muere al final del verano/otoño. Suele resembrarse sola (autosiembra) si se dejan secar algunas flores.
  - 📚 [Flor del Cosmos, el seto perfecto para la huerta](https://www.lahuertinadetoni.es/flor-del-cosmos-el-seto-perfecto-para-la-huerta/) — La Huertina de Toni (España); [Cosmos: siembra y plantación](https://www.promessedefleurs.es/consejos-plantas-jardin/fichaplanta/cosmos-siembra-y-plantacion/) — Promesse de Fleurs (Francia)
- **Trucos** (🟡 6/10): No abonar en exceso (el exceso de nitrógeno da follaje y poca flor). Despuntar/podar regularmente para ramificar y prolongar la floración. Plantar como seto en el lindero de la huerta para atraer polinizadores. Dejar secar algunas flores para autosiembra al año siguiente. Tutorar las variedades altas para que no se tumben con el viento.
  - 📚 [Flor del Cosmos, el seto perfecto para la huerta](https://www.lahuertinadetoni.es/flor-del-cosmos-el-seto-perfecto-para-la-huerta/) — La Huertina de Toni (España); [¿Cómo cultivar flor cosmos?](https://sitopia.com.ar/como-cultivar-flor-cosmos/) — Sitopia (Argentina)
- **Riesgos / a evitar** (🟡 6/10): El exceso de riego/mal drenaje provoca enfermedades de raíz. El exceso de abono suprime la floración. Variedades altas pueden tumbarse con viento si no se tutoran.
  - 📚 [¿Cómo cultivar flor cosmos?](https://sitopia.com.ar/como-cultivar-flor-cosmos/) — Sitopia (Argentina); [Flor del Cosmos, el seto perfecto para la huerta](https://www.lahuertinadetoni.es/flor-del-cosmos-el-seto-perfecto-para-la-huerta/) — La Huertina de Toni (España)
- **Plagas y enfermedades** (🟡 5/10): Principalmente podredumbre de raíz (por exceso de humedad) y oídio. Se previenen con buen drenaje y evitando el riego excesivo (se menciona tratamiento preventivo con equisetum/cola de caballo).
  - 📚 [¿Cómo cultivar flor cosmos?](https://sitopia.com.ar/como-cultivar-flor-cosmos/) — Sitopia (Argentina)
- **Se asocia bien con** (🟡 5/10): Se combina bien con caléndula y zinnia. Como flor atractora de polinizadores y refugio de fauna benéfica, funciona bien plantada en bordes de la huerta junto a hortalizas de fruto.
  - 📚 [¿Cómo cultivar flor cosmos?](https://sitopia.com.ar/como-cultivar-flor-cosmos/) — Sitopia (Argentina); [Flor del Cosmos, el seto perfecto para la huerta](https://www.lahuertinadetoni.es/flor-del-cosmos-el-seto-perfecto-para-la-huerta/) — La Huertina de Toni (España)
- **Evitar cerca de** (🔴 2/10): Sin dato confiable de incompatibilidades específicas. Como consideración: no ubicarlo junto a cultivos muy exigentes en nitrógeno/muy abonados, ya que ese ambiente rico reduce su floración.
  - 📚 [Flor del Cosmos, el seto perfecto para la huerta](https://www.lahuertinadetoni.es/flor-del-cosmos-el-seto-perfecto-para-la-huerta/) — La Huertina de Toni (España)

<a id="girasol"></a>
## Girasol  ·  *Helianthus annuus*

- **Fecha/s de siembra** (🟡 6/10): En GBA sembrar en primavera, cuando ya no hay riesgo de heladas (aprox. septiembre a noviembre/diciembre). Fuente argentina: 'La época para sembrarlo es en primavera, cuando ya no existe el riesgo de heladas'.
  - 📚 [Cómo cultivar tus propios girasoles en el jardín](https://www.lanacion.com.ar/revista-jardin/como-cultivar-tus-propios-girasoles-en-el-jardin-nid18122021/) — La Nación / Revista Jardín (Argentina)
- **Forma/s de siembra** (🟡 6/10): Preferentemente siembra directa: se coloca la semilla en su lugar definitivo porque germina muy rápido y no le gusta el trasplante. También puede hacerse en maceta/almácigo para trasplantar después. En huerta ornamental conviene la siembra directa en línea, dejando distancia entre plantas.
  - 📚 [Cómo cultivar tus propios girasoles en el jardín](https://www.lanacion.com.ar/revista-jardin/como-cultivar-tus-propios-girasoles-en-el-jardin-nid18122021/) — La Nación / Revista Jardín (Argentina)
- **Suelo** (🟡 6/10): ⬜ **`RUSTICO_TOLERANTE`** (Rústico / tolerante) — Rústico: 'prospera en un amplio rango de suelos y tolera la sequía'. Va bien en suelo suelto y profundo (permite un buen anclaje de la raíz pivotante y de plantas altas). No es exigente, pero responde a suelos fértiles y bien drenados.
  - ⚠️ *Si no se cumple:* En suelos muy compactados o poco profundos las plantas crecen menos, con capítulos (flores) más chicos y mayor riesgo de vuelco. El encharcamiento favorece podredumbres de tallo y raíz.
  - 📚 [Cómo cultivar tus propios girasoles en el jardín](https://www.lanacion.com.ar/revista-jardin/como-cultivar-tus-propios-girasoles-en-el-jardin-nid18122021/) — La Nación / Revista Jardín (Argentina)
- **Luz** (🟡 7/10): ☀️ **`PLENO_SOL`** (Pleno sol) — Necesita pleno sol para una buena floración; cuanto más sol, mejor desarrollo y tamaño de flor. Es una planta heliófila que orienta sus capítulos hacia el sol. _(luz directa: mín 6 h, ideal 8 o más h; sin sol directo: no)_
  - ⚠️ *Si no se cumple:* Con sombra o pocas horas de sol se ahíla (tallos largos y débiles), florece mal, da capítulos pequeños y se inclina buscando la luz.
  - 📚 [Cómo cultivar tus propios girasoles en el jardín](https://www.lanacion.com.ar/revista-jardin/como-cultivar-tus-propios-girasoles-en-el-jardin-nid18122021/) — La Nación / Revista Jardín (Argentina)
- **Cosecha** (🟡 6/10): Las variedades de jardín florecen a los ~40 días desde la siembra; la etapa de floración dura de 20 a 35 días según la variedad. Para cosechar semillas se espera a que el capítulo madure y seque (más allá de la floración).
  - ✅ *Listo para cosechar:* Flor abierta y coloreada para disfrute ornamental; para semilla, 'cuando el disco central está seco, se extraen las semillas' (dorso del capítulo amarillo-marrón y semillas firmes).
  - 📚 [Cómo cultivar tus propios girasoles en el jardín](https://www.lanacion.com.ar/revista-jardin/como-cultivar-tus-propios-girasoles-en-el-jardin-nid18122021/) — La Nación / Revista Jardín (Argentina)
- **Germinación** (🟡 6/10): Germina muy rápido, típicamente en pocos días (aprox. 5-10 días con suelo cálido y húmedo).
  - 📚 [Cómo cultivar tus propios girasoles en el jardín](https://www.lanacion.com.ar/revista-jardin/como-cultivar-tus-propios-girasoles-en-el-jardin-nid18122021/) — La Nación / Revista Jardín (Argentina)
- **Trasplante** (🟡 5/10): Generalmente NO requiere trasplante: conviene siembra directa porque germina rápido y la raíz pivotante sufre con el trasplante. Si se hace en maceta, trasplantar muy joven (plantín pequeño) para minimizar el daño de raíz.
  - 🌱 *Listo para trasplantar:* Si se trasplanta, hacerlo con plantín pequeño (2-4 hojas verdaderas) y cepellón entero para no dañar la raíz principal.
  - 📚 [Cómo cultivar tus propios girasoles en el jardín](https://www.lanacion.com.ar/revista-jardin/como-cultivar-tus-propios-girasoles-en-el-jardin-nid18122021/) — La Nación / Revista Jardín (Argentina)
- **Longevidad** (🟡 7/10): Anual: completa su ciclo en una sola temporada (siembra en primavera, floración en verano y muerte tras la maduración de semillas). Cada planta suele dar un capítulo principal (las variedades ramificadas dan varias flores).
  - 📚 [Cómo cultivar tus propios girasoles en el jardín](https://www.lanacion.com.ar/revista-jardin/como-cultivar-tus-propios-girasoles-en-el-jardin-nid18122021/) — La Nación / Revista Jardín (Argentina)
- **Trucos** (🟡 6/10): Siembra directa escalonada cada 2-3 semanas para floración continua. Una cobertura de paja (mulch) y riego regular promueven girasoles más grandes. Tutorar las variedades altas para evitar vuelcos por viento. Sembrar en línea al fondo/norte de los canteros para no dar sombra a otras hortalizas.
  - 📚 [Cómo cultivar tus propios girasoles en el jardín](https://www.lanacion.com.ar/revista-jardin/como-cultivar-tus-propios-girasoles-en-el-jardin-nid18122021/) — La Nación / Revista Jardín (Argentina)
- **Riesgos / a evitar** (🟡 5/10): Plantas altas: riesgo de vuelco por viento si el suelo es superficial o no se tutoran. Exceso de humedad/mal drenaje favorece podredumbres de tallo y raíz. Las semillas maduras atraen aves, que pueden dañar los capítulos.
  - 📚 [Plagas y enfermedades más comunes del cultivo del girasol](https://www.lahuertinadetoni.es/plagas-y-enfermedades-mas-comunes-del-cultivo-del-girasol/) — La Huertina de Toni (España); [Cómo cultivar tus propios girasoles en el jardín](https://www.lanacion.com.ar/revista-jardin/como-cultivar-tus-propios-girasoles-en-el-jardin-nid18122021/) — La Nación / Revista Jardín (Argentina)
- **Plagas y enfermedades** (🟡 6/10): Plagas: gusanos grises (orugas cortadoras), gusanos de alambre y gusanos blancos que atacan raíces, gorgojos/escarabajos que dañan hojas, y ocasionalmente mosca blanca, pulgones y otras orugas. También las aves comen las semillas del capítulo. Enfermedades: podredumbre húmeda de la base del tallo, mildiu (detiene el crecimiento), verticilosis, alternaria, roya (manchas anaranjadas) y podredumbres bacterianas.
  - 📚 [Plagas y enfermedades más comunes del cultivo del girasol](https://www.lahuertinadetoni.es/plagas-y-enfermedades-mas-comunes-del-cultivo-del-girasol/) — La Huertina de Toni (España)
- **Se asocia bien con** (🟡 5/10): Da sombra y tutor natural a: tomates (los protege del sol más fuerte), zapallos/calabazas y calabacines, porotos/judías trepadoras (aprovechan la altura del girasol para trepar), lechugas y espinacas (evita que se quemen), y ajo y cebolla (no compiten por luz ni nutrientes).
  - 📚 [Asociación de cultivos: ¿con qué plantas es más compatible el girasol y por qué?](https://www.elespectador.com/la-huerta/asociacion-de-cultivos-con-que-plantas-es-mas-compatible-el-girasol-y-por-que/) — El Espectador / La Huerta (Colombia)
- **Evitar cerca de** (🔴 2/10): Sin dato confiable de fuente técnica argentina. Consideración práctica: por su gran porte da mucha sombra, por lo que conviene NO plantarlo del lado que dé sombra a cultivos que exigen pleno sol (tomate, pimiento, berenjena si quedan sombreados) ni tan cerca que compitan por agua y nutrientes. (Se le atribuye efecto alelopático sobre papa y poroto, pero no se halló fuente confiable que lo confirme.)
  - 📚 _(sin fuente registrada)_


---

## 📚 Índice de fuentes citadas

- Asociación de Cultivos en el Huerto: compatibilidad entre plantas — Agrohuerto (España) · https://www.agrohuerto.com/asociacion-de-cultivos-compatibilidad-entre-plantas/
- Cultivo de Salvia officinalis en el huerto — Agromática (España, divulgativa) · https://www.agromatica.es/cultivo-de-salvia-en-el-huerto/
- Cómo cultivar ají/chile en casa (Alta Huerta) — Alta Huerta (Argentina) · https://altahuerta.com/aji-chile/
- El cultivo del laurel — Botanical-online (España) · https://www.botanical-online.com/cultivo/laurus-nobilis-como-plantar-cultivo
- El cultivo de la menta piperita — Botanical-online (España, divulgativa) · https://www.botanical-online.com/cultivo/menta-como-plantar-cuidados
- El cultivo del tomillo: cómo plantar y cuidados — Botanical-online (España, divulgativa) · https://www.botanical-online.com/cultivo/tomillo-como-plantar-cuidados
- Las aromáticas en la huerta orgánica y su rol en el manejo de insectos — CIA Orgánico (Argentina) · https://ciaorganico.net/documypublic/366_Aromaticas_y_su_rol_en_la_huerta.pdf
- PIMIENTO (Capsicum annuum L.) - Ficha de cultivo — Cátedra de Horticultura - UNLu · https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Pimiento.pdf
- Cultivo de remolacha — Cátedra de Horticultura - Universidad Nacional de Luján · https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Remolacha.pdf
- Ficha de cultivo Tomate — Cátedra de Horticultura - Universidad Nacional de Luján · https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Tomate.pdf
- Cultivo de rúcula — Cátedra de Horticultura, Universidad Nacional de Luján · https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/R%C3%BAcula.pdf
- Taco de reina (Tropaeolum majus): la flor comestible y fácil de cuidar — De Raíz (deraiz.ar, Argentina) · https://deraiz.ar/taco-de-reina-tropaeolum-majus-la-flor-comestible-y-facil-de-cuidar-que-previene-resfrios-y-es-ideal-para-tener-en-la-huerta/
- Cómo cultivar Achicoria roja (radicchio) de manera orgánica — Eco Jardín Mágico (divulgación) · https://www.ecojardinmagico.com/como-cultivar-achicoria-roja-radicchio-de-manera-organica/
- Ejemplos de asociaciones de cultivos — Ecoagricultor · https://www.ecoagricultor.com/ejemplos-de-asociaciones-de-cultivos-a-la-hora-de-planificar-el-diseno-del-huerto/
- ¿Cómo cultivar Albahaca? - El Brote Urbano — El Brote Urbano (Argentina) · https://www.elbroteurbano.com/como-cultivar-albahaca/
- ¿Cómo cultivar Perejil? - El Brote Urbano — El Brote Urbano (Argentina) · https://www.elbroteurbano.com/como-cultivar-perejil/
- ¿Cómo cultivar Apio? — El Brote Urbano · https://www.elbroteurbano.com/como-cultivar-apio/
- ¿Cómo cultivar Batata? — El Brote Urbano · https://www.elbroteurbano.com/como-cultivar-batata/
- ¿Cómo cultivar Berenjena? — El Brote Urbano · https://www.elbroteurbano.com/como-cultivar-berenjena/
- ¿Cómo cultivar Brócoli? — El Brote Urbano · https://www.elbroteurbano.com/como-cultivar-brocoli/
- ¿Cómo cultivar Coliflor? — El Brote Urbano · https://www.elbroteurbano.com/como-cultivar-coliflor/
- ¿Cómo cultivar Pepino? — El Brote Urbano · https://www.elbroteurbano.com/como-cultivar-pepino/
- ¿Cómo cultivar Zapallito Redondo y Zuccini? — El Brote Urbano · https://www.elbroteurbano.com/como-cultivar-zapallito-redondo-zuccini/
- ¿Cómo cultivar Zapallo? — El Brote Urbano · https://www.elbroteurbano.com/como-cultivar-zapallo/
- Asociación de cultivos: ¿con qué plantas es más compatible el girasol y por qué? — El Espectador / La Huerta (Colombia) · https://www.elespectador.com/la-huerta/asociacion-de-cultivos-con-que-plantas-es-mas-compatible-el-girasol-y-por-que/
- Copete, tagete — Entrejardines (Uruguay, hemisferio sur) · https://www.entrejardines.uy/copete-tagete/
- El Suelo: calendario de siembra, abono y fertilizantes — FIQ - Universidad Nacional del Litoral (reproduce calendario INTA) · https://www.fiq.unl.edu.ar/culturacientifica/wp-content/uploads/2020/08/El-Suelo_Calendario-de-siembra-abono-y-fertilizantes_fichas-para-imprimir1.pdf
- Guía didáctica: cultivo y manejo de la papa (2022) — Facultad de Ciencias Agrarias y Forestales - UNLP · https://aulavirtual.agro.unlp.edu.ar/pluginfile.php/101164/mod_folder/content/0/Gu%C3%ADa%20papa%202022.pdf
- Cultivo de lechuga (Lactuca sativa) — Facultad de Ciencias Agrarias y Forestales, UNLP · https://aulavirtual.agro.unlp.edu.ar/mod/resource/view.php?id=96157
- Cultivo, cuidados y siembra de la cebolla — Fecoagro (Argentina) · https://www.fecoagro.com.ar/cultivo-cuidados-y-siembra-de-la-cebolla/
- Asociaciones de cultivos en nuestra huerta — Fecoagro (Federación de Cooperativas Agropecuarias) · https://www.fecoagro.com.ar/asociaciones-de-cultivos-en-nuestra-huerta/
- Cómo cultivar Rabanito en nuestra huerta — Fecoagro · https://www.fecoagro.com.ar/como-cultivar-rabanito-en-nuestra-huerta/
- Impulsando el cultivo de remolachas con éxito — Fecoagro · https://www.fecoagro.com.ar/impulsando-el-cultivo-de-remolachas-con-exito/
- Ciboulette o cebollín: características, cultivo y reproducción — Flor de Planta (Argentina) · https://www.flordeplanta.com.ar/aromaticas/ciboulette-o-cebollin-caracteristicas-cultivo-y-reproduccion/
- Nabo (Brassica rapa): Cultivo, riego y cosecha — Flor de Planta (jardinería, Argentina) · https://www.flordeplanta.com.ar/huerta/nabo-brassica-rapa-cultivo-riego-y-cosecha/
- Repollitos de Bruselas: cultivo, riego y cuidados — Flor de Planta · https://www.flordeplanta.com.ar/huerta/repollitos-de-bruselas-cultivo-riego-y-cuidados/
- Cultivo de Eneldo (Anethum graveolens) y usos — Herbotecnia (Argentina) · http://www.herbotecnia.com.ar/exo-eneldo.html
- Cultivo de Lavanda (Lavandula officinalis) y usos — Herbotecnia (Argentina) · http://www.herbotecnia.com.ar/exotica-lavanda.html
- Cultivo de Melisa (Melissa officinalis) y usos — Herbotecnia (Argentina) · http://www.herbotecnia.com.ar/exo-melisa.html
- Influencia de las fechas de siembra sobre la productividad del cultivo de eneldo en invernadero en San Pedro, Buenos Aires, Argentina — Horticultura Argentina (ASAHO) · https://www.horticulturaar.com.ar/es/articulos/influencia-de-las-fechas-de-siembra-sobre-la-productividad-del-cultivo-de-eneldo-en-invernadero-en-san-pedro-buenos-aires-argentina.html
- Cultivo de Chauchas – Cómo plantar chauchas — Huerta de Cero · https://www.huertadecero.com/cultivo-de-chauchas-como-plantar-chauchas/
- Que sembrar en Otoño-Invierno / Hemisferio Sur — Huerta de Cero · https://www.huertadecero.com/que-sembrar-en-otono-invierno-hemisferio-sur/
- Tabla de asociación de cultivos — Huertos Escolares - Ayuntamiento de Madrid · https://diario.madrid.es/huertosescolares/wp-content/uploads/sites/46/2021/11/TABLA-ASOCIACION-CULTIVOS-1.pdf
- Enfermedades del poroto (Cap. 12) — INTA - Instituto de Patología Vegetal (CIAP) · https://repositorio.inta.gob.ar/bitstream/handle/20.500.12123/18415/INTA_CIAP_InstitutodePatologiaVegetal_Popler_L.D_Enfermedades_del_poroto.pdf
- Boletín INTA-CMCBA N°99 - Frutilla — INTA / Corporación del Mercado Central de Buenos Aires · https://www.mercadocentral.gob.ar/sites/default/files/docs/boletin-INTA-CMCBA-99-frutilla.pdf
- Manual de Cultivos para la Huerta Orgánica Familiar (Pro-Huerta) — INTA / ProHuerta (EEA Cerbas) · https://usermanual.wiki/Pdf/Manual20Cultivos20Pro20Huerta2020Cerbas.1931620069/html
- Manual del ProHuerta 3. La Huerta Orgánica Intensiva — INTA ProHuerta - EEA Cerbas · https://huertasescolares.wordpress.com/wp-content/uploads/2010/02/la-huerta-organica-intensiva-cerbas.pdf
- Calendario de siembra INTA-ProHuerta — INTA ProHuerta / Ministerio de Agricultura de la Nación · https://www.argentina.gob.ar/sites/default/files/2023/08/script-tmp-inta_-calendario_de_siembra.pdf
- Planificador de huerta (ProHuerta) — INTA · https://intainforma.inta.gob.ar/wp-content/uploads/2015/05/PLANIFICADOR_DE_HUERTA.pdf
- El cultivo del cilantro - Infoagro — Infoagro (España) · https://www.infoagro.com/aromaticas/cilantro.htm
- El cultivo del orégano - Infoagro — Infoagro (España) · https://www.infoagro.com/aromaticas/oregano.htm
- El cultivo del puerro (sanidad de aliáceas) — Infoagro (España, hemisferio norte) · https://www.infoagro.com/hortalizas/puerro.htm
- El cultivo de las zanahoria todo el año — Infoagro Argentina · https://infoagro.com.ar/como-cultivar-zanahorias/
- El sembrado y cuidado de la menta en la huerta en casa — Infoagro Argentina · https://infoagro.com.ar/el-sembrado-y-cuidado-de-la-menta-en-la-huerta-en-casa/
- Lavanda: propiedades, cultivo y usos en Argentina — Infocampo (Argentina) · https://www.infocampo.com.ar/lavanda-propiedades-cultivo-y-usos-en-argentina/
- Huerta en casa: cómo cultivar orégano y tomillo (contenido INTA) — Infocampo (basado en INTA) · https://www.infocampo.com.ar/huerta-en-casa-como-cultivar-oregano-y-tomillo/
- A la sombra: hortalizas que se pueden cultivar sin luz directa — Infocampo (cita INTA) · https://www.infocampo.com.ar/a-la-sombra-cuales-son-las-hortalizas-que-se-pueden-cultivar-en-el-hogar-sin-luz-directa/
- Una fuente de hierro en casa: cómo cultivar kale en la huerta familiar — Infocampo (cita INTA/ProHuerta) · https://www.infocampo.com.ar/una-fuente-de-hierro-en-casa-como-cultivar-kale-en-la-huerta-familiar/
- Frutas frescas para el verano: los secretos para cultivar melón y sandía — Infocampo (con técnicos INTA) · https://www.infocampo.com.ar/frutas-frescas-para-el-verano-los-secretos-para-cultivar-melon-y-sandia-en-la-huerta-en-casa/
- Cómo combinar flores y aromáticas en la huerta para repeler insectos y controlar plagas — Infocampo (reproduce contenido de INTA - Agustín Colson) · https://www.infocampo.com.ar/como-combinar-flores-y-aromaticas-en-la-huerta-para-repeler-insectos-y-controlar-plagas/
- Romero: propiedades, cómo cultivarlo y aprovecharlo en la huerta — Infocampo · https://www.infocampo.com.ar/romero-propiedades-como-cultivarlo-y-aprovecharlo-en-la-huerta/
- Borraja - Borago officinalis - Fichas de plantas — Infojardín (España, hemisferio norte) · https://fichas.infojardin.com/hortalizas-verduras/borraja-borago-officinalis.htm
- Berro, Berros - Nasturtium officinale (fichas) — Infojardín (divulgación) · https://fichas.infojardin.com/hortalizas-verduras/berros-nasturtium-officinale.htm
- Borraja (Borago officinalis) - Ficha de cultivo — Jardín de Campo (semillero, Argentina) · https://jardindecampo.mitiendanube.com/productos/borraja-borago-officinalis/
- Caléndula (Calendula officinalis) - Ficha de cultivo — Jardín de Campo (semillero, Argentina) · https://jardindecampo.mitiendanube.com/productos/calendula-calendula-officinalis/
- Plagas y enfermedades más comunes del cultivo del girasol — La Huertina de Toni (España) · https://www.lahuertinadetoni.es/plagas-y-enfermedades-mas-comunes-del-cultivo-del-girasol/
- Flor del Cosmos, el seto perfecto para la huerta — La Huertina de Toni (España, hemisferio norte) · https://www.lahuertinadetoni.es/flor-del-cosmos-el-seto-perfecto-para-la-huerta/
- Huerta urbana: qué necesitás para hacer una en tu balcón — La Nación (divulgativa) · https://www.lanacion.com.ar/sociedad/huerta-urbana-que-necesitas-hacer-tu-balcon-nid2389761/
- Ajos en la huerta: por qué el otoño es el mejor momento para plantarlos — La Nación - Revista Jardín (Argentina) · https://www.lanacion.com.ar/revista-jardin/aprovecha-el-otono-para-plantar-ajos-en-tu-huerta-nid01042023/
- En la huerta: taco de reina, la flor comestible que reemplaza a las alcaparras — La Nación - Revista Jardín (Argentina) · https://www.lanacion.com.ar/revista-jardin/en-la-huerta-taco-de-reina-la-planta-de-flor-comestible-que-reemplaza-las-alcaparras-sabe-a-berro-y-nid06042021/
- Huerta en casa: cómo cultivar acelga y espinaca — La Nación - Revista Jardín (divulgativa) · https://www.lanacion.com.ar/revista-jardin/huerta-en-casa-como-cultivar-acelga-y-espinaca-las-preferidas-para-preparar-rellenos-de-tartas-y-nid28052021/
- Cómo cultivar tus propios girasoles en el jardín — La Nación / Revista Jardín (Argentina) · https://www.lanacion.com.ar/revista-jardin/como-cultivar-tus-propios-girasoles-en-el-jardin-nid18122021/
- Salvia (Salvia officinalis) - ficha — La Rural Semillería (Argentina) · https://semillasrural.com.ar/tienda/semillas/semillas-horticolas/semillas-a-granel/salvia-salvia-officinalis/
- ¿Cuándo germinar chiles picantes en Argentina? — Locos x el Picante (Argentina) · https://www.locosxelpicante.com/cuando-germinar/
- Manejo integrado de plagas asociadas al cultivo de maíz — MAIZAR · http://www.maizar.org.ar/documentos/mip%20maizar.pdf
- Cómo hacer asociaciones de cultivos en la huerta orgánica — Medio Ambiente en Acción · https://medioambienteenaccion.com.ar/contenido/3938/como-hacer-asociaciones-de-cultivos-en-la-huerta-organica
- Calendario de siembra — Mi Huerta (basado en ProHuerta) · https://www.mihuerta.org.ar/wp-content/uploads/2013/11/Calendario-de-siembra.pdf
- Mi casa, mi huerta - Técnicas de agricultura urbana — Ministerio de Agricultura, Ganadería y Pesca de la Nación (MAGyP) · https://www.magyp.gob.ar/sitio/areas/nuestra-huerta/pdf/mi-casa-mi-huerta.pdf
- Mi huerta agroecológica - Manual de huertas — Ministerio de Salud de la Provincia de Buenos Aires · https://www.ms.gba.gov.ar/sitios/alimentacionsaludable/wp-content/uploads/sites/251/2023/12/MANUAL-DE-HUERTAS.pdf
- Flores que protegen el huerto — Mundo Agropecuario · https://mundoagropecuario.com/flores-que-protegen-el-huerto/
- Cómo cultivar coles de bruselas o repollitos — Mundo Huerto (España, hemisferio norte) · https://www.mundohuerto.com/cultivos/col-bruselas
- Cómo sembrar berros — Mundo Huerto (divulgación) · https://www.mundohuerto.com/cultivos/berro/como-sembrar
- Aromas de la huerta: Romero — Municipalidad de Villa Gesell · https://municipalidadvgb.gob.ar/aromas-de-la-huerta-romero/
- Huerta: prevenir plagas con aromáticas y flores — Noticias Agropecuarias (contenido INTA) · https://www.noticiasagropecuarias.com/2020/10/14/huerta-prevenir-plagas-con-aromaticas-y-flores/
- Cómo cultivar kale en la huerta familiar — Perfil (nota técnica atribuida a INTA EEA Anguil / AER Santa Rosa) · https://www.perfil.com/noticias/agro/como-cultivar-kale-en-la-huerta-familiar.phtml
- Manejo de gusano cogollero en cultivos de maíz — Pioneer Argentina · https://www.pioneer.com/cmroot/international/argentina_intl/agronomia/manejo_de_gusano_cogollero_en_maiz.pdf
- Berro — Guía de Cultivo y Cuidados — PlotMyGarden (divulgación) · https://plotmygarden.com/es/plants/watercress-herb
- Cómo cultivar zanahorias en el huerto | Guía 2026 — Portal Frutícola · https://www.portalfruticola.com/noticias/2026/02/23/zanahorias/
- Especies hortícolas, asociaciones favorables entre ellas — Portal Frutícola · https://www.portalfruticola.com/noticias/2020/09/24/asociaciones-favorables-entre-especies-horticolas/
- Guía sobre plagas y enfermedades en el cultivo de sandía y melón — Portal Frutícola · https://www.portalfruticola.com/noticias/2026/01/29/sandia-y-melon/
- Cosmos: siembra y plantación — Promesse de Fleurs (Francia) · https://www.promessedefleurs.es/consejos-plantas-jardin/fichaplanta/cosmos-siembra-y-plantacion/
- Achicoria (Cichorium intybus) — SIB - Parques Nacionales, Argentina · https://sib.gob.ar/especies/cichorium-intybus
- Nasturtium officinale (berro) — SIB - Parques Nacionales, Argentina · https://sib.gob.ar/especies/nasturtium-officinale
- Epilachna paenulata (vaquita del zapallo) — SINAVIMO - SENASA Argentina · https://www.sinavimo.gob.ar/plaga/epilachna-paenulata
- Laurus nobilis (Lauraceae) especie naturalizada en la República Argentina — SciELO Argentina / Darwiniana · https://www.scielo.org.ar/scielo.php?script=sci_arttext&pid=S1851-23722007000200016
- ¿Cómo cultivar cilantro? - Sitopia — Sitopia (Argentina) · https://sitopia.com.ar/como-cultivar-cilantro/
- ¿Cómo cultivar flor cosmos? — Sitopia (Argentina) · https://sitopia.com.ar/como-cultivar-flor-cosmos/
- Cómo cultivar orégano, tomillo y albahaca (contenido INTA) — Supercampo / INTA · https://supercampo.perfil.com/2019/11/como-cultivar-oregano-tomillo-y-albahaca/
- Calendarios de Siembra (aptos zona Argentina) — UNIDA · https://www.unida.org.ar/Virtuales/Huerta/Calendarios%20de%20Siembra.pdf
- Frutilla (ficha de cultivo) — Universidad Nacional de Luján - Cátedra de Horticultura · https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Frutilla.pdf
- Manual para la realización de una huerta-jardín (2021) — Universidad Nacional de Luján - Cátedra de Horticultura · https://www.hort.unlu.edu.ar/sites/www.hort.unlu.edu.ar/files/site/Manual%20Huerta-jard%C3%ADn%202021.pdf
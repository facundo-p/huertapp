---
name: especie
description: Agregar, sacar o corregir una especie del catálogo. Usar cuando el pedido toque los datos de una planta — calendario de siembra, días a cosecha o germinación, temperaturas, asociaciones, o sumar/quitar una especie entera.
---

# Tocar una especie

El catálogo tiene 55 especies en dos capas, y la mitad de los errores acá salen
de editar la capa equivocada. Además hay **once variedades** que el build deriva
de esas especies: son 66 entradas en total, y tienen su propia sección abajo.

| Capa | Archivo | Qué vive ahí |
|---|---|---|
| Base citable | `data/huerta_gba.json` | Lo que dijeron las fuentes: textos, `fuentes[]` con URL, `confianza`. Se toca poco. |
| Interpretación | `data/enriquecimiento.json` | **Acá se edita.** Calendario en meses, días, temperaturas, asociaciones, cuidados. |
| Generado | `data/huerta_gba_enriquecido.json` | Nunca a mano. Hay un hook que lo bloquea. |

El build **exige que las dos primeras tengan exactamente los mismos slugs**: si
falta una de un lado, falla con el slug que sobra o falta. El slug sale de
`slugify(nombre_comun)` — ver `scripts/slugs.mjs`.

## Antes de escribir nada

**Ninguna decisión agronómica se toma por criterio propio.** Si el dato nuevo no
tiene fuente, no entra: se deja como estaba y se le dice al usuario qué falta.
Las fuentes válidas son las que ya usa el repo (INTA, ProHuerta, UNLu, UNLP,
FAUBA, universidades, extensiones agrícolas) o equivalentes verificables.

Si el pedido es "corregí X porque en mi huerta pasa Y": eso es observación del
usuario, vale, y va anotado como tal en `derivacion` o en `revisar`, con la
confianza que corresponda — no disfrazado de fuente.

## Corregir datos de una especie existente

1. Abrí su entrada en `data/enriquecimiento.json` (la clave es el slug).
2. Cambiá lo que corresponda. Los campos por especie:
   - `calendario.fuente_meses` — los cuatro arrays de meses (1-12), ordenados,
     sin repetidos, **sin solapamiento entre ideal y posible**.
   - `calendario.metodo_por_mes` — claves ⊆ meses de siembra, y **todo mes de
     siembra tiene que estar cubierto**. Valores: `directa`, `almacigo`,
     `directa|almacigo`, `almacigo_protegido`, `plantacion`.
   - `calendario.derivacion` — de qué texto salió. No puede quedar vacío.
   - `calendario.confianza` — 1 a 10.
   - `dias_a_trasplante`, `dias_a_cosecha`, `dias_germinacion` — `{min, max}`
     con min ≤ max, o `null`. Si hay meses de trasplante, `dias_a_trasplante`
     no puede ser null.
   - `temperaturas` — `germinacion` y `crecimiento` con sus rangos,
     `helada` del enum, `nota`, `fuentes`.
   - `asociaciones.buenas` / `.malas` — ver abajo.
   - `cuidados` — ver abajo.
3. Regenerá y verificá: `npm run data:build && npm test`.
4. Si tocaste el calendario, **mirá el afinado** (ver más abajo).

## Agregar una especie

1. **La base primero.** Agregá la especie a `data/huerta_gba.json` con todos sus
   campos y sus `fuentes` con URL. Sin esto el build falla.
2. **El overlay después**, con el mismo slug. Copiá la estructura de una especie
   parecida del mismo grupo, no una plantilla vacía: se ve enseguida qué campos
   suelen ir juntos.
3. **Las asociaciones son bidireccionales.** Si la nueva especie declara buena
   compañía con `zanahoria`, agregá la contraparte en `zanahoria`. Nadie lo
   valida automáticamente y quedan avisos que aparecen en una ficha y no en la
   otra.
4. `npm run data:build && npm test`. El test de estructura corre 8 chequeos por
   especie: se va a quejar de lo que falte.
5. El conteo de 55 se verifica en `tests/data/enriquecido.test.ts`, contando las
   entradas **sin** `variedad_de` (las variedades no suman al catálogo).
   Actualizalo, y también las menciones en `README.md` y en la UI si las hay
   (`grep -rn "55 especies" src README.md`). En Explorar el número sale del dato,
   no está escrito.

## Sacar una especie

1. Sacala de **las dos** capas. Si tenía `variedades`, se van con ella: son
   suyas y no existen sin el padre.
2. `grep -rn "<slug>" data/ src/ tests/` — pueden quedar referencias en las
   asociaciones de otras especies, y ahí el build falla con un slug que no
   resuelve.
3. Revisá `src/lib/data/slugs.ts` por si tenía alias.
4. Actualizá el conteo (ver arriba) y regenerá.

## Los cuidados (`cuidados`)

Lo que se hace **entre la siembra y la cosecha**: la sección "Mientras crece" de
la ficha. Cada especie tiene que tener al menos uno; hay un test que lo exige.

```json
{ "tipo": "raleo",
  "cuando": "Apenas se estorban, y no más tarde",
  "que_hacer": "Sacá las de más y dejá espacio entre planta y planta.",
  "por_que": "Sin raleo a tiempo salen chicas y torcidas.",
  "de": "trucos" }
```

- **`tipo`** sale de un vocabulario cerrado de 14: `raleo`, `aporque`,
  `tutorado`, `poda`, `mulch`, `blanqueo`, `riego`, `abonado`, `desmalezar`,
  `rotacion`, `polinizacion`, `proteger`, `contener`, `dividir`. Uno nuevo se
  agrega en **tres** lugares —`scripts/build-enriched.mjs`, `TipoCuidado` en
  `src/lib/data/types.ts` y el glosario— y hay un test que se asegura de que
  ninguno quede sin usar.
- **No se repite el tipo dentro de una especie**: serían dos tarjetas con el
  mismo título. Si hay dos cosas que decir sobre el riego, van en una.
- **`de` es la regla de no inventar hecha mecánica.** Dice de qué campo de
  `huerta_gba.json` sale el consejo, y el build le cuelga *sus* `fuentes` y su
  `confianza`. Si el campo no existe **o no tiene ni una URL**, el build falla.
  Pasó con `repollo.riesgos`, que habla de rotar crucíferas sin citar a nadie: el
  consejo se sacó en vez de publicarlo sin respaldo.
- **`por_que` solo si la fuente dice la consecuencia.** Es tentador completarlo
  ("sin raleo salen chicas") cuando la fuente solo dijo "ralear para dar
  espacio". Eso es inventar. Va `null` y listo.

## Las pistas de germinación (`germinacion_pistas`)

Por qué esta semilla puede no estar saliendo, cuando la respuesta **depende de
la especie**. Alimentan el "¿Por qué puede estar tardando?" de una planta.

```json
{ "tipo": "luz",
  "texto": "La semilla de berro **necesita luz para germinar**: va sobre la superficie…",
  "de": "forma_siembra" }
```

Mismo mecanismo de respaldo que los cuidados (`de` → fuentes heredadas), y nueve
tipos: `profundidad`, `luz`, `humedad`, `pretratamiento`, `paciencia`, `varias`,
`poder`, `latencia`, `vegetativo`.

- **Son opcionales**, a diferencia de los cuidados: una especie sin nada
  particular que decir se queda con los tres chequeos genéricos.
- `profundidad` y `humedad` **reemplazan** al chequeo genérico correspondiente
  en vez de sumarse — ver `REEMPLAZA` en `src/lib/huerta/germinacion.ts`.
- El texto admite `**negritas**`.
- Antes de decidir que una especie no tiene pista, releé su `forma_siembra` y su
  `germinacion` en la base: casi siempre el dato está, enterrado en el párrafo.

## Las variedades (`variedades`)

El catálogo son 55 especies, pero **66 entradas**: once son variedades que no se
cultivan igual que su especie (coliflor temprana y tardía, chaucha enana y de
enrame, tomate determinado…). El build las expande a especies completas, así que
río abajo son una especie más — el motor de tareas y la ficha no saben que
existen. Decisión y fundamento: issue #8.

**Una variedad se escribe solo con lo que difiere.** Todo lo demás lo hereda, y
no como copia: si corregís el padre, las derivadas se corrigen solas.

Van en **las dos capas**, igual que una especie:

```jsonc
// data/huerta_gba.json → dentro de la especie
"variedades": [
  { "nombre": "Temprana",
    "difiere_en": {
      "cosecha": { "valor": "…", "fuentes": [...], "confianza": 7 }
    } }
]
```
```jsonc
// data/enriquecimiento.json → dentro de la especie
"variedades_derivado": {
  "temprana": {
    "nombre_comun": "Coliflor temprana",     // opcional; si no, se compone
    "derivacion": "…",                       // OBLIGATORIA
    "calendario": { … },                     // opcional
    "dias_a_cosecha": { "min": 90, "max": 90 },
    "cuidados_quita": ["tutorado"]
  }
}
```

**`variedades_derivado` y no `variedades`.** El merge del build es shallow: una
clave con el mismo nombre pisaría el array citable entero, fuentes incluidas, sin
que nada avise. Misma trampa que obligó a `transplante_signos` y a
`riego_regimen`.

### Las seis cosas que rompen el build

1. **Cada `difiere_en[campo]` es citable**: fuentes con URL y confianza 1-10. El
   `valor` sale **textual** de la prosa del padre — la frase que habla de esa
   variedad, recortada, nunca reescrita.
2. **`difiere_en` vacío *y* `cuidados_quita` vacío.** El diff es la decisión. A
   veces el diff es lo que la variedad **no** lleva: al tomate determinado lo
   define que no se tutora, no un dato nuevo.
3. **El calendario no agrega meses**: `ideal ∪ posible` de la variedad ⊆ el del
   padre. Si necesita uno más, **el que está mal es el padre** y se corrige allá.
4. **Los días se parten, no se calculan**: `dias_a_cosecha` (y trasplante, y
   germinación) ⊆ el rango del padre. Esta es la que más protege y la menos
   obvia — ver la trampa de abajo.
5. **`derivacion` obligatoria**, y `cuidados_quita` solo saca cuidados que el
   padre tenga.
6. **Ninguna derivada queda sin cuidados.**

Las 3 y la 4 tienen tests con datos rotos a propósito en
`tests/variedades-build.test.ts`. Si tocás `scripts/validar-variedades.mjs`,
comprobá que esos tests todavía **fallen** al neutralizarla: una validación que
solo se prueba con datos buenos pasa aunque esté comentada.

### La trampa: convertir unidades es inventar

El apio quedó fuera del catálogo por esto. Su fuente da *"autoblanqueo 80-100
días **desde trasplante**"* y el padre publica *120-150 **desde siembra***
(INTA). Convertir exige sumarle los `dias_a_trasplante`, y el resultado —150-210—
**queda fuera del rango del padre**: las dos fuentes no coinciden en el total.
Publicar esa cuenta sería un cálculo propio disfrazado de dato.

Cuando la validación 4 te tire, no ensanches el rango del padre para que entre.
Preguntate si estás convirtiendo unidades entre dos fuentes. Ver #44.

### Quitar un cuidado no reescribe la fuente

Al tomate determinado se le sacan `tutorado` y `poda` porque el texto de sus
trucos dice *"…en variedades indeterminadas"*. **El texto se hereda entero y sin
tocar**: la variedad muestra la frase completa y no muestra la tarjeta, y así el
razonamiento queda verificable a ojo. Ese razonamiento va en `derivacion`, que es
donde va lo que pensamos nosotros — nunca en un `valor`, que es donde va lo que
dijo una fuente.

Si una variedad override un campo, los cuidados y las pistas que salen de ese
campo (`de`) **reanclan sus fuentes a las de la variedad**. Lo hace el build
solo; está acá porque explica por qué la misma pista cita distinto en el padre y
en la hija.

### Cuando una variedad no cambia el cultivo

No entra al catálogo. Que la albahaca sea morada o genovesa no cambia nada, y
además **no hay fuente que diga que se cultivan igual** — afirmarlo sería
inventar. Quien quiera dejarlo anotado tiene el campo libre de variedad al dar de
alta la planta, que es dato suyo y vive en Mi huerta.

## Después de tocar el calendario: mirá el afinado

Los meses que escribís son la capa citable. El modelo los recorta a décadas, y
**solo puede recortar, nunca agregar** — si intenta agregar, tira.

```bash
npm run data:build
npm run data:tabla      # → data/REVISION_CALENDARIO.md
```

En ese archivo, para la especie que tocaste **y para sus variedades** —que
aparecen con su `nombre_comun` ("Coliflor temprana") y se afinan por separado
porque tienen su propio ciclo—, revisá:

- **La sección "qué recortó el modelo"**: cada recorte con su regla y su motivo.
  Si un recorte no tiene sentido agronómico, el bug es del modelo → `/modelo-clima`.
- **Huecos**: una década degradada con vecinas ideales de los dos lados es casi
  siempre un criterio incoherente, no un dato. Ya pasó con el tomate y con el
  zapallito.
- **Ventanas vacías**: si una especie quedó sin ninguna década ideal en alguna
  de las tres zonas, algo está mal.

Y mirá cómo se ve, que es distinto de que los tests pasen:

```bash
npm run shots
```

→ `e2e/shots/fase-N/calendario-completo.png` y la ficha de la especie.

## Verificación final

```bash
npx tsc -b && npm test && npm run e2e
```

Y en el resumen al usuario, decile **qué fuente respalda cada cambio** y con qué
confianza. Es el contrato del producto: nada entra sin decir de dónde salió.

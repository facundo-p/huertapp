---
name: especie
description: Agregar, sacar o corregir una especie del catálogo. Usar cuando el pedido toque los datos de una planta — calendario de siembra, días a cosecha o germinación, temperaturas, asociaciones, o sumar/quitar una especie entera.
---

# Tocar una especie

El catálogo tiene 55 especies en dos capas, y la mitad de los errores acá salen
de editar la capa equivocada.

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
5. El conteo de 55 está hardcodeado en `tests/data/enriquecido.test.ts`.
   Actualizalo, y también las menciones en `README.md` y en la UI si las hay
   (`grep -rn "55 especies" src README.md`).

## Sacar una especie

1. Sacala de **las dos** capas.
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

## Después de tocar el calendario: mirá el afinado

Los meses que escribís son la capa citable. El modelo los recorta a décadas, y
**solo puede recortar, nunca agregar** — si intenta agregar, tira.

```bash
npm run data:build
npm run data:tabla      # → data/REVISION_CALENDARIO.md
```

En ese archivo, para la especie que tocaste, revisá:

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

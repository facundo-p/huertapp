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
| Interpretación | `data/enriquecimiento.json` | **Acá se edita.** Calendario en meses, días, temperaturas, asociaciones, cuidados, riego y maceta. |
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

`revisar` **no llega a la app**: el build lo descarta. Es nota interna, así que
sirve para dejar constancia de una divergencia entre fuentes sin publicarla.

Y un dato de un semillero o de un folleto **no es dato del catálogo** aunque sea
cierto: es del sobre de esa persona, y el sobre de otra puede decir otra cosa.
Ver la issue #35.

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
   - `riego_regimen`, `maceta_medidas` — ver abajo. **Ojo con el nombre.**
3. Regenerá y verificá: `npm run data:build && npm test`.
4. Si tocaste el calendario, **mirá el afinado** (ver más abajo).

## Agregar una especie

1. **La base primero.** Agregá la especie a `data/huerta_gba.json` con todos sus
   campos y sus `fuentes` con URL. Sin esto el build falla.
2. **El overlay después**, con el mismo slug. Copiá la estructura de una especie
   parecida del mismo grupo, no una plantilla vacía: se ve enseguida qué campos
   suelen ir juntos.
   Sin `temperaturas` completas el build revienta con un **TypeError crudo**, no
   con un mensaje de validación. `riego` y `maceta`, en cambio, pueden faltar.
3. **Las asociaciones son bidireccionales.** Si la nueva especie declara buena
   compañía con `zanahoria`, agregá la contraparte en `zanahoria`. Nadie lo
   valida automáticamente y quedan avisos que aparecen en una ficha y no en la
   otra.
4. `npm run data:build && npm test`. El test de estructura corre 9 chequeos por
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
  agrega en **cuatro** archivos —`scripts/build-enriched.mjs`, `TipoCuidado` en
  `types.ts`, `ORDEN_CUIDADOS` y `ETIQUETA_CUIDADO` en `data/cuidados.ts`, y
  `LABORES` en `glosario.ts`— y hay un test que se asegura de que ninguno quede
  sin usar.
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

## Riego y maceta

Son los dos únicos campos partidos entre las dos capas, y por un motivo: **el
merge es shallow**. Una clave `riego` en el overlay pisaría el `Dato` de la base
entero —`valor`, `fuentes` y `confianza`— sin que nada avise. Por eso las claves
del overlay se llaman distinto.

```jsonc
// huerta_gba.json          →  el texto citable, con fuentes y confianza
"riego":  { "valor": "Regá parejo, sin encharcar. …", "fuentes": [...], "confianza": 7 }
"maceta": { "valor": "Al menos 45 cm de profundidad…", "fuentes": [...], "confianza": 7 }

// enriquecimiento.json     →  lo estructurado
"riego_regimen": "parejo",
"maceta_medidas": { "profundidad_min_cm": 45, "litros_min": 19, "plantas_por_contenedor": 1 }
```

**Los dos campos son opcionales**: `null` en las dos capas es válido y la ficha
lo muestra como "sin dato". Hoy 33 de 55 tienen riego y 26 tienen maceta.

**`riego_regimen`** sale de un enum ordinal de cuatro —`escaso`, `espaciado`,
`parejo`, `constante`— y se asigna por **coincidencia literal con la frase de la
fuente**, no por criterio agronómico. Que sea ordinal es lo que deja dibujarlo
como barrita.

- **Puede quedar sin régimen y estar bien.** Si la fuente habla de una etapa y no
  del ciclo, no hay escalón que poner: la cebolla dice "suspender 30 días antes
  de cosechar" y la zanahoria "humedad constante hasta la emergencia". Va el
  texto sin barrita.
- **Si la barrita contradice al texto citado, gana el texto.** Pasó con el apio:
  la fuente dice "abundante y parejo", tentaba `constante`, y la etiqueta habría
  discutido con la cita que está tres líneas abajo.

**`maceta_medidas`** son tres números anulables **por separado**, porque las
fuentes vienen partidas: Texas A&M publica litros y plantas, UC publica
profundidad. Exigir los tres sería inventar dos de cada tres. Las tres en `null`
hace fallar el build: si no hay ninguna, sacá el campo.

**El cuidado de riego no se reemplaza.** Son ejes que se apilan: el campo dice
**cuánta** agua, el cuidado dice **cuándo cambia** y qué pasa si no. Un cuidado
que sólo repite el campo se poda; **uno con un `cuando` real, nunca** — es lo
que el chequeo de compatibilidad de riego va a necesitar, y hay un test que lo
exige.

## Un dato que falta no es lo mismo que uno que no corresponde

La ficha los muestra distinto y no hay que elegirlo a mano: sale de
`germinacionAplica()` y `trasplanteAplica()` en `src/lib/data/especies.ts`.

- **`s/d`** — la fuente no lo dice. Se escribe qué se buscó.
- **`no aplica`** — a esa planta no le corresponde. Sin meses de trasplante no
  hay trasplante; si el método es sólo `plantacion`, no hay semilla que germinar.

Al agregar una especie, el que importa es el segundo: una de plantación pura sin
`dias_germinacion` **no está incompleta**, y decirle "sin dato" sería mentir.

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
npx tsc -b && npm test && npm run e2e && npm run shots
```

Y mirá las capturas de la especie que tocaste. Los tests no ven que un dato
quedó raro; las capturas sí.

Y en el resumen al usuario, decile **qué fuente respalda cada cambio** y con qué
confianza. Es el contrato del producto: nada entra sin decir de dónde salió.

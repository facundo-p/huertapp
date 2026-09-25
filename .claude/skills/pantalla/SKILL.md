---
name: pantalla
description: Construir una pantalla, un componente o una feature de UI. Usar cuando el pedido agregue o rediseñe algo visual — pantalla nueva, sección nueva, componente nuevo, cambio de layout.
---

# Construir UI acá

La dirección estética está definida y probada: **«Cantero»**, en dos temas
idénticos e intercambiables —`día` (papel claro) y `noche` (tierra oscura)—
que solo cambian de color. Unbounded para títulos y rótulos, Manrope para el
cuerpo. Ocre `--sol` como único acento de «acá estás» (pestaña activa, aguja de
hoy, etapa actual, acción primaria). El handoff completo está en
`docs/diseno/cantero/` y el prototipo en `cantero-referencia.html`. No la
reinventes: extendela.

## Las tres reglas de layout

1. **Reglado antes que tarjeta.** Una lista homogénea (tareas del carril,
   plantas de Mi huerta, filas del calendario, íconos del glosario) se separa
   con una hairline `--linea` de **borde a borde** y respeta el padding lateral
   por dentro (`margin-inline` negativo + `padding-inline`). La tarjeta
   (`.tarjeta`: `--papel-alto`, borde, radio 14; radio 18 la grande) queda para
   lo separable y navegable: una especie, un campo de la ficha, una entrada del
   diario. Lo destacado va con **tinte a sangre** (`--sol-velo`), sin borde ni
   radio.
2. **Pantallas principales mínimas y visuales; la densidad a un tap.** Esta
   semana, Explorar, Calendario, Compost y Mi huerta son ícono, color y forma.
   Los textos largos, las fuentes y la confianza viven en la ficha, el detalle
   y las hojas.
3. **Un token, un significado.** Todo color sale de `src/theme.css`, en los dos
   bloques de tema. Relleno y texto legible son dos tokens (`--sol` /
   `--sol-texto`). `--tinta-tenue` y `--tinta-apagada` son para metadatos,
   nunca para el dato.

## Antes de escribir CSS

- **Mirá si el componente ya existe:** `BottomSheet`, `EmptyState`, `Header`,
  `ChipHoja` (chip que abre hoja de radios), `FilaConfianza`, `DatoSection`,
  `AnilloAnual`, `GanttPlanta`, `CarrilSemana`, `CycleProgress`, `AltaPlanta`,
  `FuentesCompost`. El patrón de radios es `.opciones` en
  `components/opciones.css`. Reusar mantiene la coherencia mejor que cualquier
  guía.
- **Botón de 44 con píldora de 32 adentro.** Cuando el diseño pide un chip o
  un botón chico, el target sigue siendo 44: el `<button>` mide 44 y un `<span>`
  interno dibuja la píldora (`.carril__hecho`, `.chip-hoja`, `.fuente`).
- **Sin librerías de UI.** Es un requisito explícito del brief.

## Invariantes que un test va a verificar

`e2e/accesibilidad.spec.ts` recorre todas las pantallas. El contraste lo mide
**en los dos temas** y con datos cargados; el foco, en los dos temas y sin
datos, con un Tab por ruta de partida. Lo que se abre tocando, como Planta o
Compostera, queda sin medir el foco. Diseñá para esto desde el principio:

1. **Contraste AA.** 4,5:1 el texto normal, 3:1 el grande. Los tokens están
   calibrados a ~4,6. El test compone las capas con alpha —incluido el alpha
   del **color del texto**: `--papel-alto` de noche es semitransparente y como
   texto queda invisible; usá `--papel`. Sobre un tinte (`--sol-velo`) la
   tinta tenue baja de AA: un escalón más.
2. **Targets de 44 px.** Todo lo tocable. El test mide la caja: no ve lo que un
   margen negativo o un vecino encima le sacan. Eso lo medís vos, con
   `elementFromPoint`. Si no hay 44 posibles (las iniciales de mes en doce
   columnas), el control va en otro lado; no se exime.
3. **El color nunca solo.** Ideal/posible, y anillo externo/interno, se
   distinguen también por forma y relleno. Esto no lo mide un test: se ve en
   las capturas.
4. **Nombre accesible en todo lo interactivo.** Ícono solo → `aria-label`.
   Un chip con opción elegida dice «Grupo: Aromática».
5. **Jerarquía de encabezados sin saltos.** Un `h1` por pantalla.
6. **Foco de teclado visible.** `:focus-visible` global; sobre `--sol` o un
   fondo oscuro, revisá que `--foco` contraste.
7. **Sin transiciones de color en lo que el test mide** (la TabBar las tenía y
   el contraste fallaba según el reloj).

## Íconos

- En `src/icons/` según su familia, con `<Svg>` de `base.tsx`: viewBox 24,
  trazo 1.75, puntas y uniones redondeadas, `currentColor`.
- **Entrada nueva en el Glosario** (`src/screens/Glosario.tsx`), siempre.
- **Miralo al tamaño real.** El de cosecha se leía como tacho de basura a 21
  px.

## El bucle de verificación

No termina cuando compila. Termina cuando mirás tus capturas **en los dos
temas**.

Agregá tu pantalla a `e2e/screenshots.spec.ts` con sus estados y a
`PANTALLAS` de `accesibilidad.spec.ts`. Mientras iterás, sacá sólo las tuyas,
una corrida por tema:

```bash
FASE=dev npm run shots -- -g 'captura <nombre>$'
FASE=dev-noche TEMA=noche npm run shots -- -g 'captura <nombre>$'
```

El `$` ancla el nombre: sin él, `-g 'calendario'` corre todas las de
calendario. Con varios estados, `-g 'captura (<uno>|<otro>)$'` los saca en la
misma corrida. Después abrí los PNG de `e2e/shots/dev/` y
`e2e/shots/dev-noche/`. Acá las capturas encontraron: un ícono que se leía
como otra cosa, una lista desarmada en palabras sueltas, un botón con texto
invisible de noche, una leyenda partida del color que nombraba, una aguja que
se confundía con las marcas de mes, tres columnas de texto que eran tres
torres. Ninguna rompía un test.

Y hacé la crítica vos, antes de mostrar: qué se lee mal, qué se toca mal, qué
promete algo que no cumple.

## Textos

Español rioplatense con vos, cálido y breve. Lo que no tiene dato dice «s/d»,
no desaparece. Cuando algo no funciona en cierta plataforma, se dice **antes**.

## Verificación final

Las cuatro de `CLAUDE.md`, con las capturas en los dos temas. En el equipo,
`e2e` y `shots` los corre el tester y `tsc` y `npm test`, vos (ver `dev.md`);
si trabajás solo, todas vos:

```bash
npx tsc -b && npm test && npm run e2e
FASE=dia npm run shots && FASE=noche TEMA=noche npm run shots
```

Y abrí las de tu pantalla en `e2e/shots/dia/` y `e2e/shots/noche/`.

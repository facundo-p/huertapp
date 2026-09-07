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

`e2e/accesibilidad.spec.ts` corre sobre 10 pantallas con datos cargados, **en
los dos temas**. Diseñá para esto desde el principio:

1. **Contraste AA.** 4,5:1 el texto normal, 3:1 el grande. Los tokens están
   calibrados a ~4,6. El test compone las capas con alpha —incluido el alpha
   del **color del texto**: `--papel-alto` de noche es semitransparente y como
   texto queda invisible; usá `--papel`. Sobre un tinte (`--sol-velo`) la
   tinta tenue baja de AA: un escalón más.
2. **Targets de 44 px.** Todo lo tocable. Si no hay 44 posibles (las iniciales
   de mes en doce columnas), el control va en otro lado; no se exime.
3. **El color nunca solo.** Ideal/posible, y anillo externo/interno, se
   distinguen también por forma y relleno.
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

No termina cuando compila. Termina cuando mirás las capturas **en los dos
temas**:

```bash
FASE=cantero-dia npm run shots
FASE=cantero-noche TEMA=noche npm run shots
```

Agregá tu pantalla a `e2e/screenshots.spec.ts` con sus estados y a
`PANTALLAS` de `accesibilidad.spec.ts`. Después abrí los PNG. Acá las capturas
encontraron: un ícono que se leía como otra cosa, una lista desarmada en
palabras sueltas, un botón con texto invisible de noche, una leyenda partida
del color que nombraba, una aguja que se confundía con las marcas de mes, tres
columnas de texto que eran tres torres. Ninguna rompía un test.

Y hacé la crítica vos, antes de mostrar: qué se lee mal, qué se toca mal, qué
promete algo que no cumple.

## Textos

Español rioplatense con vos, cálido y breve. Lo que no tiene dato dice «s/d»,
no desaparece. Cuando algo no funciona en cierta plataforma, se dice **antes**.

## Verificación final

```bash
npx tsc -b && npm test && npm run e2e && FASE=cantero-dia npm run shots && FASE=cantero-noche TEMA=noche npm run shots
```

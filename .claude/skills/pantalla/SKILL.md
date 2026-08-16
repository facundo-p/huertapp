---
name: pantalla
description: Construir una pantalla, un componente o una feature de UI. Usar cuando el pedido agregue o rediseñe algo visual — pantalla nueva, sección nueva, componente nuevo, cambio de layout.
---

# Construir UI acá

La dirección estética está definida y probada: **cuaderno de campo querible**.
Papel cálido, tinta verde-oliva, etiquetas de semillas, terracota y amarillo
sol. Bordes redondeados, sombras suaves, sensación orgánica. La referencia es
un *cozy garden game*, no un admin dashboard. No la reinventes: extendela.

## El principio de producto que decide los layouts

**Pantallas principales mínimas y visuales; la densidad vive a un tap de
distancia.** Hoy, Explorar, Calendario y Mi huerta son casi puro ícono y color.
Los textos largos, las fuentes y los índices de confianza van en las pantallas
de detalle y en las hojas inferiores.

Si estás por meter un párrafo explicativo en una pantalla principal, casi
seguro va en el detalle.

## Antes de escribir CSS

- **Todo color sale de `src/theme.css`.** Si te falta un tono, se agrega ahí
  como token, con nombre semántico, y calibrado. No hay hex sueltos en los CSS
  de componentes.
- **Mirá si el componente ya existe:** `BottomSheet`, `EmptyState`, `Header`,
  `FilaChips`, `DatoSection`, `ConfidenceBadge`, `CycleProgress`,
  `MonthStrip`, `AltaPlanta`. Reusar mantiene la coherencia mejor que cualquier
  guía de estilo.
- **Sin librerías de UI.** Es un requisito explícito del brief.

## Invariantes que un test va a verificar

`e2e/accesibilidad.spec.ts` corre sobre las 7 pantallas con datos cargados.
Diseñá para esto desde el principio, que arreglarlo después es rediseñar:

1. **Contraste AA.** 4,5:1 el texto normal, 3:1 el grande o negrita grande. Los
   tokens ya están calibrados: si usás los tokens, no tenés que pensarlo. La
   jerarquía se hace con **tamaño y peso**, nunca bajando el contraste.
2. **Targets de 44 px.** Todo lo tocable. `min-height: var(--tap-min)`. Los
   enlaces dentro de texto corrido están exentos (y el test los exime).
3. **El color nunca solo.** Ideal/posible se distinguen también por forma y
   relleno; los estados de confianza, además, por el tipo de borde (sólido,
   punteado, guionado).
4. **Nombre accesible en todo lo interactivo.** Ícono solo → `aria-label`
   siempre. En listas y chips va el ícono solo; el nombre en texto aparece en
   el detalle.
5. **Jerarquía de encabezados sin saltos.** Un `h1` por pantalla.
6. **Foco de teclado visible.** Lo da `:focus-visible` global; si ponés un fondo
   oscuro, revisá que el contorno contraste (ver `AvisoActualizacion.css`).

## Íconos

El sistema de íconos es el núcleo del diseño. Ícono nuevo:

- En `src/icons/` según su familia, usando `<Svg>` de `base.tsx`: viewBox 24,
  trazo 1.75, puntas y uniones redondeadas, `currentColor`.
- **Entrada nueva en el Glosario** (`src/screens/Glosario.tsx`). El brief pide
  que el glosario explique todos los íconos; si no lo agregás, queda un símbolo
  sin traducción.
- **Miralo al tamaño real al que se va a usar**, no a 24 px en el editor. El
  ícono de cosecha se leía como un tacho de basura a 21 px porque el tejido
  vertical de la canasta parecía las costillas de un cesto. Que "cosechar" se
  lea como "borrar" es un error caro.

## El bucle de verificación

No termina cuando compila. Termina cuando mirás las capturas.

```bash
npm run shots     # hace el build solo → e2e/shots/fase-N/
```

Agregá tu pantalla a `e2e/screenshots.spec.ts` — con sus estados: vacío, con
datos, con error, con el sheet abierto. **Después abrí los PNG y miralos.** En
este repo las capturas encontraron:

- un ícono que se leía como otra cosa,
- una lista de pasos desarmada en palabras sueltas,
- un CTA abajo del pliegue,
- 20 px de desborde horizontal que recortaban diciembre,
- una celda que parecía un código de barras.

Ninguna de esas rompía un test.

Y hacé la crítica vos, antes de mostrar: qué se lee mal, qué se toca mal, qué
promete algo que no cumple. Contala junto con el resultado.

## Textos

Español rioplatense con vos, cálido y breve. Los estados vacíos pueden tener
humor suave. Cuando algo no funciona en cierta plataforma o tiene un límite, se
dice **antes** de que la persona lo intente.

## Verificación final

```bash
npx tsc -b && npm test && npm run e2e && npm run shots
```

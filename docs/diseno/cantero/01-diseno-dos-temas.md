# 01 · Diseño: dos temas, un solo diseño

Los dos temas son **el mismo diseño**. Ninguna medida, ningún radio, ningún peso
tipográfico, ninguna posición cambia entre `noche` y `día`. Cambian los valores
de color, y nada más. Esa es la restricción que hace que el switch sea un click
y no un segundo diseño a mantener.

Regla de implementación que se deriva de eso: **ningún componente escribe un
color literal**. Todo color sale de un token. Si un componente necesita un color
que no está en la tabla, el token falta — se agrega a los dos bloques, no se
hardcodea en el componente.

---

## 1. Tokens

Los nombres reutilizan los de `src/theme.css` para que los componentes que ya
existen sigan funcionando; los que el rediseño agrega van al final. Lo que
cambia es el **valor**, no el nombre.

`--papel-alto` en noche es semitransparente a propósito (44 % de `#263322`
sobre el fondo): la tarjeta flota sobre la tierra en vez de taparla.

```css
/* ============================================================
   Cantero de día — tema claro (default)
   ============================================================ */
:root,
[data-tema='dia'] {
  /* superficies */
  --papel: #f7f3e7;
  --papel-alto: #fffdf5;
  --papel-hundido: #ebe6d4;   /* chips, inputs, íconos en cuadrito */
  --papel-plano: #efeadb;     /* centro del anillo chico */
  --crema: #eae4d2;           /* etapa inactiva del ciclo */

  /* tinta */
  --tinta: #22301c;
  --tinta-alta: #1c2617;      /* títulos de tarjeta */
  --tinta-media: #44523a;
  --tinta-suave: #57654c;
  --tinta-tenue: #78856c;     /* metadatos, unidades */
  --tinta-apagada: #9aa48d;   /* ejes, etapas no alcanzadas */
  --linea: #dcd5bf;
  --linea-fuerte: #c9c1a8;

  /* huerta */
  --verde-hoja: #5d8a48;      /* "ideal" */
  --verde-prof: #4d7440;
  --salvia: #4d7440;          /* íconos de grupo sobre superficie */
  --sol: #c98718;             /* acento primario, "se puede" */
  --sobre-sol: #2a2110;       /* texto sobre --sol */
  --terracota: #a1583d;       /* trasplante */
  --terracota-suave: #e8c4b3; /* trasplante posible */
  --frambuesa: #a85c68;
  --agua: #4f7f95;            /* riego, lluvia */
  --peligro: #9e4729;

  /* anillo anual */
  --anillo-vacio: #dcd5bf;
  --anillo-vacio-int: #ebe6d4;
  --marca-mes: #1c2617cc;        /* barras de mes, anillo de 56 px */
  --marca-mes-grande: #2b332480; /* barras de mes, anillo de 146 px */
  --marca-tercio: #2b332426;     /* hairlines de década */

  /* gantt */
  --grilla-mes: #22301c26;
  --gantt-crece: #4d7440;
  --gantt-trasplante: #a1583d;
  --gantt-cosecha-a: #c98718;
  --gantt-cosecha-b: #a86a10;

  /* confianza */
  --conf-alta: #5d8a48;
  --conf-media: #c98718;
  --conf-baja: #a1583d;
  --conf-vacio: #8b9a7f66;    /* igual en los dos temas */

  /* sombras */
  --sombra-tel: 0 1px 3px rgba(74, 60, 28, .08), 0 12px 30px rgba(74, 60, 28, .08);
  --sombra-nav: 0 8px 24px rgba(74, 60, 28, .14);
}

/* ============================================================
   Cantero de noche — tema oscuro
   ============================================================ */
[data-tema='noche'] {
  --papel: #1f2a1c;
  --papel-alto: #26332270;    /* = rgb(38 51 34 / 44%) */
  --papel-hundido: #2b3826;
  --papel-plano: #243021;
  --crema: #26332f;

  --tinta: #ece6d3;
  --tinta-alta: #f3eedd;
  --tinta-media: #c9d1bd;
  --tinta-suave: #b7c0ab;
  --tinta-tenue: #93a087;
  --tinta-apagada: #6f7d67;
  --linea: #33422e;
  --linea-fuerte: #3a4933;

  --verde-hoja: #8fbf6f;
  --verde-prof: #5d8a48;
  --salvia: #b9c9a8;
  --sol: #e3a52f;
  --sobre-sol: #2a2110;
  --terracota: #d4917a;
  --terracota-suave: #7a4f3e;
  --frambuesa: #d98a96;
  --agua: #7fb0c8;
  --peligro: #d4917a;

  --anillo-vacio: #33422e;
  --anillo-vacio-int: #2b3826;
  --marca-mes: #f3eeddcc;
  --marca-mes-grande: #f3eeddb3;
  --marca-tercio: #f3eedd40;

  --grilla-mes: #f3eedd26;
  --gantt-crece: #6d9a52;
  --gantt-trasplante: #c07352;
  --gantt-cosecha-a: #e3a52f;
  --gantt-cosecha-b: #b8801a;

  --conf-alta: #8fbf6f;
  --conf-media: #e3a52f;
  --conf-baja: #d4917a;

  --sombra-tel: 0 1px 3px rgba(0, 0, 0, .2), 0 12px 30px rgba(0, 0, 0, .28);
  --sombra-nav: 0 8px 24px rgba(0, 0, 0, .35);
}
```

### Qué se cae de `theme.css`

- **La textura de papel** (el ruido SVG en `body`) sale: en noche es barro y en
  día compite con la grilla del gantt. El fondo es plano en los dos temas.
- **`.etiqueta`** (el ojal perforado de etiqueta de semillas) sale. La tarjeta
  del rediseño es `--papel-alto` + `1px solid --linea` + radio 14/18, sin ojal.
- **`.subrayado-onda`** sale. La jerarquía de sección la hace la tipografía
  display, no un adorno.
- `--sol` **deja de ser solo relleno**: en día es `#c98718`, que llega a 4.5:1
  sobre `#f7f3e7` y se puede usar como texto (los sobretítulos lo usan). En
  noche, `#e3a52f` sobre `#1f2a1c` da ~8:1. Por eso el amarillo bajó a ocre en
  claro: no es un capricho de tono, es el requisito de contraste.
- `--tinta-suave` / `--tinta-tenue` / `--tinta-apagada` **sí** bajan contraste
  respecto de `--tinta`, al contrario de la regla actual del theme. Se usan solo
  en metadatos no esenciales (unidades, ejes, "hace 22 días"), nunca en el dato
  mismo. `--tinta-apagada` en día (`#9aa48d`) es ~2.4:1: es decorativo, no
  informativo. Si un dato queda solo en ese color, está mal puesto.

### Accesibilidad

`e2e/accesibilidad.spec.ts` tiene que correr **dos veces, una por tema**
(parametrizá el spec con `data-tema`). Pares verificados:

| Uso | día | noche |
|---|---|---|
| `--tinta` sobre `--papel` | 11.9:1 | 11.4:1 |
| `--tinta-media` sobre `--papel-alto` | 7.6:1 | 6.9:1 |
| `--tinta-tenue` sobre `--papel` | 4.6:1 | 4.7:1 |
| `--sol` sobre `--papel` | 4.5:1 | 8.1:1 |
| `--sobre-sol` sobre `--sol` | 8.9:1 | 10.4:1 |
| `--verde-hoja` sobre `--papel` | 4.6:1 | 6.6:1 |

Los tres canales que no son color se mantienen: alto de barra (siembra entera /
trasplante mitad), texto para lector de pantalla en cada tercio del anillo, y el
número dentro del triangulito de alertas.

---

## 2. El switch

Un atributo en `<html>`, `data-tema="dia" | "noche"`, y los dos bloques de
tokens de arriba. Nada más: ningún componente pregunta por el tema.

```ts
// src/lib/tema.ts
export type Tema = 'dia' | 'noche'
const CLAVE = 'huerta.tema'

export function temaInicial(): Tema {
  const guardado = localStorage.getItem(CLAVE)
  if (guardado === 'dia' || guardado === 'noche') return guardado
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'noche' : 'dia'
}

export function aplicarTema(t: Tema) {
  document.documentElement.dataset.tema = t
  localStorage.setItem(CLAVE, t)
  document.querySelector('meta[name=theme-color]')
    ?.setAttribute('content', t === 'noche' ? '#1f2a1c' : '#f7f3e7')
}
```

Requisitos:

1. **Aplicar antes del primer paint.** Un script inline en `index.html` que lea
   `localStorage` y setee `data-tema` en `<html>`, para que no haya destello
   blanco al abrir en noche. El resto de la app lo consume desde un contexto.
2. **Un control, un click.** En Ajustes, un segmentado de dos posiciones
   (`Día` / `Noche`) más una tercera opción `Automático` que sigue a
   `prefers-color-scheme` (y deja de seguirlo en cuanto el usuario elige). Sin
   modal, sin recarga.
3. **Sin transición de color.** Cambiar de tema es instantáneo: una transición
   de 300 ms sobre 40 superficies se ve como un parpadeo sucio. Si querés
   suavizarlo, `view-transition` sobre el root, no `transition` en los
   componentes.
4. **`theme-color`** y el color de fondo del manifest siguen al tema (la app es
   PWA instalable).
5. **`color-scheme: light dark`** en el root según el tema, para que los
   controles nativos (el `input type="search"` de Explorar, los scrollbars)
   acompañen.

---

## 3. Tipografía

Cambia en los dos temas por igual. Reemplaza a Quicksand/Nunito.

```css
--font-display: 'Unbounded', system-ui, sans-serif;  /* 400 500 600 */
--font-cuerpo: 'Manrope', system-ui, sans-serif;     /* 400 500 700 800 */
```

Self-hosted como las actuales (`main.tsx`), subset latino, `font-display: swap`.
Unbounded es una display geométrica de ancho fijo aparente: **nunca** debajo de
9 px y **nunca** en párrafos; solo títulos, sobretítulos, números grandes y
etiquetas de nav.

| Rol | Fuente | Tamaño / peso / interlínea | Extra |
|---|---|---|---|
| Título de pantalla | display | 30 / 600 / 1.05 | `letter-spacing: -.01em` |
| Título de ficha | display | 34 / 600 / 1 | |
| Sobretítulo (eyebrow) | display | 10 / 500 / 1 | `uppercase`, `letter-spacing: .14em`, color `--sol` |
| Título de sección | display | 16 / 600 / 1.1 | |
| Número grande (días, dato) | display | 15–22 / 600 / 1 | |
| Etiqueta de nav | display | 9 / 500 (600 activa) | |
| Eje del gantt | display | 9 / 600 | `letter-spacing: .06em` |
| Título de tarjeta / tarea | cuerpo | 13–14 / 800 / 1.15–1.3 | color `--tinta-alta` |
| Cuerpo | cuerpo | 12–13 / 400 / 1.4–1.5 | color `--tinta-suave` |
| Metadato | cuerpo | 10–11 / 400–700 | color `--tinta-tenue` |
| Fuente / procedencia del dato | cuerpo | 10 / 400 / 1.3 | `italic`, color `--tinta-tenue` |
| Día del carril | display 11 / 600 `uppercase` + cuerpo 22 / 800 | | |

---

## 4. Medidas comunes

- **Radios:** 999 (chips y píldoras), 20 (nav), 18 (tarjeta grande de la ficha),
  16 (botón alto), 14 (tarjeta, fila, botón), 12–11 (ícono en cuadrito), 10 (chip
  de fuente). No hay radios nuevos: usá `--radio-*` extendido con 14 y 18.
- **Espaciado:** grilla de 4 con dos excepciones heredadas del layout móvil:
  padding lateral de pantalla **22 px** y gap entre filas **8 px**.
- **Altura táctil:** mínimo 44 px se mantiene. El botón "Hecho" del carril mide
  32 px de alto pero 44 con el padding de la fila alrededor; si eso no alcanza en
  tu implementación, subilo a 36 y bajá el padding vertical de la fila.
- **Ícono en cuadrito:** 38–40 px, radio 11–12, fondo `--papel-hundido`, glifo
  20–21 px en el color de la categoría.
- **Chip:** alto 30–34, padding 0 10–14, radio 999, borde 1.5 `--linea-fuerte`,
  texto 11–12 / 700. Activo: fondo `--sol`, texto `--sobre-sol`, borde `--sol`.

---

## 5. Componentes nuevos

### 5.1 `AnilloAnual` — reemplaza a `MonthStrip`

El año como un reloj: 36 décadas × 10°, arrancando a las 12 en punto (0° = 1 de
enero) y girando en sentido horario. Es el componente central del rediseño:
aparece en cada tarjeta de Explorar (56 px) y dos veces, concéntrico, en la
ficha (146 px).

**Relleno.** Un `conic-gradient` con 36 tramos duros de 10°:

```
verde  = ideal            → var(--verde-hoja)
ocre   = se puede         → var(--sol)
vacío  = no se siembra    → var(--anillo-vacio)
```

**Marcas de mes** (esto es lo que pidió el usuario y no puede faltar). Una
**segunda capa** de `conic-gradient` por encima del relleno, con todo transparente
menos las barras:

- barra de mes en cada múltiplo de 30°: ancho **1.8°**, color `--marca-mes-grande`
- hairline de década en cada múltiplo de 10°: ancho **1°**, color `--marca-tercio`
- en el anillo de 56 px: **solo** las barras de mes, ancho ×1.5 (2.7°), color
  `--marca-mes`. Los tercios a ese tamaño se empastan y hay que omitirlos.

```ts
// una función pura, testeable, que devuelve el gradient de la capa de marcas
function marcas(mes: string, tercio: string, k = 1): string {
  const st: string[] = []
  let cur = 0
  for (let i = 0; i < 36; i++) {
    const a = i * 10
    const esMes = i % 3 === 0
    const w = (esMes ? 1.8 : 1) * k
    const c = esMes ? mes : tercio
    const s0 = a - w / 2, e0 = a + w / 2
    if (i === 0) st.push(`${c} 0deg ${e0}deg`)
    else st.push(`transparent ${cur}deg ${s0}deg`, `${c} ${s0}deg ${e0}deg`)
    cur = e0
  }
  st.push(`transparent ${cur}deg 359.1deg`, `${mes} 359.1deg 360deg`)
  return `conic-gradient(${st.join(',')})`
}
// background: marcas(...) , conic-gradient(<relleno>)
```

**Aguja de hoy.** Marca la década en curso, **no** las 12 en punto (esto estuvo
mal en una iteración y es fácil de repetir):

```
ángulo = (decadaActual − 1) × 10 + 5   // centro de la década
```

Es un `<span>` de 2 px de ancho y alto = radio del anillo, con
`transform-origin: 50% 100%` y `transform: translate(-1px, -Hpx) rotate(Ndeg)`,
que contiene un `<i>` de 11–17 px pintado en `--tinta-alta` en la punta. Así el
trazo visible queda **solo** en la banda del anillo y no cruza el centro.

**Geometría**

| | anillo de tarjeta | anillo de ficha |
|---|---|---|
| Diámetro externo | 56 | 146 (siembra) |
| Hueco | 38 | 110 |
| Banda | 9 px | 18 px |
| Anillo interno | — | 100 → hueco 68 (trasplante, banda 16 px) |
| Centro | abreviatura del mes, display 9 / 600 | `sep` display 9 / 600 `--sol` + `principios` 7 px `--tinta-tenue` |
| Aguja | alto 36, trazo 11 | alto 82, trazo 17 |
| Iniciales de mes | no | sí |

**Iniciales de mes** (solo en el de 146 px): las 12 letras `E F M A M J J A S O
N D`, cada una centrada en su mes (`m × 30 + 15` grados) a **radio 64 px**, o
sea dentro de la banda:

```css
position: absolute; top: 50%; left: 50%;
font: 800 8.5px/1 var(--font-cuerpo);
color: var(--tinta-alta);
text-shadow: 0 0 2.5px var(--papel), 0 0 2.5px var(--papel), 0 0 2.5px var(--papel);
transform: translate(-50%, -50%) rotate(Ndeg) translateY(-64px) rotate(-Ndeg);
```

El triple `text-shadow` del color del fondo es lo que hace que la letra se lea
sobre cualquier tramo del anillo (verde, ocre o vacío) en los dos temas. El mes
en curso va en 800 / 10 px.

**Accesibilidad.** El anillo es decorativo (`aria-hidden`); el texto por tercio
que ya arma `MonthStrip.etiquetaMes()` se conserva en un `.sr-solo` dentro del
componente. No se pierde nada de lo que hoy lee el lector de pantalla.

### 5.2 `CarrilSemana` — Hoy

Siete filas, una por día, en una grilla de dos columnas:
`grid-template-columns: 54px 1fr; gap: 0 14px`.

- **Columna del día** (54 px, `border-right: 1px solid var(--linea-fuerte)`,
  padding `10px 0 14px`): sigla del día (display 11 / 600 `uppercase`), número
  (cuerpo 22 / 800), ícono del cielo (18 px) y `max° min°` (11 px, la mínima en
  `--tinta-tenue` / 500). Hoy pinta la sigla en `--sol` y el número en
  `--tinta-alta`; un día con helada pinta el ícono en `--sol`.
- **Punto de la línea**: 9 px, `border: 2px solid var(--papel)`, pegado al borde
  derecho de la columna (`right: -5px; top: 16px`). `--sol` si el día tiene
  cosas, `--linea-fuerte` si está vacío.
- **Columna de items** (`flex column`, gap 8, padding `8px 0 14px`): cada item es
  una fila de radio 14, padding `10px 12px`, fondo `--papel-alto`, borde 1px
  `--linea`, con ícono 19 px + título 13/800 + detalle 12 + procedencia 10 itálica,
  y a la derecha el botón `Hecho` (32 px, píldora, borde 1.5 `--sol`, texto
  `--sol`, fondo transparente).
- Un **aviso de clima** usa el mismo molde pero fondo `--sol` al 13 % y borde
  `--sol` al 40 %.
- Un día **sin nada** muestra un `—` de 12 px en `--tinta-apagada`: la fila no
  desaparece, para que la semana se lea como semana.

### 5.3 `GanttPlanta` — Mi huerta

Cada planta es una fila de **74 px** de alto (radio 14, fondo `--papel-alto`,
borde 1px `--linea`, `overflow: hidden`) sobre una ventana fija de **180 días**:
60 atrás y 120 adelante.

```ts
const pct = (d: number) => Math.max(0, Math.min(100, ((d + 60) / 180) * 100))
// hoy queda en 33.33 %
```

De arriba a abajo:

1. **Cabecera** (`top: 8px; left: 12px`): ícono de grupo 16 px, nombre 13/800,
   sub 10 px `--tinta-tenue`, y el triangulito de alertas si hay pendientes
   (píldora `--sol` con `--sobre-sol`, animación `pulso` 2 s).
2. **Banda de tiempo**, `top: 29px; height: 24px`. Contiene:
   - la **grilla mensual**: `repeating-linear-gradient(90deg, transparent 0
     calc(100%/6 - 1px), var(--grilla-mes) calc(100%/6 - 1px) calc(100%/6))`,
     o sea una línea cada 30 días;
   - la **línea de hoy**: 1.5 px `--sol` en `33.33%`.

   Las dos están **acotadas a la banda** a propósito: cuando cruzaban toda la
   tarjeta pasaban por encima del nombre y del hito y ensuciaban la lectura.
3. **Barras**, `top: 36px; height: 10px; border-radius: 5px`:
   - creciendo → `--gantt-crece`
   - ventana de trasplante → `--gantt-trasplante`
   - ventana de cosecha → `repeating-linear-gradient(90deg, var(--gantt-cosecha-a)
     0 4px, var(--gantt-cosecha-b) 4px 8px)`

   Los tres tonos tienen que ser **de familias distintas** (verde, terracota,
   ocre): con dos verdes la fila no se lee, y el rayado solo no alcanza.
4. **Punto de siembra**: círculo de 16 px sobre `x0`, fondo `--papel`, borde 2.5
   `--verde-hoja`, con el ícono `sembrar` de 9 px adentro,
   `transform: translateX(-8px)`.
5. **Hito**, `top: 52px; left: 12px`: 10 px / 700, con `background: var(--papel)`
   y `padding: 0 4px` para tapar la grilla que le pase por detrás. Color:
   `--verde-hoja` si está en ventana, `--sol` si está demorado, `--tinta-tenue` si
   falta.

**Eje**, una sola vez arriba del grupo: 7 etiquetas con `justify-content:
space-between` (caen exactamente en los múltiplos de 30 días), con los **nombres
de los meses** calculados desde hoy, y el del mes en curso como `sep · hoy` en
`--sol`.

### 5.4 `FilaConfianza` — ficha

El índice de confianza del catálogo (1–10) como 10 puntos de 4 px, radio 2, gap
2: los primeros `n` en `--conf-alta` (≥8), `--conf-media` (5–7) o `--conf-baja`
(<5), el resto en `--conf-vacio`. Al lado, el número. Reemplaza al
`ConfidenceBadge` de pastilla: ocupa menos y se compara de un vistazo entre
campos.

Las **fuentes** son chips de 26 px con el ícono `fuente` + el nombre del
organismo, que enlazan al PDF o la página. Son `<a>`, no texto: la procedencia
del dato tiene que ser navegable.

---

## 6. `TabBar` flotante

Deja de ser una barra pegada al borde: es una píldora que flota.

```
position: absolute; left: 14px; right: 14px; bottom: 14px;
height: 64px; border-radius: 20px;
background: var(--papel-hundido);
box-shadow: var(--sombra-nav);
padding: 6px;
```

Cada tab es `flex: 1`, columna centrada, gap 3: ícono 22 px + etiqueta display 9.
Inactivo en `--tinta-tenue`; el activo es un bloque de radio 14 con fondo `--sol`
y contenido `--sobre-sol`, etiqueta en 600.

El contenido de la pantalla lleva `padding-bottom: 92px` para no quedar debajo.
`--tab-alto` pasa de 62 a 64 + 14 de aire; si algún cálculo depende de
`--tab-alto`, sumale el `bottom`.

---

## 7. Animaciones

Se conservan las tres que ya existen, con los mismos nombres y curvas:
`aparecer` (0.45 s, escalonada por `--retraso`), `brotar` (0.5 s, al completar
una tarea) y el `@media (prefers-reduced-motion: reduce)` que las apaga. Se
agrega `pulso` (2 s infinita) solo en el triangulito de alertas de una planta con
algo pendiente.

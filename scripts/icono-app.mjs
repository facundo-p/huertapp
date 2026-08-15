/**
 * El ícono de la app, en un solo lugar.
 *
 * Es la única pieza de diseño que vive fuera de la app y la primera que se ve:
 * en la pantalla de inicio compite con 30 íconos más, a 48 px reales. De ahí
 * las decisiones:
 *
 * - **Fondo verde profundo, dibujo crema.** Al revés (papel de fondo, que es la
 *   identidad de adentro) se pierde entre los íconos claros que ya hay. El
 *   papel es la piel de la app; el ícono es su sello.
 * - **Dos formas y nada más**: el montículo de tierra y el plantín. Cualquier
 *   detalle más se convierte en ruido gris a 48 px.
 * - El dibujo está compuesto en una caja de 100×100 y se **escala según el uso**:
 *   casi a sangre para `any`, bien adentro para `maskable` (Android recorta un
 *   círculo de 80 % y lo que sobresale se pierde).
 */

/** Paleta: los mismos tokens de theme.css, acá literales porque es build. */
const VERDE = '#4d7440'
const VERDE_PROF = '#2c4626'
const CREMA = '#f6efdd'

/** Escala del dibujo dentro del cuadrado, por uso. */
export const ESCALA = {
  /** iOS y escritorio lo muestran casi entero: aprovechamos el cuadrado. */
  any: 0.94,
  /** Android recorta a un círculo del 80 %: el dibujo se mete bien adentro. */
  maskable: 0.74,
}

/**
 * El dibujo, en una caja de 100×100. El centro visual está en (50, 54) —un poco
 * más abajo que el geométrico, porque el montículo pesa— y se corrige al ubicarlo.
 */
function dibujo(escala) {
  return `<g transform="translate(50 50) scale(${escala}) translate(-50 -54)" fill="none"
     stroke="${CREMA}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round">
    <path d="M14 78 Q50 67 86 78" />
    <!-- el tallo termina justo en la línea de tierra (y≈72 en x=50): si la
         cruza, el sobrante se lee como un error de trazo, no como raíz -->
    <path d="M50 72 L50 33" />
    <path d="M50 60 C40 62 26 56 22 42 C36 38 48 46 50 60 Z" fill="${CREMA}" stroke-width="4" />
    <path d="M50 52 C62 54 78 46 82 30 C66 26 52 36 50 52 Z" fill="${CREMA}" stroke-width="4" />
  </g>`
}

/**
 * @param {{ maskable?: boolean, radio?: number }} opciones
 *   `radio` en unidades de 100 (0 = cuadrado a sangre, 22 ≈ squircle de iOS).
 */
export function iconoSvg({ maskable = false, radio = 0 } = {}) {
  const escala = maskable ? ESCALA.maskable : ESCALA.any
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
  <defs>
    <linearGradient id="tierra" x1="0" y1="0" x2="0.35" y2="1">
      <stop offset="0" stop-color="${VERDE}" />
      <stop offset="1" stop-color="${VERDE_PROF}" />
    </linearGradient>
  </defs>
  <rect width="100" height="100" rx="${radio}" ry="${radio}" fill="url(#tierra)" />
  ${dibujo(escala)}
</svg>`
}

import type { SVGProps } from 'react'

/**
 * Los dibujos NO son íconos, y la diferencia no es de tamaño.
 *
 * Un ícono **significa**: por eso lleva `aria-label` cuando informa y tiene su
 * entrada en el Glosario. Un dibujo **acompaña**: va siempre `aria-hidden`, no
 * entra al Glosario y nada de lo que dice puede faltar en el texto de al lado.
 * Si un dibujo empieza a portar un dato, dejó de ser un dibujo: se vuelve
 * ícono, se muda a `src/icons/` y va al Glosario.
 *
 * Gramática propia, hermana de la de los íconos: viewBox 96 (cabe una escena,
 * no un símbolo), puntas y uniones redondeadas, `currentColor`.
 *
 * El trazo se calcula al revés que en los íconos: 1,75 **en pantalla**, mida
 * lo que mida el dibujo. Escalar 1,75 de un viewBox 96 a 56 px daría un fideo
 * de 1 px que se lava contra el papel; y al revés, un dibujo grande con el
 * trazo proporcional se pone gordo. Una sola línea en toda la app.
 */
export interface DibujoProps extends Omit<SVGProps<SVGSVGElement>, 'children'> {
  size?: number
}

export function Dibujo({
  size = 96,
  children,
  ...rest
}: DibujoProps & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      stroke="currentColor"
      strokeWidth={(1.75 * 96) / size}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      {...rest}
    >
      {children}
    </svg>
  )
}

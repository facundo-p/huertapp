import type { SVGProps } from 'react'

// Todos los íconos del sistema comparten esta gramática:
// viewBox 24, trazo 1.75, puntas y uniones redondeadas, currentColor.
export interface IconProps extends SVGProps<SVGSVGElement> {
  size?: number
  /** Si se pasa, el ícono es informativo (role img + aria-label); si no, decorativo. */
  title?: string
}

export function Svg({ size = 24, title, children, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      {...rest}
    >
      {children}
    </svg>
  )
}

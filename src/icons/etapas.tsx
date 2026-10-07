import { Svg, type IconProps } from './base'

// Cómo va cada siembra en el croquis: la misma planta para todas las especies,
// que el nombre ya dice cuál es. Las hojas van apenas rellenas, como en la mano.
const hoja = { fill: 'currentColor', fillOpacity: 0.18 }

/** Semilla bajo tierra: todavía no asomó. */
export function IconoNoAsomo(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 10.5 H20" />
      <ellipse cx="12" cy="16.5" rx="3.8" ry="2.6" fill="currentColor" stroke="none" />
    </Svg>
  )
}

/** Dos hojitas: recién asomó. */
export function IconoBrote(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 19.5 H20" />
      <path d="M12 19.5 V12.5" />
      <path {...hoja} d="M12 13 C9.4 13 7.4 11.2 7 8.4 C9.8 8.4 11.7 10.3 12 13 Z" />
      <path {...hoja} d="M12 13 C14.6 13 16.6 11.2 17 8.4 C14.2 8.4 12.3 10.3 12 13 Z" />
    </Svg>
  )
}

/** Dos pares de hojas: creciendo. */
export function IconoCreciendo(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 20.5 H20" />
      <path d="M12 20.5 V5" />
      <path {...hoja} d="M12 16 C8.8 16 6.4 14 6 10.8 C9.2 10.8 11.6 12.8 12 16 Z" />
      <path {...hoja} d="M12 16 C15.2 16 17.6 14 18 10.8 C14.8 10.8 12.4 12.8 12 16 Z" />
      <path {...hoja} d="M12 10 C10.2 10 8.8 8.8 8.5 7 C10.3 7 11.7 8.2 12 10 Z" />
      <path {...hoja} d="M12 10 C13.8 10 15.2 8.8 15.5 7 C13.7 7 12.3 8.2 12 10 Z" />
    </Svg>
  )
}

/** La planta con un fruto colgando: dando cosecha. */
export function IconoDandoCosecha(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 20.5 H20" />
      <path d="M11 20.5 V4.5" />
      <path {...hoja} d="M11 15.5 C7.8 15.5 5.4 13.5 5 10.3 C8.2 10.3 10.6 12.3 11 15.5 Z" />
      <path {...hoja} d="M11 9.5 C9.2 9.5 7.8 8.3 7.5 6.5 C9.3 6.5 10.7 7.7 11 9.5 Z" />
      <path d="M11 11 C14 11 16 12 16 13.6" />
      <circle {...hoja} cx="16" cy="16" r="2.4" />
    </Svg>
  )
}

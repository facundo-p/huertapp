import { Svg, type IconProps } from './base'

// Un ícono por grupo de especies (6). El núcleo visual del sistema.

/** Hortaliza de hoja */
export function IconoHoja(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M19.5 4.5 C 10.5 4.5, 4.5 10, 4.5 19.5 C 13.5 19.5, 19.5 14, 19.5 4.5 Z" />
      <path d="M4.5 19.5 C 9.5 14.5, 14 10, 19.5 4.5" />
    </Svg>
  )
}

/** Hortaliza de fruto */
export function IconoFruto(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="14" r="6.25" />
      <path d="M12 7.75 V5" />
      <path d="M12 7.75 C 11 5.9, 9.3 5.2, 7.6 5.4" />
      <path d="M12 7.75 C 13 5.9, 14.7 5.2, 16.4 5.4" />
    </Svg>
  )
}

/** Hortaliza de raíz / bulbo */
export function IconoRaiz(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M9.2 9.5 L 14.8 9.5 C 15.3 13, 14.3 17, 12 20.75 C 9.7 17, 8.7 13, 9.2 9.5 Z" />
      <path d="M9.8 6.5 C 9.6 4.8, 8.6 3.6, 7.2 3" />
      <path d="M12 6.7 V 3.2" />
      <path d="M14.2 6.5 C 14.4 4.8, 15.4 3.6, 16.8 3" />
      <path d="M10.6 13 H 13.4" />
    </Svg>
  )
}

/** Legumbre */
export function IconoLegumbre(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M5 15.5 C 4.2 9, 9 4, 17.6 4.4 C 19.6 11.5, 15 18.6, 6.8 19.6 C 5.8 18.4, 5.2 17, 5 15.5 Z" />
      <circle cx="9.1" cy="13.4" r="1.5" />
      <circle cx="12.1" cy="10.7" r="1.5" />
      <circle cx="14.9" cy="7.9" r="1.5" />
    </Svg>
  )
}

/** Aromática */
export function IconoAromatica(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 21 C 12 15, 12 9, 12 3.75" />
      <path d="M12 17.5 C 9.3 17.5, 7.6 15.9, 7.2 13.4 C 9.9 13.4, 11.6 15, 12 17.5 Z" />
      <path d="M12 17.5 C 14.7 17.5, 16.4 15.9, 16.8 13.4 C 14.1 13.4, 12.4 15, 12 17.5 Z" />
      <path d="M12 11.5 C 9.9 11.5, 8.5 10.2, 8.2 8.2 C 10.4 8.2, 11.7 9.5, 12 11.5 Z" />
      <path d="M12 11.5 C 14.1 11.5, 15.5 10.2, 15.8 8.2 C 13.6 8.2, 12.3 9.5, 12 11.5 Z" />
    </Svg>
  )
}

/** Flor polinizadora */
export function IconoFlor(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="2.4" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <path
          key={a}
          d="M12 9.4 C 10.7 8.1, 10.7 5.3, 12 3.9 C 13.3 5.3, 13.3 8.1, 12 9.4 Z"
          transform={`rotate(${a} 12 12)`}
        />
      ))}
    </Svg>
  )
}

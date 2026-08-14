import { Svg, type IconProps } from './base'

// Un ícono por categoría de luz (4): del sol pleno a la sombra.

/** PLENO_SOL: ≥6 h de sol directo */
export function IconoLuzPleno(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="3.8" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <path key={a} d="M12 3.2 V 5.6" transform={`rotate(${a} 12 12)`} />
      ))}
    </Svg>
  )
}

/** SOL_PARCIAL: 4-6 h de sol directo */
export function IconoLuzParcial(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="9.5" cy="9.5" r="3.2" />
      {[-45, 0, 45, 90, 270].map((a) => (
        <path key={a} d="M9.5 2.8 V 4.9" transform={`rotate(${a} 9.5 9.5)`} />
      ))}
      <path d="M8.5 19.5 H 17.4 A 2.8 2.8 0 0 0 17.4 13.9 A 4 4 0 0 0 9.7 13.4 A 3.05 3.05 0 0 0 8.5 19.5 Z" />
    </Svg>
  )
}

/** MEDIA_SOMBRA: 2-4 h de sol / tolera media sombra */
export function IconoLuzMedia(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M7.3 8.2 A 3.2 3.2 0 0 1 12.8 6.1" />
      <path d="M8.6 3.4 L 8.9 4.5" />
      <path d="M4.2 5.6 L 5.1 6.3" />
      <path d="M3 10.2 L 4.1 10.1" />
      <path d="M7.5 20 H 16.9 A 3 3 0 0 0 16.9 14 A 4.3 4.3 0 0 0 8.6 13.4 A 3.3 3.3 0 0 0 7.5 20 Z" />
    </Svg>
  )
}

/** TOLERA_SOMBRA: crece con luz indirecta */
export function IconoLuzSombra(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M7.5 16.5 H 16.9 A 3 3 0 0 0 16.9 10.5 A 4.3 4.3 0 0 0 8.6 9.9 A 3.3 3.3 0 0 0 7.5 16.5 Z" />
      <path d="M8.7 19.8 L 8 21" />
      <path d="M12.6 19.8 L 11.9 21" />
      <path d="M16.5 19.8 L 15.8 21" />
    </Svg>
  )
}

import { Svg, type IconProps } from './base'

// Un ícono por categoría de suelo (5). Base común: el montículo de tierra;
// cada categoría agrega su rasgo distintivo (forma, no solo color).

const Monticulo = () => (
  <path d="M3.5 18 C 6.2 13.6, 9 12, 12 12 C 15 12, 17.8 13.6, 20.5 18" />
)
const Piso = () => <path d="M3 18 H 21" />

/** ARENOSO_DRENANTE: montículo con granos de arena */
export function IconoSueloArenoso(p: IconProps) {
  return (
    <Svg {...p}>
      <Monticulo />
      <Piso />
      <circle cx="9.2" cy="15.9" r="0.55" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14.4" r="0.55" fill="currentColor" stroke="none" />
      <circle cx="14.8" cy="15.9" r="0.55" fill="currentColor" stroke="none" />
      <path d="M9.5 21 L 9.5 20.9 M12 21.4 L 12 21.3 M14.5 21 L 14.5 20.9" />
    </Svg>
  )
}

/** FRANCO_FERTIL: montículo con brote */
export function IconoSueloFertil(p: IconProps) {
  return (
    <Svg {...p}>
      <Monticulo />
      <Piso />
      <path d="M12 12 V 8.2" />
      <path d="M12 9.2 C 10.3 9.2, 9.2 8.1, 9 6.3 C 10.8 6.3, 11.8 7.4, 12 9.2 Z" />
      <path d="M12 9.2 C 13.7 9.2, 14.8 8.1, 15 6.3 C 13.2 6.3, 12.2 7.4, 12 9.2 Z" />
    </Svg>
  )
}

/** HUMEDO_RICO: montículo con gota */
export function IconoSueloHumedo(p: IconProps) {
  return (
    <Svg {...p}>
      <Monticulo />
      <Piso />
      <path d="M12 4 C 10.6 6.2, 9.9 7.5, 9.9 8.7 A 2.1 2.1 0 0 0 14.1 8.7 C 14.1 7.5, 13.4 6.2, 12 4 Z" />
    </Svg>
  )
}

/** PROFUNDO_SUELTO: montículo con raíces profundas */
export function IconoSueloProfundo(p: IconProps) {
  return (
    <Svg {...p}>
      <Monticulo />
      <Piso />
      <path d="M9 18 V 20.6" />
      <path d="M12 18 V 21.6" />
      <path d="M15 18 V 20.6" />
    </Svg>
  )
}

/** RUSTICO_TOLERANTE: montículo con piedritas */
export function IconoSueloRustico(p: IconProps) {
  return (
    <Svg {...p}>
      <Monticulo />
      <Piso />
      <path d="M9 16.4 a 1.35 1.15 0 1 0 0.01 0 Z" />
      <path d="M13.6 15 a 1.15 1 0 1 0 0.01 0 Z" />
    </Svg>
  )
}

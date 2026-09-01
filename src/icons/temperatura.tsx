import { Svg, type IconProps } from './base'

// Las bandas de temperatura que pide una especie (filtro de Explorar).
// Familia aparte de clima.tsx a propósito: el IconoCalor de allá es la ola de
// calor del pronóstico; esto es qué temperatura le gusta a la planta.
// El canal es la altura del mercurio, con un acompañante que la refuerza.

const TUBO = 'M8.7 14.6 V 5.6 a 1.9 1.9 0 0 1 3.8 0 V 14.6 a 3.1 3.1 0 1 1 -3.8 0 Z'

/** Banda fría: mercurio abajo, con su copito */
export function IconoTempFria(p: IconProps) {
  return (
    <Svg {...p}>
      <path d={TUBO} />
      <path d="M10.6 13.9 V 16.4" />
      <path d="M17.6 5.4 V 9.4" />
      <path d="M17.6 5.4 V 9.4" transform="rotate(60 17.6 7.4)" />
      <path d="M17.6 5.4 V 9.4" transform="rotate(120 17.6 7.4)" />
    </Svg>
  )
}

/** Banda templada: mercurio a media altura */
export function IconoTempTemplada(p: IconProps) {
  return (
    <Svg {...p}>
      <path d={TUBO} />
      <path d="M10.6 10.6 V 16.4" />
    </Svg>
  )
}

/** Banda cálida: mercurio arriba, con su solcito */
export function IconoTempCalida(p: IconProps) {
  return (
    <Svg {...p}>
      <path d={TUBO} />
      <path d="M10.6 7.4 V 16.4" />
      <circle cx="17.6" cy="7.4" r="1.9" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <path key={a} d="M17.6 4.5 V 5.7" transform={`rotate(${a} 17.6 7.4)`} />
      ))}
    </Svg>
  )
}

import type { ComponentType } from 'react'
import { Svg, type IconProps } from './base'
import type { CieloDia } from '../lib/pronostico/tipos'

// El tiempo de la semana: un ícono por cielo del pronóstico + los de las
// alertas. Familia aparte de luz.tsx a propósito: "sol" acá es el cielo de
// mañana, no cuánta luz necesita una planta.

/** Despejado */
export function IconoSol(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="4" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
        <path key={a} d="M12 3.2 V 5.6" transform={`rotate(${a} 12 12)`} />
      ))}
    </Svg>
  )
}

/** Algo nublado: sol asomado atrás de una nube */
export function IconoSolYNubes(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="9.2" cy="8.8" r="3" />
      {[-45, 0, 45, 90, 270].map((a) => (
        <path key={a} d="M9.2 2.6 V 4.7" transform={`rotate(${a} 9.2 8.8)`} />
      ))}
      <path d="M8.3 19.3 H 17 A 2.8 2.8 0 0 0 17 13.7 A 4 4 0 0 0 9.4 13.2 A 3.05 3.05 0 0 0 8.3 19.3 Z" />
    </Svg>
  )
}

/** Nublado */
export function IconoNube(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M7.1 17.4 H 16.6 A 3.1 3.1 0 0 0 16.6 11.2 A 4.4 4.4 0 0 0 8.1 10.6 A 3.4 3.4 0 0 0 7.1 17.4 Z" />
    </Svg>
  )
}

/** Niebla: nube con el aire abajo hecho tiras */
export function IconoNiebla(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M7.6 13.3 H 16.3 A 2.9 2.9 0 0 0 16.3 7.5 A 4 4 0 0 0 8.6 7 A 3.1 3.1 0 0 0 7.6 13.3 Z" />
      <path d="M5.8 16.4 H 18.2" />
      <path d="M7.4 19.2 H 16.6" />
    </Svg>
  )
}

/** Llovizna: gotitas cortas */
export function IconoLlovizna(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M7.6 14.3 H 16.3 A 2.9 2.9 0 0 0 16.3 8.5 A 4 4 0 0 0 8.6 8 A 3.1 3.1 0 0 0 7.6 14.3 Z" />
      <path d="M9.2 17 v 1.4" />
      <path d="M12.2 17.8 v 1.4" />
      <path d="M15.2 17 v 1.4" />
    </Svg>
  )
}

/** Lluvia: rayas al sesgo */
export function IconoLluvia(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M7.6 14.3 H 16.3 A 2.9 2.9 0 0 0 16.3 8.5 A 4 4 0 0 0 8.6 8 A 3.1 3.1 0 0 0 7.6 14.3 Z" />
      <path d="M9.8 16.6 l -1.1 3.2" />
      <path d="M13.2 16.6 l -1.1 3.2" />
      <path d="M16.6 16.6 l -1.1 3.2" />
    </Svg>
  )
}

/** Tormenta: nube con rayo */
export function IconoTormenta(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M7.6 13.6 H 16.3 A 2.9 2.9 0 0 0 16.3 7.8 A 4 4 0 0 0 8.6 7.3 A 3.1 3.1 0 0 0 7.6 13.6 Z" />
      <path d="M12.9 15.2 L 10.6 18.4 H 13.4 L 11.1 21.6" />
    </Svg>
  )
}

/** Nieve o escarcha: copo */
export function IconoEscarcha(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 4.4 V 19.6" />
      <path d="M12 4.4 V 19.6" transform="rotate(60 12 12)" />
      <path d="M12 4.4 V 19.6" transform="rotate(120 12 12)" />
      <path d="M10.4 6.6 L 12 8.2 L 13.6 6.6" />
      <path d="M10.4 17.4 L 12 15.8 L 13.6 17.4" />
    </Svg>
  )
}

/** Calor: termómetro al tope, con el aire que tiembla */
export function IconoCalor(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M8.7 14.6 V 5.6 a 1.9 1.9 0 0 1 3.8 0 V 14.6 a 3.1 3.1 0 1 1 -3.8 0 Z" />
      <path d="M10.6 8.2 V 16.4" />
      <path d="M16 7.2 c 1.1 1, 1.1 2.4, 0 3.4" />
      <path d="M18.6 5.6 c 1.9 1.9, 1.9 4.7, 0 6.6" />
    </Svg>
  )
}

/** Viento */
export function IconoViento(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 9.3 H 14.3 a 2.2 2.2 0 1 0 -2.2 -2.2" />
      <path d="M4 13.2 H 17.6 a 2.3 2.3 0 1 1 -2.3 2.3" />
      <path d="M4 17.1 H 10.8" />
    </Svg>
  )
}

/** Gota: humedad, probabilidad de lluvia */
export function IconoGota(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 4.5 C 12 4.5 6.8 10.6 6.8 14.2 A 5.2 5.2 0 0 0 17.2 14.2 C 17.2 10.6 12 4.5 12 4.5 Z" />
    </Svg>
  )
}

/** Ubicación: dónde está la huerta */
export function IconoUbicacion(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 21 C 12 21 5.8 15 5.8 10.4 A 6.2 6.2 0 0 1 18.2 10.4 C 18.2 15 12 21 12 21 Z" />
      <circle cx="12" cy="10.4" r="2.3" />
    </Svg>
  )
}

/** El ícono y el nombre de cada cielo del pronóstico. */
export const CIELOS: Record<CieloDia, { Icono: ComponentType<IconProps>; nombre: string }> = {
  sol: { Icono: IconoSol, nombre: 'despejado' },
  'sol-nubes': { Icono: IconoSolYNubes, nombre: 'algo nublado' },
  nublado: { Icono: IconoNube, nombre: 'nublado' },
  niebla: { Icono: IconoNiebla, nombre: 'niebla' },
  llovizna: { Icono: IconoLlovizna, nombre: 'llovizna' },
  lluvia: { Icono: IconoLluvia, nombre: 'lluvia' },
  tormenta: { Icono: IconoTormenta, nombre: 'tormenta' },
  nieve: { Icono: IconoEscarcha, nombre: 'nieve o escarcha' },
}

import { Svg, type IconProps } from './base'

// Íconos de navegación (tab bar y utilitarios de pantalla).

/** Hoy: casita */
export function IconoHoy(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4.5 10.8 L 12 4.3 L 19.5 10.8 V 18.3 C 19.5 19.4, 18.6 20.3, 17.5 20.3 H 6.5 C 5.4 20.3, 4.5 19.4, 4.5 18.3 Z" />
      <path d="M9.8 20.3 V 15.7 C 9.8 14.6, 10.8 14, 12 14 C 13.2 14, 14.2 14.6, 14.2 15.7 V 20.3" />
    </Svg>
  )
}

/** Explorar: lupa */
export function IconoExplorar(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="10.6" cy="10.6" r="5.7" />
      <path d="M14.9 14.9 L 20 20" />
    </Svg>
  )
}

/** Calendario */
export function IconoCalendario(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="4" y="5.8" width="16" height="14.5" rx="2.6" />
      <path d="M8.4 3.8 V 7.6" />
      <path d="M15.6 3.8 V 7.6" />
      <path d="M4 10.4 H 20" />
      <circle cx="8.9" cy="14" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14" r="0.7" fill="currentColor" stroke="none" />
      <circle cx="15.1" cy="17" r="0.7" fill="currentColor" stroke="none" />
    </Svg>
  )
}

/** Mi huerta: brote en el cantero */
export function IconoHuerta(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4.5 19.5 V 13.5 M 19.5 19.5 V 13.5" />
      <path d="M3 19.5 H 21" />
      <path d="M12 19.5 V 11.5" />
      <path d="M12 13.3 C 9.8 13.3, 8.4 12, 8.1 9.8 C 10.4 9.8, 11.7 11.1, 12 13.3 Z" />
      <path d="M12 13.3 C 14.2 13.3, 15.6 12, 15.9 9.8 C 13.6 9.8, 12.3 11.1, 12 13.3 Z" />
    </Svg>
  )
}

/** Glosario: signo de pregunta */
export function IconoGlosario(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="8.2" />
      <path d="M9.9 9.8 C 9.9 8.4, 10.8 7.4, 12.2 7.4 C 13.5 7.4, 14.4 8.3, 14.4 9.5 C 14.4 10.5, 13.8 11.1, 12.9 11.7 C 12.3 12.1, 12 12.6, 12 13.4" />
      <circle cx="12" cy="16.2" r="0.65" fill="currentColor" stroke="none" />
    </Svg>
  )
}

/** Ajustes: deslizadores */
export function IconoAjustes(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4.5 8 H 19.5" />
      <circle cx="9.4" cy="8" r="1.9" fill="var(--papel-alto, #fff)" />
      <path d="M4.5 16 H 19.5" />
      <circle cx="14.6" cy="16" r="1.9" fill="var(--papel-alto, #fff)" />
    </Svg>
  )
}

/** Volver: flecha atrás */
export function IconoVolver(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M14.5 5.5 L 8 12 L 14.5 18.5" />
    </Svg>
  )
}

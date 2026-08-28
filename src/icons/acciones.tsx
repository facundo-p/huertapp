import { Svg, type IconProps } from './base'

// Íconos de estado y acción del ciclo de cultivo + utilitarios.

/** Sembrar: semillas cayendo al surco */
export function IconoSembrar(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4 19.5 C 8 16.8, 16 16.8, 20 19.5" />
      <path d="M9 6.2 a 1.15 1.5 -20 1 0 0.01 0 Z" />
      <path d="M14.2 9.2 a 1.15 1.5 20 1 0 0.01 0 Z" />
      <path d="M10.6 12.6 a 1.15 1.5 -12 1 0 0.01 0 Z" />
    </Svg>
  )
}

/** Almácigo: macetita con brote */
export function IconoAlmacigo(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M7.2 12.5 H 16.8 L 16 17.6 C 15.8 18.7, 14.9 19.5, 13.8 19.5 H 10.2 C 9.1 19.5, 8.2 18.7, 8 17.6 Z" />
      <path d="M6.2 12.5 H 17.8" />
      <path d="M12 12.5 V 8.7" />
      <path d="M12 9.7 C 10.2 9.7, 9 8.5, 8.8 6.6 C 10.7 6.6, 11.8 7.7, 12 9.7 Z" />
      <path d="M12 9.7 C 13.8 9.7, 15 8.5, 15.2 6.6 C 13.3 6.6, 12.2 7.7, 12 9.7 Z" />
    </Svg>
  )
}

/** Trasplantar: plantín bajando a tierra */
/** Túnel o cajón: la planta necesita reparo del frío para arrancar. */
export function IconoProtegido(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M3.5 19h17" />
      <path d="M4.5 19a7.5 7.5 0 0 1 15 0" />
      <path d="M12 19v-4.5" />
      <path d="M12 15.5c-1.6 0-2.6-1-2.6-2.6 1.6 0 2.6 1 2.6 2.6Z" />
    </Svg>
  )
}

export function IconoTrasplantar(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 8.6 V 4.9" />
      <path d="M12 5.9 C 10.4 5.9, 9.3 4.9, 9.1 3.2 C 10.8 3.2, 11.8 4.2, 12 5.9 Z" />
      <path d="M12 5.9 C 13.6 5.9, 14.7 4.9, 14.9 3.2 C 13.2 3.2, 12.2 4.2, 12 5.9 Z" />
      <path d="M12 11.5 V 17.5" />
      <path d="M9.6 15.2 L 12 17.7 L 14.4 15.2" />
      <path d="M4.5 20.8 C 7.5 19, 16.5 19, 19.5 20.8" />
    </Svg>
  )
}

/** Cosechar: canasto de mimbre */
export function IconoCosechar(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4.8 11.6 H 19.2 L 17.8 17.6 C 17.5 19 16.5 19.7 15.1 19.7 H 8.9 C 7.5 19.7 6.5 19 6.2 17.6 Z" />
      <path d="M6.3 15 H 17.7" />
      <circle cx="9.7" cy="8.6" r="2.2" />
      <circle cx="14.4" cy="9.4" r="1.8" />
      <path d="M9.7 6.4 C 9.7 5 10.9 4.3 12 4.3" />
    </Svg>
  )
}

/** Regar: regadera con gotas */
export function IconoRegar(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="8" y="10.5" width="9.5" height="8" rx="2.2" />
      <path d="M11 10.5 C 11 8.4, 14.5 8.4, 14.5 10.5" />
      <path d="M8 13.2 L 4.4 9.9" />
      <path d="M4.9 7.4 L 4.6 7" />
      <path d="M3.1 8.9 L 2.7 8.6" />
      <path d="M6.4 6.5 L 6.2 6" />
    </Svg>
  )
}

/** Plaga: bichito */
export function IconoPlaga(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="13.4" r="5" />
      <path d="M12 8.4 V 18.4" />
      <circle cx="9.7" cy="12" r="0.55" fill="currentColor" stroke="none" />
      <circle cx="14.3" cy="14.6" r="0.55" fill="currentColor" stroke="none" />
      <path d="M10.3 8.7 C 9.5 7.3, 8.4 6.5, 7 6.3" />
      <path d="M13.7 8.7 C 14.5 7.3, 15.6 6.5, 17 6.3" />
      <path d="M7.2 12 H 5" />
      <path d="M7.5 15.4 L 5.6 16.6" />
      <path d="M16.8 12 H 19" />
      <path d="M16.5 15.4 L 18.4 16.6" />
    </Svg>
  )
}

/** Editar: lápiz sobre recuadro. El lápiz solo ya significa "nota del diario". */
export function IconoEditar(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M11.2 5.8 H 6.4 C 5.1 5.8, 4.2 6.7, 4.2 8 V 17.6 C 4.2 18.9, 5.1 19.8, 6.4 19.8 H 16 C 17.3 19.8, 18.2 18.9, 18.2 17.6 V 12.6" />
      <path d="M9.6 14.6 L 10.2 12.1 L 16.9 5.4 C 17.7 4.6, 18.9 4.6, 19.7 5.4 C 20.5 6.2, 20.5 7.4, 19.7 8.2 L 13 14.9 L 9.6 14.6 Z" />
    </Svg>
  )
}

/** Nota: lápiz */
export function IconoNota(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M5 19.3 L 5.9 15.7 L 15.7 5.9 C 16.7 4.9, 18.3 4.9, 19.3 5.9 C 20.3 6.9, 20.3 8.5, 19.3 9.5 L 9.5 19.3 L 5 19.3 Z" />
      <path d="M14.3 7.3 L 17.9 10.9" />
    </Svg>
  )
}

/** Foto: cámara */
export function IconoFoto(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="4" y="7.8" width="16" height="11.4" rx="2.6" />
      <circle cx="12" cy="13.4" r="3.1" />
      <path d="M9.3 7.8 L 10.3 5.4 H 13.7 L 14.7 7.8" />
    </Svg>
  )
}

/**
 * Cuidados: manos ahuecadas sosteniendo un brote.
 *
 * La primera versión era el plantín atado a su tutor, y a 20 px se leía como
 * una silla. Y una herramienta —tijera, regadera— habría sesgado hacia una
 * sola de las catorce prácticas. Las manos no: dicen cuidar, sin decir cómo.
 */
export function IconoCuidado(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M4.2 13.5 C 4.2 18.6, 7.7 21.6, 12 21.6 C 16.3 21.6, 19.8 18.6, 19.8 13.5" />
      <path d="M4.2 13.5 C 4.2 11.8, 5.6 11.2, 6.4 12.4" />
      <path d="M19.8 13.5 C 19.8 11.8, 18.4 11.2, 17.6 12.4" />
      <path d="M12 17.5 V 10.5" />
      <path d="M12 11.5 C 10.2 11.5, 9 10.3, 8.8 8.4 C 10.7 8.4, 11.8 9.5, 12 11.5 Z" />
      <path d="M12 11.5 C 13.8 11.5, 15 10.3, 15.2 8.4 C 13.3 8.4, 12.2 9.5, 12 11.5 Z" />
    </Svg>
  )
}

/** Alerta */
export function IconoAlerta(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M10.5 4.8 C 11.2 3.6, 12.8 3.6, 13.5 4.8 L 20.6 17.3 C 21.3 18.5, 20.4 20, 19.1 20 H 4.9 C 3.6 20, 2.7 18.5, 3.4 17.3 Z" />
      <path d="M12 9.5 V 13.7" />
      <circle cx="12" cy="16.6" r="0.6" fill="currentColor" stroke="none" />
    </Svg>
  )
}

/** Fuente: libro abierto */
export function IconoFuente(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 6.6 C 10 4.9, 7 4.6, 4 5.1 V 17.6 C 7 17.1, 10 17.4, 12 19.1 C 14 17.4, 17 17.1, 20 17.6 V 5.1 C 17 4.6, 14 4.9, 12 6.6 Z" />
      <path d="M12 6.6 V 19.1" />
    </Svg>
  )
}

/** Confianza: escudo con tilde */
export function IconoConfianza(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3.5 L 18.5 5.9 V 11 C 18.5 15.4, 16 18.9, 12 20.5 C 8 18.9, 5.5 15.4, 5.5 11 V 5.9 Z" />
      <path d="M9.1 11.9 L 11.3 14.1 L 15.1 9.9" />
    </Svg>
  )
}

/** Reloj: ventana que se cierra */
export function IconoReloj(p: IconProps) {
  return (
    <Svg {...p}>
      <circle cx="12" cy="12" r="7.6" />
      <path d="M12 7.8 V 12 L 15.2 13.8" />
    </Svg>
  )
}

/** Bajar: flecha que entra a la bandeja (backup que sale de la app) */
export function IconoBajar(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 3.8 V 14.4" />
      <path d="M8 10.6 L 12 14.7 L 16 10.6" />
      <path d="M4.4 16.2 V 18.2 C 4.4 19.4, 5.3 20.2, 6.4 20.2 H 17.6 C 18.7 20.2, 19.6 19.4, 19.6 18.2 V 16.2" />
    </Svg>
  )
}

/** Subir: flecha que sale de la bandeja (backup que vuelve a la app) */
export function IconoSubir(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 14.7 V 4.1" />
      <path d="M8 8.2 L 12 4.1 L 16 8.2" />
      <path d="M4.4 16.2 V 18.2 C 4.4 19.4, 5.3 20.2, 6.4 20.2 H 17.6 C 18.7 20.2, 19.6 19.4, 19.6 18.2 V 16.2" />
    </Svg>
  )
}

/** Instalar: el celular con la app entrando */
export function IconoInstalar(p: IconProps) {
  return (
    <Svg {...p}>
      <rect x="6.2" y="2.8" width="11.6" height="18.4" rx="2.4" />
      <path d="M12 7.6 V 14.2" />
      <path d="M9.4 11.6 L 12 14.4 L 14.6 11.6" />
      <path d="M10.4 18.4 H 13.6" />
    </Svg>
  )
}

/**
 * Desplegar: el galón hacia abajo. Apunta a lo que se va a abrir y gira 180°
 * cuando ya está abierto, así el ícono también dice el estado y no solo la
 * acción.
 */
export function IconoDesplegar(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M7 10 L 12 15 L 17 10" />
    </Svg>
  )
}

/** Aviso: campanita. Es el signo universal; inventar otro sería presumido. */
export function IconoCampana(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M6.3 16.6 V 11.1 C 6.3 7.9, 8.8 5.4, 12 5.4 C 15.2 5.4, 17.7 7.9, 17.7 11.1 V 16.6 L 19.2 18.6 H 4.8 Z" />
      <path d="M10.2 18.6 C 10.2 19.7, 11 20.5, 12 20.5 C 13 20.5, 13.8 19.7, 13.8 18.6" />
      <path d="M12 5.4 V 3.6" />
    </Svg>
  )
}

/** Maceta: labio, cuerpo cónico y un brote. Sin el brote se lee como balde. */
export function IconoMaceta(p: IconProps) {
  return (
    <Svg {...p}>
      <path d="M12 9.6 V 6.6" />
      <path d="M12 7.4 C 10.1 7.4, 9 5.9, 9.2 4.2 C 11 4.3, 12 5.7, 12 7.4 Z" />
      <path d="M4.6 9.6 H 19.4 V 11.6 H 4.6 Z" />
      <path d="M6.2 11.6 L 7.5 19.4 C 7.6 20 8.1 20.4 8.7 20.4 H 15.3 C 15.9 20.4 16.4 20 16.5 19.4 L 17.8 11.6" />
    </Svg>
  )
}

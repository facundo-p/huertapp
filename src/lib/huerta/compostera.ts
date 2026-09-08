import {
  ESTADOS_COMPOST,
  diasEntre,
  type Compostera,
  type EstadoCompost,
  type MaterialCompost,
  type SistemaCompost,
} from './tipos'
import { sumarDias } from './estimar'

/**
 * Lo puro de «mi compostera»: el ritmo es tuyo (lo elegís vos, la guía solo
 * recomienda), el próximo giro se cuenta desde el último que anotaste, y los
 * tres estados giran en rueda porque un tacho se vuelve a usar.
 */

export const SISTEMA_COMPOST_INFO: Record<SistemaCompost, { etiqueta: string }> = {
  tachos: { etiqueta: 'Tacho' },
  suelo: { etiqueta: 'A suelo' },
}

export const MATERIAL_COMPOST_INFO: Record<MaterialCompost, { etiqueta: string }> = {
  cocina: { etiqueta: 'Restos de cocina' },
  jardin: { etiqueta: 'Restos del jardín' },
}

/** Las opciones del alta. Son tu manejo, no un dato de la guía: por eso no llevan fuente. */
export const RITMOS_ELEGIBLES: { dias: number | null; etiqueta: string }[] = [
  { dias: 3, etiqueta: 'Cada 3 días' },
  { dias: 7, etiqueta: 'Cada semana' },
  { dias: 14, etiqueta: 'Cada 15 días' },
  { dias: 30, etiqueta: 'Cada mes' },
  { dias: null, etiqueta: 'Sin aviso' },
]

/** Con lombrices se gira menos (las guías las nombran como aliadas de la aireación). */
export const ritmoSugerido = (conLombrices: boolean): number => (conLombrices ? 14 : 7)

export function textoRitmo(dias: number | null): string {
  if (dias == null) return 'sin aviso'
  return dias === 7 ? 'cada semana' : dias === 30 ? 'cada mes' : `cada ${dias} días`
}

/** Desde cuándo se cuenta el próximo giro: el último anotado, o el estado actual. */
export const baseDelGiro = (c: Compostera): string => c.girada ?? c.estadoDesde

export function proximoGiro(c: Compostera): string | null {
  return c.ritmoDias == null ? null : sumarDias(baseDelGiro(c), c.ritmoDias)
}

export function siguienteEstado(e: EstadoCompost): EstadoCompost {
  return ESTADOS_COMPOST[(ESTADOS_COMPOST.indexOf(e) + 1) % ESTADOS_COMPOST.length]
}

/**
 * Pasa al estado que sigue. Salir de «llenando» fija `cerrada`, que es desde
 * donde la guía cuenta los meses; «lo usé» vuelve al principio y borra todo.
 */
export function avanzar(c: Compostera, hoy: string): Compostera {
  const estado = siguienteEstado(c.estado)
  if (estado === 'llenando') {
    return { ...c, estado, estadoDesde: hoy, cerrada: undefined, girada: undefined }
  }
  return { ...c, estado, estadoDesde: hoy, cerrada: c.cerrada ?? hoy }
}

/** Día en que vale revisar si está: `cerrada` más el plazo de la guía. */
export function revisionListo(c: Compostera, plazoDias: number | null): string | null {
  return c.cerrada && plazoDias != null ? sumarDias(c.cerrada, plazoDias) : null
}

export const diasEnEstado = (c: Compostera, hoy: string): number => Math.max(0, diasEntre(c.estadoDesde, hoy))

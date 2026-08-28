import type { EspecieEnriquecida, Rango } from '../data/types'
import { desdeISO, diasEntre, hoyISO, type Etapa, type Planta } from './tipos'

/**
 * Fechas estimadas a partir del ciclo de la ficha. Son estimaciones y se dicen
 * como tales: el rango de la ficha se conserva entero en vez de promediarlo,
 * porque un "entre 80 y 100 días" no es lo mismo que un "90 días" y la
 * diferencia importa cuando estás mirando si ya se puede cosechar.
 *
 * Y todo se cuenta desde la siembra pero **corrido por la germinación real**:
 * el reloj de un plantín arranca cuando asoma, no cuando lo enterraste.
 */

export function sumarDias(iso: string, dias: number): string {
  const d = desdeISO(iso)
  d.setDate(d.getDate() + dias)
  return hoyISO(d)
}

/**
 * Cuántos días se salió esta planta de la ventana de germinación que decía la
 * ficha. Es dato tuyo, no de la especie: la ficha sigue diciendo "25-35 días
 * desde la siembra" y esto corrige que esta semilla arrancó tarde. Adentro de
 * la ventana no corrige nada — la ficha ya lo daba por normal.
 */
export function corrimiento(p: Planta, e: EspecieEnriquecida): number {
  if (!p.germino || !e.dias_germinacion) return 0
  const tarde = diasEntre(sumarDias(p.sembrada, e.dias_germinacion.max), p.germino)
  const temprano = diasEntre(p.germino, sumarDias(p.sembrada, e.dias_germinacion.min))
  if (tarde > 0) return tarde
  if (temprano > 0) return -temprano
  return 0
}

export interface Hito {
  titulo: string
  desde: string
  hasta: string
  /** días hasta el comienzo de la ventana; negativo = ya pasó */
  faltan: number
  /** ya estamos dentro del rango estimado */
  enVentana: boolean
}

function hito(titulo: string, sembrada: string, rango: Rango, hoy: string, corrido: number): Hito {
  const desde = sumarDias(sembrada, rango.min + corrido)
  const hasta = sumarDias(sembrada, rango.max + corrido)
  const faltan = diasEntre(hoy, desde)
  return { titulo, desde, hasta, faltan, enVentana: faltan <= 0 && diasEntre(hoy, hasta) >= 0 }
}

export interface Estimacion {
  diasDesdeSiembra: number
  /** días que se corrió todo el ciclo porque la germinación no fue la prevista */
  corrimiento: number
  trasplante: Hito | null
  cosecha: Hito | null
  /** el hito que viene, para mostrar uno solo en la tarjeta */
  proximo: Hito | null
}

export function estimar(p: Planta, e: EspecieEnriquecida, hoy = hoyISO()): Estimacion {
  const corrido = corrimiento(p, e)
  const trasplante =
    e.dias_a_trasplante && p.etapa === 'almacigo'
      ? hito('Trasplante', p.sembrada, e.dias_a_trasplante, hoy, corrido)
      : null
  const cosecha = e.dias_a_cosecha ? hito('Cosecha', p.sembrada, e.dias_a_cosecha, hoy, corrido) : null

  return {
    diasDesdeSiembra: diasEntre(p.sembrada, hoy),
    corrimiento: corrido,
    trasplante,
    cosecha,
    proximo: p.etapa === 'terminada' ? null : (trasplante ?? cosecha),
  }
}

/** "faltan 12 días" · "ya se puede" · "hace 5 días que se pasó" */
export function textoHito(h: Hito): string {
  if (h.enVentana) return 'ya se puede'
  if (h.faltan > 0) return h.faltan === 1 ? 'falta 1 día' : `faltan ${h.faltan} días`
  const pasados = -h.faltan
  return pasados === 1 ? 'se pasó por 1 día' : `se pasó por ${pasados} días`
}

/** La etapa que sigue, o null si ya terminó. */
export function siguienteEtapa(p: Planta): Etapa | null {
  switch (p.etapa) {
    case 'almacigo':
      return 'trasplantada'
    case 'trasplantada':
      return 'creciendo'
    case 'creciendo':
      return 'cosechando'
    case 'cosechando':
      return 'terminada'
    default:
      return null
  }
}

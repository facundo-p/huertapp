import type { EspecieEnriquecida } from '../data/types'
import { diasEntre, hoyISO, type Planta } from './tipos'
import { corrimiento, sumarDias } from './estimar'

/**
 * El ciclo de una planta proyectado sobre la ventana del gantt.
 *
 * Todo en días RELATIVOS a hoy: negativo es pasado. El componente solo tiene
 * que multiplicar por un porcentaje, y acá se puede testear que el trasplante
 * de "Los del cajón" cae donde tiene que caer sin abrir un navegador. Un error
 * de tres días no rompe nada y se ve como una barra corrida.
 */

/** 60 días atrás y 120 adelante. Hoy queda en el 33,33 %. */
export const DIAS_ATRAS = 60
export const DIAS_ADELANTE = 120
export const VENTANA = DIAS_ATRAS + DIAS_ADELANTE

export interface Ventanas {
  /** día de la siembra; siempre ≤ 0 */
  siembra: number
  /** [desde, hasta] en días desde hoy, o null si la especie no lo declara */
  trasplante: [number, number] | null
  cosecha: [number, number] | null
  /** días que se corrió el ciclo porque la germinación no fue la prevista */
  corrimiento: number
}

/**
 * A diferencia de `estimar()`, la ventana de trasplante se calcula SIEMPRE,
 * también para una planta que ya lo pasó.
 *
 * `estimar().trasplante` se apaga cuando la etapa deja de ser almácigo, y está
 * bien para lo que hace: alimenta `proximo`, y a una planta ya trasplantada no
 * hay que ofrecerle "trasplantar" como lo que viene. Pero el gantt dibuja el
 * ciclo entero, pasado incluido: si usara ese campo, la barra de trasplante
 * desaparecería justo cuando la planta la cumplió.
 */
export function ventanas(p: Planta, e: EspecieEnriquecida, hoy = hoyISO()): Ventanas {
  const corrido = corrimiento(p, e)
  const tramo = (r: { min: number; max: number } | null | undefined): [number, number] | null =>
    r
      ? [
          diasEntre(hoy, sumarDias(p.sembrada, r.min + corrido)),
          diasEntre(hoy, sumarDias(p.sembrada, r.max + corrido)),
        ]
      : null

  return {
    siembra: diasEntre(hoy, p.sembrada),
    trasplante: hayTrasplante(p) ? tramo(e.dias_a_trasplante) : null,
    cosecha: tramo(e.dias_a_cosecha),
    corrimiento: corrido,
  }
}

/**
 * Siembra directa o plantación: no hay almácigo que trasplantar y la barra de
 * crecer va derecho a la de cosecha.
 *
 * Se pregunta por lo que NO lleva trasplante y no por `=== 'almacigo'`, porque
 * `almacigo_protegido` también lo lleva. Sin método declarado manda la ficha:
 * si la especie tiene días a trasplante, se dibuja.
 */
function hayTrasplante(p: Planta): boolean {
  return p.metodo !== 'directa' && p.metodo !== 'plantacion'
}

/** Un día relativo, como porcentaje del ancho del gantt. Recortado a la ventana. */
export function pct(dia: number): number {
  return Math.max(0, Math.min(100, ((dia + DIAS_ATRAS) / VENTANA) * 100))
}

/** ¿Queda algo de este tramo dentro de la ventana que se dibuja? */
export function visible(tramo: [number, number] | null): tramo is [number, number] {
  if (!tramo) return false
  return tramo[1] >= -DIAS_ATRAS && tramo[0] <= DIAS_ADELANTE
}

/**
 * Los siete meses del eje, calculados desde hoy y no fijos: en septiembre
 * corresponde jul…ene.
 */
export function mesesDelEje(hoy = hoyISO()): { mes: number; esActual: boolean }[] {
  const base = new Date(`${hoy}T00:00:00`)
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(base)
    d.setDate(d.getDate() + (i * 30 - DIAS_ATRAS))
    return { mes: d.getMonth() + 1, esActual: i * 30 - DIAS_ATRAS <= 0 && (i + 1) * 30 - DIAS_ATRAS > 0 }
  })
}

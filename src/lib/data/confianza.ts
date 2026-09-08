import { nivelConfianza } from './especies'

export type Punto = 'alta' | 'media' | 'baja' | 'vacio'

/**
 * Los diez puntos de la fila de confianza: los primeros `n` del color del
 * nivel, el resto vacíos. `null` (sin dato) son diez vacíos: no es confianza
 * baja, es que no hay dato que medir.
 */
export function puntosConfianza(valor: number | null): Punto[] {
  const nivel = nivelConfianza(valor)
  const n = valor === null ? 0 : Math.max(0, Math.min(10, Math.round(valor)))
  return Array.from({ length: 10 }, (_, i) => (i < n && nivel !== 'sin' ? nivel : 'vacio'))
}

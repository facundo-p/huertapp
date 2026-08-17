import type { TipoCuidado } from './types'

/**
 * Cómo se llama cada práctica de manejo en la app.
 *
 * El orden importa: cuando una ficha tiene varios cuidados se muestran en este
 * orden y no en el que estén cargados, para que dos fichas distintas se lean
 * igual. Va de lo que se hace más temprano en el ciclo a lo que se hace más
 * tarde, con lo que se planifica de antemano —la rotación— al final.
 */
export const ORDEN_CUIDADOS: TipoCuidado[] = [
  'riego',
  'raleo',
  'aporque',
  'tutorado',
  'poda',
  'mulch',
  'blanqueo',
  'polinizacion',
  'abonado',
  'desmalezar',
  'proteger',
  'contener',
  'dividir',
  'rotacion',
]

export const ETIQUETA_CUIDADO: Record<TipoCuidado, string> = {
  raleo: 'Raleo',
  aporque: 'Aporque',
  tutorado: 'Tutorado',
  poda: 'Poda',
  mulch: 'Mulch',
  blanqueo: 'Blanqueo',
  riego: 'Riego',
  abonado: 'Abonado',
  desmalezar: 'Desmalezado',
  rotacion: 'Rotación',
  polinizacion: 'Polinización',
  proteger: 'Reparo',
  contener: 'Contención',
  dividir: 'División de mata',
}

const POSICION = new Map(ORDEN_CUIDADOS.map((t, i) => [t, i]))

export function ordenarCuidados<T extends { tipo: TipoCuidado }>(cuidados: T[]): T[] {
  return [...cuidados].sort((a, b) => (POSICION.get(a.tipo) ?? 99) - (POSICION.get(b.tipo) ?? 99))
}

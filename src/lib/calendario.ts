// Lógica pura del calendario: comprimir meses sueltos en tramos legibles
// ("de agosto a octubre") y etiquetar los métodos de siembra.
import type { Mes, Metodo } from './data/types'
import { NOMBRES_MES } from './fechas'

const anterior = (m: Mes) => (((m + 10) % 12) + 1) as Mes
const siguiente = (m: Mes) => ((m % 12) + 1) as Mes

/**
 * Agrupa meses consecutivos en tramos [desde, hasta], cruzando el fin de año:
 * [11,12,1] → [[11,1]]. El año entero se devuelve como un solo tramo [1,12].
 */
export function tramos(meses: readonly Mes[]): Array<[Mes, Mes]> {
  const set = new Set(meses)
  if (set.size === 0) return []
  if (set.size === 12) return [[1, 12]]

  const salida: Array<[Mes, Mes]> = []
  for (const m of [...set].sort((a, b) => a - b)) {
    if (set.has(anterior(m))) continue // no es el arranque de su tramo
    let fin = m
    while (set.has(siguiente(fin))) fin = siguiente(fin)
    salida.push([m, fin])
  }
  return salida
}

/** Une frases en castellano: "a", "a y b", "a, b y c". */
export function unir(partes: readonly string[]): string {
  if (partes.length <= 1) return partes[0] ?? ''
  return `${partes.slice(0, -1).join(', ')} y ${partes[partes.length - 1]}`
}

/** "de agosto a octubre y en diciembre" · "" si no hay meses. */
export function textoMeses(meses: readonly Mes[]): string {
  const ts = tramos(meses)
  if (ts.length === 0) return ''
  if (ts.length === 1 && ts[0][0] === 1 && ts[0][1] === 12) return 'todo el año'
  return unir(
    ts.map(([a, b]) => (a === b ? NOMBRES_MES[a - 1] : `de ${NOMBRES_MES[a - 1]} a ${NOMBRES_MES[b - 1]}`)),
  )
}

export const METODOS: Record<Metodo, string> = {
  directa: 'Siembra directa',
  almacigo: 'En almácigo',
  'directa|almacigo': 'Directa o en almácigo',
  almacigo_protegido: 'Almácigo protegido del frío',
  plantacion: 'Plantación (diente, bulbo o esqueje)',
}

/** Invierte metodo_por_mes: método → meses en los que se usa, ordenados. */
export function metodosPorMes(mapa: Record<string, Metodo>): Array<{ metodo: Metodo; meses: Mes[] }> {
  const porMetodo = new Map<Metodo, Mes[]>()
  for (const [mes, metodo] of Object.entries(mapa)) {
    const lista = porMetodo.get(metodo) ?? []
    lista.push(Number(mes) as Mes)
    porMetodo.set(metodo, lista)
  }
  return [...porMetodo.entries()]
    .map(([metodo, meses]) => ({ metodo, meses: meses.sort((a, b) => a - b) }))
    .sort((a, b) => b.meses.length - a.meses.length)
}

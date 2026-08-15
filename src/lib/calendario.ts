// Lógica pura del calendario: comprimir meses sueltos en tramos legibles
// ("de agosto a octubre") y etiquetar los métodos de siembra.
import type { Decada, Mes, Metodo } from './data/types'
import { NOMBRES_MES, NOMBRES_TERCIO, mesDeDecada, nombreDecada, tercioDeDecada } from './fechas'

/**
 * Agrupa unidades consecutivas en tramos [desde, hasta], cruzando el fin de
 * año: [11,12,1] → [[11,1]]. El año entero se devuelve como un solo tramo.
 * Sirve igual para meses (módulo 12) que para décadas (módulo 36).
 */
export function tramos<T extends number>(unidades: readonly T[], modulo = 12): Array<[T, T]> {
  const set = new Set<number>(unidades)
  if (set.size === 0) return []
  if (set.size === modulo) return [[1 as T, modulo as T]]

  const anterior = (u: number) => ((u + modulo - 2) % modulo) + 1
  const siguiente = (u: number) => (u % modulo) + 1

  const salida: Array<[T, T]> = []
  for (const u of [...set].sort((a, b) => a - b)) {
    if (set.has(anterior(u))) continue // no es el arranque de su tramo
    let fin = u
    while (set.has(siguiente(fin))) fin = siguiente(fin)
    salida.push([u as T, fin as T])
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

/**
 * Lo mismo con décadas: "de fines de agosto a mediados de octubre".
 * Si el tramo arranca en el primer tercio y termina en el último, no hace
 * falta la precisión: son meses enteros y se dice "de agosto a octubre".
 */
export function textoDecadas(decadas: readonly Decada[]): string {
  const ts = tramos(decadas, 36)
  if (ts.length === 0) return ''
  if (ts.length === 1 && ts[0][0] === 1 && ts[0][1] === 36) return 'todo el año'

  return unir(
    ts.map(([a, b]) => {
      const mesesEnteros = tercioDeDecada(a) === 1 && tercioDeDecada(b) === 3
      if (mesesEnteros) {
        const ma = NOMBRES_MES[mesDeDecada(a) - 1]
        const mb = NOMBRES_MES[mesDeDecada(b) - 1]
        return ma === mb ? `todo ${ma}` : `de ${ma} a ${mb}`
      }
      // dentro del mismo mes no hace falta repetirlo: "de mediados a fines de octubre"
      if (mesDeDecada(a) === mesDeDecada(b)) {
        const mes = NOMBRES_MES[mesDeDecada(a) - 1]
        if (a === b) return `${NOMBRES_TERCIO[tercioDeDecada(a) - 1]} de ${mes}`
        return `de ${NOMBRES_TERCIO[tercioDeDecada(a) - 1]} a ${NOMBRES_TERCIO[tercioDeDecada(b) - 1]} de ${mes}`
      }
      return a === b ? nombreDecada(a) : `de ${nombreDecada(a)} a ${nombreDecada(b)}`
    }),
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

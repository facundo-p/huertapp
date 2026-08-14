import type { EspecieEnriquecida, EspeciesDB, Grupo, Mes } from './types'
import { ALIAS, normalizar } from './slugs'

// El JSON no entra al bundle inicial: dynamic import → chunk propio hasheado,
// precacheado por el service worker. La app abre con el shell y el dato llega aparte.

export interface IndiceEspecies {
  db: EspeciesDB
  todas: EspecieEnriquecida[]
  porSlug: Map<string, EspecieEnriquecida>
  porGrupo: Map<Grupo, EspecieEnriquecida[]>
  /** mes (1-12) → especies con ese mes en siembra_ideal */
  idealesPorMes: Map<Mes, EspecieEnriquecida[]>
  /** texto normalizado de búsqueda por slug (nombre común, científico y alias) */
  textoBusqueda: Map<string, string>
}

let cache: Promise<IndiceEspecies> | null = null

export function cargarEspecies(): Promise<IndiceEspecies> {
  cache ??= import('../../../data/huerta_gba_enriquecido.json').then((m) =>
    indexar(m.default as unknown as EspeciesDB),
  )
  return cache
}

function indexar(db: EspeciesDB): IndiceEspecies {
  const todas = db.especies
  const porSlug = new Map(todas.map((e) => [e.slug, e]))

  const porGrupo = new Map<Grupo, EspecieEnriquecida[]>()
  for (const e of todas) {
    const lista = porGrupo.get(e.grupo) ?? []
    lista.push(e)
    porGrupo.set(e.grupo, lista)
  }

  const idealesPorMes = new Map<Mes, EspecieEnriquecida[]>()
  for (let m = 1 as Mes; m <= 12; m = (m + 1) as Mes) idealesPorMes.set(m, [])
  for (const e of todas) {
    for (const m of e.calendario.siembra_ideal) idealesPorMes.get(m)!.push(e)
  }

  const textoBusqueda = new Map(
    todas.map((e) => [
      e.slug,
      normalizar([e.nombre_comun, e.nombre_cientifico, ...(ALIAS[e.slug] ?? [])].join(' ')),
    ]),
  )

  return { db, todas, porSlug, porGrupo, idealesPorMes, textoBusqueda }
}

/** Estado de un mes para una especie: ideal, posible o fuera de ventana. */
export type EstadoMes = 'ideal' | 'posible' | null

export function estadoSiembra(e: EspecieEnriquecida, mes: Mes): EstadoMes {
  if (e.calendario.siembra_ideal.includes(mes)) return 'ideal'
  if (e.calendario.siembra_posible.includes(mes)) return 'posible'
  return null
}

export function estadoTrasplante(e: EspecieEnriquecida, mes: Mes): EstadoMes {
  if (e.calendario.trasplante_ideal.includes(mes)) return 'ideal'
  if (e.calendario.trasplante_posible.includes(mes)) return 'posible'
  return null
}

/** ¿Es el último mes de la ventana ideal de siembra? (para el aviso "se cierra") */
export function ultimoMesIdeal(e: EspecieEnriquecida, mes: Mes): boolean {
  const meses = e.calendario.siembra_ideal
  if (!meses.includes(mes)) return false
  const siguiente = ((mes % 12) + 1) as Mes
  return !meses.includes(siguiente)
}

/** ¿Admite almácigo en ese mes? (según el método derivado) */
export function admiteAlmacigo(e: EspecieEnriquecida, mes: Mes): boolean {
  const metodo = e.calendario.metodo_por_mes[String(mes)]
  return metodo === 'almacigo' || metodo === 'almacigo_protegido' || metodo === 'directa|almacigo'
}

export function nivelConfianza(n: number): 'alta' | 'media' | 'baja' {
  if (n >= 8) return 'alta'
  if (n >= 5) return 'media'
  return 'baja'
}

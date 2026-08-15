import type { Decada, EspecieEnriquecida, EspeciesDB, Grupo, Mes, Metodo, Zona } from './types'
import { ALIAS, normalizar } from './slugs'
import { decadaDe, decadasDelMes, diasHastaFinDeDecada, siguienteDecada } from '../fechas'

// El JSON no entra al bundle inicial: dynamic import → chunk propio hasheado,
// precacheado por el service worker. La app abre con el shell y el dato llega aparte.
//
// Probado y descartado: adelantar este chunk con `<link rel="modulepreload">`.
// Suena a mejora obvia —evita la cascada bundle → parse → import()— pero medido
// en 4× CPU y 1,6 Mbps sale 133 ms *peor* (1691 vs 1558 ms hasta contenido útil,
// mediana de 9 corridas, p90 sin solaparse): en un enlace angosto los 574 KB del
// catálogo le compiten el ancho de banda al bundle que hace falta para dibujar.

export interface IndiceEspecies {
  db: EspeciesDB
  todas: EspecieEnriquecida[]
  porSlug: Map<string, EspecieEnriquecida>
  porGrupo: Map<Grupo, EspecieEnriquecida[]>
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

  const textoBusqueda = new Map(
    todas.map((e) => [
      e.slug,
      normalizar([e.nombre_comun, e.nombre_cientifico, ...(ALIAS[e.slug] ?? [])].join(' ')),
    ]),
  )

  return { db, todas, porSlug, porGrupo, textoBusqueda }
}

/** Estado de una década para una especie: ideal, posible o fuera de ventana. */
export type EstadoMes = 'ideal' | 'posible' | null

export type Capa = 'siembra' | 'trasplante'

export function estado(e: EspecieEnriquecida, decada: Decada, zona: Zona, capa: Capa): EstadoMes {
  const v = e.calendario.decadas[zona]
  const ideal = capa === 'siembra' ? v.siembra_ideal : v.trasplante_ideal
  if (ideal.includes(decada)) return 'ideal'
  const posible = capa === 'siembra' ? v.siembra_posible : v.trasplante_posible
  return posible.includes(decada) ? 'posible' : null
}

export const estadoSiembra = (e: EspecieEnriquecida, d: Decada, z: Zona) => estado(e, d, z, 'siembra')
export const estadoTrasplante = (e: EspecieEnriquecida, d: Decada, z: Zona) => estado(e, d, z, 'trasplante')

/** Los tres tercios de un mes, para dibujar la celda. */
export function estadosDelMes(
  e: EspecieEnriquecida,
  mes: Mes,
  zona: Zona,
  capa: Capa,
): [EstadoMes, EstadoMes, EstadoMes] {
  const [a, b, c] = decadasDelMes(mes)
  return [estado(e, a, zona, capa), estado(e, b, zona, capa), estado(e, c, zona, capa)]
}

/** ¿Tiene alguna ventana de trasplante en esta zona? */
export function seTrasplanta(e: EspecieEnriquecida, zona: Zona): boolean {
  const v = e.calendario.decadas[zona]
  return v.trasplante_ideal.length + v.trasplante_posible.length > 0
}

/**
 * Si la ventana ideal se cierra al terminar la década actual, cuántos días
 * quedan. Devuelve null si no está en ventana ideal o si todavía sigue.
 * Es lo que permite decir "quedan 6 días" en vez de "último mes".
 */
export function diasHastaCierre(e: EspecieEnriquecida, hoy: Date, zona: Zona): number | null {
  const d = decadaDe(hoy)
  if (estadoSiembra(e, d, zona) !== 'ideal') return null
  if (estadoSiembra(e, siguienteDecada(d), zona) === 'ideal') return null
  return diasHastaFinDeDecada(hoy)
}

/** El método de siembra de un mes (el dato está a resolución mensual). */
export function metodoDelMes(e: EspecieEnriquecida, mes: Mes): Metodo | null {
  return e.calendario.metodo_por_mes[String(mes)] ?? null
}

/** ¿Sembrar en ese mes pide reparo del frío (invernadero, cajón, botella)? */
export function necesitaProteccion(e: EspecieEnriquecida, mes: Mes): boolean {
  return metodoDelMes(e, mes) === 'almacigo_protegido'
}

/** ¿Admite almácigo en el mes de esa década? (el método está a resolución mensual) */
export function admiteAlmacigo(e: EspecieEnriquecida, mes: Mes): boolean {
  const metodo = e.calendario.metodo_por_mes[String(mes)]
  return metodo === 'almacigo' || metodo === 'almacigo_protegido' || metodo === 'directa|almacigo'
}

export function nivelConfianza(n: number): 'alta' | 'media' | 'baja' {
  if (n >= 8) return 'alta'
  if (n >= 5) return 'media'
  return 'baja'
}

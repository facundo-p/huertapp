import type { EspecieEnriquecida } from './data/types'

/**
 * El filtro de temperatura de Explorar: cuatro rangos que se prenden y apagan
 * por separado. Modelo puro, sin React, para poder testear la semántica contra
 * el catálogo real.
 */

export type CriterioTemp =
  | 'germinacion_ideal'
  | 'germinacion_posible'
  | 'crecimiento_ideal'
  | 'crecimiento_tolera'

export interface Rango {
  min: number
  max: number
}

export interface InfoCriterio {
  clave: CriterioTemp
  etiqueta: string
  /** el suelo germina, el aire hace crecer: la aclaración evita comparar peras con manzanas */
  medio: 'tierra' | 'aire'
  /** las dos puntas tal como vienen del JSON, con sus null */
  lee: (e: EspecieEnriquecida) => [number | null, number | null]
}

export const CRITERIOS: readonly InfoCriterio[] = [
  {
    clave: 'germinacion_ideal',
    etiqueta: 'Ideal para germinar',
    medio: 'tierra',
    lee: (e) => [e.temperaturas.germinacion.ideal_min, e.temperaturas.germinacion.ideal_max],
  },
  {
    clave: 'germinacion_posible',
    etiqueta: 'Posible para germinar',
    medio: 'tierra',
    lee: (e) => [e.temperaturas.germinacion.min, e.temperaturas.germinacion.max],
  },
  {
    clave: 'crecimiento_ideal',
    etiqueta: 'Ideal para crecer',
    medio: 'aire',
    lee: (e) => [e.temperaturas.crecimiento.ideal_min, e.temperaturas.crecimiento.ideal_max],
  },
  {
    clave: 'crecimiento_tolera',
    etiqueta: 'Posible para crecer',
    medio: 'aire',
    lee: (e) => [e.temperaturas.crecimiento.tolera_min, e.temperaturas.crecimiento.tolera_max],
  },
] as const

const INFO = new Map(CRITERIOS.map((c) => [c.clave, c]))

export const infoCriterio = (clave: CriterioTemp): InfoCriterio => INFO.get(clave)!

/**
 * El rango de la especie, o null si le falta una punta: con una sola habría que
 * suponer la otra, y suponer es inventar.
 */
export function rangoDe(e: EspecieEnriquecida, clave: CriterioTemp): Rango | null {
  const [min, max] = infoCriterio(clave).lee(e)
  if (min === null || max === null) return null
  return { min, max }
}

/** Intersección no vacía. Tocarse en un punto ya es solaparse. */
export function seSolapan(a: Rango, b: Rango): boolean {
  return a.min <= b.max && b.min <= a.max
}

export function pasaCriterio(e: EspecieEnriquecida, clave: CriterioTemp, elegido: Rango): boolean {
  const suyo = rangoDe(e, clave)
  return suyo !== null && seSolapan(suyo, elegido)
}

// ── El riel ─────────────────────────────────────────────────────────────────

/** Las puntas del riel caen en múltiplos de 5 hacia afuera: números redondos. */
const PASO_DOMINIO = 5

/**
 * Hasta dónde se puede mover cada riel, sacado de los datos reales: si mañana
 * entra una especie más friolenta, la escala la acompaña sola. Sin ningún par
 * completo devuelve un rango vacío y la hoja no dibuja ese riel; no se inventa
 * una escala para un dato que no existe.
 */
export function dominioDe(especies: EspecieEnriquecida[], clave: CriterioTemp): Rango {
  const lee = infoCriterio(clave).lee
  const valores = especies.flatMap(lee).filter((v): v is number => v !== null)
  if (valores.length === 0) return { min: 0, max: 0 }
  return {
    min: Math.floor(Math.min(...valores) / PASO_DOMINIO) * PASO_DOMINIO,
    max: Math.ceil(Math.max(...valores) / PASO_DOMINIO) * PASO_DOMINIO,
  }
}

export function dominios(especies: EspecieEnriquecida[]): Record<CriterioTemp, Rango> {
  return Object.fromEntries(CRITERIOS.map((c) => [c.clave, dominioDe(especies, c.clave)])) as Record<
    CriterioTemp,
    Rango
  >
}

export const rielUtil = (dom: Rango): boolean => dom.max > dom.min

/**
 * Mueve una punta del rango elegido. No deja que se crucen ni que se salgan del
 * riel; sí deja que se junten: min === max es "que incluya estos 18 °C", y esa
 * es una pregunta legítima.
 */
export function moverPunta(r: Rango, punta: 'min' | 'max', valor: number, dom: Rango): Rango {
  if (punta === 'min') return { ...r, min: Math.min(Math.max(valor, dom.min), r.max) }
  return { ...r, max: Math.max(Math.min(valor, dom.max), r.min) }
}

/** Dónde cae un valor en el riel, 0-100. */
export function pctEn(dom: Rango, v: number): number {
  if (dom.max === dom.min) return 0
  const recortado = Math.min(Math.max(v, dom.min), dom.max)
  return ((recortado - dom.min) / (dom.max - dom.min)) * 100
}

// ── Lo elegido ──────────────────────────────────────────────────────────────

/** null = apagado. Record y no Partial: sumar un criterio obliga a nombrarlo acá. */
export type SeleccionTemp = Record<CriterioTemp, Rango | null>

export const SIN_TEMPERATURA: SeleccionTemp = Object.freeze({
  germinacion_ideal: null,
  germinacion_posible: null,
  crecimiento_ideal: null,
  crecimiento_tolera: null,
})

export const criteriosActivos = (s: SeleccionTemp): InfoCriterio[] =>
  CRITERIOS.filter((c) => s[c.clave] !== null)

export const hayTemperatura = (s: SeleccionTemp): boolean => criteriosActivos(s).length > 0

/** Los criterios prendidos son un Y, no un O: se piden todos a la vez. */
export function pasaTemperatura(e: EspecieEnriquecida, s: SeleccionTemp): boolean {
  return CRITERIOS.every((c) => {
    const elegido = s[c.clave]
    return elegido === null || pasaCriterio(e, c.clave, elegido)
  })
}

/**
 * A quiénes deja afuera la falta de dato, en minúscula y sin repetir. Con los
 * cuatro criterios prendidos son diecinueve: desaparecer en silencio parece no
 * existir en el catálogo.
 */
export function sinDatoPara(especies: EspecieEnriquecida[], s: SeleccionTemp): string[] {
  const activos = criteriosActivos(s)
  if (activos.length === 0) return []
  return especies
    .filter((e) => activos.some((c) => rangoDe(e, c.clave) === null))
    .map((e) => e.nombre_comun.toLowerCase())
}

/** "melisa, menta y laurel" */
export function listar(nombres: string[]): string {
  return nombres.length <= 1
    ? nombres.join('')
    : `${nombres.slice(0, -1).join(', ')} y ${nombres.at(-1)}`
}

export function textoSinDato(nombres: string[], criterios = 1): string | null {
  if (nombres.length === 0) return null
  const dato = criterios === 1 ? 'ese dato investigado' : 'esos datos investigados'
  const verbo = nombres.length === 1 ? 'queda' : 'quedan'
  return `Sin ${dato}, ${verbo} afuera ${listar(nombres)}.`
}

/** "de 18 a 27 °C" o "cualquiera" */
export const rotuloRango = (r: Rango | null): string =>
  r === null ? 'cualquiera' : `de ${r.min} a ${r.max} °C`

/** Lo elegido, en frases sueltas, para la línea del contador. */
export const resumenTemperatura = (s: SeleccionTemp): string[] =>
  criteriosActivos(s).map((c) => `${c.etiqueta.toLowerCase()} ${rotuloRango(s[c.clave])}`)

/** El nombre accesible del chip, que dice lo mismo que el contador. */
export function rotuloChip(s: SeleccionTemp): string {
  const partes = resumenTemperatura(s)
  return partes.length === 0 ? 'Temperatura: cualquiera' : `Temperatura: ${listar(partes)}`
}

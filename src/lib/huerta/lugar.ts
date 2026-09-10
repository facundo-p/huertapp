import type { Tarea } from '../tareas/engine'
import type { Planta, Ubicacion } from './tipos'
import { TIPO_UBICACION_INFO } from './ubicacion'

/**
 * El lugar como ficha: de qué tipo es, cómo se mide lo que tiene adentro y qué
 * tarea le queda pendiente. Lógica pura; la tarjeta (UI) solo dibuja.
 *
 * La disposición sale aparte del tipo porque solo aplica a bancales, y es la que
 * decide cómo se cuenta la ocupación: en un bancal en surcos hay unidades; en uno
 * de plantación libre las plantas van intercaladas y lo único medible es cuánta
 * superficie ocupan.
 */

export type ClaseLugar = 'almaciguera' | 'macetas' | 'bancal' | 'bancal_libre' | 'otro'

export interface Lugar {
  clase: ClaseLugar
  etiqueta: string
  /** sustantivo del contador, o null si el tipo no admite medirse */
  unidad: string | null
  /** medidor continuo (superficie) en vez de pips */
  continuo: boolean
}

const SIN_LUGAR: Lugar = { clase: 'otro', etiqueta: 'Sin lugar asignado', unidad: null, continuo: false }

/**
 * Un bancal sin disposición cargada —todos los que ya existían— NO se da por
 * "en surcos": lleva la etiqueta genérica del tipo y no promete unidades que
 * nadie declaró.
 */
export function lugarDe(u: Ubicacion | undefined): Lugar {
  if (!u) return SIN_LUGAR
  switch (u.tipo) {
    case 'almacigo':
      return { clase: 'almaciguera', etiqueta: 'Almaciguera', unidad: 'celdas', continuo: false }
    case 'maceta':
      return { clase: 'macetas', etiqueta: 'Macetas sueltas', unidad: 'macetas', continuo: false }
    case 'bancal':
    case 'bancal_elevado':
    case 'bancal_tierra':
      if (u.disposicion === 'libre')
        return { clase: 'bancal_libre', etiqueta: 'Bancal · plantación libre', unidad: 'm²', continuo: true }
      if (u.disposicion === 'surcos')
        return { clase: 'bancal', etiqueta: 'Bancal en surcos', unidad: 'surcos', continuo: false }
      return { clase: 'bancal', etiqueta: TIPO_UBICACION_INFO[u.tipo].etiqueta, unidad: null, continuo: false }
    default:
      return { clase: 'otro', etiqueta: TIPO_UBICACION_INFO[u.tipo].etiqueta, unidad: null, continuo: false }
  }
}

export interface Ocupacion {
  /** "6 de 12 celdas" · "~6 de 12 celdas" · "2 de 2,9 m² plantados" */
  texto: string
  ocupadas: number
  capacidad: number
  /** 0..1, para el medidor continuo */
  fraccion: number
  continuo: boolean
}

/** Los m² de un bancal, de las medidas que ya se cargan. Vienen en centímetros. */
function superficieDe(u: Ubicacion): number | null {
  if (u.capacidad != null) return u.capacidad
  const { ancho, largo } = u.medidas ?? {}
  if (ancho == null || largo == null) return null
  return Math.round(((ancho * largo) / 10000) * 10) / 10
}

/** La coma decimal, que acá es la usual. Los enteros salen sin decimales. */
const num = (n: number) => String(Math.round(n * 10) / 10).replace('.', ',')

/**
 * Cuán lleno está. `null` cuando no hay capacidad: la ficha muestra el tipo y
 * nada más, porque un medidor sin capacidad tendría que inventarse el total.
 */
export function ocupacionDe(u: Ubicacion, plantas: Planta[]): Ocupacion | null {
  const lugar = lugarDe(u)
  if (!lugar.unidad) return null

  if (lugar.continuo) {
    const capacidad = superficieDe(u)
    if (capacidad == null || capacidad <= 0) return null
    const ocupadas = plantas.reduce((s, p) => s + (p.superficie ?? 0), 0)
    return {
      texto: `${num(ocupadas)} de ${num(capacidad)} m² plantados`,
      ocupadas,
      capacidad,
      fraccion: Math.min(1, ocupadas / capacidad),
      continuo: true,
    }
  }

  const capacidad = u.capacidad
  if (capacidad == null || capacidad <= 0) return null
  // una planta que está acá toma al menos una unidad; si no dijo cuántas, el
  // total va con "~", que es como la app dice el resto de lo estimado
  const aOjo = plantas.some((p) => p.ocupa == null)
  const ocupadas = plantas.reduce((s, p) => s + (p.ocupa ?? 1), 0)
  return {
    texto: `${aOjo ? '~' : ''}${ocupadas} de ${capacidad} ${lugar.unidad}`,
    ocupadas,
    capacidad,
    fraccion: Math.min(1, ocupadas / capacidad),
    continuo: false,
  }
}

export interface ProximaTarea {
  texto: string
  urgente: boolean
}

/**
 * La tarea que le queda pendiente al lugar. Sale del MISMO motor que alimenta
 * Esta semana: si la ficha contara por su cuenta, tarde o temprano las dos
 * pantallas dirían cosas distintas del mismo lugar.
 */
export function proximaTareaDe(tareas: Tarea[], plantas: Planta[]): ProximaTarea | null {
  if (plantas.length === 0) return { texto: 'Vacío: listo para sembrar', urgente: false }
  const ids = new Set(plantas.map((p) => p.id))
  const suyas = tareas.filter((t) => t.plantaId && ids.has(t.plantaId))
  if (suyas.length === 0) return null
  // lo atrasado primero, y entre iguales manda la prioridad del motor
  const elegida = [...suyas].sort(
    (a, b) => Number(b.atrasada ?? false) - Number(a.atrasada ?? false) || a.prioridad - b.prioridad,
  )[0]
  return { texto: elegida.titulo, urgente: !!elegida.atrasada }
}

/** Orden de la lista: primero donde nacen las plantas, después donde crecen. */
const ORDEN: Record<ClaseLugar, number> = {
  almaciguera: 0,
  macetas: 1,
  bancal: 2,
  bancal_libre: 2,
  otro: 3,
}

export function ordenDeLugar(u: Ubicacion | undefined): number {
  return u ? ORDEN[lugarDe(u).clase] : 4
}

import type { EspecieEnriquecida } from '../data/types'
import type { AvisoClima } from '../pronostico/tipos'
import type { Tarea } from '../tareas/engine'
import { sumarDias } from './estimar'
import { germinacion, germinacionPendiente } from './germinacion'
import { lugarDe, superficieDe } from './lugar'
import type { Planta, Ubicacion } from './tipos'

/**
 * El croquis de Mi huerta, nivel 0: sale sólo de lo que ya está cargado. Una
 * grilla gruesa por lugar, y cada siembra en un bloque de celdas seguidas.
 * Lógica pura: el componente sólo dibuja.
 */

export type ClaseCroquis = 'almaciguera' | 'macetas' | 'surcos' | 'libre' | 'otro'
export type AnchoCroquis = 'media' | 'entera'

export interface GrillaLugar {
  clase: ClaseCroquis
  ancho: AnchoCroquis
  cols: number
  filas: number
  /** las celdas que existen: en 3 × 2 con capacidad 5, la sexta no se dibuja */
  cap: number
  /** el id de la planta de cada celda, o null si está libre. Mide `cap` */
  celdas: (string | null)[]
}

// en coma flotante 1,12 / 0,16 da 7,000…1, y Math.ceil devuelve 8
const redondear6 = (n: number) => Math.round(n * 1e6) / 1e6
const unidades = (n: number) => Math.max(1, Math.ceil(redondear6(n)))

/** Filas del bancal libre: 6 columnas a lo largo del lado mayor, con la proporción acotada. */
function filasLibre(u: Ubicacion): number {
  const { ancho, largo } = u.medidas ?? {}
  if (!ancho || !largo) return 3
  const proporcion = Math.min(2.5, Math.max(1.3, Math.max(ancho, largo) / Math.min(ancho, largo)))
  return Math.round(6 / proporcion)
}

function claseDe(u: Ubicacion | undefined): ClaseCroquis {
  const lugar = lugarDe(u)
  if (lugar.clase === 'almaciguera' || lugar.clase === 'macetas') return lugar.clase
  if (lugar.clase === 'bancal_libre') {
    const m2 = superficieDe(u!)
    return m2 != null && m2 > 0 ? 'libre' : 'otro'
  }
  // un bancal sin disposición no promete surcos que nadie declaró
  if (lugar.clase === 'bancal' && u?.disposicion === 'surcos') return 'surcos'
  return 'otro'
}

/**
 * Las plantas que se dibujan, en orden de carga. No por `sembrada`: se edita
 * en el alta, y una siembra vieja cargada hoy correría a las demás.
 */
export const enOrdenDeCarga = (plantas: Planta[]): Planta[] =>
  plantas
    .filter((p) => !p.archivada && p.etapa !== 'terminada')
    .sort((a, b) => a.creada.localeCompare(b.creada) || a.id.localeCompare(b.id))

export function grillaDe(u: Ubicacion | undefined, plantas: Planta[]): GrillaLugar {
  const clase = claseDe(u)
  const vivas = enOrdenDeCarga(plantas)

  let cols: number
  let filas: number
  let ancho: AnchoCroquis
  let demanda: number[]
  let cap: number

  if (clase === 'libre') {
    cols = 6
    filas = filasLibre(u!)
    ancho = 'entera'
    cap = cols * filas
    const m2PorCelda = superficieDe(u!)! / cap
    demanda = vivas.map((p) => (p.superficie ? unidades(p.superficie / m2PorCelda) : 1))
  } else if (clase === 'otro') {
    demanda = vivas.map(() => 1)
    cap = vivas.length
    cols = 3
    filas = Math.ceil(cap / cols)
    ancho = 'media'
  } else {
    demanda = vivas.map((p) => unidades(p.ocupa ?? 1))
    // sin capacidad no se dibujan celdas vacías: la misma regla que el medidor
    cap = u?.capacidad && u.capacidad > 0 ? u.capacidad : demanda.reduce((s, n) => s + n, 0)
    if (clase === 'surcos') {
      cols = 1
      filas = cap
      ancho = cap <= 4 ? 'media' : 'entera'
    } else {
      cols = cap <= 6 ? 3 : 6
      filas = Math.ceil(cap / cols)
      ancho = cols === 3 ? 'media' : 'entera'
    }
  }

  // lo sembrado pide más de lo que hay: una celda a cada una y el resto en
  // orden. Si ni eso alcanza, suma filas: mejor fuera de escala que una planta
  // sin enlace ni banderita
  if (demanda.reduce((s, n) => s + n, 0) > cap) {
    if (vivas.length > cap) {
      filas = Math.ceil(vivas.length / cols)
      cap = clase === 'libre' ? cols * filas : vivas.length
    }
    let sobran = cap - vivas.length
    demanda = demanda.map((n) => {
      const extra = Math.min(n - 1, sobran)
      sobran -= extra
      return 1 + extra
    })
  }

  const celdas: (string | null)[] = Array.from({ length: cap }, () => null)
  let pos = 0
  demanda.forEach((n, i) => {
    const col = pos % cols
    // un bloque no se corta entre filas si entra entero en la siguiente, salvo
    // que saltar deje sin lugar a las que siguen
    if (col > 0 && n > cols - col && n <= cols) {
      const salto = pos - col + cols
      const resto = demanda.slice(i + 1).reduce((s, m) => s + m, 0)
      if (salto + n + resto <= cap) pos = salto
    }
    for (let k = 0; k < n; k++) celdas[pos + k] = vivas[i].id
    pos += n
  })

  return { clase, ancho, cols, filas, cap, celdas }
}

/**
 * Los de media página van de a dos. Si a uno le sigue uno de página entera,
 * sube el próximo de media a llenar el hueco. En el dato y no con
 * `grid-auto-flow: dense`, que deja el foco saltando para arriba.
 */
export function empaquetar<T extends { ancho: AnchoCroquis }>(lugares: T[]): T[] {
  const r = [...lugares]
  let izquierda = true
  for (let i = 0; i < r.length; i++) {
    if (r[i].ancho === 'entera') {
      izquierda = true
      continue
    }
    if (izquierda && r[i + 1]?.ancho === 'entera') {
      const j = r.findIndex((l, k) => k > i + 1 && l.ancho === 'media')
      if (j > 0) r.splice(i + 1, 0, ...r.splice(j, 1))
    }
    izquierda = !izquierda
  }
  return r
}

/** Las celdas vecinas (sin diagonales) de la misma planta son un manchón. -1 en las libres. */
export function manchones(g: GrillaLugar): number[] {
  const comp = g.celdas.map(() => -1)
  let n = 0
  g.celdas.forEach((id, i) => {
    if (!id || comp[i] >= 0) return
    const pila = [i]
    comp[i] = n
    while (pila.length) {
      const c = pila.pop()!
      for (const v of vecinas(g, c)) {
        if (comp[v] < 0 && g.celdas[v] === id) {
          comp[v] = n
          pila.push(v)
        }
      }
    }
    n++
  })
  return comp
}

function vecinas(g: GrillaLugar, i: number): number[] {
  const col = i % g.cols
  const r: number[] = []
  if (col > 0) r.push(i - 1)
  if (col < g.cols - 1 && i + 1 < g.cap) r.push(i + 1)
  if (i - g.cols >= 0) r.push(i - g.cols)
  if (i + g.cols < g.cap) r.push(i + g.cols)
  return r
}

/** Cuántas celdas de su fila, desde `i`, siguen en el mismo manchón: el ancho del nombre. */
export function corrida(g: GrillaLugar, comp: number[], i: number): number {
  let n = 1
  while ((i % g.cols) + n < g.cols && i + n < g.cap && comp[i + n] === comp[i]) n++
  return n
}

export type EtapaDibujo = 'semilla' | 'brote' | 'creciendo' | 'dando'

/** La etapa que dibuja la plantita. Las terminadas no se dibujan. */
export function etapaDibujo(p: Planta, e: EspecieEnriquecida | undefined, hoy: string): EtapaDibujo | null {
  if (p.etapa === 'terminada') return null
  if (e && germinacionPendiente(germinacion(p, e, hoy))) return 'semilla'
  if (p.etapa === 'almacigo') return 'brote'
  if (p.etapa === 'cosechando') return 'dando'
  return 'creciendo'
}

export const ETAPA_DIBUJO_TEXTO: Record<EtapaDibujo, string> = {
  semilla: 'todavía no asomó',
  brote: 'brote',
  creciendo: 'creciendo',
  dando: 'dando cosecha',
}

export interface Atencion {
  cuantas: number
  atrasada: boolean
  /** la primera, sin el nombre de la planta adelante: «fijate si asomó» */
  que: string
}

/** Lo que pide atención de cada planta, del mismo motor que la banderita de la lista. */
export function atencionPorPlanta(tareas: Tarea[], nombreDe: (id: string) => string | undefined): Map<string, Atencion> {
  const porPlanta = new Map<string, Tarea[]>()
  for (const t of tareas) if (t.plantaId) porPlanta.set(t.plantaId, [...(porPlanta.get(t.plantaId) ?? []), t])
  const r = new Map<string, Atencion>()
  for (const [id, suyas] of porPlanta) {
    // lo atrasado primero y entre iguales manda la prioridad, como en proximaTareaDe
    const [primera] = [...suyas].sort(
      (a, b) => Number(b.atrasada ?? false) - Number(a.atrasada ?? false) || a.prioridad - b.prioridad,
    )
    r.set(id, {
      cuantas: suyas.length,
      atrasada: suyas.some((t) => t.atrasada),
      que: sinNombre(primera.titulo, nombreDe(id)),
    })
  }
  return r
}

function sinNombre(titulo: string, nombre: string | undefined): string {
  if (nombre && titulo.startsWith(nombre)) {
    const resto = titulo.slice(nombre.length).replace(/^:?\s+/, '')
    if (resto) return resto
  }
  return titulo.charAt(0).toLowerCase() + titulo.slice(1)
}

/**
 * Lo que dice el copo, o null si en la semana no hiela. Manda el pronóstico;
 * sin él, la estadística del motor, igual que en Esta semana.
 */
export function copoDeLaSemana(tareas: Tarea[], avisos: AvisoClima[], hoy: string): string | null {
  const hasta = sumarDias(hoy, 6)
  const [helada] = avisos
    .filter((a) => a.tipo === 'helada' && a.fecha >= hoy && a.fecha <= hasta)
    .sort((a, b) => a.fecha.localeCompare(b.fecha))
  if (helada) return `${helada.titulo.charAt(0).toLowerCase()}${helada.titulo.slice(1)}: tapar de noche`
  if (tareas.some((t) => t.tipo === 'helada')) return 'puede helar: tapar de noche'
  return null
}

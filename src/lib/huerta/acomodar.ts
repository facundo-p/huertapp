import { empaquetar, planoSano, type AnchoCroquis, type ClaseCroquis, type GrillaLugar } from './croquis'
import type { Planta, PlanoUbicacion, Ubicacion } from './tipos'

/**
 * «Acomodar» el croquis: se eligen celdas tocándolas y se llevan a una marca
 * «+». Nunca arrastrando: así no pelea con el scroll y anda con teclado y
 * lector. Lógica pura sobre `GrillaLugar.celdas`.
 */

/** Los avisos hablan en la unidad del lugar: «2 macetas», «1 surco». */
const UNIDAD: Record<ClaseCroquis, { una: string; varias: string; femenina: boolean }> = {
  almaciguera: { una: 'celda', varias: 'celdas', femenina: true },
  macetas: { una: 'maceta', varias: 'macetas', femenina: true },
  surcos: { una: 'surco', varias: 'surcos', femenina: false },
  libre: { una: 'celda', varias: 'celdas', femenina: true },
  otro: { una: 'celda', varias: 'celdas', femenina: true },
}

// El artículo va con la unidad y no con la planta: el catálogo no dice el
// género de cada nombre, y «Zapallo / Calabaza» tiene los dos.
const una = (c: ClaseCroquis) => `${UNIDAD[c].femenina ? 'una' : 'un'} ${UNIDAD[c].una}`

const enLista = (xs: string[]) => (xs.length <= 1 ? (xs[0] ?? '') : `${xs.slice(0, -1).join(', ')} y ${xs.at(-1)}`)

export type Destino = { dest: number[] } | { motivo: string }

/**
 * Las elegidas corridas `dc` columnas y `df` filas, con la misma forma. No
 * entran si se salen o pisan una planta que no está elegida: sobre sí mismas
 * sí se corren.
 */
export function trasladar(
  g: GrillaLugar,
  sel: number[],
  dc: number,
  df: number,
  nombreDe: (id: string) => string,
): Destino {
  const dest: number[] = []
  for (const i of sel) {
    const c = (i % g.cols) + dc
    const f = Math.floor(i / g.cols) + df
    const d = f * g.cols + c
    if (c < 0 || c >= g.cols || f < 0 || d >= g.cap) return { motivo: 'se sale del lugar' }
    const id = g.celdas[d]
    if (id && !sel.includes(d)) return { motivo: `pisa ${una(g.clase)} de ${nombreDe(id)}` }
    dest.push(d)
  }
  return { dest }
}

/** Adónde van las elegidas si la primera (la «1») va a `t`. */
export function destinoDe(g: GrillaLugar, sel: number[], t: number, nombreDe: (id: string) => string): Destino {
  const [a] = sel
  return trasladar(g, sel, (t % g.cols) - (a % g.cols), Math.floor(t / g.cols) - Math.floor(a / g.cols), nombreDe)
}

/**
 * Las libres donde entra lo elegido: ahí va la marca «+». La primera cae
 * siempre en una libre, así que un bloque se corre sobre sí mismo hacia atrás
 * pero no hacia adelante: para eso se mueve de a una celda.
 */
export function dondeEntra(g: GrillaLugar, sel: number[], nombreDe: (id: string) => string): Set<number> {
  const r = new Set<number>()
  if (!sel.length) return r
  g.celdas.forEach((id, t) => {
    if (!id && 'dest' in destinoDe(g, sel, t, nombreDe)) r.add(t)
  })
  return r
}

/** Las celdas con las elegidas ya en `dest`, en el mismo orden. */
export function llevar(celdas: (string | null)[], sel: number[], dest: number[]): (string | null)[] {
  const r = [...celdas]
  const ids = sel.map((i) => celdas[i])
  for (const i of sel) r[i] = null
  dest.forEach((d, k) => (r[d] = ids[k]))
  return r
}

/** «1 celda de rúcula, de 4», «Las 4 celdas de rúcula», «2 macetas: tomate y albahaca». */
export function describir(g: GrillaLugar, sel: number[], nombreDe: (id: string) => string): string {
  const u = UNIDAD[g.clase]
  const ids = [...new Set(sel.map((i) => g.celdas[i]!))]
  if (ids.length > 1) return `${sel.length} ${u.varias}: ${enLista([...new Set(ids.map(nombreDe))])}`
  const nombre = nombreDe(ids[0])
  const total = g.celdas.filter((id) => id === ids[0]).length
  const n = sel.length
  const [unica, todas] = u.femenina ? ['La única', 'Las'] : ['El único', 'Los']
  if (n === total) return total === 1 ? `${unica} ${u.una} de ${nombre}` : `${todas} ${n} ${u.varias} de ${nombre}`
  return n === 1 ? `1 ${u.una} de ${nombre}, de ${total}` : `${n} de ${todas.toLowerCase()} ${total} ${u.varias} de ${nombre}`
}

/** «Esa celda está libre.», «Ese surco está libre.» */
export const textoLibre = (c: ClaseCroquis) => `${UNIDAD[c].femenina ? 'Esa' : 'Ese'} ${UNIDAD[c].una} está libre.`

/** «fila 1, columna 5»; en surcos, «surco 2». */
export function dondeEsta(g: GrillaLugar, i: number): string {
  const fila = Math.floor(i / g.cols) + 1
  return g.clase === 'surcos' ? `surco ${fila}` : `fila ${fila}, columna ${(i % g.cols) + 1}`
}

/** Qué se puede hacer con lo elegido. Nunca promete una marca que no hay. */
export function comoSeguir(g: GrillaLugar, sel: number[], hayMarcas: boolean): string {
  if (hayMarcas) {
    if (sel.length === 1) return 'Tocá una marca + para llevarla ahí.'
    const siguen = sel.length === 2 ? 'la otra la sigue' : 'las demás la siguen'
    return `Tocá una marca +: ahí va la «1», y ${siguen} con la misma forma.`
  }
  if (sel.length > 1) return 'No hay lugar libre con esa forma: soltá alguna.'
  const u = UNIDAD[g.clase]
  return `No hay ${u.femenina ? 'otra' : 'otro'} ${u.una} libre en este lugar.`
}

/**
 * Lo que se guarda de un lugar acomodado: las celdas de cada planta y con qué
 * grilla se acomodó. Van todas las plantas, no sólo las que se movieron: una
 * sin celdas se completaría con las primeras libres y el resto saltaría.
 */
export function acomodado(
  u: Ubicacion,
  plantas: Planta[],
  g: GrillaLugar,
  celdas: (string | null)[],
): { ubicacion: Ubicacion; plantas: Planta[] } {
  const plano: PlanoUbicacion = { ...planoSano(u.plano), grilla: g.clase }
  if (g.clase === 'almaciguera' || g.clase === 'macetas') plano.cols = g.cols as 3 | 6
  else delete plano.cols
  return {
    ubicacion: { ...u, plano },
    plantas: plantas
      .filter((p) => celdas.includes(p.id))
      .map((p) => ({
        ...p,
        celdas: {
          ubicacionId: u.id,
          en: celdas.flatMap((id, i) => (id === p.id ? [{ col: i % g.cols, fila: Math.floor(i / g.cols) }] : [])),
        },
      })),
  }
}

export interface LugarEnHoja {
  ubicacion?: Ubicacion
  ancho: AnchoCroquis
}

/**
 * El lugar `id` pasa al puesto de `a`, y los que había entre los dos, `a`
 * incluido, se corren uno hacia donde estaba `id`.
 * Devuelve el orden nuevo sin «Sin lugar asignado», que no se ordena y va al
 * final, y el puesto en que quedó a la vista. null si la hoja queda igual:
 * los chicos van de a dos, y empaquetar puede volver a juntarlos como estaban.
 */
export function llevarLugar<T extends LugarEnHoja>(
  vista: T[],
  id: string,
  a: string,
): { orden: Ubicacion[]; puesto: number } | null {
  const reales = vista.filter((l) => l.ubicacion)
  const sin = vista.filter((l) => !l.ubicacion)
  const movido = reales.find((l) => l.ubicacion!.id === id)
  const destino = reales.find((l) => l.ubicacion!.id === a)
  if (!movido || !destino || movido === destino) return null
  const resto = reales.filter((l) => l !== movido)
  const j = reales.indexOf(destino)
  const orden = [...resto.slice(0, j), movido, ...resto.slice(j)]
  const hoja = empaquetar([...orden, ...sin])
  if (hoja.every((l, k) => l === vista[k])) return null
  return { orden: orden.map((l) => l.ubicacion!), puesto: hoja.indexOf(movido) }
}

/** La hoja con los lugares en el orden de `ids`, mientras se guarda: lo mismo que va a dibujar el store. */
export function enOrden<T extends LugarEnHoja>(vista: T[], ids: string[]): T[] {
  const puesto = (l: T) => {
    const k = ids.indexOf(l.ubicacion!.id)
    return k < 0 ? Infinity : k
  }
  const reales = vista.filter((l) => l.ubicacion)
  const ordenados = reales
    .map((l, i) => ({ l, i, k: puesto(l) }))
    .sort((a, b) => (a.k === b.k ? a.i - b.i : a.k - b.k))
    .map(({ l }) => l)
  return empaquetar([...ordenados, ...vista.filter((l) => !l.ubicacion)])
}

/**
 * El acomodo sobre lo guardado: de lo dibujado van sólo la grilla y las celdas.
 * Con dos toques seguidos, un orden o un trasplante que todavía no llegó a la
 * pantalla se pisaba.
 */
export function acomodoSobre(
  guardado: { ubicaciones: Ubicacion[]; plantas: Planta[] },
  hecho: { ubicacion: Ubicacion; plantas: Planta[] },
): { ubicaciones: Ubicacion[]; plantas: Planta[] } {
  const u = guardado.ubicaciones.find((x) => x.id === hecho.ubicacion.id)
  if (!u) return { ubicaciones: [], plantas: [] }
  const celdas = new Map(hecho.plantas.map((p) => [p.id, p.celdas]))
  return {
    ubicaciones: [{ ...u, plano: planoSano({ ...hecho.ubicacion.plano, orden: planoSano(u.plano)?.orden }) }],
    plantas: guardado.plantas
      .filter((p) => celdas.has(p.id) && p.ubicacionId === u.id)
      .map((p) => ({ ...p, celdas: celdas.get(p.id) })),
  }
}

/** El orden nuevo sobre lo guardado: sólo cambia `plano.orden`. */
export function ordenSobre(guardadas: Ubicacion[], orden: Ubicacion[]): Ubicacion[] {
  const porId = new Map(guardadas.map((u) => [u.id, u]))
  return conOrden(orden.flatMap((u) => porId.get(u.id) ?? []))
}

/** Cada lugar con su puesto en `plano.orden`: el orden queda escrito para todos. */
export const conOrden = (orden: Ubicacion[]): Ubicacion[] =>
  orden.map((u, i) => ({ ...u, plano: { ...planoSano(u.plano), orden: i } }))

import { empaquetar, planoSano, type AnchoCroquis, type ClaseCroquis, type GrillaLugar } from './croquis'
import type { Planta, PlanoUbicacion, Ubicacion } from './tipos'

/**
 * «Acomodar» el croquis: se eligen celdas tocándolas y se llevan a una marca
 * «+» o se corren con las flechas. Nunca arrastrando: así no pelea con el
 * scroll y anda con teclado y lector. Lógica pura sobre `GrillaLugar.celdas`.
 */

/** La barra habla en la unidad del lugar: «2 macetas», «1 surco». */
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
const la = (c: ClaseCroquis) => `${UNIDAD[c].femenina ? 'la' : 'el'} ${UNIDAD[c].una}`

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
 * pero no hacia adelante; para eso están las flechas.
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

export function intercambiar(celdas: (string | null)[], a: number, b: number): (string | null)[] {
  const r = [...celdas]
  ;[r[a], r[b]] = [r[b], r[a]]
  return r
}

/** Sólo con dos celdas de plantas distintas: sirve sobre todo cuando no queda lugar libre. */
export const intercambiables = (g: GrillaLugar, sel: number[]) =>
  sel.length === 2 && g.celdas[sel[0]] !== g.celdas[sel[1]]

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

/** El botón que elige una planta entera: «Todas las celdas de rúcula». */
export const textoToda = (c: ClaseCroquis, nombre: string) =>
  `${UNIDAD[c].femenina ? 'Todas las' : 'Todos los'} ${UNIDAD[c].varias} de ${nombre}`

export const textoIntercambio = (c: ClaseCroquis, a: string, b: string) =>
  `Listo: cambiaste de lugar ${la(c)} de ${a} y ${UNIDAD[c].femenina ? 'la' : 'el'} de ${b}.`

/** «Esa celda está libre.», «Ese surco está libre.» */
export const textoLibre = (c: ClaseCroquis) => `${UNIDAD[c].femenina ? 'Esa' : 'Ese'} ${UNIDAD[c].una} está libre.`

/** «fila 1, columna 5»; en surcos, «surco 2». */
export function dondeEsta(g: GrillaLugar, i: number): string {
  const fila = Math.floor(i / g.cols) + 1
  return g.clase === 'surcos' ? `surco ${fila}` : `fila ${fila}, columna ${(i % g.cols) + 1}`
}

/** Después de una flecha: dónde quedó la «1», que es la que se sigue con la vista. */
export function textoQuedo(g: GrillaLugar, i: number, varias: boolean): string {
  const donde = `${g.clase === 'surcos' ? 'en el' : 'en'} ${dondeEsta(g, i)}`
  return varias ? `La «1» quedó ${donde}.` : `Quedó ${donde}.`
}

export const FLECHAS = [
  { hacia: 'arriba', dc: 0, df: -1, texto: 'arriba' },
  { hacia: 'abajo', dc: 0, df: 1, texto: 'abajo' },
  { hacia: 'izquierda', dc: -1, df: 0, texto: 'a la izquierda' },
  { hacia: 'derecha', dc: 1, df: 0, texto: 'a la derecha' },
] as const

/** Qué se puede hacer con lo elegido. Nunca promete una marca que no hay. */
export function comoSeguir(g: GrillaLugar, sel: number[], hayMarcas: boolean, hayFlecha: boolean): string {
  if (hayMarcas) {
    if (sel.length === 1) return 'Tocá una marca + para llevarla ahí.'
    const siguen = sel.length === 2 ? 'la otra la sigue' : 'las demás la siguen'
    return `Tocá una marca +: ahí va la «1», y ${siguen} con la misma forma.`
  }
  if (hayFlecha) return 'No hay otro lugar libre con esa forma: usá las flechas.'
  if (intercambiables(g, sel)) return 'No hay lugar libre con esa forma: soltá alguna, o intercambiá.'
  if (sel.length > 1) return 'No hay lugar libre con esa forma: soltá alguna.'
  return 'No hay lugar libre: tocá también una celda de otra planta para intercambiarlas.'
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
 * Un lugar un puesto antes o después en la hoja. Como los chicos van de a dos,
 * empaquetar puede dejarlo donde estaba: se prueba desde el vecino hacia
 * afuera y vale el primero que de verdad lo corre. Devuelve el orden nuevo de
 * los lugares, sin «Sin lugar asignado», que no se ordena y va al final, y el
 * puesto en que quedó a la vista. null si no se puede.
 */
export function moverLugar<T extends LugarEnHoja>(
  vista: T[],
  id: string,
  paso: -1 | 1,
): { orden: Ubicacion[]; puesto: number } | null {
  const reales = vista.filter((l) => l.ubicacion)
  const sin = vista.filter((l) => !l.ubicacion)
  const movido = reales.find((l) => l.ubicacion!.id === id)
  if (!movido) return null
  const antes = vista.indexOf(movido)
  const resto = reales.filter((l) => l !== movido)
  for (let j = reales.indexOf(movido) + paso; j >= 0 && j <= resto.length; j += paso) {
    const orden = [...resto.slice(0, j), movido, ...resto.slice(j)]
    const puesto = empaquetar([...orden, ...sin]).indexOf(movido)
    if (paso < 0 ? puesto < antes : puesto > antes) return { orden: orden.map((l) => l.ubicacion!), puesto }
  }
  return null
}

/** Por qué `moverLugar` dio null: lo dice el botón que no se puede usar. */
export function porQueNoSeMueve(vista: LugarEnHoja[], id: string, paso: -1 | 1): string {
  const reales = vista.filter((l) => l.ubicacion)
  const k = reales.findIndex((l) => l.ubicacion!.id === id)
  if (paso < 0 && k === 0) return 'ya es el primero'
  if (paso > 0 && k === reales.length - 1) return 'ya es el último'
  return 'los lugares chicos van de a dos'
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

/** Cada lugar con su puesto en `plano.orden`: el orden queda escrito para todos. */
export const conOrden = (orden: Ubicacion[]): Ubicacion[] =>
  orden.map((u, i) => ({ ...u, plano: { ...planoSano(u.plano), orden: i } }))

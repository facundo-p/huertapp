import type { EspecieEnriquecida } from '../data/types'
import { corrimiento, estimar } from './estimar'
import { esperaGerminacion, germinacion, germinacionPendiente, type Germinacion } from './germinacion'
import type { Planta, TipoEntrada } from './tipos'

/**
 * Los casilleros del ciclo en la página de una planta: los hitos, no las
 * etapas. «Creciendo» no es algo que pase un día, así que no tiene casillero.
 */

export type ClaveCasillero = 'siembra' | 'asoma' | 'trasplante' | 'cosecha' | 'fin'

export interface Casillero {
  clave: ClaveCasillero
  nombre: string
  /** ISO corta. Un hito cumplido sin fecha anotada va sin fecha: no se inventa */
  fecha?: string
  nota?: string
  hecho: boolean
  /** el primero que falta: ahí va el «hoy» */
  hoy: boolean
}

const dias = (n: number) => `${n} ${n === 1 ? 'día' : 'días'}`

export function casillerosDelCiclo(
  p: Planta,
  e: EspecieEnriquecida | undefined,
  hoy: string,
): Casillero[] {
  const est = e ? estimar(p, e, hoy) : null
  const germ = e ? germinacion(p, e, hoy) : null
  const plantada = p.metodo === 'plantacion'
  // sin método anotado, la etapa dice igual que hubo trasplante
  const pasaPorAlmacigo =
    p.metodo === 'almacigo' || p.metodo === 'almacigo_protegido' || p.etapa === 'trasplantada'
  const trasplantada = pasaPorAlmacigo && p.etapa !== 'almacigo'
  const cosechando = p.etapa === 'cosechando' || p.etapa === 'terminada'
  // mientras no asoma, lo que sigue se calla: la estimación se corre con ella
  const aVenir = germinacionPendiente(germ) ? () => ({}) : porVenir

  const lista: Omit<Casillero, 'hoy'>[] = [
    { clave: 'siembra', nombre: plantada ? 'Plantada' : 'Sembrada', fecha: p.sembrada, hecho: p.sembrada <= hoy },
  ]

  if (!plantada) {
    // trasplantada sin haber marcado que asomó: asomó igual. En «creciendo»
    // esperaGerminacion no lo sabe.
    const asomo = !esperaGerminacion(p) || trasplantada
    const corrido = e ? corrimiento(p, e) : 0
    lista.push(
      asomo
        ? {
            clave: 'asoma',
            nombre: 'Asomó',
            fecha: p.germino,
            nota: corrido > 0 ? `${dias(corrido)} tarde` : corrido < 0 ? `${dias(-corrido)} antes` : undefined,
            hecho: true,
          }
        : { clave: 'asoma', nombre: 'Asoma', ...asomaria(germ), hecho: false },
    )
  }

  if (pasaPorAlmacigo) {
    lista.push(
      trasplantada
        ? {
            clave: 'trasplante',
            nombre: 'Trasplante',
            fecha: p.etapa === 'trasplantada' ? p.etapaDesde : undefined,
            hecho: true,
          }
        : { clave: 'trasplante', nombre: 'Trasplante', ...aVenir(est?.trasplante?.desde), hecho: false },
    )
  }

  lista.push(
    cosechando
      ? { clave: 'cosecha', nombre: 'Cosecha', fecha: p.etapa === 'cosechando' ? p.etapaDesde : undefined, hecho: true }
      : { clave: 'cosecha', nombre: 'Cosecha', ...aVenir(est?.cosecha?.desde), hecho: false },
    {
      clave: 'fin',
      nombre: 'Terminada',
      fecha: p.etapa === 'terminada' ? p.etapaDesde : undefined,
      hecho: p.etapa === 'terminada',
    },
  )

  const primero = lista.findIndex((c) => !c.hecho)
  return lista.map((c, i) => ({ ...c, hoy: i === primero }))
}

/** Lo estimado es un «desde»: la ficha da un rango y el casillero muestra dónde empieza. */
function porVenir(desde?: string): { fecha?: string; nota?: string } {
  return desde ? { fecha: desde, nota: 'en adelante' } : {}
}

/** Pasado el plazo, la fecha ya no es algo por venir: lo explica la página, abajo. */
function asomaria(g: Germinacion | null): { fecha?: string; nota?: string } {
  return g?.estado === 'demorada' ? { nota: 'se demora' } : porVenir(g?.desde)
}

/** Un hito cumplido lleva sello; lo de todos los días, no. */
const HITOS: ReadonlySet<TipoEntrada> = new Set<TipoEntrada>(['trasplante', 'floracion', 'cosecha'])

export const llevaSello = (t: TipoEntrada): boolean => HITOS.has(t)

/** «5/9»: la fecha al margen del cuaderno. */
export function fechaDeMargen(iso: string): string {
  const [, m, d] = iso.split('-').map(Number)
  return `${d}/${m}`
}

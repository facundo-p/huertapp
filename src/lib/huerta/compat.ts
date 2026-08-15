import type { EspecieEnriquecida } from '../data/types'

/**
 * Avisos de compatibilidad entre lo que hay en una ubicación y lo que se
 * quiere agregar.
 *
 * La relación se mira en las DOS direcciones: que el tomate no liste a la papa
 * no significa que la papa no liste al tomate, y las fichas no siempre son
 * simétricas. Si cualquiera de las dos lo dice, se avisa.
 *
 * Es un aviso, nunca un bloqueo: la huerta es del usuario y las asociaciones
 * son el campo con más folclore y menos evidencia dura de toda la base.
 */

export interface Aviso {
  slug: string
  nombre: string
  /** aclaración de la ficha, cuando la hay ("solo si se dejan semillar") */
  nota?: string
  /** true si el dato salió de la ficha de la vecina y no de la candidata */
  reciproco: boolean
}

export interface Compatibilidad {
  malas: Aviso[]
  buenas: Aviso[]
}

function buscar(
  desde: EspecieEnriquecida,
  hacia: EspecieEnriquecida,
  lista: 'buenas' | 'malas',
): { nota?: string } | null {
  const ref = desde.asociaciones[lista].find((a) => a.slug === hacia.slug)
  return ref ? { nota: ref.nota } : null
}

/**
 * @param candidata la especie que se quiere sumar
 * @param vecinas las especies que ya están en esa ubicación (sin repetir)
 */
export function compatibilidad(
  candidata: EspecieEnriquecida,
  vecinas: EspecieEnriquecida[],
): Compatibilidad {
  const malas: Aviso[] = []
  const buenas: Aviso[] = []

  for (const v of vecinas) {
    if (v.slug === candidata.slug) continue

    const malaIda = buscar(candidata, v, 'malas')
    const malaVuelta = buscar(v, candidata, 'malas')
    if (malaIda || malaVuelta) {
      malas.push({
        slug: v.slug,
        nombre: v.nombre_comun,
        nota: malaIda?.nota ?? malaVuelta?.nota,
        reciproco: !malaIda,
      })
      continue // si se llevan mal, no tiene sentido celebrar que también se llevan bien
    }

    const buenaIda = buscar(candidata, v, 'buenas')
    const buenaVuelta = buscar(v, candidata, 'buenas')
    if (buenaIda || buenaVuelta) {
      buenas.push({
        slug: v.slug,
        nombre: v.nombre_comun,
        nota: buenaIda?.nota ?? buenaVuelta?.nota,
        reciproco: !buenaIda,
      })
    }
  }

  return { malas, buenas }
}

/** Frase corta para el aviso, en rioplatense y sin dramatizar. */
export function textoAviso(c: Compatibilidad): string | null {
  if (c.malas.length) {
    const nombres = c.malas.map((a) => a.nombre)
    const lista = nombres.length === 1 ? nombres[0] : `${nombres.slice(0, -1).join(', ')} y ${nombres.at(-1)}`
    return `Ojo: no se lleva bien con ${lista}.`
  }
  if (c.buenas.length) {
    const nombres = c.buenas.map((a) => a.nombre)
    const lista = nombres.length === 1 ? nombres[0] : `${nombres.slice(0, -1).join(', ')} y ${nombres.at(-1)}`
    return `Buena compañía: se lleva bien con ${lista}.`
  }
  return null
}

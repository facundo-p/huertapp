import type { Tarea } from './engine'

export interface GrupoTareas {
  /** estable entre renders: tipo, especie y el pie textual */
  clave: string
  tareas: Tarea[]
  detalle: string
  fuente: string
  /** el detalle ya está en la fila: el pie no lo repite */
  instruccion?: true
}

/**
 * Junta las tareas cuyo detalle y fuente dicen exactamente lo mismo, para
 * mostrar el pie una vez y no una por planta. Por texto y no por especie: si a
 * una le corrió la germinación, su fuente cambia y no habla por las otras.
 * Los de un grupo suben al lugar del primero; la prioridad no se altera.
 */
export function agruparPorPie(tareas: Tarea[]): GrupoTareas[] {
  const grupos = new Map<string, GrupoTareas>()
  for (const t of tareas) {
    // sin slug (helada, compost) nunca agrupa: el id la deja sola
    const clave = [t.tipo, t.slug ?? t.id, t.detalle, t.fuente].join('|')
    const ya = grupos.get(clave)
    if (ya) ya.tareas.push(t)
    else
      grupos.set(clave, {
        clave,
        tareas: [t],
        detalle: t.detalle,
        fuente: t.fuente,
        ...(t.instruccion && { instruccion: t.instruccion }),
      })
  }
  return [...grupos.values()]
}

/** Los títulos distintos del grupo, en orden: de qué tareas habla su pie. */
export const titulosDe = (g: GrupoTareas): string[] => [...new Set(g.tareas.map((t) => t.titulo))]

/** Dónde está y cuándo se sembró cada planta, por id. */
export interface DondeCrece {
  /** nombre de la ubicación; sin ella, «sin lugar» */
  lugar?: string
  /** ISO corta */
  sembrada: string
}

export interface Distincion {
  /** id de tarea → «Bancal del fondo» o «Bancal del fondo, sembrada el 3/9» */
  porTarea: Map<string, string>
  /** clave de grupo → lo mismo, de todas sus tareas */
  porGrupo: Map<string, string>
}

export const SIN_LUGAR = 'sin lugar'

const diaMes = (iso: string) => {
  const [, m, d] = iso.split('-').map(Number)
  return `${d}/${m}`
}

/**
 * Dos zanahorias sin apodo dan dos grupos con el mismo encabezado, y no hay
 * cómo saber qué pie es de qué fila. Sólo en ese choque se dice dónde está
 * cada una, y si comparten lugar, cuándo se sembró. Sin choque, nada.
 */
export function distinguir(grupos: GrupoTareas[], plantas: Map<string, DondeCrece>): Distincion {
  const porTarea = new Map<string, string>()
  const porGrupo = new Map<string, string>()

  // mismo conjunto de títulos, en el orden que sea
  const porEncabezado = new Map<string, GrupoTareas[]>()
  for (const g of grupos) {
    const k = titulosDe(g).sort().join('\n')
    porEncabezado.set(k, [...(porEncabezado.get(k) ?? []), g])
  }

  // helada y compost no tienen planta: no hay lugar que decir
  const conPlanta = (g: GrupoTareas) => g.tareas.filter((t) => t.plantaId)
  const lugar = (t: Tarea) => plantas.get(t.plantaId!)?.lugar ?? SIN_LUGAR

  for (const choque of porEncabezado.values()) {
    if (choque.length < 2) continue
    for (const g of choque) {
      const deLosOtros = choque.filter((o) => o !== g).flatMap((o) => conPlanta(o).map(lugar))
      const suyas = conPlanta(g)
      for (const t of suyas) {
        const l = lugar(t)
        const sembrada = plantas.get(t.plantaId!)?.sembrada
        porTarea.set(t.id, sembrada && deLosOtros.includes(l) ? `${l}, sembrada el ${diaMes(sembrada)}` : l)
      }
      if (suyas.length) porGrupo.set(g.clave, [...new Set(suyas.map((t) => porTarea.get(t.id)!))].join(' · '))
    }
  }
  return { porTarea, porGrupo }
}

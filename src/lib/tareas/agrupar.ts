import type { Tarea } from './engine'

export interface GrupoTareas {
  /** estable entre renders: tipo, especie y el pie textual */
  clave: string
  tareas: Tarea[]
  detalle: string
  fuente: string
}

/**
 * Junta las tareas cuyo pie —detalle y fuente— dice **exactamente** lo mismo,
 * para mostrarlo una vez y no una por planta. Cinco lechugas sembradas el mismo
 * día daban cinco veces el mismo renglón.
 *
 * Se agrupa por texto idéntico y no por especie a propósito: la fuente lleva
 * pegado el corrimiento de germinación, que es de la planta. Si a una le corrió,
 * su pie cambia y forma su propio grupo en vez de hablar por las otras.
 *
 * **Reordena dentro del día:** los miembros de un grupo suben al lugar del
 * primero. El motor ya ordena por prioridad y después alfabéticamente por
 * título, y el título es lo único en que difieren dos tareas del mismo grupo
 * —son la misma especie y el mismo tipo—, así que lo que se pierde es el orden
 * alfabético entre plantas hermanas y lo que se gana es que las filas que
 * comparten pie queden juntas. La prioridad no se altera: la del grupo es la
 * del primero que apareció.
 */
export function agruparPorPie(tareas: Tarea[]): GrupoTareas[] {
  const grupos = new Map<string, GrupoTareas>()
  for (const t of tareas) {
    // sin slug (helada, compost) nunca agrupa: el id la deja sola
    const clave = [t.tipo, t.slug ?? t.id, t.detalle, t.fuente].join('|')
    const ya = grupos.get(clave)
    if (ya) ya.tareas.push(t)
    else grupos.set(clave, { clave, tareas: [t], detalle: t.detalle, fuente: t.fuente })
  }
  return [...grupos.values()]
}

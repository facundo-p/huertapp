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

/** El botón del pie. Si todo el día es instrucción, adentro sólo queda la fuente. */
export function etiquetaPie(grupos: GrupoTareas[]): string {
  const sale = grupos.flatMap((g) => g.tareas).length > 1 ? 'de dónde salen' : 'de dónde sale'
  return grupos.every((g) => g.instruccion) ? sale : `por qué y ${sale}`
}

/** Los títulos distintos del grupo, en orden: de qué tareas habla su pie. */
export const titulosDe = (g: GrupoTareas): string[] => [...new Set(g.tareas.map((t) => t.titulo))]

/** Lo que se sabe de cada planta, por id, para separar dos tareas que se llaman igual. */
export interface DondeCrece {
  /** nombre de la ubicación; sin ella, «sin lugar asignado» */
  lugar?: string
  /** ISO corta */
  sembrada: string
  /** nombre común: separa el mismo apodo en dos especies */
  especie?: string
  /** ISO corta, si ya asomó */
  germino?: string
}

export interface Distincion {
  /** id de tarea → «Bancal del fondo» o «Bancal del fondo, sembrada el 3/9» */
  porTarea: Map<string, string>
  /** clave de grupo → lo mismo, de sus tareas repetidas */
  porGrupo: Map<string, string>
}

export const SIN_LUGAR = 'sin lugar asignado'

const diaMes = (iso: string) => {
  const [, m, d] = iso.split('-').map(Number)
  return `${d}/${m}`
}

/**
 * Dos tareas del día con el mismo título (dos zanahorias sin apodo) no se
 * distinguen en la fila ni en el pie. Sólo ahí se dice el lugar y, mientras
 * sigan empatadas, lo que las separe: la siembra, la especie, cuándo asomó. Lo
 * que queda empatado después de eso es indistinguible de verdad.
 */
export function distinguir(grupos: GrupoTareas[], plantas: Map<string, DondeCrece>): Distincion {
  const dato = (t: Tarea) => plantas.get(t.plantaId!)
  const lugar = (t: Tarea) => dato(t)?.lugar ?? SIN_LUGAR
  const desempates: { clave: (t: Tarea) => string | undefined; texto: (t: Tarea) => string | undefined }[] = [
    { clave: (t) => dato(t)?.sembrada, texto: (t) => dato(t) && `sembrada el ${diaMes(dato(t)!.sembrada)}` },
    { clave: (t) => t.slug, texto: (t) => dato(t)?.especie?.toLocaleLowerCase('es') },
    { clave: (t) => dato(t)?.germino, texto: (t) => dato(t)?.germino && `asomó el ${diaMes(dato(t)!.germino!)}` },
  ]

  // por título y no por grupo: dos iguales pueden compartir pie, o pisarse sólo en parte.
  // Helada y compost no tienen planta: no hay lugar que decir.
  const porTitulo = new Map<string, Tarea[]>()
  for (const t of grupos.flatMap((g) => g.tareas)) {
    if (t.plantaId) porTitulo.set(t.titulo, [...(porTitulo.get(t.titulo) ?? []), t])
  }

  const porTarea = new Map<string, string>()
  for (const mismas of porTitulo.values()) {
    if (mismas.length < 2) continue
    for (const t of mismas) {
      const partes = [lugar(t)]
      let empatadas = mismas.filter((o) => o !== t && lugar(o) === lugar(t))
      for (const { clave, texto } of desempates) {
        if (!empatadas.some((o) => clave(o) !== clave(t))) continue
        const x = texto(t)
        if (x) partes.push(x)
        empatadas = empatadas.filter((o) => clave(o) === clave(t))
      }
      porTarea.set(t.id, partes.join(', '))
    }
  }

  const porGrupo = new Map<string, string>()
  for (const g of grupos) {
    const suyas = g.tareas.filter((t) => porTarea.has(t.id))
    if (suyas.length) porGrupo.set(g.clave, [...new Set(suyas.map((t) => porTarea.get(t.id)!))].join(' · '))
  }
  return { porTarea, porGrupo }
}

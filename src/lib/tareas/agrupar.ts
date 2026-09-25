import type { Tarea } from './engine'
import { diaYMes, fechaDiaLarga } from '../fechas'

export interface GrupoTareas {
  /** estable entre renders y única en la semana: día, tipo, especie y el pie textual */
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
    // sin slug (helada, compost) nunca agrupa: el id la deja sola. Con el día,
    // dos pies iguales de días distintos no se pisan en `porGrupo`.
    const clave = [t.fecha, t.tipo, t.slug ?? t.id, t.detalle, t.fuente].join('|')
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

const titulosDe = (g: GrupoTareas): string[] => [...new Set(g.tareas.map((t) => t.titulo))]

/** Lo que se sabe de cada planta, por id, para separar dos tareas que se llaman igual. */
export interface DondeCrece {
  /** nombre de la ubicación; sin ella, «sin lugar asignado» */
  lugar?: string
  /** ISO corta */
  sembrada: string
  /** «intercalada entre las lechugas»: dónde, dentro del lugar */
  comoEsta?: string
  /** nombre común: separa el mismo apodo en dos especies */
  especie?: string
  /** la que anotaste, «morada» */
  variedad?: string
  /** ISO corta, si ya asomó */
  germino?: string
}

/** Un renglón del encabezado del pie: el título y, si se repite en la semana, dónde. */
export interface Encabezado {
  titulo: string
  lugares?: string
}

export interface Distincion {
  /**
   * id de tarea → «Bancal del fondo» o «Bancal del fondo, sembrada el 3 sept».
   * Sin planta, el día: «hoy», «viernes, 21 de agosto».
   */
  porTarea: Map<string, string>
  /**
   * clave de grupo → un renglón por título, con sus lugares. Por título y no
   * por grupo: si no, en un pie de dos títulos el lugar de uno se leía del otro.
   */
  porGrupo: Map<string, Encabezado[]>
}

const SIN_LUGAR = 'sin lugar asignado'

/** Con el año sólo si otra de las fechas es de otro. */
const fechaParaDistinguir = (iso: string, otras: (string | undefined)[]) =>
  diaYMes(iso, otras.some((o) => o && o.slice(0, 4) !== iso.slice(0, 4)))

/**
 * Dos tareas de la semana con el mismo título se separan por su planta y no
 * por el día: que una sea del jueves no dice cuál de las dos zanahorias es. Va
 * el lugar y, mientras siga empatada con otra, se suma en este orden: cómo está
 * puesta, la siembra, la especie, la variedad y cuándo asomó. Si empatan en
 * todo eso, dicen lo mismo. Sin planta (helada, compost), las separa sólo el día.
 */
export function distinguir(grupos: GrupoTareas[], plantas: Map<string, DondeCrece>, hoy: string): Distincion {
  const semana = grupos.flatMap((g) => g.tareas)
  const dato = (t: Tarea) => plantas.get(t.plantaId!)
  const lugar = (t: Tarea) => dato(t)?.lugar ?? SIN_LUGAR
  const desempates: {
    clave: (t: Tarea) => string | undefined
    texto: (t: Tarea, empatadas: Tarea[]) => string | undefined
  }[] = [
    { clave: (t) => dato(t)?.comoEsta, texto: (t) => dato(t)?.comoEsta },
    {
      clave: (t) => dato(t)?.sembrada,
      texto: (t, es) => {
        const s = dato(t)?.sembrada
        return s && `sembrada el ${fechaParaDistinguir(s, es.map((o) => dato(o)?.sembrada))}`
      },
    },
    { clave: (t) => t.slug, texto: (t) => dato(t)?.especie?.toLocaleLowerCase('es') },
    // se compara sin mayúsculas y se muestra tal cual: puede ser un nombre propio, «Genovesa»
    { clave: (t) => dato(t)?.variedad?.toLocaleLowerCase('es'), texto: (t) => dato(t)?.variedad },
    {
      clave: (t) => dato(t)?.germino,
      texto: (t, es) => {
        const g = dato(t)?.germino
        // que no lo marcó también es un dato suyo, y separa igual
        return g ? `asomó el ${fechaParaDistinguir(g, es.map((o) => dato(o)?.germino))}` : 'sin marcar cuándo asomó'
      },
    },
  ]

  // por título y no por grupo: dos iguales pueden compartir pie, o pisarse sólo en parte
  const porTitulo = new Map<string, Tarea[]>()
  for (const t of semana) {
    const ya = porTitulo.get(t.titulo)
    if (ya) ya.push(t)
    else porTitulo.set(t.titulo, [t])
  }

  const porTarea = new Map<string, string>()
  for (const mismas of porTitulo.values()) {
    if (mismas.length < 2) continue
    for (const t of mismas) {
      if (!t.plantaId) {
        // como el sr-solo del botón del pie
        porTarea.set(t.id, t.fecha === hoy ? 'hoy' : fechaDiaLarga(t.fecha))
        continue
      }
      const partes = [lugar(t)]
      let empatadas = mismas.filter((o) => o !== t && lugar(o) === lugar(t))
      for (const { clave, texto } of desempates) {
        if (!empatadas.some((o) => clave(o) !== clave(t))) continue
        const x = texto(t, empatadas)
        if (x) partes.push(x)
        empatadas = empatadas.filter((o) => clave(o) === clave(t))
      }
      porTarea.set(t.id, partes.join(', '))
    }
  }

  const porGrupo = new Map<string, Encabezado[]>()
  for (const g of grupos) {
    porGrupo.set(
      g.clave,
      titulosDe(g).map((titulo) => {
        // el pie ya está en la fila de su día: decirlo ahí no separa nada
        const deCuales = g.tareas.filter((t) => t.titulo === titulo && t.plantaId && porTarea.has(t.id))
        const lugares = [...new Set(deCuales.map((t) => porTarea.get(t.id)!))]
        return lugares.length ? { titulo, lugares: lugares.join(' · ') } : { titulo }
      }),
    )
  }
  return { porTarea, porGrupo }
}

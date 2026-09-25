import type { Tarea } from './engine'
import { diaYMes, fechaDiaLarga } from '../fechas'
import type { Planta, Ubicacion } from '../huerta/tipos'
import { esperaGerminacion } from '../huerta/germinacion'

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
 * mostrar el pie una vez y no una por planta. Por texto y no sólo por especie:
 * si a una le corrió la germinación, su fuente cambia y no habla por las otras.
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

// lo que escribiste a mano se compara así y se muestra tal cual: el lector lee igual «Maceta» y «maceta»
const sinMayus = (s: string | undefined) => s?.toLocaleLowerCase('es')

/** Con la letra del primero: «zanahoria» y «Zanahoria» van en un renglón, como en las filas. */
const titulosDe = (g: GrupoTareas): string[] =>
  g.tareas.map((t) => t.titulo).filter((x, i, xs) => xs.findIndex((y) => sinMayus(y) === sinMayus(x)) === i)

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
  /** la app le pide marcar cuándo asoma: si no, «sin marcar» se lee como un olvido */
  esperaGerminar?: boolean
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

/** Lo que sabe la app de cada planta, para `distinguir`. `especie` va por slug. */
export function dondeCreceDe(
  plantas: Planta[],
  ubicaciones: Ubicacion[],
  especie: (slug: string) => string | undefined,
): Map<string, DondeCrece> {
  const lugares = new Map(ubicaciones.map((u) => [u.id, u.nombre]))
  return new Map(
    plantas.map((p) => [
      p.id,
      {
        lugar: p.ubicacionId ? lugares.get(p.ubicacionId) : undefined,
        comoEsta: p.comoEsta,
        sembrada: p.sembrada,
        especie: especie(p.slug),
        variedad: p.variedad,
        germino: p.germino,
        esperaGerminar: esperaGerminacion(p),
      },
    ]),
  )
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
  const mismoLugar = (a: Tarea, b: Tarea) => sinMayus(lugar(a)) === sinMayus(lugar(b))
  const desempates: {
    clave: (t: Tarea) => string | undefined
    texto: (t: Tarea, empatadas: Tarea[]) => string | undefined
  }[] = [
    { clave: (t) => sinMayus(dato(t)?.comoEsta), texto: (t) => dato(t)?.comoEsta },
    {
      clave: (t) => dato(t)?.sembrada,
      texto: (t, es) => {
        const s = dato(t)?.sembrada
        return s && `sembrada el ${fechaParaDistinguir(s, es.map((o) => dato(o)?.sembrada))}`
      },
    },
    // tal cual el catálogo: en minúscula saldría «repollitos de bruselas»
    { clave: (t) => t.slug, texto: (t) => dato(t)?.especie },
    { clave: (t) => sinMayus(dato(t)?.variedad), texto: (t) => dato(t)?.variedad },
    {
      clave: (t) => dato(t)?.germino,
      texto: (t, es) => {
        const g = dato(t)?.germino
        if (g) return `asomó el ${fechaParaDistinguir(g, es.map((o) => dato(o)?.germino))}`
        // que no lo marcó también separa, pero sólo si se le pide: a un diente plantado, no
        return dato(t)?.esperaGerminar ? 'sin marcar cuándo asomó' : undefined
      },
    },
  ]

  // por título y no por grupo: dos iguales pueden compartir pie, o pisarse sólo en parte.
  // El apodo va en el título: «albahaca» y «Albahaca» se llaman igual
  const porTitulo = new Map<string, Tarea[]>()
  for (const t of semana) {
    const k = sinMayus(t.titulo)!
    const ya = porTitulo.get(k)
    if (ya) ya.push(t)
    else porTitulo.set(k, [t])
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
      let empatadas = mismas.filter((o) => o !== t && mismoLugar(o, t))
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
        const deCuales = g.tareas.filter((t) => sinMayus(t.titulo) === sinMayus(titulo) && t.plantaId && porTarea.has(t.id))
        const lugares = [...new Set(deCuales.map((t) => porTarea.get(t.id)!))]
        return lugares.length ? { titulo, lugares: lugares.join(' · ') } : { titulo }
      }),
    )
  }
  return { porTarea, porGrupo }
}

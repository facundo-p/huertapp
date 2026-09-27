import type { Tarea } from './engine'
import { diaYMes, fechaDiaLarga } from '../fechas'
import type { Planta, Ubicacion } from '../huerta/tipos'
import { esperaGerminacion } from '../huerta/germinacion'

// lo que escribiste a mano se compara así y se muestra tal cual: el lector lee igual «Maceta» y «maceta»
const sinMayus = (s: string | undefined) => s?.toLocaleLowerCase('es')

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
 *
 * Por id de tarea: «Bancal del fondo, sembrada el 3 sept», o «hoy», «viernes,
 * 21 de agosto». Sólo las que chocan con otra.
 */
export function distinguir(semana: Tarea[], plantas: Map<string, DondeCrece>, hoy: string): Map<string, string> {
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

  // el apodo va en el título: «albahaca» y «Albahaca» se llaman igual
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

  return porTarea
}

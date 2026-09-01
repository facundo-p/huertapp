import type { ClimaDecada, EspecieEnriquecida, Fuente, TipoPista } from '../data/types'
import { decadaDeMesDia } from '../fechas'
import { diasEntre, hoyISO, type Planta } from './tipos'
import { sumarDias } from './estimar'

/**
 * Vigilancia de la germinación.
 *
 * La ficha de cada especie trae `dias_germinacion` como rango. Cruzarlo con la
 * fecha de siembra permite responder la pregunta que uno se hace mirando la
 * maceta: ¿ya tendría que haber asomado algo, o todavía es temprano?
 *
 * Y cuando el plazo se pasó, en vez de un "algo salió mal" genérico se explica
 * lo que se puede explicar con datos: a qué temperatura arrancó esa siembra
 * contra la que esa especie necesita. El resto de las causas posibles van como
 * lo que son, cosas para chequear, sin fingir que sabemos cuál fue.
 */

export type EstadoGerminacion =
  | 'temprano' // todavía no toca
  | 'en_ventana' // ya podría asomar
  | 'demorada' // se pasó del máximo
  | 'germino' // el usuario ya la marcó
  | 'no_aplica' // plantación, esqueje o etapa avanzada

export interface Germinacion {
  estado: EstadoGerminacion
  /** primer día del rango esperado */
  desde: string
  /** último día del rango esperado */
  hasta: string
  /** días desde que se pasó el máximo (solo si está demorada) */
  diasDeMas: number
  /** días que faltan para que empiece la ventana */
  faltan: number
}

/** Una planta solo está "esperando germinar" si se sembró por semilla y sigue temprana. */
export function esperaGerminacion(p: Planta): boolean {
  if (p.germino) return false
  if (p.metodo === 'plantacion') return false // diente, bulbo o esqueje: no germina
  return p.etapa === 'almacigo' || p.etapa === 'creciendo'
}

/**
 * Mientras se espera la germinación, ése es EL dato: los demás hitos se
 * callan. La regla vive acá y solo acá — el motor de tareas y las pantallas
 * deciden con la misma función, que no vuelvan a contradecirse.
 */
export function germinacionPendiente(g: Germinacion | null): g is Germinacion {
  return !!g && g.estado !== 'germino' && g.estado !== 'no_aplica'
}

export function germinacion(
  p: Planta,
  e: EspecieEnriquecida,
  hoy = hoyISO(),
): Germinacion | null {
  if (!e.dias_germinacion) return null
  const desde = sumarDias(p.sembrada, e.dias_germinacion.min)
  const hasta = sumarDias(p.sembrada, e.dias_germinacion.max)
  const faltan = diasEntre(hoy, desde)
  const diasDeMas = diasEntre(hasta, hoy)

  let estado: EstadoGerminacion
  if (p.germino) estado = 'germino'
  else if (!esperaGerminacion(p)) estado = 'no_aplica'
  else if (faltan > 0) estado = 'temprano'
  else if (diasDeMas <= 0) estado = 'en_ventana'
  else estado = 'demorada'

  return { estado, desde, hasta, diasDeMas, faltan }
}

// ── Diagnóstico de la demora ────────────────────────────────────────────────

export interface Causa {
  titulo: string
  detalle: string
  /**
   * `medido` = sale de tus datos · `especie` = lo dice la ficha de esta
   * especie, con fuentes · `chequear` = vale para cualquier semilla
   */
  clase: 'medido' | 'especie' | 'chequear'
  fuentes?: Fuente[]
}

/** Cómo se titula cada pista de la ficha cuando aparece en el diagnóstico. */
const TITULO_PISTA: Record<TipoPista, string> = {
  profundidad: 'A qué profundidad va',
  luz: 'Necesita luz para germinar',
  humedad: 'Humedad, y sin fallar un día',
  pretratamiento: 'Hay un paso antes de sembrarla',
  paciencia: 'Esta especie tarda',
  varias: 'De cada semilla salen varias plantitas',
  poder: 'Germina poco, y es normal',
  latencia: 'Puede que la semilla esté dormida',
  vegetativo: 'Esta no se hace de semilla',
}

/**
 * Las pistas de la ficha que **reemplazan** a un chequeo genérico, en vez de
 * sumarse. Si la ficha dice que la zanahoria va a medio centímetro, mostrarle
 * además la regla de "dos o tres veces el grosor de la semilla" es ruido: la
 * concreta gana.
 */
const REEMPLAZA: Partial<Record<TipoPista, string>> = {
  profundidad: 'Profundidad',
  humedad: 'Humedad pareja',
}

/**
 * Por qué puede estar tardando, de lo más específico a lo más general.
 *
 * Primero lo que se puede afirmar con números —la temperatura que hubo contra
 * la que esta especie necesita—; después **lo que la ficha dice de esta
 * especie en particular**, con sus fuentes; y recién al final la lista de
 * cosas que valen para cualquier semilla.
 *
 * Ese orden es el arreglo de un problema real: durante un tiempo las causas
 * eran las mismas tres para las 55 especies, y eso es falso. El berro no
 * germina si lo tapaste, la zanahoria tarda veinte días y no está muerta, la
 * melisa germina al 30 % aunque hagas todo bien, y la menta directamente no se
 * siembra. Decirle a las cuatro "fijate la humedad, la profundidad y la edad
 * de la semilla" es no decir nada.
 */
export function causasDeDemora(
  p: Planta,
  e: EspecieEnriquecida,
  clima: ClimaDecada[],
): Causa[] {
  const causas: Causa[] = []
  const g = e.temperaturas.germinacion

  // temperatura media del aire durante la ventana de germinación esperada
  const [, mes, dia] = p.sembrada.split('-').map(Number)
  const decada = decadaDeMesDia(mes as never, dia)
  const media = clima[decada - 1]?.media

  if (media != null && g.min != null) {
    if (media < g.min) {
      causas.push({
        clase: 'medido',
        titulo: 'Le faltó calor, y por bastante',
        detalle: `Cuando la sembraste la media rondaba los ${media} °C y necesita al menos ${g.min} °C en el suelo para arrancar. Puede que directamente no germinen.`,
      })
    } else if (g.ideal_min != null && media < g.ideal_min) {
      causas.push({
        clase: 'medido',
        titulo: 'Está germinando en frío: va a tardar más',
        detalle: `La media era de ${media} °C y su óptimo está entre ${g.ideal_min} y ${g.ideal_max ?? '—'} °C. Con menos calor la germinación se estira; dale una semana más antes de darla por perdida.`,
      })
    } else if (g.max != null && media > g.max) {
      causas.push({
        clase: 'medido',
        titulo: 'Demasiado calor',
        detalle: `La media era de ${media} °C y por encima de ${g.max} °C muchas semillas entran en letargo en vez de germinar.`,
      })
    }
  }

  if (p.metodo === 'directa' && e.calendario.metodo_por_mes[String(mes)] === 'almacigo_protegido') {
    causas.push({
      clase: 'medido',
      titulo: 'Para ese mes la ficha pedía reparo',
      detalle:
        'La sembraste directa en un mes en el que el calendario recomienda almácigo protegido. A la intemperie el suelo tarda mucho más en llegar a la temperatura que necesita.',
    })
  }

  // ── lo que dice la ficha de ESTA especie ────────────────────────────────
  for (const pista of e.germinacion_pistas) {
    causas.push({
      clase: 'especie',
      titulo: TITULO_PISTA[pista.tipo],
      detalle: pista.texto,
      fuentes: pista.fuentes,
    })
  }

  // ── lo que vale para cualquier semilla ──────────────────────────────────
  const cubiertos = new Set(
    e.germinacion_pistas.map((x) => REEMPLAZA[x.tipo]).filter((t): t is string => !!t),
  )
  const genericas: Causa[] = [
    {
      clase: 'chequear',
      titulo: 'Humedad pareja',
      detalle:
        'El sustrato tiene que estar húmedo como una esponja escurrida, sin secarse nunca del todo. Si se secó un solo día en el medio, la semilla que ya había empezado se muere.',
    },
    {
      clase: 'chequear',
      titulo: 'Profundidad',
      detalle:
        'La regla vieja: se tapa con dos o tres veces el grosor de la semilla. Enterrada de más no llega arriba; las muy chicas casi no se tapan.',
    },
    {
      clase: 'chequear',
      titulo: 'Edad de la semilla',
      detalle:
        'Las guardadas hace más de dos o tres años germinan poco y desparejo. Si eran viejas, probá de nuevo con otras antes de culpar al clima.',
    },
  ]
  causas.push(...genericas.filter((c) => !cubiertos.has(c.titulo)))

  return causas
}

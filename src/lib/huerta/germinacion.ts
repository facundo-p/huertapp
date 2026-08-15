import type { ClimaDecada, EspecieEnriquecida } from '../data/types'
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
  /** `medido` = sale de los datos · `chequear` = cosa para ir a mirar */
  clase: 'medido' | 'chequear'
}

/**
 * Por qué puede estar tardando. Lo primero que se mira es la temperatura,
 * porque es lo único que podemos afirmar con números; el resto se ofrece como
 * lista para revisar, sin diagnosticar de prepo.
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

  causas.push(
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
  )

  return causas
}

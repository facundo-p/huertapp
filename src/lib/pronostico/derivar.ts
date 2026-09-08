// Deriva avisos genéricos del pronóstico. Lógica pura: la fecha entra por
// parámetro, nada de new Date() suelto (invariante del repo).
//
// Umbrales, con su fuente — igual que scripts/clima-gba.mjs, cada constante
// dice de dónde sale y lo supuesto queda marcado SUPUESTO:
//
// HELADA: mínima pronosticada ≤ 3 °C. Helada agrometeorológica según FAUBA:
//   3 °C en abrigo a 1,5 m ⇒ 0 °C en la superficie del suelo. La misma vara
//   que usa todo el calendario (scripts/clima-gba.mjs:18-20) y el glosario.
// CALOR: máxima ≥ 32,3 °C. Umbral de temperatura extrema (percentil 90 del
//   semestre cálido 1961-2010) del sistema de alerta por olas de calor del
//   SMN para la estación Buenos Aires. SUPUESTO: vale para todo el AMBA.
//   https://www.smn.gob.ar/sistema_temp_extremas_calor
//   Nota Técnica SMN 2018-50: https://repositorio.smn.gob.ar/handle/20.500.12160/772
// LLUVIA: probabilidad ≥ 60 % y ≥ 5 mm. SUPUESTO editorial: cuándo vale la
//   pena mencionarla. Los 5 mm se apoyan en la idea de lluvia efectiva de FAO
//   Riego y Drenaje 56 (las lluvias chicas se pierden por evaporación); el
//   consejo es condicional, el número no se presenta como dato agronómico.
//   https://www.fao.org/4/x0490s/x0490s00.htm
import type { AvisoClima, DiaPronostico, Pronostico } from './tipos'
import type { Tarea } from '../tareas/engine'
import { nombreDia } from '../fechas'

const UMBRAL_HELADA = 3
const UMBRAL_CALOR = 32.3
const LLUVIA_PROB = 60
const LLUVIA_MM = 5

const enLista = (partes: string[]): string =>
  partes.length <= 1 ? (partes[0] ?? '') : `${partes.slice(0, -1).join(', ')} y ${partes.at(-1)}`

/** «hoy» o «el viernes» */
const cuando = (fecha: string, hoy: string): string => (fecha === hoy ? 'hoy' : `el ${nombreDia(fecha)}`)

const GRAVEDAD: Record<AvisoClima['tipo'], number> = { helada: 0, calor: 1, lluvia: 2 }

/**
 * Los avisos de la semana: helada, calor extremo, lluvia. Uno por día que lo
 * dispara —el carril ubica cada uno en su fila—, el peligro primero y dentro
 * del tipo por fecha. Los ids salen del día pronosticado, así el mismo aviso
 * derivado mañana sigue siendo el mismo aviso.
 */
export function derivarAvisos(
  pronostico: Pronostico,
  hoy: string,
  nombresExpuestas: string[] = [],
): AvisoClima[] {
  const avisos: AvisoClima[] = []
  const cubrir = nombresExpuestas.length
    ? `Tapá de noche ${enLista(nombresExpuestas)}: la helada las mata.`
    : 'Si tenés plantas que la helada mata, tapalas de noche.'

  for (const d of pronostico.dias.filter((d) => d.fecha >= hoy)) {
    const aviso = (tipo: AvisoClima['tipo'], titulo: string, detalle: string, fuente: string) =>
      avisos.push({ id: `${tipo}:${d.fecha}`, tipo, fecha: d.fecha, titulo, detalle, fuente })

    if (d.min <= UMBRAL_HELADA) {
      aviso(
        'helada',
        `Puede helar ${cuando(d.fecha, hoy)}`,
        `Dan ${Math.round(d.min)} °C de mínima. ${cubrir}`,
        'pronóstico de los próximos días · umbral de helada de 3 °C (FAUBA)',
      )
    }
    if (d.max >= UMBRAL_CALOR) {
      aviso(
        'calor',
        `Mucho calor ${cuando(d.fecha, hoy)}`,
        `Dan ${Math.round(d.max)} °C. Regá temprano, y fijate a la tardecita si la tierra pide otra pasada.`,
        'pronóstico de los próximos días · umbral de calor extremo del SMN para Buenos Aires (32,3 °C)',
      )
    }
    if (d.probLluvia != null && d.probLluvia >= LLUVIA_PROB && d.lluviaMm >= LLUVIA_MM) {
      aviso(
        'lluvia',
        `Se viene lluvia ${cuando(d.fecha, hoy)}`,
        `Dan ${Math.round(d.lluviaMm)} mm, con ${d.probLluvia} % de probabilidad. Si llueve así, ese día el riego te lo ahorrás.`,
        'pronóstico de los próximos días',
      )
    }
  }

  return avisos.sort((a, b) => GRAVEDAD[a.tipo] - GRAVEDAD[b.tipo] || a.fecha.localeCompare(b.fecha))
}

/** Cuánto confiar en un pronóstico guardado, según cuándo se obtuvo. */
export function frescura(pronostico: Pronostico, ahora: string): 'fresco' | 'viejo' | 'vencido' {
  const horas = (Date.parse(ahora) - Date.parse(pronostico.obtenido)) / 3_600_000
  if (horas <= 6) return 'fresco'
  if (horas <= 36) return 'viejo'
  return 'vencido'
}

/** «actualizado hace 3 h», para el pie del carril. */
export function actualizadoHace(obtenido: string, ahora: string): string {
  const horas = Math.round((Date.parse(ahora) - Date.parse(obtenido)) / 3_600_000)
  if (horas < 1) return 'recién actualizado'
  if (horas < 24) return `actualizado hace ${horas} h`
  return 'actualizado ayer'
}

/** La franja nunca muestra días que ya pasaron de un caché viejo. */
export function recortarPasados(pronostico: Pronostico, hoy: string): DiaPronostico[] {
  return pronostico.dias.filter((d) => d.fecha >= hoy)
}

/**
 * Si el pronóstico ya avisa helada con día y mínima concretos, la tarea
 * estadística sale de la lista — mismo riesgo, no dos veces. No se marca
 * completada: si el pronóstico afloja, la estadística vuelve sola. Sin aviso
 * de helada la estadística se queda: habla de la década siguiente, una
 * ventana que el pronóstico de 7 días no cubre.
 */
export function suprimirHeladaEstadistica(tareas: Tarea[], avisos: AvisoClima[]): Tarea[] {
  if (!avisos.some((a) => a.tipo === 'helada')) return tareas
  return tareas.filter((t) => t.tipo !== 'helada')
}

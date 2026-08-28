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
import type { AvisoClima, DiaPronostico, Pronostico, TipoAviso } from './tipos'
import type { Tarea } from '../tareas/engine'

const UMBRAL_HELADA = 3
const UMBRAL_CALOR = 32.3
const LLUVIA_PROB = 60
const LLUVIA_MM = 5

const nombreDia = (fecha: string): string =>
  // T12:00: el mediodía evita que el huso corra el día (patrón del repo)
  new Date(`${fecha}T12:00:00`).toLocaleDateString('es-AR', { weekday: 'long' })

const enLista = (partes: string[]): string =>
  partes.length <= 1 ? (partes[0] ?? '') : `${partes.slice(0, -1).join(', ')} y ${partes.at(-1)}`

/** " Se repite el sábado y el domingo." — o nada, si el día es uno solo. */
const repeticion = (dias: DiaPronostico[]): string =>
  dias.length <= 1
    ? ''
    : ` Se repite ${enLista(dias.slice(1, 3).map((d) => `el ${nombreDia(d.fecha)}`))}.`

/**
 * Los avisos de la semana: helada, calor extremo, lluvia. Uno por tipo, sobre
 * el primer día que dispara; los ids salen del día pronosticado, así el mismo
 * aviso derivado mañana sigue siendo el mismo aviso.
 */
export function derivarAvisos(
  pronostico: Pronostico,
  hoy: string,
  nombresExpuestas: string[] = [],
): AvisoClima[] {
  const futuros = pronostico.dias.filter((d) => d.fecha >= hoy)
  const avisos: AvisoClima[] = []

  const aviso = (tipo: TipoAviso, dias: DiaPronostico[], titulo: string, detalle: string, fuente: string) => {
    avisos.push({ id: `${tipo}:${dias[0].fecha}`, tipo, fecha: dias[0].fecha, titulo, detalle, fuente })
  }

  const heladas = futuros.filter((d) => d.min <= UMBRAL_HELADA)
  if (heladas.length) {
    const cubrir = nombresExpuestas.length
      ? `Tapá de noche ${enLista(nombresExpuestas)}: la helada las mata.`
      : 'Si tenés plantas que la helada mata, tapalas de noche.'
    aviso(
      'helada',
      heladas,
      `Puede helar el ${nombreDia(heladas[0].fecha)}`,
      `Dan ${Math.round(heladas[0].min)} °C de mínima. ${cubrir}${repeticion(heladas)}`,
      'pronóstico de los próximos días · umbral de helada de 3 °C (FAUBA)',
    )
  }

  const calores = futuros.filter((d) => d.max >= UMBRAL_CALOR)
  if (calores.length) {
    aviso(
      'calor',
      calores,
      `Mucho calor el ${nombreDia(calores[0].fecha)}`,
      `Dan ${Math.round(calores[0].max)} °C. Regá temprano, y fijate a la tardecita si la tierra pide otra pasada.${repeticion(calores)}`,
      'pronóstico de los próximos días · umbral de calor extremo del SMN para Buenos Aires (32,3 °C)',
    )
  }

  const lluvias = futuros.filter(
    (d) => d.probLluvia != null && d.probLluvia >= LLUVIA_PROB && d.lluviaMm >= LLUVIA_MM,
  )
  if (lluvias.length) {
    aviso(
      'lluvia',
      lluvias,
      `Se viene lluvia el ${nombreDia(lluvias[0].fecha)}`,
      `Dan ${Math.round(lluvias[0].lluviaMm)} mm, con ${lluvias[0].probLluvia} % de probabilidad. Si llueve así, ese día el riego te lo ahorrás.${repeticion(lluvias)}`,
      'pronóstico de los próximos días',
    )
  }

  return avisos
}

/** Cuánto confiar en un pronóstico guardado, según cuándo se obtuvo. */
export function frescura(pronostico: Pronostico, ahora: string): 'fresco' | 'viejo' | 'vencido' {
  const horas = (Date.parse(ahora) - Date.parse(pronostico.obtenido)) / 3_600_000
  if (horas <= 6) return 'fresco'
  if (horas <= 36) return 'viejo'
  return 'vencido'
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

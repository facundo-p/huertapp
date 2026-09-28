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
import type { AvisoClima, DiaPronostico, Postit, Pronostico } from './tipos'
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
 * dispara —cada uno va en la página de su día—, el peligro primero y dentro
 * del tipo por fecha. Los ids salen del día pronosticado, así el mismo aviso
 * derivado mañana sigue siendo el mismo aviso.
 */
export function derivarAvisos(
  pronostico: Pronostico,
  hoy: string,
  nombresExpuestas: string[] = [],
): AvisoClima[] {
  const avisos: AvisoClima[] = []
  const tapar = nombresExpuestas.length
    ? `Tapá de noche ${enLista(nombresExpuestas)}`
    : 'Si tenés plantas que la helada mata, tapalas de noche'

  for (const d of pronostico.dias.filter((d) => d.fecha >= hoy)) {
    const aviso = (a: Omit<AvisoClima, 'id' | 'fecha'>) =>
      avisos.push({ id: `${a.tipo}:${d.fecha}`, fecha: d.fecha, ...a })

    if (d.min <= UMBRAL_HELADA) {
      const valor = Math.round(d.min)
      const instruccion = `${tapar}${nombresExpuestas.length ? ': la helada las mata' : ''}.`
      aviso({
        tipo: 'helada',
        titulo: `Puede helar ${cuando(d.fecha, hoy)}`,
        detalle: `Dan ${valor} °C de mínima. ${instruccion}`,
        fuente: 'pronóstico de los próximos días · umbral de helada de 3 °C (FAUBA)',
        linea: `dan ${valor} °C de mínima`,
        valor,
        accion: `${tapar}.`,
        instruccion,
      })
    }
    if (d.max >= UMBRAL_CALOR) {
      const valor = Math.round(d.max)
      const instruccion = 'Regá temprano, y fijate a la tardecita si la tierra pide otra pasada.'
      aviso({
        tipo: 'calor',
        titulo: `Mucho calor ${cuando(d.fecha, hoy)}`,
        detalle: `Dan ${valor} °C. ${instruccion}`,
        fuente: 'pronóstico de los próximos días · umbral de calor extremo del SMN para Buenos Aires (32,3 °C)',
        linea: `dan ${valor} °C de máxima`,
        valor,
        accion: 'Regá temprano.',
        instruccion,
      })
    }
    if (d.probLluvia != null && d.probLluvia >= LLUVIA_PROB && d.lluviaMm >= LLUVIA_MM) {
      const valor = Math.round(d.lluviaMm)
      aviso({
        tipo: 'lluvia',
        titulo: `Se viene lluvia ${cuando(d.fecha, hoy)}`,
        detalle: `Dan ${valor} mm, con ${d.probLluvia} % de probabilidad. Si llueve así, ese día el riego te lo ahorrás.`,
        fuente: 'pronóstico de los próximos días',
        linea: `dan ${valor} mm, con ${d.probLluvia} % de probabilidad`,
        valor,
      })
    }
  }

  return avisos.sort((a, b) => GRAVEDAD[a.tipo] - GRAVEDAD[b.tipo] || a.fecha.localeCompare(b.fecha))
}

const TITULO_POSTIT: Record<Postit['tipo'], string> = { helada: 'Puede helar', calor: 'Mucho calor' }

/**
 * Post-it sólo para lo que pide proteger algo: la lluvia es un ahorro y se
 * queda en su día. Uno por tipo y no por día —dos heladas son «Puede helar el
 * martes y el miércoles»—, en el orden de gravedad de `derivarAvisos`.
 */
export function postits(avisos: AvisoClima[], hoy: string): Postit[] {
  return (['helada', 'calor'] as const).flatMap((tipo) => {
    const suyos = avisos.filter((a) => a.tipo === tipo).sort((a, b) => a.fecha.localeCompare(b.fecha))
    if (!suyos.length) return []
    const [primero] = suyos
    return [
      {
        tipo,
        fecha: primero.fecha,
        titulo: `${TITULO_POSTIT[tipo]} ${enLista(suyos.map((a) => cuando(a.fecha, hoy)))}`,
        texto: `Dan ${enLista(suyos.map((a) => `${a.valor} °C`))}. ${primero.accion}`,
      },
    ]
  })
}

/** Cuánto confiar en un pronóstico guardado, según cuándo se obtuvo. */
export function frescura(pronostico: Pronostico, ahora: string): 'fresco' | 'viejo' | 'vencido' {
  const horas = (Date.parse(ahora) - Date.parse(pronostico.obtenido)) / 3_600_000
  if (horas <= 6) return 'fresco'
  if (horas <= 36) return 'viejo'
  return 'vencido'
}

/** «actualizado hace 3 h», para el pie de la semana. */
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

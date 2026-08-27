import { readFileSync } from 'node:fs'

/**
 * Fixture real de Open-Meteo (una respuesta capturada con curl) con las
 * fechas corridas para que el día 0 sea hoy: capturado una vez, sirve
 * siempre. El día 0 viene sin lluvia que dispare avisos; quien quiera una
 * alerta la agrega con `mutar`.
 */
const base = JSON.parse(readFileSync('tests/data/openmeteo-ejemplo.json', 'utf8'))

export const isoLocal = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

export function fixtureDesdeHoy(mutar?: (f: typeof base) => void) {
  const f = structuredClone(base)
  const fechas = f.daily.time.map((_: string, i: number) => {
    const d = new Date()
    d.setDate(d.getDate() + i)
    return isoLocal(d)
  })
  f.daily.time = fechas
  f.daily.sunrise = f.daily.sunrise.map((s: string, i: number) => fechas[i] + s.slice(10))
  f.daily.sunset = f.daily.sunset.map((s: string, i: number) => fechas[i] + s.slice(10))
  f.hourly.time = f.hourly.time.map((t: string, j: number) => fechas[Math.floor(j / 24)] + t.slice(10))
  f.daily.precipitation_probability_max[0] = 20
  f.daily.precipitation_sum[0] = 0.0
  mutar?.(f)
  return f
}

/** Con una helada pronosticada para mañana: dispara la alerta. */
export const conHelada = () =>
  fixtureDesdeHoy((f) => {
    f.daily.temperature_2m_min[1] = 2.0
  })

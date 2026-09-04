// El ÚNICO archivo que conoce Open-Meteo: sus URLs, sus nombres de parámetros,
// la forma de su JSON y los códigos WMO. Nada de eso sale de acá — el resto de
// la app habla los tipos neutrales de tipos.ts, vía el cableado de proveedor.ts.
import type {
  CieloDia,
  DiaPronostico,
  Localidad,
  Pronostico,
  ProveedorClima,
  UbicacionClima,
} from './tipos'

const BASE = 'https://api.open-meteo.com/v1/forecast'
const GEO = 'https://geocoding-api.open-meteo.com/v1/search'

const DIARIAS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_probability_max',
  'precipitation_sum',
  'wind_speed_10m_max',
  'wind_gusts_10m_max',
  'uv_index_max',
  'sunrise',
  'sunset',
  'sunshine_duration',
  'daylight_duration',
]

const HORARIAS = [
  'relative_humidity_2m',
  'dew_point_2m',
  'surface_pressure',
  'soil_temperature_6cm',
  'soil_moisture_3_to_9cm',
  'weather_code',
]

export function armarURL(lat: number, lon: number): string {
  return (
    `${BASE}?latitude=${lat}&longitude=${lon}` +
    `&daily=${DIARIAS.join(',')}` +
    `&hourly=${HORARIAS.join(',')}` +
    `&timezone=${encodeURIComponent('America/Argentina/Buenos_Aires')}&forecast_days=7`
  )
}

// Códigos de tiempo WMO 4677 (los que publica Open-Meteo) → cielo neutral.
export function cieloDeCodigo(codigo: number): CieloDia {
  if (codigo <= 1) return 'sol'
  if (codigo === 2) return 'sol-nubes'
  if (codigo === 45 || codigo === 48) return 'niebla'
  if (codigo >= 51 && codigo <= 57) return 'llovizna'
  if ((codigo >= 61 && codigo <= 67) || (codigo >= 80 && codigo <= 82)) return 'lluvia'
  if ((codigo >= 71 && codigo <= 77) || codigo === 85 || codigo === 86) return 'nieve'
  if (codigo >= 95) return 'tormenta'
  return 'nublado' // el 3, y cualquier código que no conozcamos
}

/**
 * El weather_code diario de Open-Meteo es "la condición MÁS SEVERA del día":
 * una mañana cerrada tapa un día de sol entero (pasó: 91 % de sol efectivo y
 * el código decía nublado — por eso el sol no aparecía nunca). El cielo del
 * día sale de la fracción de sol efectivo, y el agua de las horas de luz
 * tiene prioridad. Umbrales SUPUESTOS de presentación, no dato agronómico:
 * 60/30 % de sol, 2 h de agua, 3 h de niebla.
 */
export function cieloDelDia(
  codigoDiario: number,
  diurnos: number[],
  fraccionSol: number | null,
): CieloDia {
  const familias = diurnos.map(cieloDeCodigo)
  if (familias.includes('tormenta')) return 'tormenta'
  if (familias.includes('nieve')) return 'nieve'
  const agua = familias.filter((f) => f === 'lluvia' || f === 'llovizna')
  if (agua.length >= 2) return agua.includes('lluvia') ? 'lluvia' : 'llovizna'
  if (fraccionSol == null) return cieloDeCodigo(codigoDiario)
  if (fraccionSol >= 0.6) return 'sol'
  if (fraccionSol >= 0.3) return 'sol-nubes'
  if (familias.filter((f) => f === 'niebla').length >= 3) return 'niebla'
  return 'nublado'
}

interface RespuestaOM {
  daily?: {
    time?: string[]
    weather_code?: (number | null)[]
    temperature_2m_max?: (number | null)[]
    temperature_2m_min?: (number | null)[]
    precipitation_probability_max?: (number | null)[]
    precipitation_sum?: (number | null)[]
    wind_speed_10m_max?: (number | null)[]
    wind_gusts_10m_max?: (number | null)[]
    uv_index_max?: (number | null)[]
    sunrise?: string[]
    sunset?: string[]
    sunshine_duration?: (number | null)[]
    daylight_duration?: (number | null)[]
  }
  hourly?: {
    time?: string[]
    relative_humidity_2m?: (number | null)[]
    dew_point_2m?: (number | null)[]
    surface_pressure?: (number | null)[]
    soil_temperature_6cm?: (number | null)[]
    weather_code?: (number | null)[]
  }
}

const numero = (v: unknown): number | null => (typeof v === 'number' ? v : null)

const redondear = (n: number, decimales: number): number => {
  const factor = 10 ** decimales
  return Math.round(n * factor) / factor
}

/** Valores del horario que caen dentro de la fecha dada, sin los null. */
function valoresDelDia(horas: string[], serie: (number | null)[] | undefined, fecha: string): number[] {
  if (!serie) return []
  const valores: number[] = []
  for (let i = 0; i < horas.length; i++) {
    const v = serie[i]
    if (horas[i].startsWith(fecha) && typeof v === 'number') valores.push(v)
  }
  return valores
}

export function parsear(json: unknown, lat: number, lon: number, obtenido: string): Pronostico {
  const r = json as RespuestaOM
  const d = r.daily
  if (!d?.time || !Array.isArray(d.time) || d.time.length === 0) {
    throw new Error('la respuesta no tiene forma de pronóstico')
  }
  const horas = r.hourly?.time ?? []

  const dias: DiaPronostico[] = []
  for (let i = 0; i < d.time.length; i++) {
    const fecha = d.time[i]
    const codigo = numero(d.weather_code?.[i])
    const min = numero(d.temperature_2m_min?.[i])
    const max = numero(d.temperature_2m_max?.[i])
    // Sin cielo o sin temperaturas el día no dice nada: se omite, no se inventa.
    if (fecha == null || codigo == null || min == null || max == null) continue

    // los códigos de las horas de luz: de la salida a la puesta del sol
    const amanecer = d.sunrise?.[i]
    const atardecer = d.sunset?.[i]
    const hDesde = amanecer ? Number(amanecer.slice(11, 13)) : 0
    const hHasta = atardecer ? Number(atardecer.slice(11, 13)) : 23
    const diurnos: number[] = []
    for (let j = 0; j < horas.length; j++) {
      const v = r.hourly?.weather_code?.[j]
      if (!horas[j].startsWith(fecha) || typeof v !== 'number') continue
      const hora = Number(horas[j].slice(11, 13))
      if (hora >= hDesde && hora <= hHasta) diurnos.push(v)
    }
    const solSeg = numero(d.sunshine_duration?.[i])
    const luzSeg = numero(d.daylight_duration?.[i])
    const fraccionSol = solSeg != null && luzSeg != null && luzSeg > 0 ? solSeg / luzSeg : null

    const humedades = valoresDelDia(horas, r.hourly?.relative_humidity_2m, fecha)
    const presiones = valoresDelDia(horas, r.hourly?.surface_pressure, fecha)
    const suelos = valoresDelDia(horas, r.hourly?.soil_temperature_6cm, fecha)

    // El rocío del amanecer: el dew point a la hora en que sale el sol.
    let rocio: number | null = null
    if (amanecer) {
      const horaAmanecer = `${fecha}T${amanecer.slice(11, 13)}:00`
      const j = horas.indexOf(horaAmanecer)
      rocio = j >= 0 ? numero(r.hourly?.dew_point_2m?.[j]) : null
    }

    dias.push({
      fecha,
      cielo: cieloDelDia(codigo, diurnos, fraccionSol),
      min,
      max,
      probLluvia: numero(d.precipitation_probability_max?.[i]),
      lluviaMm: numero(d.precipitation_sum?.[i]) ?? 0,
      vientoMax: numero(d.wind_speed_10m_max?.[i]) ?? 0,
      rafagas: numero(d.wind_gusts_10m_max?.[i]) ?? 0,
      uvMax: numero(d.uv_index_max?.[i]),
      humedad: humedades.length
        ? { min: Math.round(Math.min(...humedades)), max: Math.round(Math.max(...humedades)) }
        : null,
      presionMedia: presiones.length
        ? Math.round(presiones.reduce((a, b) => a + b, 0) / presiones.length)
        : null,
      rocioAmanecer: rocio == null ? null : redondear(rocio, 1),
      sueloTemp: suelos.length
        ? redondear(suelos.reduce((a, b) => a + b, 0) / suelos.length, 1)
        : null,
    })
  }

  return { dias, obtenido, lat, lon }
}

async function pedirPronostico(
  u: UbicacionClima,
  fetchFn: typeof fetch = fetch,
  ahora: string = new Date().toISOString(),
): Promise<Pronostico> {
  const res = await fetchFn(armarURL(u.lat, u.lon))
  if (!res.ok) throw new Error(`Open-Meteo respondió ${res.status}`)
  return parsear(await res.json(), u.lat, u.lon, ahora)
}

interface ResultadoGeo {
  name?: string
  latitude?: number
  longitude?: number
  admin1?: string
  admin2?: string
}

async function buscarLocalidad(texto: string, fetchFn: typeof fetch = fetch): Promise<Localidad[]> {
  const res = await fetchFn(
    `${GEO}?name=${encodeURIComponent(texto)}&count=5&language=es&countryCode=AR&format=json`,
  )
  if (!res.ok) throw new Error(`la búsqueda de localidades respondió ${res.status}`)
  const json = (await res.json()) as { results?: ResultadoGeo[] }
  return (json.results ?? [])
    .filter((r) => r.name && typeof r.latitude === 'number' && typeof r.longitude === 'number')
    .map((r) => ({
      nombre: r.name!,
      detalle: [r.admin2, r.admin1].filter(Boolean).join(', '),
      lat: redondear(r.latitude!, 2),
      lon: redondear(r.longitude!, 2),
    }))
}

export const openMeteo: ProveedorClima = {
  nombre: 'Open-Meteo',
  atribucion: {
    texto: 'Datos meteorológicos de Open-Meteo.com (CC BY 4.0)',
    url: 'https://open-meteo.com/',
  },
  pedirPronostico,
  buscarLocalidad,
}

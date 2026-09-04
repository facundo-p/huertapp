// El adaptador de Open-Meteo es el ÚNICO lugar que conoce ese proveedor:
// sus URLs, sus nombres de parámetros y sus códigos WMO. Estos tests fijan
// esa frontera: todo lo que sale de acá son los tipos neutrales de tipos.ts.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { openMeteo, armarURL, parsear, cieloDeCodigo, cieloDelDia } from '../src/lib/pronostico/openMeteo'
import { proveedor } from '../src/lib/pronostico/proveedor'
import { COORDS_ZONA } from '../src/lib/pronostico/tipos'
import type { UbicacionClima } from '../src/lib/pronostico/tipos'

const ejemplo = JSON.parse(
  readFileSync(join(__dirname, 'data/openmeteo-ejemplo.json'), 'utf8'),
)

const EZEIZA: UbicacionClima = {
  modo: 'zona',
  lat: -34.82,
  lon: -58.54,
  etiqueta: 'cerca de Ezeiza (aproximado)',
}

// Respuesta mínima válida para tests que no usan el fixture completo.
const minima = (daily: Record<string, unknown[]>, hourly?: Record<string, unknown[]>) => ({
  daily: {
    time: ['2026-08-27'],
    weather_code: [3],
    temperature_2m_max: [20],
    temperature_2m_min: [10],
    precipitation_probability_max: [50],
    precipitation_sum: [0],
    wind_speed_10m_max: [10],
    wind_gusts_10m_max: [20],
    uv_index_max: [5],
    sunrise: ['2026-08-27T07:19'],
    sunset: ['2026-08-27T18:30'],
    sunshine_duration: [null],
    daylight_duration: [null],
    ...daily,
  },
  hourly: hourly ?? {
    time: Array.from({ length: 24 }, (_, i) => `2026-08-27T${String(i).padStart(2, '0')}:00`),
    relative_humidity_2m: Array(24).fill(70),
    dew_point_2m: Array(24).fill(8),
    surface_pressure: Array(24).fill(1010),
    soil_temperature_6cm: Array(24).fill(14),
    soil_moisture_3_to_9cm: Array(24).fill(0.3),
    weather_code: Array(24).fill(3),
  },
})

describe('armarURL', () => {
  it('pide exactamente las variables acordadas, en hora de Buenos Aires', () => {
    expect(armarURL(-34.82, -58.54)).toBe(
      'https://api.open-meteo.com/v1/forecast?latitude=-34.82&longitude=-58.54' +
        '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,wind_speed_10m_max,wind_gusts_10m_max,uv_index_max,sunrise,sunset,sunshine_duration,daylight_duration' +
        '&hourly=relative_humidity_2m,dew_point_2m,surface_pressure,soil_temperature_6cm,soil_moisture_3_to_9cm,weather_code' +
        '&timezone=America%2FArgentina%2FBuenos_Aires&forecast_days=7',
    )
  })
})

describe('cieloDeCodigo', () => {
  it('mapea todos los códigos WMO conocidos a un CieloDia', () => {
    const conocidos = [
      0, 1, 2, 3, 45, 48, 51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 71, 73, 75,
      77, 80, 81, 82, 85, 86, 95, 96, 99,
    ]
    const validos = ['sol', 'sol-nubes', 'nublado', 'niebla', 'llovizna', 'lluvia', 'tormenta', 'nieve']
    for (const codigo of conocidos) {
      expect(validos, `código ${codigo}`).toContain(cieloDeCodigo(codigo))
    }
  })

  it('casos puntuales: despejado, llovizna, chaparrón, tormenta', () => {
    expect(cieloDeCodigo(0)).toBe('sol')
    expect(cieloDeCodigo(55)).toBe('llovizna')
    expect(cieloDeCodigo(80)).toBe('lluvia')
    expect(cieloDeCodigo(95)).toBe('tormenta')
  })

  it('un código desconocido cae en nublado, no revienta', () => {
    expect(cieloDeCodigo(42)).toBe('nublado')
  })
})

describe('cieloDelDia', () => {
  const soleado = Array(12).fill(0)

  it('la fracción de sol manda: mucha luz es sol, media es sol con nubes, poca es nublado', () => {
    expect(cieloDelDia(3, [3, 3, 3, 0, 0, 0], 0.91)).toBe('sol')
    expect(cieloDelDia(3, [3, 3, 3, 0, 0, 0], 0.45)).toBe('sol-nubes')
    expect(cieloDelDia(3, [3, 3, 3, 3, 3, 3], 0.2)).toBe('nublado')
  })

  it('el código diario "más severo del día" ya no decide solo (el bug del sol que nunca aparecía)', () => {
    // día real 2026-08-28: código diario 3 por la mañana cerrada, 91 % de sol
    expect(cieloDelDia(3, [3, 3, 3, 2, 3, 3, 2, 1, 3, 0, 0, 1], 0.91)).toBe('sol')
  })

  it('dos o más horas de agua a la luz del día pisan al sol', () => {
    expect(cieloDelDia(3, [61, 63, ...soleado], 0.7)).toBe('lluvia')
    expect(cieloDelDia(3, [51, 53, ...soleado], 0.8)).toBe('llovizna')
  })

  it('una sola hora de agua no alcanza para teñir el día', () => {
    expect(cieloDelDia(3, [51, ...soleado], 0.8)).toBe('sol')
  })

  it('la tormenta y la nieve ganan siempre', () => {
    expect(cieloDelDia(3, [95, ...soleado], 0.9)).toBe('tormenta')
    expect(cieloDelDia(3, [71, ...soleado], 0.9)).toBe('nieve')
  })

  it('la niebla aparece cuando domina y no hay sol que la levante', () => {
    expect(cieloDelDia(45, [45, 45, 45, 3, 3, 3], 0.1)).toBe('niebla')
  })

  it('sin fracción de sol ni horarios, cae al código diario de siempre', () => {
    expect(cieloDelDia(55, [], null)).toBe('llovizna')
  })
})

describe('parsear', () => {
  const p = parsear(ejemplo, -34.82, -58.54, '2026-08-27T14:00:00.000Z')

  it('devuelve los 7 días con sus fechas', () => {
    expect(p.dias).toHaveLength(7)
    expect(p.dias[0].fecha).toBe('2026-08-28')
    expect(p.dias[6].fecha).toBe('2026-09-03')
  })

  it('traduce el diario del primer día: cielo, temperaturas, lluvia, uv, viento', () => {
    const dia = p.dias[0]
    // el código diario dice 3 (nublado) por la mañana cerrada, pero el día
    // tuvo 91 % de sol efectivo y ni una hora de agua a la luz del día: es sol
    expect(dia.cielo).toBe('sol')
    expect(dia.min).toBe(7.6)
    expect(dia.max).toBe(19.4)
    expect(dia.probLluvia).toBe(2)
    expect(dia.lluviaMm).toBe(0.0)
    expect(dia.uvMax).toBe(5.25)
    expect(dia.vientoMax).toBe(10.1)
    expect(dia.rafagas).toBe(18.7)
  })

  it('agrega el horario del primer día: humedad, presión, rocío al amanecer, suelo', () => {
    const dia = p.dias[0]
    expect(dia.humedad).toEqual({ min: 43, max: 100 })
    expect(dia.presionMedia).toBe(1008)
    expect(dia.rocioAmanecer).toBe(8.1) // dew_point a la hora del amanecer (07:17 → hora 7)
    expect(dia.sueloTemp).toBe(11.7)
  })

  it('recuerda con qué se pidió: coordenadas y momento', () => {
    expect(p.lat).toBe(-34.82)
    expect(p.lon).toBe(-58.54)
    expect(p.obtenido).toBe('2026-08-27T14:00:00.000Z')
  })

  it('los huecos del proveedor quedan como null, no como 0', () => {
    const r = parsear(
      minima(
        { precipitation_probability_max: [null], uv_index_max: [null] },
        {
          time: Array.from({ length: 24 }, (_, i) => `2026-08-27T${String(i).padStart(2, '0')}:00`),
          relative_humidity_2m: Array(24).fill(null),
          dew_point_2m: Array(24).fill(null),
          surface_pressure: Array(24).fill(null),
          soil_temperature_6cm: Array(24).fill(null),
          soil_moisture_3_to_9cm: Array(24).fill(null),
        },
      ),
      -34.82,
      -58.54,
      '2026-08-27T14:00:00.000Z',
    )
    expect(r.dias[0].probLluvia).toBeNull()
    expect(r.dias[0].uvMax).toBeNull()
    expect(r.dias[0].humedad).toBeNull()
    expect(r.dias[0].presionMedia).toBeNull()
    expect(r.dias[0].rocioAmanecer).toBeNull()
    expect(r.dias[0].sueloTemp).toBeNull()
  })
})

describe('pedirPronostico', () => {
  const respuesta = (cuerpo: unknown, ok = true, status = 200) =>
    ({ ok, status, json: async () => cuerpo }) as Response

  it('pide la URL del lugar y devuelve el pronóstico parseado', async () => {
    let pedida = ''
    const stub = (async (url: RequestInfo | URL) => {
      pedida = String(url)
      return respuesta(ejemplo)
    }) as typeof fetch
    const p = await openMeteo.pedirPronostico(EZEIZA, stub, '2026-08-27T14:00:00.000Z')
    expect(pedida).toBe(armarURL(-34.82, -58.54))
    expect(p.dias).toHaveLength(7)
    expect(p.obtenido).toBe('2026-08-27T14:00:00.000Z')
  })

  it('un error HTTP rechaza con el estado a la vista', async () => {
    const stub = (async () => respuesta({}, false, 429)) as typeof fetch
    await expect(openMeteo.pedirPronostico(EZEIZA, stub)).rejects.toThrow('429')
  })

  it('una respuesta sin forma de pronóstico rechaza, no devuelve basura', async () => {
    const stub = (async () => respuesta({ hola: 'chau' })) as typeof fetch
    await expect(openMeteo.pedirPronostico(EZEIZA, stub)).rejects.toThrow()
  })
})

describe('buscarLocalidad', () => {
  const geocoding = {
    results: [
      {
        name: 'Temperley',
        latitude: -34.77435,
        longitude: -58.39347,
        country_code: 'AR',
        admin1: 'Buenos Aires',
        admin2: 'Partido de Lomas de Zamora',
      },
    ],
  }

  it('busca en Argentina y normaliza el resultado con coordenadas redondeadas', async () => {
    let pedida = ''
    const stub = (async (url: RequestInfo | URL) => {
      pedida = String(url)
      return { ok: true, status: 200, json: async () => geocoding } as Response
    }) as typeof fetch
    const r = await openMeteo.buscarLocalidad('Temperley', stub)
    expect(pedida).toContain('name=Temperley')
    expect(pedida).toContain('countryCode=AR')
    expect(r).toEqual([
      {
        nombre: 'Temperley',
        detalle: 'Partido de Lomas de Zamora, Buenos Aires',
        lat: -34.77,
        lon: -58.39,
      },
    ])
  })

  it('sin resultados devuelve lista vacía, no revienta', async () => {
    const stub = (async () => ({ ok: true, status: 200, json: async () => ({}) }) as Response) as typeof fetch
    expect(await openMeteo.buscarLocalidad('xyzzy', stub)).toEqual([])
  })
})

describe('el contrato de proveedor', () => {
  it('el proveedor cableado es Open-Meteo, con nombre y atribución para la UI', () => {
    expect(proveedor).toBe(openMeteo)
    expect(proveedor.nombre).toBe('Open-Meteo')
    expect(proveedor.atribucion.url).toContain('open-meteo.com')
    expect(proveedor.atribucion.texto).toContain('CC BY 4.0')
  })
})

describe('las coordenadas por zona', () => {
  it('las tres zonas tienen su estación de referencia en el AMBA', () => {
    for (const zona of ['urbano', 'conurbano', 'periurbano'] as const) {
      const c = COORDS_ZONA[zona]
      expect(c.lat).toBeGreaterThan(-35.1)
      expect(c.lat).toBeLessThan(-34.4)
      expect(c.lon).toBeGreaterThan(-58.7)
      expect(c.lon).toBeLessThan(-57.7)
    }
  })
})

// ─── derivador de avisos ─────────────────────────────────────────────────────

import {
  derivarAvisos,
  frescura,
  recortarPasados,
  suprimirHeladaEstadistica,
} from '../src/lib/pronostico/derivar'
import type { DiaPronostico, Pronostico } from '../src/lib/pronostico/tipos'
import type { Tarea } from '../src/lib/tareas/engine'

const dia = (fecha: string, extra: Partial<DiaPronostico> = {}): DiaPronostico => ({
  fecha,
  cielo: 'sol',
  min: 10,
  max: 20,
  probLluvia: 10,
  lluviaMm: 0,
  vientoMax: 10,
  rafagas: 20,
  uvMax: 5,
  humedad: { min: 40, max: 80 },
  presionMedia: 1010,
  rocioAmanecer: 5,
  sueloTemp: 14,
  ...extra,
})

const pron = (dias: DiaPronostico[], obtenido = '2026-08-27T12:00:00.000Z'): Pronostico => ({
  dias,
  obtenido,
  lat: -34.82,
  lon: -58.54,
})

const HOY = '2026-08-27'

describe('derivarAvisos', () => {
  it('una semana tranquila no avisa nada', () => {
    expect(derivarAvisos(pron([dia('2026-08-27'), dia('2026-08-28')]), HOY)).toEqual([])
  })

  it('mínima en el umbral de helada (3 °C) avisa; apenas arriba, no', () => {
    const con = derivarAvisos(pron([dia('2026-08-28', { min: 3.0 })]), HOY)
    expect(con).toHaveLength(1)
    expect(con[0].tipo).toBe('helada')
    const sin = derivarAvisos(pron([dia('2026-08-28', { min: 3.1 })]), HOY)
    expect(sin).toEqual([])
  })

  it('el aviso de helada dice qué día, cuánto, y de dónde sale', () => {
    const [a] = derivarAvisos(pron([dia('2026-08-28', { min: 2.0 })]), HOY)
    expect(a.id).toBe('helada:2026-08-28')
    expect(a.fecha).toBe('2026-08-28')
    expect(a.titulo).toContain('viernes')
    expect(a.detalle).toContain('2 °C')
    expect(a.fuente).toContain('FAUBA')
  })

  it('con los nombres de las plantas expuestas, el aviso las nombra', () => {
    const [a] = derivarAvisos(pron([dia('2026-08-28', { min: 2.0 })]), HOY, [
      'el tomate',
      'la albahaca',
    ])
    expect(a.detalle).toContain('el tomate')
    expect(a.detalle).toContain('la albahaca')
  })

  it('máxima en el umbral de calor extremo (32,3 °C) avisa; abajo, no', () => {
    const con = derivarAvisos(pron([dia('2026-08-28', { max: 32.3 })]), HOY)
    expect(con).toHaveLength(1)
    expect(con[0].tipo).toBe('calor')
    expect(con[0].fuente).toContain('SMN')
    expect(derivarAvisos(pron([dia('2026-08-28', { max: 32.2 })]), HOY)).toEqual([])
  })

  it('lluvia con probabilidad y milímetros avisa; sin alguna de las dos, no', () => {
    const con = derivarAvisos(pron([dia('2026-08-28', { probLluvia: 80, lluviaMm: 12 })]), HOY)
    expect(con).toHaveLength(1)
    expect(con[0].tipo).toBe('lluvia')
    expect(con[0].detalle).toContain('12 mm')
    expect(derivarAvisos(pron([dia('2026-08-28', { probLluvia: 80, lluviaMm: 2 })]), HOY)).toEqual([])
    expect(derivarAvisos(pron([dia('2026-08-28', { probLluvia: 40, lluviaMm: 12 })]), HOY)).toEqual([])
    expect(derivarAvisos(pron([dia('2026-08-28', { probLluvia: null, lluviaMm: 12 })]), HOY)).toEqual([])
  })

  it('varios días con helada: un solo aviso, el del primer día, que anuncia la repetición', () => {
    const avisos = derivarAvisos(
      pron([dia('2026-08-28', { min: 2 }), dia('2026-08-30', { min: 1 })]),
      HOY,
    )
    expect(avisos).toHaveLength(1)
    expect(avisos[0].fecha).toBe('2026-08-28')
    expect(avisos[0].detalle).toMatch(/repite/i)
  })

  it('los días que ya pasaron no generan avisos', () => {
    expect(derivarAvisos(pron([dia('2026-08-26', { min: 2 })]), HOY)).toEqual([])
  })

  it('el id no cambia si el aviso se deriva mañana de nuevo', () => {
    const p = pron([dia('2026-08-28', { min: 2 })])
    const hoy = derivarAvisos(p, '2026-08-27')[0]
    const maniana = derivarAvisos(p, '2026-08-28')[0]
    expect(hoy.id).toBe(maniana.id)
  })

  it('el peligro va primero: helada, calor, lluvia', () => {
    const avisos = derivarAvisos(
      pron([
        dia('2026-08-28', { probLluvia: 90, lluviaMm: 15 }),
        dia('2026-08-29', { max: 35 }),
        dia('2026-08-30', { min: 1 }),
      ]),
      HOY,
    )
    expect(avisos.map((a) => a.tipo)).toEqual(['helada', 'calor', 'lluvia'])
  })
})

describe('frescura', () => {
  const p = pron([dia('2026-08-27')], '2026-08-27T12:00:00.000Z')

  it('hasta 6 horas es fresco', () => {
    expect(frescura(p, '2026-08-27T17:00:00.000Z')).toBe('fresco')
    expect(frescura(p, '2026-08-27T18:00:00.000Z')).toBe('fresco')
  })

  it('hasta 36 horas es viejo pero mostrable', () => {
    expect(frescura(p, '2026-08-28T08:00:00.000Z')).toBe('viejo')
    expect(frescura(p, '2026-08-29T00:00:00.000Z')).toBe('viejo')
  })

  it('más de 36 horas está vencido', () => {
    expect(frescura(p, '2026-08-29T04:00:00.000Z')).toBe('vencido')
  })
})

describe('recortarPasados', () => {
  it('deja solo hoy y lo que viene', () => {
    const p = pron([dia('2026-08-26'), dia('2026-08-27'), dia('2026-08-28')])
    expect(recortarPasados(p, '2026-08-27').map((d) => d.fecha)).toEqual([
      '2026-08-27',
      '2026-08-28',
    ])
  })
})

describe('suprimirHeladaEstadistica', () => {
  const tareas = [
    { id: 'helada:1a de septiembre', tipo: 'helada', titulo: 'Puede helar' },
    { id: 'cosechar:p-1', tipo: 'cosechar', titulo: 'Cosechá' },
  ] as Tarea[]

  it('con aviso de helada del pronóstico, la tarea estadística se corre', () => {
    const avisos = derivarAvisos(pron([dia('2026-08-28', { min: 2 })]), HOY)
    expect(suprimirHeladaEstadistica(tareas, avisos).map((t) => t.tipo)).toEqual(['cosechar'])
  })

  it('sin aviso de helada, la estadística se queda (habla de otra ventana)', () => {
    const avisos = derivarAvisos(pron([dia('2026-08-28', { probLluvia: 90, lluviaMm: 15 })]), HOY)
    expect(suprimirHeladaEstadistica(tareas, avisos)).toEqual(tareas)
  })
})

describe('hayQueActualizar', () => {
  const EN_EZEIZA = pron([dia('2026-08-27')], '2026-08-27T12:00:00.000Z')

  it('sin nada guardado, hay que pedir', async () => {
    const { hayQueActualizar } = await import('../src/lib/pronostico/store')
    expect(hayQueActualizar(undefined, EZEIZA, '2026-08-27T13:00:00.000Z')).toBe(true)
  })

  it('con un pronóstico fresco del mismo lugar, no se molesta a nadie', async () => {
    const { hayQueActualizar } = await import('../src/lib/pronostico/store')
    expect(hayQueActualizar(EN_EZEIZA, EZEIZA, '2026-08-27T13:00:00.000Z')).toBe(false)
  })

  it('si la ubicación cambió, el caché no sirve', async () => {
    const { hayQueActualizar } = await import('../src/lib/pronostico/store')
    const enLaPlata = { ...EZEIZA, lat: -34.97, lon: -57.89 }
    expect(hayQueActualizar(EN_EZEIZA, enLaPlata, '2026-08-27T13:00:00.000Z')).toBe(true)
  })

  it('pasadas las 6 horas se vuelve a pedir', async () => {
    const { hayQueActualizar } = await import('../src/lib/pronostico/store')
    expect(hayQueActualizar(EN_EZEIZA, EZEIZA, '2026-08-27T19:00:00.000Z')).toBe(true)
  })
})

describe('ubicarPorGPS', () => {
  const geoQueResponde = (lat: number, lon: number) =>
    ({
      getCurrentPosition: (ok: PositionCallback) =>
        ok({ coords: { latitude: lat, longitude: lon } } as GeolocationPosition),
    }) as Geolocation

  it('devuelve las coordenadas redondeadas a ~1 km', async () => {
    const { ubicarPorGPS } = await import('../src/lib/pronostico/geo')
    expect(await ubicarPorGPS(geoQueResponde(-34.774353, -58.393479))).toEqual({
      lat: -34.77,
      lon: -58.39,
    })
  })

  it('el permiso denegado se distingue del GPS que no anda', async () => {
    const { ubicarPorGPS } = await import('../src/lib/pronostico/geo')
    const geoQueFalla = (code: number) =>
      ({
        getCurrentPosition: (_: PositionCallback, err?: PositionErrorCallback) =>
          err?.({ code } as GeolocationPositionError),
      }) as Geolocation
    await expect(ubicarPorGPS(geoQueFalla(1))).rejects.toThrow('denegado')
    await expect(ubicarPorGPS(geoQueFalla(2))).rejects.toThrow('no-disponible')
  })

  it('sin soporte de geolocalización, el error lo dice', async () => {
    const { ubicarPorGPS } = await import('../src/lib/pronostico/geo')
    await expect(ubicarPorGPS(undefined)).rejects.toThrow('no-disponible')
  })
})

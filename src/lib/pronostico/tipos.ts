// Tipos neutrales del pronóstico. Acá no entra nada del proveedor concreto:
// ni la forma de su JSON, ni sus códigos. Cambiar de proveedor es escribir
// otro adaptador de ProveedorClima y tocar solo el cableado de proveedor.ts.
import type { Zona } from '../data/types'

export type ModoUbicacion = 'zona' | 'localidad' | 'gps'

export interface UbicacionClima {
  modo: ModoUbicacion
  // A 2 decimales (~1 km): alcanza para un pronóstico y no señala una casa.
  lat: number
  lon: number
  etiqueta: string
}

export type CieloDia =
  | 'sol'
  | 'sol-nubes'
  | 'nublado'
  | 'niebla'
  | 'llovizna'
  | 'lluvia'
  | 'tormenta'
  | 'nieve'

export interface DiaPronostico {
  fecha: string // yyyy-mm-dd en hora del AMBA; se compara como string
  cielo: CieloDia
  min: number
  max: number
  probLluvia: number | null // % — los días lejanos pueden venir sin dato
  lluviaMm: number
  vientoMax: number // km/h
  rafagas: number // km/h
  uvMax: number | null
  humedad: { min: number; max: number } | null // %
  presionMedia: number | null // hPa
  rocioAmanecer: number | null // °C a la hora de la salida del sol
  sueloTemp: number | null // °C a 6 cm, media del día según el modelo del proveedor
}

export interface Pronostico {
  dias: DiaPronostico[]
  obtenido: string // ISO completo: decide la frescura
  lat: number // con qué coordenadas se pidió; si cambian, el caché no sirve
  lon: number
}

export interface Localidad {
  nombre: string
  detalle: string
  lat: number
  lon: number
}

export type TipoAviso = 'helada' | 'lluvia' | 'calor'

export interface AvisoClima {
  id: string // `${tipo}:${fecha}` — determinístico por día pronosticado
  tipo: TipoAviso
  fecha: string
  titulo: string
  detalle: string
  fuente: string
}

export interface ProveedorClima {
  nombre: string
  atribucion: { texto: string; url: string } // lo que exige la licencia de sus datos
  pedirPronostico(u: UbicacionClima, fetchFn?: typeof fetch, ahora?: string): Promise<Pronostico>
  buscarLocalidad(texto: string, fetchFn?: typeof fetch): Promise<Localidad[]>
}

// Estación SMN de referencia de cada zona — las mismas que calibran el modelo
// estadístico (scripts/clima-gba.mjs). Coordenadas del listado de estaciones
// del SMN (https://www.smn.gob.ar/descarga-de-datos), a 2 decimales.
// "Aproximado por zona" pide el pronóstico acá: no revela nada personal.
export const COORDS_ZONA: Record<Zona, { lat: number; lon: number; nombre: string }> = {
  urbano: { lat: -34.59, lon: -58.48, nombre: 'el Observatorio (CABA)' },
  conurbano: { lat: -34.82, lon: -58.54, nombre: 'Ezeiza' },
  periurbano: { lat: -34.97, lon: -57.89, nombre: 'La Plata' },
}

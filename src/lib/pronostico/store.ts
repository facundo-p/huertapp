// Estado del pronóstico de la huerta activa. La ubicación es de la huerta y la
// trae el store de la huerta con `seguirHuerta`; acá vive el último pronóstico
// pedido. El proveedor entra solo por proveedor.ts: acá no se nombra a Open-Meteo.
import { useSyncExternalStore } from 'react'
import * as db from '../huerta/db'
import { frescura } from './derivar'
import { proveedor } from './proveedor'
import type { Pronostico, UbicacionClima } from './tipos'
import { HUERTA_PRINCIPAL } from '../huerta/huertas'

/** Legada: de acá sale la ubicación de la huerta principal la primera vez. */
export const CLAVE_UBICACION = 'pronostico-ubicacion'

/** Un caché por huerta; la principal sigue usando la clave de siempre. */
export const claveCache = (huertaId: string) =>
  huertaId === HUERTA_PRINCIPAL ? 'pronostico-cache' : `pronostico-cache:${huertaId}`

export interface EstadoPronostico {
  ubicacion?: UbicacionClima
  pronostico?: Pronostico
  /** ya se leyó lo guardado en IndexedDB */
  cargado: boolean
  actualizando: boolean
  /** el último pedido de red falló (el caché, si hay, sigue valiendo) */
  fallo: boolean
}

const INICIAL: EstadoPronostico = { cargado: false, actualizando: false, fallo: false }

let estado: EstadoPronostico = INICIAL
const oyentes = new Set<() => void>()

function emitir(nuevo: Partial<EstadoPronostico>) {
  estado = { ...estado, ...nuevo }
  for (const f of oyentes) f()
}

/** Pura: si lo guardado alcanza o hay que volver a pedir. */
export function hayQueActualizar(
  cache: Pronostico | undefined,
  ubicacion: UbicacionClima,
  ahora: string,
): boolean {
  if (!cache) return true
  if (cache.lat !== ubicacion.lat || cache.lon !== ubicacion.lon) return true
  return frescura(cache, ahora) !== 'fresco'
}

let enVuelo: Promise<void> | null = null
/** de qué huerta es lo que hay en `estado`; null hasta que el store la diga */
let huertaId: string | null = null

/** Pide el pronóstico si hace falta. Un fallo deja el caché y no hace ruido. */
function actualizar() {
  const u = estado.ubicacion
  const id = huertaId
  if (id === null || !u || !hayQueActualizar(estado.pronostico, u, new Date().toISOString())) return
  enVuelo ??= (async () => {
    emitir({ actualizando: true, fallo: false })
    try {
      const p = await proveedor.pedirPronostico(u)
      await db.guardarAjuste(claveCache(id), p)
      // si en el medio se cambió de huerta, este pronóstico es de la otra
      if (huertaId === id) emitir({ pronostico: p, actualizando: false })
      else emitir({ actualizando: false })
    } catch {
      emitir({ actualizando: false, fallo: true })
    } finally {
      enVuelo = null
    }
  })()
}

/**
 * El store de la huerta avisa cuál es la activa y dónde está, cada vez que
 * relee. Si cambió la huerta se lee su caché; si cambió el lugar, el caché del
 * lugar anterior no dice nada de este y se borra.
 */
export async function seguirHuerta(id: string, ubicacion: UbicacionClima | undefined) {
  const misma = id === huertaId
  if (misma && estado.cargado && mismaUbicacion(estado.ubicacion, ubicacion)) return
  huertaId = id
  if (misma && estado.cargado) {
    if (!ubicacion) await db.borrarAjuste(claveCache(id)).catch(() => {})
    emitir({ ubicacion, pronostico: undefined, fallo: false })
  } else {
    emitir({ ubicacion, pronostico: undefined, fallo: false, cargado: false })
    const pronostico = await db.leerAjuste<Pronostico>(claveCache(id)).catch(() => undefined)
    if (huertaId !== id) return // otro cambio de huerta llegó antes
    emitir({ pronostico, cargado: true })
  }
  actualizar()
}

const mismaUbicacion = (a?: UbicacionClima, b?: UbicacionClima) =>
  a?.lat === b?.lat && a?.lon === b?.lon && a?.modo === b?.modo && a?.etiqueta === b?.etiqueta

let mirandoVisibilidad = false

function suscribir(f: () => void) {
  oyentes.add(f)
  if (!mirandoVisibilidad && typeof document !== 'undefined') {
    mirandoVisibilidad = true
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') actualizar()
    })
  }
  return () => oyentes.delete(f)
}

export function usePronostico(): EstadoPronostico {
  return useSyncExternalStore(
    suscribir,
    () => estado,
    () => INICIAL,
  )
}

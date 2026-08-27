// Estado del pronóstico: la ubicación elegida y el último pronóstico pedido,
// persistidos en los ajustes de IndexedDB (patrón de tareas/estado.ts). El
// proveedor entra solo por proveedor.ts — acá no se nombra a Open-Meteo.
import { useSyncExternalStore } from 'react'
import * as db from '../huerta/db'
import { frescura } from './derivar'
import { proveedor } from './proveedor'
import type { Pronostico, UbicacionClima } from './tipos'

export const CLAVE_UBICACION = 'pronostico-ubicacion'
export const CLAVE_CACHE = 'pronostico-cache'

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

/** Pide el pronóstico si hace falta. Un fallo deja el caché y no hace ruido. */
function actualizar() {
  const u = estado.ubicacion
  if (!u || !hayQueActualizar(estado.pronostico, u, new Date().toISOString())) return
  enVuelo ??= (async () => {
    emitir({ actualizando: true, fallo: false })
    try {
      const p = await proveedor.pedirPronostico(u)
      await db.guardarAjuste(CLAVE_CACHE, p)
      emitir({ pronostico: p, actualizando: false })
    } catch {
      emitir({ actualizando: false, fallo: true })
    } finally {
      enVuelo = null
    }
  })()
}

async function cargar() {
  const [ubicacion, pronostico] = await Promise.all([
    db.leerAjuste<UbicacionClima>(CLAVE_UBICACION),
    db.leerAjuste<Pronostico>(CLAVE_CACHE),
  ])
  emitir({ ubicacion, pronostico, cargado: true })
  actualizar()
}

let arranque: Promise<void> | null = null
let mirandoVisibilidad = false

function suscribir(f: () => void) {
  oyentes.add(f)
  arranque ??= cargar().catch(() => {
    arranque = null // que el próximo vuelva a intentar leer la base
  })
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

export async function elegirUbicacion(u: UbicacionClima) {
  await db.guardarAjuste(CLAVE_UBICACION, u)
  // el caché del lugar anterior no dice nada de este: afuera
  await db.borrarAjuste(CLAVE_CACHE)
  emitir({ ubicacion: u, pronostico: undefined, fallo: false })
  actualizar()
}

/** Vuelve todo a como estaba antes de activar el pronóstico. */
export async function sacarUbicacion() {
  await db.borrarAjuste(CLAVE_UBICACION)
  await db.borrarAjuste(CLAVE_CACHE)
  emitir({ ubicacion: undefined, pronostico: undefined, fallo: false })
}

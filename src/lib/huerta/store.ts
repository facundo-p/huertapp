import { useSyncExternalStore } from 'react'
import * as db from './db'
import { anotar, nombreError } from './bitacora'
import { unaVez } from './reintento'
import { hoyISO, nuevoId, type Etapa, type EntradaDiario, type Planta, type Ubicacion } from './tipos'
import type { Metodo } from '../data/types'

// Store fino sobre IndexedDB: nada de Redux para cuatro listas. Se lee con
// useSyncExternalStore y se refresca entero después de cada escritura — con
// decenas de plantas el costo es irrelevante y evita toda una clase de bugs
// de sincronización.

interface Estado {
  plantas: Planta[]
  ubicaciones: Ubicacion[]
  cargado: boolean
  /**
   * No se pudo LEER. Distinto de una huerta vacía, y la diferencia importa: a
   * quien no podemos leerle los datos no se le dice que nunca plantó nada.
   */
  errorCarga?: string
  /** La última escritura falló. Se limpia sola cuando una sale bien. */
  errorEscritura?: string
}

let estado: Estado = { plantas: [], ubicaciones: [], cargado: false }
const oyentes = new Set<() => void>()

function emitir(nuevo: Estado) {
  estado = nuevo
  for (const f of oyentes) f()
}

async function refrescar() {
  const [plantas, ubicaciones] = await Promise.all([db.listarPlantas(), db.listarUbicaciones()])
  emitir({ ...estado, plantas, ubicaciones, cargado: true, errorCarga: undefined })
}

// `unaVez` y no `arranque ??=`: guardar la promesa rechazada dejaba la sesión
// entera sin datos y sin reintentar nunca.
const cargaInicial = unaVez(async () => {
  try {
    await refrescar()
    // el conteo del momento del arranque: leído al anotar, dos awaits más
    // tarde, podía caer después de una siembra y decir otra cosa. Pasó en CI.
    const plantas = estado.plantas.length
    const { baseVersion, faltan } = await db.radiografia()
    anotar('arranque', {
      baseVersion,
      faltan,
      plantas,
      persistente: await db.estaPersistido(),
    })
  } catch (e) {
    const error = nombreError(e)
    anotar('error-lectura', { error, detalle: 'arranque' })
    emitir({ ...estado, cargado: false, errorCarga: error })
    throw e
  }
})

/** El estado ya cuenta el error, así que acá no hay nada que relanzar. */
export const inicializar = (): Promise<void> => cargaInicial().catch(() => {})

export function reintentarCarga(): Promise<void> {
  emitir({ ...estado, errorCarga: undefined })
  return inicializar()
}

/**
 * Toda escritura pasa por acá: si falla, queda anotada y **visible**. Antes el
 * rechazo no lo tomaba nadie y el botón se veía igual que uno que no anda.
 */
async function escribiendo<T>(fn: () => Promise<T>): Promise<T> {
  try {
    const r = await fn()
    if (estado.errorEscritura) emitir({ ...estado, errorEscritura: undefined })
    return r
  } catch (e) {
    const error = nombreError(e)
    anotar('error-escritura', { error })
    emitir({ ...estado, errorEscritura: error })
    throw e
  }
}

/** Para los onClick: el error ya quedó anotado y a la vista en el estado. */
export const sinRomper = (p: Promise<unknown>) => void p.catch(() => {})

function suscribir(f: () => void) {
  oyentes.add(f)
  void inicializar()
  return () => oyentes.delete(f)
}

const leer = () => estado
const leerServidor = () => estado

export function useHuerta(): Estado {
  return useSyncExternalStore(suscribir, leer, leerServidor)
}

// ── Acciones ─────────────────────────────────────────────────────────────────

export interface AltaPlanta {
  slug: string
  apodo?: string
  ubicacionId?: string
  sembrada?: string
  metodo: Metodo | null
  notas?: string
}

/** Arranca en almácigo si el método lo dice; si no, ya está en tierra. */
export function etapaInicial(metodo: Metodo | null): Etapa {
  return metodo === 'almacigo' || metodo === 'almacigo_protegido' ? 'almacigo' : 'creciendo'
}

export async function agregarPlanta(alta: AltaPlanta): Promise<Planta> {
  const sembrada = alta.sembrada ?? hoyISO()
  const planta: Planta = {
    id: nuevoId(),
    slug: alta.slug,
    apodo: alta.apodo?.trim() || undefined,
    ubicacionId: alta.ubicacionId,
    sembrada,
    metodo: alta.metodo,
    etapa: etapaInicial(alta.metodo),
    etapaDesde: sembrada,
    notas: alta.notas?.trim() || undefined,
    creada: new Date().toISOString(),
  }
  await escribiendo(async () => {
    await db.guardarPlanta(planta)
    await refrescar()
  })
  return planta
}

export async function actualizarPlanta(p: Planta) {
  await escribiendo(async () => {
    await db.guardarPlanta(p)
    await refrescar()
  })
}

/** El usuario confirma que asomó. Deja de preguntar y queda como dato del ciclo. */
export async function marcarGerminada(p: Planta, fecha = hoyISO()) {
  await escribiendo(async () => {
    await db.guardarPlanta({ ...p, germino: fecha })
    await refrescar()
  })
}

export async function cambiarEtapa(p: Planta, etapa: Etapa) {
  await escribiendo(async () => {
    await db.guardarPlanta({ ...p, etapa, etapaDesde: hoyISO() })
    await refrescar()
  })
}

export async function borrarPlanta(id: string) {
  await escribiendo(async () => {
    await db.borrarPlanta(id)
    await refrescar()
  })
}

export async function agregarUbicacion(nombre: string, tipo: Ubicacion['tipo']): Promise<Ubicacion> {
  const u: Ubicacion = { id: nuevoId(), nombre: nombre.trim(), tipo, creada: new Date().toISOString() }
  await escribiendo(async () => {
    await db.guardarUbicacion(u)
    await refrescar()
  })
  return u
}

export async function borrarUbicacion(id: string) {
  // las plantas que la usaban quedan sin ubicación, no se borran
  await escribiendo(async () => {
    const plantas = await db.listarPlantas()
    for (const p of plantas) {
      if (p.ubicacionId === id) await db.guardarPlanta({ ...p, ubicacionId: undefined })
    }
    await db.borrarUbicacion(id)
    await refrescar()
  })
}

// ── Diario ───────────────────────────────────────────────────────────────────

export async function agregarEntrada(
  entrada: Omit<EntradaDiario, 'id' | 'creada'>,
): Promise<EntradaDiario> {
  const e: EntradaDiario = { ...entrada, id: nuevoId(), creada: new Date().toISOString() }
  await escribiendo(() => db.guardarEntrada(e))
  return e
}

/** Después de importar un backup hay que releer todo. */
export async function recargar() {
  await refrescar()
}

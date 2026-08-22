import { useSyncExternalStore } from 'react'
import * as db from './db'
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
}

let estado: Estado = { plantas: [], ubicaciones: [], cargado: false }
const oyentes = new Set<() => void>()

function emitir(nuevo: Estado) {
  estado = nuevo
  for (const f of oyentes) f()
}

async function refrescar() {
  const [plantas, ubicaciones] = await Promise.all([db.listarPlantas(), db.listarUbicaciones()])
  emitir({ plantas, ubicaciones, cargado: true })
}

let arranque: Promise<void> | null = null
export function inicializar(): Promise<void> {
  arranque ??= refrescar()
  return arranque
}

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
  variedad?: string
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
    variedad: alta.variedad?.trim() || undefined,
    ubicacionId: alta.ubicacionId,
    sembrada,
    metodo: alta.metodo,
    etapa: etapaInicial(alta.metodo),
    etapaDesde: sembrada,
    notas: alta.notas?.trim() || undefined,
    creada: new Date().toISOString(),
  }
  await db.guardarPlanta(planta)
  await refrescar()
  return planta
}

export async function actualizarPlanta(p: Planta) {
  await db.guardarPlanta(p)
  await refrescar()
}

/** El usuario confirma que asomó. Deja de preguntar y queda como dato del ciclo. */
export async function marcarGerminada(p: Planta, fecha = hoyISO()) {
  await db.guardarPlanta({ ...p, germino: fecha })
  await refrescar()
}

export async function cambiarEtapa(p: Planta, etapa: Etapa) {
  await db.guardarPlanta({ ...p, etapa, etapaDesde: hoyISO() })
  await refrescar()
}

export async function borrarPlanta(id: string) {
  await db.borrarPlanta(id)
  await refrescar()
}

export async function agregarUbicacion(nombre: string, tipo: Ubicacion['tipo']): Promise<Ubicacion> {
  const u: Ubicacion = { id: nuevoId(), nombre: nombre.trim(), tipo, creada: new Date().toISOString() }
  await db.guardarUbicacion(u)
  await refrescar()
  return u
}

export async function borrarUbicacion(id: string) {
  // las plantas que la usaban quedan sin ubicación, no se borran
  const plantas = await db.listarPlantas()
  for (const p of plantas) {
    if (p.ubicacionId === id) await db.guardarPlanta({ ...p, ubicacionId: undefined })
  }
  await db.borrarUbicacion(id)
  await refrescar()
}

// ── Diario ───────────────────────────────────────────────────────────────────

export async function agregarEntrada(
  entrada: Omit<EntradaDiario, 'id' | 'creada'>,
): Promise<EntradaDiario> {
  const e: EntradaDiario = { ...entrada, id: nuevoId(), creada: new Date().toISOString() }
  await db.guardarEntrada(e)
  return e
}

/** Después de importar un backup hay que releer todo. */
export async function recargar() {
  await refrescar()
}

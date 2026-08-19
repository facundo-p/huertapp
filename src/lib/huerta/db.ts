import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { EntradaDiario, Foto, Planta, Ubicacion } from './tipos'

// IndexedDB, sin servidor y sin cuenta. Nota honesta: iOS puede vaciar el
// almacenamiento de un sitio que no se usa por semanas. Por eso el backup
// existe desde el primer día y en Ajustes se dice sin vueltas.

const NOMBRE = 'huerta-gba'
const VERSION = 1

interface Esquema extends DBSchema {
  plantas: { key: string; value: Planta; indexes: { slug: string } }
  diario: { key: string; value: EntradaDiario; indexes: { plantaId: string } }
  fotos: { key: string; value: Foto }
  ubicaciones: { key: string; value: Ubicacion }
  ajustes: { key: string; value: unknown }
}

const STORES = ['plantas', 'diario', 'fotos', 'ubicaciones', 'ajustes'] as const

/** Idempotente a propósito: también corre para reparar una base incompleta. */
function crearStores(d: IDBPDatabase<Esquema>) {
  if (!d.objectStoreNames.contains('plantas')) {
    d.createObjectStore('plantas', { keyPath: 'id' }).createIndex('slug', 'slug')
  }
  if (!d.objectStoreNames.contains('diario')) {
    d.createObjectStore('diario', { keyPath: 'id' }).createIndex('plantaId', 'plantaId')
  }
  if (!d.objectStoreNames.contains('fotos')) d.createObjectStore('fotos', { keyPath: 'id' })
  if (!d.objectStoreNames.contains('ubicaciones')) d.createObjectStore('ubicaciones', { keyPath: 'id' })
  if (!d.objectStoreNames.contains('ajustes')) d.createObjectStore('ajustes')
}

let db: Promise<IDBPDatabase<Esquema>> | null = null

/**
 * Abre la base y **se asegura de que tenga sus object stores**.
 *
 * Parece redundante y no lo es. `indexedDB.open(nombre)` sin versión crea la
 * base en versión 1 y sin ningún store; a partir de ahí, `openDB(nombre, 1,
 * {upgrade})` ve que la versión 1 ya existe, no dispara el upgrade nunca, y la
 * app queda con una base que no puede leer ni escribir. Le pasó a una persona
 * en la 1.1.0: el service worker abría así la base desde `periodicsync`, su
 * huerta apareció vacía y no pudo volver a guardar nada — ni restaurando el
 * backup, porque el estado roto sobrevive a todo salvo borrar la base a mano.
 *
 * El service worker ya no la crea (ver `scripts/sw.js`), pero esto queda igual:
 * es lo único que puede rescatar a quien ya la tenga rota, y el día que otra
 * cosa abra la base sin versión no volvemos a perder los datos de nadie.
 */
async function abrirVerificando(): Promise<IDBPDatabase<Esquema>> {
  let d: IDBPDatabase<Esquema>
  try {
    d = await openDB<Esquema>(NOMBRE, VERSION, { upgrade: crearStores })
  } catch (e) {
    // La base ya está en una versión mayor: alguna vez hubo que repararla.
    if ((e as DOMException)?.name !== 'VersionError') throw e
    d = await openDB<Esquema>(NOMBRE)
  }

  if (STORES.every((s) => d.objectStoreNames.contains(s))) return d

  // Base a medio crear. Subir la versión es la única forma de que el navegador
  // vuelva a dar una transacción de upgrade; se sube desde la que realmente
  // tiene, que puede no ser 1.
  const siguiente = d.version + 1
  d.close()
  return openDB<Esquema>(NOMBRE, siguiente, { upgrade: crearStores })
}

export function abrir(): Promise<IDBPDatabase<Esquema>> {
  db ??= abrirVerificando()
  return db
}

/**
 * Pide al navegador que no evicte estos datos. No siempre lo concede, y en iOS
 * puede ignorarlo: es una mejora de probabilidad, no una garantía.
 */
export async function pedirPersistencia(): Promise<boolean> {
  if (!navigator.storage?.persist) return false
  try {
    if (await navigator.storage.persisted()) return true
    return await navigator.storage.persist()
  } catch {
    return false
  }
}

export async function espacioUsado(): Promise<{ usado: number; total: number } | null> {
  if (!navigator.storage?.estimate) return null
  try {
    const { usage = 0, quota = 0 } = await navigator.storage.estimate()
    return { usado: usage, total: quota }
  } catch {
    return null
  }
}

// ── Plantas ──────────────────────────────────────────────────────────────────
export const listarPlantas = async () => (await abrir()).getAll('plantas')
export const leerPlanta = async (id: string) => (await abrir()).get('plantas', id)

let persistenciaPedida = false
export const guardarPlanta = async (p: Planta) => {
  await (await abrir()).put('plantas', p)
  // El momento de pedir que el navegador no evicte los datos es este: recién
  // ahora hay algo que perder. Pedirlo al abrir la app, cuando no hay nada
  // cargado, es un permiso que se pide sin motivo (y en Firefox, un cartel).
  if (!persistenciaPedida) {
    persistenciaPedida = true
    void pedirPersistencia()
  }
}

/** Borra la planta con todo lo suyo: entradas de diario y fotos. */
export async function borrarPlanta(id: string) {
  const d = await abrir()
  const entradas = await d.getAllFromIndex('diario', 'plantaId', id)
  const tx = d.transaction(['plantas', 'diario', 'fotos'], 'readwrite')
  await tx.objectStore('plantas').delete(id)
  for (const e of entradas) {
    await tx.objectStore('diario').delete(e.id)
    for (const f of e.fotoIds) await tx.objectStore('fotos').delete(f)
  }
  await tx.done
}

// ── Diario ───────────────────────────────────────────────────────────────────
export const listarDiario = async (plantaId: string) =>
  (await abrir()).getAllFromIndex('diario', 'plantaId', plantaId)
export const listarTodoElDiario = async () => (await abrir()).getAll('diario')
export const guardarEntrada = async (e: EntradaDiario) => {
  await (await abrir()).put('diario', e)
}

export async function borrarEntrada(id: string) {
  const d = await abrir()
  const entrada = await d.get('diario', id)
  const tx = d.transaction(['diario', 'fotos'], 'readwrite')
  await tx.objectStore('diario').delete(id)
  for (const f of entrada?.fotoIds ?? []) await tx.objectStore('fotos').delete(f)
  await tx.done
}

// ── Fotos ────────────────────────────────────────────────────────────────────
export const leerFoto = async (id: string) => (await abrir()).get('fotos', id)
export const listarFotos = async () => (await abrir()).getAll('fotos')
export const guardarFoto = async (f: Foto) => {
  await (await abrir()).put('fotos', f)
}

// ── Ubicaciones ──────────────────────────────────────────────────────────────
export const listarUbicaciones = async () => (await abrir()).getAll('ubicaciones')
export const guardarUbicacion = async (u: Ubicacion) => {
  await (await abrir()).put('ubicaciones', u)
}
export const borrarUbicacion = async (id: string) => {
  await (await abrir()).delete('ubicaciones', id)
}

// ── Ajustes sueltos ──────────────────────────────────────────────────────────
export const leerAjuste = async <T>(clave: string) => (await abrir()).get('ajustes', clave) as Promise<T | undefined>
export const guardarAjuste = async (clave: string, valor: unknown) => {
  await (await abrir()).put('ajustes', valor, clave)
}

/** Vacía todo. Lo usa el import (que reemplaza) y el botón de borrar todo. */
export async function vaciarTodo() {
  const d = await abrir()
  const tx = d.transaction(['plantas', 'diario', 'fotos', 'ubicaciones'], 'readwrite')
  await Promise.all([
    tx.objectStore('plantas').clear(),
    tx.objectStore('diario').clear(),
    tx.objectStore('fotos').clear(),
    tx.objectStore('ubicaciones').clear(),
  ])
  await tx.done
}

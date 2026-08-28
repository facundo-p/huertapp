import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { EntradaDiario, Foto, Planta, Ubicacion } from './tipos'
import { anotar, nombreError } from './bitacora'
import { unaVez } from './reintento'

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
  anotar('reparacion', { baseVersion: d.version, faltan: faltantes(d) })
  const siguiente = d.version + 1
  d.close()
  return openDB<Esquema>(NOMBRE, siguiente, { upgrade: crearStores })
}

// `unaVez` y no `db ??=`: si abrir falla una vez, el rechazo cacheado dejaba la
// app sin base para toda la sesión, sin reintentar nunca.
const abrirUnaVez = unaVez(async () => {
  try {
    return await abrirVerificando()
  } catch (e) {
    anotar('error-lectura', { error: nombreError(e), detalle: 'abrir' })
    throw e
  }
})

export const abrir = (): Promise<IDBPDatabase<Esquema>> => abrirUnaVez()

const faltantes = (d: IDBPDatabase<Esquema>) => STORES.filter((s) => !d.objectStoreNames.contains(s))

/** Cómo está la base ahora mismo. Es lo que se anota en cada arranque. */
export async function radiografia(): Promise<{ baseVersion: number; faltan: string[] }> {
  const d = await abrir()
  return { baseVersion: d.version, faltan: faltantes(d) }
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

/** Si el navegador se comprometió a no evictar. `null` si no sabe decirlo. */
export async function estaPersistido(): Promise<boolean | null> {
  if (!navigator.storage?.persisted) return null
  try {
    return await navigator.storage.persisted()
  } catch {
    return null
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

/**
 * Guarda plantas y entradas de diario juntas: o entra todo o nada. Dividir una
 * tanda escribe dos plantas y dos entradas; a medias sería una huerta que
 * cuenta plantines que no existen.
 */
export async function guardarLote(datos: { plantas: Planta[]; entradas: EntradaDiario[] }) {
  const d = await abrir()
  const tx = d.transaction(['plantas', 'diario'], 'readwrite')
  // sin ningún await ajeno a la transacción (auto-commit, ver reemplazarTodo)
  for (const p of datos.plantas) tx.objectStore('plantas').put(p)
  for (const e of datos.entradas) tx.objectStore('diario').put(e)
  await tx.done
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
export const borrarAjuste = async (clave: string) => {
  await (await abrir()).delete('ajustes', clave)
}

/**
 * Reemplaza toda la huerta **en una sola transacción**: si algo falla, no se
 * borró nada.
 *
 * Antes el import hacía `vaciarTodo()` y después escribía de a un registro. Un
 * archivo cortado, o uno solo que IndexedDB rechazara, dejaba la huerta vacía:
 * te borraba lo que tenías para no poder darte lo que venía en el archivo.
 *
 * Dos cosas que no se pueden tocar acá:
 *
 * - **Los blobs llegan resueltos.** Un `await` sobre algo que no sea IndexedDB
 *   dentro de la transacción la deja morir sola (auto-commit), y el rollback
 *   se pierde. Por eso las fotos se decodifican antes, en `backup.ts`.
 * - **El abort es explícito.** `put` con un registro sin su keyPath tira
 *   DataError *sincrónico*: se escapa del bloque y la transacción confirmaría
 *   el `clear()` que ya estaba encolado.
 */
export async function reemplazarTodo(datos: {
  plantas: Planta[]
  diario: EntradaDiario[]
  ubicaciones: Ubicacion[]
  fotos: Foto[]
}) {
  const d = await abrir()
  const tx = d.transaction(['plantas', 'diario', 'fotos', 'ubicaciones'], 'readwrite')
  try {
    for (const s of ['plantas', 'diario', 'fotos', 'ubicaciones'] as const) {
      tx.objectStore(s).clear()
    }
    for (const u of datos.ubicaciones) tx.objectStore('ubicaciones').put(u)
    for (const p of datos.plantas) tx.objectStore('plantas').put(p)
    for (const e of datos.diario) tx.objectStore('diario').put(e)
    for (const f of datos.fotos) tx.objectStore('fotos').put(f)
    await tx.done
    anotar('import', { plantas: datos.plantas.length })
  } catch (e) {
    try {
      tx.abort()
    } catch {
      // ya estaba abortada: el error real es el de afuera
    }
    await tx.done.catch(() => {})
    anotar('error-escritura', { error: nombreError(e), detalle: 'import' })
    throw e
  }
}

/** Vacía todo. Lo usa el botón de borrar todo. */
export async function vaciarTodo() {
  const d = await abrir()
  anotar('vaciado', { plantas: (await d.getAll('plantas')).length })
  const tx = d.transaction(['plantas', 'diario', 'fotos', 'ubicaciones'], 'readwrite')
  await Promise.all([
    tx.objectStore('plantas').clear(),
    tx.objectStore('diario').clear(),
    tx.objectStore('fotos').clear(),
    tx.objectStore('ubicaciones').clear(),
  ])
  await tx.done
}

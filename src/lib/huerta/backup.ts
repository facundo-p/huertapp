import * as db from './db'
import {
  hoyISO,
  type Compostera,
  type EntradaDiario,
  type Foto,
  type Huerta,
  type Planta,
  type Ubicacion,
} from './tipos'
import { resumenHuerta } from './tanda'
import { celdasSanas, planoSano } from './croquis'
import { ZONA_DEFAULT } from '../zona'
import { huertaActiva, listaDeHuertas } from './store'
import { HUERTA_PRINCIPAL, huertaDe, huertaPrincipalDesde, resolverActiva } from './huertas'
import type { UbicacionClima } from '../pronostico/tipos'
import { ZONAS, type Zona } from '../data/types'

/**
 * Backup en un solo archivo JSON, fotos incluidas.
 *
 * Existe desde el primer día y no como extra: los datos viven solo en este
 * aparato y iOS puede vaciar el almacenamiento de un sitio que no se usa por
 * semanas. Un archivo suelto que el usuario se manda por mail es la red de
 * seguridad más simple que funciona sin cuenta ni servidor.
 */

// 2 sumó las huertas: cada una con su zona y su pronóstico
export const VERSION_BACKUP = 2

const CLAVE_ULTIMO = 'ultimo-backup'

export const leerUltimoBackup = () => db.leerAjuste<string>(CLAVE_ULTIMO)

export interface Backup {
  app: 'huerta-gba'
  version: number
  exportado: string
  /** siempre al menos una; un v1 llega con la principal armada por `aV2` */
  huertas: Huerta[]
  huertaActiva?: string
  /** solo en v1: desde la v2 viven en cada huerta */
  zona?: Zona
  ubicacionClima?: UbicacionClima
  plantas: Planta[]
  diario: EntradaDiario[]
  ubicaciones: Ubicacion[]
  fotos: Array<{ id: string; tipo: string; ancho: number; alto: number; creada: string; datos: string }>
  /** opcional a propósito: los backups anteriores a las composteras importan igual */
  composteras?: Compostera[]
}

const aDataURL = (blob: Blob): Promise<string> =>
  new Promise((res, rej) => {
    const fr = new FileReader()
    fr.onload = () => res(fr.result as string)
    fr.onerror = () => rej(fr.error)
    fr.readAsDataURL(blob)
  })

const desdeDataURL = async (datos: string): Promise<Blob> => (await fetch(datos)).blob()

export async function armarBackup(): Promise<Backup> {
  const [plantas, diario, ubicaciones, fotos, composteras] = await Promise.all([
    db.listarPlantas(),
    db.listarTodoElDiario(),
    db.listarUbicaciones(),
    db.listarFotos(),
    db.listarComposteras(),
  ])
  // el id explícito: en el archivo no hay «sin huerta», así se lee solo
  const conHuerta = <T extends { huertaId?: string }>(x: T): T => ({ ...x, huertaId: huertaDe(x) })
  return {
    app: 'huerta-gba',
    version: VERSION_BACKUP,
    exportado: new Date().toISOString(),
    huertas: listaDeHuertas(),
    huertaActiva: huertaActiva().id,
    plantas: plantas.map(conHuerta),
    diario,
    ubicaciones: ubicaciones.map(conHuerta),
    fotos: await Promise.all(
      fotos.map(async (f: Foto) => ({
        id: f.id,
        tipo: f.tipo,
        ancho: f.ancho,
        alto: f.alto,
        creada: f.creada,
        datos: await aDataURL(f.blob),
      })),
    ),
    composteras: composteras.map(conHuerta),
  }
}

export function nombreArchivo(): string {
  return `huerta-${hoyISO()}.json`
}

/**
 * Descarga o comparte el backup. En iOS instalado, `<a download>` suele no
 * hacer nada: si el aparato sabe compartir archivos, se usa eso.
 */
export async function exportar(): Promise<'compartido' | 'descargado'> {
  const json = JSON.stringify(await armarBackup())
  const blob = new Blob([json], { type: 'application/json' })
  const archivo = new File([blob], nombreArchivo(), { type: 'application/json' })

  if (navigator.canShare?.({ files: [archivo] })) {
    try {
      await navigator.share({ files: [archivo], title: 'Backup de mi huerta' })
      await db.guardarAjuste(CLAVE_ULTIMO, new Date().toISOString())
      return 'compartido'
    } catch (e) {
      // el usuario canceló el diálogo: no es un error que valga la pena gritar
      if ((e as Error)?.name === 'AbortError') return 'compartido'
    }
  }

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = nombreArchivo()
  a.click()
  setTimeout(() => URL.revokeObjectURL(url), 10_000)
  await db.guardarAjuste(CLAVE_ULTIMO, new Date().toISOString())
  return 'descargado'
}

export class BackupInvalido extends Error {}

/** Valida la forma del archivo antes de tocar nada de lo que ya hay. */
export function validar(dato: unknown): Backup {
  const b = dato as Partial<Backup>
  if (!b || typeof b !== 'object') throw new BackupInvalido('El archivo no es un backup.')
  if (b.app !== 'huerta-gba') throw new BackupInvalido('Ese archivo no es un backup de Huerta GBA.')
  if (typeof b.version !== 'number' || b.version > VERSION_BACKUP) {
    throw new BackupInvalido(
      `El backup es de una versión más nueva de la app (v${b.version}). Actualizá la app y probá de nuevo.`,
    )
  }
  for (const campo of ['plantas', 'diario', 'ubicaciones', 'fotos'] as const) {
    if (!Array.isArray(b[campo])) throw new BackupInvalido(`Al backup le falta "${campo}".`)
  }
  if (b.composteras !== undefined && !Array.isArray(b.composteras)) {
    throw new BackupInvalido('Al backup se le rompió "composteras".')
  }
  const v2 = aV2(b as Backup)
  validarHuertas(v2)
  // lo del croquis no frena el import: lo roto se descarta y se dibuja el nivel 0
  return {
    ...v2,
    plantas: v2.plantas.map((p) => sinRoto(p, 'celdas', celdasSanas)),
    ubicaciones: v2.ubicaciones.map((u) => sinRoto(u, 'plano', planoSano)),
  }
}

/**
 * Un v1 trae una sola huerta implícita: se arma la principal con su zona y su
 * pronóstico. Sus registros no tienen `huertaId` y así ya son de ella.
 */
export function aV2(b: Backup): Backup {
  if (b.version >= 2) return b
  const { zona, ubicacionClima, ...resto } = b
  return {
    ...resto,
    huertas: [huertaPrincipalDesde(zona ?? ZONA_DEFAULT, ubicacionClima, b.exportado?.slice(0, 10) || hoyISO())],
    huertaActiva: HUERTA_PRINCIPAL,
  }
}

/** Una planta de una huerta que no vino quedaría en ninguna: mejor no importar. */
function validarHuertas(b: Backup) {
  const sanas =
    Array.isArray(b.huertas) &&
    b.huertas.length > 0 &&
    b.huertas.every((h) => h && typeof h.id === 'string' && typeof h.nombre === 'string' && ZONAS.includes(h.zona))
  if (!sanas) throw new BackupInvalido('Al backup se le rompió "huertas".')
  const ids = new Set(b.huertas.map((h) => h.id))
  const registros = [...b.plantas, ...b.ubicaciones, ...(b.composteras ?? [])]
  if (registros.some((x) => !ids.has(huertaDe(x)))) {
    throw new BackupInvalido('El backup tiene cosas de una huerta que no viene en el archivo.')
  }
}

function sinRoto<T>(x: T, campo: string, sanar: (v: unknown) => unknown): T {
  if (!x || typeof x !== 'object' || !(campo in x)) return x
  const { [campo]: v, ...resto } = x as Record<string, unknown>
  const sano = sanar(v)
  return (sano === undefined ? resto : { ...resto, [campo]: sano }) as T
}

export interface ResumenBackup {
  plantas: number
  /** "3 siembras · ~24 plantas": el mismo texto que usa Mi huerta */
  huerta: string
  entradas: number
  fotos: number
  composteras: number
  exportado: string
  huertas: { nombre: string; zona: Zona }[]
}

export const resumir = (b: Backup): ResumenBackup => ({
  plantas: b.plantas.length,
  huerta: resumenHuerta(b.plantas),
  entradas: b.diario.length,
  fotos: b.fotos.length,
  composteras: b.composteras?.length ?? 0,
  exportado: b.exportado,
  huertas: b.huertas.map(({ nombre, zona }) => ({ nombre, zona })),
})

export async function leerArchivo(archivo: File): Promise<Backup> {
  let dato: unknown
  try {
    dato = JSON.parse(await archivo.text())
  } catch {
    throw new BackupInvalido('El archivo está roto o no es un JSON.')
  }
  return validar(dato)
}

/**
 * Importa REEMPLAZANDO todo lo que haya. Nunca se llama sin confirmación
 * explícita del usuario: la pantalla muestra primero qué trae el archivo.
 */
export async function importar(b: Backup): Promise<void> {
  // Las fotos se decodifican ANTES de tocar la base: adentro de la transacción
  // un await que no sea de IndexedDB la deja morir sola y se pierde el rollback.
  const fotos: Foto[] = await Promise.all(
    b.fotos.map(async (f) => ({
      id: f.id,
      blob: await desdeDataURL(f.datos),
      tipo: f.tipo,
      ancho: f.ancho,
      alto: f.alto,
      creada: f.creada,
    })),
  )

  await db.reemplazarTodo({
    plantas: b.plantas,
    diario: b.diario,
    ubicaciones: b.ubicaciones,
    fotos,
    composteras: b.composteras ?? [],
    // el import reemplaza todo: también las huertas, con su zona y su pronóstico
    huertas: b.huertas,
    activa: resolverActiva(b.huertas, b.huertaActiva).id,
  })
}

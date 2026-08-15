import * as db from './db'
import { hoyISO, type EntradaDiario, type Foto, type Planta, type Ubicacion } from './tipos'
import { zonaActual, elegirZona } from '../zona'
import type { Zona } from '../data/types'

/**
 * Backup en un solo archivo JSON, fotos incluidas.
 *
 * Existe desde el primer día y no como extra: los datos viven solo en este
 * aparato y iOS puede vaciar el almacenamiento de un sitio que no se usa por
 * semanas. Un archivo suelto que el usuario se manda por mail es la red de
 * seguridad más simple que funciona sin cuenta ni servidor.
 */

export const VERSION_BACKUP = 1

export interface Backup {
  app: 'huerta-gba'
  version: number
  exportado: string
  zona: Zona
  plantas: Planta[]
  diario: EntradaDiario[]
  ubicaciones: Ubicacion[]
  fotos: Array<{ id: string; tipo: string; ancho: number; alto: number; creada: string; datos: string }>
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
  const [plantas, diario, ubicaciones, fotos] = await Promise.all([
    db.listarPlantas(),
    db.listarTodoElDiario(),
    db.listarUbicaciones(),
    db.listarFotos(),
  ])
  return {
    app: 'huerta-gba',
    version: VERSION_BACKUP,
    exportado: new Date().toISOString(),
    zona: zonaActual(),
    plantas,
    diario,
    ubicaciones,
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
  return b as Backup
}

export interface ResumenBackup {
  plantas: number
  entradas: number
  fotos: number
  exportado: string
  zona: Zona
}

export const resumir = (b: Backup): ResumenBackup => ({
  plantas: b.plantas.length,
  entradas: b.diario.length,
  fotos: b.fotos.length,
  exportado: b.exportado,
  zona: b.zona,
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
  await db.vaciarTodo()

  for (const u of b.ubicaciones) await db.guardarUbicacion(u)
  for (const p of b.plantas) await db.guardarPlanta(p)
  for (const e of b.diario) await db.guardarEntrada(e)
  for (const f of b.fotos) {
    await db.guardarFoto({
      id: f.id,
      blob: await desdeDataURL(f.datos),
      tipo: f.tipo,
      ancho: f.ancho,
      alto: f.alto,
      creada: f.creada,
    })
  }
  if (b.zona) elegirZona(b.zona)
}

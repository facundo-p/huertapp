import { VERSION } from '../version'

/**
 * Registro de arranques, para diagnosticar la pérdida de datos que no se puede
 * reproducir.
 *
 * Vive en **localStorage y no en IndexedDB** a propósito: es lo único que puede
 * sobrevivir a que IndexedDB se vacíe, que es justo lo que estamos tratando de
 * entender. Anotar en la base que se borra no serviría de nada.
 *
 * Nunca tira: si falla, se pierde un apunte y la app sigue. Un registro de
 * diagnóstico que rompe el arranque es peor que no tenerlo.
 */

export type Evento =
  | 'arranque'
  | 'reparacion'
  | 'error-lectura'
  | 'error-escritura'
  | 'import'
  | 'vaciado'

export interface Apunte {
  /** ISO con hora: sin la hora no se puede cruzar con lo que hizo la persona */
  fecha: string
  version: string
  evento: Evento
  /** versión de la base al abrirla; si subió sola, alguien la recreó */
  baseVersion?: number
  /**
   * Los object stores que FALTAN. Se anotan los que faltan y no los que están:
   * la lista completa son tres renglones por apunte que dicen "todo bien", y
   * tapan la línea rara que el registro existe para encontrar.
   */
  faltan?: string[]
  plantas?: number
  persistente?: boolean | null
  /** el `name` del DOMException — es el dato que faltó en el incidente de 1.1.0 */
  error?: string
  detalle?: string
}

export const CLAVE = 'huerta-bitacora'
const TOPE = 50

/**
 * El `name` del error, que es el dato que sirve: distingue una cuota llena
 * (`QuotaExceededError`) de una base rota (`NotFoundError`). El mensaje cambia
 * entre navegadores y no se puede comparar contra nada.
 */
export function nombreError(e: unknown): string {
  if (e instanceof Error && e.name) return e.name
  if (typeof e === 'string' && e) return e
  return 'ErrorDesconocido'
}

/** Agrega y recorta: los que se caen son los más viejos. */
export function agregar(previos: Apunte[], nuevo: Apunte, tope = TOPE): Apunte[] {
  return [...previos, nuevo].slice(-tope)
}

const esApunte = (x: unknown): x is Apunte =>
  !!x &&
  typeof x === 'object' &&
  typeof (x as Apunte).fecha === 'string' &&
  typeof (x as Apunte).evento === 'string'

export function parsear(crudo: string | null): Apunte[] {
  if (!crudo) return []
  try {
    const dato: unknown = JSON.parse(crudo)
    return Array.isArray(dato) ? dato.filter(esApunte) : []
  } catch {
    return []
  }
}

/** Una línea por apunte, para copiar y mandar por mensaje. */
export function comoTexto(apuntes: Apunte[]): string {
  if (!apuntes.length) return 'Sin apuntes todavía.'
  return apuntes
    .map((a) => {
      const partes = [a.fecha.replace('T', ' ').slice(0, 16), `v${a.version}`, a.evento]
      if (a.baseVersion !== undefined) partes.push(`base v${a.baseVersion}`)
      if (a.faltan?.length) partes.push(`faltan: ${a.faltan.join(',')}`)
      if (a.plantas !== undefined) partes.push(`${a.plantas} plantas`)
      if (a.persistente !== undefined) {
        partes.push(a.persistente ? 'protegido' : 'sin proteger')
      }
      if (a.error) partes.push(`ERROR ${a.error}`)
      if (a.detalle) partes.push(a.detalle)
      return partes.join(' · ')
    })
    .join('\n')
}

// ── Lo que toca el navegador ─────────────────────────────────────────────────

/** localStorage tira en Safari con el almacenamiento bloqueado. */
function leerCrudo(): string | null {
  try {
    return localStorage.getItem(CLAVE)
  } catch {
    return null
  }
}

export const leer = (): Apunte[] => parsear(leerCrudo())

export function anotar(evento: Evento, datos: Omit<Apunte, 'fecha' | 'version' | 'evento'> = {}) {
  try {
    const nuevo: Apunte = {
      fecha: new Date().toISOString(),
      version: VERSION,
      evento,
      ...datos,
    }
    localStorage.setItem(CLAVE, JSON.stringify(agregar(leer(), nuevo)))
  } catch {
    // sin registro se sigue igual; no vale romper el arranque por un apunte
  }
}

export function borrar() {
  try {
    localStorage.removeItem(CLAVE)
  } catch {
    // ídem
  }
}

// Lo que el usuario carga: su huerta. Todo vive en IndexedDB, en el aparato,
// sin cuenta ni servidor. Por eso el backup es parte del producto, no un extra.
import type { Metodo } from '../data/types'

/** Etapas del ciclo, en orden. La barrita de progreso las recorre. */
export const ETAPAS = ['almacigo', 'trasplantada', 'creciendo', 'cosechando', 'terminada'] as const
export type Etapa = (typeof ETAPAS)[number]

export const ETAPA_INFO: Record<Etapa, { etiqueta: string; verbo: string }> = {
  almacigo: { etiqueta: 'En almácigo', verbo: 'Sembrada en almácigo' },
  trasplantada: { etiqueta: 'Trasplantada', verbo: 'Trasplantada' },
  creciendo: { etiqueta: 'Creciendo', verbo: 'Creciendo' },
  cosechando: { etiqueta: 'Cosechando', verbo: 'Empezó a dar' },
  terminada: { etiqueta: 'Terminada', verbo: 'Terminó su ciclo' },
}

/** 'bancal' es legado: los datos viejos lo traen; el alta ofrece los dos específicos. */
export type TipoUbicacion = 'maceta' | 'bancal' | 'bancal_elevado' | 'bancal_tierra' | 'almacigo' | 'otro'
export type LuzUbicacion = 'pleno_sol' | 'media_sombra' | 'sombra'
export type ProteccionUbicacion = 'expuesta' | 'resguardada' | 'invernadero'

/** Todo en centímetros; el volumen en litros. Qué campo aplica lo decide el tipo. */
export interface MedidasUbicacion {
  ancho?: number
  largo?: number
  profundidad?: number
  volumen?: number
}

// Los campos nuevos son opcionales a propósito: el backup viejo los tolera sin
// bump de versión, y "sin dato" es un estado válido, no un error.
export interface Ubicacion {
  id: string
  nombre: string
  tipo: TipoUbicacion
  creada: string
  luz?: LuzUbicacion
  proteccion?: ProteccionUbicacion
  medidas?: MedidasUbicacion
  notas?: string
}

export interface Planta {
  id: string
  /** slug de la especie en el catálogo */
  slug: string
  apodo?: string
  /**
   * La variedad, cuando no cambia el cultivo y por eso no tiene entrada propia
   * (la albahaca morada). Texto libre: es dato tuyo, no del catálogo. Las que
   * sí cambian el cultivo son una especie más y viajan en `slug`.
   */
  variedad?: string
  ubicacionId?: string
  /** fecha de siembra o plantación, ISO corta (yyyy-mm-dd) */
  sembrada: string
  /** cómo la sembró: define si arranca en almácigo o directa */
  metodo: Metodo | null
  etapa: Etapa
  /** fecha del último cambio de etapa, para estimar lo que sigue */
  etapaDesde: string
  /** fecha en que el usuario confirmó que germinó (ISO corta) */
  germino?: string
  /** cuántas hay ahora, a ojo. Nunca obligatorio; se muestra como "~8" */
  cantidad?: number
  /** raíz de la siembra de la que se separó esta tarjeta. Sin él, esta tarjeta ES la siembra */
  origenId?: string
  notas?: string
  creada: string
  archivada?: boolean
}

export type TipoEntrada = 'nota' | 'riego' | 'plaga' | 'cosecha' | 'trasplante' | 'floracion'

export const TIPOS_ENTRADA: Record<TipoEntrada, { etiqueta: string; color: string }> = {
  nota: { etiqueta: 'Nota', color: 'var(--tinta-media)' },
  riego: { etiqueta: 'Riego', color: 'var(--suelo-humedo)' },
  plaga: { etiqueta: 'Plaga', color: 'var(--frambuesa)' },
  cosecha: { etiqueta: 'Cosecha', color: 'var(--verde-hoja)' },
  trasplante: { etiqueta: 'Trasplante', color: 'var(--terracota)' },
  floracion: { etiqueta: 'Floración', color: 'var(--sol)' },
}

export interface EntradaDiario {
  id: string
  plantaId: string
  /** ISO corta (yyyy-mm-dd) */
  fecha: string
  tipo: TipoEntrada
  texto?: string
  fotoIds: string[]
  creada: string
}

export interface Foto {
  id: string
  blob: Blob
  tipo: string
  ancho: number
  alto: number
  creada: string
}

/** Genera un id único. `randomUUID` no existe en contextos no seguros. */
export function nuevoId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

/** Fecha de hoy en ISO corta, en hora local (no UTC: importa el día del usuario). */
export function hoyISO(fecha = new Date()): string {
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${fecha.getFullYear()}-${mes}-${dia}`
}

/** Parsea una ISO corta como fecha local (new Date('2026-08-15') sería UTC). */
export function desdeISO(iso: string): Date {
  const [a, m, d] = iso.split('-').map(Number)
  return new Date(a, m - 1, d)
}

export function diasEntre(desde: string, hasta: string): number {
  const ms = desdeISO(hasta).getTime() - desdeISO(desde).getTime()
  return Math.round(ms / 86400000)
}

/**
 * Qué está desplegado y qué está plegado en Mi huerta.
 *
 * Vive en `localStorage` y **no** en el store de IndexedDB a propósito: es una
 * preferencia de cómo mirar la pantalla, no un dato de la huerta. Si fuera al
 * store se colaría en el backup, y restaurar un backup de otro celular no
 * tiene por qué venir a decidir qué tarjetas tenés abiertas.
 *
 * Las ubicaciones se guardan por lo que está **cerrado** y las plantas por lo
 * que está **abierto**, porque cada una arranca al revés: una ubicación nueva
 * se ve entera —para eso agrupamos— y una planta nueva se ve plegada, que es
 * lo que hace que la lista entre en una pantalla.
 */

const CLAVE = 'huerta-plegado'

export interface Plegado {
  ubicacionesCerradas: string[]
  plantasAbiertas: string[]
}

const VACIO: Plegado = { ubicacionesCerradas: [], plantasAbiertas: [] }

function esLista(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === 'string')
}

export function leerPlegado(): Plegado {
  try {
    // localStorage tira en Safari con almacenamiento bloqueado, y esto es una
    // comodidad: que falle no puede tumbar la pantalla
    const crudo = localStorage.getItem(CLAVE)
    if (!crudo) return VACIO
    const v: unknown = JSON.parse(crudo)
    if (typeof v !== 'object' || v === null) return VACIO
    const { ubicacionesCerradas, plantasAbiertas } = v as Record<string, unknown>
    return {
      ubicacionesCerradas: esLista(ubicacionesCerradas) ? ubicacionesCerradas : [],
      plantasAbiertas: esLista(plantasAbiertas) ? plantasAbiertas : [],
    }
  } catch {
    return VACIO
  }
}

export function guardarPlegado(p: Plegado): void {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(p))
  } catch {
    // sin persistencia se sigue funcionando: el estado vive en memoria
  }
}

function alternarEn(lista: string[], id: string): string[] {
  return lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id]
}

export function alternarUbicacion(p: Plegado, id: string): Plegado {
  return { ...p, ubicacionesCerradas: alternarEn(p.ubicacionesCerradas, id) }
}

export function alternarPlanta(p: Plegado, id: string): Plegado {
  return { ...p, plantasAbiertas: alternarEn(p.plantasAbiertas, id) }
}

/**
 * Saca los ids de plantas y ubicaciones que ya no existen. Sin esto la lista
 * crece para siempre con lo que se fue borrando, igual que pasaba con las
 * tareas completadas.
 */
export function podarPlegado(p: Plegado, ubicaciones: Set<string>, plantas: Set<string>): Plegado {
  return {
    ubicacionesCerradas: p.ubicacionesCerradas.filter((id) => id === '' || ubicaciones.has(id)),
    plantasAbiertas: p.plantasAbiertas.filter((id) => plantas.has(id)),
  }
}

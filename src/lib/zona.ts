import { useSyncExternalStore } from 'react'
import type { Zona } from './data/types'

// Dónde está la huerta. Cambia el calendario entero, porque entre el
// Observatorio y La Plata hay 35 días de diferencia en la última helada.
// Vive en localStorage por ahora; en la Fase 4 pasa al store de ajustes de
// IndexedDB junto con el resto, y entra al backup.

const CLAVE = 'huerta-gba:zona'
export const ZONA_DEFAULT: Zona = 'conurbano'

export const ZONAS_INFO: Record<Zona, { etiqueta: string; detalle: string; helada: string }> = {
  urbano: {
    etiqueta: 'Núcleo urbano',
    detalle: 'CABA y alrededores, con isla de calor',
    helada: 'última helada ~6 de septiembre',
  },
  conurbano: {
    etiqueta: 'Conurbano',
    detalle: 'Ezeiza, San Martín, Quilmes, Morón…',
    helada: 'última helada ~5 de octubre',
  },
  periurbano: {
    etiqueta: 'Periurbano o rural',
    detalle: 'La Plata, Cañuelas, Luján: campo abierto',
    helada: 'última helada ~11 de octubre',
  },
}

function esZona(v: string | null): v is Zona {
  return v === 'urbano' || v === 'conurbano' || v === 'periurbano'
}

function leer(): Zona {
  try {
    const v = localStorage.getItem(CLAVE)
    return esZona(v) ? v : ZONA_DEFAULT
  } catch {
    return ZONA_DEFAULT // modo privado o storage bloqueado
  }
}

let actual: Zona = leer()
const oyentes = new Set<() => void>()

export function zonaActual(): Zona {
  return actual
}

export function elegirZona(z: Zona) {
  if (z === actual) return
  actual = z
  try {
    localStorage.setItem(CLAVE, z)
  } catch {
    /* no se puede persistir: la sesión igual funciona */
  }
  for (const f of oyentes) f()
}

function suscribir(f: () => void) {
  oyentes.add(f)
  return () => oyentes.delete(f)
}

export function useZona(): Zona {
  return useSyncExternalStore(suscribir, zonaActual, () => ZONA_DEFAULT)
}

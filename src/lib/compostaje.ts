import { useEffect, useState } from 'react'

/**
 * La guía de compostaje: `data/compostaje.json` tipado, cargado diferido como
 * el catálogo, y la composición de un capítulo a partir de sus dos parámetros
 * (material × sistema). El molde es uno solo; los textos varían con los dos.
 */

export interface Bloque {
  valor: string | null
  fuentes: string[]
  confianza: number | null
}
export interface Lista {
  items: string[]
  fuentes: string[]
  confianza: number | null
}
export interface Exclusion {
  que: string
  porque: string
  fuentes: string[]
  confianza: number
}
export interface Senal {
  bien: string
  sintoma: string
  correccion: string
  fuentes: string[]
  confianza: number
}
export interface Prueba {
  que: string
  como: string
  fuentes: string[]
  confianza: number
}
export interface Estado {
  clave: 'llenando' | 'cocinando' | 'madurando'
  nombre: string
  duracion: Bloque
  que_hacer: Bloque
}
/** Un ritmo de giro con la situación en que corresponde; `dias` null = sin ritmo fijo */
export interface Ritmo {
  clave: string
  cuando: string
  dias: number | null
  porque: string
  fuentes: string[]
  confianza: number
}
/** Un plazo: el texto y los días que usa «mi compostera» para avisar */
export interface Plazo extends Bloque {
  dias: number | null
}
export interface Fuente {
  organizacion: string
  /** para el chip: «Provincia (OPDS)» y no el organismo entero */
  corto: string
  titulo: string
  url: string
  anio: number | null
  nota?: string
}
export interface Sistema {
  nombre: string
  descripcion: Bloque
  volumen: Bloque
  estados: Estado[]
  girar: { cuando: Bloque; por_que: Bloque; sin_girar: Bloque; sin_girar_tiempo: Bloque }
  /** desde que dejó de recibir restos hasta que vale revisar si está */
  listo_desde: Plazo
}
export interface QuePoner {
  verdes: Lista
  secos: Lista
  poco: Exclusion[]
  nunca: Exclusion[]
}

export type Material = 'cocina' | 'jardin'
export type SistemaClave = 'tachos' | 'suelo'

export interface Guia {
  meta: { titulo: string; descripcion: string; fecha_investigacion: string; fuentes: Record<string, Fuente> }
  receta: {
    proporcion: Bloque
    proporcion_detalle: Bloque
    humedad: Bloque
    humedad_detalle: Bloque
    aire: Bloque
    tamano: Bloque
  }
  materiales: Record<Material, { nombre: string; descripcion: string }>
  sistemas: Record<SistemaClave, Sistema>
  por_material: Record<Material, QuePoner>
  comun: {
    ritmos: Ritmo[]
    con_lombrices: Bloque
    senales: Senal[]
    listo: { senales: Lista; pruebas: Prueba[]; prueba_germinacion: Bloque; nota: Bloque }
    lixiviado: Bloque
  }
}

/** Las cuatro rutas de capítulo: `/compost/cocina-tachos`, etc. */
export const CAPITULOS: Record<string, [Material, SistemaClave]> = {
  'cocina-tachos': ['cocina', 'tachos'],
  'cocina-suelo': ['cocina', 'suelo'],
  'jardin-tachos': ['jardin', 'tachos'],
  'jardin-suelo': ['jardin', 'suelo'],
}

export const clave = (m: Material, s: SistemaClave) => `${m}-${s}`

let cache: Promise<Guia> | null = null

export function cargarCompostaje(): Promise<Guia> {
  cache ??= import('../../data/compostaje.json').then((m) => m.default as unknown as Guia)
  return cache
}

export function useCompostaje(): Guia | null {
  const [guia, setGuia] = useState<Guia | null>(null)
  useEffect(() => {
    let vivo = true
    cargarCompostaje().then((g) => {
      if (vivo) setGuia(g)
    })
    return () => {
      vivo = false
    }
  }, [])
  return guia
}

import type { ComponentType } from 'react'
import type { CategoriaLuz, CategoriaSuelo, Grupo } from '../lib/data/types'
import type { IconProps } from './base'
import { IconoAromatica, IconoFlor, IconoFruto, IconoHoja, IconoLegumbre, IconoRaiz } from './grupos'
import {
  IconoSueloArenoso,
  IconoSueloFertil,
  IconoSueloHumedo,
  IconoSueloProfundo,
  IconoSueloRustico,
} from './suelos'
import { IconoLuzMedia, IconoLuzParcial, IconoLuzPleno, IconoLuzSombra } from './luz'
import { IconoTempCalida, IconoTempFria, IconoTempTemplada } from './temperatura'
import { CORTES_BANDA, type BandaTemp } from '../lib/data/especies'

// Mapas semánticos: código de categoría → ícono + etiqueta + color del sistema.
// Regla de uso (BRIEF §4): en listas/chips va el ícono solo, SIEMPRE con aria-label.

interface Info {
  Icono: ComponentType<IconProps>
  etiqueta: string
  color: string
}

export const GRUPOS: Record<Grupo, Info> = {
  'Hortaliza de hoja': { Icono: IconoHoja, etiqueta: 'Hortaliza de hoja', color: 'var(--verde-hoja)' },
  'Hortaliza de raíz/bulbo': { Icono: IconoRaiz, etiqueta: 'Hortaliza de raíz o bulbo', color: 'var(--terracota)' },
  'Hortaliza de fruto': { Icono: IconoFruto, etiqueta: 'Hortaliza de fruto', color: 'var(--frambuesa)' },
  Legumbre: { Icono: IconoLegumbre, etiqueta: 'Legumbre', color: 'var(--oliva)' },
  Aromática: { Icono: IconoAromatica, etiqueta: 'Aromática', color: 'var(--salvia)' },
  'Flor polinizadora': { Icono: IconoFlor, etiqueta: 'Flor polinizadora', color: 'var(--sol)' },
}

export const SUELOS: Record<CategoriaSuelo, Info> = {
  ARENOSO_DRENANTE: { Icono: IconoSueloArenoso, etiqueta: 'Suelo arenoso y drenante', color: 'var(--suelo-arenoso)' },
  FRANCO_FERTIL: { Icono: IconoSueloFertil, etiqueta: 'Suelo franco fértil', color: 'var(--suelo-franco)' },
  HUMEDO_RICO: { Icono: IconoSueloHumedo, etiqueta: 'Suelo húmedo y rico', color: 'var(--suelo-humedo)' },
  PROFUNDO_SUELTO: { Icono: IconoSueloProfundo, etiqueta: 'Suelo profundo y suelto', color: 'var(--suelo-profundo)' },
  RUSTICO_TOLERANTE: { Icono: IconoSueloRustico, etiqueta: 'Suelo rústico: tolera suelos pobres', color: 'var(--suelo-rustico)' },
}

export const LUCES: Record<CategoriaLuz, Info> = {
  PLENO_SOL: { Icono: IconoLuzPleno, etiqueta: 'Pleno sol: 6 o más horas de sol directo', color: 'var(--luz-pleno)' },
  SOL_PARCIAL: { Icono: IconoLuzParcial, etiqueta: 'Sol parcial: 4 a 6 horas de sol directo', color: 'var(--luz-parcial)' },
  MEDIA_SOMBRA: { Icono: IconoLuzMedia, etiqueta: 'Media sombra: 2 a 4 horas de sol directo', color: 'var(--luz-media)' },
  TOLERA_SOMBRA: { Icono: IconoLuzSombra, etiqueta: 'Tolera sombra: crece con luz indirecta', color: 'var(--luz-sombra)' },
}

// Las etiquetas dicen el criterio con su número: la banda no es un juicio
// agronómico nuevo, es el ideal_min investigado puesto en tres cajones.
const g = CORTES_BANDA.germinacion
export const BANDAS_GERMINACION: Record<BandaTemp, Info> = {
  frio: { Icono: IconoTempFria, etiqueta: `Germina fresco: su ideal arranca en ${g.frio} °C o menos`, color: 'var(--temp-frio)' },
  templado: { Icono: IconoTempTemplada, etiqueta: `Germina templado: su ideal arranca entre ${g.frio + 1} y ${g.calor - 1} °C`, color: 'var(--temp-templado)' },
  calor: { Icono: IconoTempCalida, etiqueta: `Necesita calor para germinar: su ideal arranca en ${g.calor} °C o más`, color: 'var(--temp-calor)' },
}

const c = CORTES_BANDA.crecimiento
export const BANDAS_CRECIMIENTO: Record<BandaTemp, Info> = {
  frio: { Icono: IconoTempFria, etiqueta: `Crece con fresco: su ideal arranca en ${c.frio} °C o menos`, color: 'var(--temp-frio)' },
  templado: { Icono: IconoTempTemplada, etiqueta: `Crece templado: su ideal arranca entre ${c.frio + 1} y ${c.calor - 1} °C`, color: 'var(--temp-templado)' },
  calor: { Icono: IconoTempCalida, etiqueta: `Necesita calor para crecer: su ideal arranca en ${c.calor} °C o más`, color: 'var(--temp-calor)' },
}

interface SemanticProps extends IconProps {
  /** Si es true, el ícono es decorativo (el texto está al lado). */
  decorativo?: boolean
}

export function IconoGrupo({ grupo, decorativo, ...p }: { grupo: Grupo } & SemanticProps) {
  const { Icono, etiqueta, color } = GRUPOS[grupo]
  return <Icono style={{ color }} title={decorativo ? undefined : etiqueta} {...p} />
}

export function IconoSuelo({ categoria, decorativo, ...p }: { categoria: CategoriaSuelo } & SemanticProps) {
  const { Icono, etiqueta, color } = SUELOS[categoria]
  return <Icono style={{ color }} title={decorativo ? undefined : etiqueta} {...p} />
}

export function IconoLuz({ categoria, decorativo, ...p }: { categoria: CategoriaLuz } & SemanticProps) {
  const { Icono, etiqueta, color } = LUCES[categoria]
  return <Icono style={{ color }} title={decorativo ? undefined : etiqueta} {...p} />
}

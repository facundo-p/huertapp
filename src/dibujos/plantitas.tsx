import type { ReactNode } from 'react'
import type { Grupo } from '../lib/data/types'
import type { EtapaDibujo } from '../lib/huerta/croquis'
import { Dibujo, type DibujoProps } from './base'

/**
 * Las plantitas del croquis: una por familia de forma y por etapa. Dibujadas
 * en 32 y escaladas a la grilla de 96, con el trazo de siempre en pantalla.
 * La etapa también la dice el nombre accesible de la celda.
 */

export type FormaPlantita = 'hoja' | 'fruto' | 'raiz' | 'legumbre' | 'aromatica' | 'flor'

export const FORMA_DE_GRUPO: Record<Grupo, FormaPlantita> = {
  'Hortaliza de hoja': 'hoja',
  'Hortaliza de raíz/bulbo': 'raiz',
  'Hortaliza de fruto': 'fruto',
  Legumbre: 'legumbre',
  Aromática: 'aromatica',
  'Flor polinizadora': 'flor',
}

const suelo = <path className="suelo" d="M6 28 H26" />

/** Un par de hojas simétricas que nacen del tallo en (16, y). */
function par(y: number, ancho: number, alto: number) {
  const l = 16 - ancho
  const r = 16 + ancho
  const t = y - alto
  return (
    <>
      <path
        className="h"
        d={`M16 ${y} C${16 - ancho * 0.55} ${y} ${l} ${y - alto * 0.45} ${l} ${t} C${l + ancho * 0.6} ${t} 16 ${y - alto * 0.5} 16 ${y} Z`}
      />
      <path
        className="h"
        d={`M16 ${y} C${16 + ancho * 0.55} ${y} ${r} ${y - alto * 0.45} ${r} ${t} C${r - ancho * 0.6} ${t} 16 ${y - alto * 0.5} 16 ${y} Z`}
      />
    </>
  )
}

const petalos = [0, 45, 90, 135, 180, 225, 270, 315].map((a) => (
  <path
    key={a}
    className="petalo"
    d="M16 6.4 C 14.9 5.3, 14.9 3.2, 16 2 C 17.1 3.2, 17.1 5.3, 16 6.4 Z"
    transform={`rotate(${a} 16 8.8)`}
  />
))

const SEMILLA = (
  <>
    <g className="espera">
      <path d="M16 22 V14.5" />
      <path d="M16 15.5 C13.4 15.5 11.4 13.8 11 11 C13.8 11 15.6 12.8 16 15.5 Z" />
      <path d="M16 15.5 C18.6 15.5 20.6 13.8 21 11 C18.2 11 16.4 12.8 16 15.5 Z" />
    </g>
    <path className="suelo" d="M5 24 H27" />
    <ellipse className="semilla" cx="16" cy="27.6" rx="3" ry="2" />
  </>
)

const tomatera = (
  <>
    <path className="suelo" d="M23.5 28 V5" />
    <path d="M16 28 C16 21 15.5 14 16 7" />
    <path className="h" d="M16 23 C13 23 10.3 21.4 9.4 18.2 C12.6 18.2 15 20 16 23 Z" />
    <path className="h" d="M16 17.5 C18.6 17.5 20.4 16 21 13.2 C18.3 13.2 16.6 14.8 16 17.5 Z" />
    <path className="h" d="M16 12.5 C13.6 12.5 11.6 11 11 8.5 C13.6 8.5 15.4 10 16 12.5 Z" />
    <path className="suelo" d="M16 15 L23.5 14" />
  </>
)

const enredadera = (
  <>
    <path className="suelo" d="M23 28 V4.5" />
    <path d="M15 28 C15 23 21 22 21 17.5 C21 13 15.5 12.5 16.5 8 C17 6 19.5 5.5 21 6.5" />
    <path className="h" d="M18.4 22.4 C15.4 23.4 12.4 22.4 11.4 19.9 C14.4 19.1 17.1 20.1 18.4 22.4 Z" />
    <path className="h" d="M17.8 13.4 C14.8 14 12 12.8 11.2 10.2 C14.2 9.7 16.8 11 17.8 13.4 Z" />
  </>
)

const florHojas = (
  <>
    <path className="h" d="M16 24 C12.8 24.2 10 22.6 9.2 19.8 C12.4 19.2 15.2 21 16 24 Z" />
    <path className="h" d="M16 19.5 C19.2 19.7 22 18.1 22.8 15.3 C19.6 14.7 16.8 16.5 16 19.5 Z" />
  </>
)

const PLANTITAS: Record<FormaPlantita, Record<Exclude<EtapaDibujo, 'semilla'>, ReactNode>> = {
  hoja: {
    brote: (
      <>
        <path d="M16 28 V20" />
        {par(20, 7.5, 7.5)}
        {suelo}
      </>
    ),
    creciendo: (
      <>
        <path className="h" d="M16 27 C9.5 27 5.5 22.5 5.5 16.5 C11.5 16.5 15.5 21 16 27 Z" />
        <path className="h" d="M16 27 C22.5 27 26.5 22.5 26.5 16.5 C20.5 16.5 16.5 21 16 27 Z" />
        <path className="h" d="M16 27 C12.5 22.5 12.5 15 16 10 C19.5 15 19.5 22.5 16 27 Z" />
        <path className="suelo" d="M4 28 H28" />
      </>
    ),
    dando: (
      <>
        <path className="h" d="M16 27.5 C10 28.5 4 27 2.5 23 C8 21.5 13 23.5 16 27.5 Z" />
        <path className="h" d="M16 27.5 C22 28.5 28 27 29.5 23 C24 21.5 19 23.5 16 27.5 Z" />
        <path className="h" d="M16 27 C9.5 27 6 21.5 6.5 14.5 C12 15 15.5 20.5 16 27 Z" />
        <path className="h" d="M16 27 C22.5 27 26 21.5 25.5 14.5 C20 15 16.5 20.5 16 27 Z" />
        <path className="h" d="M16 27 C12.3 22 12.3 13 16 7.5 C19.7 13 19.7 22 16 27 Z" />
        <path d="M16 24 V12" />
        <path className="suelo" d="M3 28 H29" />
      </>
    ),
  },
  fruto: {
    brote: (
      <>
        <path d="M16 28 V18.5" />
        {par(18.5, 7.5, 5.8)}
        {suelo}
      </>
    ),
    creciendo: (
      <>
        {tomatera}
        {suelo}
      </>
    ),
    dando: (
      <>
        {tomatera}
        <circle className="fruto" cx="11.2" cy="22.8" r="3.2" />
        <circle className="fruto" cx="19.6" cy="21" r="2.7" />
        {suelo}
      </>
    ),
  },
  raiz: {
    brote: (
      <>
        <path d="M16 28 V20" />
        <path d="M16 21 C14 19 12.8 15.8 13.2 12" />
        <path d="M16 21 C18 19 19.2 15.8 18.8 12" />
        <path d="M16 20 V12.5" />
        {suelo}
      </>
    ),
    creciendo: (
      <>
        <path d="M16 28 C15 22 12.5 17 8.5 13" />
        <path d="M16 28 V8.5" />
        <path d="M16 28 C17 22 19.5 17 23.5 13" />
        <path d="M12.2 18.2 L9.8 18.8" />
        <path d="M13.9 21 L11.4 21.8" />
        <path d="M16 13.6 L13.8 12.4" />
        <path d="M16 17.8 L18.2 16.6" />
        <path d="M19.8 18.2 L22.2 18.8" />
        <path d="M18.1 21 L20.6 21.8" />
        {suelo}
      </>
    ),
    dando: (
      <>
        <path d="M16 26 C15 21 12.5 16 8.5 12" />
        <path d="M16 26 V7.5" />
        <path d="M16 26 C17 21 19.5 16 23.5 12" />
        <path d="M12.2 17.2 L9.8 17.8" />
        <path d="M13.9 20 L11.4 20.8" />
        <path d="M16 12.6 L13.8 11.4" />
        <path d="M16 16.8 L18.2 15.6" />
        <path d="M19.8 17.2 L22.2 17.8" />
        <path d="M18.1 20 L20.6 20.8" />
        <path className="raiz" d="M12.4 28 C12.4 25.2 19.6 25.2 19.6 28 Z" />
        {suelo}
      </>
    ),
  },
  legumbre: {
    brote: (
      <>
        <path d="M16 28 V20.5 C16 18.4 14.6 17 12.8 17.4" />
        <path className="h" d="M16 22.5 C19 23 21.3 21.4 21.6 18.8 C18.8 18.6 16.7 20 16 22.5 Z" />
        <path className="h" d="M12.8 17.4 C10.6 17.8 9 16.6 8.8 14.6 C11 14.3 12.6 15.4 12.8 17.4 Z" />
        {suelo}
      </>
    ),
    creciendo: (
      <>
        {enredadera}
        {suelo}
      </>
    ),
    dando: (
      <>
        {enredadera}
        <path className="vaina" d="M20.6 17.8 C22.8 20 23.6 23.2 22.6 26 C20.8 24 20 21 20.6 17.8 Z" />
        {suelo}
      </>
    ),
  },
  aromatica: {
    brote: (
      <>
        <path d="M16 28 V20" />
        {par(20, 6.5, 6.5)}
        {suelo}
      </>
    ),
    creciendo: (
      <>
        <path d="M16 28 V7.5" />
        {par(24, 6, 5.2)}
        {par(17, 5, 4.4)}
        {par(10.5, 3, 2.8)}
        {suelo}
      </>
    ),
    dando: (
      <>
        <path d="M16 28 V4.5" />
        {par(24, 6, 5.2)}
        {par(17, 5, 4.4)}
        <circle className="florcita" cx="16" cy="4.2" r="1.2" />
        <circle className="florcita" cx="14.4" cy="7" r="1.1" />
        <circle className="florcita" cx="17.6" cy="7" r="1.1" />
        <circle className="florcita" cx="14.6" cy="10" r="1.1" />
        <circle className="florcita" cx="17.4" cy="10" r="1.1" />
        {suelo}
      </>
    ),
  },
  flor: {
    brote: (
      <>
        <path d="M16 28 V20.5" />
        {par(21, 8.5, 5.5)}
        {suelo}
      </>
    ),
    creciendo: (
      <>
        <path d="M16 28 V10" />
        {florHojas}
        <path className="capullo" d="M16 10.4 C13.6 10.4 13 7.4 16 4.2 C19 7.4 18.4 10.4 16 10.4 Z" />
        {suelo}
      </>
    ),
    dando: (
      <>
        <path d="M16 28 V12" />
        {florHojas}
        {petalos}
        <circle className="centro" cx="16" cy="8.8" r="2.3" />
        {suelo}
      </>
    ),
  },
}

export interface PlantitaProps extends DibujoProps {
  forma: FormaPlantita
  etapa: EtapaDibujo
}

export function Plantita({ forma, etapa, size = 32, className, ...rest }: PlantitaProps) {
  return (
    <Dibujo size={size} className={className ? `plantita ${className}` : 'plantita'} {...rest}>
      {/* dibujadas en 32: el grupo escala a 96 y lleva su propio trazo */}
      <g transform="scale(3)" strokeWidth={(1.75 * 32) / size}>
        {etapa === 'semilla' ? SEMILLA : PLANTITAS[forma][etapa]}
      </g>
    </Dibujo>
  )
}

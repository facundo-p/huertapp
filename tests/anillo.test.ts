import { describe, expect, it } from 'vitest'
import { anguloDeDecada, anguloDeMes, marcas, relleno } from '../src/lib/anillo'
import type { EstadoMes } from '../src/lib/data/especies'

const vacio: EstadoMes[] = Array.from({ length: 36 }, () => null)

describe('relleno', () => {
  it('parte el año en 36 tramos duros de 10 grados', () => {
    const g = relleno(vacio)
    expect(g.startsWith('conic-gradient(')).toBe(true)
    expect(g.match(/deg /g)?.length).toBe(36)
    expect(g).toContain('0deg 10deg')
    expect(g).toContain('350deg 360deg')
  })

  it('cada estado tiene su color y el vacío es configurable', () => {
    const d = [...vacio]
    d[0] = 'ideal'
    d[1] = 'posible'
    const g = relleno(d, 'var(--anillo-vacio-int)')
    expect(g).toContain('var(--verde-hoja) 0deg 10deg')
    expect(g).toContain('var(--sol) 10deg 20deg')
    expect(g).toContain('var(--anillo-vacio-int) 20deg 30deg')
  })
})

describe('marcas', () => {
  it('pone una barra de mes en cada múltiplo de 30 grados', () => {
    const g = marcas('MES', 'TERCIO')
    // 13 tramos para 12 barras: las 11 del medio, más las dos mitades en que
    // se parte la de 0° para cerrar el círculo
    expect(g.match(/MES /g)?.length).toBe(13)
    // y 24 hairlines de década (36 menos las 12 que ya son de mes)
    expect(g.match(/TERCIO /g)?.length).toBe(24)
  })

  it('cierra el círculo: la marca de 0 grados se parte en dos mitades', () => {
    const g = marcas('MES', 'TERCIO')
    expect(g).toContain('MES 0deg 0.9deg')
    expect(g).toContain('MES 359.1deg 360deg')
  })

  it('el factor de escala ensancha las barras', () => {
    expect(marcas('M', 'T', 1.5)).toContain('M 0deg 1.35deg')
  })

  it('en el anillo chico los tercios van transparentes y no se empastan', () => {
    const g = marcas('MES', 'transparent', 1.5)
    expect(g).not.toContain('TERCIO')
  })
})

describe('aguja de hoy', () => {
  it('apunta al centro de la década en curso, no al comienzo del año', () => {
    // el error fácil es 0°, que deja la aguja clavada en las 12 todo el año
    expect(anguloDeDecada(1)).toBe(5)
    expect(anguloDeDecada(2)).toBe(15)
    expect(anguloDeDecada(36)).toBe(355)
  })

  it('da la vuelta entera y nunca llega a 360', () => {
    for (let d = 1; d <= 36; d++) {
      expect(anguloDeDecada(d)).toBeGreaterThanOrEqual(0)
      expect(anguloDeDecada(d)).toBeLessThan(360)
    }
  })
})

describe('iniciales de mes', () => {
  it('cada letra queda centrada en su mes', () => {
    expect(anguloDeMes(1)).toBe(15)
    expect(anguloDeMes(12)).toBe(345)
  })

  it('la inicial cae dentro del mes que rotula', () => {
    for (let m = 1; m <= 12; m++) {
      const a = anguloDeMes(m)
      expect(a).toBeGreaterThan((m - 1) * 30)
      expect(a).toBeLessThan(m * 30)
    }
  })
})

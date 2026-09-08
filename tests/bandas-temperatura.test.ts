import { describe, expect, it } from 'vitest'
import { bandaCrecimiento, bandaGerminacion, CORTES_BANDA } from '../src/lib/data/especies'
import type { EspecieEnriquecida } from '../src/lib/data/types'
import db from '../data/huerta_gba_enriquecido.json'

const especies = db.especies as unknown as EspecieEnriquecida[]
const padres = especies.filter((e) => !e.variedad_de)
const de = (slug: string) => especies.find((e) => e.slug === slug)!

/** Especie de mentira con solo el ideal_min que se quiere probar. */
const conIdeal = (germ: number | null, crec: number | null): EspecieEnriquecida =>
  ({
    temperaturas: {
      germinacion: { ideal_min: germ },
      crecimiento: { ideal_min: crec },
    },
  }) as unknown as EspecieEnriquecida

describe('bandas de temperatura', () => {
  it('clasifica por el ideal_min investigado: el umbral para estar a gusto', () => {
    expect(bandaGerminacion(de('lechuga'))).toBe('frio') // ideal 15-20
    expect(bandaGerminacion(de('tomate'))).toBe('templado') // ideal 18-27
    expect(bandaGerminacion(de('pimiento'))).toBe('calor') // ideal 20-30
    expect(bandaCrecimiento(de('lechuga'))).toBe('frio') // ideal 13-18
    expect(bandaCrecimiento(de('zanahoria'))).toBe('templado') // ideal 15-20
    expect(bandaCrecimiento(de('tomate'))).toBe('calor') // ideal 18-25
  })

  it('los cortes son inclusivos en los extremos', () => {
    const g = CORTES_BANDA.germinacion
    expect(bandaGerminacion(conIdeal(g.frio, null))).toBe('frio')
    expect(bandaGerminacion(conIdeal(g.frio + 1, null))).toBe('templado')
    expect(bandaGerminacion(conIdeal(g.calor - 1, null))).toBe('templado')
    expect(bandaGerminacion(conIdeal(g.calor, null))).toBe('calor')

    const c = CORTES_BANDA.crecimiento
    expect(bandaCrecimiento(conIdeal(null, c.frio))).toBe('frio')
    expect(bandaCrecimiento(conIdeal(null, c.frio + 1))).toBe('templado')
    expect(bandaCrecimiento(conIdeal(null, c.calor - 1))).toBe('templado')
    expect(bandaCrecimiento(conIdeal(null, c.calor))).toBe('calor')
  })

  it('sin dato no hay banda: la especie no se clasifica', () => {
    expect(bandaGerminacion(de('melisa'))).toBeNull()
    expect(bandaGerminacion(de('laurel'))).toBeNull()
    expect(bandaCrecimiento(de('melisa'))).toBeNull()
  })

  it('las tres bandas tienen especies: los cortes salen de la distribución real', () => {
    for (const banda of ['frio', 'templado', 'calor'] as const) {
      expect(padres.filter((e) => bandaGerminacion(e) === banda).length, `germinación/${banda}`).toBeGreaterThan(5)
      expect(padres.filter((e) => bandaCrecimiento(e) === banda).length, `crecimiento/${banda}`).toBeGreaterThan(5)
    }
  })

  it('una variedad hereda la banda de su especie', () => {
    for (const v of especies.filter((e) => e.variedad_de)) {
      const padre = de(v.variedad_de!)
      expect(bandaGerminacion(v), v.slug).toBe(bandaGerminacion(padre))
      expect(bandaCrecimiento(v), v.slug).toBe(bandaCrecimiento(padre))
    }
  })
})

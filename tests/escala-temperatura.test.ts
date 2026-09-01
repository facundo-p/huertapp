import { describe, expect, it } from 'vitest'
import {
  modeloEscala,
  rotuloEscala,
  textoSinIdeal,
  type ValoresEscala,
} from '../src/lib/escalaTemperatura'
import type { EspecieEnriquecida } from '../src/lib/data/types'
import db from '../data/huerta_gba_enriquecido.json'

const especies = db.especies as unknown as EspecieEnriquecida[]
const de = (slug: string) => especies.find((e) => e.slug === slug)!

const germ = (slug: string): ValoresEscala => {
  const g = de(slug).temperaturas.germinacion
  return { min: g.min, idealMin: g.ideal_min, idealMax: g.ideal_max, max: g.max }
}
const crec = (slug: string): ValoresEscala => {
  const c = de(slug).temperaturas.crecimiento
  return { min: c.tolera_min, idealMin: c.ideal_min, idealMax: c.ideal_max, max: c.tolera_max }
}

const banda = (m: NonNullable<ReturnType<typeof modeloEscala>>, tipo: 'tolerado' | 'ideal') =>
  m.bandas.filter((b) => b.tipo === tipo)
const etiqueta = (m: NonNullable<ReturnType<typeof modeloEscala>>, lado: 'min' | 'ideal' | 'max') =>
  m.etiquetas.find((e) => e.lado === lado)!

describe('modeloEscala', () => {
  it('con los cuatro valores: dos alas toleradas, ideal en el medio, tres etiquetas', () => {
    // tomate germinación: 10 / 18-27 / 35 sobre dominio -10…45
    const m = modeloEscala(germ('tomate'))!
    expect(banda(m, 'tolerado')).toHaveLength(2)
    expect(banda(m, 'ideal')).toHaveLength(1)

    expect(etiqueta(m, 'min')).toMatchObject({ texto: '10°C', sinDato: false })
    expect(etiqueta(m, 'min').pct).toBeCloseTo(((10 + 10) / 55) * 100, 1)
    expect(etiqueta(m, 'max')).toMatchObject({ texto: '35°C', sinDato: false })
    expect(etiqueta(m, 'ideal').texto).toBe('ideal 18–27°C')
    expect(etiqueta(m, 'ideal').pct).toBeCloseTo(((22.5 + 10) / 55) * 100, 1)
  })

  it('sin máximo viable no hay ala derecha y la etiqueta dice s/d, no el ideal', () => {
    // puerro germinación: 7 / 15-18 / null — antes la etiqueta repetía el 18
    const m = modeloEscala(germ('puerro'))!
    const ideal = banda(m, 'ideal')[0]
    expect(banda(m, 'tolerado')).toHaveLength(1)
    expect(banda(m, 'tolerado')[0].desdePct).toBeLessThan(ideal.desdePct)
    expect(etiqueta(m, 'max')).toMatchObject({ texto: 's/d', pct: null, sinDato: true })
  })

  it('sin ninguno de los dos viables queda la banda ideal sola y dos s/d', () => {
    // romero germinación: null / 18-21 / null
    const m = modeloEscala(germ('romero'))!
    expect(banda(m, 'tolerado')).toHaveLength(0)
    expect(etiqueta(m, 'min')).toMatchObject({ texto: 's/d', pct: null, sinDato: true })
    expect(etiqueta(m, 'max')).toMatchObject({ texto: 's/d', pct: null, sinDato: true })
  })

  it('un valor fuera del dominio de dibujo se recorta sin salirse del riel', () => {
    // lavanda crecimiento: tolera_min -15 con dominio que arranca en -10
    const m = modeloEscala(crec('lavanda'))!
    expect(banda(m, 'tolerado')[0].desdePct).toBe(0)
    const et = etiqueta(m, 'min')
    expect(et.texto).toBe('-15°C')
    expect(et.pct).toBeGreaterThanOrEqual(4) // la etiqueta no cuelga fuera del contenedor
  })

  it('sin el par ideal completo no hay escala dibujable', () => {
    expect(modeloEscala(germ('melisa'))).toBeNull()
    expect(modeloEscala(crec('melisa'))).toBeNull()
  })

  it('con un viable nulo, ninguna etiqueta repite el ideal ni hay banda de ese lado', () => {
    for (const e of especies) {
      const g = e.temperaturas.germinacion
      const c = e.temperaturas.crecimiento
      const casos: [ValoresEscala, string][] = [
        [{ min: g.min, idealMin: g.ideal_min, idealMax: g.ideal_max, max: g.max }, 'germinacion'],
        [{ min: c.tolera_min, idealMin: c.ideal_min, idealMax: c.ideal_max, max: c.tolera_max }, 'crecimiento'],
      ]
      for (const [v, donde] of casos) {
        const m = modeloEscala(v)
        if (!m) continue
        const ideal = banda(m, 'ideal')[0]
        const izq = banda(m, 'tolerado').filter((b) => b.desdePct < ideal.desdePct)
        const der = banda(m, 'tolerado').filter((b) => b.desdePct >= ideal.desdePct)
        const ctx = `${e.slug}/${donde}`
        if (v.min === null) {
          expect(izq, ctx).toHaveLength(0)
          expect(etiqueta(m, 'min').sinDato, ctx).toBe(true)
        }
        if (v.max === null) {
          expect(der, ctx).toHaveLength(0)
          expect(etiqueta(m, 'max').sinDato, ctx).toBe(true)
        }
      }
    }
  })
})

describe('rotuloEscala', () => {
  it('dice todo lo que sabe, y solo lo que sabe', () => {
    expect(rotuloEscala('temperatura de la tierra para germinar', germ('tomate'))).toBe(
      'temperatura de la tierra para germinar: ideal entre 18 y 27 °C, aguanta de 10 a 35 °C',
    )
    expect(rotuloEscala('temperatura de la tierra para germinar', germ('puerro'))).toBe(
      'temperatura de la tierra para germinar: ideal entre 15 y 18 °C, aguanta desde 7 °C; del máximo no hay dato',
    )
    expect(rotuloEscala('temperatura de la tierra para germinar', germ('romero'))).toBe(
      'temperatura de la tierra para germinar: ideal entre 18 y 21 °C; de los extremos que aguanta no hay dato',
    )
  })
})

describe('textoSinIdeal', () => {
  it('con algún viable pero sin ideales, dice el dato que hay', () => {
    // melisa crecimiento: solo tolera_min -15
    expect(textoSinIdeal(crec('melisa'))).toBe(
      'Aguanta el frío hasta -15 °C; del rango ideal no encontramos fuente.',
    )
  })

  it('sin ningún dato no hay nada que decir', () => {
    expect(textoSinIdeal(germ('melisa'))).toBeNull()
  })
})

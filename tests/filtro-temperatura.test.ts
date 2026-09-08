import { describe, expect, it } from 'vitest'
import {
  CRITERIOS,
  criteriosActivos,
  dominioDe,
  dominios,
  hayTemperatura,
  listar,
  moverPunta,
  pasaCriterio,
  pasaTemperatura,
  pctEn,
  rangoDe,
  rotuloChip,
  seSolapan,
  sinDatoPara,
  SIN_TEMPERATURA,
  textoSinDato,
  type SeleccionTemp,
} from '../src/lib/filtroTemperatura'
import type { EspecieEnriquecida } from '../src/lib/data/types'
import db from '../data/huerta_gba_enriquecido.json'

const especies = db.especies as unknown as EspecieEnriquecida[]
const padres = especies.filter((e) => !e.variedad_de)
const de = (slug: string) => especies.find((e) => e.slug === slug)!

const con = (s: Partial<SeleccionTemp>): SeleccionTemp => ({ ...SIN_TEMPERATURA, ...s })

describe('solapamiento', () => {
  it('dos rangos se solapan si comparten aunque sea un punto', () => {
    expect(seSolapan({ min: 18, max: 27 }, { min: 28, max: 33 })).toBe(false)
    expect(seSolapan({ min: 18, max: 27 }, { min: 27, max: 33 })).toBe(true)
    expect(seSolapan({ min: 18, max: 27 }, { min: 20, max: 22 })).toBe(true)
    expect(seSolapan({ min: 18, max: 27 }, { min: 18, max: 27 })).toBe(true)
    // degenerado: "que incluya estos 20 °C"
    expect(seSolapan({ min: 18, max: 27 }, { min: 20, max: 20 })).toBe(true)
    expect(seSolapan({ min: 18, max: 27 }, { min: 10, max: 10 })).toBe(false)
  })
})

describe('el rango de una especie', () => {
  it('sale de las dos puntas del criterio', () => {
    expect(rangoDe(de('tomate'), 'germinacion_ideal')).toEqual({ min: 18, max: 27 })
    expect(rangoDe(de('tomate'), 'germinacion_posible')).toEqual({ min: 10, max: 35 })
    expect(rangoDe(de('lechuga'), 'crecimiento_ideal')).toEqual({ min: 13, max: 18 })
    expect(rangoDe(de('lavanda'), 'crecimiento_tolera')).toEqual({ min: -15, max: 35 })
  })

  /** La regla 1 del proyecto, como test: con una punta sola habría que suponer la otra. */
  it('con una sola punta no hay rango, aunque la otra esté', () => {
    expect(de('puerro').temperaturas.germinacion.min).toBe(7)
    expect(rangoDe(de('puerro'), 'germinacion_posible')).toBeNull()
    expect(rangoDe(de('ajo'), 'crecimiento_tolera')).toBeNull()
    expect(rangoDe(de('melisa'), 'germinacion_ideal')).toBeNull()
  })
})

describe('el riel', () => {
  it('sale del catálogo, redondeado a múltiplos de 5 hacia afuera', () => {
    expect(dominioDe(padres, 'germinacion_ideal')).toEqual({ min: 10, max: 35 })
    expect(dominioDe(padres, 'germinacion_posible')).toEqual({ min: 0, max: 40 })
    expect(dominioDe(padres, 'crecimiento_ideal')).toEqual({ min: 5, max: 30 })
    expect(dominioDe(padres, 'crecimiento_tolera')).toEqual({ min: -15, max: 45 })
  })

  it('ningún dato del catálogo se queda afuera de su riel', () => {
    const doms = dominios(especies)
    for (const c of CRITERIOS) {
      for (const e of especies) {
        for (const v of c.lee(e)) {
          if (v === null) continue
          expect(v, `${e.slug}/${c.clave}`).toBeGreaterThanOrEqual(doms[c.clave].min)
          expect(v, `${e.slug}/${c.clave}`).toBeLessThanOrEqual(doms[c.clave].max)
        }
      }
    }
  })

  it('sin ningún par completo el riel queda vacío, no inventado', () => {
    const mudas = [{ temperaturas: { germinacion: {}, crecimiento: {} } }] as unknown as EspecieEnriquecida[]
    const d = dominioDe(mudas, 'germinacion_ideal')
    expect(d.max).toBe(d.min)
  })

  it('pctEn ubica el valor en el riel y recorta lo que se sale', () => {
    const dom = { min: 10, max: 30 }
    expect(pctEn(dom, 10)).toBe(0)
    expect(pctEn(dom, 30)).toBe(100)
    expect(pctEn(dom, 20)).toBe(50)
    expect(pctEn(dom, -5)).toBe(0)
    expect(pctEn(dom, 99)).toBe(100)
  })
})

describe('mover una punta', () => {
  const dom = { min: 10, max: 35 }

  it('las puntas no se cruzan, pero pueden juntarse', () => {
    expect(moverPunta({ min: 15, max: 25 }, 'min', 30, dom)).toEqual({ min: 25, max: 25 })
    expect(moverPunta({ min: 15, max: 25 }, 'max', 5, dom)).toEqual({ min: 15, max: 15 })
  })

  it('ninguna punta se sale del riel', () => {
    expect(moverPunta({ min: 15, max: 25 }, 'min', -40, dom)).toEqual({ min: 10, max: 25 })
    expect(moverPunta({ min: 15, max: 25 }, 'max', 99, dom)).toEqual({ min: 15, max: 35 })
  })
})

describe('qué especies pasan', () => {
  it('pasa la que se solapa, no la que queda al lado', () => {
    const calor = { min: 26, max: 30 }
    expect(pasaCriterio(de('sandia'), 'crecimiento_ideal', calor)).toBe(true)
    expect(pasaCriterio(de('lechuga'), 'crecimiento_ideal', calor)).toBe(false)
    // 15-20 contra 18-22: comparten 18-20
    expect(pasaCriterio(de('lechuga'), 'germinacion_ideal', { min: 18, max: 22 })).toBe(true)
  })

  it('los criterios prendidos son un Y, no un O', () => {
    // la lechuga germina fresco (15-20) pero no crece con calor (13-18)
    const soloGerminar = con({ germinacion_ideal: { min: 15, max: 20 } })
    const yTambienCrecer = con({
      germinacion_ideal: { min: 15, max: 20 },
      crecimiento_ideal: { min: 26, max: 30 },
    })
    expect(pasaTemperatura(de('lechuga'), soloGerminar)).toBe(true)
    expect(pasaTemperatura(de('lechuga'), yTambienCrecer)).toBe(false)
  })

  it('sin nada prendido pasan todas, incluso las que no tienen el dato', () => {
    expect(padres.every((e) => pasaTemperatura(e, SIN_TEMPERATURA))).toBe(true)
    expect(pasaTemperatura(de('melisa'), SIN_TEMPERATURA)).toBe(true)
  })

  /** Regresión de la regla 1: prender un criterio nunca deja pasar a la que no tiene el dato. */
  it('la que no tiene el par completo no pasa, ni con el riel entero', () => {
    const doms = dominios(padres)
    for (const c of CRITERIOS) {
      const todo = con({ [c.clave]: doms[c.clave] })
      for (const e of padres) {
        if (rangoDe(e, c.clave) !== null) continue
        expect(pasaTemperatura(e, todo), `${e.slug}/${c.clave}`).toBe(false)
      }
    }
  })

  it('cada variedad hereda el rango de su especie', () => {
    for (const v of especies.filter((e) => e.variedad_de)) {
      const padre = de(v.variedad_de!)
      for (const c of CRITERIOS) {
        expect(rangoDe(v, c.clave), `${v.slug}/${c.clave}`).toEqual(rangoDe(padre, c.clave))
      }
    }
  })
})

describe('lo elegido', () => {
  it('cuenta y detecta los criterios prendidos', () => {
    expect(hayTemperatura(SIN_TEMPERATURA)).toBe(false)
    const dos = con({
      germinacion_ideal: { min: 10, max: 35 },
      crecimiento_tolera: { min: -15, max: 45 },
    })
    expect(hayTemperatura(dos)).toBe(true)
    expect(criteriosActivos(dos).map((c) => c.clave)).toEqual([
      'germinacion_ideal',
      'crecimiento_tolera',
    ])
  })

  it('el nombre accesible del chip dice lo elegido', () => {
    expect(rotuloChip(SIN_TEMPERATURA)).toBe('Temperatura: cualquiera')
    expect(rotuloChip(con({ germinacion_ideal: { min: 18, max: 22 } }))).toBe(
      'Temperatura: ideal para germinar de 18 a 22 °C',
    )
  })
})

describe('las que quedan afuera se nombran', () => {
  it('nombra a las que no tienen el dato del criterio prendido', () => {
    const sin = sinDatoPara(padres, con({ germinacion_ideal: { min: 10, max: 35 } }))
    expect(sin).toEqual(['menta', 'melisa (toronjil)', 'laurel'])
  })

  it('con varios criterios no se repite ningún nombre', () => {
    const todos = Object.fromEntries(
      CRITERIOS.map((c) => [c.clave, dominios(padres)[c.clave]]),
    ) as SeleccionTemp
    const sin = sinDatoPara(padres, todos)
    expect(new Set(sin).size).toBe(sin.length)
    expect(sin.length).toBe(19)
  })

  it('sin criterios prendidos no queda nadie afuera', () => {
    expect(sinDatoPara(padres, SIN_TEMPERATURA)).toEqual([])
    expect(textoSinDato([])).toBeNull()
  })

  it('la frase se lee bien con uno, dos o tres nombres', () => {
    expect(listar(['menta'])).toBe('menta')
    expect(listar(['menta', 'laurel'])).toBe('menta y laurel')
    expect(listar(['menta', 'melisa', 'laurel'])).toBe('menta, melisa y laurel')
    expect(textoSinDato(['menta'])).toBe('Sin ese dato investigado, queda afuera menta.')
    expect(textoSinDato(['menta', 'laurel'])).toBe(
      'Sin ese dato investigado, quedan afuera menta y laurel.',
    )
  })
})

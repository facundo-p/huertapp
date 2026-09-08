import { describe, expect, it } from 'vitest'
import { DIAS_ATRAS, mesesDelEje, pct, ventanas, visible } from '../src/lib/huerta/gantt'
import type { Planta } from '../src/lib/huerta/tipos'
import type { EspecieEnriquecida } from '../src/lib/data/types'

const HOY = '2026-09-06'

const planta = (extra: Partial<Planta> = {}): Planta =>
  ({
    id: 'p1',
    slug: 'tomate',
    apodo: null,
    sembrada: '2026-08-15',
    metodo: 'almacigo',
    etapa: 'almacigo',
    ubicacionId: null,
    germino: null,
    cantidad: null,
    creada: HOY,
    ...extra,
  }) as Planta

const especie = (extra: Partial<EspecieEnriquecida> = {}): EspecieEnriquecida =>
  ({
    slug: 'tomate',
    dias_a_trasplante: { min: 30, max: 45 },
    dias_a_cosecha: { min: 90, max: 110 },
    dias_germinacion: { min: 6, max: 12 },
    ...extra,
  }) as EspecieEnriquecida

describe('ventanas', () => {
  it('ubica la siembra en el pasado y los hitos contados desde ella', () => {
    const v = ventanas(planta(), especie(), HOY)
    expect(v.siembra).toBe(-22) // 15/08 → 06/09
    expect(v.trasplante).toEqual([8, 23]) // −22 + 30 y −22 + 45
    expect(v.cosecha).toEqual([68, 88])
  })

  it('corre todas las ventanas cuando la semilla asomó tarde', () => {
    // la ficha decía 6-12 días y asomó a los 18: seis de más
    const v = ventanas(planta({ germino: '2026-09-02' }), especie(), HOY)
    expect(v.corrimiento).toBe(6)
    expect(v.trasplante).toEqual([14, 29])
    expect(v.cosecha).toEqual([74, 94])
  })

  it('también corre hacia atrás si asomó antes de lo previsto', () => {
    const v = ventanas(planta({ germino: '2026-08-18' }), especie(), HOY)
    expect(v.corrimiento).toBe(-3)
    expect(v.trasplante).toEqual([5, 20])
  })

  it('la siembra directa no tiene ventana de trasplante', () => {
    const v = ventanas(planta({ metodo: 'directa' }), especie(), HOY)
    expect(v.trasplante).toBeNull()
    expect(v.cosecha).not.toBeNull()
  })

  it('el almácigo protegido sí la tiene', () => {
    // el chequeo ingenuo `metodo === 'almacigo'` dejaba esta afuera
    const v = ventanas(planta({ metodo: 'almacigo_protegido' }), especie(), HOY)
    expect(v.trasplante).toEqual([8, 23])
  })

  it('una planta ya trasplantada CONSERVA su ventana de trasplante', () => {
    // es el pasado del ciclo y el gantt lo dibuja: `estimar()` la apaga cuando
    // la etapa cambia, y por eso el gantt no puede usar ese campo
    const v = ventanas(planta({ etapa: 'creciendo' }), especie(), HOY)
    expect(v.trasplante).toEqual([8, 23])
  })

  it('sin dato en la ficha no inventa el tramo', () => {
    const v = ventanas(planta(), especie({ dias_a_trasplante: null, dias_a_cosecha: null }), HOY)
    expect(v.trasplante).toBeNull()
    expect(v.cosecha).toBeNull()
  })
})

describe('pct', () => {
  it('deja hoy en el 33,33 % de la ventana', () => {
    expect(pct(0)).toBeCloseTo(33.33, 1)
  })

  it('los extremos son 0 y 100', () => {
    expect(pct(-DIAS_ATRAS)).toBe(0)
    expect(pct(120)).toBe(100)
  })

  it('recorta lo que se sale en vez de dibujar fuera de la tarjeta', () => {
    expect(pct(-400)).toBe(0)
    expect(pct(400)).toBe(100)
  })
})

describe('visible', () => {
  it('un tramo que ya pasó entero queda fuera', () => {
    expect(visible([-200, -150])).toBe(false)
  })

  it('uno que empieza después de la ventana también', () => {
    expect(visible([200, 260])).toBe(false)
  })

  it('uno que la cruza aunque sea en parte, entra', () => {
    expect(visible([-80, -40])).toBe(true)
    expect(visible([100, 300])).toBe(true)
  })

  it('sin tramo no hay nada que dibujar', () => {
    expect(visible(null)).toBe(false)
  })
})

describe('eje', () => {
  it('son siete meses calculados desde hoy, no fijos', () => {
    const eje = mesesDelEje(HOY)
    expect(eje).toHaveLength(7)
    // desde julio (60 días atrás) hasta enero
    expect(eje[0].mes).toBe(7)
    expect(eje[6].mes).toBe(1)
  })

  it('marca el mes en curso una sola vez', () => {
    expect(mesesDelEje(HOY).filter((m) => m.esActual)).toHaveLength(1)
  })
})

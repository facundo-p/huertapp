import { describe, expect, it } from 'vitest'
import { corrimiento, estimar, sumarDias } from '../src/lib/huerta/estimar'
import type { Planta } from '../src/lib/huerta/tipos'
import type { EspecieEnriquecida } from '../src/lib/data/types'
import db from '../data/huerta_gba_enriquecido.json'

const especies = db.especies as unknown as EspecieEnriquecida[]
const porSlug = new Map(especies.map((e) => [e.slug, e]))
const get = (s: string) => {
  const e = porSlug.get(s)
  if (!e) throw new Error(`falta ${s} en el catálogo`)
  return e
}

// Lechuga: germina en 4-10 días, se trasplanta a los 25-35, cosecha a los 50-120.
// Sembrada el 1 de agosto, la ficha espera que asome entre el 5 y el 11.
const lechuga = get('lechuga')
const SEMBRADA = '2026-08-01'

function planta(p: Partial<Planta> = {}): Planta {
  return {
    id: 'p-1',
    slug: 'lechuga',
    sembrada: SEMBRADA,
    metodo: 'almacigo',
    etapa: 'almacigo',
    etapaDesde: SEMBRADA,
    creada: `${SEMBRADA}T10:00:00.000Z`,
    ...p,
  }
}

describe('corrimiento por el atraso de la germinación', () => {
  it('no corrige nada si asomó dentro de la ventana que decía la ficha', () => {
    expect(corrimiento(planta({ germino: '2026-08-08' }), lechuga)).toBe(0)
  })

  it('tampoco en los bordes: el 5 y el 11 todavía son lo previsto', () => {
    expect(corrimiento(planta({ germino: '2026-08-05' }), lechuga)).toBe(0)
    expect(corrimiento(planta({ germino: '2026-08-11' }), lechuga)).toBe(0)
  })

  it('cuenta los días pasados del máximo cuando asomó tarde', () => {
    expect(corrimiento(planta({ germino: '2026-08-23' }), lechuga)).toBe(12)
  })

  it('se adelanta, negativo, cuando asomó antes del mínimo', () => {
    expect(corrimiento(planta({ germino: '2026-08-02' }), lechuga)).toBe(-3)
  })

  it('sin germinación marcada no hay nada que corregir', () => {
    expect(corrimiento(planta(), lechuga)).toBe(0)
  })

  it('sin dato de germinación en la ficha tampoco corrige: la batata no tiene', () => {
    const batata = get('batata')
    expect(batata.dias_germinacion).toBeNull()
    expect(corrimiento(planta({ slug: 'batata', germino: '2026-08-23' }), batata)).toBe(0)
  })
})

describe('hitos corridos por la germinación real', () => {
  const HOY = '2026-08-27'

  it('trasplante y cosecha se corren los mismos días que se atrasó', () => {
    const est = estimar(planta({ germino: '2026-08-23' }), lechuga, HOY)
    expect(est.corrimiento).toBe(12)
    expect(est.trasplante).toMatchObject({ desde: '2026-09-07', hasta: '2026-09-17' })
    expect(est.cosecha).toMatchObject({ desde: '2026-10-02', hasta: '2026-12-11' })
  })

  it('el rango se desplaza sin cambiar de ancho', () => {
    const sin = estimar(planta(), lechuga, HOY)
    const con = estimar(planta({ germino: '2026-08-23' }), lechuga, HOY)
    const ancho = (h: { desde: string; hasta: string }) =>
      Math.round((Date.parse(h.hasta) - Date.parse(h.desde)) / 86400000)
    expect(ancho(con.trasplante!)).toBe(ancho(sin.trasplante!))
    expect(ancho(con.cosecha!)).toBe(ancho(sin.cosecha!))
  })

  it('la que asomó en fecha queda igual que antes de todo esto', () => {
    const est = estimar(planta({ germino: '2026-08-08' }), lechuga, HOY)
    expect(est.corrimiento).toBe(0)
    expect(est.trasplante).toMatchObject({ desde: '2026-08-26', hasta: '2026-09-05' })
  })

  it('dos plantas de la misma especie sembradas el mismo día pero con distinta germinación no comparten fecha', () => {
    const temprana = estimar(planta({ germino: '2026-08-06' }), lechuga, HOY)
    const tardia = estimar(planta({ id: 'p-2', germino: '2026-08-23' }), lechuga, HOY)
    expect(temprana.trasplante!.desde).not.toBe(tardia.trasplante!.desde)
    expect(tardia.trasplante!.faltan).toBeGreaterThan(temprana.trasplante!.faltan)
  })

  it('faltan y enVentana se calculan sobre la fecha ya corrida', () => {
    // sin corregir, al 27 de agosto la lechuga ya estaría en ventana de trasplante
    expect(estimar(planta(), lechuga, HOY).trasplante!.enVentana).toBe(true)
    const est = estimar(planta({ germino: '2026-08-23' }), lechuga, HOY)
    expect(est.trasplante!.enVentana).toBe(false)
    expect(est.trasplante!.faltan).toBe(11)
  })

  it('los días desde la siembra siguen siendo desde la siembra', () => {
    expect(estimar(planta({ germino: '2026-08-23' }), lechuga, HOY).diasDesdeSiembra).toBe(26)
  })
})

describe('sumarDias', () => {
  it('cruza el fin de mes', () => {
    expect(sumarDias('2026-08-25', 10)).toBe('2026-09-04')
  })
})

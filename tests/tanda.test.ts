import { describe, expect, it } from 'vitest'
import {
  dividirTanda,
  moverTanda,
  partesDe,
  raizDe,
  resumenHuerta,
  textoCantidad,
  textoConteo,
  textosTrasplanteParcial,
  textoTrasplanteEntero,
  type OpcionesDividir,
} from '../src/lib/huerta/tanda'
import type { Planta } from '../src/lib/huerta/tipos'

const HOY = '2026-08-15'

function planta(p: Partial<Planta> = {}): Planta {
  return {
    id: 'madre',
    slug: 'tomate',
    sembrada: '2026-08-01',
    metodo: 'almacigo',
    etapa: 'almacigo',
    etapaDesde: '2026-08-01',
    creada: '2026-08-01T10:00:00.000Z',
    ...p,
  }
}

const dividir = (madre: Planta, o: Partial<OpcionesDividir> = {}) =>
  dividirTanda(madre, { fecha: HOY, idHija: 'hija', creadaHija: `${HOY}T10:00:00.000Z`, ...o })

describe('dividirTanda', () => {
  it('la hija hereda la siembra y toma el lugar y la cantidad nuevos', () => {
    const { hija } = dividir(
      planta({ apodo: 'Los del cajón', germino: '2026-08-08', ubicacionId: 'semillero' }),
      { ubicacionId: 'bancal', cuantas: 4 },
    )
    expect(hija.id).toBe('hija')
    expect(hija.slug).toBe('tomate')
    expect(hija.apodo).toBe('Los del cajón')
    expect(hija.sembrada).toBe('2026-08-01')
    expect(hija.metodo).toBe('almacigo')
    expect(hija.germino).toBe('2026-08-08')
    expect(hija.ubicacionId).toBe('bancal')
    expect(hija.cantidad).toBe(4)
  })

  it('desde almácigo la hija sale trasplantada, con la fecha del trasplante', () => {
    const { hija } = dividir(planta())
    expect(hija.etapa).toBe('trasplantada')
    expect(hija.etapaDesde).toBe(HOY)
  })

  it('desde creciendo la hija conserva etapa y etapaDesde', () => {
    const { hija } = dividir(planta({ etapa: 'creciendo', etapaDesde: '2026-08-10' }))
    expect(hija.etapa).toBe('creciendo')
    expect(hija.etapaDesde).toBe('2026-08-10')
  })

  it('la madre no cambia de etapa ni de lugar', () => {
    const original = planta({ ubicacionId: 'semillero', cantidad: 10 })
    const { madre } = dividir(original, { ubicacionId: 'bancal', cuantas: 4 })
    expect(madre.etapa).toBe('almacigo')
    expect(madre.etapaDesde).toBe('2026-08-01')
    expect(madre.ubicacionId).toBe('semillero')
  })

  it('descuenta de la madre cuando las dos cantidades se conocen', () => {
    const { madre } = dividir(planta({ cantidad: 10 }), { cuantas: 4 })
    expect(madre.cantidad).toBe(6)
  })

  it('no descuenta si falta un dato', () => {
    expect(dividir(planta({ cantidad: 10 })).madre.cantidad).toBe(10)
    expect(dividir(planta(), { cuantas: 4 }).madre.cantidad).toBeUndefined()
  })

  it('el descuento nunca deja la madre en negativo, y cero es un valor válido', () => {
    expect(dividir(planta({ cantidad: 5 }), { cuantas: 8 }).madre.cantidad).toBe(0)
    expect(dividir(planta({ cantidad: 5 }), { cuantas: 5 }).madre.cantidad).toBe(0)
  })

  it('el origen apunta a la raíz también al dividir una hija', () => {
    const { hija } = dividir(planta())
    const { hija: nieta } = dividir(hija, { idHija: 'nieta' })
    expect(hija.origenId).toBe('madre')
    expect(nieta.origenId).toBe('madre')
  })
})

describe('moverTanda', () => {
  it('desde almácigo avanza a trasplantada con la fecha del movimiento', () => {
    const m = moverTanda(planta(), { fecha: HOY, ubicacionId: 'bancal' })
    expect(m.etapa).toBe('trasplantada')
    expect(m.etapaDesde).toBe(HOY)
    expect(m.ubicacionId).toBe('bancal')
  })

  it('después de trasplantada solo cambia el lugar', () => {
    const m = moverTanda(planta({ etapa: 'creciendo', etapaDesde: '2026-08-10' }), {
      fecha: HOY,
      ubicacionId: 'bancal',
    })
    expect(m.etapa).toBe('creciendo')
    expect(m.etapaDesde).toBe('2026-08-10')
    expect(m.ubicacionId).toBe('bancal')
  })
})

describe('raizDe y partesDe', () => {
  it('sin origen, la tarjeta es su propia raíz', () => {
    expect(raizDe(planta())).toBe('madre')
    expect(raizDe(planta({ origenId: 'otra' }))).toBe('otra')
  })

  it('encuentra las otras partes de la misma siembra, sin la propia ni archivadas', () => {
    const madre = planta()
    const hija = planta({ id: 'hija', origenId: 'madre' })
    const archivada = planta({ id: 'vieja', origenId: 'madre', archivada: true })
    const ajena = planta({ id: 'ajena', slug: 'lechuga' })
    const todas = [madre, hija, archivada, ajena]
    expect(partesDe(todas, hija)).toEqual([madre])
    expect(partesDe(todas, madre)).toEqual([hija])
    expect(partesDe(todas, ajena)).toEqual([])
  })
})

describe('resumenHuerta', () => {
  it('singulariza', () => {
    expect(resumenHuerta([planta()])).toBe('1 siembra')
  })

  it('cuenta siembras por raíz, no por tarjeta', () => {
    const madre = planta()
    const hija = planta({ id: 'hija', origenId: 'madre' })
    const otra = planta({ id: 'otra', slug: 'lechuga' })
    expect(resumenHuerta([madre, hija, otra])).toBe('2 siembras')
  })

  it('suma las cantidades cargadas', () => {
    const p = [planta({ cantidad: 10 }), planta({ id: 'x', slug: 'lechuga', cantidad: 14 })]
    expect(resumenHuerta(p)).toBe('2 siembras · ~24 plantas')
  })

  it('suma lo conocido aunque a alguna tarjeta le falte la cantidad', () => {
    const p = [planta({ cantidad: 10 }), planta({ id: 'x', slug: 'lechuga' })]
    expect(resumenHuerta(p)).toBe('2 siembras · ~10 plantas')
  })

  it('con una sola planta no pone virgulilla', () => {
    expect(resumenHuerta([planta({ cantidad: 1 })])).toBe('1 siembra · 1 planta')
  })

  it('sin cantidades no inventa un total', () => {
    expect(resumenHuerta([planta(), planta({ id: 'x', slug: 'lechuga' })])).toBe('2 siembras')
  })
})

describe('textoCantidad', () => {
  it('sin cantidad no dice nada', () => {
    expect(textoCantidad(planta())).toBeNull()
  })

  it('en almácigo son plantines; después, plantas', () => {
    expect(textoCantidad(planta({ cantidad: 8 }))).toBe('~8 plantines')
    expect(textoCantidad(planta({ etapa: 'creciendo', cantidad: 4 }))).toBe('~4 plantas')
  })

  it('una sola, sin virgulilla', () => {
    expect(textoCantidad(planta({ cantidad: 1 }))).toBe('1 plantín')
    expect(textoCantidad(planta({ etapa: 'creciendo', cantidad: 1 }))).toBe('1 planta')
  })

  it('cero es una cuenta, no una ausencia', () => {
    expect(textoCantidad(planta({ cantidad: 0 }))).toBe('0 plantines')
  })
})

describe('textos del diario', () => {
  it('trasplante parcial con todo el detalle', () => {
    const t = textosTrasplanteParcial({ cuantas: 4, nombreDestino: 'Bancal del fondo', nombreOrigen: 'Semillero' })
    expect(t.madre).toBe('Pasaste ~4 a Bancal del fondo.')
    expect(t.hija).toBe('Vienen de Semillero — eran ~4.')
  })

  it('trasplante parcial sin cantidad ni destino', () => {
    const t = textosTrasplanteParcial({ nombreOrigen: 'Semillero' })
    expect(t.madre).toBe('Pasaste una parte.')
    expect(t.hija).toBe('Vienen de Semillero.')
  })

  it('trasplante parcial de una sola', () => {
    const t = textosTrasplanteParcial({ cuantas: 1, nombreDestino: 'Maceta grande' })
    expect(t.madre).toBe('Pasaste 1 a Maceta grande.')
    expect(t.hija).toBe('Viene de la siembra original — era 1.')
  })

  it('trasplante entero, con y sin cambio de etapa', () => {
    expect(textoTrasplanteEntero({ cambioEtapa: true, nombreDestino: 'Bancal del fondo' })).toBe(
      'Trasplantada a Bancal del fondo.',
    )
    expect(textoTrasplanteEntero({ cambioEtapa: false, nombreDestino: 'Bancal del fondo' })).toBe(
      'Movida a Bancal del fondo.',
    )
    expect(textoTrasplanteEntero({ cambioEtapa: true })).toBe('Trasplantada.')
  })

  it('conteo: primera vez, baja, suba y última en pie', () => {
    expect(textoConteo(undefined, 10)).toBe('Hay ~10.')
    expect(textoConteo(10, 6)).toBe('De ~10 quedaron ~6.')
    expect(textoConteo(10, 12)).toBe('De ~10 pasaron a ~12.')
    expect(textoConteo(10, 1)).toBe('De ~10 quedó 1.')
    expect(textoConteo(10, 10)).toBe('Hay ~10.')
  })
})

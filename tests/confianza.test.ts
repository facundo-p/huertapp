import { describe, expect, it } from 'vitest'
import { puntosConfianza } from '../src/lib/data/confianza'

describe('puntosConfianza', () => {
  it('pinta tantos puntos como vale el índice, del color de su nivel', () => {
    expect(puntosConfianza(8).filter((p) => p === 'alta')).toHaveLength(8)
    expect(puntosConfianza(7).filter((p) => p === 'media')).toHaveLength(7)
    expect(puntosConfianza(4).filter((p) => p === 'baja')).toHaveLength(4)
  })

  it('siempre son diez', () => {
    for (const v of [0, 4, 7, 8, 10, null]) expect(puntosConfianza(v)).toHaveLength(10)
  })

  it('los extremos: 10 llena todo, 0 no pinta nada', () => {
    expect(puntosConfianza(10).every((p) => p === 'alta')).toBe(true)
    expect(puntosConfianza(0).every((p) => p === 'vacio')).toBe(true)
  })

  it('sin dato son diez vacíos: null no es confianza baja', () => {
    expect(puntosConfianza(null).every((p) => p === 'vacio')).toBe(true)
  })

  it('los umbrales son los de nivelConfianza: 8 alta, 5 media', () => {
    expect(puntosConfianza(8)[0]).toBe('alta')
    expect(puntosConfianza(5)[0]).toBe('media')
    expect(puntosConfianza(4.6)[0]).toBe('baja')
  })
})

import { describe, expect, it } from 'vitest'
import { metodosPorMes, textoMeses, tramos, unir } from '../src/lib/calendario'
import { nombreCorto } from '../src/lib/data/slugs'
import type { Mes } from '../src/lib/data/types'
import db from '../data/huerta_gba_enriquecido.json'

describe('tramos', () => {
  it('agrupa meses consecutivos', () => {
    expect(tramos([8, 9, 10])).toEqual([[8, 10]])
  })

  it('cruza el fin de año como un solo tramo', () => {
    expect(tramos([11, 12, 1])).toEqual([[11, 1]])
    expect(tramos([12, 1])).toEqual([[12, 1]])
  })

  it('separa tramos no contiguos', () => {
    expect(tramos([2, 3, 9, 10, 11])).toEqual([
      [2, 3],
      [9, 11],
    ])
  })

  it('mes suelto es un tramo de uno', () => {
    expect(tramos([5])).toEqual([[5]].map(([m]) => [m, m]))
  })

  it('vacío y año completo', () => {
    expect(tramos([])).toEqual([])
    expect(tramos([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])).toEqual([[1, 12]])
  })

  it('ignora duplicados', () => {
    expect(tramos([3, 3, 4] as Mes[])).toEqual([[3, 4]])
  })
})

describe('textoMeses', () => {
  it('escribe los tramos en castellano', () => {
    expect(textoMeses([8, 9, 10])).toBe('de agosto a octubre')
    expect(textoMeses([5])).toBe('mayo')
    expect(textoMeses([11, 12, 1])).toBe('de noviembre a enero')
    expect(textoMeses([2, 3, 9, 10, 11])).toBe('de febrero a marzo y de septiembre a noviembre')
    expect(textoMeses([])).toBe('')
  })

  it('el año entero no se enumera', () => {
    expect(textoMeses([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12])).toBe('todo el año')
  })
})

describe('unir', () => {
  it('arma listas legibles', () => {
    expect(unir([])).toBe('')
    expect(unir(['a'])).toBe('a')
    expect(unir(['a', 'b'])).toBe('a y b')
    expect(unir(['a', 'b', 'c'])).toBe('a, b y c')
  })
})

describe('metodosPorMes', () => {
  it('invierte el mapa y ordena por cantidad de meses', () => {
    expect(
      metodosPorMes({ 8: 'almacigo_protegido', 9: 'directa', 10: 'directa', 11: 'directa' }),
    ).toEqual([
      { metodo: 'directa', meses: [9, 10, 11] },
      { metodo: 'almacigo_protegido', meses: [8] },
    ])
  })
})

describe('nombreCorto', () => {
  it('corta paréntesis y barras, igual que el slug', () => {
    expect(nombreCorto('Capuchina (taco de reina)')).toBe('Capuchina')
    expect(nombreCorto('Radicchio / Achicoria')).toBe('Radicchio')
    expect(nombreCorto('Zapallito de tronco')).toBe('Zapallito de tronco')
  })

  it('ningún nombre corto pasa de 22 caracteres (entra en la columna de la matriz)', () => {
    for (const e of db.especies as Array<{ nombre_comun: string }>) {
      expect(nombreCorto(e.nombre_comun).length).toBeLessThanOrEqual(22)
    }
  })
})

describe('la matriz del calendario', () => {
  const especies = db.especies as Array<{
    nombre_comun: string
    calendario: { trasplante_ideal: number[]; trasplante_posible: number[]; derivacion: string }
  }>

  it('la capa de trasplante no queda vacía ni muestra a todas', () => {
    const conTrasplante = especies.filter(
      (e) => e.calendario.trasplante_ideal.length + e.calendario.trasplante_posible.length > 0,
    )
    expect(conTrasplante.length).toBeGreaterThan(10)
    expect(conTrasplante.length).toBeLessThan(especies.length)
  })

  it('toda especie tiene derivación para mostrar en la hoja de detalle', () => {
    for (const e of especies) expect(e.calendario.derivacion.trim().length).toBeGreaterThan(10)
  })
})

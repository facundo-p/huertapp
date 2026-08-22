import { describe, expect, it } from 'vitest'
import { metodosPorMes, textoDecadas, textoMeses, tramos, unir } from '../src/lib/calendario'
import {
  decadaDeMesDia,
  decadasDelMes,
  diasHastaFinDeDecada,
  mesDeDecada,
  nombreDecada,
  tercioDeDecada,
  ultimoDiaDeDecada,
} from '../src/lib/fechas'
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

describe('décadas', () => {
  it('parte cada mes en tres', () => {
    expect(decadaDeMesDia(1, 1)).toBe(1)
    expect(decadaDeMesDia(1, 10)).toBe(1)
    expect(decadaDeMesDia(1, 11)).toBe(2)
    expect(decadaDeMesDia(1, 20)).toBe(2)
    expect(decadaDeMesDia(1, 21)).toBe(3)
    expect(decadaDeMesDia(1, 31)).toBe(3)
    expect(decadaDeMesDia(9, 15)).toBe(26)
    expect(decadaDeMesDia(12, 31)).toBe(36)
  })

  it('mes y tercio se recuperan, y ida y vuelta cierra', () => {
    for (let d = 1; d <= 36; d++) {
      const mes = mesDeDecada(d)
      expect(decadasDelMes(mes)).toContain(d)
      expect((mes - 1) * 3 + tercioDeDecada(d)).toBe(d)
    }
  })

  it('el último día de la década respeta el largo del mes', () => {
    expect(ultimoDiaDeDecada(1)).toBe(10)
    expect(ultimoDiaDeDecada(2)).toBe(20)
    expect(ultimoDiaDeDecada(3)).toBe(31) // enero
    expect(ultimoDiaDeDecada(6)).toBe(28) // febrero
    expect(ultimoDiaDeDecada(12)).toBe(30) // abril
  })

  it('cuenta los días que faltan para cerrar la década', () => {
    expect(diasHastaFinDeDecada(new Date(2026, 0, 1))).toBe(10)
    expect(diasHastaFinDeDecada(new Date(2026, 0, 10))).toBe(1)
    expect(diasHastaFinDeDecada(new Date(2026, 0, 25))).toBe(7)
    expect(diasHastaFinDeDecada(new Date(2026, 1, 25))).toBe(4) // febrero
  })

  it('las nombra en castellano', () => {
    expect(nombreDecada(1)).toBe('principios de enero')
    expect(nombreDecada(26)).toBe('mediados de septiembre')
    expect(nombreDecada(36)).toBe('fines de diciembre')
  })
})

describe('textoDecadas', () => {
  it('meses enteros se dicen como meses, sin la precisión de más', () => {
    expect(textoDecadas([22, 23, 24])).toBe('todo agosto')
    expect(textoDecadas([22, 23, 24, 25, 26, 27])).toBe('de agosto a septiembre')
  })

  it('dentro de un mismo mes no lo repite', () => {
    expect(textoDecadas([29, 30])).toBe('de mediados a fines de octubre')
    expect(textoDecadas([26])).toBe('mediados de septiembre')
  })

  it('entre meses distintos nombra los dos extremos', () => {
    expect(textoDecadas([24, 25, 26])).toBe('de fines de agosto a mediados de septiembre')
  })

  it('cruza el fin de año y junta tramos sueltos', () => {
    expect(textoDecadas([35, 36, 1])).toBe('de mediados de diciembre a principios de enero')
    expect(textoDecadas([1, 2, 3, 26])).toBe('todo enero y mediados de septiembre')
  })

  it('el año entero y el vacío', () => {
    expect(textoDecadas(Array.from({ length: 36 }, (_, i) => i + 1))).toBe('todo el año')
    expect(textoDecadas([])).toBe('')
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
    // La matriz dibuja una fila por especie del catálogo, y las variedades van
    // como subfila con su nombre corto ("Chantenay-Nantesa"), no con el
    // compuesto: el de la especie ya está en la fila de arriba.
    for (const e of db.especies as Array<{
      nombre_comun: string
      variedad: string | null
    }>) {
      const enLaColumna = e.variedad ?? nombreCorto(e.nombre_comun)
      expect(enLaColumna.length, enLaColumna).toBeLessThanOrEqual(22)
    }
  })
})

describe('la matriz del calendario', () => {
  const especies = db.especies as Array<{
    nombre_comun: string
    calendario: {
      fuente_meses: { trasplante_ideal: number[]; trasplante_posible: number[] }
      derivacion: string
    }
  }>

  it('la capa de trasplante no queda vacía ni muestra a todas', () => {
    const conTrasplante = especies.filter(
      (e) =>
        e.calendario.fuente_meses.trasplante_ideal.length +
          e.calendario.fuente_meses.trasplante_posible.length >
        0,
    )
    expect(conTrasplante.length).toBeGreaterThan(10)
    expect(conTrasplante.length).toBeLessThan(especies.length)
  })

  it('toda especie tiene derivación para mostrar en la hoja de detalle', () => {
    for (const e of especies) expect(e.calendario.derivacion.trim().length).toBeGreaterThan(10)
  })
})

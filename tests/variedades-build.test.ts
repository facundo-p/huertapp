// Una validación que solo corre sobre datos buenos pasa aunque esté comentada.
// Estos casos le dan de comer datos rotos a propósito.
import { describe, expect, it } from 'vitest'
// @ts-expect-error — módulo .mjs de scripts/, sin tipos
import { validarRecorte } from '../scripts/validar-variedades.mjs'

const padre = {
  slug: 'coliflor',
  calendario: {
    fuente_meses: {
      siembra_ideal: [3, 4],
      siembra_posible: [10],
      trasplante_ideal: [5],
      trasplante_posible: [],
    },
  },
  dias_a_cosecha: { min: 90, max: 200 },
  dias_a_trasplante: { min: 30, max: 45 },
  dias_germinacion: null,
}

const hija = (over: Record<string, unknown>) => ({ ...padre, slug: 'coliflor-x', ...over })

describe('validarRecorte', () => {
  it('acepta un recorte legítimo', () => {
    expect(
      validarRecorte(
        padre,
        hija({
          calendario: {
            fuente_meses: {
              siembra_ideal: [3],
              siembra_posible: [],
              trasplante_ideal: [5],
              trasplante_posible: [],
            },
          },
          dias_a_cosecha: { min: 90, max: 90 },
        }),
      ),
    ).toEqual([])
  })

  it('rechaza un mes de siembra que el padre no tiene', () => {
    const errores = validarRecorte(
      padre,
      hija({
        calendario: {
          fuente_meses: {
            siembra_ideal: [3, 7],
            siembra_posible: [],
            trasplante_ideal: [5],
            trasplante_posible: [],
          },
        },
      }),
    )
    expect(errores.join(' ')).toMatch(/siembra en el mes 7/)
  })

  it('rechaza un mes de trasplante que el padre no tiene', () => {
    const errores = validarRecorte(
      padre,
      hija({
        calendario: {
          fuente_meses: {
            siembra_ideal: [3],
            siembra_posible: [],
            trasplante_ideal: [5],
            trasplante_posible: [11],
          },
        },
      }),
    )
    expect(errores.join(' ')).toMatch(/trasplante en el mes 11/)
  })

  it('acepta que una variedad ascienda un mes de posible a ideal', () => {
    // Octubre ya estaba habilitado por la fuente del padre; que la variedad lo
    // dé como ideal es una lectura más fina, no un mes nuevo.
    expect(
      validarRecorte(
        padre,
        hija({
          calendario: {
            fuente_meses: {
              siembra_ideal: [10],
              siembra_posible: [],
              trasplante_ideal: [5],
              trasplante_posible: [],
            },
          },
        }),
      ),
    ).toEqual([])
  })

  it('rechaza días calculados fuera del rango del padre', () => {
    // El caso del apio: convertir "80-100 desde trasplante" a "150-190 desde
    // siembra" da un número que el padre nunca publicó.
    const errores = validarRecorte(padre, hija({ dias_a_cosecha: { min: 150, max: 210 } }))
    expect(errores.join(' ')).toMatch(/se sale del 90-200/)
  })

  it('rechaza días cuando el padre no publica rango', () => {
    const errores = validarRecorte(padre, hija({ dias_germinacion: { min: 5, max: 10 } }))
    expect(errores.join(' ')).toMatch(/padre en null/)
  })

  it('deja pasar los campos de días que la variedad no toca', () => {
    expect(validarRecorte(padre, hija({}))).toEqual([])
  })
})

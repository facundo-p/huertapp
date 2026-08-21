import { describe, expect, it } from 'vitest'
import { agregar, parsear, comoTexto, nombreError, type Apunte } from '../src/lib/huerta/bitacora'

const apunte = (n: number, extra: Partial<Apunte> = {}): Apunte => ({
  fecha: `2026-08-${String(n).padStart(2, '0')}T10:00:00.000Z`,
  version: '1.1.1',
  evento: 'arranque',
  ...extra,
})

describe('bitácora: el anotador', () => {
  it('conserva los más nuevos cuando pasa el tope', () => {
    const previos = Array.from({ length: 5 }, (_, i) => apunte(i + 1))
    const r = agregar(previos, apunte(9), 3)

    expect(r).toHaveLength(3)
    // el nuevo va al final y los que se caen son los más viejos
    expect(r.at(-1)!.fecha).toBe(apunte(9).fecha)
    expect(r[0].fecha).toBe(apunte(4).fecha)
  })

  it('no crece cuando ya está en el tope', () => {
    const previos = Array.from({ length: 3 }, (_, i) => apunte(i + 1))
    expect(agregar(previos, apunte(9), 3)).toHaveLength(3)
  })
})

describe('bitácora: leer lo que haya', () => {
  // El registro vive en localStorage, donde puede quedar cualquier cosa: una
  // versión vieja del formato, basura de otra app, o un JSON cortado a la
  // mitad. Si leerlo tira, la app no arranca — y este registro existe
  // justamente para los arranques que salen mal.
  it('devuelve vacío en vez de tirar cuando el crudo no sirve', () => {
    expect(parsear(null)).toEqual([])
    expect(parsear('')).toEqual([])
    expect(parsear('{no es json')).toEqual([])
    expect(parsear('{"a":1}')).toEqual([]) // JSON válido pero no es una lista
    expect(parsear('[1,2,3]')).toEqual([]) // lista pero no de apuntes
  })

  it('lee los apuntes que sí tienen forma de apunte', () => {
    const bueno = apunte(1)
    expect(parsear(JSON.stringify([bueno, 42, null]))).toEqual([bueno])
  })
})

describe('bitacora: el texto que se manda', () => {
  it('incluye lo que hace falta para diagnosticar', () => {
    const texto = comoTexto([
      apunte(1, {
        evento: 'arranque',
        baseVersion: 2,
        faltan: [],
        plantas: 7,
        persistente: true,
      }),
      apunte(2, { evento: 'error-lectura', error: 'NotFoundError' }),
    ])

    expect(texto).toContain('1.1.1')
    expect(texto).toContain('arranque')
    expect(texto).toContain('7') // cuántas plantas leyó
    expect(texto).toContain('NotFoundError') // el nombre del error, que es el dato
    expect(texto).toContain('error-lectura')
  })

  it('lo dice cuando no hay nada anotado', () => {
    expect(comoTexto([])).toMatch(/sin apuntes/i)
  })

  // El registro se lee para encontrar la línea rara. Repetir los cinco stores
  // en cada apunte —tres renglones que dicen "todo bien"— tapa justamente eso.
  it('nombra los stores que faltan y no los que están', () => {
    const conFalta = comoTexto([apunte(1, { faltan: ['plantas', 'diario'] })])
    expect(conFalta).toContain('faltan: plantas,diario')

    const sano = comoTexto([apunte(1, { faltan: [] })])
    expect(sano).not.toContain('faltan')
    expect(sano).not.toContain('plantas,diario')
  })
})

describe('bitácora: nombrar el error', () => {
  // El `name` es lo que distingue una cuota llena de una base rota, y es lo
  // único que una persona puede copiar y mandar. El mensaje cambia entre
  // navegadores; el name, no.
  it('usa el name y no el mensaje', () => {
    expect(nombreError(new DOMException('lo que sea', 'QuotaExceededError'))).toBe(
      'QuotaExceededError',
    )
    expect(nombreError(new DOMException('no está', 'NotFoundError'))).toBe('NotFoundError')
  })

  it('no se queda sin nada cuando lo que llega no es un Error', () => {
    expect(nombreError('un string suelto')).toBeTruthy()
    expect(nombreError(undefined)).toBeTruthy()
    expect(nombreError(null)).toBeTruthy()
  })
})

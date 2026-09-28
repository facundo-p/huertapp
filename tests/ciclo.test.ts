import { describe, expect, it } from 'vitest'
import { casillerosDelCiclo, fechaDeMargen, llevaSello } from '../src/lib/huerta/ciclo'
import type { Planta, TipoEntrada } from '../src/lib/huerta/tipos'
import type { EspecieEnriquecida } from '../src/lib/data/types'
import db from '../data/huerta_gba_enriquecido.json'

const especies = db.especies as unknown as EspecieEnriquecida[]
const get = (s: string) => {
  const e = especies.find((x) => x.slug === s)
  if (!e) throw new Error(`falta ${s} en el catálogo`)
  return e
}

// Lechuga: germina en 4-10 días, se trasplanta a los 25-35, cosecha a los 50-120.
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

const claves = (cs: { clave: string }[]) => cs.map((c) => c.clave)
const elDeHoy = (cs: { clave: string; hoy: boolean }[]) => cs.filter((c) => c.hoy).map((c) => c.clave)

describe('los casilleros del ciclo', () => {
  it('en almácigo y ya asomada, el «hoy» cae en el trasplante, con la fecha desde la que se puede', () => {
    const cs = casillerosDelCiclo(planta({ germino: '2026-08-08' }), lechuga, '2026-08-20')
    expect(claves(cs)).toEqual(['siembra', 'asoma', 'trasplante', 'cosecha', 'fin'])
    expect(cs.map((c) => c.hecho)).toEqual([true, true, false, false, false])
    expect(elDeHoy(cs)).toEqual(['trasplante'])
    expect(cs[0]).toMatchObject({ nombre: 'Sembrada', fecha: SEMBRADA })
    expect(cs[1]).toMatchObject({ nombre: 'Asomó', fecha: '2026-08-08', nota: undefined })
    expect(cs[2]).toMatchObject({ fecha: '2026-08-26', nota: 'en adelante' })
    expect(cs[3]).toMatchObject({ fecha: '2026-09-20', nota: 'en adelante' })
    expect(cs[4].fecha).toBeUndefined()
  })

  it('si asomó tarde lo dice, y lo que sigue se corre con ella', () => {
    const cs = casillerosDelCiclo(planta({ germino: '2026-08-23' }), lechuga, '2026-08-25')
    expect(cs[1].nota).toBe('12 días tarde')
    expect(cs[2].fecha).toBe('2026-09-07')
  })

  it('y si asomó antes, también', () => {
    const cs = casillerosDelCiclo(planta({ germino: '2026-08-02' }), lechuga, '2026-08-05')
    expect(cs[1].nota).toBe('3 días antes')
  })

  it('sin asomar todavía, el «hoy» espera en «Asoma»', () => {
    const cs = casillerosDelCiclo(planta(), lechuga, '2026-08-03')
    expect(cs[1]).toMatchObject({ nombre: 'Asoma', fecha: '2026-08-05', hecho: false, hoy: true })
    expect(elDeHoy(cs)).toEqual(['asoma'])
    // lo que sigue depende de cuándo asome: germinacionPendiente lo calla, como en el resto de la página
    expect([cs[2].fecha, cs[2].nota, cs[3].fecha, cs[3].nota]).toEqual([undefined, undefined, undefined, undefined])
  })

  it('pasado el plazo sin asomar, «Asoma» no muestra una fecha vencida como por venir', () => {
    const cs = casillerosDelCiclo(planta(), lechuga, '2026-08-20')
    expect(cs[1]).toMatchObject({ nombre: 'Asoma', nota: 'se demora', hoy: true })
    expect([cs[1].fecha, cs[2].fecha, cs[3].fecha]).toEqual([undefined, undefined, undefined])
  })

  it('la siembra directa no tiene trasplante', () => {
    const cs = casillerosDelCiclo(
      planta({ metodo: 'directa', etapa: 'creciendo', germino: '2026-08-08' }),
      lechuga,
      '2026-08-20',
    )
    expect(claves(cs)).toEqual(['siembra', 'asoma', 'cosecha', 'fin'])
    expect(elDeHoy(cs)).toEqual(['cosecha'])
  })

  it('lo plantado no germina ni se trasplanta', () => {
    const ajo = get('ajo')
    const cs = casillerosDelCiclo(
      planta({ slug: 'ajo', metodo: 'plantacion', etapa: 'creciendo' }),
      ajo,
      '2026-08-20',
    )
    expect(claves(cs)).toEqual(['siembra', 'cosecha', 'fin'])
    expect(cs[0].nombre).toBe('Plantada')
  })

  it('trasplantada sin haber marcado que asomó: asomó igual, sin fecha inventada', () => {
    const cs = casillerosDelCiclo(
      planta({ etapa: 'trasplantada', etapaDesde: '2026-09-01' }),
      lechuga,
      '2026-09-05',
    )
    expect(cs[1]).toMatchObject({ nombre: 'Asomó', hecho: true, fecha: undefined })
    expect(cs[2]).toMatchObject({ clave: 'trasplante', hecho: true, fecha: '2026-09-01' })
    expect(elDeHoy(cs)).toEqual(['cosecha'])
  })

  it('y pasada a «creciendo», tampoco vuelve a esperar que asome', () => {
    // esperaGerminacion vuelve a dar true en «creciendo»: lo que la salva es el almácigo
    const cs = casillerosDelCiclo(
      planta({ etapa: 'creciendo', etapaDesde: '2026-09-10' }),
      lechuga,
      '2026-09-12',
    )
    expect(cs[1]).toMatchObject({ nombre: 'Asomó', hecho: true })
    expect(elDeHoy(cs)).toEqual(['cosecha'])
  })

  it('sin método anotado, que esté trasplantada alcanza para el casillero', () => {
    const cs = casillerosDelCiclo(
      planta({ metodo: null, etapa: 'trasplantada', etapaDesde: '2026-09-01' }),
      lechuga,
      '2026-09-05',
    )
    expect(claves(cs)).toEqual(['siembra', 'asoma', 'trasplante', 'cosecha', 'fin'])
    expect(cs[2]).toMatchObject({ hecho: true, fecha: '2026-09-01' })
  })

  it('cosechando: la cosecha tiene la fecha en que empezó y el «hoy» pasa al final', () => {
    const cs = casillerosDelCiclo(
      planta({ etapa: 'cosechando', etapaDesde: '2026-10-10', germino: '2026-08-08' }),
      lechuga,
      '2026-10-15',
    )
    expect(cs.find((c) => c.clave === 'cosecha')).toMatchObject({ hecho: true, fecha: '2026-10-10' })
    // el trasplante se hizo, pero su fecha se pisó al cambiar de etapa
    expect(cs.find((c) => c.clave === 'trasplante')).toMatchObject({ hecho: true, fecha: undefined })
    expect(elDeHoy(cs)).toEqual(['fin'])
  })

  it('terminada, está todo hecho y no queda «hoy»', () => {
    const cs = casillerosDelCiclo(
      planta({ etapa: 'terminada', etapaDesde: '2026-12-01', germino: '2026-08-08' }),
      lechuga,
      '2026-12-05',
    )
    expect(cs.every((c) => c.hecho)).toBe(true)
    expect(elDeHoy(cs)).toEqual([])
    expect(cs.at(-1)?.fecha).toBe('2026-12-01')
  })

  it('sin la especie en el catálogo, los que faltan van sin fecha', () => {
    const cs = casillerosDelCiclo(planta({ germino: '2026-08-08' }), undefined, '2026-08-20')
    expect(cs.filter((c) => !c.hecho).every((c) => c.fecha === undefined && c.nota === undefined)).toBe(true)
    expect(elDeHoy(cs)).toEqual(['trasplante'])
  })

  it('la fecha es la que se le pasa: sembrada para más adelante, el «hoy» queda en la siembra', () => {
    const cs = casillerosDelCiclo(planta(), lechuga, '2026-07-28')
    expect(cs[0].hecho).toBe(false)
    expect(elDeHoy(cs)).toEqual(['siembra'])
  })
})

describe('el sello del diario', () => {
  it('va en los hitos cumplidos y no en lo de todos los días', () => {
    const con: TipoEntrada[] = ['trasplante', 'floracion', 'cosecha']
    const sin: TipoEntrada[] = ['nota', 'riego', 'plaga']
    expect(con.map(llevaSello)).toEqual([true, true, true])
    expect(sin.map(llevaSello)).toEqual([false, false, false])
  })
})

describe('la fecha al margen', () => {
  it('día y mes, sin ceros', () => {
    expect(fechaDeMargen('2026-09-05')).toBe('5/9')
    expect(fechaDeMargen('2026-11-27')).toBe('27/11')
  })
})

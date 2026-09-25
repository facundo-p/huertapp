import { describe, expect, it } from 'vitest'
import { agruparPorPie, distinguir, type DondeCrece } from '../src/lib/tareas/agrupar'
import type { Tarea } from '../src/lib/tareas/engine'

const FUENTE = 'según la ficha: 25-35 días desde la siembra · confianza 7/10'

const tarea = (t: Partial<Tarea>): Tarea => ({
  id: 'x',
  tipo: 'trasplantar',
  slug: 'lechuga',
  titulo: 'Lechuga: hora de trasplantar',
  detalle: 'Ya tiene edad de pasar a su lugar definitivo.',
  fuente: FUENTE,
  prioridad: 1,
  fecha: '2026-08-15',
  ...t,
})

describe('el pie compartido del carril', () => {
  it('cinco plantas de la misma especie muestran el pie una sola vez', () => {
    const g = agruparPorPie([1, 2, 3, 4, 5].map((n) => tarea({ id: `t${n}` })))
    expect(g).toHaveLength(1)
    expect(g[0].tareas).toHaveLength(5)
    expect(g[0].fuente).toBe(FUENTE)
  })

  it('la planta a la que le corrió la germinación no habla por las otras', () => {
    const g = agruparPorPie([
      tarea({ id: 't1' }),
      tarea({ id: 't2', fuente: `${FUENTE} · corrido 4 días porque asomó tarde` }),
    ])
    expect(g).toHaveLength(2)
  })

  it('no junta dos especies aunque la ficha les diga lo mismo', () => {
    const g = agruparPorPie([tarea({ id: 't1' }), tarea({ id: 't2', slug: 'rucula' })])
    expect(g).toHaveLength(2)
  })

  it('no junta dos tipos de tarea de la misma especie', () => {
    const g = agruparPorPie([tarea({ id: 't1' }), tarea({ id: 't2', tipo: 'cosechar' })])
    expect(g).toHaveLength(2)
  })

  it('las tareas sin especie —helada, compost— quedan cada una en lo suyo', () => {
    const g = agruparPorPie([
      tarea({ id: 'helada:1', tipo: 'helada', slug: undefined }),
      tarea({ id: 'helada:2', tipo: 'helada', slug: undefined }),
    ])
    expect(g).toHaveLength(2)
  })

  it('no pierde tareas ni repite ninguna', () => {
    const ts = [tarea({ id: 'a' }), tarea({ id: 'b', slug: 'rucula' }), tarea({ id: 'c' })]
    const planas = agruparPorPie(ts).flatMap((g) => g.tareas)
    expect(planas).toHaveLength(3)
    expect(new Set(planas.map((t) => t.id)).size).toBe(3)
  })

  it('respeta el orden de aparición de cada grupo', () => {
    const g = agruparPorPie([
      tarea({ id: 'a', slug: 'rucula' }),
      tarea({ id: 'b' }),
      tarea({ id: 'c', slug: 'rucula' }),
    ])
    expect(g.map((x) => x.tareas.map((t) => t.id))).toEqual([['a', 'c'], ['b']])
  })

  it('la instrucción viaja con el grupo, para que el pie no la repita', () => {
    const [g] = agruparPorPie([tarea({ id: 't1', instruccion: true }), tarea({ id: 't2', instruccion: true })])
    expect(g.instruccion).toBe(true)
    expect(agruparPorPie([tarea({})])[0].instruccion).toBeUndefined()
  })
})

describe('dos grupos que se llaman igual', () => {
  // dos zanahorias sin apodo sembradas en días distintos: mismo título, otro atraso
  const zanahoria = (id: string, diasDeMas: number) =>
    tarea({
      id: `revisar_germinacion:${id}`,
      tipo: 'revisar_germinacion',
      plantaId: id,
      slug: 'zanahoria',
      titulo: 'Zanahoria: fijate si asomó',
      detalle: `Hace ${diasDeMas} días que se pasó del plazo.`,
      fuente: 'según la ficha: germina en 10-20 días · confianza 7/10',
    })
  const donde = (d: Record<string, DondeCrece>) => new Map(Object.entries(d))

  it('en distinto lugar, dice el lugar en la fila y en el pie', () => {
    const grupos = agruparPorPie([zanahoria('a', 12), zanahoria('b', 10)])
    const d = distinguir(
      grupos,
      donde({
        a: { lugar: 'Bancal del fondo', sembrada: '2026-08-24' },
        b: { lugar: 'Bancal de la medianera', sembrada: '2026-08-26' },
      }),
    )
    expect(d.porTarea.get('revisar_germinacion:a')).toBe('Bancal del fondo')
    expect(d.porTarea.get('revisar_germinacion:b')).toBe('Bancal de la medianera')
    expect(grupos.map((g) => d.porGrupo.get(g.clave))).toEqual(['Bancal del fondo', 'Bancal de la medianera'])
  })

  it('en el mismo lugar, suma cuándo se sembró cada una', () => {
    const grupos = agruparPorPie([zanahoria('a', 12), zanahoria('b', 10)])
    const d = distinguir(
      grupos,
      donde({
        a: { lugar: 'Bancal del fondo', sembrada: '2026-09-03' },
        b: { lugar: 'Bancal del fondo', sembrada: '2026-09-05' },
      }),
    )
    expect(d.porTarea.get('revisar_germinacion:a')).toBe('Bancal del fondo, sembrada el 3/9')
    expect(d.porTarea.get('revisar_germinacion:b')).toBe('Bancal del fondo, sembrada el 5/9')
  })

  it('sin choque no agrega nada, aunque estén en lugares distintos', () => {
    const lugares = donde({
      a: { lugar: 'Bancal del fondo', sembrada: '2026-08-24' },
      b: { lugar: 'Bancal de la medianera', sembrada: '2026-08-24' },
    })
    // mismo pie: un solo grupo, y un solo encabezado
    const juntas = distinguir(agruparPorPie([zanahoria('a', 12), zanahoria('b', 12)]), lugares)
    expect(juntas.porTarea.size).toBe(0)
    expect(juntas.porGrupo.size).toBe(0)
    // títulos distintos: el encabezado ya las separa
    const otra = { ...zanahoria('b', 10), titulo: 'La segunda tanda: fijate si asomó' }
    expect(distinguir(agruparPorPie([zanahoria('a', 12), otra]), lugares).porTarea.size).toBe(0)
  })

  it('la planta sin lugar se dice «sin lugar»', () => {
    const d = distinguir(
      agruparPorPie([zanahoria('a', 12), zanahoria('b', 10)]),
      donde({ a: { lugar: 'Bancal del fondo', sembrada: '2026-08-24' }, b: { sembrada: '2026-08-26' } }),
    )
    expect(d.porTarea.get('revisar_germinacion:b')).toBe('sin lugar')
    expect(d.porTarea.get('revisar_germinacion:a')).toBe('Bancal del fondo')
  })

  it('la fecha va sólo donde el lugar no alcanza', () => {
    // a y b comparten pie; c choca con ese pie y está en el lugar de a
    const grupos = agruparPorPie([zanahoria('a', 12), zanahoria('b', 12), zanahoria('c', 10)])
    const d = distinguir(
      grupos,
      donde({
        a: { lugar: 'Bancal del fondo', sembrada: '2026-08-24' },
        b: { lugar: 'Bancal de la medianera', sembrada: '2026-08-24' },
        c: { lugar: 'Bancal del fondo', sembrada: '2026-08-26' },
      }),
    )
    expect(d.porTarea.get('revisar_germinacion:b')).toBe('Bancal de la medianera')
    expect(grupos.map((g) => d.porGrupo.get(g.clave))).toEqual([
      'Bancal del fondo, sembrada el 24/8 · Bancal de la medianera',
      'Bancal del fondo, sembrada el 26/8',
    ])
  })
})

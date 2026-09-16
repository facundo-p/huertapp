import { describe, expect, it } from 'vitest'
import { agruparPorPie } from '../src/lib/tareas/agrupar'
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
})

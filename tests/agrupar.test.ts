import { describe, expect, it } from 'vitest'
import { agruparPorPie, distinguir, etiquetaPie, type DondeCrece } from '../src/lib/tareas/agrupar'
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

describe('el botón del pie', () => {
  const helada = tarea({ id: 'helada:1', tipo: 'helada', slug: undefined, instruccion: true })

  it('con algún porqué plegado, lo anuncia', () => {
    expect(etiquetaPie(agruparPorPie([tarea({})]))).toBe('por qué y de dónde sale')
    expect(etiquetaPie(agruparPorPie([helada, tarea({})]))).toBe('por qué y de dónde salen')
  })

  it('si todo el día es instrucción, adentro sólo queda la fuente', () => {
    expect(etiquetaPie(agruparPorPie([helada]))).toBe('de dónde sale')
    const riesgosas = [1, 2].map((n) => tarea({ id: `t${n}`, instruccion: true }))
    expect(etiquetaPie(agruparPorPie([helada, ...riesgosas]))).toBe('de dónde salen')
  })
})

describe('dos tareas que se llaman igual', () => {
  // zanahorias sin apodo: el atraso depende de la siembra, así que dos sembradas
  // el mismo día comparten pie y dos sembradas en días distintos, no
  const zanahoria = (id: string, diasDeMas = 12, titulo = 'Zanahoria: fijate si asomó') =>
    tarea({
      id: `revisar_germinacion:${id}`,
      tipo: 'revisar_germinacion',
      plantaId: id,
      slug: 'zanahoria',
      titulo,
      detalle: `Hace ${diasDeMas} días que se pasó del plazo.`,
      fuente: 'según la ficha: germina en 10-20 días · confianza 7/10',
    })
  const donde = (d: Record<string, DondeCrece>) => new Map(Object.entries(d))
  const FONDO = 'Bancal del fondo'
  const MEDIANERA = 'Bancal de la medianera'
  const etiqueta = (d: ReturnType<typeof distinguir>, id: string) => d.porTarea.get(`revisar_germinacion:${id}`)

  it('sembradas el mismo día en dos bancales: un solo pie, y cada fila dice el suyo', () => {
    const grupos = agruparPorPie([zanahoria('a'), zanahoria('b')])
    expect(grupos).toHaveLength(1)
    const d = distinguir(
      grupos,
      donde({ a: { lugar: FONDO, sembrada: '2026-08-24' }, b: { lugar: MEDIANERA, sembrada: '2026-08-24' } }),
    )
    expect(etiqueta(d, 'a')).toBe(FONDO)
    expect(etiqueta(d, 'b')).toBe(MEDIANERA)
    expect(d.porGrupo.get(grupos[0].clave)).toBe(`${FONDO} · ${MEDIANERA}`)
  })

  it('en grupos distintos y lugares distintos, cada pie dice el suyo', () => {
    const grupos = agruparPorPie([zanahoria('a', 12), zanahoria('b', 10)])
    const d = distinguir(
      grupos,
      donde({ a: { lugar: FONDO, sembrada: '2026-08-24' }, b: { lugar: MEDIANERA, sembrada: '2026-08-26' } }),
    )
    expect(grupos.map((g) => d.porGrupo.get(g.clave))).toEqual([FONDO, MEDIANERA])
  })

  it('con grupos que se pisan en parte, igual ve el choque', () => {
    // [Zanahoria, La segunda tanda] y [Zanahoria]: los encabezados no son iguales
    const grupos = agruparPorPie([
      zanahoria('a', 12),
      zanahoria('b', 12, 'La segunda tanda: fijate si asomó'),
      zanahoria('c', 10),
    ])
    expect(grupos).toHaveLength(2)
    const d = distinguir(
      grupos,
      donde({
        a: { lugar: FONDO, sembrada: '2026-08-24' },
        b: { lugar: FONDO, sembrada: '2026-08-24' },
        c: { lugar: MEDIANERA, sembrada: '2026-08-26' },
      }),
    )
    // la segunda tanda ya se distingue por el título
    expect(etiqueta(d, 'b')).toBeUndefined()
    expect(grupos.map((g) => d.porGrupo.get(g.clave))).toEqual([FONDO, MEDIANERA])
  })

  it('en el mismo lugar, suma cuándo se sembró cada una', () => {
    const d = distinguir(
      agruparPorPie([zanahoria('a', 12), zanahoria('b', 10)]),
      donde({ a: { lugar: FONDO, sembrada: '2026-09-03' }, b: { lugar: FONDO, sembrada: '2026-09-05' } }),
    )
    expect(etiqueta(d, 'a')).toBe(`${FONDO}, sembrada el 3/9`)
    expect(etiqueta(d, 'b')).toBe(`${FONDO}, sembrada el 5/9`)
  })

  it('la fecha va sólo donde el lugar no alcanza', () => {
    const d = distinguir(
      agruparPorPie([zanahoria('a', 12), zanahoria('b', 12), zanahoria('c', 10)]),
      donde({
        a: { lugar: FONDO, sembrada: '2026-08-24' },
        b: { lugar: MEDIANERA, sembrada: '2026-08-24' },
        c: { lugar: FONDO, sembrada: '2026-08-26' },
      }),
    )
    expect(etiqueta(d, 'a')).toBe(`${FONDO}, sembrada el 24/8`)
    expect(etiqueta(d, 'b')).toBe(MEDIANERA)
    expect(etiqueta(d, 'c')).toBe(`${FONDO}, sembrada el 26/8`)
  })

  it('mismo apodo, mismo lugar y misma siembra: desempata la especie', () => {
    const trasplante = (id: string, slug: string) =>
      tarea({ id, plantaId: id, slug, titulo: 'La del vivero: hora de trasplantar' })
    const d = distinguir(
      agruparPorPie([trasplante('t', 'tomate'), trasplante('p', 'pimiento')]),
      donde({
        t: { lugar: FONDO, sembrada: '2026-08-24', especie: 'Tomate' },
        p: { lugar: FONDO, sembrada: '2026-08-24', especie: 'Pimiento / Morrón' },
      }),
    )
    expect(d.porTarea.get('t')).toBe(`${FONDO}, tomate`)
    expect(d.porTarea.get('p')).toBe(`${FONDO}, pimiento / morrón`)
  })

  it('y si también son la misma especie, desempata cuándo asomó', () => {
    const trasplante = (id: string) => tarea({ id, plantaId: id, titulo: 'Lechuga: hora de trasplantar' })
    const d = distinguir(
      agruparPorPie([trasplante('a'), trasplante('b')]),
      donde({
        a: { lugar: FONDO, sembrada: '2026-08-24', germino: '2026-08-30' },
        b: { lugar: FONDO, sembrada: '2026-08-24', germino: '2026-09-02' },
      }),
    )
    expect(d.porTarea.get('a')).toBe(`${FONDO}, asomó el 30/8`)
    expect(d.porTarea.get('b')).toBe(`${FONDO}, asomó el 2/9`)
  })

  it('lo que sigue empatado queda igual: no se inventa una diferencia', () => {
    const d = distinguir(
      agruparPorPie([zanahoria('a'), zanahoria('b')]),
      donde({ a: { lugar: FONDO, sembrada: '2026-08-24' }, b: { lugar: FONDO, sembrada: '2026-08-24' } }),
    )
    expect(etiqueta(d, 'a')).toBe(FONDO)
    expect(etiqueta(d, 'b')).toBe(FONDO)
  })

  it('sin títulos repetidos no agrega nada, aunque estén en lugares distintos', () => {
    const d = distinguir(
      agruparPorPie([zanahoria('a'), zanahoria('b', 12, 'La segunda tanda: fijate si asomó')]),
      donde({ a: { lugar: FONDO, sembrada: '2026-08-24' }, b: { lugar: MEDIANERA, sembrada: '2026-08-24' } }),
    )
    expect(d.porTarea.size).toBe(0)
    expect(d.porGrupo.size).toBe(0)
  })

  it('la planta sin lugar se dice «sin lugar asignado»', () => {
    const d = distinguir(
      agruparPorPie([zanahoria('a', 12), zanahoria('b', 10)]),
      donde({ a: { lugar: FONDO, sembrada: '2026-08-24' }, b: { sembrada: '2026-08-26' } }),
    )
    expect(etiqueta(d, 'a')).toBe(FONDO)
    expect(etiqueta(d, 'b')).toBe('sin lugar asignado')
  })
})

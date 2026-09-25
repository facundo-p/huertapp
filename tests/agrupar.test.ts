import { describe, expect, it } from 'vitest'
import { agruparPorPie, distinguir, dondeCreceDe, etiquetaPie, type DondeCrece } from '../src/lib/tareas/agrupar'
import type { Tarea } from '../src/lib/tareas/engine'
import type { Planta, Ubicacion } from '../src/lib/huerta/tipos'

const FUENTE = 'según la ficha: 25-35 días desde la siembra · confianza 7/10'
const HOY = '2026-08-15'

const tarea = (t: Partial<Tarea>): Tarea => ({
  id: 'x',
  tipo: 'trasplantar',
  slug: 'lechuga',
  titulo: 'Lechuga: hora de trasplantar',
  detalle: 'Ya tiene edad de pasar a su lugar definitivo.',
  fuente: FUENTE,
  prioridad: 1,
  fecha: HOY,
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

  it('el mismo pie en dos días no comparte clave', () => {
    const [a] = agruparPorPie([tarea({ id: 't1' })])
    const [b] = agruparPorPie([tarea({ id: 't2', fecha: '2026-08-20' })])
    expect(a.clave).not.toBe(b.clave)
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
  const MACETAS = 'Macetas del balcón'
  const ZANAHORIA = 'Zanahoria: fijate si asomó'
  const SEGUNDA = 'La segunda tanda: fijate si asomó'
  const etiqueta = (d: ReturnType<typeof distinguir>, id: string) => d.porTarea.get(`revisar_germinacion:${id}`)

  it('sembradas el mismo día en dos bancales: un solo pie, y cada fila dice el suyo', () => {
    const grupos = agruparPorPie([zanahoria('a'), zanahoria('b')])
    expect(grupos).toHaveLength(1)
    const d = distinguir(
      grupos,
      donde({ a: { lugar: FONDO, sembrada: '2026-08-24' }, b: { lugar: MEDIANERA, sembrada: '2026-08-24' } }),
      HOY,
    )
    expect(etiqueta(d, 'a')).toBe(FONDO)
    expect(etiqueta(d, 'b')).toBe(MEDIANERA)
    expect(d.porGrupo.get(grupos[0].clave)).toEqual([{ titulo: ZANAHORIA, lugares: `${FONDO} · ${MEDIANERA}` }])
  })

  it('en un pie de dos títulos, cada lugar va en el renglón de su título', () => {
    // la segunda tanda no se repite: su renglón no lleva lugar, y el de las
    // zanahorias no se le atribuye
    const grupos = agruparPorPie([zanahoria('a'), zanahoria('b'), zanahoria('c', 12, SEGUNDA)])
    expect(grupos).toHaveLength(1)
    const d = distinguir(
      grupos,
      donde({
        a: { lugar: FONDO, sembrada: '2026-08-24' },
        b: { lugar: MEDIANERA, sembrada: '2026-08-24' },
        c: { lugar: MACETAS, sembrada: '2026-08-24' },
      }),
      HOY,
    )
    expect(d.porGrupo.get(grupos[0].clave)).toEqual([
      { titulo: ZANAHORIA, lugares: `${FONDO} · ${MEDIANERA}` },
      { titulo: SEGUNDA },
    ])
  })

  it('en grupos distintos y lugares distintos, cada pie dice el suyo', () => {
    const grupos = agruparPorPie([zanahoria('a', 12), zanahoria('b', 10)])
    const d = distinguir(
      grupos,
      donde({ a: { lugar: FONDO, sembrada: '2026-08-24' }, b: { lugar: MEDIANERA, sembrada: '2026-08-26' } }),
      HOY,
    )
    expect(grupos.map((g) => d.porGrupo.get(g.clave))).toEqual([
      [{ titulo: ZANAHORIA, lugares: FONDO }],
      [{ titulo: ZANAHORIA, lugares: MEDIANERA }],
    ])
  })

  it('con grupos que se pisan en parte, igual ve el choque', () => {
    // [Zanahoria, La segunda tanda] y [Zanahoria]: los encabezados no son iguales
    const grupos = agruparPorPie([zanahoria('a', 12), zanahoria('b', 12, SEGUNDA), zanahoria('c', 10)])
    expect(grupos).toHaveLength(2)
    const d = distinguir(
      grupos,
      donde({
        a: { lugar: FONDO, sembrada: '2026-08-24' },
        b: { lugar: MACETAS, sembrada: '2026-08-24' },
        c: { lugar: MEDIANERA, sembrada: '2026-08-26' },
      }),
      HOY,
    )
    // la segunda tanda ya se distingue por el título
    expect(etiqueta(d, 'b')).toBeUndefined()
    expect(grupos.map((g) => d.porGrupo.get(g.clave))).toEqual([
      [{ titulo: ZANAHORIA, lugares: FONDO }, { titulo: SEGUNDA }],
      [{ titulo: ZANAHORIA, lugares: MEDIANERA }],
    ])
  })

  it('en el mismo lugar, suma cuándo se sembró cada una', () => {
    const d = distinguir(
      agruparPorPie([zanahoria('a', 12), zanahoria('b', 10)]),
      donde({ a: { lugar: FONDO, sembrada: '2026-09-03' }, b: { lugar: FONDO, sembrada: '2026-09-05' } }),
      HOY,
    )
    expect(etiqueta(d, 'a')).toBe(`${FONDO}, sembrada el 3 sept`)
    expect(etiqueta(d, 'b')).toBe(`${FONDO}, sembrada el 5 sept`)
  })

  it('si las siembras son de años distintos, suma el año', () => {
    const d = distinguir(
      agruparPorPie([zanahoria('a', 12), zanahoria('b', 10)]),
      donde({ a: { lugar: FONDO, sembrada: '2025-09-03' }, b: { lugar: FONDO, sembrada: '2026-09-03' } }),
      HOY,
    )
    expect(etiqueta(d, 'a')).toBe(`${FONDO}, sembrada el 3 de sept de 2025`)
    expect(etiqueta(d, 'b')).toBe(`${FONDO}, sembrada el 3 de sept de 2026`)
  })

  it('la fecha va sólo donde el lugar no alcanza', () => {
    const d = distinguir(
      agruparPorPie([zanahoria('a', 12), zanahoria('b', 12), zanahoria('c', 10)]),
      donde({
        a: { lugar: FONDO, sembrada: '2026-08-24' },
        b: { lugar: MEDIANERA, sembrada: '2026-08-24' },
        c: { lugar: FONDO, sembrada: '2026-08-26' },
      }),
      HOY,
    )
    expect(etiqueta(d, 'a')).toBe(`${FONDO}, sembrada el 24 ago`)
    expect(etiqueta(d, 'b')).toBe(MEDIANERA)
    expect(etiqueta(d, 'c')).toBe(`${FONDO}, sembrada el 26 ago`)
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
      HOY,
    )
    expect(d.porTarea.get('t')).toBe(`${FONDO}, Tomate`)
    expect(d.porTarea.get('p')).toBe(`${FONDO}, Pimiento / Morrón`)
  })

  it('y si también son la misma especie, desempata cuándo asomó', () => {
    const trasplante = (id: string) => tarea({ id, plantaId: id, titulo: 'Lechuga: hora de trasplantar' })
    const d = distinguir(
      agruparPorPie([trasplante('a'), trasplante('b')]),
      donde({
        a: { lugar: FONDO, sembrada: '2026-08-24', germino: '2026-08-30' },
        b: { lugar: FONDO, sembrada: '2026-08-24', germino: '2026-09-02' },
      }),
      HOY,
    )
    expect(d.porTarea.get('a')).toBe(`${FONDO}, asomó el 30 ago`)
    expect(d.porTarea.get('b')).toBe(`${FONDO}, asomó el 2 sept`)
  })

  // la cosecha: es la única que sale mientras la germinación sigue sin marcar
  const cosecha = (id: string) =>
    tarea({ id, plantaId: id, tipo: 'cosechar', titulo: 'Lechuga ya estaría para cosechar' })

  it('a la que no le marcaste cuándo asomó, se le dice así', () => {
    const d = distinguir(
      agruparPorPie([cosecha('a'), cosecha('b')]),
      donde({
        a: { lugar: FONDO, sembrada: '2026-08-24', germino: '2026-08-30' },
        b: { lugar: FONDO, sembrada: '2026-08-24', esperaGerminar: true },
      }),
      HOY,
    )
    expect(d.porTarea.get('a')).toBe(`${FONDO}, asomó el 30 ago`)
    expect(d.porTarea.get('b')).toBe(`${FONDO}, sin marcar cuándo asomó`)
  })

  it('a la que la app no le pide marcarlo (plantada, o cargada ya crecida) no se le dice que falta', () => {
    const d = distinguir(
      agruparPorPie([cosecha('a'), cosecha('b')]),
      donde({
        a: { lugar: FONDO, sembrada: '2026-08-24', germino: '2026-08-30' },
        b: { lugar: FONDO, sembrada: '2026-08-24', esperaGerminar: false },
      }),
      HOY,
    )
    expect(d.porTarea.get('a')).toBe(`${FONDO}, asomó el 30 ago`)
    expect(d.porTarea.get('b')).toBe(FONDO)
  })

  it('«Maceta» y «maceta» son el mismo lugar: desempata la siembra', () => {
    const d = distinguir(
      agruparPorPie([zanahoria('a'), zanahoria('b')]),
      donde({ a: { lugar: 'Maceta', sembrada: '2026-08-24' }, b: { lugar: 'maceta', sembrada: '2026-08-26' } }),
      HOY,
    )
    expect(etiqueta(d, 'a')).toBe('Maceta, sembrada el 24 ago')
    expect(etiqueta(d, 'b')).toBe('maceta, sembrada el 26 ago')
  })

  it('el apodo «zanahoria» y la «Zanahoria» del catálogo se llaman igual, también en el pie', () => {
    const grupos = agruparPorPie([zanahoria('a'), zanahoria('b', 12, 'zanahoria: fijate si asomó')])
    const d = distinguir(
      grupos,
      donde({ a: { lugar: FONDO, sembrada: '2026-08-24' }, b: { lugar: MEDIANERA, sembrada: '2026-08-24' } }),
      HOY,
    )
    expect(etiqueta(d, 'a')).toBe(FONDO)
    expect(etiqueta(d, 'b')).toBe(MEDIANERA)
    expect(d.porGrupo.get(grupos[0].clave)).toEqual([{ titulo: ZANAHORIA, lugares: `${FONDO} · ${MEDIANERA}` }])
  })

  it('lo que sigue empatado queda igual: no se inventa una diferencia', () => {
    const d = distinguir(
      agruparPorPie([zanahoria('a'), zanahoria('b')]),
      donde({ a: { lugar: FONDO, sembrada: '2026-08-24' }, b: { lugar: FONDO, sembrada: '2026-08-24' } }),
      HOY,
    )
    expect(etiqueta(d, 'a')).toBe(FONDO)
    expect(etiqueta(d, 'b')).toBe(FONDO)
  })

  it('sin títulos repetidos no agrega nada, aunque estén en lugares distintos', () => {
    const d = distinguir(
      agruparPorPie([zanahoria('a'), zanahoria('b', 12, SEGUNDA)]),
      donde({ a: { lugar: FONDO, sembrada: '2026-08-24' }, b: { lugar: MEDIANERA, sembrada: '2026-08-24' } }),
      HOY,
    )
    expect(d.porTarea.size).toBe(0)
    expect([...d.porGrupo.values()].flat().every((e) => !e.lugares)).toBe(true)
  })

  it('en el mismo lugar, antes que la siembra, dice cómo está puesta, tal cual la escribiste', () => {
    const d = distinguir(
      agruparPorPie([zanahoria('a', 12), zanahoria('b', 10)]),
      donde({
        a: { lugar: FONDO, sembrada: '2026-08-24', comoEsta: 'Intercalada entre las lechugas' },
        b: { lugar: FONDO, sembrada: '2026-08-26' },
      }),
      HOY,
    )
    expect(etiqueta(d, 'a')).toBe(`${FONDO}, Intercalada entre las lechugas`)
    // a la otra la separa lo que no tiene: no se le inventa un texto
    expect(etiqueta(d, 'b')).toBe(FONDO)
  })

  it('«Intercalada» e «intercalada» son lo mismo: sigue desempatando la siembra', () => {
    const d = distinguir(
      agruparPorPie([zanahoria('a', 12), zanahoria('b', 10)]),
      donde({
        a: { lugar: FONDO, sembrada: '2026-08-01', comoEsta: 'Intercalada' },
        b: { lugar: FONDO, sembrada: '2026-08-03', comoEsta: 'intercalada' },
      }),
      HOY,
    )
    expect(etiqueta(d, 'a')).toBe(`${FONDO}, sembrada el 1 ago`)
    expect(etiqueta(d, 'b')).toBe(`${FONDO}, sembrada el 3 ago`)
  })

  it('misma especie, lugar y siembra: desempata la variedad que anotaste', () => {
    const trasplante = (id: string) =>
      tarea({ id, plantaId: id, slug: 'albahaca', titulo: 'Albahaca: hora de trasplantar' })
    const d = distinguir(
      agruparPorPie([trasplante('v'), trasplante('m')]),
      donde({
        v: { lugar: FONDO, sembrada: '2026-08-24', especie: 'Albahaca' },
        m: { lugar: FONDO, sembrada: '2026-08-24', especie: 'Albahaca', variedad: 'Morada' },
      }),
      HOY,
    )
    expect(d.porTarea.get('m')).toBe(`${FONDO}, Morada`)
    expect(d.porTarea.get('v')).toBe(FONDO)
  })

  it('«Genovesa» y «genovesa» son la misma variedad, y cada una se dice como la escribiste', () => {
    const trasplante = (id: string) =>
      tarea({ id, plantaId: id, slug: 'albahaca', titulo: 'Albahaca: hora de trasplantar' })
    const d = distinguir(
      agruparPorPie([trasplante('g'), trasplante('m'), trasplante('n')]),
      donde({
        g: { lugar: FONDO, sembrada: '2026-08-24', variedad: 'Genovesa', germino: '2026-08-30' },
        m: { lugar: FONDO, sembrada: '2026-08-24', variedad: 'genovesa', germino: '2026-09-02' },
        n: { lugar: FONDO, sembrada: '2026-08-24', variedad: 'Morada' },
      }),
      HOY,
    )
    // la variedad las separa de la morada, pero entre ellas desempata cuándo asomó
    expect(d.porTarea.get('g')).toBe(`${FONDO}, Genovesa, asomó el 30 ago`)
    expect(d.porTarea.get('m')).toBe(`${FONDO}, genovesa, asomó el 2 sept`)
    expect(d.porTarea.get('n')).toBe(`${FONDO}, Morada`)
  })

  it('en días distintos también: el día no dice cuál es', () => {
    const hoy = zanahoria('a')
    const jueves = { ...zanahoria('b'), fecha: '2026-08-20' }
    const plantas = donde({
      a: { lugar: FONDO, sembrada: '2026-08-24' },
      b: { lugar: MEDIANERA, sembrada: '2026-08-24' },
    })
    // mismo pie en los dos días: cada encabezado dice el suyo, sin pisarse
    const grupos = [...agruparPorPie([hoy]), ...agruparPorPie([jueves])]
    const d = distinguir(grupos, plantas, HOY)
    expect(etiqueta(d, 'a')).toBe(FONDO)
    expect(etiqueta(d, 'b')).toBe(MEDIANERA)
    expect(grupos.map((g) => d.porGrupo.get(g.clave))).toEqual([
      [{ titulo: ZANAHORIA, lugares: FONDO }],
      [{ titulo: ZANAHORIA, lugares: MEDIANERA }],
    ])
    // sin la semana, el día solo no ve el choque
    expect(distinguir(agruparPorPie([hoy]), plantas, HOY).porTarea.size).toBe(0)
  })

  it('la planta sin lugar se dice «sin lugar asignado»', () => {
    const d = distinguir(
      agruparPorPie([zanahoria('a', 12), zanahoria('b', 10)]),
      donde({ a: { lugar: FONDO, sembrada: '2026-08-24' }, b: { sembrada: '2026-08-26' } }),
      HOY,
    )
    expect(etiqueta(d, 'a')).toBe(FONDO)
    expect(etiqueta(d, 'b')).toBe('sin lugar asignado')
  })
})

describe('dos tareas sin planta que se llaman igual', () => {
  // una helada por década: el sábado 15 cierra mediados y el viernes 21 arranca fines
  const helada = (fecha: string) =>
    tarea({ id: `helada:${fecha}`, tipo: 'helada', slug: undefined, titulo: 'Puede helar', instruccion: true, fecha })
  const sabado = helada(HOY)
  const viernes = helada('2026-08-21')

  it('las separa el día: «hoy» o el día entero, como el botón del pie', () => {
    const d = distinguir([...agruparPorPie([sabado]), ...agruparPorPie([viernes])], new Map(), HOY)
    expect(d.porTarea.get(sabado.id)).toBe('hoy')
    expect(d.porTarea.get(viernes.id)).toBe('viernes, 21 de agosto')
  })

  it('el pie no lo repite: ya está en la fila de su día', () => {
    const grupos = [...agruparPorPie([sabado]), ...agruparPorPie([viernes])]
    const d = distinguir(grupos, new Map(), HOY)
    expect(grupos.map((g) => d.porGrupo.get(g.clave))).toEqual([
      [{ titulo: 'Puede helar' }],
      [{ titulo: 'Puede helar' }],
    ])
  })

  it('una sola en la semana no suma nada', () => {
    expect(distinguir(agruparPorPie([sabado]), new Map(), HOY).porTarea.size).toBe(0)
  })

  // Fija lo que pasa hoy, no lo que debería: cómo separarlas está por decidirse.
  it('límite conocido: dos composteras con el mismo nombre el mismo día dicen lo mismo', () => {
    const girar = (id: string) =>
      tarea({
        id: `girar_compost:${id}:${HOY}`,
        tipo: 'girar_compost',
        slug: undefined,
        composteraId: id,
        titulo: 'Compostera: revolvé el compost',
      })
    const [una, otra] = [girar('c1'), girar('c2')]
    const d = distinguir(agruparPorPie([una, otra]), new Map(), HOY)
    expect(d.porTarea.get(una.id)).toBe('hoy')
    expect(d.porTarea.get(otra.id)).toBe('hoy')
  })
})

describe('lo que sabe la app de cada planta', () => {
  const planta = (p: Partial<Planta>): Planta => ({
    id: 'p',
    slug: 'lechuga',
    sembrada: '2026-08-24',
    metodo: 'directa',
    etapa: 'creciendo',
    etapaDesde: '2026-08-24',
    creada: '2026-08-24',
    ...p,
  })
  const fondo: Ubicacion = { id: 'u1', nombre: 'Bancal del fondo', tipo: 'bancal', creada: '2026-08-01' }
  const nombres: Record<string, string> = { lechuga: 'Lechuga', ajo: 'Ajo' }
  const de = (ps: Planta[]) => dondeCreceDe(ps, [fondo], (slug) => nombres[slug])

  it('el lugar por su nombre, y la especie del catálogo', () => {
    const d = de([planta({ ubicacionId: 'u1', comoEsta: 'intercalada', variedad: 'Morada' })]).get('p')
    expect(d).toEqual({
      lugar: 'Bancal del fondo',
      comoEsta: 'intercalada',
      sembrada: '2026-08-24',
      especie: 'Lechuga',
      variedad: 'Morada',
      germino: undefined,
      esperaGerminar: true,
    })
  })

  it('sin lugar, o con uno que ya no está, no inventa uno', () => {
    expect(de([planta({})]).get('p')?.lugar).toBeUndefined()
    expect(de([planta({ ubicacionId: 'borrada' })]).get('p')?.lugar).toBeUndefined()
  })

  it('sólo espera que asome la sembrada que no asomó: no la plantada ni la cargada ya crecida', () => {
    const d = de([
      planta({ id: 'semilla' }),
      planta({ id: 'asomo', germino: '2026-08-30' }),
      planta({ id: 'diente', slug: 'ajo', metodo: 'plantacion' }),
      planta({ id: 'crecida', etapa: 'cosechando' }),
    ])
    expect([...d].map(([id, x]) => [id, x.esperaGerminar])).toEqual([
      ['semilla', true],
      ['asomo', false],
      ['diente', false],
      ['crecida', false],
    ])
  })
})

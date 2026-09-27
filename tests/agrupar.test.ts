import { describe, expect, it } from 'vitest'
import { distinguir, dondeCreceDe, lineaDe, type DondeCrece } from '../src/lib/tareas/agrupar'
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

describe('dos tareas que se llaman igual', () => {
  // zanahorias sin apodo: el atraso depende de la siembra
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
  const etiqueta = (d: ReturnType<typeof distinguir>, id: string) => d.get(`revisar_germinacion:${id}`)?.texto

  it('sembradas el mismo día en dos bancales: cada una dice el suyo', () => {
    const d = distinguir(
      [zanahoria('a'), zanahoria('b')],
      donde({ a: { lugar: FONDO, sembrada: '2026-08-24' }, b: { lugar: MEDIANERA, sembrada: '2026-08-24' } }),
      HOY,
    )
    expect(etiqueta(d, 'a')).toBe(FONDO)
    expect(etiqueta(d, 'b')).toBe(MEDIANERA)
  })

  it('la que no se repite no lleva lugar, aunque sea de la misma especie', () => {
    const d = distinguir(
      [zanahoria('a'), zanahoria('b'), zanahoria('c', 12, SEGUNDA)],
      donde({
        a: { lugar: FONDO, sembrada: '2026-08-24' },
        b: { lugar: MEDIANERA, sembrada: '2026-08-24' },
        c: { lugar: MACETAS, sembrada: '2026-08-24' },
      }),
      HOY,
    )
    expect(etiqueta(d, 'a')).toBe(FONDO)
    expect(etiqueta(d, 'b')).toBe(MEDIANERA)
    expect(etiqueta(d, 'c')).toBeUndefined()
  })

  it('con atrasos distintos y lugares distintos, cada una dice el suyo', () => {
    const d = distinguir(
      [zanahoria('a', 12), zanahoria('b', 10)],
      donde({ a: { lugar: FONDO, sembrada: '2026-08-24' }, b: { lugar: MEDIANERA, sembrada: '2026-08-26' } }),
      HOY,
    )
    expect(etiqueta(d, 'a')).toBe(FONDO)
    expect(etiqueta(d, 'b')).toBe(MEDIANERA)
  })

  it('entre tres, ve el choque de las dos que se llaman igual', () => {
    const d = distinguir(
      [zanahoria('a', 12), zanahoria('b', 12, SEGUNDA), zanahoria('c', 10)],
      donde({
        a: { lugar: FONDO, sembrada: '2026-08-24' },
        b: { lugar: MACETAS, sembrada: '2026-08-24' },
        c: { lugar: MEDIANERA, sembrada: '2026-08-26' },
      }),
      HOY,
    )
    // la segunda tanda ya se distingue por el título
    expect(etiqueta(d, 'b')).toBeUndefined()
    expect(etiqueta(d, 'a')).toBe(FONDO)
    expect(etiqueta(d, 'c')).toBe(MEDIANERA)
  })

  it('en el mismo lugar, suma cuándo se sembró cada una', () => {
    const d = distinguir(
      [zanahoria('a', 12), zanahoria('b', 10)],
      donde({ a: { lugar: FONDO, sembrada: '2026-09-03' }, b: { lugar: FONDO, sembrada: '2026-09-05' } }),
      HOY,
    )
    expect(etiqueta(d, 'a')).toBe(`${FONDO}, sembrada el 3 sept`)
    expect(etiqueta(d, 'b')).toBe(`${FONDO}, sembrada el 5 sept`)
  })

  it('si las siembras son de años distintos, suma el año', () => {
    const d = distinguir(
      [zanahoria('a', 12), zanahoria('b', 10)],
      donde({ a: { lugar: FONDO, sembrada: '2025-09-03' }, b: { lugar: FONDO, sembrada: '2026-09-03' } }),
      HOY,
    )
    expect(etiqueta(d, 'a')).toBe(`${FONDO}, sembrada el 3 de sept de 2025`)
    expect(etiqueta(d, 'b')).toBe(`${FONDO}, sembrada el 3 de sept de 2026`)
  })

  it('la fecha va sólo donde el lugar no alcanza', () => {
    const d = distinguir(
      [zanahoria('a', 12), zanahoria('b', 12), zanahoria('c', 10)],
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
      [trasplante('t', 'tomate'), trasplante('p', 'pimiento')],
      donde({
        t: { lugar: FONDO, sembrada: '2026-08-24', especie: 'Tomate' },
        p: { lugar: FONDO, sembrada: '2026-08-24', especie: 'Pimiento / Morrón' },
      }),
      HOY,
    )
    expect(d.get('t')?.texto).toBe(`${FONDO}, Tomate`)
    expect(d.get('p')?.texto).toBe(`${FONDO}, Pimiento / Morrón`)
  })

  it('y si también son la misma especie, desempata cuándo asomó', () => {
    const trasplante = (id: string) => tarea({ id, plantaId: id, titulo: 'Lechuga: hora de trasplantar' })
    const d = distinguir(
      [trasplante('a'), trasplante('b')],
      donde({
        a: { lugar: FONDO, sembrada: '2026-08-24', germino: '2026-08-30' },
        b: { lugar: FONDO, sembrada: '2026-08-24', germino: '2026-09-02' },
      }),
      HOY,
    )
    expect(d.get('a')?.texto).toBe(`${FONDO}, asomó el 30 ago`)
    expect(d.get('b')?.texto).toBe(`${FONDO}, asomó el 2 sept`)
  })

  // la cosecha no espera a que asome: es la que junta una marcada con una sin marcar
  const cosecha = (id: string) =>
    tarea({ id, plantaId: id, tipo: 'cosechar', titulo: 'Lechuga ya estaría para cosechar' })

  it('a la que no le marcaste cuándo asomó, se le dice así', () => {
    const d = distinguir(
      [cosecha('a'), cosecha('b')],
      donde({
        a: { lugar: FONDO, sembrada: '2026-08-24', germino: '2026-08-30' },
        b: { lugar: FONDO, sembrada: '2026-08-24', esperaGerminar: true },
      }),
      HOY,
    )
    expect(d.get('a')?.texto).toBe(`${FONDO}, asomó el 30 ago`)
    expect(d.get('b')?.texto).toBe(`${FONDO}, sin marcar cuándo asomó`)
  })

  it('a la que la app no le pide marcarlo (plantada, o cargada ya crecida) no se le dice que falta', () => {
    const d = distinguir(
      [cosecha('a'), cosecha('b')],
      donde({
        a: { lugar: FONDO, sembrada: '2026-08-24', germino: '2026-08-30' },
        b: { lugar: FONDO, sembrada: '2026-08-24', esperaGerminar: false },
      }),
      HOY,
    )
    expect(d.get('a')?.texto).toBe(`${FONDO}, asomó el 30 ago`)
    expect(d.get('b')?.texto).toBe(FONDO)
  })

  it('«Maceta» y «maceta» son el mismo lugar: desempata la siembra', () => {
    const d = distinguir(
      [zanahoria('a'), zanahoria('b')],
      donde({ a: { lugar: 'Maceta', sembrada: '2026-08-24' }, b: { lugar: 'maceta', sembrada: '2026-08-26' } }),
      HOY,
    )
    expect(etiqueta(d, 'a')).toBe('Maceta, sembrada el 24 ago')
    expect(etiqueta(d, 'b')).toBe('maceta, sembrada el 26 ago')
  })

  it('«Maceta» y «maceta» empatadas en todo: cada una como la escribiste', () => {
    const d = distinguir(
      [zanahoria('a'), zanahoria('b')],
      donde({ a: { lugar: 'Maceta', sembrada: '2026-08-24' }, b: { lugar: 'maceta', sembrada: '2026-08-24' } }),
      HOY,
    )
    expect(etiqueta(d, 'a')).toBe('Maceta')
    expect(etiqueta(d, 'b')).toBe('maceta')
  })

  it('el apodo «zanahoria» y la «Zanahoria» del catálogo se llaman igual', () => {
    const d = distinguir(
      [zanahoria('a'), zanahoria('b', 12, 'zanahoria: fijate si asomó')],
      donde({ a: { lugar: FONDO, sembrada: '2026-08-24' }, b: { lugar: MEDIANERA, sembrada: '2026-08-24' } }),
      HOY,
    )
    expect(etiqueta(d, 'a')).toBe(FONDO)
    expect(etiqueta(d, 'b')).toBe(MEDIANERA)
  })

  it('lo que sigue empatado queda igual: no se inventa una diferencia', () => {
    const d = distinguir(
      [zanahoria('a'), zanahoria('b')],
      donde({ a: { lugar: FONDO, sembrada: '2026-08-24' }, b: { lugar: FONDO, sembrada: '2026-08-24' } }),
      HOY,
    )
    expect(etiqueta(d, 'a')).toBe(FONDO)
    expect(etiqueta(d, 'b')).toBe(FONDO)
  })

  it('sin títulos repetidos no agrega nada, aunque estén en lugares distintos', () => {
    const d = distinguir(
      [zanahoria('a'), zanahoria('b', 12, SEGUNDA)],
      donde({ a: { lugar: FONDO, sembrada: '2026-08-24' }, b: { lugar: MEDIANERA, sembrada: '2026-08-24' } }),
      HOY,
    )
    expect(d.size).toBe(0)
  })

  it('en el mismo lugar, antes que la siembra, dice cómo está puesta, tal cual la escribiste', () => {
    const d = distinguir(
      [zanahoria('a', 12), zanahoria('b', 10)],
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
      [zanahoria('a', 12), zanahoria('b', 10)],
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
      [trasplante('v'), trasplante('m')],
      donde({
        v: { lugar: FONDO, sembrada: '2026-08-24', especie: 'Albahaca' },
        m: { lugar: FONDO, sembrada: '2026-08-24', especie: 'Albahaca', variedad: 'Morada' },
      }),
      HOY,
    )
    expect(d.get('m')?.texto).toBe(`${FONDO}, Morada`)
    expect(d.get('v')?.texto).toBe(FONDO)
  })

  it('«Genovesa» y «genovesa» son la misma variedad, y cada una se dice como la escribiste', () => {
    const trasplante = (id: string) =>
      tarea({ id, plantaId: id, slug: 'albahaca', titulo: 'Albahaca: hora de trasplantar' })
    const d = distinguir(
      [trasplante('g'), trasplante('m'), trasplante('n')],
      donde({
        g: { lugar: FONDO, sembrada: '2026-08-24', variedad: 'Genovesa', germino: '2026-08-30' },
        m: { lugar: FONDO, sembrada: '2026-08-24', variedad: 'genovesa', germino: '2026-09-02' },
        n: { lugar: FONDO, sembrada: '2026-08-24', variedad: 'Morada' },
      }),
      HOY,
    )
    // la variedad las separa de la morada, pero entre ellas desempata cuándo asomó
    expect(d.get('g')?.texto).toBe(`${FONDO}, Genovesa, asomó el 30 ago`)
    expect(d.get('m')?.texto).toBe(`${FONDO}, genovesa, asomó el 2 sept`)
    expect(d.get('n')?.texto).toBe(`${FONDO}, Morada`)
  })

  it('en días distintos también: el día no dice cuál es', () => {
    const hoy = zanahoria('a')
    const jueves = { ...zanahoria('b'), fecha: '2026-08-20' }
    const plantas = donde({
      a: { lugar: FONDO, sembrada: '2026-08-24' },
      b: { lugar: MEDIANERA, sembrada: '2026-08-24' },
    })
    const d = distinguir([hoy, jueves], plantas, HOY)
    expect(etiqueta(d, 'a')).toBe(FONDO)
    expect(etiqueta(d, 'b')).toBe(MEDIANERA)
    // sin la semana, el día solo no ve el choque
    expect(distinguir([hoy], plantas, HOY).size).toBe(0)
  })

  it('la planta sin lugar se dice «sin lugar asignado»', () => {
    const d = distinguir(
      [zanahoria('a', 12), zanahoria('b', 10)],
      donde({ a: { lugar: FONDO, sembrada: '2026-08-24' }, b: { sembrada: '2026-08-26' } }),
      HOY,
    )
    expect(etiqueta(d, 'a')).toBe(FONDO)
    expect(etiqueta(d, 'b')).toBe('sin lugar asignado')
  })
})

describe('la línea corta dice la siembra una sola vez', () => {
  const FONDO = 'Bancal del fondo'
  const donde = (d: Record<string, DondeCrece>) => new Map(Object.entries(d))
  // la línea como la arma el motor: con su marca
  const trasplante = (id: string, linea: string) =>
    tarea({ id, plantaId: id, slug: 'tomate', titulo: 'Tomate: hora de trasplantar', linea, lineaEsSiembra: true })

  it('si para separarlas dijo cuándo se sembró, la línea que también lo cuenta se va', () => {
    const [a, b] = [trasplante('a', 'sembrada hace 24 días'), trasplante('b', 'sembrada hace 22 días')]
    const d = distinguir(
      [a, b],
      donde({ a: { lugar: FONDO, sembrada: '2026-09-03' }, b: { lugar: FONDO, sembrada: '2026-09-05' } }),
      HOY,
    )
    expect(d.get('a')?.texto).toBe(`${FONDO}, sembrada el 3 sept`)
    expect(lineaDe(a, d.get('a'))).toBeUndefined()
    expect(lineaDe(b, d.get('b'))).toBeUndefined()
  })

  it('si las separa el lugar, la línea queda', () => {
    const [a, b] = [trasplante('a', 'sembrada hace 24 días'), trasplante('b', 'sembrada hace 22 días')]
    const d = distinguir(
      [a, b],
      donde({ a: { lugar: FONDO, sembrada: '2026-09-03' }, b: { lugar: 'Maceta', sembrada: '2026-09-05' } }),
      HOY,
    )
    expect(d.get('a')?.texto).toBe(FONDO)
    expect(lineaDe(a, d.get('a'))).toBe('sembrada hace 24 días')
  })

  it('la línea que no cuenta la siembra queda aunque se haya dicho la fecha', () => {
    const zanahoria = (id: string) =>
      tarea({ id, plantaId: id, tipo: 'revisar_germinacion', titulo: 'Zanahoria: fijate si asomó', linea: 'se pasó por 10 días' })
    const [a, b] = [zanahoria('a'), zanahoria('b')]
    const d = distinguir(
      [a, b],
      donde({ a: { lugar: FONDO, sembrada: '2026-09-03' }, b: { lugar: FONDO, sembrada: '2026-09-05' } }),
      HOY,
    )
    expect(d.get('a')?.conSiembra).toBe(true)
    expect(lineaDe(a, d.get('a'))).toBe('se pasó por 10 días')
  })

  it('sin choque, la línea es la de la tarea', () => {
    const a = trasplante('a', 'sembrada hace 24 días')
    expect(lineaDe(a, undefined)).toBe('sembrada hace 24 días')
  })
})

describe('dos tareas sin planta que se llaman igual', () => {
  // una helada por década: el sábado 15 cierra mediados y el viernes 21 arranca fines
  const helada = (fecha: string) =>
    tarea({ id: `helada:${fecha}`, tipo: 'helada', slug: undefined, titulo: 'Puede helar', instruccion: 'Cubrí de noche el tomate.', fecha })
  const sabado = helada(HOY)
  const viernes = helada('2026-08-21')

  it('las separa el día: «hoy» o el día entero', () => {
    const d = distinguir([sabado, viernes], new Map(), HOY)
    expect(d.get(sabado.id)?.texto).toBe('hoy')
    expect(d.get(viernes.id)?.texto).toBe('viernes, 21 de agosto')
  })

  it('una sola en la semana no suma nada', () => {
    expect(distinguir([sabado], new Map(), HOY).size).toBe(0)
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
    const d = distinguir([una, otra], new Map(), HOY)
    expect(d.get(una.id)?.texto).toBe('hoy')
    expect(d.get(otra.id)?.texto).toBe('hoy')
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

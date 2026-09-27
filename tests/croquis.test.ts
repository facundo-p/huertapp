import { describe, expect, it } from 'vitest'
import {
  atencionPorPlanta,
  copoDeLaSemana,
  corrida,
  empaquetar,
  enOrdenDeCarga,
  etapaDibujo,
  grillaDe,
  manchones,
} from '../src/lib/huerta/croquis'
import type { EspecieEnriquecida } from '../src/lib/data/types'
import type { AvisoClima } from '../src/lib/pronostico/tipos'
import type { Planta, Ubicacion } from '../src/lib/huerta/tipos'
import type { Tarea } from '../src/lib/tareas/engine'

const ubi = (u: Partial<Ubicacion>): Ubicacion => ({
  id: 'u1',
  nombre: 'Un lugar',
  tipo: 'otro',
  creada: '2026-01-01',
  ...u,
})

let n = 0
const planta = (p: Partial<Planta>): Planta => {
  n++
  return {
    id: `p${n}`,
    slug: 'lechuga',
    sembrada: '2026-01-01',
    metodo: 'directa',
    etapa: 'creciendo',
    etapaDesde: '2026-01-01',
    creada: `2026-01-01T00:00:${String(n).padStart(2, '0')}`,
    ...p,
  }
}

const tarea = (t: Partial<Tarea>): Tarea => ({
  id: 't1',
  tipo: 'cosechar',
  titulo: 'Cosechar lechuga',
  detalle: '',
  fuente: '',
  prioridad: 3,
  fecha: '2026-01-01',
  ...t,
})

/** las celdas como texto, una fila por renglón: «a a b ·» */
const mapa = (g: ReturnType<typeof grillaDe>, nombres: Record<string, string>) => {
  const filas: string[] = []
  for (let i = 0; i < g.cap; i += g.cols)
    filas.push(
      g.celdas
        .slice(i, i + g.cols)
        .map((id) => (id ? nombres[id] : '·'))
        .join(' '),
    )
  return filas
}

describe('grillaDe: la clase de cada lugar', () => {
  it('un bancal sin disposición no promete surcos: va como caja simple', () => {
    const p = planta({})
    const g = grillaDe(ubi({ tipo: 'bancal_elevado', capacidad: 4 }), [p])
    expect(g).toMatchObject({ clase: 'otro', cols: 3, cap: 1, ancho: 'media' })
  })

  it('un bancal libre sin medidas ni superficie no tiene escala: caja simple', () => {
    const g = grillaDe(ubi({ tipo: 'bancal_elevado', disposicion: 'libre' }), [planta({})])
    expect(g.clase).toBe('otro')
  })

  it('sin lugar asignado es una caja con una celda por planta', () => {
    const g = grillaDe(undefined, [planta({}), planta({}), planta({}), planta({})])
    expect(g).toMatchObject({ clase: 'otro', cols: 3, filas: 2, cap: 4 })
  })

  it('los surcos son una columna; hasta 4 van a media página', () => {
    expect(grillaDe(ubi({ tipo: 'bancal_tierra', disposicion: 'surcos', capacidad: 3 }), [])).toMatchObject({
      clase: 'surcos',
      cols: 1,
      filas: 3,
      cap: 3,
      ancho: 'media',
    })
    expect(grillaDe(ubi({ tipo: 'bancal_tierra', disposicion: 'surcos', capacidad: 5 }), []).ancho).toBe('entera')
  })

  it('más de 6 celdas pasan a 6 columnas y página entera', () => {
    const g = grillaDe(ubi({ tipo: 'almacigo', capacidad: 12 }), [])
    expect(g).toMatchObject({ clase: 'almaciguera', cols: 6, filas: 2, ancho: 'entera' })
  })

  it('sin capacidad no se dibujan celdas vacías: la grilla mide lo sembrado', () => {
    const g = grillaDe(ubi({ tipo: 'maceta' }), [planta({ ocupa: 2 }), planta({})])
    expect(g).toMatchObject({ cap: 3, cols: 3, filas: 1 })
    expect(g.celdas.every(Boolean)).toBe(true)
  })

  it('el bancal libre acota la proporción: uno muy largo no queda en una fila', () => {
    const largo = grillaDe(ubi({ tipo: 'bancal_elevado', disposicion: 'libre', medidas: { ancho: 50, largo: 500 } }), [])
    const cuadrado = grillaDe(ubi({ tipo: 'bancal_elevado', disposicion: 'libre', medidas: { ancho: 100, largo: 100 } }), [])
    expect(largo).toMatchObject({ cols: 6, filas: 2 })
    expect(cuadrado).toMatchObject({ cols: 6, filas: 5 })
  })
})

describe('grillaDe: cuántas celdas toma cada siembra', () => {
  it('1,12 m² sobre celdas de 0,16 son 7 y no 8: la coma flotante no suma una', () => {
    const p = planta({ superficie: 1.12 })
    const g = grillaDe(ubi({ tipo: 'bancal_elevado', disposicion: 'libre', capacidad: 2.88, medidas: { ancho: 120, largo: 240 } }), [p])
    expect(g.cap).toBe(18)
    expect(g.celdas.filter((id) => id === p.id)).toHaveLength(7)
  })

  it('una planta sin superficie en el bancal libre toma una celda', () => {
    const p = planta({})
    const g = grillaDe(ubi({ tipo: 'bancal_elevado', disposicion: 'libre', medidas: { ancho: 120, largo: 240 } }), [p])
    expect(g.celdas.filter(Boolean)).toHaveLength(1)
  })

  it('si lo sembrado pide más de lo que hay, cada una tiene su celda y el resto va en orden', () => {
    const a = planta({ ocupa: 3 })
    const b = planta({ ocupa: 3 })
    const c = planta({ ocupa: 3 })
    const g = grillaDe(ubi({ tipo: 'maceta', capacidad: 5 }), [a, b, c])
    expect(g.cap).toBe(5)
    expect(mapa(g, { [a.id]: 'a', [b.id]: 'b', [c.id]: 'c' })).toEqual(['a a a', 'b c'])
  })

  it('si hay más plantas que celdas, suma filas: ninguna queda sin dibujar', () => {
    const ps = [planta({}), planta({}), planta({}), planta({})]
    const g = grillaDe(ubi({ tipo: 'maceta', capacidad: 3 }), ps)
    expect(g).toMatchObject({ cols: 3, filas: 2, cap: 4 })
    expect(new Set(g.celdas)).toEqual(new Set(ps.map((p) => p.id)))
  })

  it('en el bancal libre desbordado la fila nueva se dibuja entera', () => {
    const ps = Array.from({ length: 13 }, () => planta({}))
    const g = grillaDe(ubi({ tipo: 'bancal_elevado', disposicion: 'libre', medidas: { ancho: 100, largo: 250 } }), ps)
    expect(g).toMatchObject({ cols: 6, filas: 3, cap: 18 })
    expect(g.celdas.filter(Boolean)).toHaveLength(13)
  })

  it('una capacidad con coma cuenta las celdas enteras: ninguna planta queda afuera', () => {
    const ps = [planta({ ocupa: 2 }), planta({}), planta({}), planta({})]
    const g = grillaDe(ubi({ tipo: 'maceta', capacidad: 4.5 }), ps)
    expect(g.cap).toBe(4)
    expect(new Set(g.celdas)).toEqual(new Set(ps.map((p) => p.id)))
    expect(Object.keys(g.celdas)).toHaveLength(g.cap)

    const tres = [planta({ ocupa: 2 }), planta({ ocupa: 2 }), planta({ ocupa: 2 })]
    const alm = grillaDe(ubi({ tipo: 'almacigo', capacidad: 3.5 }), tres)
    expect(new Set(alm.celdas)).toEqual(new Set(tres.map((p) => p.id)))

    expect(grillaDe(ubi({ tipo: 'bancal_tierra', disposicion: 'surcos', capacidad: 2.5 }), []).cap).toBe(2)
  })

  it('las archivadas y las terminadas no se dibujan', () => {
    const g = grillaDe(ubi({ tipo: 'maceta', capacidad: 3 }), [
      planta({ archivada: true }),
      planta({ etapa: 'terminada' }),
      planta({}),
    ])
    expect(g.celdas.filter(Boolean)).toHaveLength(1)
  })
})

describe('grillaDe: dónde cae cada bloque', () => {
  it('un bloque que entra entero en la fila siguiente no se corta', () => {
    const a = planta({ ocupa: 4 })
    const b = planta({ ocupa: 4 })
    const g = grillaDe(ubi({ tipo: 'almacigo', capacidad: 12 }), [a, b])
    expect(mapa(g, { [a.id]: 'a', [b.id]: 'b' })).toEqual(['a a a a · ·', 'b b b b · ·'])
  })

  it('salvo que saltar deje sin lugar a las que siguen: ahí se corta', () => {
    const a = planta({ ocupa: 4 })
    const b = planta({ ocupa: 4 })
    const c = planta({ ocupa: 4 })
    const g = grillaDe(ubi({ tipo: 'almacigo', capacidad: 12 }), [a, b, c])
    expect(mapa(g, { [a.id]: 'a', [b.id]: 'b', [c.id]: 'c' })).toEqual(['a a a a b b', 'b b c c c c'])
  })

  it('el orden es el de carga y no el de siembra', () => {
    const vieja = planta({ sembrada: '2025-01-01', creada: '2026-03-02' })
    const nueva = planta({ sembrada: '2026-03-01', creada: '2026-03-01' })
    expect(enOrdenDeCarga([vieja, nueva]).map((p) => p.id)).toEqual([nueva.id, vieja.id])
  })
})

describe('la huerta de ejemplo', () => {
  const almaciguera = ubi({ id: 'alm', tipo: 'almacigo', capacidad: 12 })
  const macetas = ubi({ id: 'mac', tipo: 'maceta', capacidad: 5 })
  const fondo = ubi({ id: 'fon', tipo: 'bancal_elevado', disposicion: 'libre', medidas: { ancho: 120, largo: 240 } })
  const medianera = ubi({ id: 'med', tipo: 'bancal_tierra', disposicion: 'surcos', capacidad: 3 })

  const tomate = planta({ slug: 'tomate', ocupa: 4 })
  const lechuga = planta({ superficie: 0.8 })
  const albahaca = planta({ slug: 'albahaca', ocupa: 2 })
  const rucula = planta({ slug: 'rucula', superficie: 0.6 })
  const zanahoria = planta({ slug: 'zanahoria', superficie: 0.6 })
  const tomateMacetas = planta({ slug: 'tomate', ocupa: 3 })
  const nombres = {
    [tomate.id]: 'T',
    [albahaca.id]: 'A',
    [lechuga.id]: 'L',
    [rucula.id]: 'R',
    [zanahoria.id]: 'Z',
    [tomateMacetas.id]: 'T',
  }

  it('la almaciguera: el tomate y la albahaca en la primera fila', () => {
    const g = grillaDe(almaciguera, [tomate, albahaca])
    expect(g.ancho).toBe('entera')
    expect(mapa(g, nombres)).toEqual(['T T T T A A', '· · · · · ·'])
  })

  it('las macetas: 3 de 5, a media página', () => {
    const g = grillaDe(macetas, [tomateMacetas])
    expect(g).toMatchObject({ cols: 3, filas: 2, cap: 5, ancho: 'media' })
    expect(mapa(g, nombres)).toEqual(['T T T', '· ·'])
  })

  it('el bancal del fondo: cada siembra arranca su fila', () => {
    const g = grillaDe(fondo, [lechuga, rucula, zanahoria])
    expect(mapa(g, nombres)).toEqual(['L L L L L ·', 'R R R R · ·', 'Z Z Z Z · ·'])
  })

  it('la medianera: tres surcos vacíos a media página', () => {
    expect(grillaDe(medianera, [])).toMatchObject({ cols: 1, filas: 3, ancho: 'media' })
  })

  it('empaquetadas: las macetas y la medianera comparten fila', () => {
    const lugares = [almaciguera, macetas, fondo, medianera].map((u) => ({
      id: u.id,
      ancho: grillaDe(u, []).ancho,
    }))
    expect(empaquetar(lugares).map((l) => l.id)).toEqual(['alm', 'mac', 'med', 'fon'])
  })
})

describe('empaquetar', () => {
  const l = (id: string, ancho: 'media' | 'entera') => ({ id, ancho })
  const ids = (xs: { id: string }[]) => xs.map((x) => x.id).join(' ')

  it('deja como están los que ya van de a dos', () => {
    expect(ids(empaquetar([l('a', 'media'), l('b', 'media'), l('c', 'entera')]))).toBe('a b c')
  })

  it('un media solo antes de uno entero se queda solo si no hay otro media después', () => {
    expect(ids(empaquetar([l('a', 'media'), l('b', 'entera')]))).toBe('a b')
  })

  it('el media de la derecha no sube: su fila ya está completa', () => {
    expect(ids(empaquetar([l('a', 'media'), l('b', 'media'), l('c', 'entera'), l('d', 'media')]))).toBe('a b c d')
  })

  it('sube el primero de media que encuentra, aunque haya varios enteros en el medio', () => {
    expect(ids(empaquetar([l('a', 'media'), l('b', 'entera'), l('c', 'entera'), l('d', 'media')]))).toBe('a d b c')
  })
})

describe('manchones y corrida', () => {
  it('las celdas vecinas de la misma planta son un manchón; las diagonales no', () => {
    const g = {
      clase: 'libre' as const,
      ancho: 'entera' as const,
      cols: 3,
      filas: 2,
      cap: 6,
      celdas: ['a', null, 'a', null, 'a', 'b'],
    }
    const comp = manchones(g)
    expect(comp[0]).not.toBe(comp[2])
    expect(comp[2]).not.toBe(comp[4])
    expect(comp[1]).toBe(-1)
    expect(new Set(comp.filter((c) => c >= 0)).size).toBe(4)
  })

  it('una L es un solo manchón y el nombre mide lo que sigue en su fila', () => {
    const g = {
      clase: 'almaciguera' as const,
      ancho: 'entera' as const,
      cols: 6,
      filas: 2,
      cap: 12,
      celdas: ['x', 'x', 'y', 'y', 'y', 'y', null, null, 'y', 'y', null, null],
    }
    const comp = manchones(g)
    expect(comp[2]).toBe(comp[8])
    expect(corrida(g, comp, 2)).toBe(4)
    expect(corrida(g, comp, 8)).toBe(2)
    expect(corrida(g, comp, 0)).toBe(2)
  })

  it('la corrida no sigue en la fila de abajo', () => {
    const g = {
      clase: 'almaciguera' as const,
      ancho: 'media' as const,
      cols: 3,
      filas: 2,
      cap: 6,
      celdas: ['x', 'x', 'x', 'x', null, null],
    }
    expect(corrida(g, manchones(g), 1)).toBe(2)
  })
})

describe('etapaDibujo', () => {
  const especie = { dias_germinacion: { min: 5, max: 10 } } as EspecieEnriquecida

  it('mientras no asomó, es una semilla', () => {
    expect(etapaDibujo(planta({ sembrada: '2026-03-01' }), especie, '2026-03-03')).toBe('semilla')
  })

  it('germinada en almácigo es un brote; cosechando, da', () => {
    expect(etapaDibujo(planta({ etapa: 'almacigo', germino: '2026-03-06' }), especie, '2026-03-10')).toBe('brote')
    expect(etapaDibujo(planta({ etapa: 'cosechando' }), especie, '2026-03-10')).toBe('dando')
  })

  it('lo plantado no espera germinar', () => {
    expect(etapaDibujo(planta({ metodo: 'plantacion', sembrada: '2026-03-09' }), especie, '2026-03-10')).toBe(
      'creciendo',
    )
  })

  it('las terminadas no se dibujan', () => {
    expect(etapaDibujo(planta({ etapa: 'terminada' }), especie, '2026-03-10')).toBeNull()
  })
})

describe('atencionPorPlanta', () => {
  it('cuenta las de cada planta y lo atrasado va primero', () => {
    const m = atencionPorPlanta(
      [
        tarea({ plantaId: 'p', titulo: 'Lechuga: regar', prioridad: 1 }),
        tarea({ plantaId: 'p', titulo: 'Lechuga: fijate si asomó', prioridad: 4, atrasada: true }),
        tarea({ titulo: 'Girar la compostera' }),
      ],
      () => 'Lechuga',
    )
    expect(m.size).toBe(1)
    expect(m.get('p')).toEqual({ cuantas: 2, atrasada: true, que: 'fijate si asomó' })
  })

  it('sin el nombre adelante, baja la mayúscula del título', () => {
    const m = atencionPorPlanta([tarea({ plantaId: 'p', titulo: 'Cosechar lechuga' })], () => 'Tomate')
    expect(m.get('p')?.que).toBe('cosechar lechuga')
  })

  it('el nombre seguido de espacio también se saca', () => {
    const m = atencionPorPlanta([tarea({ plantaId: 'p', titulo: 'Tomate lista para trasplantar' })], () => 'Tomate')
    expect(m.get('p')?.que).toBe('lista para trasplantar')
  })
})

describe('copoDeLaSemana', () => {
  const aviso = (a: Partial<AvisoClima>): AvisoClima => ({
    id: 'helada:2026-06-12',
    tipo: 'helada',
    fecha: '2026-06-12',
    titulo: 'Puede helar el viernes',
    detalle: '',
    fuente: '',
    linea: '',
    valor: 1,
    ...a,
  })

  it('con helada pronosticada, la más cercana de la semana', () => {
    const avisos = [
      aviso({ fecha: '2026-06-13', titulo: 'Puede helar el sábado' }),
      aviso({ fecha: '2026-06-11', titulo: 'Puede helar el jueves' }),
    ]
    expect(copoDeLaSemana([], avisos, '2026-06-10')).toBe('puede helar el jueves: tapar de noche')
  })

  it('lo de después de la semana o de otro tipo no cuenta', () => {
    const avisos = [
      aviso({ fecha: '2026-06-17', titulo: 'Puede helar el miércoles' }),
      aviso({ tipo: 'calor', fecha: '2026-06-11', titulo: 'Mucho calor el jueves' }),
    ]
    expect(copoDeLaSemana([], avisos, '2026-06-10')).toBeNull()
  })

  it('sin pronóstico, alcanza la tarea estadística', () => {
    expect(copoDeLaSemana([tarea({ tipo: 'helada', titulo: 'Puede helar' })], [], '2026-06-10')).toBe(
      'puede helar: tapar de noche',
    )
  })

  it('sin ninguna de las dos, no hay copo', () => {
    expect(copoDeLaSemana([tarea({})], [], '2026-06-10')).toBeNull()
  })
})

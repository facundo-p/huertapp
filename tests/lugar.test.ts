import { describe, expect, it } from 'vitest'
import {
  agruparPorLugar,
  lugarDe,
  medidaDeOcupacion,
  ocupacionDe,
  pieDelLugar,
  proximaTareaDe,
} from '../src/lib/huerta/lugar'
import type { Planta, Ubicacion } from '../src/lib/huerta/tipos'
import type { Tarea } from '../src/lib/tareas/engine'

const ubi = (u: Partial<Ubicacion>): Ubicacion => ({
  id: 'u1',
  nombre: 'Un lugar',
  tipo: 'otro',
  creada: '2026-01-01',
  ...u,
})

const planta = (p: Partial<Planta>): Planta => ({
  id: 'p1',
  slug: 'lechuga',
  sembrada: '2026-01-01',
  metodo: 'directa',
  etapa: 'creciendo',
  etapaDesde: '2026-01-01',
  creada: '2026-01-01',
  ...p,
})

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

describe('lugarDe', () => {
  it('el almácigo es la almaciguera y se cuenta en celdas', () => {
    expect(lugarDe(ubi({ tipo: 'almacigo' }))).toMatchObject({
      clase: 'almaciguera',
      etiqueta: 'Almaciguera',
      unidad: 'celdas',
      continuo: false,
    })
  })

  it('la maceta se cuenta en macetas', () => {
    expect(lugarDe(ubi({ tipo: 'maceta' })).unidad).toBe('macetas')
  })

  it('el bancal en surcos se cuenta; el de plantación libre se mide', () => {
    const surcos = lugarDe(ubi({ tipo: 'bancal_elevado', disposicion: 'surcos' }))
    const libre = lugarDe(ubi({ tipo: 'bancal_elevado', disposicion: 'libre' }))
    expect(surcos).toMatchObject({ clase: 'bancal', unidad: 'surcos', continuo: false })
    expect(libre).toMatchObject({ clase: 'bancal_libre', unidad: 'm²', continuo: true })
  })

  it('un bancal sin disposición no se da por "en surcos": no promete unidades', () => {
    const l = lugarDe(ubi({ tipo: 'bancal_tierra' }))
    expect(l.clase).toBe('bancal')
    expect(l.etiqueta).toBe('Bancal a tierra')
    expect(l.unidad).toBeNull()
  })

  it('sin ubicación no inventa etiqueta: el nombre de la tarjeta ya lo dice', () => {
    expect(lugarDe(undefined)).toMatchObject({ clase: 'otro', etiqueta: '', unidad: null })
  })
})

describe('ocupacionDe', () => {
  it('cuenta las unidades que declaró cada planta', () => {
    const u = ubi({ tipo: 'almacigo', capacidad: 12 })
    const o = ocupacionDe(u, [planta({ id: 'a', ocupa: 4 }), planta({ id: 'b', ocupa: 2 })])
    expect(o).toMatchObject({ texto: '6 de 12 celdas', ocupadas: 6, capacidad: 12, continuo: false })
  })

  it('si alguna planta no dijo cuánto ocupa, cuenta 1 y el total va con "~"', () => {
    const u = ubi({ tipo: 'maceta', capacidad: 5 })
    const o = ocupacionDe(u, [planta({ id: 'a', ocupa: 3 }), planta({ id: 'b' })])
    expect(o?.texto).toBe('~4 de 5 macetas')
  })

  it('la plantación libre se mide en m², derivados de las medidas', () => {
    const u = ubi({ tipo: 'bancal_elevado', disposicion: 'libre', medidas: { ancho: 120, largo: 240 } })
    const o = ocupacionDe(u, [planta({ id: 'a', superficie: 1.2 }), planta({ id: 'b', superficie: 0.8 })])
    expect(o).toMatchObject({ texto: '2 de 2,9 m² plantados', continuo: true })
    expect(o?.fraccion).toBeCloseTo(2 / 2.9, 3)
  })

  it('sin capacidad no hay medidor: no se inventa el total', () => {
    expect(ocupacionDe(ubi({ tipo: 'almacigo' }), [planta({})])).toBeNull()
    expect(ocupacionDe(ubi({ tipo: 'bancal_tierra', disposicion: 'libre' }), [])).toBeNull()
    expect(ocupacionDe(ubi({ tipo: 'otro', capacidad: 4 }), [])).toBeNull()
  })

  it('la fracción no pasa de 1 aunque esté sobrecargado', () => {
    const u = ubi({ tipo: 'almacigo', capacidad: 2 })
    expect(ocupacionDe(u, [planta({ ocupa: 9 })])?.fraccion).toBe(1)
  })
})

describe('proximaTareaDe', () => {
  const plantas = [planta({ id: 'a' }), planta({ id: 'b' })]

  it('un lugar vacío se ofrece para sembrar', () => {
    expect(proximaTareaDe([], [])).toEqual({ texto: 'Vacío: listo para sembrar', urgente: false })
  })

  it('lo atrasado gana aunque tenga peor prioridad', () => {
    const t = [
      tarea({ id: '1', plantaId: 'a', titulo: 'Cosechar la lechuga', prioridad: 1 }),
      tarea({ id: '2', plantaId: 'b', titulo: 'Trasplantar los 4 de tomate', prioridad: 5, atrasada: true }),
    ]
    expect(proximaTareaDe(t, plantas)).toEqual({ texto: 'Trasplantar los 4 de tomate', urgente: true })
  })

  it('entre iguales manda la prioridad del motor', () => {
    const t = [
      tarea({ id: '1', plantaId: 'a', titulo: 'Segunda', prioridad: 4 }),
      tarea({ id: '2', plantaId: 'b', titulo: 'Primera', prioridad: 2 }),
    ]
    expect(proximaTareaDe(t, plantas)?.texto).toBe('Primera')
  })

  it('ignora las tareas de otras plantas y las del compost', () => {
    const t = [
      tarea({ id: '1', plantaId: 'zzz', titulo: 'De otro lugar' }),
      tarea({ id: '2', composteraId: 'c1', tipo: 'girar_compost', titulo: 'Girar' }),
    ]
    expect(proximaTareaDe(t, plantas)).toBeNull()
  })
})

describe('medidaDeOcupacion', () => {
  it('donde se cuenta, el número va a `ocupa`; donde se mide, a `superficie`', () => {
    expect(medidaDeOcupacion(lugarDe(ubi({ tipo: 'almacigo' })), '4')).toEqual({ ocupa: 4 })
    expect(
      medidaDeOcupacion(lugarDe(ubi({ tipo: 'bancal_elevado', disposicion: 'libre' })), '1,2'),
    ).toEqual({ superficie: 1.2 })
  })

  it('un lugar que no se mide no guarda nada, aunque haya quedado un número escrito', () => {
    expect(medidaDeOcupacion(lugarDe(ubi({ tipo: 'otro' })), '3')).toEqual({})
    expect(medidaDeOcupacion(lugarDe(ubi({ tipo: 'bancal_tierra' })), '3')).toEqual({})
  })
})

describe('pieDelLugar', () => {
  const porSlug = new Map()

  it('la tarea del motor manda sobre el hito', () => {
    const t = [tarea({ plantaId: 'a', titulo: 'Cosechar la lechuga' })]
    expect(pieDelLugar(t, [planta({ id: 'a' })], porSlug)).toEqual({
      texto: 'Cosechar la lechuga',
      urgente: false,
    })
  })

  it('un lugar vacío se ofrece para sembrar', () => {
    expect(pieDelLugar([], [], porSlug)).toEqual({ texto: 'Vacío: listo para sembrar', urgente: false })
  })

  it('sin tarea y sin especie conocida, no dice nada en vez de mentir', () => {
    expect(pieDelLugar([], [planta({ id: 'a', slug: 'no-existe' })], porSlug)).toBeNull()
  })
})

describe('agruparPorLugar', () => {
  const lugares: Ubicacion[] = [
    ubi({ id: 'b2', nombre: 'Bancal de la medianera', tipo: 'bancal_tierra', creada: '2026-01-04' }),
    ubi({ id: 'b1', nombre: 'Bancal del fondo', tipo: 'bancal_elevado', creada: '2026-01-03' }),
    ubi({ id: 'm', nombre: 'Macetas del balcón', tipo: 'maceta', creada: '2026-01-02' }),
    ubi({ id: 'a', nombre: 'Almaciguera del balcón', tipo: 'almacigo', creada: '2026-01-01' }),
  ]
  const nombres = (g: ReturnType<typeof agruparPorLugar>) =>
    g.map((x) => x.ubicacion?.nombre ?? 'sin lugar')

  it('primero donde nacen las plantas, después donde crecen', () => {
    expect(nombres(agruparPorLugar([], lugares))).toEqual([
      'Almaciguera del balcón',
      'Macetas del balcón',
      'Bancal de la medianera',
      'Bancal del fondo',
    ])
  })

  it('entre lugares de la misma clase, primero el que tiene algo plantado', () => {
    const g = agruparPorLugar([planta({ id: 'p', ubicacionId: 'b1' })], lugares)
    expect(nombres(g).slice(2)).toEqual(['Bancal del fondo', 'Bancal de la medianera'])
  })

  it('un lugar vacío igual aparece: hay que poder sembrarlo', () => {
    expect(agruparPorLugar([], lugares)).toHaveLength(4)
  })

  it('las plantas sin lugar van al final, en un grupo sin ubicación', () => {
    const g = agruparPorLugar([planta({ id: 'p' })], lugares)
    expect(nombres(g).at(-1)).toBe('sin lugar')
    expect(g.at(-1)!.ubicacion).toBeUndefined()
  })

  it('el orden no depende del orden en que la base devuelva los lugares', () => {
    const alReves = [...lugares].reverse()
    expect(nombres(agruparPorLugar([], lugares))).toEqual(nombres(agruparPorLugar([], alReves)))
  })
})

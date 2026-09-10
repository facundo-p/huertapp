import { describe, expect, it } from 'vitest'
import { lugarDe, ocupacionDe, ordenDeLugar, proximaTareaDe } from '../src/lib/huerta/lugar'
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

  it('sin ubicación es "sin lugar asignado"', () => {
    expect(lugarDe(undefined)).toMatchObject({ clase: 'otro', etiqueta: 'Sin lugar asignado' })
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

describe('ordenDeLugar', () => {
  it('primero donde nacen las plantas, después donde crecen, y sin lugar al final', () => {
    const orden = [
      ubi({ tipo: 'bancal_tierra' }),
      undefined,
      ubi({ tipo: 'almacigo' }),
      ubi({ tipo: 'otro' }),
      ubi({ tipo: 'maceta' }),
    ]
      .map((u) => ordenDeLugar(u))
      .join('')
    expect(orden).toBe('24031')
  })
})

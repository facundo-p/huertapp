import { describe, expect, it } from 'vitest'
import { construirAgenda } from '../src/lib/tareas/agenda'
import { ESTADO_VACIO, derivarTareas, tareasVisibles } from '../src/lib/tareas/engine'
import { sumarDias } from '../src/lib/huerta/estimar'
import type { Planta } from '../src/lib/huerta/tipos'
import type { EspecieEnriquecida, Zona } from '../src/lib/data/types'
import db from '../data/huerta_gba_enriquecido.json'

const especies = db.especies as unknown as EspecieEnriquecida[]
const porSlug = new Map(especies.map((e) => [e.slug, e]))
const clima = (db.meta as { enriquecido: { clima: Record<Zona, unknown[]> } }).enriquecido.clima
const conurbano = clima.conurbano as Parameters<typeof derivarTareas>[0]['clima']

const HOY = '2026-08-15'

function planta(p: Partial<Planta> & { slug: string }): Planta {
  return {
    id: `p-${p.slug}`,
    sembrada: HOY,
    metodo: 'directa',
    etapa: 'creciendo',
    etapaDesde: HOY,
    creada: `${HOY}T10:00:00.000Z`,
    ...p,
  }
}

const agenda = (plantas: Planta[], hoy = HOY, dias?: number) =>
  construirAgenda({ plantas, porSlug, clima: conurbano }, ESTADO_VACIO, hoy, dias)

describe('agenda de avisos', () => {
  it('sin plantas no hay nada que avisar', () => {
    expect(agenda([])).toEqual([])
  })

  it('anota el día en que la germinación se pasa de plazo, no antes', () => {
    // rabanito germina en 3-7 días: sembrado hoy, el plazo se vence al octavo
    const a = agenda([planta({ slug: 'rabanito', etapa: 'almacigo' })])
    expect(a.length).toBeGreaterThan(0)
    const primero = a[0]
    expect(primero.fecha).toBe(sumarDias(HOY, 8))
    expect(primero.titulo).toMatch(/Rabanito/)
  })

  it('no repite el mismo aviso día tras día', () => {
    // la tarea de germinación demorada sigue viva muchos días seguidos; solo
    // corresponde avisar el día que aparece
    const a = agenda([planta({ slug: 'rabanito', etapa: 'almacigo' })])
    const fechas = a.map((x) => x.fecha)
    expect(new Set(fechas).size).toBe(fechas.length)
    const germinacion = a.filter((x) => /fijate si asomó/.test(x.titulo))
    expect(germinacion).toHaveLength(1)
  })

  it('cada aviso corresponde a tareas que existen ese día', () => {
    const plantas = [
      planta({ slug: 'rabanito', etapa: 'almacigo' }),
      planta({ slug: 'rucula', id: 'r', sembrada: sumarDias(HOY, -35), germino: sumarDias(HOY, -29) }),
      planta({ slug: 'tomate', id: 't', sembrada: sumarDias(HOY, -25), etapa: 'almacigo' }),
    ]
    const a = agenda(plantas)
    expect(a.length).toBeGreaterThan(1)

    for (const aviso of a) {
      const tareas = tareasVisibles(
        derivarTareas({ plantas, porSlug, clima: conurbano, hoy: aviso.fecha }),
        ESTADO_VACIO,
        aviso.fecha,
      )
      expect(tareas.length, aviso.fecha).toBeGreaterThan(0)
      // el texto sale de las tareas de ese día, no de otro
      const titulos = tareas.map((t) => t.titulo)
      if (tareas.length === 1) expect(aviso.titulo).toBe(titulos[0])
      else expect(aviso.titulo).toMatch(/^\d+ cosas para hacer/)
    }
  })

  it('agrupa cuando hay varias tareas el mismo día', () => {
    const plantas = [
      planta({ slug: 'rabanito', etapa: 'almacigo' }),
      planta({ slug: 'lechuga', id: 'l', etapa: 'almacigo' }),
      planta({ slug: 'rucula', id: 'r', etapa: 'almacigo' }),
    ]
    const a = agenda(plantas)
    const agrupado = a.find((x) => /cosas para hacer/.test(x.titulo))
    expect(agrupado).toBeDefined()
    expect(agrupado!.cuerpo).toContain('·')
  })

  it('respeta la ventana de días y no mira más allá', () => {
    const p = [planta({ slug: 'tomate', sembrada: sumarDias(HOY, -25), etapa: 'almacigo' })]
    const corta = agenda(p, HOY, 3)
    const larga = agenda(p, HOY, 40)
    for (const x of corta) expect(x.fecha <= sumarDias(HOY, 3)).toBe(true)
    expect(larga.length).toBeGreaterThanOrEqual(corta.length)
  })

  it('lo que ya completaste no vuelve como aviso', () => {
    const p = [planta({ slug: 'rabanito', etapa: 'almacigo' })]
    const sinTocar = agenda(p)
    const completada = construirAgenda(
      { plantas: p, porSlug, clima: conurbano },
      { completadas: { 'revisar_germinacion:p-rabanito': HOY }, pospuestas: {} },
      HOY,
    )
    expect(sinTocar.some((x) => /fijate si asomó/.test(x.titulo))).toBe(true)
    expect(completada.some((x) => /fijate si asomó/.test(x.titulo))).toBe(false)
  })

  it('todo aviso tiene texto usable: sirve leerlo en la pantalla bloqueada', () => {
    const plantas = [
      planta({ slug: 'rabanito', etapa: 'almacigo' }),
      planta({ slug: 'rucula', id: 'r', sembrada: sumarDias(HOY, -35), germino: sumarDias(HOY, -29) }),
    ]
    for (const a of agenda(plantas)) {
      expect(a.fecha).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(a.titulo.length).toBeGreaterThan(5)
      expect(a.cuerpo.length).toBeGreaterThan(10)
      // nada de plantillas sin resolver
      expect(a.titulo).not.toMatch(/undefined|NaN|\{/)
      expect(a.cuerpo).not.toMatch(/undefined|NaN|\{/)
    }
  })

  it('las fechas vienen en orden', () => {
    const plantas = [
      planta({ slug: 'rabanito', etapa: 'almacigo' }),
      planta({ slug: 'tomate', id: 't', sembrada: sumarDias(HOY, -25), etapa: 'almacigo' }),
      planta({ slug: 'rucula', id: 'r', sembrada: sumarDias(HOY, -35), germino: sumarDias(HOY, -29) }),
    ]
    const fechas = agenda(plantas).map((x) => x.fecha)
    expect(fechas).toEqual([...fechas].sort())
  })
})

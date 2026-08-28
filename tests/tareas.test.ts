import { describe, expect, it } from 'vitest'
import {
  derivarTareas,
  paraSembrarAhora,
  tareasVisibles,
  ESTADO_VACIO,
  type EntradaMotor,
  type Tarea,
} from '../src/lib/tareas/engine'
import { sumarDias } from '../src/lib/huerta/estimar'
import type { Planta } from '../src/lib/huerta/tipos'
import type { EspecieEnriquecida, Zona } from '../src/lib/data/types'
import db from '../data/huerta_gba_enriquecido.json'

const especies = db.especies as unknown as EspecieEnriquecida[]
const porSlug = new Map(especies.map((e) => [e.slug, e]))
const clima = (db.meta as any).enriquecido.clima as Record<Zona, any[]>

const HOY = '2026-08-15' // mediados de agosto, en plena temporada de heladas

function planta(p: Partial<Planta> & { slug: string }): Planta {
  return {
    id: `p-${p.slug}`,
    apodo: undefined,
    sembrada: HOY,
    metodo: 'directa',
    etapa: 'creciendo',
    etapaDesde: HOY,
    creada: `${HOY}T10:00:00.000Z`,
    ...p,
  }
}

const motor = (plantas: Planta[], zona: Zona = 'conurbano', hoy = HOY): Tarea[] =>
  derivarTareas({ plantas, porSlug, clima: clima[zona], hoy } as EntradaMotor)

describe('motor de tareas', () => {
  it('sin plantas no inventa nada que hacer', () => {
    expect(motor([])).toEqual([])
  })

  it('ignora las archivadas y las terminadas', () => {
    const p = [
      planta({ slug: 'tomate', etapa: 'terminada' }),
      planta({ slug: 'lechuga', id: 'x', archivada: true }),
    ]
    expect(motor(p)).toEqual([])
  })

  it('avisa cuando la germinación se pasó de plazo', () => {
    // el tomate germina en 6-10 días: sembrado hace 20 está pasado
    const t = motor([planta({ slug: 'tomate', sembrada: sumarDias(HOY, -20), etapa: 'almacigo' })])
    const tarea = t.find((x) => x.tipo === 'revisar_germinacion')
    expect(tarea).toBeDefined()
    expect(tarea!.atrasada).toBe(true)
    expect(tarea!.detalle).toMatch(/10 días que se pasó/)
  })

  it('no avisa de germinación si el usuario ya dijo que asomó', () => {
    const p = planta({
      slug: 'tomate',
      sembrada: sumarDias(HOY, -20),
      etapa: 'almacigo',
      germino: sumarDias(HOY, -12),
    })
    expect(motor([p]).some((t) => t.tipo === 'revisar_germinacion')).toBe(false)
  })

  it('pide trasplantar cuando el plantín tiene edad', () => {
    // tomate: 30-60 días a trasplante
    const p = planta({ slug: 'tomate', sembrada: sumarDias(HOY, -35), etapa: 'almacigo', germino: sumarDias(HOY, -27) })
    const t = motor([p]).find((x) => x.tipo === 'trasplantar')
    expect(t).toBeDefined()
    expect(t!.fuente).toMatch(/30-60 días desde la siembra/)
  })

  it('si trasplantar expone a la helada, lo dice y lo baja de prioridad', () => {
    const p = planta({ slug: 'tomate', sembrada: sumarDias(HOY, -35), etapa: 'almacigo', germino: sumarDias(HOY, -27) })
    const enAgosto = motor([p], 'conurbano', '2026-08-15').find((x) => x.tipo === 'trasplantar')!
    const enDiciembre = motor(
      [planta({ ...p, sembrada: sumarDias('2026-12-10', -35), germino: sumarDias('2026-12-10', -27) })],
      'conurbano',
      '2026-12-10',
    ).find((x) => x.tipo === 'trasplantar')!

    expect(enAgosto.detalle).toMatch(/probabilidad de helada/)
    expect(enDiciembre.detalle).not.toMatch(/probabilidad de helada/)
    expect(enAgosto.prioridad).toBeGreaterThan(enDiciembre.prioridad)
  })

  it('avisa la cosecha cuando entra en ventana, y no si ya está cosechando', () => {
    const base = { slug: 'rucula', sembrada: sumarDias(HOY, -40), germino: sumarDias(HOY, -34) }
    expect(motor([planta(base)]).some((t) => t.tipo === 'cosechar')).toBe(true)
    expect(motor([planta({ ...base, etapa: 'cosechando' })]).some((t) => t.tipo === 'cosechar')).toBe(false)
  })

  it('avisa de helada solo si hay plantas expuestas que no la banquen', () => {
    const tomate = planta({ slug: 'tomate', etapa: 'creciendo', germino: HOY })
    const kale = planta({ slug: 'kale', id: 'k', etapa: 'creciendo', germino: HOY })

    expect(motor([tomate], 'conurbano', '2026-08-15').some((t) => t.tipo === 'helada')).toBe(true)
    // el kale mejora con la helada: no se avisa
    expect(motor([kale], 'conurbano', '2026-08-15').some((t) => t.tipo === 'helada')).toBe(false)
    // en enero no hay helada que avisar
    expect(motor([tomate], 'conurbano', '2026-01-15').some((t) => t.tipo === 'helada')).toBe(false)
  })

  it('la zona cambia el aviso de helada', () => {
    const tomate = planta({ slug: 'tomate', etapa: 'creciendo', germino: HOY })
    // a principios de octubre CABA ya está tranquila (4 % la década que viene)
    // y el periurbano todavía no (42 %)
    const urbano = motor([tomate], 'urbano', '2026-10-05').some((t) => t.tipo === 'helada')
    const peri = motor([tomate], 'periurbano', '2026-10-05').some((t) => t.tipo === 'helada')
    expect(urbano).toBe(false)
    expect(peri).toBe(true)
  })

  it('toda tarea explica de dónde sale', () => {
    const p = [
      planta({ slug: 'tomate', sembrada: sumarDias(HOY, -35), etapa: 'almacigo' }),
      planta({ slug: 'rucula', id: 'r', sembrada: sumarDias(HOY, -40), germino: sumarDias(HOY, -34) }),
    ]
    const t = motor(p)
    expect(t.length).toBeGreaterThan(0)
    for (const x of t) {
      expect(x.fuente.length, x.titulo).toBeGreaterThan(15)
      expect(x.titulo.length).toBeGreaterThan(3)
      expect(x.detalle.length).toBeGreaterThan(10)
    }
  })

  it('los ids son determinísticos: la misma situación da el mismo id otro día', () => {
    // si el id cambiara con la fecha, lo que completaste hoy reaparecería mañana
    const p = planta({ slug: 'tomate', sembrada: sumarDias(HOY, -20), etapa: 'almacigo' })
    const hoyIds = motor([p], 'conurbano', HOY).map((t) => t.id)
    const mananaIds = motor([p], 'conurbano', sumarDias(HOY, 1)).map((t) => t.id)
    expect(hoyIds).toEqual(mananaIds)
  })

  it('las tareas vienen ordenadas por prioridad', () => {
    const p = [
      planta({ slug: 'tomate', sembrada: sumarDias(HOY, -20), etapa: 'almacigo' }),
      planta({ slug: 'rucula', id: 'r', sembrada: sumarDias(HOY, -40), germino: sumarDias(HOY, -34) }),
    ]
    const t = motor(p)
    const prioridades = t.map((x) => x.prioridad)
    expect(prioridades).toEqual([...prioridades].sort((a, b) => a - b))
  })
})

describe('completar y posponer', () => {
  const tarea = (id: string): Tarea => ({
    id,
    tipo: 'cosechar',
    titulo: 't',
    detalle: 'd',
    fuente: 'f',
    prioridad: 1,
  })

  it('sin estado se ven todas', () => {
    expect(tareasVisibles([tarea('a'), tarea('b')], ESTADO_VACIO, HOY)).toHaveLength(2)
  })

  it('lo completado no vuelve', () => {
    const estado = { completadas: { a: HOY }, pospuestas: {} }
    expect(tareasVisibles([tarea('a'), tarea('b')], estado, HOY).map((t) => t.id)).toEqual(['b'])
  })

  it('lo pospuesto se esconde hasta la fecha y después reaparece', () => {
    const estado = { completadas: {}, pospuestas: { a: sumarDias(HOY, 3) } }
    expect(tareasVisibles([tarea('a')], estado, HOY)).toHaveLength(0)
    expect(tareasVisibles([tarea('a')], estado, sumarDias(HOY, 2))).toHaveLength(0)
    expect(tareasVisibles([tarea('a')], estado, sumarDias(HOY, 3))).toHaveLength(1)
    expect(tareasVisibles([tarea('a')], estado, sumarDias(HOY, 9))).toHaveLength(1)
  })
})

describe('qué sembrar ahora', () => {
  it('propone solo lo que está en ventana ideal', () => {
    const s = paraSembrarAhora(especies, 'conurbano', HOY)
    expect(s.length).toBeGreaterThan(0)
    for (const x of s) expect(x.decadasRestantes).toBeGreaterThan(0)
  })

  it('ordena por lo que primero se cierra', () => {
    const s = paraSembrarAhora(especies, 'conurbano', HOY)
    const restantes = s.map((x) => x.decadasRestantes)
    expect(restantes).toEqual([...restantes].sort((a, b) => a - b))
  })

  it('marca las que se cierran ya y dice si van en almácigo', () => {
    const s = paraSembrarAhora(especies, 'conurbano', HOY)
    for (const x of s) {
      expect(x.seCierra).toBe(x.decadasRestantes <= 2)
      expect(typeof x.enAlmacigo).toBe('boolean')
    }
  })

  it('la zona cambia lo que se propone', () => {
    const urbano = paraSembrarAhora(especies, 'urbano', '2026-10-05', 40).map((x) => x.especie.slug)
    const peri = paraSembrarAhora(especies, 'periurbano', '2026-10-05', 40).map((x) => x.especie.slug)
    expect(urbano).not.toEqual(peri)
  })

  it('respeta el límite', () => {
    expect(paraSembrarAhora(especies, 'conurbano', HOY, 5)).toHaveLength(5)
  })
})

describe('expuestasAHelada', () => {
  it('junta las que la helada mata, sin contar almácigos bajo techo', async () => {
    const { expuestasAHelada } = await import('../src/lib/tareas/engine')
    const plantas = [
      planta({ slug: 'tomate' }), // muere
      planta({ slug: 'albahaca', id: 'p-alba', etapa: 'almacigo' }), // muere, pero en almácigo
      planta({ slug: 'lechuga', id: 'p-lechu' }), // tolera
    ]
    expect(expuestasAHelada(plantas, porSlug).map((p) => p.slug)).toEqual(['tomate'])
  })
})

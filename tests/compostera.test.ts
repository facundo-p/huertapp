import { describe, expect, it } from 'vitest'
import { derivarTareas, type EntradaMotor } from '../src/lib/tareas/engine'
import { tareasDeCompost } from '../src/lib/tareas/compost'
import { avanzar, proximoGiro, revisionListo, siguienteEstado, textoRitmo } from '../src/lib/huerta/compostera'
import { sumarDias } from '../src/lib/huerta/estimar'
import type { Compostera } from '../src/lib/huerta/tipos'
import type { Guia } from '../src/lib/compostaje'
import guiaJson from '../data/compostaje.json'
import db from '../data/huerta_gba_enriquecido.json'

const guia = guiaJson as unknown as Guia
const HOY = '2026-08-15'
const clima = (db.meta as any).enriquecido.clima.conurbano as EntradaMotor['clima']

function compostera(c: Partial<Compostera> = {}): Compostera {
  return {
    id: 'c1',
    nombre: 'Tacho',
    sistema: 'tachos',
    material: 'cocina',
    estado: 'llenando',
    estadoDesde: sumarDias(HOY, -20),
    ritmoDias: 7,
    creada: `${HOY}T10:00:00.000Z`,
    ...c,
  }
}

const girar = (c: Compostera, hoy = HOY, g: Guia | null = guia) =>
  tareasDeCompost([c], g, hoy).find((t) => t.tipo === 'girar_compost')

describe('el próximo giro', () => {
  it('se cuenta desde el último giro anotado, con tu ritmo', () => {
    expect(proximoGiro(compostera({ girada: '2026-08-10', ritmoDias: 7 }))).toBe('2026-08-17')
  })

  it('sin giro anotado se cuenta desde que está en este estado', () => {
    expect(proximoGiro(compostera({ estadoDesde: '2026-08-01', ritmoDias: 3 }))).toBe('2026-08-04')
  })

  it('sin ritmo no hay próximo giro ni tarea', () => {
    const c = compostera({ ritmoDias: null, girada: '2026-07-01' })
    expect(proximoGiro(c)).toBeNull()
    expect(girar(c)).toBeUndefined()
  })
})

describe('la tarea de girar', () => {
  it('cae el día que toca y no antes', () => {
    const c = compostera({ girada: sumarDias(HOY, -7) })
    expect(girar(c)).toBeDefined()
    expect(girar(c)!.atrasada).toBeFalsy()
    expect(girar(compostera({ girada: sumarDias(HOY, -4) }))).toBeUndefined()
  })

  it('queda atrasada si te pasaste, y lo dice', () => {
    const t = girar(compostera({ girada: sumarDias(HOY, -9) }))!
    expect(t.atrasada).toBe(true)
    expect(t.detalle).toMatch(/Hace 9 días/)
  })

  it('el id no cambia de un día al otro: completarla la apaga hasta el próximo giro', () => {
    const c = compostera({ girada: sumarDias(HOY, -7) })
    expect(girar(c, HOY)!.id).toBe(girar(c, sumarDias(HOY, 2))!.id)
    // anotar el giro corre el próximo y cambia el id: es otra tarea
    expect(girar({ ...c, girada: HOY }, sumarDias(HOY, 7))!.id).not.toBe(girar(c, HOY)!.id)
  })

  it('dice de dónde sale: tu ritmo, y lo que dice la guía con su confianza', () => {
    const t = girar(compostera({ girada: sumarDias(HOY, -7) }))!
    expect(t.fuente).toMatch(/tu ritmo: cada semana/)
    expect(t.fuente).toMatch(/la guía: cada 2 o 3 días según la Ciudad/)
    expect(t.fuente).toMatch(/confianza 8\/10/)
    expect(t.composteraId).toBe('c1')
  })

  it('sin la guía cargada sale igual, solo con tu ritmo', () => {
    const t = girar(compostera({ girada: sumarDias(HOY, -7) }), HOY, null)!
    expect(t.fuente).toBe('tu ritmo: cada semana')
  })

  it('en la ventana de la semana aparece fechada el día que entra', () => {
    const c = compostera({ girada: sumarDias(HOY, -3) })
    const tareas = derivarTareas({
      plantas: [],
      porSlug: new Map(),
      clima,
      composteras: [c],
      guia,
      hoy: HOY,
      hasta: sumarDias(HOY, 6),
    })
    const t = tareas.find((x) => x.tipo === 'girar_compost')!
    expect(t.fecha).toBe(sumarDias(HOY, 4))
  })
})

describe('los estados', () => {
  it('giran en rueda: madurando vuelve a llenando', () => {
    expect(siguienteEstado('llenando')).toBe('cocinando')
    expect(siguienteEstado('cocinando')).toBe('madurando')
    expect(siguienteEstado('madurando')).toBe('llenando')
  })

  it('salir de llenando fija desde cuándo no recibe restos, y «lo usé» lo borra todo', () => {
    const c = compostera({ girada: '2026-08-10' })
    const cocinando = avanzar(c, HOY)
    expect(cocinando.estado).toBe('cocinando')
    expect(cocinando.cerrada).toBe(HOY)
    expect(cocinando.estadoDesde).toBe(HOY)
    const madurando = avanzar(cocinando, '2026-09-01')
    expect(madurando.cerrada).toBe(HOY) // se conserva: es desde donde la guía cuenta
    const deNuevo = avanzar(madurando, '2026-12-01')
    expect(deNuevo).toMatchObject({ estado: 'llenando', estadoDesde: '2026-12-01' })
    expect(deNuevo.cerrada).toBeUndefined()
    expect(deNuevo.girada).toBeUndefined()
  })
})

describe('¿ya está?', () => {
  const madurando = (cerradaHace: number, sistema: Compostera['sistema'] = 'tachos') =>
    compostera({ sistema, estado: 'madurando', estadoDesde: sumarDias(HOY, -10), cerrada: sumarDias(HOY, -cerradaHace), ritmoDias: null })

  const listo = (c: Compostera) => tareasDeCompost([c], guia, HOY).find((t) => t.tipo === 'compost_listo')

  it('usa el plazo de la guía para ese sistema, contado desde que dejó de recibir restos', () => {
    expect(revisionListo(madurando(120), guia.sistemas.tachos.listo_desde.dias)).toBe(HOY)
    expect(listo(madurando(120))).toBeDefined()
    expect(listo(madurando(100))).toBeUndefined()
    // a suelo el plazo es más corto
    expect(listo(madurando(100, 'suelo'))).toBeDefined()
  })

  it('cita la guía con su confianza', () => {
    const t = listo(madurando(130))!
    expect(t.fuente).toMatch(/según la guía: A los 4 meses/)
    expect(t.fuente).toMatch(/confianza 8\/10/)
    expect(t.detalle).toMatch(/no reconocés lo que entró/)
  })

  it('mientras se llena no hay plazo que contar', () => {
    expect(listo(compostera({ estadoDesde: sumarDias(HOY, -200) }))).toBeUndefined()
  })

  it('sin la guía no se inventa un plazo', () => {
    expect(tareasDeCompost([madurando(200)], null, HOY)).toEqual([])
  })
})

describe('textoRitmo', () => {
  it('habla como la gente', () => {
    expect(textoRitmo(7)).toBe('cada semana')
    expect(textoRitmo(3)).toBe('cada 3 días')
    expect(textoRitmo(30)).toBe('cada mes')
    expect(textoRitmo(null)).toBe('sin aviso')
  })
})

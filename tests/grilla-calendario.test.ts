import { describe, expect, it } from 'vitest'
import {
  decadasDeCosecha,
  filasCalendario,
  terciosDelMes,
  tramos,
} from '../src/lib/grillaCalendario'
import { decadasDelAnio } from '../src/lib/data/especies'
import type { EspecieEnriquecida, Grupo } from '../src/lib/data/types'
import type { Planta } from '../src/lib/huerta/tipos'
import type { EstadoMes } from '../src/lib/data/especies'
import db from '../data/huerta_gba_enriquecido.json'

const especies = db.especies as unknown as EspecieEnriquecida[]
const porSlug = new Map(especies.map((e) => [e.slug, e]))
const padres = especies.filter((e) => !e.variedad_de)
const porGrupo = new Map<Grupo, EspecieEnriquecida[]>()
for (const e of padres) porGrupo.set(e.grupo, [...(porGrupo.get(e.grupo) ?? []), e])
const ORDEN = [...porGrupo.keys()]
const tomate = porSlug.get('tomate')!

const planta = (slug: string, extra: Partial<Planta> = {}): Planta =>
  ({ id: `p-${slug}`, slug, sembrada: '2026-08-15', metodo: 'almacigo', etapa: 'almacigo', creada: '2026-08-15', ...extra }) as Planta

describe('decadasDeCosecha', () => {
  it('son 36 y salen de la siembra más los días a cosecha', () => {
    const c = decadasDeCosecha(tomate, 'conurbano')
    expect(c).toHaveLength(36)
    const siembra = decadasDelAnio(tomate, 'conurbano', 'siembra')
    const primera = siembra.findIndex(Boolean)
    // 80-100 días después de la primera siembra: 8 a 10 décadas más adelante
    const desde = Math.floor(tomate.dias_a_cosecha!.min / 10)
    expect(c[(primera + desde) % 36]).not.toBeNull()
    expect(c.some(Boolean)).toBe(true)
  })

  it('sin días a cosecha no dibuja nada: fila vacía, no fila oculta', () => {
    const sin = { ...tomate, dias_a_cosecha: null }
    expect(decadasDeCosecha(sin, 'conurbano').every((d) => d === null)).toBe(true)
  })

  it('da la vuelta al año en vez de caerse del calendario', () => {
    // una especie que se siembra solo en diciembre (décadas 34-36) y tarda 60 días
    const e = {
      ...tomate,
      dias_a_cosecha: { min: 60, max: 60 },
      calendario: {
        ...tomate.calendario,
        decadas: { ...tomate.calendario.decadas, conurbano: { siembra_ideal: [34, 35, 36], siembra_posible: [], trasplante_ideal: [], trasplante_posible: [] } },
      },
    } as EspecieEnriquecida
    const c = decadasDeCosecha(e, 'conurbano')
    expect(c[3]).toBe('ideal') // década 34 + 6 = 40 → 4
    expect(c[33]).toBeNull()
  })

  it('una cosecha de siembra ideal pisa a la de siembra posible en la misma década', () => {
    const e = {
      ...tomate,
      dias_a_cosecha: { min: 30, max: 30 },
      calendario: {
        ...tomate.calendario,
        decadas: { ...tomate.calendario.decadas, conurbano: { siembra_ideal: [2], siembra_posible: [1, 3], trasplante_ideal: [], trasplante_posible: [] } },
      },
    } as EspecieEnriquecida
    const c = decadasDeCosecha(e, 'conurbano')
    expect(c[4]).toBe('ideal') // 2 + 3
    expect(c[3]).toBe('posible') // 1 + 3
  })
})

describe('tramos', () => {
  it('agosto posible + septiembre ideal son dos tramos que se tocan', () => {
    const d: EstadoMes[] = Array.from({ length: 36 }, () => null)
    for (const i of [22, 23, 24]) d[i - 1] = 'posible'
    for (const i of [25, 26, 27]) d[i - 1] = 'ideal'
    expect(tramos(d)).toEqual([
      { desde: 22, hasta: 24, estado: 'posible' },
      { desde: 25, hasta: 27, estado: 'ideal' },
    ])
  })

  it('no cruza el fin de año: se dibuja en dos pedazos', () => {
    const d: EstadoMes[] = Array.from({ length: 36 }, () => null)
    d[35] = 'ideal'
    d[0] = 'ideal'
    expect(tramos(d)).toHaveLength(2)
  })

  it('sin nada, ningún tramo', () => {
    expect(tramos(Array.from({ length: 36 }, () => null))).toEqual([])
  })
})

describe('filasCalendario', () => {
  it('con «solo mi huerta» quedan las especies plantadas y los grupos vacíos desaparecen', () => {
    const grupos = filasCalendario(porGrupo, ORDEN, [planta('tomate')], 'conurbano', { capa: 'siembra', soloMia: true, grupo: null })
    expect(grupos).toHaveLength(1)
    expect(grupos[0].filas.map((f) => f.especie.slug)).toEqual(['tomate'])
    expect(grupos[0].filas[0].enMiHuerta).toBe(true)
  })

  it('una planta archivada o terminada no cuenta como «mi huerta»', () => {
    const g = filasCalendario(porGrupo, ORDEN, [planta('tomate', { etapa: 'terminada' })], 'conurbano', { capa: 'siembra', soloMia: true, grupo: null })
    expect(g).toEqual([])
  })

  it('en la capa de trasplante van solo las que se trasplantan', () => {
    const g = filasCalendario(porGrupo, ORDEN, [], 'conurbano', { capa: 'trasplante', soloMia: false, grupo: null })
    for (const s of g) for (const f of s.filas) expect(f.decadas.some(Boolean)).toBe(true)
    expect(g.flatMap((s) => s.filas).find((f) => f.especie.slug === 'zanahoria')).toBeUndefined()
  })

  it('en la capa de cosecha las filas sin dato están, vacías', () => {
    const g = filasCalendario(porGrupo, ORDEN, [], 'conurbano', { capa: 'cosecha', soloMia: false, grupo: null })
    const total = g.reduce((n, s) => n + s.filas.length, 0)
    expect(total).toBe(padres.length)
  })
})

describe('terciosDelMes', () => {
  it('devuelve los tres tercios con lo que se siembra, ideal primero y cortado', () => {
    const t = terciosDelMes(9, padres, porSlug, [], 'conurbano', '2026-09-07', 7)
    expect(t).toHaveLength(3)
    expect(t[0].decada).toBe(25)
    expect(t[0].siembra.length).toBeLessThanOrEqual(7)
    expect(t[0].siembra.length + t[0].demas).toBeGreaterThan(7)
  })

  it('lo ideal que antes se cierra va primero', () => {
    const t = terciosDelMes(9, padres, porSlug, [], 'conurbano', '2026-09-07', 7)
    const quedan = (nombre: string) => {
      const e = padres.find((x) => x.nombre_comun === nombre)!
      const d = decadasDelAnio(e, 'conurbano', 'siembra')
      let n = 0
      for (let i = 24; i < 60 && d[i % 36] === 'ideal'; i++) n++
      return n
    }
    const primero = quedan(t[0].siembra[0])
    const minimo = Math.min(...padres.filter((e) => decadasDelAnio(e, 'conurbano', 'siembra')[24] === 'ideal').map((e) => quedan(e.nombre_comun)))
    expect(primero).toBe(minimo)
  })

  it('dice qué pasa en tu huerta cuando una ventana cae en el tercio', () => {
    // tomate sembrado el 15/8, 30-60 días a trasplante: mediados/fines de septiembre
    const t = terciosDelMes(9, padres, porSlug, [planta('tomate', { apodo: 'Los del cajón' })], 'conurbano', '2026-09-07')
    expect(t.some((x) => x.enTuHuerta.includes('trasplantás los del cajón'))).toBe(true)
    expect(t[0].enTuHuerta).toEqual([])
  })

  it('un mes ya pasado habla del año que viene, no del pasado', () => {
    // sembrado en agosto 2026, la cosecha de 80-100 días cae en noviembre;
    // el panel de marzo no puede decir «cosechás» mirando marzo de 2026
    const t = terciosDelMes(3, padres, porSlug, [planta('tomate')], 'conurbano', '2026-09-07')
    expect(t.every((x) => x.enTuHuerta.length === 0)).toBe(true)
  })
})

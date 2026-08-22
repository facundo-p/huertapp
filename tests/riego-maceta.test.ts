import { describe, it, expect } from 'vitest'
import enriquecido from '../data/huerta_gba_enriquecido.json'
import type { EspecieEnriquecida } from '../src/lib/data/types'
import { REGIMENES_RIEGO } from '../src/lib/data/types'
import { ETIQUETA_RIEGO, QUE_ES_RIEGO, nivelRiego } from '../src/lib/riego'

const ESPECIES = (enriquecido as unknown as { especies: EspecieEnriquecida[] }).especies

describe('riego y maceta', () => {
  it('las dos claves están en todas las entradas, aunque valgan null', () => {
    // JSON.stringify borra undefined: sin esto el tipo miente y la ficha omite
    for (const e of ESPECIES) {
      expect(Object.hasOwn(e, 'riego'), e.slug).toBe(true)
      expect(Object.hasOwn(e, 'maceta'), e.slug).toBe(true)
      expect(e.riego === null || typeof e.riego === 'object', e.slug).toBe(true)
      expect(e.maceta === null || typeof e.maceta === 'object', e.slug).toBe(true)
    }
  })

  it('todo campo cargado trae fuente con URL y confianza 1-10', () => {
    for (const e of ESPECIES) {
      for (const [nombre, d] of [
        ['riego', e.riego],
        ['maceta', e.maceta],
      ] as const) {
        if (!d) continue
        expect(d.fuentes.length, `${e.slug} · ${nombre}`).toBeGreaterThan(0)
        for (const f of d.fuentes) expect(f.url, `${e.slug} · ${nombre}`).toMatch(/^https?:\/\//)
        expect(d.confianza, `${e.slug} · ${nombre}`).toBeGreaterThanOrEqual(1)
        expect(d.confianza, `${e.slug} · ${nombre}`).toBeLessThanOrEqual(10)
      }
    }
  })

  it('el régimen sale del enum, y puede ser null aunque haya riego', () => {
    for (const e of ESPECIES) {
      if (!e.riego) continue
      const r = e.riego.regimen
      // null con riego presente es legítimo: hay prosa que no mapea a un escalón
      if (r !== null) expect(REGIMENES_RIEGO, e.slug).toContain(r)
    }
  })

  it('las medidas son números mayores a 0 o null, y nunca las tres en null', () => {
    for (const e of ESPECIES) {
      if (!e.maceta) continue
      const m = e.maceta.medidas
      expect(Object.keys(m).sort()).toEqual([
        'litros_min',
        'plantas_por_contenedor',
        'profundidad_min_cm',
      ])
      for (const [k, v] of Object.entries(m)) {
        if (v !== null) expect(v, `${e.slug} · ${k}`).toBeGreaterThan(0)
      }
      expect(Object.values(m).some((v) => v !== null), `${e.slug}: las tres en null`).toBe(true)
    }
  })

  it('la escala es ordinal y llega justo a los cuatro niveles', () => {
    expect(REGIMENES_RIEGO).toEqual(['escaso', 'espaciado', 'parejo', 'constante'])
    expect(nivelRiego('escaso')).toBe(1)
    expect(nivelRiego('constante')).toBe(REGIMENES_RIEGO.length)
    // sin etiqueta ni explicación, la barrita queda sin su canal de texto
    for (const r of REGIMENES_RIEGO) {
      expect(ETIQUETA_RIEGO[r], r).toBeTruthy()
      expect(QUE_ES_RIEGO[r].length, r).toBeGreaterThan(30)
    }
  })

  it('el cuidado de riego que sobrevive dice algo que el campo nuevo no dice', () => {
    // Son ejes distintos que se apilan: el campo dice CUÁNTA agua, el cuidado
    // dice CUÁNDO cambia y qué pasa si no. Se podó sólo lo que repetía al campo.
    // De #36: el que trae un `cuando` real no se poda nunca — es lo que el
    // chequeo de riego automatizado necesita para no juntar una cebolla con
    // algo que se riega hasta el final.
    const GENERICO = 'Todo el ciclo'
    for (const e of ESPECIES) {
      const c = e.cuidados.find((x) => x.tipo === 'riego')
      if (!c) continue
      if (e.slug === 'espinaca') continue // su único cuidado: podarlo la deja en cero
      expect(c.cuando !== GENERICO || Boolean(c.por_que), e.slug).toBe(true)
    }
  })

  it('la cebolla conserva el corte de riego, que es de calendario y no de dosis', () => {
    // #36: puede coincidir en régimen con su vecina y ser igual incompatible
    // en la misma manguera. Si esto se poda, ese chequeo se queda sin dato.
    const cebolla = ESPECIES.find((e) => e.slug === 'cebolla')!
    const riego = cebolla.cuidados.find((c) => c.tipo === 'riego')
    expect(riego?.cuando).toMatch(/antes de cosechar/i)
    expect(cebolla.riego?.regimen).toBeNull()
  })
})

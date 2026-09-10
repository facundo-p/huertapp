import { describe, expect, it } from 'vitest'
import { hitoDePlanta, hitoDelLugar } from '../src/lib/huerta/hito'
import type { Planta } from '../src/lib/huerta/tipos'
import type { EspecieEnriquecida } from '../src/lib/data/types'
import db from '../data/huerta_gba_enriquecido.json'

const especies = db.especies as unknown as EspecieEnriquecida[]
const porSlug = new Map(especies.map((e) => [e.slug, e]))
const get = (s: string) => {
  const e = porSlug.get(s)
  if (!e) throw new Error(`falta ${s} en el catálogo`)
  return e
}

const HOY = '2026-09-10'

const planta = (p: Partial<Planta>): Planta => ({
  id: 'p1',
  slug: 'lechuga',
  sembrada: '2026-08-01',
  metodo: 'directa',
  etapa: 'creciendo',
  etapaDesde: '2026-08-01',
  creada: '2026-08-01',
  ...p,
})

describe('hitoDePlanta', () => {
  it('mientras no asomó, ése es EL dato: el próximo hito se calla', () => {
    // rúcula sembrada hace 40 días, germina en 4-8: pasada de plazo
    const l = hitoDePlanta(planta({ slug: 'rucula', sembrada: '2026-08-01' }), get('rucula'), HOY)
    expect(l?.estado).toBe('demorado')
    expect(l!.texto).toMatch(/debería haber asomado/)
  })

  it('ya germinada, habla el hito del ciclo', () => {
    const l = hitoDePlanta(
      planta({ slug: 'lechuga', sembrada: '2026-08-01', germino: '2026-08-07' }),
      get('lechuga'),
      HOY,
    )
    expect(l?.texto).toMatch(/^Cosecha:/)
  })

  it('una planta terminada no tiene nada que decir', () => {
    const l = hitoDePlanta(
      planta({ slug: 'lechuga', etapa: 'terminada', germino: '2026-08-07' }),
      get('lechuga'),
      HOY,
    )
    expect(l).toBeNull()
  })
})

describe('hitoDelLugar', () => {
  it('gana lo demorado sobre lo que está listo y sobre lo que falta', () => {
    const plantas = [
      planta({ id: 'a', slug: 'lechuga', sembrada: '2026-08-01', germino: '2026-08-07' }),
      planta({ id: 'b', slug: 'rucula', sembrada: '2026-08-01' }),
    ]
    expect(hitoDelLugar(plantas, porSlug, HOY)?.estado).toBe('demorado')
  })

  it('un lugar vacío no dice nada', () => {
    expect(hitoDelLugar([], porSlug, HOY)).toBeNull()
  })

  it('una especie que no está en el catálogo se saltea sin romper', () => {
    expect(hitoDelLugar([planta({ slug: 'no-existe' })], porSlug, HOY)).toBeNull()
  })
})

import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import { causasDeDemora, germinacion, germinacionPendiente } from '../src/lib/huerta/germinacion'
import type { EspecieEnriquecida, PistaGerminacion } from '../src/lib/data/types'
import type { Planta } from '../src/lib/huerta/tipos'

const root = join(__dirname, '..')
const db = JSON.parse(readFileSync(join(root, 'data/huerta_gba_enriquecido.json'), 'utf8'))

const TIPOS_PISTA = [
  'profundidad',
  'luz',
  'humedad',
  'pretratamiento',
  'paciencia',
  'varias',
  'poder',
  'latencia',
  'vegetativo',
]

const porSlug = (s: string): EspecieEnriquecida =>
  db.especies.find((e: EspecieEnriquecida) => e.slug === s)

/** Una siembra vieja, para que el diagnóstico se dispare. */
const planta = (slug: string): Planta => ({
  id: `p-${slug}`,
  slug,
  sembrada: '2026-03-01',
  metodo: 'directa',
  etapa: 'creciendo',
  etapaDesde: '2026-03-01',
  creada: '2026-03-01',
})

const clima = db.meta.enriquecido.clima.conurbano

describe('pistas de germinación por especie', () => {
  it('todas las pistas son del vocabulario y heredan fuentes con URL', () => {
    for (const e of db.especies as EspecieEnriquecida[]) {
      expect(Array.isArray(e.germinacion_pistas), e.slug).toBe(true)
      for (const p of e.germinacion_pistas) {
        expect(TIPOS_PISTA, `${e.slug}: ${p.tipo}`).toContain(p.tipo)
        expect(p.texto.length, e.slug).toBeGreaterThan(20)
        const campo = (e as unknown as Record<string, { fuentes: unknown; confianza: number }>)[p.de]
        expect(campo, `${e.slug}: de "${p.de}"`).toBeDefined()
        expect(p.fuentes).toEqual(campo.fuentes)
        expect(p.confianza).toBe(campo.confianza)
        expect(p.fuentes.length, `${e.slug}/${p.tipo}`).toBeGreaterThan(0)
      }
      // dos pistas del mismo tipo serían dos tarjetas con el mismo título
      const tipos = e.germinacion_pistas.map((p: PistaGerminacion) => p.tipo)
      expect(new Set(tipos).size, `${e.slug}: tipos repetidos`).toBe(tipos.length)
    }
  })

  it('el vocabulario está todo en uso', () => {
    const usados = new Set(
      (db.especies as EspecieEnriquecida[]).flatMap((e) => e.germinacion_pistas.map((p) => p.tipo)),
    )
    expect([...TIPOS_PISTA].sort()).toEqual([...usados].sort())
  })

  /**
   * El bug que esto arregla: las causas eran las mismas tres para las 55
   * especies. Si dos fichas distintas vuelven a dar exactamente el mismo
   * diagnóstico, volvimos al principio.
   */
  it('dos especies distintas ya no dan el mismo diagnóstico', () => {
    const berro = causasDeDemora(planta('berro'), porSlug('berro'), clima)
    const zanahoria = causasDeDemora(planta('zanahoria'), porSlug('zanahoria'), clima)

    const titulos = (cs: { titulo: string }[]) => cs.map((c) => c.titulo).join('|')
    expect(titulos(berro)).not.toBe(titulos(zanahoria))

    // y cada una dice lo suyo
    expect(berro.some((c) => /luz/i.test(c.titulo))).toBe(true)
    expect(zanahoria.some((c) => /tarda/i.test(c.titulo))).toBe(true)
  })

  it('la pista concreta reemplaza al consejo genérico, no se suma', () => {
    const cs = causasDeDemora(planta('zanahoria'), porSlug('zanahoria'), clima)
    const titulos = cs.map((c) => c.titulo)

    // la zanahoria tiene pista de profundidad y de humedad: las dos genéricas
    // se van, para no decir dos veces lo mismo con distinta precisión
    expect(titulos).not.toContain('Profundidad')
    expect(titulos).not.toContain('Humedad pareja')
    expect(titulos).toContain('A qué profundidad va')
    expect(titulos).toContain('Humedad, y sin fallar un día')
    // la edad de la semilla no la cubre ninguna pista, así que queda
    expect(titulos).toContain('Edad de la semilla')
  })

  it('una especie sin pistas conserva los tres chequeos de siempre', () => {
    const e = (db.especies as EspecieEnriquecida[]).find((x) => x.germinacion_pistas.length === 0)!
    const titulos = causasDeDemora(planta(e.slug), e, clima).map((c) => c.titulo)
    expect(titulos).toContain('Humedad pareja')
    expect(titulos).toContain('Profundidad')
    expect(titulos).toContain('Edad de la semilla')
  })

  it('las causas van de lo más específico a lo más general', () => {
    const cs = causasDeDemora(planta('zanahoria'), porSlug('zanahoria'), clima)
    const orden = { medido: 0, especie: 1, chequear: 2 } as const
    const niveles = cs.map((c) => orden[c.clase])
    expect(niveles).toEqual([...niveles].sort((a, b) => a - b))
  })

  it('solo las causas de la ficha llevan fuentes', () => {
    for (const c of causasDeDemora(planta('perejil'), porSlug('perejil'), clima)) {
      if (c.clase === 'especie') expect(c.fuentes?.length).toBeGreaterThan(0)
      else expect(c.fuentes).toBeUndefined()
    }
  })
})

describe('germinacionPendiente', () => {
  const tomate = porSlug('tomate')

  it('pendiente mientras la pregunta siga abierta: temprano, en ventana o demorada', () => {
    // el tomate germina en 6-10 días; sembrado el 1/3
    expect(germinacionPendiente(germinacion(planta('tomate'), tomate, '2026-03-03'))).toBe(true)
    expect(germinacionPendiente(germinacion(planta('tomate'), tomate, '2026-03-08'))).toBe(true)
    expect(germinacionPendiente(germinacion(planta('tomate'), tomate, '2026-03-25'))).toBe(true)
  })

  it('resuelta o inaplicable, no hay nada que esperar', () => {
    const marcada = { ...planta('tomate'), germino: '2026-03-08' }
    const plantada = { ...planta('tomate'), metodo: 'plantacion' as const }
    expect(germinacionPendiente(germinacion(marcada, tomate, '2026-03-25'))).toBe(false)
    expect(germinacionPendiente(germinacion(plantada, tomate, '2026-03-25'))).toBe(false)
    // especie sin dias_germinacion: germinacion() da null, y sin dato no se espera
    expect(germinacionPendiente(null)).toBe(false)
  })
})

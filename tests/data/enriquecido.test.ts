// Validación estructural de la capa de datos enriquecida (Fase 0).
// Corre sobre el JSON generado; si falla, corregir data/enriquecimiento.json
// y regenerar con `npm run data:build`.
import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(__dirname, '../..')
const db = JSON.parse(readFileSync(join(root, 'data/huerta_gba_enriquecido.json'), 'utf8'))
const overlay = JSON.parse(readFileSync(join(root, 'data/enriquecimiento.json'), 'utf8'))

const METODOS = ['directa', 'almacigo', 'directa|almacigo', 'almacigo_protegido', 'plantacion']

type Rango = { min: number; max: number } | null

const esMesValido = (m: unknown) => Number.isInteger(m) && (m as number) >= 1 && (m as number) <= 12
const sinRepetidos = (xs: number[]) => new Set(xs).size === xs.length
const ordenado = (xs: number[]) => xs.every((x, i) => i === 0 || xs[i - 1] < x)

describe('huerta_gba_enriquecido.json', () => {
  it('tiene las 55 especies, con slugs únicos que matchean el overlay', () => {
    expect(db.especies).toHaveLength(55)
    const slugs = db.especies.map((e: any) => e.slug)
    expect(new Set(slugs).size).toBe(55)
    expect(Object.keys(overlay).sort()).toEqual([...slugs].sort())
  })

  describe.each(db.especies.map((e: any) => [e.slug, e]))('%s', (_slug, e: any) => {
    const cal = e.calendario

    it('calendario: meses válidos, ordenados y sin solapamiento ideal/posible', () => {
      for (const campo of ['siembra_ideal', 'siembra_posible', 'trasplante_ideal', 'trasplante_posible']) {
        const meses = cal[campo]
        expect(Array.isArray(meses)).toBe(true)
        expect(meses.every(esMesValido)).toBe(true)
        expect(sinRepetidos(meses)).toBe(true)
        expect(ordenado(meses)).toBe(true)
      }
      expect(cal.siembra_ideal.length).toBeGreaterThan(0)
      const sIdeal = new Set(cal.siembra_ideal)
      expect(cal.siembra_posible.some((m: number) => sIdeal.has(m))).toBe(false)
      const tIdeal = new Set(cal.trasplante_ideal)
      expect(cal.trasplante_posible.some((m: number) => tIdeal.has(m))).toBe(false)
    })

    it('metodo_por_mes: claves ⊆ meses de siembra, valores del enum, todo mes de siembra cubierto', () => {
      const mesesSiembra = new Set([...cal.siembra_ideal, ...cal.siembra_posible])
      const claves = Object.keys(cal.metodo_por_mes).map(Number)
      for (const k of claves) expect(mesesSiembra.has(k)).toBe(true)
      for (const m of mesesSiembra) expect(cal.metodo_por_mes[String(m)]).toBeDefined()
      for (const v of Object.values(cal.metodo_por_mes)) expect(METODOS).toContain(v)
    })

    it('trasplante: meses no vacíos implican dias_a_trasplante', () => {
      const tieneVentana = cal.trasplante_ideal.length + cal.trasplante_posible.length > 0
      if (tieneVentana) expect(e.dias_a_trasplante).not.toBeNull()
    })

    it('rangos de días: min ≤ max, positivos (o null)', () => {
      for (const campo of ['dias_a_trasplante', 'dias_a_cosecha', 'dias_germinacion']) {
        const r: Rango = e[campo]
        if (r !== null) {
          expect(r.min).toBeGreaterThan(0)
          expect(r.max).toBeGreaterThanOrEqual(r.min)
        }
      }
    })

    it('asociaciones: internas resuelven a slug real, externas tienen etiqueta', () => {
      const slugs = new Set(db.especies.map((x: any) => x.slug))
      for (const tipo of ['buenas', 'malas']) {
        for (const a of e.asociaciones[tipo]) {
          if (a.externa) {
            expect(typeof a.etiqueta).toBe('string')
            expect(a.etiqueta.length).toBeGreaterThan(0)
          } else {
            expect(slugs.has(a.slug)).toBe(true)
            expect(a.slug).not.toBe(e.slug)
          }
        }
      }
    })

    it('derivacion no vacía y confianza 1-10', () => {
      expect(cal.derivacion.length).toBeGreaterThan(10)
      expect(cal.confianza).toBeGreaterThanOrEqual(1)
      expect(cal.confianza).toBeLessThanOrEqual(10)
    })
  })
})

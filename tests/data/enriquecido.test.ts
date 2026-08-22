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

// La misma lista que valida el build y que tipa la app. Se repite acá a
// propósito: si alguien suma un tipo, el test lo obliga a pasar por los tres
// lugares —build, tipos y glosario— en vez de colarse por uno solo.
const TIPOS_CUIDADO = [
  'raleo',
  'aporque',
  'tutorado',
  'poda',
  'mulch',
  'blanqueo',
  'riego',
  'abonado',
  'desmalezar',
  'rotacion',
  'polinizacion',
  'proteger',
  'contener',
  'dividir',
]

type Rango = { min: number; max: number } | null

const esMesValido = (m: unknown) => Number.isInteger(m) && (m as number) >= 1 && (m as number) <= 12
const sinRepetidos = (xs: number[]) => new Set(xs).size === xs.length
const ordenado = (xs: number[]) => xs.every((x, i) => i === 0 || xs[i - 1] < x)

describe('huerta_gba_enriquecido.json', () => {
  it('tiene las 55 especies del catálogo más sus variedades, con slugs únicos', () => {
    const padres = db.especies.filter((e: any) => !e.variedad_de)
    expect(padres).toHaveLength(55)
    const slugs = db.especies.map((e: any) => e.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
    // el overlay tiene una entrada por especie del catálogo; las derivadas
    // viven adentro de la del padre, en `variedades_derivado`
    expect(Object.keys(overlay).sort()).toEqual(padres.map((e: any) => e.slug).sort())
  })

  for (const e of db.especies as any[]) {
    describe(e.slug, () => {
    const cal = e.calendario

    it('fuente_meses: meses válidos, ordenados y sin solapamiento ideal/posible', () => {
      const f = cal.fuente_meses
      for (const campo of ['siembra_ideal', 'siembra_posible', 'trasplante_ideal', 'trasplante_posible']) {
        const meses = f[campo]
        expect(Array.isArray(meses)).toBe(true)
        expect(meses.every(esMesValido)).toBe(true)
        expect(sinRepetidos(meses)).toBe(true)
        expect(ordenado(meses)).toBe(true)
      }
      expect(f.siembra_ideal.length).toBeGreaterThan(0)
      const sIdeal = new Set(f.siembra_ideal)
      expect(f.siembra_posible.some((m: number) => sIdeal.has(m))).toBe(false)
      const tIdeal = new Set(f.trasplante_ideal)
      expect(f.trasplante_posible.some((m: number) => tIdeal.has(m))).toBe(false)
    })

    it('decadas: las tres zonas generadas, con el afinado y su confianza', () => {
      for (const zona of ['urbano', 'conurbano', 'periurbano']) {
        const z = cal.decadas[zona]
        expect(z, `${e.slug} sin zona ${zona}`).toBeDefined()
        for (const campo of ['siembra_ideal', 'siembra_posible', 'trasplante_ideal', 'trasplante_posible']) {
          expect(ordenado(z[campo])).toBe(true)
          expect(sinRepetidos(z[campo])).toBe(true)
          expect(z[campo].every((d: number) => d >= 1 && d <= 36)).toBe(true)
        }
        expect(z.siembra_ideal.length + z.siembra_posible.length).toBeGreaterThan(0)
      }
      expect(['afinado', 'sin_afinar', 'fuente_explicita']).toContain(cal.afinado.estado)
      expect(cal.afinado.confianza).toBeGreaterThanOrEqual(1)
      expect(cal.afinado.confianza).toBeLessThanOrEqual(10)
    })

    it('metodo_por_mes: claves ⊆ meses de siembra, valores del enum, todo mes de siembra cubierto', () => {
      const mesesSiembra = new Set([...cal.fuente_meses.siembra_ideal, ...cal.fuente_meses.siembra_posible])
      const claves = Object.keys(cal.metodo_por_mes).map(Number)
      for (const k of claves) expect(mesesSiembra.has(k)).toBe(true)
      for (const m of mesesSiembra) expect(cal.metodo_por_mes[String(m)]).toBeDefined()
      for (const v of Object.values(cal.metodo_por_mes)) expect(METODOS).toContain(v)
    })

    it('trasplante: meses no vacíos implican dias_a_trasplante', () => {
      const tieneVentana = cal.fuente_meses.trasplante_ideal.length + cal.fuente_meses.trasplante_posible.length > 0
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

    it('temperaturas: rangos coherentes, helada del enum, nota y fuentes', () => {
      const t = e.temperaturas
      expect(t).toBeDefined()

      // Valores plausibles para huerta (nadie germina a -20 ni a 70 °C)
      const numeros = [...Object.values(t.germinacion), ...Object.values(t.crecimiento)].filter(
        (v): v is number => v !== null,
      )
      for (const v of numeros) {
        expect(Number.isFinite(v)).toBe(true)
        expect(v).toBeGreaterThanOrEqual(-25)
        expect(v).toBeLessThanOrEqual(50)
      }

      // Orden interno: min ≤ ideal_min ≤ ideal_max ≤ max
      const g = t.germinacion
      const escalaG = [g.min, g.ideal_min, g.ideal_max, g.max].filter((v: number | null) => v !== null)
      expect(escalaG).toEqual([...escalaG].sort((a: number, b: number) => a - b))

      const c = t.crecimiento
      const escalaC = [c.tolera_min, c.ideal_min, c.ideal_max, c.tolera_max].filter(
        (v: number | null) => v !== null,
      )
      expect(escalaC).toEqual([...escalaC].sort((a: number, b: number) => a - b))

      if (t.helada !== null) expect(['muere', 'sensible', 'tolera', 'mejora']).toContain(t.helada)
      expect(t.nota.length).toBeGreaterThan(10)
      expect(t.fuentes.length).toBeGreaterThan(0)
      for (const f of t.fuentes) expect(f.url).toMatch(/^https?:\/\//)
      expect(t.confianza).toBeGreaterThanOrEqual(1)
      expect(t.confianza).toBeLessThanOrEqual(10)
    })

    /**
     * Toda especie tiene algo que decir sobre qué hacer mientras crece: si una
     * quedara vacía, su ficha mostraría el hueco justo donde alguien viene a
     * buscar qué hacer con la planta que ya tiene plantada.
     */
    it('cuidados: al menos uno, del vocabulario cerrado y con fuentes heredadas', () => {
      expect(Array.isArray(e.cuidados)).toBe(true)
      expect(e.cuidados.length).toBeGreaterThan(0)

      for (const c of e.cuidados) {
        expect(TIPOS_CUIDADO, `${e.slug}: tipo "${c.tipo}"`).toContain(c.tipo)
        expect(c.cuando.length).toBeGreaterThan(2)
        expect(c.que_hacer.length).toBeGreaterThan(5)
        if (c.por_que !== null) expect(c.por_que.length).toBeGreaterThan(5)

        // La regla que importa: el cuidado no inventa respaldo, lo hereda del
        // campo de la fuente del que sale.
        const campo = e[c.de]
        expect(campo, `${e.slug}: \`de: "${c.de}"\` no existe`).toBeDefined()
        expect(c.fuentes).toEqual(campo.fuentes)
        expect(c.confianza).toBe(campo.confianza)
        expect(c.fuentes.length).toBeGreaterThan(0)
        for (const f of c.fuentes) expect(f.url).toMatch(/^https?:\/\//)
      }

      // dos cuidados del mismo tipo en una especie serían dos tarjetas con el
      // mismo título: o se juntan, o una está de más
      const tipos = e.cuidados.map((c: any) => c.tipo)
      expect(new Set(tipos).size, `${e.slug}: tipos repetidos`).toBe(tipos.length)
    })
    })
  }

  it('el vocabulario de cuidados está todo en uso: nada declarado de adorno', () => {
    const usados = new Set(db.especies.flatMap((e: any) => e.cuidados.map((c: any) => c.tipo)))
    expect([...TIPOS_CUIDADO].sort()).toEqual([...usados].sort())
  })
})

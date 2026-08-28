// Las variedades derivadas: que el build las expanda bien y, sobre todo, que
// no puedan agregar nada que su especie no dijera. Es la regla 2 en esta capa.
import { describe, it, expect } from 'vitest'
import enriquecido from '../data/huerta_gba_enriquecido.json'
import type { EspecieEnriquecida } from '../src/lib/data/types'

const ESPECIES = (enriquecido as unknown as { especies: EspecieEnriquecida[] }).especies
const porSlug = new Map(ESPECIES.map((e) => [e.slug, e]))
const derivadas = ESPECIES.filter((e) => e.variedad_de)
const padres = ESPECIES.filter((e) => !e.variedad_de)

describe('variedades derivadas', () => {
  it('la coliflor se parte en temprana y tardía', () => {
    const t = porSlug.get('coliflor-temprana')
    const d = porSlug.get('coliflor-tardia')
    expect(t?.nombre_comun).toBe('Coliflor temprana')
    expect(d?.nombre_comun).toBe('Coliflor tardía')
    expect(t?.variedad_de).toBe('coliflor')
    expect(t?.variedad).toBe('Temprana')
  })

  it('cada derivada parte el rango de días del padre, nunca lo calcula', () => {
    // Sin esto, convertir unidades entre dos fuentes y publicar el resultado
    // como dato pasa sin que nadie lo vea. Es lo que dejó al apio afuera.
    for (const v of derivadas) {
      const padre = porSlug.get(v.variedad_de!)!
      for (const campo of ['dias_a_cosecha', 'dias_a_trasplante', 'dias_germinacion'] as const) {
        const hijo = v[campo]
        const base = padre[campo]
        if (!hijo) continue
        expect(base, `${v.slug} · ${campo}: el padre no publica rango`).not.toBeNull()
        expect(hijo.min, `${v.slug} · ${campo}`).toBeGreaterThanOrEqual(base!.min)
        expect(hijo.max, `${v.slug} · ${campo}`).toBeLessThanOrEqual(base!.max)
      }
    }
  })

  it('cada derivada recorta los meses del padre, nunca le agrega', () => {
    for (const v of derivadas) {
      const padre = porSlug.get(v.variedad_de!)!
      for (const capa of ['siembra', 'trasplante'] as const) {
        const union = (e: EspecieEnriquecida) =>
          new Set([
            ...e.calendario.fuente_meses[`${capa}_ideal`],
            ...e.calendario.fuente_meses[`${capa}_posible`],
          ])
        const delPadre = union(padre)
        for (const m of union(v)) {
          expect([...delPadre], `${v.slug} · ${capa}: mes ${m} no está en el padre`).toContain(m)
        }
      }
    }
  })

  it('el padre conoce a sus derivadas y ninguna queda huérfana', () => {
    for (const v of derivadas) {
      const padre = porSlug.get(v.variedad_de!)
      expect(padre, `${v.slug}: padre inexistente`).toBeDefined()
      expect(
        padre!.variedades.map((r) => r.slug),
        v.slug,
      ).toContain(v.slug)
    }
    for (const p of padres) {
      for (const ref of p.variedades) expect(porSlug.has(ref.slug), ref.slug).toBe(true)
    }
  })

  it('la derivada hereda del padre lo que no override', () => {
    const t = porSlug.get('coliflor-temprana')!
    const padre = porSlug.get('coliflor')!
    expect(t.temperaturas).toEqual(padre.temperaturas)
    expect(t.suelo).toEqual(padre.suelo)
    expect(t.asociaciones).toEqual(padre.asociaciones)
    expect(t.nombre_cientifico).toBe(padre.nombre_cientifico)
  })

  it('la coliflor temprana tiene su propio calendario y sus propios días', () => {
    const t = porSlug.get('coliflor-temprana')!
    const d = porSlug.get('coliflor-tardia')!
    expect(t.calendario.fuente_meses.siembra_ideal).toEqual([10])
    expect(t.calendario.fuente_meses.siembra_posible).toEqual([11, 12])
    expect(d.calendario.fuente_meses.siembra_ideal).toEqual([3, 4])
    expect(t.dias_a_cosecha).toEqual({ min: 90, max: 90 })
    expect(d.dias_a_cosecha).toEqual({ min: 200, max: 200 })
  })

  it('el tomate determinado no lleva tutorado ni poda; el indeterminado sí', () => {
    const det = porSlug.get('tomate-determinado')!
    const ind = porSlug.get('tomate-indeterminado')!
    const tipos = (e: EspecieEnriquecida) => e.cuidados.map((c) => c.tipo)
    expect(tipos(det)).not.toContain('tutorado')
    expect(tipos(det)).not.toContain('poda')
    expect(tipos(ind)).toContain('tutorado')
    expect(tipos(ind)).toContain('poda')
    // riego y rotación no dependen del hábito: los conserva
    expect(tipos(det)).toContain('riego')
    expect(tipos(det)).toContain('rotacion')
  })

  it('la derivada hereda `trucos` textual: no se reescribe la fuente', () => {
    const det = porSlug.get('tomate-determinado')!
    const padre = porSlug.get('tomate')!
    // El texto sigue diciendo "en variedades indeterminadas" y la ficha no
    // muestra tarjeta de tutorado: el razonamiento queda verificable a ojo.
    expect(det.trucos).toEqual(padre.trucos)
    expect(det.trucos.valor).toContain('variedades indeterminadas')
  })

  it('están las once derivadas, y ninguna más', () => {
    expect(derivadas.map((e) => e.slug).sort()).toEqual([
      'arveja-de-enrame',
      'arveja-enana',
      'chaucha-de-enrame',
      'chaucha-enana',
      'coliflor-tardia',
      'coliflor-temprana',
      'tomate-determinado',
      'tomate-indeterminado',
      'zanahoria-chantenay-nantesa',
      'zanahoria-corta',
      'zanahoria-criolla',
    ])
  })

  it('las que difieren por porte no llevan el tutor de la trepadora', () => {
    for (const slug of ['chaucha-enana', 'arveja-enana']) {
      expect(porSlug.get(slug)!.cuidados.map((c) => c.tipo), slug).not.toContain('tutorado')
    }
    for (const slug of ['chaucha-de-enrame', 'arveja-de-enrame']) {
      expect(porSlug.get(slug)!.cuidados.map((c) => c.tipo), slug).toContain('tutorado')
    }
  })

  it('las tres zanahorias parten el 50-150 del padre', () => {
    expect(porSlug.get('zanahoria-chantenay-nantesa')!.dias_a_cosecha).toEqual({ min: 110, max: 110 })
    expect(porSlug.get('zanahoria-criolla')!.dias_a_cosecha).toEqual({ min: 150, max: 150 })
    expect(porSlug.get('zanahoria-corta')!.dias_a_cosecha).toEqual({ min: 50, max: 90 })
  })

  it('toda derivada explica por qué difiere', () => {
    for (const v of derivadas) {
      expect(v.variedad_derivacion, v.slug).toBeTruthy()
      expect(v.variedad_derivacion!.length, v.slug).toBeGreaterThan(20)
    }
  })
})

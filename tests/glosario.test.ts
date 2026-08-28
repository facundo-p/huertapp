import { describe, it, expect } from 'vitest'
import { LABORES, PALABRAS, SUSTRATO, AJUSTE_SUELO } from '../src/lib/glosario'
import { ORDEN_CUIDADOS, ETIQUETA_CUIDADO } from '../src/lib/data/cuidados'

/**
 * El glosario es la red que sostiene al resto: la ficha manda a ralear dando
 * por sentado que "ralear" se puede consultar. Si una palabra queda sin
 * entrada, la ficha queda pidiendo algo que no explica en ningún lado.
 */
describe('glosario', () => {
  it('las catorce labores tienen entrada, con qué es y cómo se hace', () => {
    expect(Object.keys(LABORES).sort()).toEqual([...ORDEN_CUIDADOS].sort())

    for (const tipo of ORDEN_CUIDADOS) {
      const l = LABORES[tipo]
      expect(l.termino.length, tipo).toBeGreaterThan(3)
      expect(l.que_es.length, tipo).toBeGreaterThan(40)
      // una labor sin el paso a paso es media entrada: dice qué es y deja a la
      // persona igual de trabada que antes
      expect(l.como, `${tipo} sin "cómo se hace"`).toBeDefined()
      expect(l.como!.length, tipo).toBeGreaterThan(30)
    }
  })

  it('el nombre de la labor en la ficha es el mismo que en el glosario', () => {
    for (const tipo of ORDEN_CUIDADOS) {
      // el chip de la ficha y el título del glosario tienen que empezar igual:
      // si no, quien busca "Mulch" no encuentra "Acolchado"
      expect(LABORES[tipo].termino.toLowerCase()).toContain(
        ETIQUETA_CUIDADO[tipo].toLowerCase().split(' ')[0],
      )
    }
  })

  it('no hay términos repetidos ni vacíos', () => {
    const nombres = PALABRAS.map((t) => t.termino)
    expect(new Set(nombres).size).toBe(nombres.length)
    for (const t of PALABRAS) expect(t.que_es.length, t.termino).toBeGreaterThan(40)
  })

  it('la receta de sustrato lleva fuente con URL y confianza, como cualquier dato', () => {
    expect(SUSTRATO.fuente.url).toMatch(/^https?:\/\//)
    expect(SUSTRATO.fuente.organizacion.length).toBeGreaterThan(3)
    expect(SUSTRATO.confianza).toBeGreaterThanOrEqual(1)
    expect(SUSTRATO.confianza).toBeLessThanOrEqual(10)
    expect(SUSTRATO.funciones).toHaveLength(3)
  })

  it('la aclaración del sustrato de semillero también, que es otro dato y no una definición', () => {
    expect(SUSTRATO.semillero.fuente.url).toMatch(/^https?:\/\//)
    expect(SUSTRATO.semillero.fuente.organizacion.length).toBeGreaterThan(3)
    expect(SUSTRATO.semillero.confianza).toBeGreaterThanOrEqual(1)
    expect(SUSTRATO.semillero.confianza).toBeLessThanOrEqual(10)
    // la receta de arriba lleva compost y ésta es la que dice que en la bandeja
    // germinadora no va: si el texto deja de decirlo, la aclaración no aclara nada
    expect(SUSTRATO.base).toMatch(/compost/i)
    expect(SUSTRATO.semillero.texto).toMatch(/sin compost/i)
  })

  it('las cinco categorías de suelo dicen hacia dónde correr la mezcla', () => {
    expect(Object.keys(AJUSTE_SUELO).sort()).toEqual([
      'ARENOSO_DRENANTE',
      'FRANCO_FERTIL',
      'HUMEDO_RICO',
      'PROFUNDO_SUELTO',
      'RUSTICO_TOLERANTE',
    ])
    for (const [c, texto] of Object.entries(AJUSTE_SUELO)) {
      expect(texto.length, c).toBeGreaterThan(40)
    }
  })
})

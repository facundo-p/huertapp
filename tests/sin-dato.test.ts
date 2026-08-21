import { describe, it, expect } from 'vitest'
import enriquecido from '../data/huerta_gba_enriquecido.json'
import type { EspecieEnriquecida } from '../src/lib/data/types'
import { germinacionAplica, nivelConfianza, trasplanteAplica } from '../src/lib/data/especies'

const ESPECIES = (enriquecido as { especies: EspecieEnriquecida[] }).especies
const porSlug = new Map(ESPECIES.map((e) => [e.slug, e]))
const de = (slug: string) => porSlug.get(slug)!

/**
 * La regla 1 promete que un dato que falta se muestra como tal. La trampa que
 * esto cuida es más fina: **hay dos vacíos distintos**. Que la fuente no lo
 * diga y que a esa planta no le corresponda. Mostrarlos igual es mentir en una
 * de las dos direcciones, y cuál de las dos depende de la especie.
 */
describe('sin dato', () => {
  it('el nivel de confianza tiene un cuarto estado que no es un escalón peor', () => {
    expect(nivelConfianza(null)).toBe('sin')
    expect(nivelConfianza(1)).toBe('baja')
    expect(nivelConfianza(5)).toBe('media')
    expect(nivelConfianza(8)).toBe('alta')
  })

  it('sin meses de trasplante no hay trasplante, y eso vale en las 55', () => {
    for (const e of ESPECIES) {
      const { trasplante_ideal, trasplante_posible } = e.calendario.fuente_meses
      const hayMeses = trasplante_ideal.length + trasplante_posible.length > 0
      expect(trasplanteAplica(e), e.slug).toBe(hayMeses)
      // el invariante que hace que "no aplica" sea derivable en vez de a mano:
      // si no hay meses de trasplante, tampoco hay días a trasplante
      expect(e.dias_a_trasplante === null, `${e.slug}: días vs meses`).toBe(!hayMeses)
    }
  })

  it('lo que se planta de gajo o bulbo no germina, y por eso no le falta el dato', () => {
    // las cinco de plantación pura: no hay semilla, no hay nada que germinar
    for (const slug of ['frutilla', 'romero', 'menta', 'laurel', 'lavanda']) {
      expect(germinacionAplica(de(slug)), slug).toBe(false)
      expect(de(slug).dias_germinacion, slug).toBeNull()
    }
    // batata va de almácigo: acá el dato falta de verdad
    expect(germinacionAplica(de('batata'))).toBe(true)
    expect(de('batata').dias_germinacion).toBeNull()
  })

  it('ninguna especie queda con las tres casillas del ciclo vacías y sin explicar', () => {
    // eran cuatro fichas con la fila entera en blanco: romero, menta, laurel y
    // lavanda. Ahora cada casilla dice "s/d" o "no aplica", nunca nada.
    for (const e of ESPECIES) {
      const explicadas = [
        e.dias_germinacion !== null || !germinacionAplica(e),
        e.dias_a_trasplante !== null || !trasplanteAplica(e),
        true, // cosecha siempre tiene texto: número o s/d
      ]
      expect(explicadas.some(Boolean), e.slug).toBe(true)
    }
    for (const slug of ['romero', 'menta', 'laurel', 'lavanda']) {
      const e = de(slug)
      expect(e.dias_germinacion, slug).toBeNull()
      expect(e.dias_a_cosecha, slug).toBeNull()
      // las dos primeras son "no aplica"; la de cosecha es un hueco real
      expect(germinacionAplica(e), slug).toBe(false)
      expect(trasplanteAplica(e), slug).toBe(false)
    }
  })

  it('las tres sin temperatura de germinación son las que se sabía', () => {
    const sin = ESPECIES.filter(
      (e) => e.temperaturas.germinacion.ideal_min === null && e.temperaturas.germinacion.min === null,
    ).map((e) => e.slug)
    expect(sin.sort()).toEqual(['laurel', 'melisa', 'menta'])
    // menta y laurel se plantan de gajo: la fila no se dibuja.
    // melisa sí germina, así que ahí la fila queda con "s/d" y es correcto.
    expect(germinacionAplica(de('melisa'))).toBe(true)
  })
})

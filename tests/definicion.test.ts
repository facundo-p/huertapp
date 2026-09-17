import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import {
  DESC_GRUPO,
  DESC_LUZ,
  DESC_SUELO,
  definicionDeGrupo,
  definicionDeLabor,
  definicionDeLuz,
  definicionDeSuelo,
  type ContenidoDefinicion,
} from '../src/lib/glosario'
import { ORDEN_CUIDADOS } from '../src/lib/data/cuidados'

/**
 * La hoja que sube al tocar un término de la ficha. No trae texto propio: si
 * alguna categoría se queda sin descripción, la hoja abre vacía y la persona
 * tocó para nada.
 */
describe('definición al toque', () => {
  const todas: [string, ContenidoDefinicion][] = [
    ...Object.keys(DESC_GRUPO).map(
      (g) => [g, definicionDeGrupo(g as keyof typeof DESC_GRUPO)] as [string, ContenidoDefinicion],
    ),
    ...Object.keys(DESC_SUELO).map(
      (c) => [c, definicionDeSuelo(c as keyof typeof DESC_SUELO)] as [string, ContenidoDefinicion],
    ),
    ...Object.keys(DESC_LUZ).map(
      (c) => [c, definicionDeLuz(c as keyof typeof DESC_LUZ)] as [string, ContenidoDefinicion],
    ),
    ...ORDEN_CUIDADOS.map((t) => [t, definicionDeLabor(t)] as [string, ContenidoDefinicion]),
  ]

  it('todo término tocable abre con algo escrito', () => {
    for (const [quien, d] of todas) {
      expect(d.que_es.length, quien).toBeGreaterThan(20)
      if (d.detalle) expect(d.detalle.texto.length, quien).toBeGreaterThan(20)
    }
  })

  /**
   * "Verlo en el Glosario →" con un ancla que no existe no rompe nada: la
   * pantalla abre arriba de todo y la persona se queda buscando. Por eso el
   * ancla se compara contra los `id` de verdad de la pantalla.
   */
  it('el link al glosario apunta a una sección que existe', () => {
    const fuente = readFileSync(new URL('../src/screens/Glosario.tsx', import.meta.url), 'utf8')
    const ids = new Set([...fuente.matchAll(/id="([a-z]+)"/g)].map((m) => m[1]))
    expect(ids.size).toBeGreaterThan(5)
    for (const [quien, d] of todas) expect(ids, quien).toContain(d.ancla)
  })

  it('el suelo es el único que además de definir muestra un dato con fuente', () => {
    const suelo = definicionDeSuelo('FRANCO_FERTIL')
    expect(suelo.receta!.fuente.url).toMatch(/^https?:\/\//)
    expect(suelo.receta!.confianza).toBeGreaterThanOrEqual(1)
    expect(definicionDeGrupo('Aromática').receta).toBeUndefined()
    expect(definicionDeLuz('PLENO_SOL').receta).toBeUndefined()
    expect(definicionDeLabor('raleo').receta).toBeUndefined()
  })
})

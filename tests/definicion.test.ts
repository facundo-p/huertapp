import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import enriquecido from '../data/huerta_gba_enriquecido.json'
import {
  AJUSTE_SUELO,
  DESC_GRUPO,
  DESC_SUELO,
  SUSTRATO,
  definicionDeGrupo,
  definicionDeLabor,
  definicionDeLuz,
  definicionDeSuelo,
  type ContenidoDefinicion,
} from '../src/lib/glosario'
import { ORDEN_CUIDADOS } from '../src/lib/data/cuidados'
import type { EspecieEnriquecida } from '../src/lib/data/types'
import { Glosario } from '../src/screens/Glosario'

const ESPECIES = (enriquecido as unknown as { especies: EspecieEnriquecida[] }).especies

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
    ...ESPECIES.map((e) => [`luz de ${e.slug}`, definicionDeLuz(e.luz)] as [string, ContenidoDefinicion]),
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
   * ancla se compara contra los `id` de la pantalla dibujada, que es donde
   * aparecen también los que se arman con el tipo de labor.
   */
  it('el link al glosario apunta a una sección o término que existe', () => {
    const html = renderToStaticMarkup(createElement(MemoryRouter, null, createElement(Glosario)))
    const ids = new Set([...html.matchAll(/ id="([^"]+)"/g)].map((m) => m[1]))
    expect(ids.size).toBeGreaterThan(5)
    for (const [quien, d] of todas) expect(ids, quien).toContain(d.ancla)
  })

  it('la labor salta a su término, no al principio de la sección', () => {
    expect(definicionDeLabor('tutorado').ancla).toBe('labor-tutorado')
  })

  it('grupo y labor definen, y nada más', () => {
    expect(definicionDeGrupo('Aromática').receta).toBeUndefined()
    expect(definicionDeLabor('raleo').receta).toBeUndefined()
  })

  it('la luz trae lo que dijo la fuente de esa especie, con todas sus fuentes', () => {
    const tomate = ESPECIES.find((e) => e.slug === 'tomate')!
    const r = definicionDeLuz(tomate.luz).receta!
    expect(r.texto).toContain(tomate.luz.valor)
    expect(r.texto).toContain(tomate.luz.que_pasa_si_no)
    expect(r.confianza).toBe(tomate.luz.confianza)
    expect(r.fuentes).toEqual(tomate.luz.fuentes)

    // si hay dos, van las dos, como en el resto de la ficha
    const lechuga = ESPECIES.find((e) => e.slug === 'lechuga')!
    expect(lechuga.luz.fuentes.length).toBeGreaterThan(1)
    expect(definicionDeLuz(lechuga.luz).receta!.fuentes).toEqual(lechuga.luz.fuentes)
  })

  // el artículo no está en los datos: "lo que pide el lechuga" no
  it('el rótulo de la luz no nombra a la especie', () => {
    for (const e of ESPECIES) {
      const { etiqueta } = definicionDeLuz(e.luz).receta!
      expect(etiqueta.toLowerCase(), e.slug).not.toContain(e.nombre_comun.toLowerCase())
    }
  })

  it('sin texto de la fuente, la luz queda sin dato y no se rellena', () => {
    const tomate = ESPECIES.find((e) => e.slug === 'tomate')!
    const vacia = { ...tomate.luz, valor: '', que_pasa_si_no: ' ' }
    expect(definicionDeLuz(vacia).receta!.texto).toBeNull()
  })

  /**
   * El ajuste por categoría no tiene cita, y en varias especies contradice el
   * suelo citado de su propia ficha: en la hoja se leía como consejo para esa
   * planta. Queda sólo en el Glosario.
   */
  it('el suelo muestra la mezcla base con su fuente, sin el ajuste', () => {
    for (const c of Object.keys(DESC_SUELO) as (keyof typeof DESC_SUELO)[]) {
      const d = definicionDeSuelo(c)
      expect(d.detalle, c).toBeUndefined()
      expect(JSON.stringify(d), c).not.toContain(AJUSTE_SUELO[c])
      expect(d.receta!.etiqueta, c).toBe('La mezcla base, para maceta o cantero')
      expect(d.receta!.texto, c).toBe(SUSTRATO.base)
      expect(d.receta!.fuentes, c).toEqual([SUSTRATO.fuente])
      expect(d.receta!.confianza, c).toBe(SUSTRATO.confianza)
    }
  })

  // la receta lleva compost, y en la bandeja germinadora juega en contra; lo
  // que va en la bandeja tiene su propia cita y se lee en el Glosario
  it('el suelo avisa que la mezcla de almácigos es otra, sin decir cuál', () => {
    const d = definicionDeSuelo('FRANCO_FERTIL')
    expect(d.remite).toBe('La de la bandeja de almácigos es otra: está en el Glosario.')
  })
})

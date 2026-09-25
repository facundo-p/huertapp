import { describe, it, expect } from 'vitest'
import { createElement, type ComponentType } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { MemoryRouter } from 'react-router'
import enriquecido from '../data/huerta_gba_enriquecido.json'
import {
  AJUSTE_SUELO,
  DESC_GRUPO,
  LABORES,
  SUSTRATO,
  definicionDeGrupo,
  definicionDeLabor,
  definicionDeLuz,
  definicionDeSuelo,
  type ContenidoDefinicion,
} from '../src/lib/glosario'
import { ORDEN_CUIDADOS } from '../src/lib/data/cuidados'
import type { EspecieEnriquecida } from '../src/lib/data/types'
import { Definicion } from '../src/components/Definicion'
import { Glosario } from '../src/screens/Glosario'

const ESPECIES = (enriquecido as unknown as { especies: EspecieEnriquecida[] }).especies
const especie = (slug: string) => ESPECIES.find((e) => e.slug === slug)!

/** Lo que de verdad sale en pantalla: los `id` armados con template no están escritos en el código. */
const dibujar = <P extends object>(el: ComponentType<P>, props: P) =>
  renderToStaticMarkup(createElement(MemoryRouter, null, createElement(el, props)))

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
    ...ESPECIES.flatMap((e) => [
      [`suelo de ${e.slug}`, definicionDeSuelo(e.suelo)] as [string, ContenidoDefinicion],
      [`luz de ${e.slug}`, definicionDeLuz(e.luz)] as [string, ContenidoDefinicion],
    ]),
    ...ORDEN_CUIDADOS.map((t) => [t, definicionDeLabor(t)] as [string, ContenidoDefinicion]),
  ]

  it('todo término tocable abre con algo escrito', () => {
    for (const [quien, d] of todas) {
      expect(d.que_es.length, quien).toBeGreaterThan(20)
    }
  })

  /**
   * "Verlo en el Glosario →" con un ancla que no existe no rompe nada: la
   * pantalla abre arriba de todo y la persona se queda buscando. Por eso el
   * ancla se compara contra los `id` de la pantalla dibujada.
   */
  it('el link al glosario apunta a una sección o término que existe', () => {
    const ids = new Set([...dibujar(Glosario, {}).matchAll(/ id="([^"]+)"/g)].map((m) => m[1]))
    expect(ids.size).toBeGreaterThan(5)
    for (const [quien, d] of todas) {
      expect(ids, quien).toContain(d.ancla)
      if (d.enlace) expect(ids, `${quien} · enlace`).toContain(d.enlace.ancla)
    }
  })

  // si la frase no está tal cual en el remite, el link no sale y nadie se entera
  it('el link del remite es una frase que el remite dice', () => {
    const conEnlace = todas.filter(([, d]) => d.enlace)
    expect(conEnlace.length).toBeGreaterThan(0)
    for (const [quien, d] of conEnlace) expect(d.remite, quien).toContain(d.enlace!.frase)
  })

  // una cifra genérica de horas contradecía la citada de la especie (berro: 3 a 6)
  it('las definiciones de luz no dan cifras', () => {
    for (const e of ESPECIES) expect(definicionDeLuz(e.luz).que_es, e.slug).not.toMatch(/\d/)
  })

  it('la labor salta a su término, no al principio de la sección', () => {
    expect(definicionDeLabor('tutorado').ancla).toBe('labor-tutorado')
  })

  /**
   * Al lado del cuidado citado, el paso a paso general lo contradecía: regar
   * si está seco (cebolla, romero), abonar (capuchina), tutorar al plantar
   * (pimiento), polinizar a mano (choclo). La hoja define; el cómo es de la ficha.
   */
  it('la hoja de una labor no trae el paso a paso general', () => {
    for (const t of ORDEN_CUIDADOS) {
      const d = definicionDeLabor(t)
      const escrito = Object.values(d).filter((v) => typeof v === 'string').join('\n')
      if (LABORES[t].como) expect(escrito, t).not.toContain(LABORES[t].como)
      expect(d.remite, t).toMatch(/Glosario/)
    }
  })

  it('grupo y labor definen, y nada más', () => {
    expect(definicionDeGrupo('Aromática').dato).toBeUndefined()
    expect(definicionDeLabor('raleo').dato).toBeUndefined()
  })

  it('suelo y luz traen lo que dijo la fuente de esa especie, con todas sus fuentes', () => {
    for (const e of ESPECIES) {
      for (const [campo, d] of [
        ['suelo', definicionDeSuelo(e.suelo)],
        ['luz', definicionDeLuz(e.luz)],
      ] as const) {
        const r = d.dato!
        const quien = `${e.slug} · ${campo}`
        // en dos rótulos, como en la sección de la ficha
        expect(r.etiqueta, quien).toBe('Lo que pide esta planta')
        expect(r.texto, quien).toBe(e[campo].valor.trim())
        expect(r.siNo, quien).toEqual({
          etiqueta: 'Si no se cumple',
          texto: e[campo].que_pasa_si_no.trim(),
        })
        expect(r.confianza, quien).toBe(e[campo].confianza)
        expect(r.fuentes, quien).toEqual(e[campo].fuentes)
      }
    }
    // hay especies con dos: van las dos, como en el resto de la ficha
    expect(especie('lechuga').luz.fuentes.length).toBeGreaterThan(1)
  })

  it('sin texto de la fuente, queda sin dato y no se rellena', () => {
    const t = especie('tomate')
    expect(definicionDeLuz({ ...t.luz, valor: '', que_pasa_si_no: ' ' }).dato!.texto).toBeNull()
    expect(definicionDeSuelo({ ...t.suelo, valor: '', que_pasa_si_no: '' }).dato!.texto).toBeNull()
  })

  /**
   * La mezcla base lleva compost y el ajuste por categoría no tiene cita: al
   * lado de la especie se leían como consejo para esa planta, y chocaban con
   * el suelo citado de las que piden tierra pobre. Quedan sólo en el Glosario.
   */
  it('el suelo no trae ninguna mezcla, sólo remite al Glosario', () => {
    const tomillo = especie('tomillo')
    const d = definicionDeSuelo(tomillo.suelo)
    const escrito = JSON.stringify(d)
    // nada escrito de nuestra mano más allá de la definición y el remite
    expect(Object.keys(d).sort()).toEqual(['ancla', 'dato', 'enlace', 'que_es', 'remite'])
    expect(escrito).not.toContain(SUSTRATO.base)
    expect(escrito).not.toContain(AJUSTE_SUELO[tomillo.suelo.categoria_suelo])
    expect(d.remite).toBe(
      'La mezcla para maceta o cantero, y la de la bandeja de almácigos, están en el Glosario, en «Cómo se arma la tierra».',
    )
  })

  // la hoja define la categoría: el link del pie va a esa lista, y el que
  // nombra las mezclas, a las mezclas
  it('el link del suelo va a la categoría, y el de las mezclas a las mezclas', () => {
    const d = definicionDeSuelo(especie('tomillo').suelo)
    expect(d.ancla).toBe('suelo')
    expect(d.enlace).toEqual({ frase: 'Cómo se arma la tierra', ancla: 'tierra' })
    const html = dibujar(Definicion, { texto: 'Suelo arenoso y drenante', contenido: d })
    expect(html).toMatch(/<a [^>]*href="\/glosario#tierra"[^>]*>Cómo se arma la tierra<\/a>/)
  })

  it('sin texto, la hoja no lista fuentes: parecería que respaldan algo', () => {
    const t = especie('tomate')
    // con texto sí están: sin este control, el de abajo podría pasar por no dibujar nada
    expect(dibujar(Definicion, { texto: 'Pleno sol', contenido: definicionDeLuz(t.luz) })).toContain(
      t.luz.fuentes[0].url,
    )
    const html = dibujar(Definicion, {
      texto: 'Pleno sol',
      contenido: definicionDeLuz({ ...t.luz, valor: '' }),
    })
    expect(html).toContain('No encontramos una fuente que lo diga.')
    expect(html).not.toContain(t.luz.fuentes[0].url)
    expect(html).not.toContain('sin fuente')
    expect(html).not.toContain('Si no se cumple')
  })

  // armado acá y no tomado de la base: el hueco que hay hoy se va a llenar
  it('un dato sin fuente lo dice en la hoja', () => {
    const luz = { ...especie('tomate').luz, fuentes: [] }
    const html = dibujar(Definicion, { texto: 'Pleno sol', contenido: definicionDeLuz(luz) })
    expect(html).toContain(luz.valor)
    expect(html).toContain('sin fuente')
  })
})

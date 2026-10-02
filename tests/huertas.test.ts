import { describe, expect, it } from 'vitest'
import {
  ambitoDe,
  deLaHuerta,
  HUERTA_PRINCIPAL,
  huertaDe,
  huertaPrincipalDesde,
  puedeBorrar,
  resolverActiva,
  textoBorrarHuerta,
} from '../src/lib/huerta/huertas'
import type { Huerta } from '../src/lib/huerta/tipos'

const huerta = (id: string): Huerta => ({ id, nombre: id, zona: 'conurbano', creada: '2026-09-01' })

describe('varias huertas', () => {
  it('lo de antes de las huertas es de la principal', () => {
    expect(huertaDe({})).toBe(HUERTA_PRINCIPAL)
    expect(huertaDe({ huertaId: 'balcon' })).toBe('balcon')
    const lista = [{ id: 'a' }, { id: 'b', huertaId: 'balcon' }, { id: 'c', huertaId: HUERTA_PRINCIPAL }]
    expect(deLaHuerta(lista, HUERTA_PRINCIPAL).map((x) => x.id)).toEqual(['a', 'c'])
    expect(deLaHuerta(lista, 'balcon').map((x) => x.id)).toEqual(['b'])
  })

  it('la principal se arma con la zona y el pronóstico que ya había', () => {
    const clima = { modo: 'zona' as const, lat: -34.82, lon: -58.54, etiqueta: 'cerca de Ezeiza' }
    expect(huertaPrincipalDesde('periurbano', clima, '2026-09-30')).toEqual({
      id: HUERTA_PRINCIPAL,
      nombre: 'Mi huerta',
      zona: 'periurbano',
      ubicacionClima: clima,
      creada: '2026-09-30',
    })
    // sin pronóstico activado, ni la clave
    expect(huertaPrincipalDesde('urbano')).not.toHaveProperty('ubicacionClima')
  })

  it('la activa es la guardada; si ya no está, la primera', () => {
    const huertas = [huerta('a'), huerta('b')]
    expect(resolverActiva(huertas, 'b').id).toBe('b')
    expect(resolverActiva(huertas, 'borrada').id).toBe('a')
    expect(resolverActiva(huertas).id).toBe('a')
  })

  it('la última no se borra', () => {
    expect(puedeBorrar([huerta('a')])).toBe(false)
    expect(puedeBorrar([huerta('a'), huerta('b')])).toBe(true)
  })

  it('la principal no lleva ámbito, así sus tareas conservan el id', () => {
    expect(ambitoDe(huerta(HUERTA_PRINCIPAL))).toBeUndefined()
    expect(ambitoDe(huerta('balcon'))).toBe('balcon')
  })

  it('antes de borrar una huerta dice cuánto se pierde', () => {
    expect(textoBorrarHuerta('El balcón', { plantas: 7, lugares: 2, composteras: 1 })).toBe(
      '¿Borrar «El balcón»? Se borran 7 plantas con su diario, 2 lugares y 1 compostera. No se puede deshacer.',
    )
    expect(textoBorrarHuerta('El balcón', { plantas: 1, lugares: 0, composteras: 0 })).toBe(
      '¿Borrar «El balcón»? Se borra 1 planta con su diario. No se puede deshacer.',
    )
    expect(textoBorrarHuerta('La terraza', { plantas: 0, lugares: 0, composteras: 0 })).toBe(
      '¿Borrar «La terraza»? No tiene nada cargado. No se puede deshacer.',
    )
  })
})

import { describe, expect, it } from 'vitest'
import {
  aMedida,
  medidasQueAplican,
  TIPO_UBICACION_INFO,
  TIPOS_ELEGIBLES,
  volumenCalculado,
} from '../src/lib/huerta/ubicacion'

describe('medidasQueAplican', () => {
  it('la maceta pide profundidad y volumen', () => {
    expect(medidasQueAplican('maceta')).toEqual(['profundidad', 'volumen'])
  })

  it('el bancal elevado pide ancho, largo y profundidad (el volumen se calcula)', () => {
    expect(medidasQueAplican('bancal_elevado')).toEqual(['ancho', 'largo', 'profundidad'])
  })

  it('el bancal a tierra pide largo y ancho', () => {
    expect(medidasQueAplican('bancal_tierra')).toEqual(['largo', 'ancho'])
  })

  it('almácigo, otro y el bancal legado no llevan medidas', () => {
    expect(medidasQueAplican('almacigo')).toEqual([])
    expect(medidasQueAplican('otro')).toEqual([])
    expect(medidasQueAplican('bancal')).toEqual([])
  })
})

describe('volumenCalculado', () => {
  it('en el bancal elevado sale de ancho × largo × profundidad, en litros', () => {
    expect(volumenCalculado('bancal_elevado', { ancho: 120, largo: 300, profundidad: 40 })).toBe(1440)
  })

  it('redondea a litros enteros', () => {
    expect(volumenCalculado('bancal_elevado', { ancho: 33, largo: 90, profundidad: 25 })).toBe(74)
  })

  it('si falta una medida no inventa nada', () => {
    expect(volumenCalculado('bancal_elevado', { ancho: 120, profundidad: 40 })).toBeNull()
    expect(volumenCalculado('bancal_elevado', undefined)).toBeNull()
  })

  it('en la maceta el volumen es dato cargado, no cálculo', () => {
    expect(volumenCalculado('maceta', { profundidad: 30, volumen: 20 })).toBeNull()
  })
})

describe('aMedida', () => {
  it('lee números con punto o con coma decimal', () => {
    expect(aMedida('40')).toBe(40)
    expect(aMedida('7.5')).toBe(7.5)
    expect(aMedida('7,5')).toBe(7.5)
  })

  it('vacío, cero, negativo o no numérico quedan sin dato', () => {
    expect(aMedida('')).toBeUndefined()
    expect(aMedida('  ')).toBeUndefined()
    expect(aMedida('0')).toBeUndefined()
    expect(aMedida('-3')).toBeUndefined()
    expect(aMedida('tres')).toBeUndefined()
  })
})

describe('tipos de ubicación', () => {
  it('los elegibles no ofrecen el bancal legado, pero sabemos nombrarlo', () => {
    expect(TIPOS_ELEGIBLES).not.toContain('bancal')
    expect(TIPOS_ELEGIBLES).toContain('bancal_elevado')
    expect(TIPOS_ELEGIBLES).toContain('bancal_tierra')
    expect(TIPO_UBICACION_INFO.bancal.etiqueta).toBe('Bancal')
  })
})

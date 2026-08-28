import { describe, expect, it } from 'vitest'
import { unaVez } from '../src/lib/huerta/reintento'

describe('unaVez', () => {
  it('carga una sola vez cuando sale bien', async () => {
    let llamadas = 0
    const cargar = unaVez(async () => ++llamadas)

    await cargar()
    await cargar()

    expect(llamadas).toBe(1)
  })

  it('comparte la carga que ya está en vuelo', async () => {
    let llamadas = 0
    let soltar: (v: number) => void = () => {}
    const cargar = unaVez(() => {
      llamadas++
      return new Promise<number>((res) => (soltar = res))
    })

    const a = cargar()
    const b = cargar()
    soltar(7)

    expect(await a).toBe(7)
    expect(await b).toBe(7)
    expect(llamadas).toBe(1)
  })

  // El bug: `arranque ??= refrescar()` guardaba la promesa RECHAZADA. Un error
  // transitorio de IndexedDB dejaba la sesión entera sin datos y sin más
  // intentos, indistinguible de una huerta vacía.
  it('vuelve a intentar después de un fallo, en vez de cachear el rechazo', async () => {
    let llamadas = 0
    const cargar = unaVez(async () => {
      if (++llamadas === 1) throw new Error('IndexedDB en pedo')
      return 'anduvo'
    })

    await expect(cargar()).rejects.toThrow('IndexedDB en pedo')
    expect(await cargar()).toBe('anduvo')
    expect(llamadas).toBe(2)
  })

  it('propaga el fallo a todos los que estaban esperando esa misma carga', async () => {
    let llamadas = 0
    const cargar = unaVez(async () => {
      llamadas++
      throw new Error('se cayó')
    })

    const a = cargar()
    const b = cargar()

    await expect(a).rejects.toThrow('se cayó')
    await expect(b).rejects.toThrow('se cayó')
    expect(llamadas).toBe(1)
  })
})

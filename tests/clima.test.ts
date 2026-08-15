import { describe, expect, it } from 'vitest'
// @ts-expect-error — módulos .mjs de scripts/, sin tipos
import * as C from '../scripts/clima-gba.mjs'
// @ts-expect-error
import { afinarEspecie, nombreDecada, SIN_AFINAR } from '../scripts/afinar-calendario.mjs'
import overlay from '../data/enriquecimiento.json'

const ZONAS = ['urbano', 'conurbano', 'periurbano'] as const
const DECADAS = Array.from({ length: 36 }, (_, i) => i + 1)

describe('geometría de la década', () => {
  it('36 décadas, tres por mes', () => {
    expect(C.decadaDe(1, 1)).toBe(1)
    expect(C.decadaDe(1, 10)).toBe(1)
    expect(C.decadaDe(1, 11)).toBe(2)
    expect(C.decadaDe(1, 21)).toBe(3)
    expect(C.decadaDe(1, 31)).toBe(3)
    expect(C.decadaDe(12, 25)).toBe(36)
  })

  it('mes y tercio se recuperan de la década', () => {
    for (const d of DECADAS) {
      const mes = C.mesDeDecada(d)
      const tercio = C.tercioDeDecada(d)
      expect(mes).toBeGreaterThanOrEqual(1)
      expect(mes).toBeLessThanOrEqual(12)
      expect(tercio).toBeGreaterThanOrEqual(1)
      expect(tercio).toBeLessThanOrEqual(3)
      expect((mes - 1) * 3 + tercio).toBe(d)
    }
  })

  it('los días centrales son crecientes y caen dentro del año', () => {
    let previo = 0
    for (const d of DECADAS) {
      const dia = C.diaCentralDeDecada(d)
      expect(dia).toBeGreaterThan(previo)
      expect(dia).toBeLessThanOrEqual(365)
      previo = dia
    }
  })

  it('nombra las décadas en castellano', () => {
    expect(nombreDecada(1)).toBe('principios de enero')
    expect(nombreDecada(26)).toBe('mediados de septiembre')
    expect(nombreDecada(36)).toBe('fines de diciembre')
  })
})

describe('temperatura interpolada', () => {
  it('en el centro de cada mes reproduce exactamente la normal del SMN', () => {
    // el día 15 es el ancla de la interpolación: ahí no debe haber error
    for (const zona of ZONAS) {
      for (let mes = 1; mes <= 12; mes++) {
        const decadaCentral = (mes - 1) * 3 + 2
        expect(C.tempAire(decadaCentral, zona)).toBeCloseTo(C.CLIMA[zona].media[mes - 1], 1)
      }
    }
  })

  it('la media queda siempre entre la mínima y la máxima medias', () => {
    for (const zona of ZONAS) {
      for (const d of DECADAS) {
        expect(C.tempMinima(d, zona)).toBeLessThan(C.tempAire(d, zona))
        expect(C.tempAire(d, zona)).toBeLessThan(C.tempMaxima(d, zona))
      }
    }
  })

  it('julio es el mes más frío y enero el más cálido, en las tres zonas', () => {
    for (const zona of ZONAS) {
      const medias = DECADAS.map((d) => C.tempAire(d, zona))
      const min = Math.min(...medias)
      const max = Math.max(...medias)
      expect(C.mesDeDecada(medias.indexOf(min) + 1)).toBe(7)
      expect([12, 1]).toContain(C.mesDeDecada(medias.indexOf(max) + 1))
    }
  })

  it('el gradiente urbano → periurbano se sostiene todo el año', () => {
    // la isla de calor de CABA está siempre por encima del periurbano
    for (const d of DECADAS) {
      expect(C.tempAire(d, 'urbano')).toBeGreaterThan(C.tempAire(d, 'periurbano'))
    }
  })
})

describe('riesgo de helada', () => {
  it('es una probabilidad', () => {
    for (const zona of ZONAS) {
      for (const d of DECADAS) {
        const r = C.riesgoHelada(d, zona)
        expect(r).toBeGreaterThanOrEqual(0)
        expect(r).toBeLessThanOrEqual(1)
      }
    }
  })

  it('vale ~0 en pleno verano y ~1 en pleno invierno fuera de la ciudad', () => {
    expect(C.riesgoHelada(2, 'conurbano')).toBeLessThan(0.01) // mediados de enero
    expect(C.riesgoHelada(20, 'conurbano')).toBeGreaterThan(0.95) // mediados de julio
  })

  it('cerca de la fecha media de última helada ronda 0,5', () => {
    // Ezeiza: última helada media el 5-oct → principios de octubre ~50 %
    expect(C.riesgoHelada(28, 'conurbano')).toBeGreaterThan(0.35)
    expect(C.riesgoHelada(28, 'conurbano')).toBeLessThan(0.65)
  })

  it('decrece en primavera y crece en otoño, sin sobresaltos', () => {
    for (const zona of ZONAS) {
      for (let d = 21; d <= 35; d++) {
        expect(C.riesgoHelada(d + 1, zona)).toBeLessThanOrEqual(C.riesgoHelada(d, zona) + 1e-9)
      }
    }
  })

  it('CABA siempre tiene menos riesgo que el periurbano', () => {
    for (const d of DECADAS) {
      expect(C.riesgoHelada(d, 'urbano')).toBeLessThanOrEqual(C.riesgoHelada(d, 'periurbano') + 1e-9)
    }
  })
})

describe('fotoperíodo', () => {
  it('el día más corto cae en junio y el más largo en diciembre', () => {
    const horas = DECADAS.map((d) => C.horasLuz(d))
    expect(C.mesDeDecada(horas.indexOf(Math.min(...horas)) + 1)).toBe(6)
    expect([12, 1]).toContain(C.mesDeDecada(horas.indexOf(Math.max(...horas)) + 1))
  })

  it('los extremos coinciden con los de Buenos Aires (~9,7 h y ~14,3 h)', () => {
    const horas = DECADAS.map((d) => C.horasLuz(d))
    expect(Math.min(...horas)).toBeCloseTo(9.7, 0)
    expect(Math.max(...horas)).toBeCloseTo(14.3, 0)
  })
})

describe('afinado del calendario', () => {
  const especies = Object.entries(overlay as Record<string, any>)

  const afinar = ([slug, e]: [string, any]) =>
    afinarEspecie(slug, e.calendario, e.temperaturas, e.dias_germinacion, e.dias_a_cosecha)

  it('las 55 especies se afinan sin romper', () => {
    expect(especies).toHaveLength(55)
    for (const par of especies) expect(() => afinar(par)).not.toThrow()
  })

  it('REGLA DE ORO: ninguna década cae fuera de los meses que habilitó la fuente', () => {
    for (const [slug, e] of especies) {
      const { decadas } = afinar([slug, e])
      const f = e.calendario.fuente_meses
      const mesesSiembra = new Set([...f.siembra_ideal, ...f.siembra_posible])
      const mesesTrasp = new Set([...f.trasplante_ideal, ...f.trasplante_posible])
      for (const zona of ZONAS) {
        for (const d of [...decadas[zona].siembra_ideal, ...decadas[zona].siembra_posible]) {
          expect(mesesSiembra, `${slug}/${zona}: década ${d}`).toContain(C.mesDeDecada(d))
        }
        for (const d of [...decadas[zona].trasplante_ideal, ...decadas[zona].trasplante_posible]) {
          expect(mesesTrasp, `${slug}/${zona}: década ${d}`).toContain(C.mesDeDecada(d))
        }
      }
    }
  })

  it('ideal y posible nunca se solapan', () => {
    for (const par of especies) {
      const { decadas } = afinar(par)
      for (const zona of ZONAS) {
        const z = decadas[zona]
        expect(z.siembra_ideal.filter((d: number) => z.siembra_posible.includes(d))).toEqual([])
        expect(z.trasplante_ideal.filter((d: number) => z.trasplante_posible.includes(d))).toEqual([])
      }
    }
  })

  it('las décadas van ordenadas y dentro de 1-36', () => {
    for (const par of especies) {
      const { decadas } = afinar(par)
      for (const zona of ZONAS) {
        for (const lista of Object.values(decadas[zona]) as number[][]) {
          expect(lista).toEqual([...lista].sort((a, b) => a - b))
          for (const d of lista) {
            expect(d).toBeGreaterThanOrEqual(1)
            expect(d).toBeLessThanOrEqual(36)
          }
        }
      }
    }
  })

  it('ninguna especie se queda sin ninguna década de siembra', () => {
    for (const par of especies) {
      const { decadas } = afinar(par)
      for (const zona of ZONAS) {
        const total = decadas[zona].siembra_ideal.length + decadas[zona].siembra_posible.length
        expect(total, `${par[0]}/${zona}`).toBeGreaterThan(0)
      }
    }
  })

  it('el almácigo protegido nunca se recorta por helada: para eso está', () => {
    for (const [slug, e] of especies) {
      const { afinado } = afinar([slug, e])
      for (const a of afinado.ajustes) {
        if (!a.regla.startsWith('helada') || a.regla.includes('trasplante')) continue
        const metodo = e.calendario.metodo_por_mes[String(C.mesDeDecada(a.decada))]
        expect(metodo, `${slug} década ${a.decada}`).not.toBe('almacigo_protegido')
        expect(metodo, `${slug} década ${a.decada}`).not.toBe('almacigo')
      }
    }
  })

  it('las especies sin afinar conservan los meses de fuente enteros', () => {
    for (const slug of Object.keys(SIN_AFINAR)) {
      const e = (overlay as Record<string, any>)[slug]
      const { decadas, afinado } = afinar([slug, e])
      if (afinado.estado !== 'sin_afinar') continue // alguna tiene fuente explícita
      const esperado = e.calendario.fuente_meses.siembra_ideal.flatMap((m: number) => [m * 3 - 2, m * 3 - 1, m * 3])
      expect(decadas.conurbano.siembra_ideal.sort((a: number, b: number) => a - b)).toEqual(
        esperado.sort((a: number, b: number) => a - b),
      )
      expect(afinado.motivo).toBeTruthy()
    }
  })

  it('el afinado nunca deja a una zona más restringida que a otra sin motivo climático', () => {
    // CABA hiela menos: su ventana de siembra nunca puede ser más chica que la
    // del periurbano en las especies que la helada mata
    for (const [slug, e] of especies) {
      if (e.temperaturas.helada !== 'muere') continue
      if ((e.temperaturas.crecimiento.tolera_min ?? 1) <= 0) continue
      const { decadas } = afinar([slug, e])
      expect(
        decadas.urbano.siembra_ideal.length,
        `${slug}: CABA debería tener al menos tantas décadas ideales como el periurbano`,
      ).toBeGreaterThanOrEqual(decadas.periurbano.siembra_ideal.length)
    }
  })

  it('COHERENCIA: no se degrada por helada una década si la anterior, más riesgosa, quedó ideal', () => {
    // El riesgo de helada baja de forma monótona en primavera. Exigirle a una
    // fecha lo que se le perdonó a otra peor deja huecos absurdos en medio de
    // la ventana: era lo que hacía que el tomate mostrara agosto ideal con
    // 100 % de riesgo y principios de octubre degradado con 33 %.
    for (const [slug, e] of especies) {
      const { decadas } = afinar([slug, e])
      for (const zona of ZONAS) {
        const ideal = new Set<number>(decadas[zona].siembra_ideal)
        for (let d = 1; d <= 36; d++) {
          if (ideal.has(d)) continue
          const previa = ((d + 34) % 36) + 1
          const siguiente = (d % 36) + 1
          if (!ideal.has(previa) || !ideal.has(siguiente)) continue
          // hueco de una década en medio de la ventana: solo vale si la
          // anterior era menos riesgosa que ésta
          expect(
            C.riesgoHelada(previa, zona),
            `${slug}/${zona}: hueco en la década ${d} con la anterior más riesgosa`,
          ).toBeLessThan(C.riesgoHelada(d, zona))
        }
      }
    }
  })

  it('el almácigo, protegido o mixto, nunca se degrada por helada', () => {
    // si existe un camino protegido, la helada no puede degradar ese mes
    for (const [slug, e] of especies) {
      const { afinado } = afinar([slug, e])
      for (const a of afinado.ajustes) {
        if (!a.regla.startsWith('helada') || a.regla.includes('trasplante')) continue
        const metodo = e.calendario.metodo_por_mes[String(C.mesDeDecada(a.decada))]
        expect(['almacigo', 'almacigo_protegido', 'directa|almacigo'], `${slug} década ${a.decada}`).not.toContain(
          metodo,
        )
      }
    }
  })

  it('cada ajuste registrado trae su regla y una nota legible', () => {
    for (const par of especies) {
      const { afinado } = afinar(par)
      for (const a of afinado.ajustes) {
        expect(a.regla).toMatch(/^[a-z_]+$/)
        expect(a.nota.length).toBeGreaterThan(20)
        expect(a.decada).toBeGreaterThanOrEqual(1)
        expect(a.decada).toBeLessThanOrEqual(36)
      }
    }
  })
})

import { describe, expect, it } from 'vitest'
import { compatibilidad, textoAviso } from '../src/lib/huerta/compat'
import { validar, BackupInvalido, VERSION_BACKUP } from '../src/lib/huerta/backup'
import { desdeISO, diasEntre, hoyISO } from '../src/lib/huerta/tipos'
import { etapaInicial } from '../src/lib/huerta/store'
import db from '../data/huerta_gba_enriquecido.json'
import type { EspecieEnriquecida } from '../src/lib/data/types'

const especies = db.especies as unknown as EspecieEnriquecida[]
const porSlug = new Map(especies.map((e) => [e.slug, e]))
const get = (s: string) => {
  const e = porSlug.get(s)
  if (!e) throw new Error(`falta ${s} en el catálogo`)
  return e
}

describe('fechas de la huerta', () => {
  it('hoyISO usa la fecha local, no UTC', () => {
    // 23:30 del 15 en Buenos Aires sigue siendo el 15, aunque en UTC ya sea 16
    expect(hoyISO(new Date(2026, 7, 15, 23, 30))).toBe('2026-08-15')
    expect(hoyISO(new Date(2026, 0, 1, 0, 5))).toBe('2026-01-01')
  })

  it('desdeISO devuelve el día correcto en local', () => {
    const d = desdeISO('2026-08-15')
    expect(d.getFullYear()).toBe(2026)
    expect(d.getMonth()).toBe(7)
    expect(d.getDate()).toBe(15)
  })

  it('cuenta días entre fechas, cruzando meses y años', () => {
    expect(diasEntre('2026-08-01', '2026-08-15')).toBe(14)
    expect(diasEntre('2026-08-15', '2026-08-15')).toBe(0)
    expect(diasEntre('2026-12-25', '2027-01-05')).toBe(11)
    expect(diasEntre('2026-02-27', '2026-03-02')).toBe(3) // 2026 no es bisiesto
  })

  it('no se rompe con el cambio de horario', () => {
    // en Argentina hoy no hay DST, pero el cálculo tiene que ser robusto igual
    expect(diasEntre('2026-10-01', '2026-11-01')).toBe(31)
  })
})

describe('etapa inicial según el método', () => {
  it('el almácigo arranca en almácigo; lo demás, ya en tierra', () => {
    expect(etapaInicial('almacigo')).toBe('almacigo')
    expect(etapaInicial('almacigo_protegido')).toBe('almacigo')
    expect(etapaInicial('directa')).toBe('creciendo')
    expect(etapaInicial('plantacion')).toBe('creciendo')
    expect(etapaInicial(null)).toBe('creciendo')
  })
})

describe('compatibilidad', () => {
  it('sin vecinas no hay nada que avisar', () => {
    const c = compatibilidad(get('tomate'), [])
    expect(c.malas).toEqual([])
    expect(c.buenas).toEqual([])
    expect(textoAviso(c)).toBeNull()
  })

  it('se ignora a sí misma: dos plantas de lo mismo no se avisan', () => {
    const c = compatibilidad(get('tomate'), [get('tomate')])
    expect(c.malas).toEqual([])
    expect(c.buenas).toEqual([])
  })

  it('detecta una mala asociación real de la base', () => {
    // el tomate y la papa comparten plagas y enfermedades
    const c = compatibilidad(get('tomate'), [get('papa')])
    expect(c.malas.map((a) => a.slug)).toContain('papa')
  })

  it('la relación se mira en las dos direcciones', () => {
    // si alguna de las dos fichas lo dice, se avisa; y queda marcado de dónde salió
    for (const [a, b] of [
      ['tomate', 'papa'],
      ['papa', 'tomate'],
    ] as const) {
      const c = compatibilidad(get(a), [get(b)])
      expect(c.malas.length, `${a} + ${b}`).toBeGreaterThan(0)
      expect(typeof c.malas[0].reciproco).toBe('boolean')
    }
  })

  it('una mala pisa a una buena: no se felicita y se advierte a la vez', () => {
    for (const e of especies) {
      const vecinas = especies.filter((v) => v.slug !== e.slug)
      const c = compatibilidad(e, vecinas)
      const enMalas = new Set(c.malas.map((a) => a.slug))
      for (const b of c.buenas) expect(enMalas.has(b.slug), `${e.slug} + ${b.slug}`).toBe(false)
    }
  })

  it('todas las asociaciones internas resuelven a una especie del catálogo', () => {
    const c = compatibilidad(get('albahaca'), especies)
    for (const a of [...c.malas, ...c.buenas]) {
      expect(porSlug.has(a.slug)).toBe(true)
      expect(a.nombre.length).toBeGreaterThan(0)
    }
  })

  it('el texto del aviso enumera bien en castellano', () => {
    const uno = { malas: [{ slug: 'a', nombre: 'Papa', reciproco: false }], buenas: [] }
    expect(textoAviso(uno)).toBe('Ojo: no se lleva bien con Papa.')
    const tres = {
      malas: [
        { slug: 'a', nombre: 'Papa', reciproco: false },
        { slug: 'b', nombre: 'Hinojo', reciproco: false },
        { slug: 'c', nombre: 'Repollo', reciproco: false },
      ],
      buenas: [],
    }
    expect(textoAviso(tres)).toBe('Ojo: no se lleva bien con Papa, Hinojo y Repollo.')
  })

  it('nunca se cuelga con el catálogo entero cruzado consigo mismo', () => {
    for (const e of especies) {
      expect(() => compatibilidad(e, especies)).not.toThrow()
    }
  })
})

describe('validación del backup', () => {
  const valido = {
    app: 'huerta-gba',
    version: VERSION_BACKUP,
    exportado: '2026-08-15T12:00:00.000Z',
    zona: 'conurbano',
    plantas: [],
    diario: [],
    ubicaciones: [],
    fotos: [],
  }

  it('acepta un backup bien formado', () => {
    expect(() => validar(valido)).not.toThrow()
  })

  it('rechaza cualquier otro JSON', () => {
    expect(() => validar(null)).toThrow(BackupInvalido)
    expect(() => validar({ hola: 1 })).toThrow(BackupInvalido)
    expect(() => validar({ ...valido, app: 'otra-app' })).toThrow(BackupInvalido)
  })

  it('rechaza un backup de una versión más nueva en vez de romper los datos', () => {
    expect(() => validar({ ...valido, version: VERSION_BACKUP + 1 })).toThrow(/más nueva/)
  })

  it('exige las cuatro listas', () => {
    for (const campo of ['plantas', 'diario', 'ubicaciones', 'fotos']) {
      const roto = { ...valido, [campo]: undefined }
      expect(() => validar(roto), campo).toThrow(BackupInvalido)
    }
  })

  it('cantidad y origenId viajan en la versión 1: van y vuelven intactos', () => {
    // Campos aditivos a propósito: un backup nuevo abre en una app vieja
    // (los ignora) y uno viejo abre acá (quedan undefined).
    const conTanda = {
      ...valido,
      plantas: [
        {
          id: 'p1',
          slug: 'tomate',
          sembrada: '2026-08-01',
          metodo: 'almacigo',
          etapa: 'almacigo',
          etapaDesde: '2026-08-01',
          creada: '2026-08-01T10:00:00.000Z',
          cantidad: 8,
          origenId: 'p0',
        },
      ],
    }
    expect(() => validar(conTanda)).not.toThrow()
    const vuelta = JSON.parse(JSON.stringify(conTanda))
    expect(vuelta.plantas[0].cantidad).toBe(8)
    expect(vuelta.plantas[0].origenId).toBe('p0')
  })
})

describe('backup y ubicación del pronóstico', () => {
  const base = {
    app: 'huerta-gba',
    version: VERSION_BACKUP,
    exportado: '2026-08-15T12:00:00.000Z',
    zona: 'conurbano',
    plantas: [],
    diario: [],
    ubicaciones: [],
    fotos: [],
  }

  it('la ubicación del clima viaja en el backup si existe, y no molesta si falta', () => {
    const ubicacionClima = { modo: 'zona', lat: -34.82, lon: -58.54, etiqueta: 'cerca de Ezeiza' }
    expect(validar({ ...base, ubicacionClima }).ubicacionClima).toEqual(ubicacionClima)
    expect(validar(base).ubicacionClima).toBeUndefined()
  })
})

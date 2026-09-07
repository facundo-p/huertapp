// La guía de compostaje tiene el mismo contrato que el catálogo: todo bloque
// con texto lleva al menos una fuente que existe y una confianza en rango; lo
// que no tiene fuente es null. Corre en `npm test`, como el chequeo del JSON
// enriquecido.
import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { join } from 'node:path'

const g = JSON.parse(readFileSync(join(__dirname, '../data/compostaje.json'), 'utf8'))
const ids = new Set(Object.keys(g.meta.fuentes))

interface Bloque {
  valor?: unknown
  items?: unknown[]
  fuentes: string[]
  confianza: number | null
}

/** Recorre todo el JSON y devuelve cada objeto que tenga `fuentes` y `confianza`. */
function bloques(x: unknown, ruta = 'raiz'): [string, Bloque][] {
  if (!x || typeof x !== 'object') return []
  const o = x as Record<string, unknown>
  const propios: [string, Bloque][] =
    Array.isArray(o.fuentes) && 'confianza' in o ? [[ruta, o as unknown as Bloque]] : []
  return [
    ...propios,
    ...Object.entries(o).flatMap(([k, v]) =>
      Array.isArray(v) ? v.flatMap((e, i) => bloques(e, `${ruta}.${k}[${i}]`)) : bloques(v, `${ruta}.${k}`),
    ),
  ]
}

const todos = bloques(g).filter(([r]) => !r.startsWith('raiz.meta'))

describe('data/compostaje.json', () => {
  it('tiene fuentes con organización, título y URL', () => {
    expect(ids.size).toBeGreaterThanOrEqual(4)
    for (const f of Object.values(g.meta.fuentes) as { organizacion: string; titulo: string; url: string }[]) {
      expect(f.organizacion).toBeTruthy()
      expect(f.titulo).toBeTruthy()
      expect(f.url).toMatch(/^https?:\/\//)
    }
  })

  it('hay bloques, y muchos', () => {
    expect(todos.length).toBeGreaterThan(40)
  })

  it('todo bloque con contenido lleva fuentes que existen y confianza en rango', () => {
    for (const [ruta, b] of todos) {
      // el contenido puede ser un valor, una lista o los campos de una señal
      const o = b as unknown as Record<string, unknown>
      const texto = ['valor', 'items', 'porque', 'como', 'sintoma', 'correccion', 'bien']
        .map((k) => o[k])
        .find((v) => v !== undefined)
      const conContenido = texto !== null && texto !== undefined && texto !== ''
      if (conContenido) {
        expect(b.fuentes.length, `${ruta} sin fuentes`).toBeGreaterThan(0)
        for (const f of b.fuentes) expect(ids.has(f), `${ruta} cita «${f}», que no existe`).toBe(true)
        expect(typeof b.confianza, `${ruta} sin confianza`).toBe('number')
        expect(b.confianza!).toBeGreaterThanOrEqual(1)
        expect(b.confianza!).toBeLessThanOrEqual(10)
      } else {
        // sin dato: sin fuentes ni confianza, y se muestra como s/d
        expect(b.fuentes, `${ruta} es null pero cita fuentes`).toEqual([])
        expect(b.confianza, `${ruta} es null pero tiene confianza`).toBeNull()
      }
    }
  })

  it('lo que el prototipo afirmaba y ninguna fuente respalda quedó en null', () => {
    expect(g.comun.listo.prueba_germinacion.valor).toBeNull()
    expect(g.sistemas.tachos.girar.sin_girar_tiempo.valor).toBeNull()
  })

  it('las cuatro variantes existen: dos materiales y dos sistemas', () => {
    expect(Object.keys(g.por_material).sort()).toEqual(['cocina', 'jardin'])
    expect(Object.keys(g.sistemas).sort()).toEqual(['suelo', 'tachos'])
    for (const s of Object.values(g.sistemas) as { estados: { clave: string }[] }[]) {
      expect(s.estados.map((e) => e.clave)).toEqual(['llenando', 'cocinando', 'madurando'])
    }
    for (const m of Object.values(g.por_material) as Record<string, unknown>[]) {
      for (const k of ['verdes', 'secos', 'poco', 'nunca']) expect(m[k], k).toBeTruthy()
    }
  })

  it('cada exclusión dice por qué', () => {
    for (const m of Object.values(g.por_material) as { nunca: { que: string; porque: string }[]; poco: { que: string; porque: string }[] }[]) {
      for (const x of [...m.nunca, ...m.poco]) {
        expect(x.que).toBeTruthy()
        expect(x.porque.length).toBeGreaterThan(20)
      }
    }
  })
})

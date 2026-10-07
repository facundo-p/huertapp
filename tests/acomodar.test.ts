import { describe, expect, it } from 'vitest'
import {
  acomodado,
  acomodoSobre,
  comoSeguir,
  conOrden,
  describir,
  destinoDe,
  dondeEntra,
  dondeEsta,
  enOrden,
  llevar,
  llevarLugar,
  ordenSobre,
  textoLibre,
  trasladar,
} from '../src/lib/huerta/acomodar'
import { empaquetar, grillaDe, ordenarLugares, type ClaseCroquis, type GrillaLugar } from '../src/lib/huerta/croquis'
import type { Planta, Ubicacion } from '../src/lib/huerta/tipos'

const NOMBRES: Record<string, string> = { t: 'tomate', t2: 'tomate', a: 'albahaca', r: 'rúcula' }
const nombreDe = (id: string) => NOMBRES[id] ?? id

/** «t t ·» por fila; `cap` corta la última, como en las macetas */
function grilla(filas: string[], clase: ClaseCroquis = 'almaciguera', cap?: number): GrillaLugar {
  const celdas = filas.flatMap((f) => f.split(' ').map((x) => (x === '·' ? null : x)))
  return {
    clase,
    ancho: 'entera',
    cols: filas[0].split(' ').length,
    filas: filas.length,
    cap: cap ?? celdas.length,
    celdas: celdas.slice(0, cap ?? celdas.length),
  }
}

describe('trasladar: lo elegido corrido con la misma forma', () => {
  const g = grilla(['t t ·', 'a · ·'])

  it('corre lo elegido con la misma forma, aunque pase sobre sí mismo', () => {
    expect(trasladar(g, [0, 1], 1, 0, nombreDe)).toEqual({ dest: [1, 2] })
    expect(trasladar(g, [1], 0, 1, nombreDe)).toEqual({ dest: [4] })
  })

  it('no se sale del lugar: ni por el costado, que daría la vuelta a la fila de abajo, ni por abajo', () => {
    expect(trasladar(g, [0, 1], -1, 0, nombreDe)).toEqual({ motivo: 'se sale del lugar' })
    expect(trasladar(grilla(['· · t']), [2], 1, 0, nombreDe)).toEqual({ motivo: 'se sale del lugar' })
    expect(trasladar(g, [3], 0, 1, nombreDe)).toEqual({ motivo: 'se sale del lugar' })
    expect(trasladar(g, [0], 0, -1, nombreDe)).toEqual({ motivo: 'se sale del lugar' })
  })

  it('en las macetas, la que no existe de la última fila también es afuera', () => {
    const macetas = grilla(['t t t', '· · ·'], 'macetas', 5)
    expect(trasladar(macetas, [1], 0, 1, nombreDe)).toEqual({ dest: [4] })
    expect(trasladar(macetas, [2], 0, 1, nombreDe)).toEqual({ motivo: 'se sale del lugar' })
  })

  it('no pisa lo que no está elegido, y dice qué, en la unidad del lugar', () => {
    expect(trasladar(g, [0], 0, 1, nombreDe)).toEqual({ motivo: 'pisa una celda de albahaca' })
    const surcos = grilla(['t', 'a', '·'], 'surcos')
    expect(trasladar(surcos, [0], 0, 1, nombreDe)).toEqual({ motivo: 'pisa un surco de albahaca' })
  })
})

describe('destinoDe y dondeEntra: las marcas +', () => {
  it('la «1» va a la marca y las demás la siguen con la misma forma', () => {
    const g = grilla(['t t · ·', '· t · ·'])
    expect(destinoDe(g, [0, 1, 5], 2, nombreDe)).toEqual({ dest: [2, 3, 7] })
    expect(destinoDe(g, [0, 1, 5], 3, nombreDe)).toEqual({ motivo: 'se sale del lugar' })
  })

  it('la marca va sólo en las libres donde entra todo lo elegido', () => {
    const g = grilla(['t t · ·', '· · · ·'])
    expect([...dondeEntra(g, [0, 1], nombreDe)]).toEqual([2, 4, 5, 6])
  })

  // un paso adelante pondría la «1» sobre otra elegida: eso se hace de a una celda
  it('un bloque se corre sobre sí mismo hacia atrás; hacia adelante, sólo saltándose entero', () => {
    const g = grilla(['· t t · ·'])
    expect([...dondeEntra(g, [1, 2], nombreDe)]).toEqual([0, 3])
  })

  it('sin nada elegido no hay marcas', () => {
    expect(dondeEntra(grilla(['t · ·']), [], nombreDe).size).toBe(0)
  })
})

describe('llevar', () => {
  it('lleva cada elegida a su destino, en el mismo orden, y deja libre lo que no se pisa', () => {
    expect(llevar(['t', 'a', null, null], [0, 1], [2, 3])).toEqual([null, null, 't', 'a'])
    expect(llevar(['t', 't', null], [0, 1], [1, 2])).toEqual([null, 't', 't'])
  })
})

describe('lo que se le dice al lector', () => {
  const g = grilla(['t t t', 'a · ·'])

  it('describe lo elegido contra lo que hay de esa planta', () => {
    expect(describir(g, [0], nombreDe)).toBe('1 celda de tomate, de 3')
    expect(describir(g, [0, 1], nombreDe)).toBe('2 de las 3 celdas de tomate')
    expect(describir(g, [0, 1, 2], nombreDe)).toBe('Las 3 celdas de tomate')
    expect(describir(g, [3], nombreDe)).toBe('La única celda de albahaca')
    expect(describir(g, [0, 3], nombreDe)).toBe('2 celdas: tomate y albahaca')
  })

  it('dos siembras con el mismo nombre no lo repiten', () => {
    expect(describir(grilla(['t t2 a']), [0, 1, 2], nombreDe)).toBe('3 celdas: tomate y albahaca')
  })

  it('habla en la unidad del lugar, con su artículo', () => {
    const surcos = grilla(['t', 't', 'a'], 'surcos')
    expect(describir(surcos, [0], nombreDe)).toBe('1 surco de tomate, de 2')
    expect(describir(surcos, [0, 1], nombreDe)).toBe('Los 2 surcos de tomate')
    expect(describir(surcos, [2], nombreDe)).toBe('El único surco de albahaca')
    expect(describir(grilla(['t a ·'], 'macetas'), [0, 1], nombreDe)).toBe('2 macetas: tomate y albahaca')
    expect(textoLibre('almaciguera')).toBe('Esa celda está libre.')
    expect(textoLibre('surcos')).toBe('Ese surco está libre.')
  })

  it('dónde está una celda', () => {
    expect(dondeEsta(g, 4)).toBe('fila 2, columna 2')
    expect(dondeEsta(grilla(['t', 'a'], 'surcos'), 1)).toBe('surco 2')
  })

  it('cómo seguir: nunca promete una marca que no hay', () => {
    expect(comoSeguir(g, [0], true)).toBe('Tocá una marca + para llevarla ahí.')
    expect(comoSeguir(g, [0, 1], true)).toBe('Tocá una marca +: ahí va la «1», y la otra la sigue con la misma forma.')
    expect(comoSeguir(g, [0, 1, 2], true)).toMatch(/las demás la siguen/)
    expect(comoSeguir(g, [0, 1], false)).toBe('No hay lugar libre con esa forma: soltá alguna.')
    expect(comoSeguir(g, [0], false)).toBe('No hay otra celda libre en este lugar.')
  })

  it('sin lugar libre, habla en la unidad del lugar', () => {
    expect(comoSeguir(grilla(['t a'], 'macetas'), [0], false)).toBe('No hay otra maceta libre en este lugar.')
    expect(comoSeguir(grilla(['t a'], 'surcos'), [0], false)).toBe('No hay otro surco libre en este lugar.')
  })
})

describe('acomodado: lo que se guarda', () => {
  let n = 0
  const planta = (p: Partial<Planta>): Planta => {
    n++
    return {
      id: `p${n}`,
      slug: 'lechuga',
      sembrada: '2026-01-01',
      metodo: 'directa',
      etapa: 'creciendo',
      etapaDesde: '2026-01-01',
      creada: `2026-01-01T00:00:${String(n).padStart(2, '0')}`,
      ...p,
    }
  }
  const LUGARES: Ubicacion[] = [
    { id: 'alm', nombre: 'Almaciguera', tipo: 'almacigo', capacidad: 12, creada: '2026-01-01' },
    { id: 'mac', nombre: 'Macetas', tipo: 'maceta', capacidad: 5, creada: '2026-01-01' },
    { id: 'sur', nombre: 'Surcos', tipo: 'bancal_tierra', disposicion: 'surcos', capacidad: 4, creada: '2026-01-01' },
    {
      id: 'lib',
      nombre: 'Libre',
      tipo: 'bancal_elevado',
      disposicion: 'libre',
      medidas: { ancho: 120, largo: 240 },
      creada: '2026-01-01',
    },
    { id: 'otr', nombre: 'Otro', tipo: 'otro', creada: '2026-01-01' },
  ]

  it('lo guardado se vuelve a dibujar igual, en cada clase de lugar', () => {
    for (const u of LUGARES) {
      const plantas = [
        planta({ ubicacionId: u.id, ocupa: 2, superficie: 0.3 }),
        planta({ ubicacionId: u.id, ocupa: 1 }),
        planta({ ubicacionId: u.id, etapa: 'terminada' }),
      ]
      const g = grillaDe(u, plantas)
      // al revés: lo más lejos posible del nivel 0
      const celdas = [...g.celdas].reverse()
      const r = acomodado(u, plantas, g, celdas)
      const vuelta = grillaDe(r.ubicacion, [...r.plantas, plantas[2]])
      expect(vuelta.celdas, u.id).toEqual(celdas)
      expect(vuelta.cols, u.id).toBe(g.cols)
    }
  })

  it('guarda la grilla y las columnas, y conserva el orden del lugar', () => {
    const u = { ...LUGARES[0], plano: { orden: 3 } }
    const plantas = [planta({ ubicacionId: 'alm', ocupa: 2 })]
    const g = grillaDe(u, plantas)
    const { ubicacion } = acomodado(u, plantas, g, g.celdas)
    expect(ubicacion.plano).toEqual({ orden: 3, grilla: 'almaciguera', cols: 6 })
    const surcos = acomodado({ ...LUGARES[2], plano: { cols: 3 } }, [], grillaDe(LUGARES[2], []), [null])
    expect(surcos.ubicacion.plano).toEqual({ grilla: 'surcos' })
  })

  // dos toques seguidos: el segundo se armó con la pantalla de antes del primero
  it('se guarda sobre lo guardado: no pisa un orden ni un trasplante que no llegó a la pantalla', () => {
    const u = LUGARES[0]
    const [a, b] = [planta({ ubicacionId: 'alm' }), planta({ ubicacionId: 'alm' })]
    const g = grillaDe(u, [a, b])
    const hecho = acomodado(u, [a, b], g, [...g.celdas].reverse())
    const guardado = {
      ubicaciones: [{ ...u, nombre: 'Almaciguera nueva', plano: { orden: 2 } }, LUGARES[1]],
      plantas: [a, { ...b, ubicacionId: 'mac' }],
    }
    const r = acomodoSobre(guardado, hecho)
    expect(r.ubicaciones).toEqual([{ ...guardado.ubicaciones[0], plano: { orden: 2, grilla: 'almaciguera', cols: 6 } }])
    expect(r.plantas.map((p) => [p.id, p.ubicacionId, p.celdas?.ubicacionId])).toEqual([[a.id, 'alm', 'alm']])
    // sin orden guardado, tampoco sale uno de la pantalla
    const conOrdenViejo = { ...hecho.ubicacion, plano: { ...hecho.ubicacion.plano, orden: 7 } }
    const sinOrden = acomodoSobre({ ...guardado, ubicaciones: [u] }, { ...hecho, ubicacion: conOrdenViejo })
    expect(sinOrden.ubicaciones[0].plano).toEqual({ grilla: 'almaciguera', cols: 6 })
    // un lugar borrado entretanto no vuelve
    expect(acomodoSobre({ ...guardado, ubicaciones: [LUGARES[1]] }, hecho)).toEqual({ ubicaciones: [], plantas: [] })
  })

  it('van todas las plantas dibujadas, cada una con su lugar; las que no se dibujan, no', () => {
    const u = LUGARES[1]
    const [a, b, fin] = [
      planta({ ubicacionId: 'mac', ocupa: 2 }),
      planta({ ubicacionId: 'mac' }),
      planta({ ubicacionId: 'mac', etapa: 'terminada' }),
    ]
    const g = grillaDe(u, [a, b, fin])
    const r = acomodado(u, [a, b, fin], g, [null, a.id, null, b.id, a.id])
    expect(r.plantas.map((p) => [p.id, p.celdas])).toEqual([
      [a.id, { ubicacionId: 'mac', en: [{ col: 1, fila: 0 }, { col: 1, fila: 1 }] }],
      [b.id, { ubicacionId: 'mac', en: [{ col: 0, fila: 1 }] }],
    ])
  })
})

describe('mover un lugar en la hoja', () => {
  const lugar = (id: string, ancho: 'media' | 'entera') => ({
    ubicacion: { id, nombre: id, tipo: 'otro', creada: '2026-01-01' } as Ubicacion,
    ancho,
  })
  const ids = (xs: { ubicacion?: Ubicacion }[]) => xs.map((x) => x.ubicacion?.id ?? 'sin').join(' ')
  // la huerta de ejemplo: la almaciguera y el fondo enteros, las macetas y la medianera de a dos
  const demo = empaquetar([
    lugar('alm', 'entera'),
    lugar('mac', 'media'),
    lugar('fon', 'entera'),
    lugar('med', 'media'),
  ])

  const orden = (r: { orden: Ubicacion[] }) => ids(r.orden.map((ubicacion) => ({ ubicacion })))

  it('el primero que tocás queda en el puesto del segundo, para atrás o para adelante', () => {
    expect(ids(demo)).toBe('alm mac med fon')
    const atras = llevarLugar(demo, 'fon', 'mac')!
    expect(orden(atras)).toBe('alm fon mac med')
    expect(atras.puesto).toBe(1)
    const adelante = llevarLugar(demo, 'mac', 'med')!
    expect(orden(adelante)).toBe('alm med mac fon')
    expect(adelante.puesto).toBe(2)
    expect(orden(llevarLugar(demo, 'alm', 'fon')!)).toBe('mac med fon alm')
  })

  it('el puesto es el que va a dibujar la hoja con el orden guardado', () => {
    for (const l of demo)
      for (const a of demo) {
        const r = llevarLugar(demo, l.ubicacion!.id, a.ubicacion!.id)
        if (!r) continue
        const guardados = conOrden(r.orden)
        const hoja = empaquetar(ordenarLugares(demo.map((x) => ({ ...x, ubicacion: guardados.find((u) => u.id === x.ubicacion!.id) }))))
        expect(hoja.findIndex((x) => x.ubicacion!.id === l.ubicacion!.id)).toBe(r.puesto)
        expect(ids(enOrden(demo, r.orden.map((u) => u.id)))).toBe(ids(hoja))
      }
  })

  it('consigo mismo no se mueve', () => {
    expect(llevarLugar(demo, 'mac', 'mac')).toBeNull()
  })

  it('si la hoja queda igual no se mueve: los chicos van de a dos', () => {
    const vista = empaquetar([lugar('a', 'media'), lugar('b', 'media'), lugar('e', 'entera')])
    expect(llevarLugar(vista, 'b', 'e')).toBeNull()
    // dos chicos que cambian de lado sí cambian la hoja
    expect(orden(llevarLugar(vista, 'b', 'a')!)).toBe('b a e')
  })

  it('«Sin lugar asignado» no se mueve ni recibe: va siempre al final', () => {
    const vista = [lugar('a', 'entera'), lugar('b', 'entera'), { ubicacion: undefined, ancho: 'media' as const }]
    expect(llevarLugar(vista, 'b', 'sin')).toBeNull()
    expect(orden(llevarLugar(vista, 'a', 'b')!)).toBe('b a')
    expect(ids(enOrden(vista, ['b', 'a']))).toBe('b a sin')
  })

  it('el que no está en el orden nuevo va después, como vino', () => {
    expect(ids(enOrden(demo, ['fon', 'alm']))).toBe('fon alm mac med')
  })

  it('el orden va sobre lo guardado: no pisa un acomodo que no llegó a la pantalla, ni revive uno borrado', () => {
    const vistos: Ubicacion[] = [
      { id: 'a', nombre: 'a', tipo: 'almacigo', creada: '' },
      { id: 'b', nombre: 'b', tipo: 'maceta', creada: '' },
      { id: 'c', nombre: 'c', tipo: 'otro', creada: '' },
    ]
    const guardadas = [{ ...vistos[0], plano: { grilla: 'almaciguera' as const, cols: 6 as const } }, vistos[2]]
    expect(ordenSobre(guardadas, [vistos[2], vistos[1], vistos[0]])).toEqual([
      { ...vistos[2], plano: { orden: 0 } },
      { ...vistos[0], plano: { grilla: 'almaciguera', cols: 6, orden: 1 } },
    ])
  })

  it('el orden queda escrito en todos los lugares, sin tocar lo demás del plano', () => {
    const [a, b] = conOrden([
      { id: 'a', nombre: 'a', tipo: 'maceta', creada: '', plano: { grilla: 'macetas', cols: 3, orden: 5 } },
      { id: 'b', nombre: 'b', tipo: 'otro', creada: '', plano: { orden: 'x' } as unknown as Ubicacion['plano'] },
    ])
    expect(a.plano).toEqual({ grilla: 'macetas', cols: 3, orden: 0 })
    expect(b.plano).toEqual({ orden: 1 })
  })
})

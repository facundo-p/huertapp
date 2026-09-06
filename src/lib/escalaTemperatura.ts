/**
 * Modelo de la escala de temperaturas de la ficha: la geometría y los textos
 * salen de acá, el componente solo dibuja.
 *
 * La regla que importa: el rango tolerado son **dos alas independientes** de
 * la banda ideal. Sin dato viable de un lado, ese lado no se dibuja y la
 * etiqueta dice "s/d" — antes se rellenaba con el número ideal, y eso era
 * afirmar un dato que ninguna fuente dio.
 */

// dominio de dibujo: -10 a 45 °C cubre todo lo de la huerta
export const DOM_MIN = -10
export const DOM_MAX = 45

export interface ValoresEscala {
  min: number | null
  idealMin: number | null
  idealMax: number | null
  max: number | null
}

export interface BandaEscala {
  tipo: 'tolerado' | 'ideal'
  desdePct: number
  anchoPct: number
}

export interface EtiquetaEscala {
  lado: 'min' | 'ideal' | 'max'
  texto: string
  /** posición en % del riel; null = pegada al borde del contenedor de su lado */
  pct: number | null
  sinDato: boolean
}

export interface ModeloEscala {
  bandas: BandaEscala[]
  etiquetas: EtiquetaEscala[]
  /** dónde cae el 0 °C, la referencia mental de la helada */
  ceroPct: number
}

const pct = (v: number) => Math.min(100, Math.max(0, ((v - DOM_MIN) / (DOM_MAX - DOM_MIN)) * 100))

// las etiquetas van centradas en su posición: cerca del borde se recortan un
// poco hacia adentro para que el texto no cuelgue fuera del contenedor
const pctEtiqueta = (v: number) => Math.min(96, Math.max(4, pct(v)))

export function modeloEscala(v: ValoresEscala): ModeloEscala | null {
  const { min, idealMin, idealMax, max } = v
  // sin el par ideal no hay escala: un ala tolerada sola no tiene contra qué apoyarse
  if (idealMin === null || idealMax === null) return null

  const bandas: BandaEscala[] = []
  if (min !== null) bandas.push({ tipo: 'tolerado', desdePct: pct(min), anchoPct: pct(idealMin) - pct(min) })
  bandas.push({
    tipo: 'ideal',
    desdePct: pct(idealMin),
    anchoPct: Math.max(pct(idealMax) - pct(idealMin), 2),
  })
  if (max !== null) bandas.push({ tipo: 'tolerado', desdePct: pct(idealMax), anchoPct: pct(max) - pct(idealMax) })

  const extremo = (lado: 'min' | 'max', valor: number | null): EtiquetaEscala =>
    valor === null
      ? { lado, texto: 's/d', pct: null, sinDato: true }
      : { lado, texto: `${valor}°C`, pct: pctEtiqueta(valor), sinDato: false }

  const etiquetas: EtiquetaEscala[] = [
    extremo('min', min),
    {
      lado: 'ideal',
      texto: `ideal ${idealMin}–${idealMax}°C`,
      // este texto es más ancho que un número: se recorta más para que entre
      pct: Math.min(85, Math.max(15, pct((idealMin + idealMax) / 2))),
      sinDato: false,
    },
    extremo('max', max),
  ]

  return { bandas, etiquetas, ceroPct: pct(0) }
}

/** El texto con el que la escala entera se presenta a un lector de pantalla. */
export function rotuloEscala(nombre: string, v: ValoresEscala): string {
  const { min, idealMin, idealMax, max } = v
  const ideal = `ideal entre ${idealMin} y ${idealMax} °C`
  const tolera =
    min !== null && max !== null
      ? `, aguanta de ${min} a ${max} °C`
      : min !== null
        ? `, aguanta desde ${min} °C; del máximo no hay dato`
        : max !== null
          ? `, aguanta hasta ${max} °C; del mínimo no hay dato`
          : `; de los extremos que aguanta no hay dato`
  return `${nombre}: ${ideal}${tolera}`
}

/** Cuando hay algún viable pero no el par ideal: el dato se dice, no se dibuja. */
export function textoSinIdeal(v: ValoresEscala): string | null {
  const { min, max } = v
  if (min !== null && max !== null)
    return `Aguanta de ${min} a ${max} °C; del rango ideal no encontramos fuente.`
  if (min !== null) return `Aguanta el frío hasta ${min} °C; del rango ideal no encontramos fuente.`
  if (max !== null) return `Aguanta el calor hasta ${max} °C; del rango ideal no encontramos fuente.`
  return null
}

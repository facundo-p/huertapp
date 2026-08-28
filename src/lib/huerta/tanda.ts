import { nuevoId, type Planta } from './tipos'

// Una siembra son muchas plantas: la tarjeta es una "tanda" que puede
// dividirse al trasplantar. Cada parte conserva UNA etapa y UN lugar; la
// pertenencia a la siembra original viaja en `origenId`, que apunta siempre a
// la raíz para que borrar una tarjeta intermedia no rompa la cadena.

export const raizDe = (p: Planta): string => p.origenId ?? p.id

/** Las otras tarjetas de la misma siembra, sin archivadas y sin la propia. */
export function partesDe(plantas: Planta[], p: Planta): Planta[] {
  return plantas.filter((x) => x.id !== p.id && !x.archivada && raizDe(x) === raizDe(p))
}

export interface OpcionesDividir {
  /** ISO corta: cuándo fue el trasplante */
  fecha: string
  ubicacionId?: string
  cuantas?: number
  /** inyectables para tests */
  idHija?: string
  creadaHija?: string
}

/** Divide la tanda: la hija se lleva `cuantas` al lugar nuevo, la madre queda con el resto. */
export function dividirTanda(madre: Planta, o: OpcionesDividir): { madre: Planta; hija: Planta } {
  const cambiaEtapa = madre.etapa === 'almacigo'
  const hija: Planta = {
    id: o.idHija ?? nuevoId(),
    slug: madre.slug,
    apodo: madre.apodo,
    ubicacionId: o.ubicacionId,
    sembrada: madre.sembrada,
    metodo: madre.metodo,
    etapa: cambiaEtapa ? 'trasplantada' : madre.etapa,
    etapaDesde: cambiaEtapa ? o.fecha : madre.etapaDesde,
    germino: madre.germino,
    cantidad: o.cuantas,
    origenId: raizDe(madre),
    creada: o.creadaHija ?? new Date().toISOString(),
  }
  const descontar = madre.cantidad != null && o.cuantas != null
  return {
    madre: descontar ? { ...madre, cantidad: Math.max(0, madre.cantidad! - o.cuantas!) } : madre,
    hija,
  }
}

/** Trasplante o mudanza de la tarjeta entera: avanza de etapa solo si estaba en almácigo. */
export function moverTanda(p: Planta, o: { fecha: string; ubicacionId?: string }): Planta {
  const cambiaEtapa = p.etapa === 'almacigo'
  return {
    ...p,
    ubicacionId: o.ubicacionId,
    etapa: cambiaEtapa ? 'trasplantada' : p.etapa,
    etapaDesde: cambiaEtapa ? o.fecha : p.etapaDesde,
  }
}

/** Del input de texto a una cantidad, o undefined si no es un número usable. */
export function aCantidad(texto: string): number | undefined {
  if (!texto.trim()) return undefined
  const n = Math.round(Number(texto))
  return Number.isFinite(n) && n >= 0 ? n : undefined
}

/** "~8", salvo que sea una sola (o ninguna): la virgulilla ahí suena a chiste. */
const aprox = (n: number): string => (n > 1 ? `~${n}` : String(n))

/** "3 siembras · ~24 plantas" — siembras por raíz, total solo si alguien cargó cantidades. */
export function resumenHuerta(activas: Planta[]): string {
  const siembras = new Set(activas.map(raizDe)).size
  const texto = siembras === 1 ? '1 siembra' : `${siembras} siembras`
  const conCantidad = activas.filter((p) => p.cantidad != null)
  if (!conCantidad.length) return texto
  const total = conCantidad.reduce((suma, p) => suma + p.cantidad!, 0)
  return `${texto} · ${aprox(total)} ${total === 1 ? 'planta' : 'plantas'}`
}

/** "~8 plantines" en almácigo, "~4 plantas" después. Sin cantidad, nada. */
export function textoCantidad(p: Planta): string | null {
  if (p.cantidad == null) return null
  const unidad = p.etapa === 'almacigo' ? ['plantín', 'plantines'] : ['planta', 'plantas']
  return `${aprox(p.cantidad)} ${p.cantidad === 1 ? unidad[0] : unidad[1]}`
}

/** "~8" a secas, para la fila apretada de la tarjeta; la unidad vive en el detalle. */
export function cantidadCorta(p: Planta): string | null {
  return p.cantidad == null ? null : aprox(p.cantidad)
}

// ── Textos de las entradas de diario automáticas ─────────────────────────────
// El diario ES la traza de los movimientos: acá se redacta, el store la guarda.

export function textosTrasplanteParcial(o: {
  cuantas?: number
  nombreDestino?: string
  nombreOrigen?: string
}): { madre: string; hija: string } {
  const destino = o.nombreDestino ? ` a ${o.nombreDestino}` : ''
  const madre = `Pasaste ${o.cuantas != null ? aprox(o.cuantas) : 'una parte'}${destino}.`
  const verbo = o.cuantas === 1 ? 'Viene' : 'Vienen'
  const eran = o.cuantas != null ? ` — ${o.cuantas === 1 ? 'era' : 'eran'} ${aprox(o.cuantas)}` : ''
  const hija = `${verbo} de ${o.nombreOrigen ?? 'la siembra original'}${eran}.`
  return { madre, hija }
}

export function textoTrasplanteEntero(o: { cambioEtapa: boolean; nombreDestino?: string }): string {
  const destino = o.nombreDestino ? ` a ${o.nombreDestino}` : ''
  return `${o.cambioEtapa ? 'Trasplantada' : 'Movida'}${destino}.`
}

/** "De ~10 quedaron ~6." — la dirección del cambio elige el verbo. */
export function textoConteo(anterior: number | undefined, nueva: number): string {
  if (anterior == null || anterior === nueva) return `Hay ${aprox(nueva)}.`
  if (nueva > anterior) return `De ${aprox(anterior)} pasaron a ${aprox(nueva)}.`
  return `De ${aprox(anterior)} ${nueva === 1 ? 'quedó' : 'quedaron'} ${aprox(nueva)}.`
}

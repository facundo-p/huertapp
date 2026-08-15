// Helpers de fecha para GBA (hemisferio sur), locale es-AR.
import type { Decada, Mes } from './data/types'

export type Estacion = 'verano' | 'otoño' | 'invierno' | 'primavera'

export function mesDe(fecha: Date): Mes {
  return (fecha.getMonth() + 1) as Mes
}

export function estacionDe(mes: Mes): Estacion {
  if (mes === 12 || mes <= 2) return 'verano'
  if (mes <= 5) return 'otoño'
  if (mes <= 8) return 'invierno'
  return 'primavera'
}

const SALUDOS: Record<Estacion, string> = {
  verano: 'Riego temprano y a la sombra al mediodía',
  otoño: 'Tiempo de hojas y de preparar el suelo',
  invierno: 'La huerta descansa, pero no del todo',
  primavera: 'Se viene lo mejor: todo quiere brotar',
}

export function saludoEstacional(fecha: Date): string {
  return SALUDOS[estacionDe(mesDe(fecha))]
}

export function fechaLarga(fecha: Date): string {
  const texto = new Intl.DateTimeFormat('es-AR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(fecha)
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}

export const NOMBRES_MES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
] as const

export const INICIALES_MES = ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'] as const

// ── Décadas (tercios de mes) ────────────────────────────────────────────────
// 36 al año. Es la unidad de los boletines agrometeorológicos del INTA y la
// que usa el calendario afinado. Mantener sincronizado con scripts/clima-gba.mjs.

export const DIAS_MES = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31] as const

/** 1 = principios (días 1-10) · 2 = mediados (11-20) · 3 = fines (21 a fin de mes). */
export type Tercio = 1 | 2 | 3

export const NOMBRES_TERCIO = ['principios', 'mediados', 'fines'] as const

export function decadaDeMesDia(mes: Mes, dia: number): Decada {
  return (mes - 1) * 3 + (dia <= 10 ? 1 : dia <= 20 ? 2 : 3)
}

export function decadaDe(fecha: Date): Decada {
  return decadaDeMesDia(mesDe(fecha), fecha.getDate())
}

export function mesDeDecada(decada: Decada): Mes {
  return (Math.floor((decada - 1) / 3) + 1) as Mes
}

export function tercioDeDecada(decada: Decada): Tercio {
  return (((decada - 1) % 3) + 1) as Tercio
}

/** Las tres décadas de un mes, en orden. */
export function decadasDelMes(mes: Mes): [Decada, Decada, Decada] {
  return [mes * 3 - 2, mes * 3 - 1, mes * 3]
}

/** "mediados de septiembre" */
export function nombreDecada(decada: Decada): string {
  return `${NOMBRES_TERCIO[tercioDeDecada(decada) - 1]} de ${NOMBRES_MES[mesDeDecada(decada) - 1]}`
}

/** "mediados de sept." — para lugares angostos */
export function nombreDecadaCorto(decada: Decada): string {
  const mes = NOMBRES_MES[mesDeDecada(decada) - 1]
  return `${NOMBRES_TERCIO[tercioDeDecada(decada) - 1]} de ${mes.length > 5 ? `${mes.slice(0, 4)}.` : mes}`
}

/** Último día del mes en el que cae la década (para el cierre de ventana). */
export function ultimoDiaDeDecada(decada: Decada): number {
  const tercio = tercioDeDecada(decada)
  return tercio === 1 ? 10 : tercio === 2 ? 20 : DIAS_MES[mesDeDecada(decada) - 1]
}

/** Cuántos días faltan para que termine la década en la que cae `fecha`. */
export function diasHastaFinDeDecada(fecha: Date): number {
  return ultimoDiaDeDecada(decadaDe(fecha)) - fecha.getDate() + 1
}

export const siguienteDecada = (d: Decada): Decada => (d % 36) + 1
export const anteriorDecada = (d: Decada): Decada => ((d + 34) % 36) + 1

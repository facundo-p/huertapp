// Helpers de fecha para GBA (hemisferio sur), locale es-AR.
import type { Mes } from './data/types'

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

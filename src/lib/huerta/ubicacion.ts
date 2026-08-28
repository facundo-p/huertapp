import type { MedidasUbicacion, TipoUbicacion, LuzUbicacion, ProteccionUbicacion } from './tipos'

// El lugar como entidad: qué se puede decir de él y qué medidas tienen sentido
// según el tipo. Lógica pura; la ficha (UI) solo dibuja lo que acá se decide.

export const TIPO_UBICACION_INFO: Record<TipoUbicacion, { etiqueta: string }> = {
  maceta: { etiqueta: 'Maceta' },
  bancal: { etiqueta: 'Bancal' },
  bancal_elevado: { etiqueta: 'Bancal elevado' },
  bancal_tierra: { etiqueta: 'Bancal a tierra' },
  almacigo: { etiqueta: 'Almácigo' },
  otro: { etiqueta: 'Otro' },
}

/** Lo que ofrece el alta. El 'bancal' legado no: al editar uno se elige cuál es. */
export const TIPOS_ELEGIBLES: TipoUbicacion[] = ['maceta', 'bancal_elevado', 'bancal_tierra', 'almacigo', 'otro']

export const LUZ_INFO: Record<LuzUbicacion, { etiqueta: string }> = {
  pleno_sol: { etiqueta: 'Pleno sol' },
  media_sombra: { etiqueta: 'Media sombra' },
  sombra: { etiqueta: 'Sombra' },
}

export const PROTECCION_INFO: Record<ProteccionUbicacion, { etiqueta: string }> = {
  expuesta: { etiqueta: 'A cielo abierto' },
  resguardada: { etiqueta: 'Resguardada' },
  invernadero: { etiqueta: 'Invernadero' },
}

export type CampoMedida = keyof MedidasUbicacion

export const CAMPO_MEDIDA_INFO: Record<CampoMedida, { etiqueta: string; unidad: string }> = {
  ancho: { etiqueta: 'Ancho', unidad: 'cm' },
  largo: { etiqueta: 'Largo', unidad: 'cm' },
  profundidad: { etiqueta: 'Profundidad', unidad: 'cm' },
  volumen: { etiqueta: 'Volumen', unidad: 'L' },
}

const MEDIDAS_POR_TIPO: Record<TipoUbicacion, CampoMedida[]> = {
  maceta: ['profundidad', 'volumen'],
  bancal: [],
  bancal_elevado: ['ancho', 'largo', 'profundidad'],
  // en tierra el volumen no dice nada; largo × ancho es lo que se mira
  bancal_tierra: ['largo', 'ancho'],
  almacigo: [],
  otro: [],
}

/** Qué medidas se cargan para este tipo, en el orden en que se muestran. */
export const medidasQueAplican = (tipo: TipoUbicacion): CampoMedida[] => MEDIDAS_POR_TIPO[tipo]

/** Solo el bancal elevado calcula su volumen; en la maceta es dato cargado. */
export function volumenCalculado(tipo: TipoUbicacion, m: MedidasUbicacion | undefined): number | null {
  if (tipo !== 'bancal_elevado' || !m) return null
  const { ancho, largo, profundidad } = m
  if (ancho == null || largo == null || profundidad == null) return null
  return Math.round((ancho * largo * profundidad) / 1000)
}

/** Del input a centímetros (o litros). Acepta la coma decimal, que acá es la usual. */
export function aMedida(texto: string): number | undefined {
  if (!texto.trim()) return undefined
  const n = Number(texto.replace(',', '.'))
  return Number.isFinite(n) && n > 0 ? n : undefined
}

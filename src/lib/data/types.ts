// Tipos de la base de conocimiento enriquecida (data/huerta_gba_enriquecido.json).

export type Mes = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12

export type Metodo = 'directa' | 'almacigo' | 'directa|almacigo' | 'almacigo_protegido' | 'plantacion'

export type CategoriaSuelo =
  | 'ARENOSO_DRENANTE'
  | 'FRANCO_FERTIL'
  | 'HUMEDO_RICO'
  | 'PROFUNDO_SUELTO'
  | 'RUSTICO_TOLERANTE'

export type CategoriaLuz = 'PLENO_SOL' | 'SOL_PARCIAL' | 'MEDIA_SOMBRA' | 'TOLERA_SOMBRA'

export type Grupo =
  | 'Hortaliza de hoja'
  | 'Hortaliza de raíz/bulbo'
  | 'Hortaliza de fruto'
  | 'Legumbre'
  | 'Aromática'
  | 'Flor polinizadora'

export interface Fuente {
  titulo: string
  url: string
  organizacion: string
}

export interface Dato {
  valor: string
  fuentes: Fuente[]
  confianza: number
}

export interface Rango {
  min: number
  max: number
}

export interface AsocRef {
  slug?: string
  etiqueta?: string
  externa: boolean
  /** Aclaración corta (ej. "baja confianza", "solo si se dejan semillar"). */
  nota?: string
}

/** Cómo responde la especie a las heladas del GBA. */
export type RespuestaHelada = 'muere' | 'sensible' | 'tolera' | 'mejora'

export interface Temperaturas {
  /** Temperaturas de suelo (°C) para germinar o brotar. */
  germinacion: {
    min: number | null
    ideal_min: number | null
    ideal_max: number | null
    max: number | null
  }
  /** Temperaturas de aire (°C) para desarrollarse. */
  crecimiento: {
    ideal_min: number | null
    ideal_max: number | null
    tolera_min: number | null
    tolera_max: number | null
  }
  helada: RespuestaHelada | null
  /** Una frase con la consecuencia práctica. */
  nota: string
  fuentes: Fuente[]
  confianza: number
}

/** Tercio de mes, 1-36. La 1 son los días 1-10 de enero; la 36, del 21 al 31 de diciembre. */
export type Decada = number

/** El gradiente de heladas dentro del AMBA es de más de un mes: la zona importa. */
export type Zona = 'urbano' | 'conurbano' | 'periurbano'

export const ZONAS: Zona[] = ['urbano', 'conurbano', 'periurbano']

export interface Ventanas<T> {
  siembra_ideal: T[]
  siembra_posible: T[]
  trasplante_ideal: T[]
  trasplante_posible: T[]
}

export interface AjusteAfinado {
  decada: Decada
  regla: string
  nota: string
}

export interface Afinado {
  /** `afinado` = lo recortó el modelo · `sin_afinar` = quedó a resolución mensual · `fuente_explicita` = lo dijo una fuente */
  estado: 'afinado' | 'sin_afinar' | 'fuente_explicita'
  /** por qué no se pudo afinar, si es el caso */
  motivo: string | null
  /** la cita textual, cuando la precisión sub-mensual viene de una fuente */
  nota_fuente: string | null
  ajustes: AjusteAfinado[]
  confianza: number
  zona_referencia: Record<Zona, string>
}

export interface Calendario {
  /** Lo que dicen las fuentes, por mes. Capa citable: el afinado nunca la toca. */
  fuente_meses: Ventanas<Mes>
  metodo_por_mes: Record<string, Metodo>
  derivacion: string
  confianza: number
  /** Afinado a tercios de mes, precalculado por zona. */
  decadas: Record<Zona, Ventanas<Decada>>
  afinado: Afinado
}

export interface EspecieEnriquecida {
  slug: string
  nombre_comun: string
  nombre_cientifico: string
  grupo: Grupo
  fecha_siembra: Dato
  forma_siembra: Dato
  suelo: Dato & { categoria_suelo: CategoriaSuelo; que_pasa_si_no: string }
  luz: Dato & {
    categoria_luz: CategoriaLuz
    horas_min: string | number
    horas_ideal: string | number
    tolera_sin_sol_directo: string | boolean
    que_pasa_si_no: string
  }
  cosecha: Dato & { indicadores_listo: string }
  transplante: Dato & { signos_listo: string }
  germinacion: Dato
  longevidad: Dato
  trucos: Dato
  riesgos: Dato
  plagas: Dato
  asociaciones_buenas: Dato
  asociaciones_malas: Dato
  calendario: Calendario
  temperaturas: Temperaturas
  dias_a_trasplante: Rango | null
  dias_a_cosecha: Rango | null
  dias_germinacion: Rango | null
  asociaciones: { buenas: AsocRef[]; malas: AsocRef[] }
}

export interface CategoriaInfo {
  emoji: string
  nombre: string
  desc: string
}

export interface EspeciesDB {
  meta: Record<string, unknown>
  categorias_suelo: Record<CategoriaSuelo, CategoriaInfo>
  categorias_luz: Record<CategoriaLuz, CategoriaInfo>
  especies: EspecieEnriquecida[]
}

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

/**
 * Cuánta agua, en escala ordinal de menos a más. Que sea ordinal es lo que deja
 * dibujarla como barrita; un enum sobre dos ejes mezclados no se podría.
 */
export const REGIMENES_RIEGO = ['escaso', 'espaciado', 'parejo', 'constante'] as const
export type RegimenRiego = (typeof REGIMENES_RIEGO)[number]

/**
 * Cada medida puede faltar sola: TAMU publica litros sin profundidad y UC
 * publica profundidad sin litros.
 */
export interface MacetaMedidas {
  profundidad_min_cm: number | null
  litros_min: number | null
  plantas_por_contenedor: number | null
}

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

/**
 * Las prácticas de manejo que la app sabe nombrar. Vocabulario cerrado: cada
 * tipo tiene su explicación en el glosario, así que uno nuevo acá sin su
 * entrada allá dejaría una etiqueta que no se puede consultar. El build valida
 * esta misma lista (`scripts/build-enriched.mjs`).
 */
export type TipoCuidado =
  | 'raleo'
  | 'aporque'
  | 'tutorado'
  | 'poda'
  | 'mulch'
  | 'blanqueo'
  | 'riego'
  | 'abonado'
  | 'desmalezar'
  | 'rotacion'
  | 'polinizacion'
  | 'proteger'
  | 'contener'
  | 'dividir'

/**
 * Algo para hacer entre la siembra y la cosecha.
 *
 * No trae fuentes propias: **hereda** las del campo de la fuente del que sale
 * (`de`). Es la regla de no inventar hecha mecánica — un cuidado que no se
 * apoye en algo que ya dijo una fuente investigada rompe el build.
 */
export interface Cuidado {
  tipo: TipoCuidado
  /** en qué momento del ciclo toca */
  cuando: string
  que_hacer: string
  /** la consecuencia, solo cuando la fuente la dice */
  por_que: string | null
  /** el campo de la especie del que sale */
  de: string
  fuentes: Fuente[]
  confianza: number
}

/**
 * Por qué una semilla puede no estar germinando, cuando la respuesta **depende
 * de la especie**: que el berro necesita luz, que la zanahoria tarda veinte
 * días, que la melisa germina al 30 % de fábrica.
 */
export type TipoPista =
  | 'profundidad'
  | 'luz'
  | 'humedad'
  | 'pretratamiento'
  | 'paciencia'
  | 'varias'
  | 'poder'
  | 'latencia'
  | 'vegetativo'

/** Igual que `Cuidado`: hereda las fuentes del campo del que sale. */
export interface PistaGerminacion {
  tipo: TipoPista
  texto: string
  de: string
  fuentes: Fuente[]
  confianza: number
}

/**
 * Lo que el padre necesita saber de una variedad para dibujar su tarjeta sin
 * cargar la derivada entera.
 */
export interface VariedadRef {
  slug: string
  /** el nombre corto, como lo escribe la fuente: "Temprana", "De enrame" */
  nombre: string
  nombre_comun: string
  /** los campos en los que difiere, listos para mostrar */
  cambia: { campo: string; valor: string; confianza: number }[]
  /** los cuidados del padre que esta variedad no lleva */
  quita: TipoCuidado[]
  derivacion: string
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
  /** `regimen` null con `riego` presente es legítimo: hay prosa que no mapea. */
  riego: (Dato & { regimen: RegimenRiego | null }) | null
  maceta: (Dato & { medidas: MacetaMedidas }) | null
  germinacion: Dato
  longevidad: Dato
  trucos: Dato
  riesgos: Dato
  plagas: Dato
  asociaciones_buenas: Dato
  asociaciones_malas: Dato
  calendario: Calendario
  temperaturas: Temperaturas
  cuidados: Cuidado[]
  germinacion_pistas: PistaGerminacion[]
  dias_a_trasplante: Rango | null
  dias_a_cosecha: Rango | null
  dias_germinacion: Rango | null
  asociaciones: { buenas: AsocRef[]; malas: AsocRef[] }
  /** slug del padre; null en las 55 especies propiamente dichas */
  variedad_de: string | null
  /** el nombre de la variedad ("Temprana"); null si no lo es */
  variedad: string | null
  /** por qué difiere del padre. Es razonamiento, no cita: por eso no va en un `valor` */
  variedad_derivacion: string | null
  /** las variedades de esta especie; vacío en las derivadas */
  variedades: VariedadRef[]
}

export interface CategoriaInfo {
  emoji: string
  nombre: string
  desc: string
}

export interface ClimaDecada {
  media: number
  max: number
  min: number
  /** probabilidad (0-1) de que la década caiga dentro de la temporada de heladas */
  helada: number
}

export interface EspeciesDB {
  meta: {
    enriquecido: {
      zonas: Record<Zona, { etiqueta: string; detalle: string; estacion: string; ultima_helada: string }>
      zona_default: Zona
      /** 36 décadas por zona, para diagnosticar sin recalcular el modelo */
      clima: Record<Zona, ClimaDecada[]>
      [k: string]: unknown
    }
    [k: string]: unknown
  }
  categorias_suelo: Record<CategoriaSuelo, CategoriaInfo>
  categorias_luz: Record<CategoriaLuz, CategoriaInfo>
  especies: EspecieEnriquecida[]
}

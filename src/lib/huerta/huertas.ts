import type { Zona } from '../data/types'
import type { UbicacionClima } from '../pronostico/tipos'
import type { Huerta } from './tipos'

// Lo que vale para cualquier huerta, sin tocar la base. Los registros de antes
// de que hubiera varias no tienen `huertaId`: son de la principal, y así se
// quedan. Reescribirlos sería una migración que no hace falta.

export const HUERTA_PRINCIPAL = 'principal'

export const huertaDe = (x: { huertaId?: string }): string => x.huertaId ?? HUERTA_PRINCIPAL

export const deLaHuerta = <T extends { huertaId?: string }>(lista: T[], id: string): T[] =>
  lista.filter((x) => huertaDe(x) === id)

/** La huerta que ya tenía quien usaba la app antes de que hubiera varias. */
export function huertaPrincipalDesde(zona: Zona, ubicacionClima?: UbicacionClima, creada = '2025-01-01'): Huerta {
  return {
    id: HUERTA_PRINCIPAL,
    nombre: 'Mi huerta',
    zona,
    ...(ubicacionClima ? { ubicacionClima } : {}),
    creada,
  }
}

/** La guardada si todavía existe; si no, la primera. `huertas` nunca viene vacía. */
export function resolverActiva(huertas: Huerta[], idGuardado?: string): Huerta {
  return huertas.find((h) => h.id === idGuardado) ?? huertas[0]
}

/** La última no se borra: sin huerta no hay zona ni calendario. */
export const puedeBorrar = (huertas: Huerta[]): boolean => huertas.length > 1

/**
 * El id de la helada lleva la huerta, salvo en la principal: así lo que ya se
 * marcó como hecho antes de que hubiera varias sigue valiendo.
 */
export const ambitoDe = (h: Huerta): string | undefined => (h.id === HUERTA_PRINCIPAL ? undefined : h.id)

const cuantas = (n: number, uno: string, varios: string) => `${n} ${n === 1 ? uno : varios}`

/** Lo que se pierde, con los números: «se borra todo» solo no alcanza para decidir. */
export function textoBorrarHuerta(
  nombre: string,
  { plantas, lugares, composteras }: { plantas: number; lugares: number; composteras: number },
): string {
  const partes = [
    plantas && cuantas(plantas, 'planta con su diario', 'plantas con su diario'),
    lugares && cuantas(lugares, 'lugar', 'lugares'),
    composteras && cuantas(composteras, 'compostera', 'composteras'),
  ].filter(Boolean) as string[]
  const solo = partes.length === 1 && plantas + lugares + composteras === 1
  const que = partes.length
    ? `${solo ? 'Se borra' : 'Se borran'} ${partes.length > 1 ? `${partes.slice(0, -1).join(', ')} y ${partes.at(-1)}` : partes[0]}.`
    : 'No tiene nada cargado.'
  return `¿Borrar «${nombre}»? ${que} No se puede deshacer.`
}

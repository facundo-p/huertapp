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

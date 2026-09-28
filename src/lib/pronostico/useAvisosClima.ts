import { useMemo } from 'react'
import type { EspecieEnriquecida } from '../data/types'
import type { Planta } from '../huerta/tipos'
import { expuestasAHelada } from '../tareas/engine'
import { derivarAvisos, frescura, recortarPasados } from './derivar'
import { usePronostico } from './store'

/**
 * El pronóstico vigente y lo que avisa. Lo leen Esta semana y el croquis: si
 * cada una lo derivara por su lado, una diría que hiela y la otra no.
 */
export function useAvisosClima(
  plantas: Planta[],
  porSlug: Map<string, EspecieEnriquecida> | undefined,
  hoy: string,
  ahoraISO: string,
) {
  const estado = usePronostico()
  const pron = estado.pronostico
  const fresc = pron ? frescura(pron, ahoraISO) : null
  // sin ubicación o vencido, la semana sigue: solo pierde el cielo
  const dias = useMemo(
    () => (estado.ubicacion && pron && fresc !== 'vencido' ? recortarPasados(pron, hoy) : []),
    [estado.ubicacion, pron, fresc, hoy],
  )
  const avisos = useMemo(() => {
    if (!pron || dias.length === 0) return []
    // dos tandas de lechuga son una lechuga en el aviso
    const nombres = porSlug
      ? [
          ...new Set(
            expuestasAHelada(plantas, porSlug).map((pl) =>
              (pl.apodo || porSlug.get(pl.slug)!.nombre_comun).toLowerCase(),
            ),
          ),
        ].slice(0, 3)
      : []
    return derivarAvisos(pron, hoy, nombres)
  }, [pron, dias, porSlug, plantas, hoy])

  return { estado, pron, fresc, dias, avisos }
}

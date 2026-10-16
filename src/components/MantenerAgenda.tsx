import { useEffect } from 'react'
import { useEspecies } from '../lib/useEspecies'
import { useHuerta } from '../lib/huerta/store'
import { ambitoDe, deLaHuerta } from '../lib/huerta/huertas'
import { useEstadoTareas, podar } from '../lib/tareas/estado'
import { construirAgenda, unirAgendas } from '../lib/tareas/agenda'
import { guardarAgenda } from '../lib/avisos'
import { hoyISO } from '../lib/huerta/tipos'
import { useCompostaje } from '../lib/compostaje'

/**
 * No dibuja nada: mantiene escrita la agenda de avisos para que el service
 * worker la encuentre cuando despierte, y poda el estado de tareas viejo.
 *
 * Vive en el layout con tabs porque esas cuatro pantallas ya cargan el catálogo
 * de especies: acá no cuesta nada. Se recalcula siempre, aunque los avisos
 * estén apagados, así prenderlos en Ajustes tiene efecto en el acto.
 */
export function MantenerAgenda() {
  const { indice } = useEspecies()
  const { huertas, todas, cargado } = useHuerta()
  const guia = useCompostaje()
  const estado = useEstadoTareas()

  useEffect(() => {
    if (!indice || !cargado) return
    // todas y no solo la activa: el aviso de la otra huerta también llega
    const hoy = hoyISO()
    const agenda = unirAgendas(
      huertas.map((h) => ({
        nombre: h.nombre,
        avisos: construirAgenda(
          {
            plantas: deLaHuerta(todas.plantas, h.id),
            composteras: deLaHuerta(todas.composteras, h.id),
            porSlug: indice.porSlug,
            clima: indice.db.meta.enriquecido.clima[h.zona],
            guia,
            ambito: ambitoDe(h),
          },
          estado,
          hoy,
        ),
      })),
    )
    void guardarAgenda(agenda)
  }, [indice, cargado, huertas, todas, guia, estado])

  useEffect(() => {
    void podar()
  }, [])

  return null
}

import { useEffect } from 'react'
import { useEspecies } from '../lib/useEspecies'
import { useZona } from '../lib/zona'
import { useHuerta } from '../lib/huerta/store'
import { useEstadoTareas, podar } from '../lib/tareas/estado'
import { construirAgenda } from '../lib/tareas/agenda'
import { guardarAgenda } from '../lib/avisos'
import { hoyISO } from '../lib/huerta/tipos'

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
  const zona = useZona()
  const { plantas, cargado } = useHuerta()
  const estado = useEstadoTareas()

  useEffect(() => {
    if (!indice || !cargado) return
    const clima = indice.db.meta.enriquecido.clima[zona]
    const agenda = construirAgenda(
      { plantas, porSlug: indice.porSlug, clima },
      estado,
      hoyISO(),
    )
    void guardarAgenda(agenda)
  }, [indice, cargado, plantas, zona, estado])

  useEffect(() => {
    void podar()
  }, [])

  return null
}

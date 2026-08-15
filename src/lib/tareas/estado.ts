import { useSyncExternalStore } from 'react'
import * as db from '../huerta/db'
import { hoyISO } from '../huerta/tipos'
import { sumarDias } from '../huerta/estimar'
import { ESTADO_VACIO, type EstadoTarea } from './engine'

// Qué tareas completaste o pospusiste. Vive en el store de ajustes de
// IndexedDB, así entra al backup junto con el resto.

const CLAVE = 'tareas-estado'

let estado: EstadoTarea = ESTADO_VACIO
let cargado = false
const oyentes = new Set<() => void>()

function emitir(nuevo: EstadoTarea) {
  estado = nuevo
  for (const f of oyentes) f()
}

async function cargar() {
  const guardado = await db.leerAjuste<EstadoTarea>(CLAVE)
  cargado = true
  emitir(guardado ?? ESTADO_VACIO)
}

let arranque: Promise<void> | null = null
function suscribir(f: () => void) {
  oyentes.add(f)
  arranque ??= cargar()
  return () => oyentes.delete(f)
}

export function useEstadoTareas(): EstadoTarea {
  return useSyncExternalStore(
    suscribir,
    () => estado,
    () => ESTADO_VACIO,
  )
}

export const tareasCargadas = () => cargado

async function guardar(nuevo: EstadoTarea) {
  emitir(nuevo)
  await db.guardarAjuste(CLAVE, nuevo)
}

export async function completar(id: string) {
  await guardar({ ...estado, completadas: { ...estado.completadas, [id]: hoyISO() } })
}

export async function descompletar(id: string) {
  const { [id]: _, ...resto } = estado.completadas
  await guardar({ ...estado, completadas: resto })
}

/** Posponer esconde la tarea unos días; después vuelve sola. */
export async function posponer(id: string, dias = 3) {
  await guardar({ ...estado, pospuestas: { ...estado.pospuestas, [id]: sumarDias(hoyISO(), dias) } })
}

/**
 * Limpia lo completado hace más de 60 días. Sin esto el objeto crece para
 * siempre con ids de plantas que ya no existen.
 */
export async function podar() {
  const limite = sumarDias(hoyISO(), -60)
  const completadas = Object.fromEntries(
    Object.entries(estado.completadas).filter(([, fecha]) => fecha >= limite),
  )
  const pospuestas = Object.fromEntries(
    Object.entries(estado.pospuestas).filter(([, fecha]) => fecha >= limite),
  )
  await guardar({ completadas, pospuestas })
}

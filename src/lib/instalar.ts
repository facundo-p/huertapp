import { useSyncExternalStore } from 'react'
import { esIOS, estaInstalada } from './avisos'

/**
 * Instalación de la app en la pantalla de inicio.
 *
 * Instalar no es un detalle acá: es lo que hace que la app abra sin barra de
 * navegador, que el navegador no le vacíe el almacenamiento tan fácil, y —en
 * Android— lo único que habilita los avisos con la app cerrada.
 *
 * El navegador no da una API para pedirlo cuando uno quiere: dispara
 * `beforeinstallprompt` cuando se le canta, y ese evento hay que **guardarlo**
 * para usarlo después. Si no se captura ni bien pasa, se pierde. Por eso esto
 * se engancha en el arranque y no en la pantalla de Ajustes.
 *
 * Safari no lo implementa: en iPhone la instalación es a mano, por el botón de
 * compartir. Ahí lo único que se puede hacer es explicarlo bien.
 */

interface EventoInstalacion extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export type ComoInstalar = 'boton' | 'ios-manual' | 'menu-navegador' | 'ya-esta'

let guardado: EventoInstalacion | null = null
let instalada = false
const oyentes = new Set<() => void>()
const emitir = () => oyentes.forEach((f) => f())

export function escucharInstalacion() {
  instalada = estaInstalada()

  window.addEventListener('beforeinstallprompt', (e) => {
    // sin esto el navegador muestra su propio cartel, que aparece cuando él
    // quiere y encima tapa la app
    e.preventDefault()
    guardado = e as EventoInstalacion
    emitir()
  })

  window.addEventListener('appinstalled', () => {
    guardado = null
    instalada = true
    emitir()
  })
}

export function useComoInstalar(): ComoInstalar {
  return useSyncExternalStore(
    (f) => {
      oyentes.add(f)
      return () => oyentes.delete(f)
    },
    () => calcular(),
    () => 'menu-navegador' as ComoInstalar,
  )
}

let ultimo: ComoInstalar = 'menu-navegador'
function calcular(): ComoInstalar {
  const valor: ComoInstalar = instalada
    ? 'ya-esta'
    : guardado
      ? 'boton'
      : esIOS()
        ? 'ios-manual'
        : 'menu-navegador'
  // useSyncExternalStore compara por identidad; con strings no hay problema,
  // pero se cachea igual para no recalcular matchMedia en cada render
  if (valor !== ultimo) ultimo = valor
  return ultimo
}

/** Abre el diálogo del sistema. Devuelve si aceptó. */
export async function instalar(): Promise<boolean> {
  if (!guardado) return false
  await guardado.prompt()
  const { outcome } = await guardado.userChoice
  // el evento es de un solo uso: si lo rechazan, el navegador vuelve a
  // dispararlo más adelante por su cuenta
  guardado = null
  emitir()
  return outcome === 'accepted'
}

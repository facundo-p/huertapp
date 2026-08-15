import { useSyncExternalStore } from 'react'

/**
 * Registro del service worker y el ciclo de actualización.
 *
 * La regla que ordena todo esto: **nunca actualizar sin avisar**. El service
 * worker nuevo se instala en silencio y se queda esperando; recién cuando la
 * persona toca "Actualizar" se le da paso y se recarga. Recargar solo, mientras
 * alguien está escribiendo una entrada del diario, le come lo que escribió.
 */

export type EstadoPWA = {
  /** hay una versión nueva instalada esperando */
  hayUpdate: boolean
  /** el precache terminó: la app ya funciona sin internet */
  listaOffline: boolean
}

let estado: EstadoPWA = { hayUpdate: false, listaOffline: false }
const oyentes = new Set<() => void>()
let registro: ServiceWorkerRegistration | null = null

function emitir(parche: Partial<EstadoPWA>) {
  estado = { ...estado, ...parche }
  for (const f of oyentes) f()
}

export function usePWA(): EstadoPWA {
  return useSyncExternalStore(
    (f) => {
      oyentes.add(f)
      return () => oyentes.delete(f)
    },
    () => estado,
    () => estado,
  )
}

/** Le da paso a la versión que está esperando. La recarga viene después sola. */
export function aplicarUpdate() {
  registro?.waiting?.postMessage('actualizar-ya')
}

export function registrarSW() {
  if (!('serviceWorker' in navigator)) return

  // Una sola recarga: sin esto, si el usuario toca "Actualizar" dos veces o el
  // navegador dispara controllerchange de más, la app entra en bucle de reload.
  let recargando = false
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (recargando) return
    recargando = true
    location.reload()
  })

  window.addEventListener('load', () => {
    void (async () => {
      try {
        // updateViaCache 'none': el navegador cachea el sw.js hasta 24 h por
        // defecto, y eso demora un día en llegar cualquier arreglo.
        const reg = await navigator.serviceWorker.register('./sw.js', { updateViaCache: 'none' })
        registro = reg

        if (reg.waiting && navigator.serviceWorker.controller) emitir({ hayUpdate: true })
        if (navigator.serviceWorker.controller) emitir({ listaOffline: true })

        reg.addEventListener('updatefound', () => {
          const nuevo = reg.installing
          nuevo?.addEventListener('statechange', () => {
            if (nuevo.state !== 'installed') return
            // con controller ya había una versión: esto es un update.
            // sin controller es la primera instalación: la app quedó offline-ready.
            if (navigator.serviceWorker.controller) emitir({ hayUpdate: true })
            else emitir({ listaOffline: true })
          })
        })

        // Buscar versión nueva al volver a la app: una PWA instalada puede
        // pasar semanas sin recargarse del todo. Con techo de una vez por hora,
        // porque en el celular esto se dispara cada vez que cambiás de app y
        // no hace falta consultar la red veinte veces por tarde.
        let ultimaBusqueda = Date.now()
        document.addEventListener('visibilitychange', () => {
          if (document.visibilityState !== 'visible') return
          if (Date.now() - ultimaBusqueda < 60 * 60 * 1000) return
          ultimaBusqueda = Date.now()
          void reg.update()
        })
      } catch {
        // sin service worker la app sigue andando, solo que sin offline
      }
    })()
  })
}

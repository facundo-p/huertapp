import * as db from './huerta/db'
import type { Aviso } from './tareas/agenda'

/**
 * Notificaciones locales, opt-in y sin servidor.
 *
 * **Lo que la app NO hace: depender de esto.** La pantalla Hoy muestra siempre
 * lo pendiente al abrir. Las notificaciones son un extra que anda donde anda:
 *
 * - **Android + Chrome, con la app instalada**: funciona vía Periodic Background
 *   Sync. El navegador decide cuándo despertar el service worker (más o menos
 *   una vez por día, según cuánto uses la app); no hay forma de pedir una hora
 *   exacta sin un servidor que mande push.
 * - **iPhone**: no. iOS no implementa Periodic Background Sync, así que una PWA
 *   instalada no puede despertarse sola. Sí puede mostrar notificaciones
 *   mientras está abierta, que no sirve de nada. Se dice en Ajustes tal cual.
 * - **Escritorio**: igual que Android si el navegador es Chrome/Edge.
 */

const TAG = 'revisar-huerta'
const CLAVE_AGENDA = 'avisos-agenda'
const CLAVE_ULTIMO = 'avisos-ultimo'
const CLAVE_ACTIVO = 'avisos-activo'

export interface EstadoAvisos {
  /** el navegador tiene Notification API */
  soportado: boolean
  permiso: NotificationPermission
  /** puede despertarse solo (Periodic Background Sync) */
  puedeDespertar: boolean
  /** la app está corriendo instalada, no en una pestaña */
  instalada: boolean
  /** el usuario los prendió desde Ajustes */
  activo: boolean
}

export const esIOS = () =>
  /iPad|iPhone|iPod/.test(navigator.userAgent) ||
  // iPadOS se hace pasar por Mac desde 2020; el touch lo delata
  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)

export const estaInstalada = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  // iOS usa su propia bandera, no el display-mode del manifest
  (navigator as { standalone?: boolean }).standalone === true

/**
 * El permiso, leído por la Permissions API en vez de `Notification.permission`.
 *
 * Dicen lo mismo, pero esta es **observable**: cuando el permiso está bloqueado
 * la app manda a arreglarlo a los ajustes del navegador, y al volver la
 * pantalla tiene que estar al día sin recargar. Con la propiedad estática,
 * quedaría mostrando "los bloqueaste" para siempre.
 */
async function permisoActual(): Promise<NotificationPermission> {
  try {
    const estado = await navigator.permissions.query({ name: 'notifications' as PermissionName })
    return estado.state === 'prompt' ? 'default' : (estado.state as NotificationPermission)
  } catch {
    return Notification.permission
  }
}

/** Avisa cuando el permiso cambia por fuera de la app. Devuelve cómo desuscribirse. */
export function alCambiarPermiso(cb: () => void): () => void {
  let estado: PermissionStatus | null = null
  void navigator.permissions
    ?.query({ name: 'notifications' as PermissionName })
    .then((s) => {
      estado = s
      s.addEventListener('change', cb)
    })
    .catch(() => {})
  return () => estado?.removeEventListener('change', cb)
}

export async function estadoAvisos(): Promise<EstadoAvisos> {
  const soportado = 'Notification' in window && 'serviceWorker' in navigator
  let puedeDespertar = false
  if (soportado) {
    try {
      const reg = await navigator.serviceWorker.getRegistration()
      puedeDespertar = !!reg && 'periodicSync' in reg
    } catch {
      puedeDespertar = false
    }
  }
  return {
    soportado,
    permiso: soportado ? await permisoActual() : 'denied',
    puedeDespertar,
    instalada: estaInstalada(),
    activo: (await db.leerAjuste<boolean>(CLAVE_ACTIVO)) ?? false,
  }
}

/** Pide permiso y, si se puede, engancha el despertador. Devuelve el estado nuevo. */
export async function activarAvisos(): Promise<EstadoAvisos> {
  if ('Notification' in window && (await permisoActual()) === 'default') {
    await Notification.requestPermission()
  }
  if ((await permisoActual()) === 'granted') {
    await db.guardarAjuste(CLAVE_ACTIVO, true)
    await registrarDespertador()
  }
  return estadoAvisos()
}

export async function desactivarAvisos(): Promise<EstadoAvisos> {
  await db.guardarAjuste(CLAVE_ACTIVO, false)
  try {
    const reg = await navigator.serviceWorker.getRegistration()
    await sync(reg)?.unregister(TAG)
  } catch {
    // el permiso del navegador no se puede revocar desde acá: eso va en Ajustes
    // del sistema. Lo que sí podemos es dejar de mirar la agenda.
  }
  return estadoAvisos()
}

async function registrarDespertador() {
  try {
    const reg = await navigator.serviceWorker.ready
    // 12 h es un piso, no una promesa: el navegador dispara cuando quiere
    await sync(reg)?.register(TAG, { minInterval: 12 * 60 * 60 * 1000 })
  } catch {
    // sin periodicSync (iOS, Firefox, o app no instalada) los avisos quedan
    // en "solo mientras la app esté abierta". Se dice en la UI.
  }
}

interface PeriodicSync {
  register(tag: string, opciones?: { minInterval: number }): Promise<void>
  unregister(tag: string): Promise<void>
}
/** `periodicSync` todavía no está en los tipos del DOM. */
const sync = (reg: ServiceWorkerRegistration | undefined) =>
  (reg as unknown as { periodicSync?: PeriodicSync } | undefined)?.periodicSync

/**
 * Notificación de prueba, ya. Sin esto la función es un interruptor que no se
 * sabe si hace algo: te enterarías dentro de tres días, o nunca.
 */
export async function probarAviso() {
  const reg = await navigator.serviceWorker.ready
  await reg.showNotification('Así se ven los avisos', {
    body: 'Cuando algo de tu huerta pida atención, te va a llegar así.',
    icon: './icono-192.png',
    badge: './icono-192.png',
    lang: 'es-AR',
    tag: 'huerta-prueba',
    data: { url: './#/hoy' },
  })
}

/** Deja la agenda escrita para que el service worker la lea cuando despierte. */
export async function guardarAgenda(avisos: Aviso[]) {
  await db.guardarAjuste(CLAVE_AGENDA, avisos)
}

export const leerAgenda = () => db.leerAjuste<Aviso[]>(CLAVE_AGENDA)
export const leerUltimoAviso = () => db.leerAjuste<string>(CLAVE_ULTIMO)

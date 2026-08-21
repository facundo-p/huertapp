/* eslint-disable no-undef */
/**
 * Service worker de Huerta GBA. Es una plantilla: `scripts/plugin-sw.mjs`
 * completa los dos marcadores de abajo (la versión y la lista de archivos) y
 * escribe el resultado en dist/sw.js.
 *
 * Está escrito a mano en vez de usar Workbox porque el caso es simple y el
 * costo de entenderlo entero es menor que el de una dependencia opaca: la app
 * es 100 % estática, los assets llevan hash en el nombre y no hay API que
 * consultar. Toda la estrategia son tres decisiones:
 *
 * 1. **Precache total en install.** Después de la primera visita la app entra
 *    completa —incluidas las 55 especies— y funciona sin internet. Es el
 *    requisito del brief, no una optimización.
 * 2. **Cache primero, sin ir a la red.** Los assets llevan hash: si el nombre
 *    coincide, el contenido es el mismo. Consultar la red sería gastar batería
 *    para confirmar lo que ya sabemos.
 * 3. **La versión nueva NO se activa sola.** Espera a que la persona toque
 *    "Actualizar". Cambiar el código bajo los pies de alguien que está cargando
 *    una planta es la forma más rápida de perderle datos.
 */

const VERSION = '__VERSION__'
const CACHE = `huerta-${VERSION}`
const PRECACHE = __PRECACHE__
const INDEX = './index.html'

/**
 * `ignoreVary` no es opcional acá, aunque lo parezca.
 *
 * Muchos servidores estáticos responden `Vary: Origin` (vite preview lo hace, y
 * varios hostings también). Vite marca sus scripts y hojas de estilo con
 * `crossorigin`, así que el navegador los pide en modo CORS y manda el header
 * `Origin`. El precache, en cambio, los guardó con un pedido que no lo lleva:
 * para el algoritmo de match son representaciones distintas, no coinciden, y la
 * app se cae a la red. Offline eso es una pantalla en blanco.
 *
 * Ignorar Vary es seguro precisamente en este caso: los assets llevan hash en
 * el nombre, así que una URL corresponde a un contenido y a uno solo. No hay
 * negociación posible que perderse.
 */
const MATCH = { ignoreSearch: true, ignoreVary: true }

self.addEventListener('install', (e) => {
  // sin skipWaiting: la versión nueva se queda esperando (ver punto 3)
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)))
})

self.addEventListener('activate', (e) => {
  e.waitUntil(
    (async () => {
      // una sola caché viva: al activar, las viejas se van enteras
      const viejas = (await caches.keys()).filter((k) => k !== CACHE)
      await Promise.all(viejas.map((k) => caches.delete(k)))
      await self.clients.claim()
    })(),
  )
})

self.addEventListener('message', (e) => {
  if (e.data === 'actualizar-ya') self.skipWaiting()
})

self.addEventListener('fetch', (e) => {
  const req = e.request
  if (req.method !== 'GET') return
  if (new URL(req.url).origin !== self.location.origin) return

  // Navegación: siempre el index cacheado. La app es una SPA con hash router,
  // así que cualquier URL de la app es el mismo documento.
  if (req.mode === 'navigate') {
    e.respondWith(caches.match(INDEX, MATCH).then((r) => r ?? fetch(req)))
    return
  }

  e.respondWith(caches.match(req, MATCH).then((r) => r ?? fetch(req)))
})

/* ============================================================
   Avisos: el service worker solo entrega, no decide
   ============================================================
   La app calcula la agenda con el motor de tareas y la deja escrita en
   IndexedDB. Acá solo se mira si hay algo para hoy. Duplicar el motor —que
   necesita las 55 especies y el modelo climático— sería tener dos fuentes de
   verdad; y la que corre en background siempre sería la desactualizada. */

const DB = 'huerta-gba'
const CLAVE_AGENDA = 'avisos-agenda'
const CLAVE_ULTIMO = 'avisos-ultimo'

function abrirDB() {
  return new Promise((resolver) => {
    // Sin versión: abre la que exista. Y si NO existe, `open` la crearía —en
    // versión 1 y sin un solo object store—, que es la peor cosa que puede
    // hacer este archivo: la app abre con `openDB(nombre, 1, {upgrade})`, ve
    // que la versión 1 ya existe, no dispara su upgrade nunca, y se queda con
    // una base que no puede leer ni escribir. Pasó en la 1.1.0 y le costó los
    // datos a una persona.
    //
    // Abortar la transacción de upgrade deja la base sin crear. El avisito de
    // hoy no vale ni de lejos lo que vale no romperle el almacenamiento a
    // nadie: si no hay base, no hay agenda, y no pasa nada.
    const pedido = indexedDB.open(DB)
    pedido.onupgradeneeded = () => pedido.transaction.abort()
    pedido.onsuccess = () => resolver(pedido.result)
    pedido.onerror = () => resolver(null)
  })
}

function ajuste(db, clave, valor) {
  return new Promise((resolver, rechazar) => {
    if (!db.objectStoreNames.contains('ajustes')) return resolver(undefined)
    const modo = valor === undefined ? 'readonly' : 'readwrite'
    const tx = db.transaction('ajustes', modo)
    const store = tx.objectStore('ajustes')
    const pedido = valor === undefined ? store.get(clave) : store.put(valor, clave)
    pedido.onsuccess = () => resolver(pedido.result)
    pedido.onerror = () => rechazar(pedido.error)
  })
}

function hoyISO() {
  const d = new Date()
  const p = (n) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`
}

async function revisarAgenda() {
  const permiso = self.Notification?.permission
  if (permiso !== 'granted') return

  // null = la base todavía no existe y no la vamos a crear nosotros
  const db = await abrirDB()
  if (!db) return

  const agenda = (await ajuste(db, CLAVE_AGENDA)) ?? []
  const ultimo = (await ajuste(db, CLAVE_ULTIMO)) ?? ''
  const hoy = hoyISO()

  // la entrada más reciente que ya venció y que todavía no se avisó
  const vencidas = agenda.filter((a) => a.fecha <= hoy && a.fecha > ultimo)
  const aviso = vencidas[vencidas.length - 1]
  if (!aviso) return

  await ajuste(db, CLAVE_ULTIMO, aviso.fecha)
  await self.registration.showNotification(aviso.titulo, {
    body: aviso.cuerpo,
    icon: './icono-192.png',
    badge: './icono-192.png',
    lang: 'es-AR',
    tag: 'huerta-hoy', // una sola notificación viva: la nueva reemplaza la vieja
    data: { url: './#/hoy' },
  })
}

self.addEventListener('periodicsync', (e) => {
  if (e.tag === 'revisar-huerta') e.waitUntil(revisarAgenda())
})

self.addEventListener('notificationclick', (e) => {
  e.notification.close()
  const destino = e.notification.data?.url ?? './#/hoy'
  e.waitUntil(
    (async () => {
      const abiertas = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      // si la app ya está abierta, se le da foco en vez de abrir otra pestaña
      for (const c of abiertas) {
        if ('focus' in c) {
          await c.focus()
          if ('navigate' in c) await c.navigate(new URL(destino, self.location.href).href)
          return
        }
      }
      await self.clients.openWindow(new URL(destino, self.location.href).href)
    })(),
  )
})

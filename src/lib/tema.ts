import { useSyncExternalStore } from 'react'

// Día o noche. Mismo diseño, distintos colores: lo único que hace este módulo
// es poner `data-tema` en <html>, y los dos bloques de tokens de theme.css se
// encargan del resto. Ningún componente pregunta por el tema.
//
// Vive en localStorage y NO entra al backup, por la misma razón que el plegado
// de Mi huerta: es una preferencia de este aparato. Restaurar un backup del
// celular no tiene por qué venir a decidir con qué tema mirás la tablet.

const CLAVE = 'huerta-gba:tema'

/** Lo que la persona eligió. `auto` sigue al sistema. */
export type Preferencia = 'auto' | 'dia' | 'noche'
/** El tema que termina aplicándose. */
export type Tema = 'dia' | 'noche'

export const PREFERENCIA_DEFAULT: Preferencia = 'auto'

export const TEMAS_INFO: Record<Preferencia, { etiqueta: string; detalle: string }> = {
  auto: {
    etiqueta: 'Automático',
    detalle: 'Sigue lo que tengas puesto en el teléfono',
  },
  dia: {
    etiqueta: 'Día',
    detalle: 'Papel claro, como una libreta al sol',
  },
  noche: {
    etiqueta: 'Noche',
    detalle: 'Tierra oscura, para no encandilarte',
  },
}

/** El color de la barra del sistema, por tema. Es `--papel` de cada bloque. */
const BARRA: Record<Tema, string> = { dia: '#f7f3e7', noche: '#1f2a1c' }

function esPreferencia(v: string | null): v is Preferencia {
  return v === 'auto' || v === 'dia' || v === 'noche'
}

function leer(): Preferencia {
  try {
    const v = localStorage.getItem(CLAVE)
    return esPreferencia(v) ? v : PREFERENCIA_DEFAULT
  } catch {
    return PREFERENCIA_DEFAULT // modo privado o storage bloqueado
  }
}

function consulta(): MediaQueryList | null {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)')
  } catch {
    return null
  }
}

export function resolver(p: Preferencia): Tema {
  if (p !== 'auto') return p
  return consulta()?.matches ? 'noche' : 'dia'
}

let actual: Preferencia = leer()
const oyentes = new Set<() => void>()

export function preferenciaActual(): Preferencia {
  return actual
}

export function temaActual(): Tema {
  return resolver(actual)
}

/**
 * Pinta el tema. Se llama también desde el script de `index.html` antes del
 * primer paint: sin eso, abrir en noche arranca con un destello blanco.
 */
export function aplicarTema(t: Tema) {
  document.documentElement.dataset.tema = t
  document.querySelector('meta[name=theme-color]')?.setAttribute('content', BARRA[t])
}

export function elegirTema(p: Preferencia) {
  if (p === actual) return
  actual = p
  try {
    localStorage.setItem(CLAVE, p)
  } catch {
    /* no se puede persistir: la sesión igual funciona */
  }
  aplicarTema(resolver(p))
  for (const f of oyentes) f()
}

function suscribir(f: () => void) {
  oyentes.add(f)
  // En `auto` el tema puede cambiar sin que nadie toque nada: el sistema pasa
  // a oscuro solo al anochecer. Hay que repintar cuando eso pasa.
  const mq = consulta()
  const alCambiar = () => {
    if (actual === 'auto') aplicarTema(resolver('auto'))
    f()
  }
  mq?.addEventListener('change', alCambiar)
  return () => {
    oyentes.delete(f)
    mq?.removeEventListener('change', alCambiar)
  }
}

export function usePreferenciaTema(): Preferencia {
  return useSyncExternalStore(suscribir, preferenciaActual, () => PREFERENCIA_DEFAULT)
}

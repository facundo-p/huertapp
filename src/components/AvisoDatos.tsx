import { useHuerta, reintentarCarga, sinRomper } from '../lib/huerta/store'
import { IconoAlerta } from '../icons'
import './AvisoDatos.css'

/**
 * Los dos carteles que faltaban: no pudimos leer, y no pudimos guardar.
 *
 * Antes las dos cosas se veían igual que "no tenés nada" y que "el botón no
 * anda". El nombre del error va a la vista porque es lo único que una persona
 * puede copiar y mandarnos — y lo que faltó para diagnosticar la 1.1.0.
 */

/** Cuando el error tiene una salida concreta, se dice cuál. */
function salida(error: string): string | null {
  if (error === 'QuotaExceededError') {
    return 'Parece que no entra más en este aparato. Bajate un backup y borrá fotos que ya no mires.'
  }
  if (error === 'NotFoundError' || error === 'InvalidStateError') {
    return 'La base quedó a medio armar. Cerrá la app del todo y volvé a abrirla: al arrancar se repara sola.'
  }
  return null
}

/** Va en lugar del estado vacío: a quien no le pudimos leer la huerta no se le dice que nunca plantó nada. */
export function NoSePudoLeer({ error }: { error: string }) {
  const comoSeguir = salida(error)
  return (
    <div className="nolei" role="alert">
      <IconoAlerta size={28} />
      <h2 className="nolei__titulo">No pude leer tus datos</h2>
      <p className="nolei__texto">
        Lo que cargaste <strong>sigue guardado en este aparato</strong>: el problema es al abrir la
        base, no tus plantas. Probá de nuevo.
      </p>
      {comoSeguir && <p className="nolei__texto">{comoSeguir}</p>}
      <button className="nolei__boton" onClick={() => sinRomper(reintentarCarga())}>
        Probar de nuevo
      </button>
      <p className="nolei__error">{error}</p>
    </div>
  )
}

/** Banner de escritura fallida. Vive arriba de todo y no se puede pasar por alto. */
export function AvisoEscritura() {
  const { errorEscritura } = useHuerta()
  if (!errorEscritura) return null
  const comoSeguir = salida(errorEscritura)

  return (
    <p className="aviso-guardar" role="alert">
      <IconoAlerta size={17} />
      <span>
        <strong>No se pudo guardar.</strong> {comoSeguir ?? 'Probá de nuevo.'}{' '}
        <span className="aviso-guardar__error">{errorEscritura}</span>
      </span>
    </p>
  )
}

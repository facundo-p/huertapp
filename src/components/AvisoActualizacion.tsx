import { useState } from 'react'
import { aplicarUpdate, usePWA } from '../lib/pwa'
import { IconoSembrar } from '../icons'
import './AvisoActualizacion.css'

/**
 * Aviso de versión nueva. Aparece sobre la tab bar, no como modal: nunca
 * interrumpe lo que estabas haciendo, y se puede ignorar para siempre —la
 * versión vieja sigue funcionando entera, offline incluido.
 */
export function AvisoActualizacion() {
  const { hayUpdate } = usePWA()
  const [descartado, setDescartado] = useState(false)
  const [aplicando, setAplicando] = useState(false)

  if (!hayUpdate || descartado) return null

  return (
    <div className="aviso-update aparecer" role="status">
      <span className="aviso-update__icono" aria-hidden>
        <IconoSembrar size={20} />
      </span>
      <p className="aviso-update__texto">
        Hay una versión nueva.
        <span className="aviso-update__nota">Tus plantas y tu diario quedan como están.</span>
      </p>
      <div className="aviso-update__acciones">
        <button
          className="aviso-update__ahora"
          onClick={() => {
            setAplicando(true)
            aplicarUpdate()
          }}
          disabled={aplicando}
        >
          {aplicando ? 'Yendo…' : 'Actualizar'}
        </button>
        <button className="aviso-update__luego" onClick={() => setDescartado(true)}>
          Después
        </button>
      </div>
    </div>
  )
}

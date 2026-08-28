import { useState } from 'react'
import { BottomSheet } from './BottomSheet'
import { SelectorUbicacion, resolverUbicacion } from './SelectorUbicacion'
import { trasplantarParte, trasplantarTanda, sinRomper } from '../lib/huerta/store'
import { aCantidad, textoCantidad } from '../lib/huerta/tanda'
import { hoyISO, type Planta } from '../lib/huerta/tipos'
import { IconoAlerta } from '../icons'
import './AltaPlanta.css'

// Trasplantar es la misma operación desde el almácigo (avanza etapa) que
// después (solo cambia el lugar): semillero → plantín → bancal son dos pasadas
// por esta hoja. "Una parte" separa esa parte en su propia tarjeta.

interface Props {
  abierto: boolean
  planta: Planta
  nombre: string
  onCerrar: () => void
  /** después de guardar: el diario de la planta cambió */
  onListo?: () => void
}

export function Trasplantar({ abierto, planta, nombre, onCerrar, onListo }: Props) {
  const [parte, setParte] = useState(false)
  const [cuantas, setCuantas] = useState('')
  const [ubicacionId, setUbicacionId] = useState('')
  const [nuevaUbicacion, setNuevaUbicacion] = useState('')
  const [fecha, setFecha] = useState(hoyISO())
  const [guardando, setGuardando] = useState(false)

  const desdeAlmacigo = planta.etapa === 'almacigo'
  const n = aCantidad(cuantas)
  const cero = parte && n === 0
  const sinResto = parte && n != null && n > 0 && planta.cantidad != null && n >= planta.cantidad

  function limpiar() {
    setParte(false)
    setCuantas('')
    setUbicacionId('')
    setNuevaUbicacion('')
    setFecha(hoyISO())
  }

  async function guardar() {
    if (guardando || cero || sinResto) return
    setGuardando(true)
    try {
      const ubi = await resolverUbicacion(ubicacionId, nuevaUbicacion)
      if (parte) await trasplantarParte(planta, { fecha, ubicacionId: ubi, cuantas: n })
      else await trasplantarTanda(planta, { fecha, ubicacionId: ubi })
      limpiar()
      onCerrar()
      onListo?.()
    } finally {
      setGuardando(false)
    }
  }

  const rotuloPie = parte ? 'Listo, las pasé' : desdeAlmacigo ? 'Listo, la trasplanté' : 'Listo, la moví'

  return (
    <BottomSheet
      abierto={abierto}
      onCerrar={() => {
        limpiar()
        onCerrar()
      }}
      titulo={desdeAlmacigo ? 'Trasplantar' : 'Mover'}
      sobretitulo={nombre}
      pie={
        <button
          className="alta__guardar"
          onClick={() => sinRomper(guardar())}
          disabled={guardando || cero || sinResto}
        >
          {guardando ? 'Guardando…' : rotuloPie}
        </button>
      }
    >
      <div className="alta__campo">
        <span className="alta__label">¿Toda la siembra o una parte?</span>
        <div className="alta__metodos">
          <button className={`alta__metodo ${!parte ? 'es-activo' : ''}`} onClick={() => setParte(false)} aria-pressed={!parte}>
            Toda
          </button>
          <button className={`alta__metodo ${parte ? 'es-activo' : ''}`} onClick={() => setParte(true)} aria-pressed={parte}>
            Una parte
          </button>
        </div>
        {parte && (
          <p className="alta__ayuda">La parte que pases va a tener su propia tarjeta; el resto sigue acá.</p>
        )}
      </div>

      {parte && (
        <div className="alta__campo">
          <label className="alta__label" htmlFor="tras-cuantas">
            ¿Cuántas pasás? <span className="alta__opcional">(opcional)</span>
          </label>
          <input
            id="tras-cuantas"
            className="alta__input"
            inputMode="numeric"
            placeholder="4"
            value={cuantas}
            onChange={(ev) => setCuantas(ev.target.value)}
          />
          <p className="alta__ayuda">
            Más o menos, no hace falta contar.
            {planta.cantidad != null && <> Ahora hay {textoCantidad(planta)} acá.</>}
          </p>
        </div>
      )}

      {sinResto && (
        <p className="alta__aviso es-ojo">
          <IconoAlerta size={17} />
          <span>Con eso no queda ninguna acá. Marcá «Toda» y listo.</span>
        </p>
      )}
      {cero && (
        <p className="alta__aviso es-ojo">
          <IconoAlerta size={17} />
          <span>Pasar cero no mueve nada. Escribí cuántas, o dejalo vacío.</span>
        </p>
      )}

      <div className="alta__campo">
        <label className="alta__label" htmlFor="tras-ubi">
          {parte ? '¿A dónde van?' : '¿A dónde va?'}
        </label>
        <SelectorUbicacion
          id="tras-ubi"
          valor={ubicacionId}
          onValor={setUbicacionId}
          nombreNuevo={nuevaUbicacion}
          onNombreNuevo={setNuevaUbicacion}
        />
      </div>

      <div className="alta__campo">
        <label className="alta__label" htmlFor="tras-fecha">
          ¿Cuándo fue?
        </label>
        <input
          id="tras-fecha"
          type="date"
          className="alta__input"
          value={fecha}
          max={hoyISO()}
          onChange={(ev) => setFecha(ev.target.value)}
        />
      </div>
    </BottomSheet>
  )
}

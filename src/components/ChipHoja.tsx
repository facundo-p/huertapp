import { useState } from 'react'
import { BottomSheet } from './BottomSheet'
import type { OpcionChip } from './FilaChips'
import './opciones.css'
import './ChipHoja.css'

interface Props {
  /** lo que dice el chip, siempre: "Grupo", "Suelo", "Luz" */
  etiqueta: string
  opciones: OpcionChip[]
  activo: string | null
  onElegir: (v: string | null) => void
}

/**
 * Un chip que abre una hoja con sus opciones como lista de radios. Es lo que
 * deja los filtros a la vista sin desplegar un panel.
 *
 * El chip no cambia de texto al elegir: los cinco tienen que entrar en una
 * fila y una etiqueta que crece la corre. Qué elegiste se lee en el nombre
 * accesible, en el relleno y en la línea del contador.
 */
export function ChipHoja({ etiqueta, opciones, activo, onElegir }: Props) {
  const [abierta, setAbierta] = useState(false)
  const elegida = opciones.find((o) => o.valor === activo)
  // «Pleno sol: 6 o más horas…» se nombra solo «Pleno sol»; la explicación
  // queda en la hoja
  const corto = elegida ? elegida.etiqueta.split(':')[0] : 'cualquiera'

  return (
    <>
      <button
        type="button"
        className={`chip-hoja ${elegida ? 'es-activo' : ''}`}
        onClick={() => setAbierta(true)}
        aria-haspopup="dialog"
        aria-label={`${etiqueta}: ${corto}`}
      >
        {/* El botón mide 44 para el dedo; la píldora, 32 para el ojo. */}
        <span className="chip-hoja__pildora">{etiqueta}</span>
      </button>

      <BottomSheet abierto={abierta} onCerrar={() => setAbierta(false)} titulo={etiqueta}>
        <div className="opciones" role="radiogroup" aria-label={etiqueta}>
          <Opcion
            elegida={activo === null}
            onClick={() => {
              onElegir(null)
              setAbierta(false)
            }}
            nombre="Cualquiera"
          />
          {opciones.map((o) => (
            <Opcion
              key={o.valor}
              elegida={activo === o.valor}
              onClick={() => {
                onElegir(o.valor)
                setAbierta(false)
              }}
              nombre={o.etiqueta}
              Icono={o.Icono}
              color={o.color}
            />
          ))}
        </div>
      </BottomSheet>
    </>
  )
}

function Opcion({
  elegida,
  onClick,
  nombre,
  Icono,
  color,
}: {
  elegida: boolean
  onClick: () => void
  nombre: string
  Icono?: OpcionChip['Icono']
  color?: string
}) {
  return (
    <button
      type="button"
      className={`opcion ${elegida ? 'es-elegida' : ''}`}
      onClick={onClick}
      role="radio"
      aria-checked={elegida}
    >
      <span className="opcion__marca" aria-hidden />
      <span className="opcion__textos opcion__textos--fila">
        {Icono && (
          <span className="opcion__icono" style={{ color }} aria-hidden>
            <Icono size={20} />
          </span>
        )}
        <span className="opcion__nombre">{nombre}</span>
      </span>
    </button>
  )
}

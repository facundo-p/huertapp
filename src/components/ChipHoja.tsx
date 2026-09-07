import { useState } from 'react'
import { BottomSheet } from './BottomSheet'
import type { OpcionChip } from './FilaChips'
import './opciones.css'
import './ChipHoja.css'

export interface GrupoOpciones {
  etiqueta: string
  opciones: OpcionChip[]
  activo: string | null
  onElegir: (v: string | null) => void
}

/**
 * Un chip que abre una hoja con sus opciones como lista de radios. Es lo que
 * deja los filtros a la vista sin desplegar un panel: el chip dice qué
 * dimensión es y, cuando hay algo elegido, qué.
 *
 * Con más de un grupo (temperatura para germinar y para crecer) la hoja los
 * apila: cinco chips no entran en 340 px, y esos dos son la misma pregunta.
 */
export function ChipHoja({ etiqueta, grupos }: { etiqueta: string; grupos: GrupoOpciones[] }) {
  const [abierta, setAbierta] = useState(false)
  const elegidas = grupos
    .map((g) => g.opciones.find((o) => o.valor === g.activo))
    .filter((o): o is OpcionChip => !!o)
  const activo = elegidas.length > 0
  // «Pleno sol: 6 o más horas…» en el chip es solo «Pleno sol»; la
  // explicación queda en la hoja
  const texto = activo ? elegidas.map((o) => o.etiqueta.split(':')[0]).join(' · ') : etiqueta
  const Icono = elegidas.length === 1 ? elegidas[0].Icono : null

  return (
    <>
      <button
        type="button"
        className={`chip-hoja ${activo ? 'es-activo' : ''}`}
        onClick={() => setAbierta(true)}
        aria-haspopup="dialog"
        aria-label={activo ? `${etiqueta}: ${texto}` : `${etiqueta}: cualquiera`}
      >
        {/* El botón mide 44 para el dedo; la píldora, 32 para el ojo. */}
        <span className="chip-hoja__pildora">
          {Icono && <Icono size={15} />}
          {texto}
        </span>
      </button>

      <BottomSheet abierto={abierta} onCerrar={() => setAbierta(false)} titulo={etiqueta}>
        <div className="chip-hoja__grupos">
          {grupos.map((g) => (
            <div key={g.etiqueta} className="opciones" role="radiogroup" aria-label={g.etiqueta}>
              {grupos.length > 1 && <p className="chip-hoja__subtitulo">{g.etiqueta}</p>}
              <Opcion
                elegida={g.activo === null}
                onClick={() => {
                  g.onElegir(null)
                  setAbierta(false)
                }}
                nombre="Cualquiera"
              />
              {g.opciones.map((o) => (
                <Opcion
                  key={o.valor}
                  elegida={g.activo === o.valor}
                  onClick={() => {
                    g.onElegir(o.valor)
                    setAbierta(false)
                  }}
                  nombre={o.etiqueta}
                  Icono={o.Icono}
                  color={o.color}
                />
              ))}
            </div>
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

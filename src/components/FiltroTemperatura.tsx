import { useState } from 'react'
import { BottomSheet } from './BottomSheet'
import { RangoTemperatura } from './RangoTemperatura'
import { IconoCheck } from '../icons'
import {
  CRITERIOS,
  criteriosActivos,
  rielUtil,
  rotuloChip,
  rotuloRango,
  SIN_TEMPERATURA,
  type CriterioTemp,
  type InfoCriterio,
  type Rango,
  type SeleccionTemp,
} from '../lib/filtroTemperatura'
import './FiltroTemperatura.css'

interface Props {
  seleccion: SeleccionTemp
  onCambiar: (s: SeleccionTemp) => void
  dominios: Record<CriterioTemp, Rango>
  /** cuántas especies quedan con lo elegido: el pie lo dice en vivo */
  cantidad: number
}

/** El chip "Temp." y su hoja de cuatro rangos, cada uno con su interruptor. */
export function FiltroTemperatura({ seleccion, onCambiar, dominios, cantidad }: Props) {
  const [abierta, setAbierta] = useState(false)
  const activos = criteriosActivos(seleccion).length

  // Prenderlo lo abre entero: así filtra por tener el dato, que es información
  // real, y no por un recorte que nadie eligió.
  const alternar = (c: InfoCriterio) =>
    onCambiar({ ...seleccion, [c.clave]: seleccion[c.clave] ? null : dominios[c.clave] })

  return (
    <>
      <button
        type="button"
        className={`chip-hoja ${activos ? 'es-activo' : ''}`}
        onClick={() => setAbierta(true)}
        aria-haspopup="dialog"
        aria-label={rotuloChip(seleccion)}
      >
        <span className="chip-hoja__pildora">
          Temp.
          {/* el número, para que el estado no dependa solo del relleno ocre */}
          {activos > 0 && (
            <span className="chip-hoja__cuenta" aria-hidden>
              {activos}
            </span>
          )}
        </span>
      </button>

      <BottomSheet
        abierto={abierta}
        onCerrar={() => setAbierta(false)}
        titulo="Temperatura"
        sobretitulo="Prendé el rango que te importe y movelo"
        pie={
          <div className="filtro-temp__pie">
            {activos > 0 && (
              <button
                type="button"
                className="filtro-temp__sacar"
                onClick={() => onCambiar(SIN_TEMPERATURA)}
              >
                Sacar temperatura
              </button>
            )}
            <button
              type="button"
              className="filtro-temp__listo"
              onClick={() => setAbierta(false)}
            >
              Ver {cantidad} {cantidad === 1 ? 'especie' : 'especies'}
            </button>
          </div>
        }
      >
        <div className="filtro-temp">
          {CRITERIOS.filter((c) => rielUtil(dominios[c.clave])).map((c) => {
            const r = seleccion[c.clave]
            return (
              <div key={c.clave} className="filtro-temp__bloque">
                {/* el título vive en el botón: un h3 acá rompería la jerarquía de encabezados */}
                <button
                  type="button"
                  className={`interruptor ${r ? 'es-activo' : ''}`}
                  aria-pressed={!!r}
                  onClick={() => alternar(c)}
                >
                  <span className="interruptor__marca" aria-hidden>
                    {r && <IconoCheck size={14} />}
                  </span>
                  <span className="interruptor__textos">
                    <span className="interruptor__nombre">
                      {c.etiqueta} <em>({c.medio})</em>
                    </span>
                    <span className="interruptor__valor">{rotuloRango(r)}</span>
                  </span>
                </button>
                <RangoTemperatura
                  dominio={dominios[c.clave]}
                  valor={r ?? dominios[c.clave]}
                  onCambiar={(nuevo) => onCambiar({ ...seleccion, [c.clave]: nuevo })}
                  nombre={c.etiqueta}
                  activo={!!r}
                />
              </div>
            )
          })}
        </div>
      </BottomSheet>
    </>
  )
}

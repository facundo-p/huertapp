import { BottomSheet } from './BottomSheet'
import { CIELOS } from '../icons'
import { proveedor } from '../lib/pronostico/proveedor'
import type { DiaPronostico } from '../lib/pronostico/tipos'
import { fechaDiaLarga } from '../lib/fechas'
import './HojaDia.css'

/** Los datos finos de un día del pronóstico, con la atribución que exige la licencia. */
export function HojaDia({ dia, onCerrar }: { dia: DiaPronostico | null; onCerrar: () => void }) {
  return (
    <BottomSheet
      abierto={dia != null}
      onCerrar={onCerrar}
      titulo={dia ? fechaDiaLarga(dia.fecha) : ''}
      sobretitulo={dia ? CIELOS[dia.cielo].nombre : undefined}
    >
      {dia && (
        <>
          <dl className="hoja-dia__detalle">
            <FilaDato titulo="Temperatura" valor={`${Math.round(dia.min)}° a ${Math.round(dia.max)}°`} />
            <FilaDato
              titulo="Lluvia"
              valor={dia.probLluvia == null ? null : `${dia.probLluvia} % · ${Math.round(dia.lluviaMm)} mm`}
            />
            <FilaDato
              titulo="Viento"
              valor={`${Math.round(dia.vientoMax)} km/h · ráfagas ${Math.round(dia.rafagas)}`}
            />
            <FilaDato titulo="UV máximo" valor={dia.uvMax == null ? null : String(Math.round(dia.uvMax))} />
            <FilaDato titulo="Humedad" valor={dia.humedad ? `${dia.humedad.min}–${dia.humedad.max} %` : null} />
            <FilaDato titulo="Presión" valor={dia.presionMedia == null ? null : `${dia.presionMedia} hPa`} />
            <FilaDato
              titulo="Rocío al amanecer"
              valor={dia.rocioAmanecer == null ? null : `${dia.rocioAmanecer} °C`}
            />
            <FilaDato
              titulo="Suelo (según el modelo)"
              valor={dia.sueloTemp == null ? null : `${dia.sueloTemp} °C`}
            />
          </dl>
          <p className="hoja-dia__atribucion">
            <a href={proveedor.atribucion.url} target="_blank" rel="noreferrer">
              {proveedor.atribucion.texto}
            </a>
          </p>
        </>
      )}
    </BottomSheet>
  )
}

/** `null` = el proveedor no lo trae para ese día: se dice, no se esconde. */
function FilaDato({ titulo, valor }: { titulo: string; valor: string | null }) {
  return (
    <>
      <dt>{titulo}</dt>
      <dd className={valor == null ? 'es-sin-dato' : undefined}>
        {valor ?? 's/d'}
        {valor == null && <span className="sr-solo">: el pronóstico no trae este dato para ese día</span>}
      </dd>
    </>
  )
}

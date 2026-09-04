import { useState, type ComponentType } from 'react'
import { BottomSheet } from './BottomSheet'
import { CIELOS, IconoCalor, IconoEscarcha, IconoGota, IconoLluvia, IconoViento, type IconProps } from '../icons'
import { frescura, recortarPasados } from '../lib/pronostico/derivar'
import { proveedor } from '../lib/pronostico/proveedor'
import type { EstadoPronostico } from '../lib/pronostico/store'
import type { AvisoClima, DiaPronostico, TipoAviso } from '../lib/pronostico/tipos'
import './Pronostico.css'

const ICONO_AVISO: Record<TipoAviso, ComponentType<IconProps>> = {
  helada: IconoEscarcha,
  calor: IconoCalor,
  lluvia: IconoLluvia,
}

// T12:00: el mediodía evita que el huso corra el día (patrón del repo)
const aFecha = (fecha: string) => new Date(`${fecha}T12:00:00`)

const nombreCorto = (fecha: string, hoy: string) =>
  fecha === hoy ? 'hoy' : aFecha(fecha).toLocaleDateString('es-AR', { weekday: 'short' })

const nombreLargo = (fecha: string) =>
  aFecha(fecha).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })

function actualizadoHace(obtenido: string, ahora: string): string {
  const horas = Math.round((Date.parse(ahora) - Date.parse(obtenido)) / 3_600_000)
  if (horas < 1) return 'recién actualizado'
  if (horas < 24) return `actualizado hace ${horas} h`
  return 'actualizado ayer'
}

function etiquetaDia(d: DiaPronostico, hoy: string): string {
  const lluvia = d.probLluvia != null ? `, ${d.probLluvia} % de probabilidad de lluvia` : ''
  const extra =
    d.fecha === hoy
      ? `, viento de ${Math.round(d.vientoMax)} km/h${d.uvMax != null ? `, UV ${Math.round(d.uvMax)}` : ''}`
      : ''
  const dia = d.fecha === hoy ? 'hoy' : nombreLargo(d.fecha)
  return `${dia}: ${CIELOS[d.cielo].nombre}, mínima ${Math.round(d.min)}, máxima ${Math.round(d.max)}${lluvia}${extra}`
}

interface Props {
  estado: EstadoPronostico
  avisos: AvisoClima[]
  /** yyyy-mm-dd, inyectado por la pantalla */
  hoy: string
  /** ISO completo, para la frescura */
  ahora: string
}

/**
 * La semana que viene en Hoy: franja de 7 días, alertas cuando las hay y el
 * detalle de cada día en una hoja. Sin ubicación configurada no existe, y la
 * pantalla queda exactamente como era.
 */
export function Pronostico({ estado, avisos, hoy, ahora }: Props) {
  const [abierto, setAbierto] = useState<DiaPronostico | null>(null)

  if (!estado.ubicacion) return null

  const { pronostico } = estado
  const fresc = pronostico ? frescura(pronostico, ahora) : null
  const dias = pronostico && fresc !== 'vencido' ? recortarPasados(pronostico, hoy) : []

  return (
    <section className="hoy__seccion pronostico">
      <h2 className="seccion__titulo subrayado-onda">La semana</h2>

      {dias.length === 0 ? (
        <p className="pronostico__estado">
          {!estado.cargado || estado.actualizando
            ? 'Buscando el pronóstico…'
            : 'Sin internet no llega el pronóstico. Apenas te conectes, aparece solo.'}
        </p>
      ) : (
        <>
          {avisos.length > 0 && (
            <ul className="pronostico__avisos">
              {avisos.map((a) => {
                const Icono = ICONO_AVISO[a.tipo]
                return (
                  <li key={a.id} className={`pronostico__aviso es-${a.tipo}`}>
                    <span className="pronostico__aviso-icono" aria-hidden>
                      <Icono size={22} />
                    </span>
                    <div>
                      <p className="pronostico__aviso-titulo">{a.titulo}</p>
                      <p className="pronostico__aviso-detalle">{a.detalle}</p>
                      <p className="pronostico__fuente">{a.fuente}</p>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}

          <ul className="pronostico__franja">
            {dias.map((d) => {
              const { Icono, nombre, color } = CIELOS[d.cielo]
              const esHoy = d.fecha === hoy
              return (
                <li key={d.fecha} className={esHoy ? 'es-hoy' : undefined}>
                  <button
                    type="button"
                    className="pronostico__dia"
                    onClick={() => setAbierto(d)}
                    aria-label={etiquetaDia(d, hoy)}
                  >
                    {esHoy ? (
                      <>
                        <span className="pronostico__hoy-cabeza" aria-hidden>
                          <span className="pronostico__dia-icono" data-cielo={d.cielo} style={{ color }}>
                            <Icono size={30} />
                          </span>
                          <span className="pronostico__hoy-titulos">
                            <span className="pronostico__dia-nombre">hoy</span>
                            <span className="pronostico__hoy-cielo">{nombre}</span>
                          </span>
                        </span>
                        <span className="pronostico__hoy-temps" aria-hidden>
                          {Math.round(d.max)}°
                          <span className="pronostico__hoy-min"> / {Math.round(d.min)}°</span>
                        </span>
                        <span className="pronostico__hoy-datos" aria-hidden>
                          {d.probLluvia != null && (
                            <span className="pronostico__dia-lluvia">
                              <IconoGota size={12} /> {d.probLluvia}%
                            </span>
                          )}
                          <span>
                            <IconoViento size={12} /> {Math.round(d.vientoMax)} km/h
                          </span>
                          {d.uvMax != null && <span>UV {Math.round(d.uvMax)}</span>}
                        </span>
                      </>
                    ) : (
                      <>
                        <span className="pronostico__dia-nombre" aria-hidden>
                          {nombreCorto(d.fecha, hoy)}
                        </span>
                        <span className="pronostico__dia-icono" data-cielo={d.cielo} style={{ color }} aria-hidden>
                          <Icono size={22} />
                        </span>
                        <span className="pronostico__dia-max" aria-hidden>
                          {Math.round(d.max)}°
                        </span>
                        <span className="pronostico__dia-min" aria-hidden>
                          {Math.round(d.min)}°
                        </span>
                        <span className="pronostico__dia-lluvia" aria-hidden>
                          {d.probLluvia != null && d.probLluvia >= 40 && (
                            <>
                              <IconoGota size={11} /> {d.probLluvia}%
                            </>
                          )}
                        </span>
                      </>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>

          {fresc === 'viejo' && (
            <p className="pronostico__estado es-viejo">
              No pude actualizar: los días que quedan sirven igual de guía.
            </p>
          )}
          <p className="pronostico__fuente">
            {proveedor.nombre} · {pronostico && actualizadoHace(pronostico.obtenido, ahora)} · para{' '}
            {estado.ubicacion.etiqueta}
          </p>
        </>
      )}

      <BottomSheet
        abierto={abierto != null}
        onCerrar={() => setAbierto(null)}
        titulo={abierto ? nombreLargo(abierto.fecha) : ''}
        sobretitulo={abierto ? CIELOS[abierto.cielo].nombre : undefined}
      >
        {abierto && (
          <>
            <dl className="pronostico__detalle">
              <FilaDato titulo="Temperatura" valor={`${Math.round(abierto.min)}° a ${Math.round(abierto.max)}°`} />
              <FilaDato
                titulo="Lluvia"
                valor={
                  abierto.probLluvia == null
                    ? null
                    : `${abierto.probLluvia} % · ${Math.round(abierto.lluviaMm)} mm`
                }
              />
              <FilaDato
                titulo="Viento"
                valor={`${Math.round(abierto.vientoMax)} km/h · ráfagas ${Math.round(abierto.rafagas)}`}
              />
              <FilaDato titulo="UV máximo" valor={abierto.uvMax == null ? null : String(Math.round(abierto.uvMax))} />
              <FilaDato
                titulo="Humedad"
                valor={abierto.humedad ? `${abierto.humedad.min}–${abierto.humedad.max} %` : null}
              />
              <FilaDato
                titulo="Presión"
                valor={abierto.presionMedia == null ? null : `${abierto.presionMedia} hPa`}
              />
              <FilaDato
                titulo="Rocío al amanecer"
                valor={abierto.rocioAmanecer == null ? null : `${abierto.rocioAmanecer} °C`}
              />
              <FilaDato
                titulo="Suelo (según el modelo)"
                valor={abierto.sueloTemp == null ? null : `${abierto.sueloTemp} °C`}
              />
            </dl>
            <p className="pronostico__atribucion">
              <a href={proveedor.atribucion.url} target="_blank" rel="noreferrer">
                {proveedor.atribucion.texto}
              </a>
            </p>
          </>
        )}
      </BottomSheet>
    </section>
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

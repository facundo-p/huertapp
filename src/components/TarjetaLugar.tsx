import type { EspecieEnriquecida } from '../lib/data/types'
import type { Planta, Ubicacion } from '../lib/huerta/tipos'
import { lugarDe, ocupacionDe, type ProximaTarea } from '../lib/huerta/lugar'
import { hitoDelLugar } from '../lib/huerta/hito'
import { mesesDelEje } from '../lib/huerta/gantt'
import { MES_CORTO } from '../lib/fechas'
import { GanttPlanta } from './GanttPlanta'
import { MedidorLugar } from './MedidorLugar'
import { SelloLugar } from './SelloLugar'
import { IconoAlerta, IconoDesplegar, IconoEditar, IconoGrupo, IconoReloj } from '../icons'
import './TarjetaLugar.css'

interface Props {
  /** sin ubicación es el grupo de las plantas que no tienen lugar asignado */
  ubicacion?: Ubicacion
  plantas: Planta[]
  porSlug: Map<string, EspecieEnriquecida>
  pendientes: Map<string, number>
  proxima: ProximaTarea | null
  abierta: boolean
  onAlternar: () => void
  onEditar: () => void
  onSumarPlanta: () => void
}

/**
 * Un lugar de la huerta como ficha plegable.
 *
 * Plegada no esconde: deja la fila de chips con lo que hay adentro y la tarea
 * que queda pendiente. Plegar tiene que ahorrar espacio, no información.
 *
 * El encabezado entero es el botón —58 px de alto— y cada ficha se abre y se
 * cierra sola: no es un acordeón, varias pueden estar abiertas a la vez.
 */
export function TarjetaLugar({
  ubicacion,
  plantas,
  porSlug,
  pendientes,
  proxima,
  abierta,
  onAlternar,
  onEditar,
  onSumarPlanta,
}: Props) {
  const lugar = lugarDe(ubicacion)
  const ocupacion = ubicacion ? ocupacionDe(ubicacion, plantas) : null
  const panel = `lugar-${ubicacion?.id ?? 'sin'}`
  const nombre = ubicacion?.nombre ?? 'Sin lugar asignado'

  // Sin tarea del motor, lo que se muestra plegado es el hito más urgente de
  // las plantas de acá: plegar tiene que ahorrar espacio, no información.
  const hito = proxima ? null : hitoDelLugar(plantas, porSlug)
  const pie = proxima ?? (hito && { texto: hito.texto, urgente: hito.estado === 'demorado' })

  return (
    <section className={`lugar lugar--${lugar.clase}`}>
      {/* el h2 con el botón adentro: la pantalla se navega por encabezados y
          el plegado tiene que ser alcanzable con el teclado */}
      <h2 className="lugar__titulo">
        <button className="lugar__plegar" aria-expanded={abierta} aria-controls={panel} onClick={onAlternar}>
          <SelloLugar clase={lugar.clase} />
          <span className="lugar__textos">
            <span className="lugar__nombre">{nombre}</span>
            <span className="lugar__etiqueta">{lugar.etiqueta}</span>
            {ocupacion && (
              <span className="lugar__ocupacion">
                <MedidorLugar ocupacion={ocupacion} />
                {ocupacion.texto}
              </span>
            )}
          </span>
          <IconoDesplegar size={19} className={`lugar__galon ${abierta ? 'es-abierto' : ''}`} />
        </button>
      </h2>

      {/* Plegada: qué hay adentro y qué falta hacer. Sin esto, plegar un lugar
          escondía que algo pedía atención. */}
      {!abierta && (
        <p className="lugar__chips">
          {plantas.map((p) => {
            const e = porSlug.get(p.slug)
            return (
              <span key={p.id} className="lugar__chip">
                {e && <IconoGrupo grupo={e.grupo} size={13} decorativo />}
                {p.apodo || e?.nombre_comun || p.slug}
              </span>
            )
          })}
          {pie && (
            <span className={`lugar__proxima ${pie.urgente ? 'es-urgente' : ''}`}>
              {pie.urgente ? <IconoAlerta size={12} /> : <IconoReloj size={12} />}
              {pie.texto}
            </span>
          )}
        </p>
      )}

      <div id={panel} className="lugar__cuerpo" hidden={!abierta}>
        {/* sin plantas la escala no etiquetaría nada */}
        {plantas.length > 0 && (
          <p className="gantt-eje" aria-hidden>
            {mesesDelEje().map((m, i) => (
              <span key={i} className={m.esActual ? 'es-actual' : ''}>
                {MES_CORTO[m.mes - 1]}
              </span>
            ))}
          </p>
        )}

        {plantas.map((p, i) => {
          const e = porSlug.get(p.slug)
          if (!e) return null
          return (
            <div
              key={p.id}
              className="aparecer"
              style={{ '--retraso': `${Math.min(i, 8) * 0.03}s` } as React.CSSProperties}
            >
              <GanttPlanta
                planta={p}
                especie={e}
                pendientes={pendientes.get(p.id) ?? 0}
                conNota={lugar.continuo}
              />
            </div>
          )
        })}

        {plantas.length === 0 && <p className="lugar__vacio">Todavía no hay nada plantado acá.</p>}

        <div className="lugar__acciones">
          <button className="lugar__sumar" onClick={onSumarPlanta}>
            <span>＋ Sumar planta acá</span>
          </button>
          {ubicacion && (
            <button className="lugar__editar" aria-label={`Editar ${ubicacion.nombre}`} onClick={onEditar}>
              <IconoEditar size={18} />
            </button>
          )}
        </div>
      </div>
    </section>
  )
}

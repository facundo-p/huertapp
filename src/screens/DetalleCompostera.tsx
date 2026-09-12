import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Header } from '../components/Header'
import { EmptyState } from '../components/EmptyState'
import { FichaCompostera } from '../components/FichaCompostera'
import { FuentesCompost } from '../components/FuentesCompost'
import { useHuerta, avanzarCompostera, borrarCompostera, marcarGirada, sinRomper } from '../lib/huerta/store'
import {
  MATERIAL_COMPOST_INFO,
  SISTEMA_COMPOST_INFO,
  diasEnEstado,
  proximoGiro,
  revisionListo,
  textoRitmo,
} from '../lib/huerta/compostera'
import { useCompostaje } from '../lib/compostaje'
import { ESTADOS_COMPOST, ESTADO_COMPOST_INFO, desdeISO, diasEntre, hoyISO, type EstadoCompost } from '../lib/huerta/tipos'
import { IconoCompost, IconoReloj, IconoTacho, IconoTermo } from '../icons'
import '../components/DatoSection.css'
import '../components/CycleProgress.css'
import './DetallePlanta.css'
import './DetalleCompostera.css'
import { DibujoEtiquetaVacia } from '../dibujos'

const ICONO: Record<EstadoCompost, React.ComponentType<{ size?: number }>> = {
  llenando: IconoTacho,
  cocinando: IconoTermo,
  madurando: IconoCompost,
}

const dias = (n: number) => `${n} ${n === 1 ? 'día' : 'días'}`
const fechaCorta = (iso: string) => new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short' }).format(desdeISO(iso))

/**
 * El detalle de una compostera, con el molde del detalle de planta: los tres
 * estados con el actual en --sol, qué hacer ahora según la guía (citado), los
 * datos reglados y las acciones. Girar es la primaria: es lo que más se hace.
 */
export function DetalleCompostera() {
  const { id } = useParams()
  const navegar = useNavigate()
  const { composteras, cargado } = useHuerta()
  const guia = useCompostaje()
  const [editando, setEditando] = useState(false)
  const hoy = hoyISO()

  const c = composteras.find((x) => x.id === id)

  if (!cargado) {
    return (
      <div className="pantalla pantalla--detalle">
        <Header titulo="Cargando…" volver />
      </div>
    )
  }

  if (!c) {
    return (
      <div className="pantalla pantalla--detalle">
        <Header titulo="No encontramos esa compostera" volver />
        <div className="pantalla__cuerpo">
          <EmptyState Dibujo={DibujoEtiquetaVacia} titulo="Acá no hay compostera" texto="Puede que la hayas borrado. Volvé a Mi huerta y fijate." />
        </div>
      </div>
    )
  }

  const sis = guia?.sistemas[c.sistema]
  const estadoGuia = sis?.estados.find((e) => e.clave === c.estado)
  const giro = proximoGiro(c)
  const revision = sis ? revisionListo(c, sis.listo_desde.dias) : null
  const indiceActual = ESTADOS_COMPOST.indexOf(c.estado)

  async function borrar() {
    if (!c) return
    if (!confirm(`¿Borrar «${c.nombre}»? Se van sus avisos; no se puede deshacer.`)) return
    await borrarCompostera(c.id)
    navegar('/huerta', { replace: true })
  }

  return (
    <div className="pantalla pantalla--detalle">
      <Header
        titulo={c.nombre}
        sobretitulo={[SISTEMA_COMPOST_INFO[c.sistema].etiqueta, MATERIAL_COMPOST_INFO[c.material].etiqueta.toLowerCase(), c.conLombrices ? 'con lombrices' : null]
          .filter(Boolean)
          .join(' · ')}
        volver
      />

      <div className="pantalla__cuerpo">
        {/* 1. los tres estados, el actual en --sol; giran en rueda */}
        <section className="planta__bloque">
          <ol className="ciclo" aria-label={`Estado: ${ESTADO_COMPOST_INFO[c.estado].etiqueta}`}>
            {ESTADOS_COMPOST.map((e, i) => {
              const Icono = ICONO[e]
              const clase = i < indiceActual ? 'es-hecha' : i === indiceActual ? 'es-actual' : 'es-pendiente'
              return (
                <li key={e} className={`ciclo__paso ${clase}`}>
                  <span className="ciclo__punto">
                    <Icono size={16} />
                  </span>
                  <span className="ciclo__etiqueta">{ESTADO_COMPOST_INFO[e].etiqueta}</span>
                  <span className="sr-solo">
                    {ESTADO_COMPOST_INFO[e].etiqueta}
                    {i === indiceActual ? ' (estado actual)' : ''}
                  </span>
                </li>
              )
            })}
          </ol>

          <p className="compostera__ahora">
            <strong>
              {ESTADO_COMPOST_INFO[c.estado].etiqueta} desde hace {dias(diasEnEstado(c, hoy))}.
            </strong>{' '}
            {estadoGuia ? (estadoGuia.que_hacer.valor ?? 's/d') : 'Cargando la guía…'}
          </p>
          {estadoGuia && guia && (
            <FuentesCompost ids={estadoGuia.que_hacer.fuentes} confianza={estadoGuia.que_hacer.confianza} fuentes={guia.meta.fuentes} />
          )}
        </section>

        {/* 2. los datos, reglados */}
        <dl className="planta__datos">
          <Dato titulo="Ritmo de giro" valor={textoRitmo(c.ritmoDias)} />
          <Dato titulo="Último giro" valor={c.girada ? `${fechaCorta(c.girada)} · hace ${dias(diasEntre(c.girada, hoy))}` : 'sin anotar'} />
          {giro && <Dato titulo="Próximo giro" valor={giro <= hoy ? `tocaba el ${fechaCorta(giro)}` : fechaCorta(giro)} />}
          {c.cerrada && <Dato titulo="Sin restos desde" valor={fechaCorta(c.cerrada)} />}
          {c.notas && <Dato titulo="Notas" valor={c.notas} />}
        </dl>

        {/* 3. lo que viene y las acciones */}
        <section className="planta__bloque">
          {revision && (
            <p className={`planta__hito ${revision <= hoy ? 'es-lista' : ''}`}>
              <IconoReloj size={15} />
              <span>
                <strong>Revisar si está</strong> desde el {fechaCorta(revision)}. {sis!.listo_desde.valor ?? 's/d'}
              </span>
            </p>
          )}

          <button className="planta__avanzar" onClick={() => sinRomper(marcarGirada(c))}>
            Hoy la giré
          </button>
          <button className="planta__secundario" onClick={() => sinRomper(avanzarCompostera(c))}>
            {ESTADO_COMPOST_INFO[c.estado].avanzar}
          </button>
          <button className="planta__secundario" onClick={() => setEditando(true)}>
            Editar nombre, ritmo o estado…
          </button>
        </section>

        <Link to={`/compost/${c.material}-${c.sistema}#girar`} className="planta__ficha-link">
          Ver la guía: {MATERIAL_COMPOST_INFO[c.material].etiqueta.toLowerCase()} · {SISTEMA_COMPOST_INFO[c.sistema].etiqueta.toLowerCase()} →
        </Link>

        <button className="planta__borrar" onClick={() => sinRomper(borrar())}>
          Borrar esta compostera
        </button>
      </div>

      <FichaCompostera abierto={editando} compostera={c} onCerrar={() => setEditando(false)} />
    </div>
  )
}

function Dato({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="planta__dato">
      <dt>{titulo}</dt>
      <dd>{valor}</dd>
    </div>
  )
}

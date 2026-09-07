import type { ComponentType } from 'react'
import { Link } from 'react-router'
import {
  CIELOS,
  IconoAlerta,
  IconoCalor,
  IconoCosechar,
  IconoEscarcha,
  IconoLluvia,
  IconoPuntos,
  IconoSembrar,
  IconoTrasplantar,
  type IconProps,
} from '../icons'
import type { Tarea } from '../lib/tareas/engine'
import type { AvisoClima, DiaPronostico, TipoAviso } from '../lib/pronostico/tipos'
import { sumarDias } from '../lib/huerta/estimar'
import { fechaDiaLarga, numeroDia, siglaDia } from '../lib/fechas'
import './CarrilSemana.css'

const ICONO_TAREA: Record<Tarea['tipo'], ComponentType<IconProps>> = {
  helada: IconoAlerta,
  trasplantar: IconoTrasplantar,
  revisar_germinacion: IconoSembrar,
  cosechar: IconoCosechar,
  sembrar: IconoSembrar,
}

const ICONO_AVISO: Record<TipoAviso, ComponentType<IconProps>> = {
  helada: IconoEscarcha,
  calor: IconoCalor,
  lluvia: IconoLluvia,
}

/** Lo que el lector de pantalla dice del día: el cielo y las temperaturas van acá, no en el DOM. */
function etiquetaDia(d: DiaPronostico, hoy: string): string {
  const lluvia = d.probLluvia != null ? `, ${d.probLluvia} % de probabilidad de lluvia` : ''
  const dia = d.fecha === hoy ? 'hoy' : fechaDiaLarga(d.fecha)
  return `${dia}: ${CIELOS[d.cielo].nombre}, mínima ${Math.round(d.min)}, máxima ${Math.round(d.max)}${lluvia}. Ver el detalle del día`
}

interface Props {
  /** yyyy-mm-dd, inyectado por la pantalla */
  hoy: string
  /** los días del pronóstico que haya; vacío si no hay o está vencido */
  pronostico: DiaPronostico[]
  tareas: Tarea[]
  avisos: AvisoClima[]
  festejando: string | null
  /** la tarea de germinación responde «Asomó» en vez de «Hecho» */
  conAsomo: (t: Tarea) => boolean
  onCompletar: (t: Tarea) => void
  onAsomo: (t: Tarea) => void
  onMenu: (t: Tarea) => void
  onAbrirDia: (d: DiaPronostico) => void
}

/**
 * La semana como un solo eje vertical: en cada fila, el día con su cielo a la
 * izquierda y lo que toca ese día a la derecha. Los días vacíos se quedan,
 * con un guion: la lectura que se busca es «cómo viene la semana», y para
 * eso los huecos importan. Sin pronóstico, el carril sigue: la columna del
 * día queda con la sigla y el número.
 */
export function CarrilSemana({
  hoy,
  pronostico,
  tareas,
  avisos,
  festejando,
  conAsomo,
  onCompletar,
  onAsomo,
  onMenu,
  onAbrirDia,
}: Props) {
  const semana = Array.from({ length: 7 }, (_, i) => {
    const fecha = sumarDias(hoy, i)
    return {
      fecha,
      dia: pronostico.find((d) => d.fecha === fecha) ?? null,
      avisos: avisos.filter((a) => a.fecha === fecha),
      tareas: tareas.filter((t) => t.fecha === fecha),
    }
  })

  return (
    <ol className="carril" aria-label="La semana, día por día">
      {semana.map(({ fecha, dia, avisos: avs, tareas: ts }) => {
        const esHoy = fecha === hoy
        const conCosas = avs.length + ts.length > 0
        const heladaEseDia = avs.some((a) => a.tipo === 'helada')
        const cabecera = (
          <>
            <span className="carril__sigla">{esHoy ? 'hoy' : siglaDia(fecha)}</span>
            <span className="carril__numero">{numeroDia(fecha)}</span>
            {dia && <Cielo dia={dia} helada={heladaEseDia} />}
          </>
        )
        return (
          <li key={fecha} className={`carril__fila ${esHoy ? 'es-hoy' : ''} ${conCosas ? 'es-con-cosas' : ''}`}>
            {dia ? (
              <button
                type="button"
                className="carril__dia"
                onClick={() => onAbrirDia(dia)}
                aria-label={etiquetaDia(dia, hoy)}
              >
                {cabecera}
              </button>
            ) : (
              <div className="carril__dia">
                <span className="sr-solo">{esHoy ? 'hoy' : fechaDiaLarga(fecha)}</span>
                <span aria-hidden>{cabecera}</span>
              </div>
            )}

            <div className="carril__items">
              {!conCosas && (
                <span className="carril__nada">
                  <span aria-hidden>—</span>
                  <span className="sr-solo">nada para ese día</span>
                </span>
              )}
              {avs.map((a) => (
                <Aviso key={a.id} aviso={a} />
              ))}
              {ts.map((t) => (
                <Item
                  key={t.id}
                  tarea={t}
                  festejando={festejando === t.id}
                  asomo={conAsomo(t)}
                  onCompletar={() => onCompletar(t)}
                  onAsomo={() => onAsomo(t)}
                  onMenu={() => onMenu(t)}
                />
              ))}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

function Cielo({ dia, helada }: { dia: DiaPronostico; helada: boolean }) {
  const { Icono, color } = CIELOS[dia.cielo]
  return (
    <>
      <span
        className={`carril__cielo ${helada ? 'es-helada' : ''}`}
        data-cielo={dia.cielo}
        style={helada ? undefined : { color }}
        aria-hidden
      >
        <Icono size={18} />
      </span>
      <span className="carril__temps" aria-hidden>
        {Math.round(dia.max)}° <small>{Math.round(dia.min)}°</small>
      </span>
    </>
  )
}

function Aviso({ aviso: a }: { aviso: AvisoClima }) {
  const Icono = ICONO_AVISO[a.tipo]
  return (
    <div className={`carril__item carril__aviso es-${a.tipo}`}>
      <span className="carril__icono" aria-hidden>
        <Icono size={19} />
      </span>
      <span className="carril__textos">
        <span className="carril__titulo">{a.titulo}</span>
        <span className="carril__detalle">{a.detalle}</span>
        <span className="carril__fuente">{a.fuente}</span>
      </span>
    </div>
  )
}

function Item({
  tarea: t,
  festejando,
  asomo,
  onCompletar,
  onAsomo,
  onMenu,
}: {
  tarea: Tarea
  festejando: boolean
  asomo: boolean
  onCompletar: () => void
  onAsomo: () => void
  onMenu: () => void
}) {
  const Icono = ICONO_TAREA[t.tipo]
  const cuerpo = (
    <>
      <span className="carril__icono" aria-hidden>
        {festejando ? <span className="brotar">🌱</span> : <Icono size={19} />}
      </span>
      <span className="carril__textos">
        <span className="carril__titulo">
          {t.titulo}
          {t.atrasada && <span className="carril__atrasada">atrasada</span>}
        </span>
        <span className="carril__detalle">{t.detalle}</span>
        {/* de dónde sale: sin esto, es una app que manda sin explicar */}
        <span className="carril__fuente">{t.fuente}</span>
      </span>
    </>
  )
  return (
    <div className={`carril__item es-${t.tipo} ${festejando ? 'es-festejando' : ''}`}>
      {t.plantaId ? (
        <Link to={`/huerta/${t.plantaId}`} className="carril__cuerpo">
          {cuerpo}
        </Link>
      ) : (
        <div className="carril__cuerpo">{cuerpo}</div>
      )}
      <span className="carril__acciones">
        {/* El botón mide 44 para el dedo; la píldora de adentro, 32 para el ojo. */}
        <button type="button" className="carril__hecho" onClick={asomo ? onAsomo : onCompletar}>
          <span className="carril__pildora">{asomo ? 'Asomó' : 'Hecho'}</span>
        </button>
        <button type="button" className="carril__menu" onClick={onMenu} aria-label={`Más opciones: ${t.titulo}`}>
          <IconoPuntos size={20} />
        </button>
      </span>
    </div>
  )
}

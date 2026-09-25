import { useMemo, useState, type ComponentType } from 'react'
import { Link } from 'react-router'
import {
  CIELOS,
  IconoAlerta,
  IconoCalor,
  IconoCompost,
  IconoCosechar,
  IconoDesplegar,
  IconoEscarcha,
  IconoLluvia,
  IconoPuntos,
  IconoSembrar,
  IconoTacho,
  IconoTrasplantar,
  type IconProps,
} from '../icons'
import type { Tarea } from '../lib/tareas/engine'
import {
  agruparPorPie,
  distinguir,
  etiquetaPie,
  type DondeCrece,
  type Encabezado,
  type GrupoTareas,
} from '../lib/tareas/agrupar'
import { alternar } from '../lib/huerta/plegado'
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
  girar_compost: IconoCompost,
  compost_listo: IconoTacho,
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
  /** por id de planta: para separar dos tareas que se llaman igual */
  dondeCrece: Map<string, DondeCrece>
  festejando: string | null
  /** la tarea de germinación responde «Asomó» en vez de «Hecho» */
  conAsomo: (t: Tarea) => boolean
  onCompletar: (t: Tarea) => void
  onAsomo: (t: Tarea) => void
  /** con el nombre que la dice: el título y, si otra se llama igual, el lugar */
  onMenu: (t: Tarea, nombre: string) => void
  onAbrirDia: (d: DiaPronostico) => void
}

/**
 * La semana como un solo eje vertical: en cada fila, el día con su cielo a la
 * izquierda y lo que toca ese día a la derecha. Los días vacíos se quedan,
 * con un guion: la lectura que se busca es «cómo viene la semana», y para
 * eso los huecos importan. Sin pronóstico, el carril sigue: la columna del
 * día queda con la sigla y el número.
 *
 * De cada tarea se ve el título; el porqué y la fuente se pliegan detrás de un
 * botón por día. La instrucción de una helada o de un trasplante riesgoso, no.
 */
export function CarrilSemana({
  hoy,
  pronostico,
  tareas,
  avisos,
  dondeCrece,
  festejando,
  conAsomo,
  onCompletar,
  onAsomo,
  onMenu,
  onAbrirDia,
}: Props) {
  // En memoria y no en localStorage: acá el plegado es cómo estás mirando la
  // semana ahora, no una preferencia que valga la pena recordar mañana.
  const [abiertos, setAbiertos] = useState<string[]>([])

  const semana = useMemo(() => {
    const fechas = Array.from({ length: 7 }, (_, i) => sumarDias(hoy, i))
    const deLaSemana = tareas.filter((t) => fechas.includes(t.fecha))
    return fechas.map((fecha) => {
      const ts = deLaSemana.filter((t) => t.fecha === fecha)
      const grupos = agruparPorPie(ts)
      return {
        fecha,
        dia: pronostico.find((d) => d.fecha === fecha) ?? null,
        avisos: avisos.filter((a) => a.fecha === fecha),
        tareas: ts,
        grupos,
        distintos: distinguir(grupos, dondeCrece, deLaSemana),
      }
    })
  }, [hoy, pronostico, avisos, tareas, dondeCrece])

  return (
    <ol className="carril" aria-label="La semana, día por día">
      {semana.map(({ fecha, dia, avisos: avs, tareas: ts, grupos, distintos }) => {
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
              {grupos.flatMap((g) => g.tareas).map((t) => (
                <Item
                  key={t.id}
                  tarea={t}
                  lugar={distintos.porTarea.get(t.id)}
                  festejando={festejando === t.id}
                  asomo={conAsomo(t)}
                  onCompletar={() => onCompletar(t)}
                  onAsomo={() => onAsomo(t)}
                  onMenu={(nombre) => onMenu(t, nombre)}
                />
              ))}
              {grupos.length > 0 && (
                <PieDelDia
                  fecha={fecha}
                  esHoy={esHoy}
                  grupos={grupos}
                  lugares={distintos.porGrupo}
                  abierto={abiertos.includes(fecha)}
                  onAlternar={() => setAbiertos((v) => alternar(v, fecha))}
                />
              )}
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

/**
 * El aviso de clima no pliega: su detalle es la instrucción («cubrí de noche
 * X»), no la explicación, y son hasta tres por día.
 */
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

/**
 * Un «por qué» por día y no por tarea: cada botón se come 44 px. El estado va
 * por fecha: por grupo, abrir el del martes abría el del viernes.
 */
function PieDelDia({
  fecha,
  esHoy,
  grupos,
  lugares,
  abierto,
  onAlternar,
}: {
  fecha: string
  esHoy: boolean
  grupos: GrupoTareas[]
  lugares: Map<string, Encabezado[]>
  abierto: boolean
  onAlternar: () => void
}) {
  const panel = `porque-${fecha}`
  return (
    <>
      <button
        type="button"
        className="carril__porque"
        aria-expanded={abierto}
        aria-controls={panel}
        onClick={onAlternar}
      >
        {/* no cambia a «ocultar»: el galón y aria-expanded ya dicen el estado */}
        <IconoDesplegar size={13} className={`galon ${abierto ? 'es-abierto' : ''}`} />
        {etiquetaPie(grupos)}
        {/* siete botones iguales en la pantalla: hay que decir de qué día es */}
        <span className="sr-solo">, {esHoy ? 'hoy' : fechaDiaLarga(fecha)}</span>
      </button>
      <div id={panel} className="carril__pie-dia" hidden={!abierto}>
        {grupos.map((g) => (
          <div key={g.clave} className="carril__pie-grupo">
            {/* de cuál habla: el pie es de las N tareas que dicen lo mismo, un renglón por título */}
            {lugares.get(g.clave)!.map((e) => (
              <span key={e.titulo} className="carril__pie-de">
                {e.titulo}
                {e.lugares && <span className="carril__pie-lugar"> — {e.lugares}</span>}
              </span>
            ))}
            {!g.instruccion && <span className="carril__detalle">{g.detalle}</span>}
            {/* de dónde sale: sin esto, es una app que manda sin explicar */}
            <span className="carril__fuente">{g.fuente}</span>
          </div>
        ))}
      </div>
    </>
  )
}

function Item({
  tarea: t,
  lugar,
  festejando,
  asomo,
  onCompletar,
  onAsomo,
  onMenu,
}: {
  tarea: Tarea
  /** sólo si otra tarea de la semana se llama igual */
  lugar?: string
  festejando: boolean
  asomo: boolean
  onCompletar: () => void
  onAsomo: () => void
  onMenu: (nombre: string) => void
}) {
  const Icono = ICONO_TAREA[t.tipo]
  const atrasada = t.atrasada && <span className="carril__atrasada">atrasada</span>
  // dos «Hecho» seguidos no dicen de qué tarea es cada uno
  const deCual = `${t.titulo}${lugar ? `, ${lugar}` : ''}`
  const cuerpo = (
    <>
      <span className="carril__icono" aria-hidden>
        {festejando ? <span className="brotar">🌱</span> : <Icono size={19} />}
      </span>
      <span className="carril__textos">
        <span className="carril__titulo">
          {t.titulo}
          {!lugar && atrasada}
        </span>
        {/* el chip, junto al lugar: bajo el título ocupaba un renglón para él solo */}
        {lugar && (
          <span className="carril__lugar">
            {atrasada && <>{atrasada} </>}
            {lugar}
          </span>
        )}
        {/* en cada fila y no en el pie: si no, de dos iguales, la primera se
            leía como un trasplante sin riesgo */}
        {t.instruccion && <span className="carril__detalle">{t.detalle}</span>}
      </span>
    </>
  )
  return (
    <div className={`carril__item es-${t.tipo} ${festejando ? 'es-festejando' : ''}`}>
      {t.plantaId || t.composteraId ? (
        <Link
          to={t.plantaId ? `/huerta/${t.plantaId}` : `/huerta/compostera/${t.composteraId}`}
          className="carril__cuerpo"
        >
          {cuerpo}
        </Link>
      ) : (
        <div className="carril__cuerpo">{cuerpo}</div>
      )}
      <span className="carril__acciones">
        {/* El botón mide 44 para el dedo; la píldora de adentro, 32 para el ojo. */}
        <button type="button" className="carril__hecho" onClick={asomo ? onAsomo : onCompletar}>
          <span className="carril__pildora">{asomo ? 'Asomó' : 'Hecho'}</span>
          <span className="sr-solo">: {deCual}</span>
        </button>
        <button
          type="button"
          className="carril__menu"
          onClick={() => onMenu(deCual)}
          aria-label={`Más opciones: ${deCual}`}
        >
          <IconoPuntos size={20} />
        </button>
      </span>
    </div>
  )
}

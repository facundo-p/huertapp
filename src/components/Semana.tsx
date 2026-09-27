import { useId, useState, type ComponentType, type ReactNode, type Ref } from 'react'
import { Link } from 'react-router'
import { CIELOS, IconoCalor, IconoDesplegar, IconoEscarcha, IconoGota, IconoHoja, type IconProps } from '../icons'
import type { Tarea } from '../lib/tareas/engine'
import type { AvisoClima, DiaPronostico, TipoAviso } from '../lib/pronostico/tipos'
import { puntosConfianza } from '../lib/data/confianza'
import { nombreDia, numeroDia, siglaDia } from '../lib/fechas'
import './Semana.css'

/** Un día de la semana, con lo que toca y el cielo si hay pronóstico. */
export interface DiaSemana {
  fecha: string
  pron: DiaPronostico | null
  avisos: AvisoClima[]
  tareas: Tarea[]
}

const AVISO: Record<TipoAviso, { Icono: ComponentType<IconProps>; color: string }> = {
  helada: { Icono: IconoEscarcha, color: 'var(--cielo-frio)' },
  // gota y no nube con lluvia: al lado del cielo del día, dos nubes iguales no se distinguían
  lluvia: { Icono: IconoGota, color: 'var(--cielo-agua)' },
  calor: { Icono: IconoCalor, color: 'var(--sol-texto)' },
}

const mayus = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const grados = (d: DiaPronostico) => `${Math.round(d.max)}° · ${Math.round(d.min)}°`

/** «Viernes 25»; hoy, «Para hoy». */
export const tituloDia = (fecha: string, hoy: string) =>
  fecha === hoy ? 'Para hoy' : `${mayus(nombreDia(fecha))} ${numeroDia(fecha)}`

/** A mano, como un círculo con birome alrededor del número. */
function Circulo() {
  return (
    <svg className="dia__circulo" viewBox="0 0 46 38" preserveAspectRatio="none" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" aria-hidden focusable="false">
      <path vectorEffect="non-scaling-stroke" d="M8 11 C 13 4.5, 30 2.8, 39 9 C 46 14.5, 42.5 29, 30 33.5 C 18 37.5, 5.5 32.5, 3.6 23 C 2.4 16.5, 6.5 10.5, 14.5 7.2" />
    </svg>
  )
}

/**
 * La tira de la semana, pegada arriba. Tocar un día lleva a su página; el
 * círculo marca el que se está leyendo, lo mueva el toque o el scroll.
 */
export function TiraSemana({
  semana,
  hoy,
  leyendo,
  onElegir,
  tiraRef,
}: {
  semana: DiaSemana[]
  hoy: string
  leyendo: string
  onElegir: (fecha: string) => void
  tiraRef: Ref<HTMLElement>
}) {
  return (
    <nav className="semana" aria-label="Los días de la semana" ref={tiraRef}>
      {semana.map((d) => {
        const esHoy = d.fecha === hoy
        const sigla = esHoy ? 'hoy' : siglaDia(d.fecha)
        const num = numeroDia(d.fecha)
        const cielo = d.pron && CIELOS[d.pron.cielo]
        let marcas: ReactNode[] = [
          ...d.avisos.map((a) => {
            const { Icono, color } = AVISO[a.tipo]
            return (
              <span key={a.id} style={{ color }}>
                <Icono size={14} />
              </span>
            )
          }),
          ...d.tareas.map((t) => <span key={t.id} className="dia__punto" />),
        ]
        // tres como mucho, avisos primero: con más, la tercera es «+N» y la columna no se sale a 340 px
        if (marcas.length > 3) {
          marcas = [
            ...marcas.slice(0, 2),
            <span key="mas" className="dia__mas">
              +{marcas.length - 2}
            </span>,
          ]
        }
        const que = [
          ...(d.tareas.length ? [d.tareas.length === 1 ? '1 cosa para hacer' : `${d.tareas.length} cosas para hacer`] : []),
          ...d.avisos.map((a) => a.titulo.toLowerCase()),
        ]
        // arranca con lo que se ve («vie 25»): quien maneja el teléfono con la voz dice eso
        const etiqueta =
          `${sigla} ${num}` +
          (d.pron ? `: ${cielo!.nombre}, ${Math.round(d.pron.max)}° y ${Math.round(d.pron.min)}°` : '') +
          (que.length ? `. ${mayus(que.join(', '))}` : '. Nada anotado')
        const leido = d.fecha === leyendo
        return (
          <button
            key={d.fecha}
            type="button"
            className={`dia ${esHoy ? 'es-hoy' : ''}`}
            aria-current={leido ? 'true' : undefined}
            aria-label={etiqueta}
            onClick={() => onElegir(d.fecha)}
          >
            <span className="dia__sigla" aria-hidden>
              {sigla}
            </span>
            <span className="dia__num" aria-hidden>
              {num}
              {leido && <Circulo />}
            </span>
            <span className="dia__cielo" style={cielo ? { color: cielo.color } : undefined} aria-hidden>
              {cielo && <cielo.Icono size={20} />}
            </span>
            <span className="dia__marcas" aria-hidden>
              {marcas}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

export interface AccionesTarea {
  /** dónde crece la planta o, si otra tarea se llama igual, lo que las separa */
  dondeDe: (t: Tarea) => string | undefined
  /** la de germinación se tilda con «Asomó», que escribe `germino` */
  conAsomo: (t: Tarea) => boolean
  marcadas: ReadonlySet<string>
  onMarcar: (t: Tarea, casilla: HTMLElement) => void
  onPosponer: (t: Tarea, boton: HTMLElement) => void
}

/** La página de un día: su título, y lo que toca o «Nada anotado». */
export function PaginaDia({
  dia,
  hoy,
  acciones,
  onAbrirCielo,
}: {
  dia: DiaSemana
  hoy: string
  acciones: AccionesTarea
  onAbrirCielo: (d: DiaPronostico) => void
}) {
  const { fecha, pron, avisos, tareas } = dia
  const titulo = `titulo-${fecha}`
  const cielo = pron && CIELOS[pron.cielo]
  return (
    <section className="dia-pagina" id={`dia-${fecha}`} data-dia={fecha} aria-labelledby={titulo}>
      <div className="dia-pagina__cab">
        {/* tabIndex: tocar el día en la tira lleva el foco acá, así el lector sigue desde el título */}
        <h2 className="pagina__titulo mano" id={titulo} tabIndex={-1}>
          {tituloDia(fecha, hoy)}
        </h2>
        {/* el de hoy está en el encabezado */}
        {pron && cielo && fecha !== hoy && (
          <button type="button" className="dia-pagina__cielo" onClick={() => onAbrirCielo(pron)}>
            <span style={{ color: cielo.color }} aria-hidden>
              <cielo.Icono size={20} />
            </span>
            {grados(pron)}
            <span className="sr-solo">
              : {cielo.nombre}. Ver el detalle del {nombreDia(fecha)}
            </span>
          </button>
        )}
      </div>
      {avisos.length + tareas.length === 0 ? (
        <p className="sin-nada">Nada anotado</p>
      ) : (
        <ul className="tareas">
          {avisos.map((a) => (
            <ItemAviso key={a.id} aviso={a} />
          ))}
          {tareas.map((t) => (
            <ItemTarea key={t.id} tarea={t} acciones={acciones} />
          ))}
        </ul>
      )}
    </section>
  )
}

/** La casilla dibujada a mano; el tilde se sale del recuadro, como en papel. */
function Casilla() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" aria-hidden focusable="false">
      <path d="M3.6 4.3 C 8.2 3.7, 14.8 3.9, 20.2 4 C 20.5 9.2, 20.4 14.8, 20.1 20.1 C 14 20.5, 8.3 20.3, 3.9 20 C 3.5 14.6, 3.3 9.2, 3.6 4.3 Z" />
      <path className="tilde" d="M6.8 12.2 L 10.6 16.4 L 21.5 3.8" />
    </svg>
  )
}

/** La fuente, con la confianza también en puntos si la dice. */
function Fuente({ texto }: { texto: string }) {
  const n = /confianza (\d+)\/10/.exec(texto)?.[1]
  return (
    <p className="tarea__fuente">
      {texto}
      {n && (
        <span className="confianza" aria-hidden>
          {puntosConfianza(Number(n)).map((p, i) => (
            <i key={i} className={`es-${p}`} />
          ))}
        </span>
      )}
    </p>
  )
}

/** Título y línea corta; lo que explica, plegado. Lo que es instrucción queda a la vista. */
function Plegable({
  titulo,
  linea,
  instruccion,
  children,
}: {
  titulo: string
  linea?: ReactNode
  instruccion?: string
  children: ReactNode
}) {
  const [abierta, setAbierta] = useState(false)
  const panel = useId()
  return (
    <div className="tarea__cuerpo">
      <button
        type="button"
        className="tarea__abrir"
        aria-expanded={abierta}
        aria-controls={panel}
        onClick={() => setAbierta((v) => !v)}
      >
        <span>
          <span className="tarea__titulo">{titulo}</span>
          {linea && <span className="tarea__linea">{linea}</span>}
        </span>
        <IconoDesplegar size={22} className={`tarea__galon galon ${abierta ? 'es-abierto' : ''}`} />
      </button>
      {instruccion && <p className="tarea__detalle">{instruccion}</p>}
      <div id={panel} className="tarea__porque" hidden={!abierta}>
        {children}
      </div>
    </div>
  )
}

/** El aviso no se tilda: es el tiempo, no algo que hacer. Lo que pide hacer queda a la vista. */
function ItemAviso({ aviso: a }: { aviso: AvisoClima }) {
  const { Icono, color } = AVISO[a.tipo]
  return (
    <li className="tarea es-aviso">
      <span className="tarea__icono" style={{ color }} aria-hidden>
        <Icono size={24} />
      </span>
      <Plegable titulo={a.titulo} linea={a.linea} instruccion={a.instruccion}>
        {!a.instruccion && <p className="tarea__detalle">{a.detalle}</p>}
        <Fuente texto={a.fuente} />
      </Plegable>
    </li>
  )
}

function ItemTarea({ tarea: t, acciones }: { tarea: Tarea; acciones: AccionesTarea }) {
  const { dondeDe, conAsomo, marcadas, onMarcar, onPosponer } = acciones
  const donde = dondeDe(t)
  const asomo = conAsomo(t)
  const marcada = marcadas.has(t.id)
  // dos casillas seguidas no dicen de qué tarea es cada una
  const deCual = donde ? `${t.titulo}, ${donde}` : t.titulo
  // sin planta lo que la separa es el día, y ya está en el título de la página
  const lugar = t.plantaId ? donde : undefined
  const partes: ReactNode[] = [
    t.atrasada && (
      <span key="a" className="tarea__atrasada">
        atrasada
      </span>
    ),
    lugar,
    t.linea,
  ].filter(Boolean)
  const linea = partes.length ? partes.flatMap((p, i) => (i ? [' · ', p] : [p])) : undefined
  const ver = t.plantaId
    ? { a: `/huerta/${t.plantaId}`, texto: 'Ver la planta' }
    : t.composteraId
      ? { a: `/huerta/compostera/${t.composteraId}`, texto: 'Ver la compostera' }
      : null
  return (
    <li className={`tarea ${marcada ? 'es-hecha' : ''}`}>
      <button
        type="button"
        className="casilla"
        role="checkbox"
        aria-checked={marcada}
        aria-label={`${asomo ? 'Asomó' : 'Hecho'}: ${deCual}`}
        onClick={(e) => onMarcar(t, e.currentTarget)}
      >
        <Casilla />
        {marcada && (
          <span className="brote-hecho brotar" aria-hidden>
            <IconoHoja size={16} />
          </span>
        )}
      </button>
      <Plegable titulo={t.titulo} linea={linea} instruccion={t.instruccion}>
        {!t.instruccion && <p className="tarea__detalle">{t.detalle}</p>}
        {/* de dónde sale: sin esto, es una app que manda sin explicar */}
        <Fuente texto={t.fuente} />
        <div className="tarea__botones">
          {/* no se saca: es la válvula de escape de una app que manda */}
          <button type="button" className="lapiz" onClick={(e) => onPosponer(t, e.currentTarget)}>
            {asomo ? 'Todavía no asomó' : 'Más tarde'}
            <span className="sr-solo">: {deCual}</span>
          </button>
          {ver && (
            <Link to={ver.a} className="ver-todas">
              {ver.texto}
              <span className="sr-solo">: {deCual}</span>
            </Link>
          )}
        </div>
      </Plegable>
    </li>
  )
}

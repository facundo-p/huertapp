import { Fragment, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Header } from '../components/Header'
import { EmptyState } from '../components/EmptyState'
import { BottomSheet } from '../components/BottomSheet'
import { FilaChips } from '../components/FilaChips'
import { AnilloAnual } from '../components/AnilloAnual'
import { ConfidenceBadge } from '../components/ConfidenceBadge'
import { useEspecies } from '../lib/useEspecies'
import { useZona, ZONAS_INFO } from '../lib/zona'
import { useHuerta } from '../lib/huerta/store'
import { hoyISO } from '../lib/huerta/tipos'
import {
  decadasDeCapa,
  decadasDeCosecha,
  filasCalendario,
  terciosDelMes,
  type CapaCalendario,
} from '../lib/grillaCalendario'
import { type EstadoMes } from '../lib/data/especies'
import { nombreCorto } from '../lib/data/slugs'
import { METODOS, metodosPorMes, textoDecadas, textoMeses } from '../lib/calendario'
import {
  INICIALES_MES,
  NOMBRES_MES,
  NOMBRES_TERCIO,
  decadaDe,
  decadasDelMes,
  mesDeDecada,
  nombreDecada,
  tercioDeDecada,
} from '../lib/fechas'
import {
  GRUPOS,
  IconoCalendario,
  IconoCosechar,
  IconoDesplegar,
  IconoGrupo,
  IconoSembrar,
  IconoTrasplantar,
} from '../icons'
import type { Decada, EspecieEnriquecida, Grupo, Mes, Zona } from '../lib/data/types'
import type { Planta } from '../lib/huerta/tipos'
import './Calendario.css'

const MESES = Array.from({ length: 12 }, (_, i) => (i + 1) as Mes)
const ORDEN_GRUPOS = Object.keys(GRUPOS) as Grupo[]

export function Calendario() {
  const { indice, cargando } = useEspecies()
  const zona = useZona()
  const { plantas } = useHuerta()
  const hoy = hoyISO()
  const decadaHoy = decadaDe(new Date())
  const mesHoy = mesDeDecada(decadaHoy)

  const [capa, setCapa] = useState<CapaCalendario>('siembra')
  const [grupo, setGrupo] = useState<Grupo | null>(null)
  const [soloMia, setSoloMia] = useState(false)
  // arranca abierto en el mes en curso; un solo mes abierto a la vez
  const [mesAbierto, setMesAbierto] = useState<Mes | null>(mesHoy)
  const [elegida, setElegida] = useState<EspecieEnriquecida | null>(null)
  const [abiertas, setAbiertas] = useState<ReadonlySet<string>>(new Set())

  function alternar(slug: string) {
    setAbiertas((s) => {
      const n = new Set(s)
      if (!n.delete(slug)) n.add(slug)
      return n
    })
  }

  const secciones = useMemo(
    () => (indice ? filasCalendario(indice.porGrupo, ORDEN_GRUPOS, plantas, zona, { capa, soloMia, grupo }) : []),
    [indice, plantas, capa, soloMia, grupo, zona],
  )

  const total = secciones.reduce((n, s) => n + s.filas.length, 0)
  const hayMias = plantas.some((p) => !p.archivada && p.etapa !== 'terminada')

  return (
    <div className="pantalla">
      <Header titulo="Calendario" sobretitulo={`${nombreDecada(decadaHoy)} · ${ZONAS_INFO[zona].etiqueta}`} />

      <div className="calendario__controles">
        <div className="segmentado" role="group" aria-label="Qué mostrar en la matriz">
          <Segmento activo={capa === 'siembra'} onClick={() => setCapa('siembra')} Icono={IconoSembrar}>
            Siembra
          </Segmento>
          <Segmento
            activo={capa === 'trasplante'}
            onClick={() => setCapa('trasplante')}
            Icono={IconoTrasplantar}
          >
            Trasplante
          </Segmento>
          <Segmento activo={capa === 'cosecha'} onClick={() => setCapa('cosecha')} Icono={IconoCosechar}>
            Cosecha
          </Segmento>
        </div>

        <FilaChips
          etiqueta="Grupo"
          opciones={Object.entries(GRUPOS).map(([k, v]) => ({ valor: k, ...v }))}
          activo={grupo}
          onElegir={(v) => setGrupo(v as Grupo | null)}
        />

        <div className="calendario__pie-controles">
          {/* Solo mi huerta: existe cuando hay algo plantado; si no, la
              pregunta no tiene sentido y el chip sería un botón muerto */}
          {hayMias && (
            <button
              type="button"
              className={`calendario__mia ${soloMia ? 'es-activo' : ''}`}
              onClick={() => setSoloMia((v) => !v)}
              aria-pressed={soloMia}
            >
              <span className="calendario__mia-pildora">Solo mi huerta</span>
            </button>
          )}
          <p className="calendario__cuenta" aria-live="polite">
            {cargando
              ? 'Cargando…'
              : capa === 'trasplante'
                ? `${total} se trasplantan`
                : `${total} especies`}
          </p>
          <p className="calendario__leyenda">
            {capa === 'cosecha' ? (
              <>
                <Muestra capa={capa} estado="ideal" /> ventana de cosecha
              </>
            ) : (
              <>
                <Muestra capa={capa} estado="ideal" /> ideal
                <Muestra capa={capa} estado="posible" /> se puede
              </>
            )}
          </p>
        </div>

        {/* Las iniciales no se tocan: a 20 px de columna no hay target de 44
            posible. El panel del mes se navega con sus flechas. */}
        <div className="cal-fila cal-cabecera" aria-hidden>
          <span className="cal-cabecera__hueco">cada mes en 3</span>
          {MESES.map((m) => (
            <span key={m} className="cal-celda">
              <span
                className={`cal-inicial ${m === mesHoy ? 'es-ahora' : ''} ${m === mesAbierto ? 'es-abierto' : ''}`}
              >
                {INICIALES_MES[m - 1]}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="calendario__cuerpo">
        {indice &&
          (mesAbierto ? (
            <PanelMes
              mes={mesAbierto}
              indice={indice}
              plantas={plantas}
              zona={zona}
              hoy={hoy}
              decadaHoy={decadaHoy}
              onMes={setMesAbierto}
              onCerrar={() => setMesAbierto(null)}
            />
          ) : (
            <button type="button" className="calendario__abrir-mes" onClick={() => setMesAbierto(mesHoy)}>
              Qué se siembra, mes a mes
            </button>
          ))}

        {!cargando && total === 0 && (
          <EmptyState
            Icono={IconoCalendario}
            titulo="Nada para mostrar acá"
            texto="Ese grupo se siembra siempre de forma directa, así que no tiene trasplante. Probá con la capa de siembra."
          />
        )}

        {secciones.map(({ grupo: g, filas }) => (
          <section key={g} className="calendario__seccion">
            {/* el encabezado usa la misma grilla para que la banda del mes
                actual baje sin cortarse por toda la matriz */}
            <h2 className="cal-fila calendario__grupo">
              <span className="calendario__grupo-nombre">
                <IconoGrupo grupo={g} size={17} decorativo />
                {GRUPOS[g].etiqueta}
                <span className="calendario__grupo-cuenta">{filas.length}</span>
              </span>
              {MESES.map((m) => (
                <Celda key={m} mes={m} decadaHoy={decadaHoy} vacia />
              ))}
            </h2>
            {filas.map(({ especie: e, decadas, enMiHuerta }) => (
              <Fragment key={e.slug}>
                <FilaEspecie
                  especie={e}
                  capa={capa}
                  decadas={decadas}
                  enMiHuerta={enMiHuerta}
                  decadaHoy={decadaHoy}
                  onAbrir={() => setElegida(e)}
                />
                {/* Plegadas por defecto: son once filas más sobre 55, y en la
                    pantalla más apretada de la app eso se nota. */}
                {e.variedades.length > 0 && (
                  <button
                    className="cal-desplegar"
                    aria-expanded={abiertas.has(e.slug)}
                    onClick={() => alternar(e.slug)}
                  >
                    <span className={abiertas.has(e.slug) ? 'cal-desplegar__flecha es-abierta' : 'cal-desplegar__flecha'}>
                      <IconoDesplegar size={13} />
                    </span>
                    {abiertas.has(e.slug)
                      ? 'ocultar variedades'
                      : `${e.variedades.length} variedades`}
                  </button>
                )}
                {abiertas.has(e.slug) &&
                  e.variedades.map((v) => {
                    const hija = indice!.porSlug.get(v.slug)
                    if (!hija) return null
                    return (
                      <FilaEspecie
                        key={v.slug}
                        especie={hija}
                        capa={capa}
                        decadas={decadasDeCapa(hija, zona, capa)}
                        decadaHoy={decadaHoy}
                        onAbrir={() => setElegida(hija)}
                        variedad
                      />
                    )
                  })}
              </Fragment>
            ))}
          </section>
        ))}

        <p className="calendario__pie">
          Tocá una especie para ver sus ventanas y de dónde salen. Las fechas vienen por tercios de
          mes, no por día. La cosecha no está en el catálogo: se calcula sumando los días a cosecha
          de cada ventana de siembra.
        </p>
      </div>

      <DetalleMes
        especie={elegida}
        zona={zona}
        decadaHoy={decadaHoy}
        onCerrar={() => setElegida(null)}
      />
    </div>
  )
}

/* ---------- fila de la matriz ---------- */

function FilaEspecie({
  especie,
  capa,
  decadas,
  enMiHuerta,
  decadaHoy,
  onAbrir,
  variedad,
}: {
  especie: EspecieEnriquecida
  capa: CapaCalendario
  decadas: EstadoMes[]
  enMiHuerta?: boolean
  decadaHoy: Decada
  onAbrir: () => void
  /** es una variedad desplegada bajo su especie */
  variedad?: boolean
}) {
  return (
    <button
      className={`cal-fila cal-fila--dato${variedad ? ' cal-fila--variedad' : ''}`}
      onClick={onAbrir}
      aria-label={etiquetaFila(especie, capa, decadas, !!enMiHuerta)}
    >
      <span className="cal-nombre">
        {enMiHuerta && <span className="cal-mia" aria-hidden />}
        {/* La variedad no repite el ícono de grupo ni el nombre de la especie:
            los dos están en la fila de arriba. Se distingue por sangría y por
            su nombre propio, no por color. */}
        {variedad ? (
          <span className="cal-nombre__variedad">{especie.variedad}</span>
        ) : (
          <>
            <IconoGrupo grupo={especie.grupo} size={15} decorativo />
            {nombreCorto(especie.nombre_comun)}
          </>
        )}
      </span>
      {MESES.map((m) => (
        <Celda
          key={m}
          mes={m}
          decadaHoy={decadaHoy}
          capa={capa}
          estados={[decadas[(m - 1) * 3], decadas[(m - 1) * 3 + 1], decadas[(m - 1) * 3 + 2]]}
        />
      ))}
    </button>
  )
}

/**
 * Celda de un mes, partida en sus tres décadas. La precisión sub-mensual entra
 * en el relleno, no en más columnas: la matriz sigue siendo de 12 y entra en
 * 390px. Además una misma celda puede decir "ideal hasta el 20, se puede
 * después", que a resolución mensual era imposible de expresar.
 */
function Celda({
  mes,
  decadaHoy,
  capa,
  estados,
  vacia,
}: {
  mes: Mes
  decadaHoy: Decada
  capa?: CapaCalendario
  estados?: [EstadoMes, EstadoMes, EstadoMes]
  vacia?: boolean
}) {
  const decadas = decadasDelMes(mes)
  const esMesActual = mesDeDecada(decadaHoy) === mes
  return (
    <span className={`cal-celda ${esMesActual ? 'es-mes-ahora' : ''}`} aria-hidden={vacia}>
      {decadas.map((d, i) => (
        <span key={d} className={`cal-tercio ${d === decadaHoy ? 'es-ahora' : ''}`}>
          {/* la década sin ventana también se dibuja, con un filete tenue: sin
              eso los meses vacíos no dejan rastro y, scrolleando 55 filas, se
              vuelve imposible ubicar en qué mes cae cada barra */}
          {!vacia && <span className={`cal-barra es-${capa} ${estados?.[i] ? `es-${estados[i]}` : 'es-nada'}`} />}
        </span>
      ))}
    </span>
  )
}

/* ---------- panel del mes ---------- */

/**
 * Lo que antes era una lista de doce meses vive acá, colapsado dentro del
 * mes que se toca: los tres tercios en palabras, y qué pasa ese tercio en
 * tu huerta si hay ventanas de tus plantas que caigan ahí.
 */
function PanelMes({
  mes,
  indice,
  plantas,
  zona,
  hoy,
  decadaHoy,
  onMes,
  onCerrar,
}: {
  mes: Mes
  indice: { padres: EspecieEnriquecida[]; porSlug: Map<string, EspecieEnriquecida> }
  plantas: Planta[]
  zona: Zona
  hoy: string
  decadaHoy: Decada
  onMes: (m: Mes) => void
  onCerrar: () => void
}) {
  const tercios = useMemo(
    () => terciosDelMes(mes, indice.padres, indice.porSlug, plantas, zona, hoy),
    [mes, indice, plantas, zona, hoy],
  )
  return (
    <section className="panel-mes" aria-label={`${NOMBRES_MES[mes - 1]}, tercio por tercio`}>
      <div className="panel-mes__cabeza">
        <button
          type="button"
          className="panel-mes__nav"
          onClick={() => onMes((((mes + 10) % 12) + 1) as Mes)}
          aria-label="mes anterior"
        >
          ‹
        </button>
        <h2 className="panel-mes__mes">{NOMBRES_MES[mes - 1]}</h2>
        <button
          type="button"
          className="panel-mes__nav"
          onClick={() => onMes(((mes % 12) + 1) as Mes)}
          aria-label="mes siguiente"
        >
          ›
        </button>
        <button type="button" className="panel-mes__cerrar" onClick={onCerrar}>
          cerrar
        </button>
      </div>
      {tercios.map((t) => {
        const esAhora = t.decada === decadaHoy
        return (
          <div key={t.decada} className={`panel-mes__tercio ${esAhora ? 'es-ahora' : ''}`}>
            <p className="panel-mes__rotulo">
              {NOMBRES_TERCIO[tercioDeDecada(t.decada) - 1]}
              {esAhora && <span className="panel-mes__aca">· estás acá</span>}
            </p>
            <div className="panel-mes__texto">
              <p>
                {t.siembra.length === 0
                  ? 'Nada para sembrar en este tercio.'
                  : `${t.siembra.join(', ')}${t.demas > 0 ? ` y ${t.demas} más` : ''}.`}
              </p>
              {t.enTuHuerta.length > 0 && (
                <p className="panel-mes__huerta">En tu huerta: {t.enTuHuerta.join(', ')}.</p>
              )}
            </div>
          </div>
        )
      })}
    </section>
  )
}

/* ---------- hoja de detalle ---------- */

function DetalleMes({
  especie: e,
  zona,
  decadaHoy,
  onCerrar,
}: {
  especie: EspecieEnriquecida | null
  zona: Zona
  decadaHoy: Decada
  onCerrar: () => void
}) {
  return (
    <BottomSheet
      abierto={!!e}
      onCerrar={onCerrar}
      titulo={e?.nombre_comun ?? ''}
      sobretitulo={e?.nombre_cientifico}
      pie={
        e && (
          <Link to={`/explorar/${e.slug}`} className="hoja__accion" onClick={onCerrar}>
            Ver la ficha completa
          </Link>
        )
      }
    >
      {e && (
        <>
          <div className="hoja__anillo">
            <AnilloAnual especie={e} zona={zona} decadaActual={decadaHoy} tamano="grande" conTrasplante />
            <p className="hoja__nota">
              Afuera la siembra, adentro el trasplante. La aguja es {nombreDecada(decadaHoy)}.
            </p>
          </div>

          <dl className="ventanas">
            <Ventana titulo="Siembra ideal" clase="es-ideal" decadas={e.calendario.decadas[zona].siembra_ideal} />
            <Ventana
              titulo="También se puede"
              clase="es-posible"
              decadas={e.calendario.decadas[zona].siembra_posible}
            />
            <Ventana
              titulo="Trasplante ideal"
              clase="es-trasplante"
              decadas={e.calendario.decadas[zona].trasplante_ideal}
            />
            <Ventana
              titulo="Trasplante posible"
              clase="es-trasplante"
              decadas={e.calendario.decadas[zona].trasplante_posible}
            />
            <Ventana
              titulo="Cosecha (calculada)"
              clase="es-cosecha"
              decadas={decadasDeCosecha(e, zona)
                .map((st, i) => (st ? ((i + 1) as Decada) : null))
                .filter((d): d is Decada => d !== null)}
            />
          </dl>

          {metodosPorMes(e.calendario.metodo_por_mes).length > 0 && (
            <div className="hoja__bloque">
              <h3 className="hoja__subtitulo">Cómo sembrar cada mes</h3>
              <ul className="metodos">
                {metodosPorMes(e.calendario.metodo_por_mes).map(({ metodo, meses }) => (
                  <li key={metodo}>
                    <strong>{METODOS[metodo]}</strong> — {textoMeses(meses)}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <p className="hoja__ciclo">{textoCiclo(e)}</p>

          <BloqueAfinado especie={e} zona={zona} />
        </>
      )}
    </BottomSheet>
  )
}

/** La trazabilidad del afinado: qué dijo la fuente y qué le hizo el modelo. */
function BloqueAfinado({ especie: e, zona }: { especie: EspecieEnriquecida; zona: Zona }) {
  const a = e.calendario.afinado
  return (
    <div className="hoja__derivacion">
      <h3 className="hoja__subtitulo">
        De dónde sale este calendario
        <ConfidenceBadge valor={e.calendario.confianza} compacto />
      </h3>
      <p>{e.calendario.derivacion}</p>

      <h3 className="hoja__subtitulo hoja__subtitulo--sep">
        Precisión por décadas
        <ConfidenceBadge valor={a.confianza} compacto />
      </h3>

      {a.estado === 'sin_afinar' && (
        <p className="afinado__sin">
          <strong>Sin afinar:</strong> {a.motivo} Queda a resolución mensual, que es lo honesto.
        </p>
      )}

      {a.nota_fuente && (
        <p className="afinado__fuente">
          <strong>Lo dice la fuente:</strong> {a.nota_fuente}
        </p>
      )}

      {a.estado === 'afinado' && (
        <p>
          {a.ajustes.length === 0
            ? 'El modelo climático no le recortó nada: los meses de la fuente entran enteros.'
            : `Sobre los meses de la fuente, el modelo climático del ${ZONAS_INFO[zona].etiqueta.toLowerCase()} recortó ${a.ajustes.length === 1 ? 'una década' : `${a.ajustes.length} décadas`}:`}
        </p>
      )}

      {a.ajustes.length > 0 && (
        <ul className="afinado__ajustes">
          {a.ajustes.map((x, i) => (
            <li key={i}>
              <strong>{nombreDecada(x.decada)}</strong> — {x.nota}
            </li>
          ))}
        </ul>
      )}

      <p className="afinado__pie">
        Precisión honesta: ±10 días. Las fuentes hablan por mes; los tercios salen de cruzar sus
        datos con las temperaturas del SMN y la estadística de heladas de la FAUBA para{' '}
        {ZONAS_INFO[zona].etiqueta.toLowerCase()}. Se explica entero en el{' '}
        <Link to="/glosario">glosario</Link>.
      </p>
    </div>
  )
}

function Ventana({ titulo, clase, decadas }: { titulo: string; clase: string; decadas: Decada[] }) {
  if (decadas.length === 0) return null
  return (
    <div className={`ventana ${clase}`}>
      <dt>{titulo}</dt>
      <dd>{textoDecadas(decadas)}</dd>
    </div>
  )
}

/* ---------- piezas chicas ---------- */

function Segmento({
  activo,
  onClick,
  Icono,
  children,
}: {
  activo: boolean
  onClick: () => void
  Icono: React.ComponentType<{ size?: number }>
  children: React.ReactNode
}) {
  return (
    <button className={`segmentado__opcion ${activo ? 'es-activo' : ''}`} onClick={onClick} aria-pressed={activo}>
      <Icono size={18} />
      {children}
    </button>
  )
}

/** Muestra de la leyenda, con la misma gramática que las celdas. */
function Muestra({ capa, estado }: { capa: CapaCalendario; estado: 'ideal' | 'posible' }) {
  return (
    <span className="cal-muestra">
      <span className={`cal-barra es-${capa} es-${estado}`} />
    </span>
  )
}

/* ---------- helpers de texto ---------- */

function conPreposicion(texto: string): string {
  if (!texto || texto === 'todo el año' || texto.startsWith('de ') || texto.startsWith('todo ')) return texto
  return `en ${texto}`
}

function etiquetaFila(e: EspecieEnriquecida, capa: CapaCalendario, decadas: EstadoMes[], mia: boolean): string {
  const con = (st: EstadoMes) =>
    decadas.map((x, i) => (x === st ? ((i + 1) as Decada) : null)).filter((d): d is Decada => d !== null)
  const ideal = con('ideal')
  const posible = con('posible')
  const que = capa === 'siembra' ? 'Siembra' : capa === 'trasplante' ? 'Trasplante' : 'Cosecha calculada'
  const partes: string[] = []
  if (ideal.length) partes.push(`${que} ideal ${conPreposicion(textoDecadas(ideal))}`)
  if (posible.length) partes.push(`se puede ${conPreposicion(textoDecadas(posible))}`)
  if (partes.length === 0) partes.push(`sin ${que.toLowerCase()} en el calendario`)
  return `${e.nombre_comun}${mia ? ' (en mi huerta)' : ''}: ${partes.join('; ')}. Ver el detalle.`
}

function textoCiclo(e: EspecieEnriquecida): string {
  const partes: string[] = []
  if (e.dias_germinacion) partes.push(`germina en ${rango(e.dias_germinacion)} días`)
  if (e.dias_a_trasplante) partes.push(`se trasplanta a los ${rango(e.dias_a_trasplante)} días`)
  if (e.dias_a_cosecha) partes.push(`se cosecha a los ${rango(e.dias_a_cosecha)} días`)
  if (partes.length === 0) return 'Sin datos de duración del ciclo.'
  return `Desde la siembra: ${partes.join(', ')}.`
}

function rango(r: { min: number; max: number }): string {
  return r.min === r.max ? String(r.min) : `${r.min}–${r.max}`
}

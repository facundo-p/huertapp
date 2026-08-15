import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Header } from '../components/Header'
import { EmptyState } from '../components/EmptyState'
import { BottomSheet } from '../components/BottomSheet'
import { FilaChips } from '../components/FilaChips'
import { MonthStrip } from '../components/MonthStrip'
import { ConfidenceBadge } from '../components/ConfidenceBadge'
import { useEspecies } from '../lib/useEspecies'
import { useZona, ZONAS_INFO } from '../lib/zona'
import { estadosDelMes, seTrasplanta, type Capa, type EstadoMes } from '../lib/data/especies'
import { nombreCorto } from '../lib/data/slugs'
import { METODOS, metodosPorMes, textoDecadas, textoMeses } from '../lib/calendario'
import { INICIALES_MES, decadaDe, decadasDelMes, mesDeDecada, nombreDecada } from '../lib/fechas'
import { GRUPOS, IconoCalendario, IconoGrupo, IconoSembrar, IconoTrasplantar } from '../icons'
import type { Decada, EspecieEnriquecida, Grupo, Mes, Zona } from '../lib/data/types'
import './Calendario.css'

const MESES = Array.from({ length: 12 }, (_, i) => (i + 1) as Mes)
const ORDEN_GRUPOS = Object.keys(GRUPOS) as Grupo[]

export function Calendario() {
  const { indice, cargando } = useEspecies()
  const zona = useZona()
  const decadaHoy = decadaDe(new Date())

  const [capa, setCapa] = useState<Capa>('siembra')
  const [grupo, setGrupo] = useState<Grupo | null>(null)
  const [elegida, setElegida] = useState<EspecieEnriquecida | null>(null)

  const secciones = useMemo(() => {
    if (!indice) return []
    return ORDEN_GRUPOS.filter((g) => !grupo || g === grupo)
      .map((g) => ({
        grupo: g,
        especies: (indice.porGrupo.get(g) ?? [])
          .filter((e) => capa === 'siembra' || seTrasplanta(e, zona))
          .sort((a, b) => a.nombre_comun.localeCompare(b.nombre_comun, 'es')),
      }))
      .filter((s) => s.especies.length > 0)
  }, [indice, capa, grupo, zona])

  const total = secciones.reduce((n, s) => n + s.especies.length, 0)

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
        </div>

        <FilaChips
          etiqueta="Grupo"
          opciones={Object.entries(GRUPOS).map(([k, v]) => ({ valor: k, ...v }))}
          activo={grupo}
          onElegir={(v) => setGrupo(v as Grupo | null)}
        />

        <div className="calendario__pie-controles">
          <p className="calendario__cuenta" aria-live="polite">
            {cargando
              ? 'Cargando…'
              : capa === 'siembra'
                ? `${total} especies`
                : `${total} se trasplantan`}
          </p>
          <p className="calendario__leyenda">
            <Muestra capa={capa} estado="ideal" /> ideal
            <Muestra capa={capa} estado="posible" /> se puede
          </p>
        </div>

        <div className="cal-fila cal-cabecera" aria-hidden>
          <span className="cal-cabecera__hueco">cada mes en 3</span>
          {MESES.map((m) => (
            <span key={m} className="cal-celda">
              <span className={`cal-inicial ${m === mesDeDecada(decadaHoy) ? 'es-ahora' : ''}`}>
                {INICIALES_MES[m - 1]}
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="calendario__cuerpo">
        {!cargando && total === 0 && (
          <EmptyState
            Icono={IconoCalendario}
            titulo="Nada para mostrar acá"
            texto="Ese grupo se siembra siempre de forma directa, así que no tiene trasplante. Probá con la capa de siembra."
          />
        )}

        {secciones.map(({ grupo: g, especies }) => (
          <section key={g} className="calendario__seccion">
            {/* el encabezado usa la misma grilla para que la banda del mes
                actual baje sin cortarse por toda la matriz */}
            <h2 className="cal-fila calendario__grupo">
              <span className="calendario__grupo-nombre">
                <IconoGrupo grupo={g} size={17} decorativo />
                {GRUPOS[g].etiqueta}
                <span className="calendario__grupo-cuenta">{especies.length}</span>
              </span>
              {MESES.map((m) => (
                <Celda key={m} mes={m} decadaHoy={decadaHoy} vacia />
              ))}
            </h2>
            {especies.map((e) => (
              <FilaEspecie
                key={e.slug}
                especie={e}
                capa={capa}
                zona={zona}
                decadaHoy={decadaHoy}
                onAbrir={() => setElegida(e)}
              />
            ))}
          </section>
        ))}
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
  zona,
  decadaHoy,
  onAbrir,
}: {
  especie: EspecieEnriquecida
  capa: Capa
  zona: Zona
  decadaHoy: Decada
  onAbrir: () => void
}) {
  return (
    <button
      className="cal-fila cal-fila--dato"
      onClick={onAbrir}
      aria-label={etiquetaFila(especie, capa, zona)}
    >
      <span className="cal-nombre">
        <IconoGrupo grupo={especie.grupo} size={15} decorativo />
        {nombreCorto(especie.nombre_comun)}
      </span>
      {MESES.map((m) => (
        <Celda
          key={m}
          mes={m}
          decadaHoy={decadaHoy}
          capa={capa}
          estados={estadosDelMes(especie, m, zona, capa)}
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
  capa?: Capa
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
          <div>
            <MonthStrip especie={e} zona={zona} decadaActual={decadaHoy} conTrasplante conEtiquetas />
            <p className="hoja__nota">
              Cada mes va partido en tres. El marco de tinta es {nombreDecada(decadaHoy)}.
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
function Muestra({ capa, estado }: { capa: Capa; estado: 'ideal' | 'posible' }) {
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

function etiquetaFila(e: EspecieEnriquecida, capa: Capa, zona: Zona): string {
  const v = e.calendario.decadas[zona]
  const ideal = capa === 'siembra' ? v.siembra_ideal : v.trasplante_ideal
  const posible = capa === 'siembra' ? v.siembra_posible : v.trasplante_posible
  const que = capa === 'siembra' ? 'Siembra' : 'Trasplante'
  const partes: string[] = []
  if (ideal.length) partes.push(`${que} ideal ${conPreposicion(textoDecadas(ideal))}`)
  if (posible.length) partes.push(`se puede ${conPreposicion(textoDecadas(posible))}`)
  if (partes.length === 0) partes.push(`sin ${que.toLowerCase()} en el calendario`)
  return `${e.nombre_comun}: ${partes.join('; ')}. Ver el detalle.`
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

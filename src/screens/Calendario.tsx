import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Header } from '../components/Header'
import { EmptyState } from '../components/EmptyState'
import { BottomSheet } from '../components/BottomSheet'
import { FilaChips } from '../components/FilaChips'
import { MonthStrip } from '../components/MonthStrip'
import { ConfidenceBadge } from '../components/ConfidenceBadge'
import { useEspecies } from '../lib/useEspecies'
import { estadoSiembra, estadoTrasplante, type EstadoMes } from '../lib/data/especies'
import { nombreCorto } from '../lib/data/slugs'
import { METODOS, metodosPorMes, textoMeses } from '../lib/calendario'
import { INICIALES_MES, NOMBRES_MES, mesDe } from '../lib/fechas'
import { GRUPOS, IconoCalendario, IconoGrupo, IconoSembrar, IconoTrasplantar } from '../icons'
import type { EspecieEnriquecida, Grupo, Mes } from '../lib/data/types'
import './Calendario.css'

type Capa = 'siembra' | 'trasplante'

const MESES = Array.from({ length: 12 }, (_, i) => (i + 1) as Mes)
const ORDEN_GRUPOS = Object.keys(GRUPOS) as Grupo[]

export function Calendario() {
  const { indice, cargando } = useEspecies()
  const mesHoy = mesDe(new Date())

  const [capa, setCapa] = useState<Capa>('siembra')
  const [grupo, setGrupo] = useState<Grupo | null>(null)
  const [elegida, setElegida] = useState<EspecieEnriquecida | null>(null)

  const secciones = useMemo(() => {
    if (!indice) return []
    return ORDEN_GRUPOS.filter((g) => !grupo || g === grupo)
      .map((g) => ({
        grupo: g,
        especies: (indice.porGrupo.get(g) ?? [])
          .filter((e) => capa === 'siembra' || seTrasplanta(e))
          .sort((a, b) => a.nombre_comun.localeCompare(b.nombre_comun, 'es')),
      }))
      .filter((s) => s.especies.length > 0)
  }, [indice, capa, grupo])

  const total = secciones.reduce((n, s) => n + s.especies.length, 0)

  return (
    <div className="pantalla">
      <Header titulo="Calendario" sobretitulo="El año entero, de un vistazo" />

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
                : `${total} especies se trasplantan`}
          </p>
          <p className="calendario__leyenda">
            <Marca capa={capa} estado="ideal" /> ideal
            <Marca capa={capa} estado="posible" /> se puede
          </p>
        </div>

        <div className="cal-fila cal-cabecera" aria-hidden>
          <span className="cal-cabecera__hueco">{NOMBRES_MES[mesHoy - 1]}</span>
          {MESES.map((m) => (
            <span key={m} className="cal-celda">
              <span className={`cal-inicial ${m === mesHoy ? 'es-ahora' : ''}`}>
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
                <span key={m} className={`cal-celda ${m === mesHoy ? 'es-ahora' : ''}`} aria-hidden />
              ))}
            </h2>
            {especies.map((e) => (
              <FilaEspecie
                key={e.slug}
                especie={e}
                capa={capa}
                mesHoy={mesHoy}
                onAbrir={() => setElegida(e)}
              />
            ))}
          </section>
        ))}
      </div>

      <DetalleMes especie={elegida} onCerrar={() => setElegida(null)} mesHoy={mesHoy} />
    </div>
  )
}

/* ---------- fila de la matriz ---------- */

function FilaEspecie({
  especie,
  capa,
  mesHoy,
  onAbrir,
}: {
  especie: EspecieEnriquecida
  capa: Capa
  mesHoy: Mes
  onAbrir: () => void
}) {
  const estadoDe = capa === 'siembra' ? estadoSiembra : estadoTrasplante
  return (
    <button className="cal-fila cal-fila--dato" onClick={onAbrir} aria-label={etiquetaFila(especie, capa)}>
      <span className="cal-nombre">
        <IconoGrupo grupo={especie.grupo} size={15} decorativo />
        {nombreCorto(especie.nombre_comun)}
      </span>
      {MESES.map((m) => {
        const estado = estadoDe(especie, m)
        return (
          <span key={m} className={`cal-celda ${m === mesHoy ? 'es-ahora' : ''}`}>
            {estado && <Marca capa={capa} estado={estado} />}
          </span>
        )
      })}
    </button>
  )
}

/* ---------- hoja de detalle ---------- */

function DetalleMes({
  especie,
  onCerrar,
  mesHoy,
}: {
  especie: EspecieEnriquecida | null
  onCerrar: () => void
  mesHoy: Mes
}) {
  const e = especie
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
            <MonthStrip especie={e} mesActual={mesHoy} conTrasplante conEtiquetas />
            <p className="hoja__nota">El marco de tinta es {NOMBRES_MES[mesHoy - 1]}.</p>
          </div>

          <dl className="ventanas">
            <Ventana titulo="Siembra ideal" clase="es-ideal" meses={e.calendario.siembra_ideal} />
            <Ventana titulo="También se puede" clase="es-posible" meses={e.calendario.siembra_posible} />
            <Ventana
              titulo="Trasplante ideal"
              clase="es-trasplante"
              meses={e.calendario.trasplante_ideal}
            />
            <Ventana
              titulo="Trasplante posible"
              clase="es-trasplante"
              meses={e.calendario.trasplante_posible}
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

          <div className="hoja__derivacion">
            <h3 className="hoja__subtitulo">
              De dónde sale este calendario
              <ConfidenceBadge valor={e.calendario.confianza} compacto />
            </h3>
            <p>{e.calendario.derivacion}</p>
          </div>
        </>
      )}
    </BottomSheet>
  )
}

function Ventana({ titulo, clase, meses }: { titulo: string; clase: string; meses: Mes[] }) {
  if (meses.length === 0) return null
  return (
    <div className={`ventana ${clase}`}>
      <dt>{titulo}</dt>
      <dd>{textoMeses(meses)}</dd>
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

/**
 * La marca de la celda. La forma cambia con la capa (cuadrado = siembra,
 * triángulo = trasplante) y el relleno con la certeza (lleno = ideal,
 * contorno = posible): el color nunca es el único canal.
 */
function Marca({ capa, estado }: { capa: Capa; estado: Exclude<EstadoMes, null> }) {
  const ideal = estado === 'ideal'
  const comun = {
    fill: ideal ? 'currentColor' : capa === 'siembra' ? 'var(--posible-fondo)' : 'var(--terracota-suave)',
    stroke: 'currentColor',
    strokeWidth: ideal ? 0 : 1.8,
  }
  return (
    <svg viewBox="0 0 12 12" className={`cal-marca es-${capa} es-${estado}`} aria-hidden>
      {capa === 'siembra' ? (
        <rect x="1.2" y="1.2" width="9.6" height="9.6" rx="3" {...comun} />
      ) : (
        <path d="M6 1.5 L11 10.5 L1 10.5 Z" strokeLinejoin="round" {...comun} />
      )}
    </svg>
  )
}

/* ---------- helpers de texto ---------- */

function seTrasplanta(e: EspecieEnriquecida): boolean {
  return e.calendario.trasplante_ideal.length + e.calendario.trasplante_posible.length > 0
}

/** "de agosto a octubre" queda igual; "agosto" pasa a "en agosto". */
function conPreposicion(texto: string): string {
  if (!texto || texto === 'todo el año' || texto.startsWith('de ')) return texto
  return `en ${texto}`
}

function etiquetaFila(e: EspecieEnriquecida, capa: Capa): string {
  const c = e.calendario
  const ideal = capa === 'siembra' ? c.siembra_ideal : c.trasplante_ideal
  const posible = capa === 'siembra' ? c.siembra_posible : c.trasplante_posible
  const que = capa === 'siembra' ? 'Siembra' : 'Trasplante'
  const partes: string[] = []
  if (ideal.length) partes.push(`${que} ideal ${conPreposicion(textoMeses(ideal))}`)
  if (posible.length) partes.push(`se puede ${conPreposicion(textoMeses(posible))}`)
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

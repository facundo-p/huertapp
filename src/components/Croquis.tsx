import type { CSSProperties, ReactNode } from 'react'
import { Link, useNavigate } from 'react-router'
import type { EspecieEnriquecida } from '../lib/data/types'
import type { Planta, Ubicacion } from '../lib/huerta/tipos'
import { mayus } from '../lib/fechas'
import { ocupacionDe } from '../lib/huerta/lugar'
import {
  ETAPA_DIBUJO_TEXTO,
  corrida,
  etapaDibujo,
  manchones,
  type Atencion,
  type EtapaDibujo,
  type GrillaLugar,
} from '../lib/huerta/croquis'
import { Dibujo, FORMA_DE_GRUPO, Plantita } from '../dibujos'
import { IconoDesplegar, IconoEscarcha } from '../icons'
import './Croquis.css'

export interface LugarCroquis {
  /** sin ubicación son las plantas que no tienen lugar asignado */
  ubicacion?: Ubicacion
  plantas: Planta[]
  grilla: GrillaLugar
}

interface Props {
  /** ya empaquetados: el orden a la vista es el del foco y el de la lista */
  lugares: LugarCroquis[]
  porSlug: Map<string, EspecieEnriquecida>
  atencion: Map<string, Atencion>
  /** las plantas a tapar y qué decirles, o null si en la semana no hiela */
  copo: { ids: Set<string>; texto: string } | null
  hoy: string
  plegado: boolean
  onPlegar: () => void
  onIrALugar: (id: string | undefined) => void
}

interface Dibujada {
  planta: Planta
  especie?: EspecieEnriquecida
  etapa: EtapaDibujo
}

// lo sembrado, en minúscula como en el cuaderno: el apodo va en el nombre accesible
const nombreCorto = (d: Dibujada) => (d.especie?.nombre_comun ?? d.planta.slug).toLowerCase()

/**
 * Mi huerta vista desde arriba, sobre hoja cuadriculada. Sale sólo de lo
 * cargado (`lib/huerta/croquis.ts`); acá se dibuja. La identidad y la atención
 * van en HTML: el SVG sólo pone papel y plantas.
 */
export function Croquis({ lugares, porSlug, atencion, copo, hoy, plegado, onPlegar, onIrALugar }: Props) {
  const dibujadas = new Map<string, Dibujada>()
  for (const l of lugares) {
    for (const p of l.plantas) {
      if (!l.grilla.celdas.includes(p.id)) continue
      const especie = porSlug.get(p.slug)
      const etapa = etapaDibujo(p, especie, hoy)
      if (etapa) dibujadas.set(p.id, { planta: p, especie, etapa })
    }
  }

  // la leyenda nombra sólo lo que está dibujado
  const ids = [...dibujadas.keys()]
  const marcas = {
    bandera: ids.some((id) => atencion.has(id) && !atencion.get(id)!.atrasada),
    atrasada: ids.some((id) => atencion.get(id)?.atrasada),
    copo: !!copo && ids.some((id) => copo.ids.has(id)),
    semilla: [...dibujadas.values()].some((d) => d.etapa === 'semilla'),
  }
  const hayLeyenda = Object.values(marcas).some(Boolean)

  return (
    <>
      {hayLeyenda && (
        // sin el croquis, la leyenda describe marcas que no se ven
        <p className="croquis-leyenda" id="croquis-leyenda" hidden={plegado}>
          {marcas.bandera && (
            <span>
              <Banderita cuantas={1} atrasada={false} />
              algo para hacer
            </span>
          )}
          {marcas.atrasada && (
            <span>
              <Banderita cuantas={1} atrasada />
              atrasado
            </span>
          )}
          {marcas.copo && (
            <span>
              <Copo />
              tapar si hiela
            </span>
          )}
          {marcas.semilla && (
            <span>
              <Plantita forma="hoja" etapa="semilla" size={24} />
              no asomó
            </span>
          )}
        </p>
      )}
      <section className="croquis" aria-labelledby="croquis-titulo">
        <h2 className="croquis__cab" id="croquis-titulo">
          <button
            type="button"
            className="croquis__plegar mano"
            aria-expanded={!plegado}
            aria-controls={hayLeyenda ? 'croquis-plano croquis-leyenda' : 'croquis-plano'}
            onClick={onPlegar}
          >
            <IconoDesplegar size={20} />
            Croquis
          </button>
        </h2>
        <div className="croquis__plano" id="croquis-plano" hidden={plegado}>
          {lugares.map((l) => (
            <LugarDibujado
              key={l.ubicacion?.id ?? 'sin'}
              lugar={l}
              dibujadas={dibujadas}
              atencion={atencion}
              copo={copo}
              onIrALugar={onIrALugar}
            />
          ))}
        </div>
      </section>
    </>
  )
}

function LugarDibujado({
  lugar: { ubicacion, plantas, grilla: g },
  dibujadas,
  atencion,
  copo,
  onIrALugar,
}: {
  lugar: LugarCroquis
  dibujadas: Map<string, Dibujada>
  atencion: Map<string, Atencion>
  copo: Props['copo']
  onIrALugar: Props['onIrALugar']
}) {
  const navegar = useNavigate()
  const nombre = ubicacion?.nombre ?? 'Sin lugar asignado'
  const siembras = g.celdas.filter((id, i) => id && g.celdas.indexOf(id) === i).length
  const ocupacion =
    (ubicacion && ocupacionDe(ubicacion, plantas)?.texto) ||
    (siembras ? `${siembras} ${siembras === 1 ? 'siembra' : 'siembras'}` : 'todavía vacío')
  const comp = manchones(g)
  const vistas = new Set<string>()
  const nombradas = new Set<number>()
  const misma = (i: number, j: number) => j >= 0 && j < g.cap && g.celdas[j] === g.celdas[i]
  const vacio = !g.celdas.some(Boolean)

  const celdas: ReactNode[] = []
  for (let i = 0; i < g.cols * g.filas; i++) {
    const col = i % g.cols
    const id = i < g.cap ? g.celdas[i] : null
    const d = id ? dibujadas.get(id) : undefined
    if (i >= g.cap || !id || !d) {
      celdas.push(
        <div key={i} className="croquis-celda">
          {i < g.cap && g.clase === 'macetas' && <Maceta vacia />}
          {i < g.cap && g.clase === 'surcos' && <Surco />}
        </div>,
      )
      continue
    }

    const primeraDePlanta = !vistas.has(id)
    const primeraDeManchon = !nombradas.has(comp[i])
    vistas.add(id)
    nombradas.add(comp[i])
    const at = primeraDePlanta ? atencion.get(id) : undefined
    const conCopo = primeraDePlanta && !!copo?.ids.has(id)

    // el contorno a lápiz del manchón: borde y esquina redonda sólo donde no sigue
    const izq = col > 0 && misma(i, i - 1)
    const der = col < g.cols - 1 && misma(i, i + 1)
    const arr = misma(i, i - g.cols)
    const aba = misma(i, i + g.cols)
    const r = (a: boolean, b: boolean) => (a || b ? 0 : 9)
    const estilo: CSSProperties = {
      borderRadius: `${r(arr, izq)}px ${r(arr, der)}px ${r(aba, der)}px ${r(aba, izq)}px`,
    }
    if (g.clase === 'libre') {
      const lado = (sigue: boolean) => (sigue ? 0 : 1.75)
      Object.assign(estilo, {
        borderTopWidth: lado(arr),
        borderRightWidth: lado(der),
        borderBottomWidth: lado(aba),
        borderLeftWidth: lado(izq),
      })
    }

    celdas.push(
      <div
        key={i}
        className={['croquis-celda en-bloque', at && 'con-bandera', conCopo && 'con-copo'].filter(Boolean).join(' ')}
        style={estilo}
      >
        {g.clase === 'macetas' && <Maceta />}
        <Plantita forma={d.especie ? FORMA_DE_GRUPO[d.especie.grupo] : 'hoja'} etapa={d.etapa} />
        {primeraDeManchon && (
          <span
            className="croquis-celda__nombre"
            aria-hidden
            style={{ '--corrida': corrida(g, comp, i) } as CSSProperties}
          >
            {nombreCorto(d)}
          </span>
        )}
        {at && <Banderita cuantas={at.cuantas} atrasada={at.atrasada} />}
        {conCopo && <Copo />}
        {primeraDePlanta ? (
          <Link className="croquis-celda__boton" to={`/huerta/${id}`} aria-label={etiqueta(d, at, conCopo ? copo!.texto : null)} />
        ) : (
          // un enlace por planta para el teclado y el lector; las demás celdas abren sólo al dedo
          <span className="croquis-celda__boton croquis-celda__boton--dedo" aria-hidden onClick={() => navegar(`/huerta/${id}`)} />
        )}
      </div>,
    )
  }

  return (
    <article className={`croquis-lugar croquis-lugar--${g.ancho}`}>
      <h3 className="croquis-lugar__cab">
        {/* aria-label y no un sr-solo adentro: el flex parte el nombre en «fondo , ir» */}
        <button
          type="button"
          className="croquis-lugar__nombre mano"
          aria-label={`${nombre}, ir a sus fechas`}
          onClick={() => onIrALugar(ubicacion?.id)}
        >
          {nombre}
        </button>
      </h3>
      <p className="sr-solo">{ocupacion}</p>
      {g.cap === 0 ? (
        <p className="croquis-lugar__vacio" aria-hidden>
          Todavía vacío
        </p>
      ) : (
        <div className={`croquis-celdas croquis-celdas--${g.clase}`} style={{ '--cols': g.cols } as CSSProperties}>
          {celdas}
          {g.clase === 'surcos' && vacio && (
            <span className="croquis-celdas__libres" aria-hidden>
              <span>{g.cap === 1 ? '1 surco libre' : `${g.cap} surcos libres`}</span>
            </span>
          )}
        </div>
      )}
    </article>
  )
}

/** «Zanahoria · todavía no asomó · 1 para atender, atrasada: fijate si asomó». La plantita es aria-hidden. */
function etiqueta(d: Dibujada, at: Atencion | undefined, copo: string | null): string {
  const nombre = mayus(d.especie?.nombre_comun ?? d.planta.slug) + (d.planta.apodo ? `, ${d.planta.apodo}` : '')
  const partes = [nombre, ETAPA_DIBUJO_TEXTO[d.etapa]]
  if (at) partes.push(`${at.cuantas} para atender${at.atrasada ? ', atrasada' : ''}: ${at.que}`)
  if (copo) partes.push(copo)
  return partes.join(' · ')
}

/** El «!» es para que lo atrasado no se distinga sólo por el color. */
export function Banderita({ cuantas, atrasada }: { cuantas: number; atrasada: boolean }) {
  return (
    <span className={atrasada ? 'banderita es-atrasada' : 'banderita'} aria-hidden>
      <span className="banderita__tela">
        <b>
          {cuantas}
          {atrasada && <i>!</i>}
        </b>
      </span>
    </span>
  )
}

export function Copo() {
  return (
    <span className="copo" aria-hidden>
      <IconoEscarcha size={16} />
    </span>
  )
}

/** La vacía se distingue por el trazo punteado, no por opacidad. */
function Maceta({ vacia = false }: { vacia?: boolean }) {
  return (
    <Dibujo size={50} className="maceta">
      <circle cx="48" cy="48" r="42" strokeDasharray={vacia ? '7.7 7.7' : undefined} />
      <circle className="maceta__tierra" cx="48" cy="48" r="31.7" />
    </Dibujo>
  )
}

function Surco() {
  let d = 'M4 6'
  for (let x = 4; x < 138; x += 20) d += ' q 5 -5 10 0 t 10 0'
  return (
    <svg
      className="surco"
      viewBox="0 0 152 12"
      preserveAspectRatio="none"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeDasharray="1 5"
      aria-hidden
    >
      <path d={d} vectorEffect="non-scaling-stroke" />
    </svg>
  )
}

import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
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
  type AnchoCroquis,
  type Atencion,
  type EtapaDibujo,
  type GrillaLugar,
} from '../lib/huerta/croquis'
import {
  acomodado,
  comoSeguir,
  describir,
  destinoDe,
  dondeEntra,
  dondeEsta,
  enOrden,
  llevar,
  llevarLugar,
  textoLibre,
} from '../lib/huerta/acomodar'
import { guardarAcomodo, ordenarUbicaciones, sinRomper } from '../lib/huerta/store'
import { Dibujo } from '../dibujos'
import {
  IconoBrote,
  IconoCheck,
  IconoCreciendo,
  IconoDandoCosecha,
  IconoDesplegar,
  IconoEscarcha,
  IconoMas,
  IconoNoAsomo,
  type IconProps,
} from '../icons'
import './Semana.css'
import './Croquis.css'

export interface LugarCroquis {
  /** sin ubicación son las plantas que no tienen lugar asignado */
  ubicacion?: Ubicacion
  plantas: Planta[]
  grilla: GrillaLugar
  ancho: AnchoCroquis
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
  acomodando: boolean
  onAcomodar: (acomodando: boolean) => void
}

interface Dibujada {
  planta: Planta
  especie?: EspecieEnriquecida
  etapa: EtapaDibujo
}

/** Lo que el croquis le pasa a un lugar mientras se acomoda. */
interface AcomodoLugar {
  /** las celdas elegidas de este lugar, en orden de lectura */
  sel: number[]
  /** las libres donde entra lo elegido: llevan la marca «+» */
  entra: Set<number>
  /** el lugar entero, para moverlo en la hoja */
  elegido: boolean
  onCelda: (i: number) => void
  onNombre: () => void
}

// lo sembrado, en minúscula como en el cuaderno: el apodo va en el nombre accesible
const nombreCorto = (d: Dibujada) => (d.especie?.nombre_comun ?? d.planta.slug).toLowerCase()
const nombreLargo = (d: Dibujada) =>
  mayus(d.especie?.nombre_comun ?? d.planta.slug) + (d.planta.apodo ? `, ${d.planta.apodo}` : '')

const ICONO_ETAPA: Record<EtapaDibujo, (p: IconProps) => ReactNode> = {
  semilla: IconoNoAsomo,
  brote: IconoBrote,
  creciendo: IconoCreciendo,
  dando: IconoDandoCosecha,
}

const TRASPLANTAR = 'Para pasar plantas a otro lugar está «Trasplantar», en la página de la planta.'

/**
 * Mi huerta vista desde arriba, sobre hoja cuadriculada. Sale de lo cargado y
 * de lo acomodado (`lib/huerta/croquis.ts`); acá se dibuja. La identidad y la
 * atención van en HTML: el SVG sólo pone papel y plantas.
 */
export function Croquis({
  lugares: dados,
  porSlug,
  atencion,
  copo,
  hoy,
  plegado,
  onPlegar,
  onIrALugar,
  acomodando,
  onAcomodar,
}: Props) {
  const [elegidas, setElegidas] = useState<{ lugar: string; celdas: number[] } | null>(null)
  const [lugarElegido, setLugarElegido] = useState<string | null>(null)
  const [aviso, setAviso] = useState('')
  // lo que se está guardando, para que el dibujo no espere a IndexedDB
  const [borrador, setBorrador] = useState<{ id: string; celdas: (string | null)[] } | null>(null)
  const [ordenLocal, setOrdenLocal] = useState<string[] | null>(null)
  const enfocar = useRef<string | null>(null)

  let lugares = borrador
    ? dados.map((l) => (l.ubicacion?.id === borrador.id ? { ...l, grilla: { ...l.grilla, celdas: borrador.celdas } } : l))
    : dados
  if (ordenLocal) lugares = enOrden(lugares, ordenLocal)

  const dibujadas = new Map<string, Dibujada>()
  for (const l of lugares) {
    for (const p of l.plantas) {
      if (!l.grilla.celdas.includes(p.id)) continue
      const especie = porSlug.get(p.slug)
      const etapa = etapaDibujo(p, especie, hoy)
      if (etapa) dibujadas.set(p.id, { planta: p, especie, etapa })
    }
  }
  const nombreDe = (id: string) => {
    const d = dibujadas.get(id)
    return d ? nombreCorto(d) : id
  }

  // lo elegido se relee contra lo guardado: una celda que se vació ya no cuenta
  const lugarSel = acomodando && elegidas ? lugares.find((l) => l.ubicacion?.id === elegidas.lugar) : undefined
  const sel = lugarSel ? elegidas!.celdas.filter((i) => lugarSel.grilla.celdas[i]) : []
  const g = lugarSel?.grilla
  const entra = g && sel.length ? dondeEntra(g, sel, nombreDe) : new Set<number>()
  const movido = acomodando && lugarElegido ? lugares.find((l) => l.ubicacion?.id === lugarElegido) : undefined

  // acomodando, el foco salta por la hoja: que no quede detrás de las pestañas (WCAG 2.4.11)
  useLayoutEffect(() => {
    if (!acomodando) return
    const raiz = document.documentElement
    raiz.style.scrollPaddingBottom = 'calc(var(--tab-ocupa) + 8px)'
    return () => {
      raiz.style.scrollPaddingBottom = ''
    }
  }, [acomodando])

  // React mueve los nodos al reordenar y el foco se cae: vuelve al nombre del que se movió
  useEffect(() => {
    if (!enfocar.current) return
    const el = document.querySelector<HTMLElement>(enfocar.current)
    el?.focus({ preventScroll: true })
    el?.scrollIntoView({ block: 'nearest' })
    enfocar.current = null
  })

  function empezarDeNuevo() {
    setElegidas(null)
    setLugarElegido(null)
    setAviso('')
  }

  function alternarAcomodar() {
    empezarDeNuevo()
    onAcomodar(!acomodando)
  }

  function guardarCeldas(l: LugarCroquis, celdas: (string | null)[]) {
    const hecho = { id: l.ubicacion!.id, celdas }
    setBorrador(hecho)
    const { ubicacion, plantas } = acomodado(l.ubicacion!, l.plantas, l.grilla, celdas)
    sinRomper(guardarAcomodo(ubicacion, plantas).finally(() => setBorrador((b) => (b === hecho ? null : b))))
  }

  function tocarCelda(l: LugarCroquis, i: number) {
    setAviso('')
    setLugarElegido(null)
    if (!l.ubicacion) {
      setAviso(`Lo que no tiene lugar no se acomoda. ${TRASPLANTAR}`)
      return
    }
    const id = l.ubicacion.id
    if (l.grilla.celdas[i]) {
      const antes = lugarSel === l ? sel : []
      const nuevas = antes.includes(i) ? antes.filter((x) => x !== i) : [...antes, i].sort((a, b) => a - b)
      setElegidas(nuevas.length ? { lugar: id, celdas: nuevas } : null)
    } else if (!sel.length) {
      setAviso(textoLibre(l.grilla.clase))
    } else if (lugarSel !== l) {
      setAviso(TRASPLANTAR)
    } else {
      const r = destinoDe(l.grilla, sel, i, nombreDe)
      if ('motivo' in r) {
        setAviso(`No entra ahí: ${r.motivo}.`)
        return
      }
      guardarCeldas(l, llevar(l.grilla.celdas, sel, r.dest))
      setAviso(sel.length === 1 ? 'Listo, ya está en su lugar nuevo.' : 'Listo, ya están en su lugar nuevo.')
      setElegidas(null)
    }
  }

  /** El primer nombre elige el lugar; el segundo dice adónde va: queda en el puesto de ese. */
  function tocarNombre(l: LugarCroquis) {
    if (!l.ubicacion) return
    const a = l.ubicacion.id
    setElegidas(null)
    setAviso('')
    if (!movido || lugarElegido === a) {
      setLugarElegido(lugarElegido === a ? null : a)
      return
    }
    const id = movido.ubicacion!.id
    const r = llevarLugar(lugares, id, a)
    if (!r) {
      setAviso('Ahí queda igual: los lugares chicos van de a dos.')
      return
    }
    const ids = r.orden.map((u) => u.id)
    setOrdenLocal(ids)
    sinRomper(ordenarUbicaciones(r.orden).finally(() => setOrdenLocal((o) => (o === ids ? null : o))))
    setLugarElegido(null)
    setAviso(`${movido.ubicacion!.nombre} quedó en el puesto ${r.puesto + 1} de ${lugares.length}.`)
    enfocar.current = `[data-lugar="${id}"] .croquis-lugar__nombre`
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
              <IconoNoAsomo className="plantita" />
              no asomó
            </span>
          )}
        </p>
      )}
      {acomodando && (
        <p className="croquis-ayuda">
          Tocá las plantas que querés mover y después una marca +. Para mover un lugar, tocá su nombre y después el de
          otro.
        </p>
      )}
      <section className={acomodando ? 'croquis croquis--acomodando' : 'croquis'} aria-labelledby="croquis-titulo">
        <div className="croquis__cab">
          <h2 className="croquis__titulo" id="croquis-titulo">
            {acomodando ? (
              <span className="croquis__plegar mano">Croquis</span>
            ) : (
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
            )}
          </h2>
          {/* el mismo botón entra y sale: el foco no se pierde al cambiar de modo */}
          {!plegado && (
            <button
              type="button"
              className={acomodando ? 'lapiz croquis__acomodar es-listo' : 'lapiz croquis__acomodar'}
              onClick={alternarAcomodar}
            >
              {acomodando && <IconoCheck size={18} />}
              {acomodando ? 'Listo' : 'Acomodar'}
            </button>
          )}
        </div>
        <div className="croquis__plano" id="croquis-plano" hidden={plegado}>
          {lugares.map((l) => (
            <LugarDibujado
              key={l.ubicacion?.id ?? 'sin'}
              lugar={l}
              dibujadas={dibujadas}
              atencion={atencion}
              copo={copo}
              onIrALugar={onIrALugar}
              acomodo={
                acomodando
                  ? {
                      sel: l === lugarSel ? sel : [],
                      entra: l === lugarSel ? entra : new Set(),
                      elegido: l === movido,
                      onCelda: (i) => tocarCelda(l, i),
                      onNombre: () => tocarNombre(l),
                    }
                  : undefined
              }
            />
          ))}
        </div>
      </section>
      {acomodando && (
        // sólo para el lector: quien ve ya ve qué se movió y qué no (#189)
        <div className="sr-solo" aria-live="polite">
          <p>
            {lugarSel && sel.length
              ? `${describir(lugarSel.grilla, sel, nombreDe)}.`
              : movido
                ? `Elegiste ${movido.ubicacion!.nombre}.`
                : aviso || 'No elegiste nada todavía.'}
          </p>
          <p>
            {lugarSel && sel.length
              ? aviso || comoSeguir(lugarSel.grilla, sel, entra.size > 0)
              : movido
                ? aviso || 'Tocá el nombre de otro lugar: va a quedar en su puesto.'
                : 'Tocá una o varias celdas con plantas para elegirlas, o el nombre de un lugar para moverlo.'}
          </p>
        </div>
      )}
    </>
  )
}

function LugarDibujado({
  lugar: { ubicacion, plantas, grilla: g },
  dibujadas,
  atencion,
  copo,
  onIrALugar,
  acomodo,
}: {
  lugar: LugarCroquis
  dibujadas: Map<string, Dibujada>
  atencion: Map<string, Atencion>
  copo: Props['copo']
  onIrALugar: Props['onIrALugar']
  acomodo?: AcomodoLugar
}) {
  const navegar = useNavigate()
  const nombre = ubicacion?.nombre ?? 'Sin lugar asignado'
  const siembras = g.celdas.filter((id, i) => id && g.celdas.indexOf(id) === i).length
  const ocupacion =
    (ubicacion && ocupacionDe(ubicacion, plantas)?.texto) ||
    (siembras ? `${siembras} ${siembras === 1 ? 'siembra' : 'siembras'}` : 'todavía vacío')
  const elegidas = new Set(acomodo?.sel)
  const comp = manchones(g, elegidas)
  const vistas = new Set<string>()
  const nombradas = new Set<number>()
  const misma = (i: number, j: number) => j >= 0 && j < g.cap && g.celdas[j] === g.celdas[i]
  const vacio = !g.celdas.some(Boolean)

  const celdas: ReactNode[] = []
  for (let i = 0; i < g.cols * g.filas; i++) {
    const col = i % g.cols
    const existe = i < g.cap
    const id = existe ? g.celdas[i] : null
    const d = id ? dibujadas.get(id) : undefined
    if (!existe || !id || !d) {
      const entra = !!acomodo?.entra.has(i)
      celdas.push(
        <div key={i} className="croquis-celda">
          {existe && g.clase === 'macetas' && <Maceta vacia />}
          {existe && g.clase === 'surcos' && <Surco />}
          {entra && <MarcaEntra />}
          {/* con key: al llenarse la celda el botón es el mismo, y el foco se queda */}
          {acomodo && existe && ubicacion && (
            <button
              key="boton"
              type="button"
              className="croquis-celda__boton"
              data-celda={i}
              aria-label={`Libre, ${dondeEsta(g, i)}${entra ? ': entra lo elegido' : ''}`}
              onClick={() => acomodo.onCelda(i)}
            />
          )}
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
    const elegida = elegidas.has(i)
    const ancla = elegida && acomodo!.sel[0] === i && acomodo!.sel.length > 1
    const Etapa = ICONO_ETAPA[d.etapa]

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
    if (elegida) {
      // lo elegido se rodea como grupo: entre dos vecinas elegidas no va, porque ahí pasa el nombre
      const lados = [
        !(arr && elegidas.has(i - g.cols)) && 'inset 0 2.5px var(--tinta)',
        !(aba && elegidas.has(i + g.cols)) && 'inset 0 -2.5px var(--tinta)',
        !(izq && elegidas.has(i - 1)) && 'inset 2.5px 0 var(--tinta)',
        !(der && elegidas.has(i + 1)) && 'inset -2.5px 0 var(--tinta)',
      ].filter(Boolean)
      estilo.boxShadow = lados.join(', ') || 'none'
    }

    celdas.push(
      <div
        key={i}
        className={[
          'croquis-celda en-bloque',
          elegida && 'es-elegida',
          at && 'con-bandera',
          conCopo && 'con-copo',
        ]
          .filter(Boolean)
          .join(' ')}
        style={estilo}
      >
        {g.clase === 'macetas' && <Maceta />}
        <Etapa className="plantita" />
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
        {ancla && (
          <span className="croquis-ancla" aria-hidden>
            1
          </span>
        )}
        {acomodo ? (
          <button
            key="boton"
            type="button"
            className="croquis-celda__boton"
            data-celda={i}
            aria-pressed={ubicacion ? elegida : undefined}
            aria-label={
              ubicacion
                ? `${nombreLargo(d)}, ${dondeEsta(g, i)}${ancla ? ', la primera' : ''}`
                : `${nombreLargo(d)}, sin lugar asignado`
            }
            onClick={() => acomodo.onCelda(i)}
          />
        ) : primeraDePlanta ? (
          <Link className="croquis-celda__boton" to={`/huerta/${id}`} aria-label={etiqueta(d, at, conCopo ? copo!.texto : null)} />
        ) : (
          // un enlace por planta para el teclado y el lector; las demás celdas abren sólo al dedo
          <span className="croquis-celda__boton croquis-celda__boton--dedo" aria-hidden onClick={() => navegar(`/huerta/${id}`)} />
        )}
      </div>,
    )
  }

  return (
    <article className={`croquis-lugar croquis-lugar--${g.ancho}`} data-lugar={ubicacion?.id ?? 'sin'}>
      <h3 className="croquis-lugar__cab">
        {!acomodo ? (
          // aria-label y no un sr-solo adentro: el flex parte el nombre en «fondo , ir»
          <button
            type="button"
            className="croquis-lugar__nombre mano"
            aria-label={`${nombre}, ir a sus fechas`}
            onClick={() => onIrALugar(ubicacion?.id)}
          >
            {nombre}
          </button>
        ) : ubicacion ? (
          <button
            type="button"
            className={`croquis-lugar__nombre croquis-lugar__nombre--mover mano${acomodo.elegido ? ' es-elegido' : ''}`}
            aria-pressed={acomodo.elegido}
            aria-label={`${nombre}, mover en la hoja`}
            onClick={acomodo.onNombre}
          >
            {nombre}
          </button>
        ) : (
          // lo que no tiene lugar va siempre al final: no se mueve
          <span className="croquis-lugar__nombre mano">{nombre}</span>
        )}
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
  const partes = [nombreLargo(d), ETAPA_DIBUJO_TEXTO[d.etapa]]
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

/** La marca de Acomodar: una libre donde entra lo elegido. Suelta, en el Glosario. */
export function MarcaEntra({ suelta = false }: { suelta?: boolean }) {
  return (
    <span className={suelta ? 'croquis-meta croquis-meta--suelta' : 'croquis-meta'} aria-hidden>
      <IconoMas size={18} />
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

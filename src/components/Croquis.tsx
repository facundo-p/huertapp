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
  FLECHAS,
  acomodado,
  comoSeguir,
  describir,
  destinoDe,
  dondeEntra,
  dondeEsta,
  enOrden,
  intercambiables,
  intercambiar,
  llevar,
  moverLugar,
  porQueNoSeMueve,
  textoIntercambio,
  textoLibre,
  textoQuedo,
  textoToda,
  trasladar,
} from '../lib/huerta/acomodar'
import { guardarAcomodo, ordenarUbicaciones, sinRomper } from '../lib/huerta/store'
import { Dibujo, FORMA_DE_GRUPO, Plantita } from '../dibujos'
import { IconoCheck, IconoDesplegar, IconoEscarcha, IconoFlecha, IconoMas } from '../icons'
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

/** Una flecha de la barra, con adónde llevaría lo elegido o por qué no puede. */
type Flecha = (typeof FLECHAS)[number] & { r: ReturnType<typeof trasladar> }

// lo sembrado, en minúscula como en el cuaderno: el apodo va en el nombre accesible
const nombreCorto = (d: Dibujada) => (d.especie?.nombre_comun ?? d.planta.slug).toLowerCase()
const nombreLargo = (d: Dibujada) =>
  mayus(d.especie?.nombre_comun ?? d.planta.slug) + (d.planta.apodo ? `, ${d.planta.apodo}` : '')

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
  const [ultima, setUltima] = useState<string | null>(null)
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
  const flechas: Flecha[] = g && sel.length ? FLECHAS.map((f) => ({ ...f, r: trasladar(g, sel, f.dc, f.df, nombreDe) })) : []
  const movido = acomodando && lugarElegido ? lugares.find((l) => l.ubicacion?.id === lugarElegido) : undefined

  const selectorCelda = (lugar: string, i: number) => `[data-lugar="${lugar}"] [data-celda="${i}"]`
  const primera = lugarSel && sel.length ? selectorCelda(elegidas!.lugar, sel[0]) : null

  useEffect(() => {
    if (!enfocar.current) return
    document.querySelector<HTMLElement>(enfocar.current)?.focus({ preventScroll: true })
    enfocar.current = null
  })
  // que la barra no tape lo elegido: el scroll-padding de la barra hace el resto
  useEffect(() => {
    if (primera) document.querySelector(primera)?.scrollIntoView({ block: 'nearest' })
  }, [primera])

  function empezarDeNuevo() {
    setElegidas(null)
    setLugarElegido(null)
    setAviso('')
    setUltima(null)
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
    const planta = l.grilla.celdas[i]
    if (planta) {
      // tocar una celda con planta la suma o la saca de lo elegido
      const antes = lugarSel === l ? sel : []
      const nuevas = antes.includes(i) ? antes.filter((x) => x !== i) : [...antes, i].sort((a, b) => a - b)
      setElegidas(nuevas.length ? { lugar: id, celdas: nuevas } : null)
      setUltima(planta)
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

  function correr(f: Flecha) {
    if (!lugarSel) return
    if ('motivo' in f.r) {
      setAviso(`No se puede correr ${f.texto}: ${f.r.motivo}.`)
      return
    }
    guardarCeldas(lugarSel, llevar(lugarSel.grilla.celdas, sel, f.r.dest))
    setElegidas({ lugar: elegidas!.lugar, celdas: f.r.dest })
    setAviso(textoQuedo(lugarSel.grilla, f.r.dest[0], sel.length > 1))
  }

  /** Toda, Intercambiar y Soltar: el botón puede no volver a estar, y el foco va a la primera elegida. */
  function desdeLaBarra(accion: () => void) {
    enfocar.current = primera
    setAviso('')
    accion()
  }

  function tocarNombre(l: LugarCroquis) {
    if (!l.ubicacion) return
    setElegidas(null)
    setAviso('')
    setLugarElegido(lugarElegido === l.ubicacion.id ? null : l.ubicacion.id)
  }

  function moverElLugar(paso: -1 | 1) {
    if (!movido) return
    const id = movido.ubicacion!.id
    const r = moverLugar(lugares, id, paso)
    if (!r) {
      setAviso(`No puede ir ${paso < 0 ? 'antes' : 'después'}: ${porQueNoSeMueve(lugares, id, paso)}.`)
      return
    }
    const ids = r.orden.map((u) => u.id)
    setOrdenLocal(ids)
    sinRomper(ordenarUbicaciones(r.orden).finally(() => setOrdenLocal((o) => (o === ids ? null : o))))
    setAviso(`Quedó ${r.puesto + 1}.º de ${lugares.length}.`)
    requestAnimationFrame(() => document.querySelector(`[data-lugar="${id}"]`)?.scrollIntoView({ block: 'nearest' }))
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
      {acomodando && (
        <p className="croquis-ayuda">
          Tocá una o varias celdas con plantas, y después una marca + o las flechas de abajo. Para mover un lugar en
          la hoja, tocá su nombre.
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
        <BarraAcomodar
          que={
            lugarSel && sel.length
              ? `${describir(lugarSel.grilla, sel, nombreDe)}.`
              : movido
                ? `Elegiste ${movido.ubicacion!.nombre}.`
                : aviso || 'No elegiste nada todavía.'
          }
          como={
            lugarSel && sel.length
              ? aviso ||
                comoSeguir(
                  lugarSel.grilla,
                  sel,
                  entra.size > 0,
                  flechas.some((f) => 'dest' in f.r),
                )
              : movido
                ? aviso || 'Movelo con «Antes» o «Después».'
                : 'Tocá una o varias celdas con plantas para elegirlas, o el nombre de un lugar para moverlo.'
          }
        >
          {lugarSel && sel.length > 0 && (
            <BotonesCeldas
              lugar={lugarSel}
              sel={sel}
              ultima={ultima}
              nombreDe={nombreDe}
              flechas={flechas}
              onCorrer={correr}
              onToda={(planta) =>
                desdeLaBarra(() =>
                  setElegidas({
                    lugar: elegidas!.lugar,
                    celdas: lugarSel.grilla.celdas.flatMap((x, i) => (x === planta || sel.includes(i) ? [i] : [])),
                  }),
                )
              }
              onIntercambiar={() =>
                desdeLaBarra(() => {
                  const [a, b] = sel
                  const celdas = lugarSel.grilla.celdas
                  guardarCeldas(lugarSel, intercambiar(celdas, a, b))
                  setAviso(textoIntercambio(lugarSel.grilla.clase, nombreDe(celdas[a]!), nombreDe(celdas[b]!)))
                  setElegidas(null)
                })
              }
              onSoltar={() => desdeLaBarra(() => setElegidas(null))}
            />
          )}
          {movido && (
            <div className="acomodar-barra__fila">
              {([-1, 1] as const).map((paso) => {
                const puede = !!moverLugar(lugares, movido.ubicacion!.id, paso)
                const texto = paso < 0 ? 'Antes' : 'Después'
                return (
                  <button
                    key={paso}
                    type="button"
                    className="lapiz acomodar-barra__boton"
                    aria-disabled={!puede || undefined}
                    aria-label={
                      puede ? undefined : `${texto}: ${porQueNoSeMueve(lugares, movido.ubicacion!.id, paso)}`
                    }
                    onClick={() => moverElLugar(paso)}
                  >
                    {texto}
                  </button>
                )
              })}
              <button
                type="button"
                className="lapiz"
                onClick={() => {
                  enfocar.current = `[data-lugar="${movido.ubicacion!.id}"] .croquis-lugar__nombre`
                  setAviso('')
                  setLugarElegido(null)
                }}
              >
                Soltar
              </button>
            </div>
          )}
        </BarraAcomodar>
      )}
    </>
  )
}

function BotonesCeldas({
  lugar,
  sel,
  ultima,
  nombreDe,
  flechas,
  onCorrer,
  onToda,
  onIntercambiar,
  onSoltar,
}: {
  lugar: LugarCroquis
  sel: number[]
  ultima: string | null
  nombreDe: (id: string) => string
  flechas: Flecha[]
  onCorrer: (f: Flecha) => void
  onToda: (planta: string) => void
  onIntercambiar: () => void
  onSoltar: () => void
}) {
  const g = lugar.grilla
  // «Toda» ofrece la última que tocaste, si sigue elegida: la que soltaste no
  const q = ultima && sel.some((i) => g.celdas[i] === ultima) ? ultima : g.celdas[sel.at(-1)!]!
  const faltan = g.celdas.some((x, i) => x === q && !sel.includes(i))
  const cambiar = intercambiables(g, sel)
  return (
    <>
      {(faltan || cambiar) && (
        <div className="acomodar-barra__fila">
          {faltan && (
            <button type="button" className="lapiz" onClick={() => onToda(q)}>
              {textoToda(g.clase, nombreDe(q))}
            </button>
          )}
          {cambiar && (
            <button type="button" className="lapiz" onClick={onIntercambiar}>
              Intercambiar
            </button>
          )}
        </div>
      )}
      {/* las flechas van siempre en la última fila: la barra crece para arriba y no se corren del dedo */}
      <div className="acomodar-barra__fila">
        <div className="acomodar-flechas" role="group" aria-label="Correr lo elegido">
          {flechas.map((f) => {
            const motivo = 'motivo' in f.r ? f.r.motivo : null
            return (
              <button
                key={f.hacia}
                type="button"
                className="acomodar-flecha"
                aria-disabled={motivo ? true : undefined}
                aria-label={`Correr ${f.texto}${motivo ? `: ${motivo}` : ''}`}
                onClick={() => onCorrer(f)}
              >
                <IconoFlecha hacia={f.hacia} size={24} />
              </button>
            )
          })}
        </div>
        <button type="button" className="lapiz" onClick={onSoltar}>
          Soltar
        </button>
      </div>
    </>
  )
}

/**
 * Abajo, arriba de las pestañas. Mide su alto para que el scroll deje lo
 * enfocado arriba de ella y la pantalla alcance a mostrar el final del croquis.
 */
function BarraAcomodar({ que, como, children }: { que: string; como: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  const medir = () => {
    if (ref.current) document.documentElement.style.setProperty('--barra-acomodar', `${ref.current.offsetHeight}px`)
  }
  // en cada render y antes de los efectos del croquis, que hacen scroll contra este alto
  useLayoutEffect(medir)
  useLayoutEffect(() => {
    const raiz = document.documentElement
    raiz.style.scrollPaddingBottom = 'calc(var(--tab-ocupa) + var(--barra-acomodar) + 8px)'
    const obs = new ResizeObserver(medir)
    obs.observe(ref.current!)
    return () => {
      obs.disconnect()
      raiz.style.removeProperty('--barra-acomodar')
      raiz.style.scrollPaddingBottom = ''
    }
  }, [])
  return (
    <div className="acomodar-barra" ref={ref}>
      <div aria-live="polite">
        <p className="acomodar-barra__que">{que}</p>
        <p className="acomodar-barra__como">{como}</p>
      </div>
      {children}
    </div>
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
          {entra && (
            <span className="croquis-meta" aria-hidden>
              <IconoMas size={18} />
            </span>
          )}
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

/** La marca de Acomodar: una libre donde entra lo elegido. */
export function MarcaEntra() {
  return (
    <span className="croquis-meta croquis-meta--suelta" aria-hidden>
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

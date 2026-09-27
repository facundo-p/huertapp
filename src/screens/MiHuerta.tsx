import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Header } from '../components/Header'
import { EmptyState } from '../components/EmptyState'
import { NoSePudoLeer } from '../components/AvisoDatos'
import { TarjetaLugar } from '../components/TarjetaLugar'
import { Croquis } from '../components/Croquis'
import { AltaPlanta } from '../components/AltaPlanta'
import { FichaUbicacion } from '../components/FichaUbicacion'
import { FichaCompostera } from '../components/FichaCompostera'
import { useCompostaje } from '../lib/compostaje'
import { diasEnEstado, proximoGiro } from '../lib/huerta/compostera'
import { useEspecies } from '../lib/useEspecies'
import { useZona } from '../lib/zona'
import { useHuerta } from '../lib/huerta/store'
import { useEstadoTareas } from '../lib/tareas/estado'
import { derivarTareas, expuestasAHelada, tareasVisibles } from '../lib/tareas/engine'
import { useAvisosClima } from '../lib/pronostico/useAvisosClima'
import { atencionPorPlanta, copoDeLaSemana, empaquetar, grillaDe } from '../lib/huerta/croquis'
import { ESTADO_COMPOST_INFO, desdeISO, hoyISO, type Ubicacion } from '../lib/huerta/tipos'
import type { EspecieEnriquecida } from '../lib/data/types'
import { resumenHuerta } from '../lib/huerta/tanda'
import { agruparPorLugar, pieDelLugar } from '../lib/huerta/lugar'
import {
  alternarUbicacion,
  guardarCroquisPlegado,
  guardarPlegado,
  leerCroquisPlegado,
  leerPlegado,
  podarPlegado,
  type Plegado,
} from '../lib/huerta/plegado'
import { IconoAlerta, IconoCompost, IconoHuerta, IconoTacho } from '../icons'
import './MiHuerta.css'
import { DibujoMaceta } from '../dibujos'

/** Mientras el catálogo carga. A nivel de módulo: si no, es un Map por render. */
const SIN_ESPECIES = new Map<string, EspecieEnriquecida>()

export function MiHuerta() {
  const { indice, cargando } = useEspecies()
  const zona = useZona()
  const { plantas, ubicaciones, composteras, cargado, errorCarga } = useHuerta()
  const guia = useCompostaje()
  const estadoTareas = useEstadoTareas()
  const [abrirAlta, setAbrirAlta] = useState(false)
  const [ubicacionDelAlta, setUbicacionDelAlta] = useState<string | undefined>()
  const [abrirCompostera, setAbrirCompostera] = useState(false)
  const [editando, setEditando] = useState<Ubicacion | null>(null)
  const [plegado, setPlegado] = useState<Plegado>(leerPlegado)
  const [croquisPlegado, setCroquisPlegado] = useState(leerCroquisPlegado)
  const hoy = hoyISO()

  const activas = useMemo(
    () =>
      plantas
        .filter((p) => !p.archivada)
        .sort((a, b) => b.sembrada.localeCompare(a.sembrada)),
    [plantas],
  )

  // el croquis y la lista en el mismo orden: el de la vista, el del foco y el de la lista es uno solo
  const lugares = useMemo(
    () =>
      empaquetar(
        agruparPorLugar(activas, ubicaciones).map((g) => {
          const grilla = grillaDe(g.ubicacion, g.plantas)
          return { ...g, grilla, ancho: grilla.ancho }
        }),
      ),
    [activas, ubicaciones],
  )

  /**
   * Las tareas visibles, del **mismo motor** que alimenta a Esta semana: si Mi
   * huerta contara por su cuenta, tarde o temprano las dos pantallas dirían
   * cosas distintas sobre la misma planta. Y respeta lo completado y lo
   * pospuesto, así una tarea que ya resolviste no te sigue mostrando el
   * triangulito.
   */
  const tareas = useMemo(() => {
    if (!indice) return []
    return tareasVisibles(
      derivarTareas({
        plantas,
        porSlug: indice.porSlug,
        clima: indice.db.meta.enriquecido.clima[zona],
        composteras,
        guia,
        hoy,
      }),
      estadoTareas,
      hoy,
    )
  }, [indice, plantas, composteras, guia, zona, estadoTareas, hoy])

  const pendientes = useMemo(() => {
    const cuenta = new Map<string, number>()
    for (const t of tareas) {
      const clave = t.plantaId ?? t.composteraId
      if (clave) cuenta.set(clave, (cuenta.get(clave) ?? 0) + 1)
    }
    return cuenta
  }, [tareas])

  const { avisos } = useAvisosClima(plantas, indice?.porSlug, hoy, new Date().toISOString())

  const atencion = useMemo(
    () =>
      atencionPorPlanta(tareas, (id) => {
        const p = plantas.find((x) => x.id === id)
        return p && (p.apodo || indice?.porSlug.get(p.slug)?.nombre_comun)
      }),
    [tareas, plantas, indice],
  )

  const copo = useMemo(() => {
    const texto = copoDeLaSemana(tareas, avisos, hoy)
    if (!texto || !indice) return null
    return { texto, ids: new Set(expuestasAHelada(plantas, indice.porSlug).map((p) => p.id)) }
  }, [tareas, avisos, hoy, plantas, indice])

  // los ids de lo que se borró no tienen por qué quedar guardados para siempre
  useEffect(() => {
    if (!cargado) return
    const podado = podarPlegado(
      plegado,
      new Set(ubicaciones.map((u) => u.id)),
      new Set(plantas.map((p) => p.id)),
    )
    if (
      podado.ubicacionesCerradas.length !== plegado.ubicacionesCerradas.length ||
      podado.plantasAbiertas.length !== plegado.plantasAbiertas.length
    ) {
      setPlegado(podado)
      guardarPlegado(podado)
    }
  }, [cargado, ubicaciones, plantas, plegado])

  function guardar(nuevo: Plegado) {
    setPlegado(nuevo)
    guardarPlegado(nuevo)
  }

  function alternarCroquis() {
    setCroquisPlegado(!croquisPlegado)
    guardarCroquisPlegado(!croquisPlegado)
  }

  /** El nombre de un lugar en el croquis lleva a sus fechas, abierto. */
  function irALugar(id: string | undefined) {
    if (plegado.ubicacionesCerradas.includes(id ?? '')) guardar(alternarUbicacion(plegado, id ?? ''))
    requestAnimationFrame(() => {
      const tarjeta = document.getElementById(`tarjeta-lugar-${id ?? 'sin'}`)
      const suave = !matchMedia('(prefers-reduced-motion: reduce)').matches
      tarjeta?.scrollIntoView({ behavior: suave ? 'smooth' : 'auto', block: 'start' })
      tarjeta?.querySelector<HTMLElement>('.lugar__plegar')?.focus({ preventScroll: true })
    })
  }

  function sumarPlantaEn(id?: string) {
    setUbicacionDelAlta(id)
    setAbrirAlta(true)
  }

  const listo = cargado && !cargando
  const hayLista = listo && lugares.length > 0

  return (
    <div className="pantalla">
      <Header
        titulo="Mi huerta"
        sobretitulo={listo && activas.length ? resumenHuerta(activas) : 'Lo que tenés plantado'}
      >
        {/* La acción primaria, en ocre, donde la pone el diseño. Va con el
            glifo solo: con la palabra "Sumar", el título y los dos accesos no
            entran en 390 px y "Mi huerta" se parte en dos líneas. */}
        {hayLista && (
          <button
            className="huerta__sumar"
            aria-label="Sumar una planta"
            onClick={() => sumarPlantaEn(undefined)}
          >
            ＋
          </button>
        )}
      </Header>

      <div className="pantalla__cuerpo">
        {errorCarga && <NoSePudoLeer error={errorCarga} />}

        {listo && lugares.length === 0 && (
          <EmptyState
            Dibujo={DibujoMaceta}
            titulo="Todavía no plantaste nada"
            texto="O sí, pero no me contaste. Sumá lo que tengas y te voy siguiendo el ciclo."
            accion={
              <button className="huerta__cta" onClick={() => sumarPlantaEn(undefined)}>
                Sumar la primera
              </button>
            }
          />
        )}

      </div>

      {hayLista && (
        <Croquis
          lugares={lugares}
          porSlug={indice?.porSlug ?? SIN_ESPECIES}
          atencion={atencion}
          copo={copo}
          hoy={hoy}
          plegado={croquisPlegado}
          onPlegar={alternarCroquis}
          onIrALugar={irALugar}
        />
      )}

      {hayLista && (
        <section className="pagina huerta__pagina" aria-labelledby="huerta-lista-titulo">
          <h2 className="pagina__titulo mano" id="huerta-lista-titulo">
            Por lugar, con sus fechas
          </h2>
          {/* La referencia va ARRIBA de la lista y no al pie: es lo que hay que
              saber para leer las líneas, no una nota al final. */}
          <p className="referencia">
            <span className="referencia__rotulo">Línea del año de cada planta</span>
            <span>
              <i className="es-crece" /> Creciendo
            </span>
            <span>
              <i className="es-trasplante" /> Trasplante
            </span>
            <span>
              <i className="es-cosecha" /> Cosecha
            </span>
            <span>
              <i className="es-hoy" /> Hoy
            </span>
          </p>
          <div className="huerta__lista">
            {lugares.map(({ ubicacion, plantas: lista }) => {
              const id = ubicacion?.id ?? ''
              return (
                <TarjetaLugar
                  key={id || 'sin'}
                  ubicacion={ubicacion}
                  plantas={lista}
                  porSlug={indice?.porSlug ?? SIN_ESPECIES}
                  pendientes={pendientes}
                  pie={pieDelLugar(tareas, lista, indice?.porSlug ?? SIN_ESPECIES)}
                  abierta={!plegado.ubicacionesCerradas.includes(id)}
                  onAlternar={() => guardar(alternarUbicacion(plegado, id))}
                  onEditar={() => ubicacion && setEditando(ubicacion)}
                  onSumarPlanta={() => sumarPlantaEn(ubicacion?.id)}
                />
              )
            })}
          </div>
        </section>
      )}

      <div className="pantalla__cuerpo">
        {/* Las composteras viven acá, con lo demás que registrás; la guía es
            la pestaña Compost y no sabe de tus tachos. */}
        {listo && (
          <section className="huerta__seccion huerta__compost">
            <h2 className="huerta__compost-titulo">
              <IconoCompost size={18} />
              Compost
              {composteras.length > 0 && <span className="huerta__cuenta">{composteras.length}</span>}
            </h2>
            {composteras.length > 0 && (
              <ul className="composteras">
                {composteras.map((c) => {
                  const giro = proximoGiro(c)
                  const alertas = pendientes.get(c.id) ?? 0
                  const detalle = [
                    `${ESTADO_COMPOST_INFO[c.estado].etiqueta.toLowerCase()} desde hace ${diasEnEstado(c, hoy)} días`,
                    giro ? (giro <= hoy ? 'toca girar' : `girar el ${fechaCorta(giro)}`) : null,
                  ]
                    .filter(Boolean)
                    .join(' · ')
                  return (
                    <li key={c.id}>
                      <Link to={`/huerta/compostera/${c.id}`} className="composteras__fila">
                        <span className="composteras__icono" aria-hidden>
                          {c.sistema === 'tachos' ? <IconoTacho size={20} /> : <IconoHuerta size={20} />}
                        </span>
                        <span className="composteras__textos">
                          <span className="composteras__nombre">{c.nombre}</span>
                          <span className="composteras__detalle">{detalle}</span>
                        </span>
                        {alertas > 0 && <Alertas cuantas={alertas} />}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            )}
            <button className="huerta__cta huerta__cta--secundario" onClick={() => setAbrirCompostera(true)}>
              ＋ {composteras.length ? 'Sumar otra compostera' : 'Sumar una compostera'}
            </button>
          </section>
        )}
      </div>

      <AltaPlanta
        abierto={abrirAlta}
        ubicacionId={ubicacionDelAlta}
        onCerrar={() => setAbrirAlta(false)}
      />
      <FichaCompostera abierto={abrirCompostera} onCerrar={() => setAbrirCompostera(false)} />
      <FichaUbicacion
        abierto={!!editando}
        ubicacion={editando ?? undefined}
        onCerrar={() => setEditando(null)}
      />
    </div>
  )
}

/**
 * El triangulito con la cuenta. El número va como texto de verdad —no como
 * color ni como tamaño— porque el color nunca puede ser el único canal, y
 * porque "2" y "5" no se distinguen si el aviso es solo un puntito.
 */
function Alertas({ cuantas }: { cuantas: number }) {
  return (
    <span className="huerta__alertas">
      <IconoAlerta size={14} />
      {cuantas}
      <span className="sr-solo">{cuantas === 1 ? ' cosa para atender' : ' cosas para atender'}</span>
    </span>
  )
}

const fechaCorta = (iso: string) =>
  new Intl.DateTimeFormat('es-AR', { day: 'numeric', month: 'short' }).format(desdeISO(iso))

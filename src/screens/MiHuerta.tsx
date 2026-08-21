import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Header } from '../components/Header'
import { EmptyState } from '../components/EmptyState'
import { NoSePudoLeer } from '../components/AvisoDatos'
import { CycleProgress } from '../components/CycleProgress'
import { AltaPlanta } from '../components/AltaPlanta'
import { useEspecies } from '../lib/useEspecies'
import { useZona } from '../lib/zona'
import { useHuerta } from '../lib/huerta/store'
import { useEstadoTareas } from '../lib/tareas/estado'
import { derivarTareas, tareasVisibles } from '../lib/tareas/engine'
import { ETAPA_INFO, hoyISO, type Planta } from '../lib/huerta/tipos'
import { estimar, textoHito } from '../lib/huerta/estimar'
import { germinacion } from '../lib/huerta/germinacion'
import {
  alternarPlanta,
  alternarUbicacion,
  guardarPlegado,
  leerPlegado,
  podarPlegado,
  type Plegado,
} from '../lib/huerta/plegado'
import {
  IconoAlerta,
  IconoDesplegar,
  IconoGrupo,
  IconoHuerta,
  IconoReloj,
  IconoSembrar,
} from '../icons'
import type { EspecieEnriquecida } from '../lib/data/types'
import './MiHuerta.css'

export function MiHuerta() {
  const { indice, cargando } = useEspecies()
  const zona = useZona()
  const { plantas, ubicaciones, cargado, errorCarga } = useHuerta()
  const estadoTareas = useEstadoTareas()
  const [abrirAlta, setAbrirAlta] = useState(false)
  const [plegado, setPlegado] = useState<Plegado>(leerPlegado)

  const activas = useMemo(
    () =>
      plantas
        .filter((p) => !p.archivada)
        .sort((a, b) => b.sembrada.localeCompare(a.sembrada)),
    [plantas],
  )

  const porUbicacion = useMemo(() => {
    const grupos = new Map<string, Planta[]>()
    for (const p of activas) {
      const clave = p.ubicacionId ?? ''
      grupos.set(clave, [...(grupos.get(clave) ?? []), p])
    }
    return grupos
  }, [activas])

  /**
   * Cuántas cosas pendientes tiene cada planta. Sale del **mismo motor** que
   * alimenta a Hoy: si Mi huerta contara por su cuenta, tarde o temprano las
   * dos pantallas dirían cosas distintas sobre la misma planta. Y respeta lo
   * completado y lo pospuesto, así una tarea que ya resolviste no te sigue
   * mostrando el triangulito.
   */
  const pendientes = useMemo(() => {
    const cuenta = new Map<string, number>()
    if (!indice) return cuenta
    const hoy = hoyISO()
    const tareas = tareasVisibles(
      derivarTareas({
        plantas,
        porSlug: indice.porSlug,
        clima: indice.db.meta.enriquecido.clima[zona],
        hoy,
      }),
      estadoTareas,
      hoy,
    )
    for (const t of tareas) {
      if (t.plantaId) cuenta.set(t.plantaId, (cuenta.get(t.plantaId) ?? 0) + 1)
    }
    return cuenta
  }, [indice, plantas, zona, estadoTareas])

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

  const listo = cargado && !cargando

  return (
    <div className="pantalla">
      <Header
        titulo="Mi huerta"
        sobretitulo={listo && activas.length ? `${activas.length} plantas` : 'Lo que tenés plantado'}
      />

      <div className="pantalla__cuerpo">
        {errorCarga && <NoSePudoLeer error={errorCarga} />}

        {listo && activas.length === 0 && (
          <EmptyState
            Icono={IconoHuerta}
            titulo="Todavía no plantaste nada"
            texto="O sí, pero no me contaste. Sumá lo que tengas y te voy siguiendo el ciclo."
            accion={
              <button className="huerta__cta" onClick={() => setAbrirAlta(true)}>
                Sumar la primera
              </button>
            }
          />
        )}

        {listo &&
          activas.length > 0 &&
          [...porUbicacion.entries()].map(([ubiId, lista]) => {
            const ubi = ubicaciones.find((u) => u.id === ubiId)
            const cerrada = plegado.ubicacionesCerradas.includes(ubiId)
            const panel = `ubicacion-${ubiId || 'sin'}`
            const alertas = lista.reduce((n, p) => n + (pendientes.get(p.id) ?? 0), 0)

            return (
              <section key={ubiId || 'sin'} className="huerta__seccion">
                <h2 className="huerta__ubicacion">
                  <button
                    className="huerta__plegar"
                    aria-expanded={!cerrada}
                    aria-controls={panel}
                    onClick={() => guardar(alternarUbicacion(plegado, ubiId))}
                  >
                    <IconoDesplegar
                      size={18}
                      className={`galon ${cerrada ? '' : 'es-abierto'}`}
                    />
                    <span className="huerta__lugar">{ubi ? ubi.nombre : 'Sin lugar asignado'}</span>
                    <span className="huerta__cuenta">{lista.length}</span>
                    {/* plegar una ubicación no puede esconder que algo pide atención */}
                    {cerrada && alertas > 0 && <Alertas cuantas={alertas} />}
                  </button>
                </h2>

                <div id={panel} className="huerta__grilla" hidden={cerrada}>
                  {lista.map((p, i) => (
                    <div
                      key={p.id}
                      className="aparecer"
                      style={{ '--retraso': `${Math.min(i, 8) * 0.03}s` } as React.CSSProperties}
                    >
                      <TarjetaPlanta
                        planta={p}
                        especie={indice?.porSlug.get(p.slug)}
                        abierta={plegado.plantasAbiertas.includes(p.id)}
                        pendientes={pendientes.get(p.id) ?? 0}
                        alPlegar={() => guardar(alternarPlanta(plegado, p.id))}
                      />
                    </div>
                  ))}
                </div>
              </section>
            )
          })}

        {listo && activas.length > 0 && (
          <button className="huerta__cta huerta__cta--secundario" onClick={() => setAbrirAlta(true)}>
            ＋ Sumar otra planta
          </button>
        )}
      </div>

      <AltaPlanta abierto={abrirAlta} onCerrar={() => setAbrirAlta(false)} />
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

function claseGerminacion(estado: string) {
  return estado === 'demorada' ? 'es-demorada' : estado === 'en_ventana' ? 'es-lista' : ''
}

function textoGerminacion(g: { estado: string; faltan: number; diasDeMas: number }): string {
  if (g.estado === 'temprano') {
    return g.faltan === 1 ? 'Debería asomar mañana' : `Debería asomar en ${g.faltan} días`
  }
  if (g.estado === 'en_ventana') return 'Ya podría estar asomando'
  return g.diasDeMas === 1
    ? 'Hace 1 día que debería haber asomado'
    : `Hace ${g.diasDeMas} días que debería haber asomado`
}

interface TarjetaProps {
  planta: Planta
  especie?: EspecieEnriquecida
  abierta: boolean
  pendientes: number
  alPlegar: () => void
}

/**
 * La tarjeta arranca **plegada**: con seis plantas cargadas, la pantalla era
 * un scroll largo de barras de progreso donde encontrar una era trabajo. La
 * fila cerrada deja lo que se mira de reojo —qué es, qué etapa, si algo pide
 * atención— y el detalle queda a un toque.
 *
 * El nombre sigue siendo un enlace a la ficha de la planta: plegar no puede
 * costar un toque más para llegar al diario, que es a lo que se entra.
 */
function TarjetaPlanta({ planta, especie, abierta, pendientes, alPlegar }: TarjetaProps) {
  if (!especie) return null
  const est = estimar(planta, especie)
  const germ = germinacion(planta, especie)
  const directa = planta.metodo === 'directa' || planta.metodo === 'plantacion'
  const nombre = planta.apodo || especie.nombre_comun
  const panel = `planta-${planta.id}`

  return (
    <article className={`planta-card etiqueta ${abierta ? 'es-abierta' : ''}`}>
      <div className="planta-card__cabeza">
        <Link to={`/huerta/${planta.id}`} className="planta-card__ir">
          <span className="planta-card__icono">
            <IconoGrupo grupo={especie.grupo} size={22} decorativo />
          </span>
          <span className="planta-card__textos">
            <h3 className="planta-card__nombre">{nombre}</h3>
            <span className="planta-card__sub">
              <span className={`planta-card__etapa es-${planta.etapa}`}>
                {ETAPA_INFO[planta.etapa].etiqueta}
              </span>
              <span className="planta-card__cuando">
                {planta.apodo ? `${especie.nombre_comun} · ` : ''}
                {est.diasDesdeSiembra === 0
                  ? 'sembrada hoy'
                  : est.diasDesdeSiembra === 1
                    ? 'hace 1 día'
                    : `hace ${est.diasDesdeSiembra} días`}
              </span>
            </span>
          </span>
        </Link>

        {pendientes > 0 && <Alertas cuantas={pendientes} />}

        <button
          className="planta-card__plegar"
          aria-expanded={abierta}
          aria-controls={panel}
          onClick={alPlegar}
        >
          <IconoDesplegar size={20} className={`galon ${abierta ? 'es-abierto' : ''}`} />
          <span className="sr-solo">
            {abierta ? `Ocultar el detalle de ${nombre}` : `Ver el detalle de ${nombre}`}
          </span>
        </button>
      </div>

      <div id={panel} className="planta-card__detalle" hidden={!abierta}>
        <CycleProgress etapa={planta.etapa} directa={directa} compacto />

        {/* mientras se espera la germinación, ése es EL dato: lo demás puede esperar */}
        {germ && germ.estado !== 'germino' && germ.estado !== 'no_aplica' ? (
          <p className={`planta-card__hito ${claseGerminacion(germ.estado)}`}>
            {germ.estado === 'demorada' ? <IconoAlerta size={14} /> : <IconoSembrar size={14} />}
            {textoGerminacion(germ)}
          </p>
        ) : (
          est.proximo && (
            <p className={`planta-card__hito ${est.proximo.enVentana ? 'es-lista' : ''}`}>
              <IconoReloj size={14} />
              {est.proximo.titulo}: {textoHito(est.proximo)}
            </p>
          )
        )}
      </div>
    </article>
  )
}

import { useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Header } from '../components/Header'
import { EmptyState } from '../components/EmptyState'
import { CycleProgress } from '../components/CycleProgress'
import { AltaPlanta } from '../components/AltaPlanta'
import { useEspecies } from '../lib/useEspecies'
import { useHuerta } from '../lib/huerta/store'
import { ETAPA_INFO, type Planta } from '../lib/huerta/tipos'
import { estimar, textoHito } from '../lib/huerta/estimar'
import { germinacion } from '../lib/huerta/germinacion'
import { IconoAlerta, IconoGrupo, IconoHuerta, IconoReloj, IconoSembrar } from '../icons'
import type { EspecieEnriquecida } from '../lib/data/types'
import './MiHuerta.css'

export function MiHuerta() {
  const { indice, cargando } = useEspecies()
  const { plantas, ubicaciones, cargado } = useHuerta()
  const [abrirAlta, setAbrirAlta] = useState(false)

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

  const listo = cargado && !cargando

  return (
    <div className="pantalla">
      <Header
        titulo="Mi huerta"
        sobretitulo={listo && activas.length ? `${activas.length} plantas` : 'Lo que tenés plantado'}
      />

      <div className="pantalla__cuerpo">
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
            return (
              <section key={ubiId || 'sin'} className="huerta__seccion">
                <h2 className="huerta__ubicacion">
                  {ubi ? ubi.nombre : 'Sin lugar asignado'}
                  <span className="huerta__cuenta">{lista.length}</span>
                </h2>
                <div className="huerta__grilla">
                  {lista.map((p, i) => (
                    <div
                      key={p.id}
                      className="aparecer"
                      style={{ '--retraso': `${Math.min(i, 8) * 0.03}s` } as React.CSSProperties}
                    >
                      <TarjetaPlanta planta={p} especie={indice?.porSlug.get(p.slug)} />
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

function TarjetaPlanta({ planta, especie }: { planta: Planta; especie?: EspecieEnriquecida }) {
  if (!especie) return null
  const est = estimar(planta, especie)
  const germ = germinacion(planta, especie)
  const directa = planta.metodo === 'directa' || planta.metodo === 'plantacion'

  return (
    <Link to={`/huerta/${planta.id}`} className="planta-card etiqueta">
      <div className="planta-card__cabeza">
        <span className="planta-card__icono">
          <IconoGrupo grupo={especie.grupo} size={22} decorativo />
        </span>
        <div className="planta-card__textos">
          <h3 className="planta-card__nombre">{planta.apodo || especie.nombre_comun}</h3>
          <p className="planta-card__sub">
            {planta.apodo ? `${especie.nombre_comun} · ` : ''}
            {est.diasDesdeSiembra === 0
              ? 'sembrada hoy'
              : est.diasDesdeSiembra === 1
                ? 'hace 1 día'
                : `hace ${est.diasDesdeSiembra} días`}
          </p>
        </div>
        <span className={`planta-card__etapa es-${planta.etapa}`}>{ETAPA_INFO[planta.etapa].etiqueta}</span>
      </div>

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
    </Link>
  )
}

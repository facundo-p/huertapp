import { useMemo, useState } from 'react'
import { BottomSheet } from './BottomSheet'
import { useEspecies } from '../lib/useEspecies'
import { useZona } from '../lib/zona'
import { useHuerta, agregarPlanta, agregarUbicacion, sinRomper } from '../lib/huerta/store'
import { compatibilidad } from '../lib/huerta/compat'
import { hoyISO } from '../lib/huerta/tipos'
import { estadoSiembra, metodoDelMes } from '../lib/data/especies'
import { normalizar } from '../lib/data/slugs'
import { METODOS } from '../lib/calendario'
import { decadaDe, mesDeDecada, nombreDecada } from '../lib/fechas'
import { IconoAlerta, IconoGrupo, IconoProtegido } from '../icons'
import type { EspecieEnriquecida, Metodo } from '../lib/data/types'
import './AltaPlanta.css'

const METODOS_ELEGIBLES: Metodo[] = ['directa', 'almacigo', 'almacigo_protegido', 'plantacion']

interface Props {
  abierto: boolean
  onCerrar: () => void
  /** si viene de una ficha, la especie ya está decidida */
  slug?: string
  onListo?: (id: string) => void
}

export function AltaPlanta({ abierto, onCerrar, slug, onListo }: Props) {
  const { indice } = useEspecies()
  const zona = useZona()
  const { ubicaciones } = useHuerta()
  const hoy = new Date()
  const decadaHoy = decadaDe(hoy)

  const [elegida, setElegida] = useState<string | undefined>(slug)
  const [busqueda, setBusqueda] = useState('')
  const [apodo, setApodo] = useState('')
  const [sembrada, setSembrada] = useState(hoyISO())
  const [ubicacionId, setUbicacionId] = useState<string>('')
  const [nuevaUbicacion, setNuevaUbicacion] = useState('')
  const [metodo, setMetodo] = useState<Metodo | null>(null)
  const [guardando, setGuardando] = useState(false)

  const especieSlug = slug ?? elegida
  const especie = especieSlug ? indice?.porSlug.get(especieSlug) : undefined

  // el método sugerido sale del calendario para el mes de la fecha elegida
  const mesSembrada = Number(sembrada.slice(5, 7))
  const sugerido = especie ? metodoDelMes(especie, mesSembrada as never) : null
  const metodoFinal = metodo ?? (sugerido === 'directa|almacigo' ? 'directa' : sugerido)

  const resultados = useMemo(() => {
    if (!indice || especieSlug) return []
    const t = normalizar(busqueda.trim())
    const base = t
      ? indice.todas.filter((e) => indice.textoBusqueda.get(e.slug)!.includes(t))
      : indice.todas.filter((e) => estadoSiembra(e, decadaHoy, zona))
    return base.slice(0, 40)
  }, [indice, busqueda, especieSlug, decadaHoy, zona])

  // vecinas: lo que ya hay en la ubicación elegida
  const { plantas } = useHuerta()
  const compat = useMemo(() => {
    if (!especie || !indice || !ubicacionId) return null
    const vecinas = plantas
      .filter((p) => p.ubicacionId === ubicacionId && !p.archivada)
      .map((p) => indice.porSlug.get(p.slug))
      .filter((e): e is EspecieEnriquecida => !!e)
    const c = compatibilidad(especie, vecinas)
    return c.malas.length || c.buenas.length ? c : null
  }, [especie, indice, ubicacionId, plantas])

  function limpiar() {
    setElegida(undefined)
    setBusqueda('')
    setApodo('')
    setSembrada(hoyISO())
    setUbicacionId('')
    setNuevaUbicacion('')
    setMetodo(null)
  }

  async function guardar() {
    if (!especieSlug || guardando) return
    setGuardando(true)
    try {
      let ubi = ubicacionId
      if (ubicacionId === '__nueva' && nuevaUbicacion.trim()) {
        ubi = (await agregarUbicacion(nuevaUbicacion, 'otro')).id
      }
      const p = await agregarPlanta({
        slug: especieSlug,
        apodo,
        ubicacionId: ubi && ubi !== '__nueva' ? ubi : undefined,
        sembrada,
        metodo: metodoFinal ?? null,
      })
      // sin catch a propósito: si el guardado falló, la hoja queda abierta con
      // lo que escribiste y el aviso de "no se pudo guardar" a la vista
      limpiar()
      onCerrar()
      onListo?.(p.id)
    } finally {
      setGuardando(false)
    }
  }

  const estadoHoy = especie ? estadoSiembra(especie, decadaHoy, zona) : null

  return (
    <BottomSheet
      abierto={abierto}
      onCerrar={() => {
        limpiar()
        onCerrar()
      }}
      titulo={especie ? `Sumar ${especie.nombre_comun.toLowerCase()}` : 'Sumar a mi huerta'}
      sobretitulo={especie ? especie.nombre_cientifico : nombreDecada(decadaHoy)}
      pie={
        especie && (
          <button className="alta__guardar" onClick={() => sinRomper(guardar())} disabled={guardando}>
            {guardando ? 'Guardando…' : 'Listo, la planté'}
          </button>
        )
      }
    >
      {!especie && (
        <div className="alta__campo">
          <label className="alta__label" htmlFor="alta-buscar">
            ¿Qué plantaste?
          </label>
          <input
            id="alta-buscar"
            type="search"
            className="alta__input"
            placeholder="Buscar especie…"
            value={busqueda}
            onChange={(ev) => setBusqueda(ev.target.value)}
          />
          <p className="alta__ayuda">
            {busqueda.trim() ? `${resultados.length} coinciden` : 'Se siembran ahora:'}
          </p>
          <ul className="alta__lista">
            {resultados.map((e) => (
              <li key={e.slug}>
                <button className="alta__opcion" onClick={() => setElegida(e.slug)}>
                  <IconoGrupo grupo={e.grupo} size={19} decorativo />
                  {e.nombre_comun}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {especie && (
        <>
          {estadoHoy === null && (
            <p className="alta__aviso es-ojo">
              <IconoAlerta size={17} />
              <span>
                Según el calendario, {nombreDecada(decadaHoy)} no es época de sembrarla en tu zona. La
                podés cargar igual: la huerta es tuya.
              </span>
            </p>
          )}

          <div className="alta__campo">
            <label className="alta__label" htmlFor="alta-fecha">
              ¿Cuándo la sembraste?
            </label>
            <input
              id="alta-fecha"
              type="date"
              className="alta__input"
              value={sembrada}
              max={hoyISO()}
              onChange={(ev) => setSembrada(ev.target.value)}
            />
          </div>

          <div className="alta__campo">
            <span className="alta__label">¿Cómo?</span>
            <div className="alta__metodos">
              {METODOS_ELEGIBLES.map((m) => (
                <button
                  key={m}
                  className={`alta__metodo ${metodoFinal === m ? 'es-activo' : ''}`}
                  onClick={() => setMetodo(m)}
                  aria-pressed={metodoFinal === m}
                >
                  {m === 'almacigo_protegido' && <IconoProtegido size={16} />}
                  {METODOS[m]}
                </button>
              ))}
            </div>
            {sugerido && (
              <p className="alta__ayuda">
                Para {mesDeDecada(decadaHoy) === mesSembrada ? 'este mes' : 'ese mes'} la ficha
                recomienda: <strong>{METODOS[sugerido].toLowerCase()}</strong>.
              </p>
            )}
          </div>

          <div className="alta__campo">
            <label className="alta__label" htmlFor="alta-ubi">
              ¿Dónde?
            </label>
            <select
              id="alta-ubi"
              className="alta__input"
              value={ubicacionId}
              onChange={(ev) => setUbicacionId(ev.target.value)}
            >
              <option value="">Sin especificar</option>
              {ubicaciones.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.nombre}
                </option>
              ))}
              <option value="__nueva">＋ Un lugar nuevo…</option>
            </select>
            {ubicacionId === '__nueva' && (
              <input
                className="alta__input"
                placeholder="Maceta del balcón, bancal del fondo…"
                value={nuevaUbicacion}
                onChange={(ev) => setNuevaUbicacion(ev.target.value)}
                autoFocus
              />
            )}
          </div>

          {compat && (
            <div className={`alta__aviso ${compat.malas.length ? 'es-mala' : 'es-buena'}`}>
              <IconoAlerta size={17} />
              <div>
                {compat.malas.length > 0 && (
                  <p>
                    <strong>Ojo con la compañía.</strong> Ahí ya tenés{' '}
                    {compat.malas.map((a, i) => (
                      <span key={a.slug}>
                        {i > 0 && ', '}
                        <strong>{a.nombre}</strong>
                        {a.nota && <em> ({a.nota})</em>}
                      </span>
                    ))}
                    , que no se lleva bien. Igual podés: es un aviso, no un cerrojo.
                  </p>
                )}
                {compat.malas.length === 0 && compat.buenas.length > 0 && (
                  <p>
                    <strong>Buena compañía.</strong> Se lleva bien con{' '}
                    {compat.buenas.map((a) => a.nombre).join(', ')}.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="alta__campo">
            <label className="alta__label" htmlFor="alta-apodo">
              Apodo <span className="alta__opcional">(opcional)</span>
            </label>
            <input
              id="alta-apodo"
              className="alta__input"
              placeholder="La del rincón, las de la abuela…"
              value={apodo}
              onChange={(ev) => setApodo(ev.target.value)}
            />
          </div>
        </>
      )}
    </BottomSheet>
  )
}

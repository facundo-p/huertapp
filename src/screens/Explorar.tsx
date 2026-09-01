import { useMemo, useState } from 'react'
import { Header } from '../components/Header'
import { EmptyState } from '../components/EmptyState'
import { EspecieCard } from '../components/EspecieCard'
import { FilaChips } from '../components/FilaChips'
import { useEspecies } from '../lib/useEspecies'
import { normalizar } from '../lib/data/slugs'
import { bandaCrecimiento, bandaGerminacion, estadoSiembra, type BandaTemp } from '../lib/data/especies'
import { useZona, ZONAS_INFO } from '../lib/zona'
import { decadaDe, nombreDecada } from '../lib/fechas'
import { BANDAS_CRECIMIENTO, BANDAS_GERMINACION, GRUPOS, LUCES, SUELOS, IconoExplorar } from '../icons'
import type { CategoriaLuz, CategoriaSuelo, Grupo } from '../lib/data/types'
import './Explorar.css'

type FiltroGrupo = Grupo | null
type FiltroSuelo = CategoriaSuelo | null
type FiltroLuz = CategoriaLuz | null
type FiltroBanda = BandaTemp | null

/** "melisa, menta y laurel" — para nombrar a las que el filtro deja afuera. */
const listar = (nombres: string[]) =>
  nombres.length <= 1 ? nombres.join('') : `${nombres.slice(0, -1).join(', ')} y ${nombres.at(-1)}`

export function Explorar() {
  const { indice, cargando } = useEspecies()
  const zona = useZona()
  const hoy = new Date()
  const decadaHoy = decadaDe(hoy)

  const [busqueda, setBusqueda] = useState('')
  const [soloAhora, setSoloAhora] = useState(false)
  const [grupo, setGrupo] = useState<FiltroGrupo>(null)
  const [suelo, setSuelo] = useState<FiltroSuelo>(null)
  const [luz, setLuz] = useState<FiltroLuz>(null)
  const [bandaGerm, setBandaGerm] = useState<FiltroBanda>(null)
  const [bandaCrec, setBandaCrec] = useState<FiltroBanda>(null)
  const [abierto, setAbierto] = useState(false)

  const categoriasActivas = [grupo, suelo, luz, bandaGerm, bandaCrec].filter(Boolean).length

  function limpiar() {
    setBusqueda('')
    setSoloAhora(false)
    setGrupo(null)
    setSuelo(null)
    setLuz(null)
    setBandaGerm(null)
    setBandaCrec(null)
  }

  const resultados = useMemo(() => {
    if (!indice) return []
    const texto = normalizar(busqueda.trim())
    // Sin búsqueda se ven las especies del catálogo; escribiendo aparecen
    // también las variedades, que es cuando el nombre puntual importa.
    return (texto ? indice.todas : indice.padres).filter((e) => {
      if (texto && !indice.textoBusqueda.get(e.slug)!.includes(texto)) return false
      if (soloAhora && !estadoSiembra(e, decadaHoy, zona)) return false
      if (grupo && e.grupo !== grupo) return false
      if (suelo && e.suelo.categoria_suelo !== suelo) return false
      if (luz && e.luz.categoria_luz !== luz) return false
      // sin dato la banda es null y no pasa: no se asume lo que no se sabe
      if (bandaGerm && bandaGerminacion(e) !== bandaGerm) return false
      if (bandaCrec && bandaCrecimiento(e) !== bandaCrec) return false
      return true
    })
  }, [indice, busqueda, soloAhora, grupo, suelo, luz, bandaGerm, bandaCrec, decadaHoy, zona])

  const hayFiltros = soloAhora || grupo || luz || suelo || bandaGerm || bandaCrec || busqueda.trim()

  // A quiénes deja afuera el filtro de temperatura por falta de dato: se dice
  // con nombre, que desaparecer en silencio parece no existir en el catálogo.
  const sinDatoTemp = useMemo(() => {
    if (!indice || (!bandaGerm && !bandaCrec)) return []
    return indice.padres
      .filter((e) => (bandaGerm && bandaGerminacion(e) === null) || (bandaCrec && bandaCrecimiento(e) === null))
      .map((e) => e.nombre_comun.toLowerCase())
  }, [indice, bandaGerm, bandaCrec])

  return (
    <div className="pantalla">
      <Header titulo="Explorar" sobretitulo={`${nombreDecada(decadaHoy)} · ${ZONAS_INFO[zona].etiqueta}`} />

      <div className="explorar__controles">
        <div className="buscador">
          <IconoExplorar size={19} />
          <input
            type="search"
            className="buscador__input"
            placeholder="Buscar especie…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            aria-label="Buscar especie por nombre"
          />
        </div>

        <div className="filtros-barra">
          <button
            className={`chip chip--texto ${soloAhora ? 'es-activo' : ''}`}
            onClick={() => setSoloAhora((v) => !v)}
            aria-pressed={soloAhora}
          >
            Se siembra ahora
          </button>
          <button
            className={`chip chip--texto ${abierto || categoriasActivas > 0 ? 'es-activo' : ''}`}
            onClick={() => setAbierto((v) => !v)}
            aria-expanded={abierto}
            aria-controls="panel-filtros"
          >
            Filtros{categoriasActivas > 0 ? ` (${categoriasActivas})` : ''}
          </button>
          {hayFiltros && (
            <button className="filtros-barra__limpiar" onClick={limpiar}>
              Limpiar
            </button>
          )}
        </div>

        {abierto && (
          <div className="filtros" id="panel-filtros">
            <FilaChips
              etiqueta="Grupo"
              opciones={Object.entries(GRUPOS).map(([k, v]) => ({ valor: k, ...v }))}
              activo={grupo}
              onElegir={(v) => setGrupo(v as FiltroGrupo)}
            />
            <FilaChips
              etiqueta="Suelo"
              opciones={Object.entries(SUELOS).map(([k, v]) => ({ valor: k, ...v }))}
              activo={suelo}
              onElegir={(v) => setSuelo(v as FiltroSuelo)}
            />
            <FilaChips
              etiqueta="Luz"
              opciones={Object.entries(LUCES).map(([k, v]) => ({ valor: k, ...v }))}
              activo={luz}
              onElegir={(v) => setLuz(v as FiltroLuz)}
            />
            <FilaChips
              etiqueta="Temperatura para germinar"
              opciones={Object.entries(BANDAS_GERMINACION).map(([k, v]) => ({ valor: k, ...v }))}
              activo={bandaGerm}
              onElegir={(v) => setBandaGerm(v as FiltroBanda)}
            />
            <FilaChips
              etiqueta="Temperatura para crecer"
              opciones={Object.entries(BANDAS_CRECIMIENTO).map(([k, v]) => ({ valor: k, ...v }))}
              activo={bandaCrec}
              onElegir={(v) => setBandaCrec(v as FiltroBanda)}
            />
          </div>
        )}

        <p className="explorar__cuenta" aria-live="polite">
          {cargando ? 'Cargando el catálogo…' : `${resultados.length} de ${indice!.padres.length} especies`}
        </p>

        {sinDatoTemp.length > 0 && (
          <p className="explorar__cuenta">
            Sin dato de temperatura, {sinDatoTemp.length === 1 ? 'queda' : 'quedan'} afuera{' '}
            {listar(sinDatoTemp)}.
          </p>
        )}
      </div>

      <div className="pantalla__cuerpo">
        {!cargando && resultados.length === 0 && (
          <EmptyState
            Icono={IconoExplorar}
            titulo="No encontramos nada"
            texto={
              hayFiltros
                ? 'Probá aflojando algún filtro o buscando por otro nombre.'
                : 'Algo raro pasó con el catálogo.'
            }
          />
        )}
        <div className="explorar__grilla">
          {resultados.map((e, i) => (
            <div
              key={e.slug}
              className="aparecer"
              style={{ '--retraso': `${Math.min(i, 8) * 0.03}s` } as React.CSSProperties}
            >
              <EspecieCard especie={e} decadaActual={decadaHoy} zona={zona} hoy={hoy} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}


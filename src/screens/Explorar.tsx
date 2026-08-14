import { useMemo, useState } from 'react'
import { Header } from '../components/Header'
import { EmptyState } from '../components/EmptyState'
import { EspecieCard } from '../components/EspecieCard'
import { useEspecies } from '../lib/useEspecies'
import { normalizar } from '../lib/data/slugs'
import { estadoSiembra } from '../lib/data/especies'
import { mesDe, NOMBRES_MES } from '../lib/fechas'
import { GRUPOS, LUCES, SUELOS, IconoExplorar } from '../icons'
import type { CategoriaLuz, CategoriaSuelo, Grupo, Mes } from '../lib/data/types'
import './Explorar.css'

type FiltroGrupo = Grupo | null
type FiltroSuelo = CategoriaSuelo | null
type FiltroLuz = CategoriaLuz | null

export function Explorar() {
  const { indice, cargando } = useEspecies()
  const mesHoy = mesDe(new Date())

  const [busqueda, setBusqueda] = useState('')
  const [soloAhora, setSoloAhora] = useState(false)
  const [grupo, setGrupo] = useState<FiltroGrupo>(null)
  const [suelo, setSuelo] = useState<FiltroSuelo>(null)
  const [luz, setLuz] = useState<FiltroLuz>(null)
  const [abierto, setAbierto] = useState(false)

  const categoriasActivas = [grupo, suelo, luz].filter(Boolean).length

  function limpiar() {
    setBusqueda('')
    setSoloAhora(false)
    setGrupo(null)
    setSuelo(null)
    setLuz(null)
  }

  const resultados = useMemo(() => {
    if (!indice) return []
    const texto = normalizar(busqueda.trim())
    return indice.todas.filter((e) => {
      if (texto && !indice.textoBusqueda.get(e.slug)!.includes(texto)) return false
      if (soloAhora && !estadoSiembra(e, mesHoy)) return false
      if (grupo && e.grupo !== grupo) return false
      if (suelo && e.suelo.categoria_suelo !== suelo) return false
      if (luz && e.luz.categoria_luz !== luz) return false
      return true
    })
  }, [indice, busqueda, soloAhora, grupo, suelo, luz, mesHoy])

  const hayFiltros = soloAhora || grupo || luz || suelo || busqueda.trim()

  return (
    <div className="pantalla">
      <Header titulo="Explorar" sobretitulo={`${NOMBRES_MES[mesHoy - 1]} en la huerta`} />

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
          </div>
        )}

        <p className="explorar__cuenta" aria-live="polite">
          {cargando ? 'Cargando el catálogo…' : `${resultados.length} de 55 especies`}
        </p>
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
              <EspecieCard especie={e} mesActual={mesHoy as Mes} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

interface OpcionChip {
  valor: string
  Icono: React.ComponentType<{ size?: number }>
  etiqueta: string
  color: string
}

function FilaChips({
  etiqueta,
  opciones,
  activo,
  onElegir,
}: {
  etiqueta: string
  opciones: OpcionChip[]
  activo: string | null
  onElegir: (v: string | null) => void
}) {
  return (
    <div className="fila-chips-grupo">
      <span className="fila-chips__etiqueta">{etiqueta}</span>
      <div className="fila-chips" role="group" aria-label={etiqueta}>
      {opciones.map(({ valor, Icono, etiqueta: nombre, color }) => {
        const activado = activo === valor
        return (
          <button
            key={valor}
            className={`chip ${activado ? 'es-activo' : ''}`}
            style={{ '--chip-color': color } as React.CSSProperties}
            onClick={() => onElegir(activado ? null : valor)}
            aria-pressed={activado}
            aria-label={nombre}
            title={nombre}
          >
            <Icono size={22} />
          </button>
        )
      })}
      </div>
    </div>
  )
}

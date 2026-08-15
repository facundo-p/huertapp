import { Link, useParams } from 'react-router'
import { Header } from '../components/Header'
import { DatoSection } from '../components/DatoSection'
import { TemperaturaBloque } from '../components/TemperaturaBloque'
import { MonthStrip } from '../components/MonthStrip'
import { ConfidenceBadge } from '../components/ConfidenceBadge'
import { EmptyState } from '../components/EmptyState'
import { useEspecies } from '../lib/useEspecies'
import { decadaDe, nombreDecada } from '../lib/fechas'
import { useZona, ZONAS_INFO } from '../lib/zona'
import {
  GRUPOS,
  LUCES,
  SUELOS,
  IconoAlmacigo,
  IconoAlerta,
  IconoCalendario,
  IconoCosechar,
  IconoExplorar,
  IconoFlor,
  IconoGrupo,
  IconoLuz,
  IconoPlaga,
  IconoSembrar,
  IconoSuelo,
  IconoTrasplantar,
} from '../icons'
import type { AsocRef } from '../lib/data/types'
import './FichaEspecie.css'

export function FichaEspecie() {
  const { slug } = useParams()
  const { indice, cargando } = useEspecies()
  const zona = useZona()
  const decadaHoy = decadaDe(new Date())

  if (cargando) {
    return (
      <div className="pantalla pantalla--detalle">
        <Header titulo="Cargando…" volver />
      </div>
    )
  }

  const e = indice!.porSlug.get(slug ?? '')
  if (!e) {
    return (
      <div className="pantalla pantalla--detalle">
        <Header titulo="No encontramos esa especie" volver />
        <div className="pantalla__cuerpo">
          <EmptyState
            Icono={IconoExplorar}
            titulo="Se nos perdió esta planta"
            texto="Puede que el link esté viejo. Volvé a Explorar y buscala de nuevo."
          />
        </div>
      </div>
    )
  }

  const grupo = GRUPOS[e.grupo]
  const suelo = SUELOS[e.suelo.categoria_suelo]
  const luz = LUCES[e.luz.categoria_luz]

  return (
    <div className="pantalla pantalla--detalle">
      <Header titulo={e.nombre_comun} sobretitulo={e.nombre_cientifico} volver />

      <div className="pantalla__cuerpo">
        {/* --- resumen visual: los tres íconos con su nombre --- */}
        <div className="ficha__resumen etiqueta">
          <div className="ficha__categorias">
            <Categoria Icono={() => <IconoGrupo grupo={e.grupo} size={24} decorativo />} texto={grupo.etiqueta} />
            <Categoria
              Icono={() => <IconoSuelo categoria={e.suelo.categoria_suelo} size={24} decorativo />}
              texto={suelo.etiqueta}
            />
            <Categoria
              Icono={() => <IconoLuz categoria={e.luz.categoria_luz} size={24} decorativo />}
              texto={luz.etiqueta}
            />
          </div>

          <div className="ficha__calendario">
            <div className="ficha__calendario-cabeza">
              <IconoCalendario size={17} />
              <span>Siembra y trasplante</span>
              <ConfidenceBadge valor={e.calendario.confianza} compacto />
            </div>
            <MonthStrip especie={e} zona={zona} decadaActual={decadaHoy} conTrasplante conEtiquetas />
            <p className="ficha__leyenda">
              <span className="punto es-ideal" /> ideal <span className="punto es-posible" /> posible{' '}
              <span className="punto es-trasplante" /> trasplante
            </p>
            <p className="ficha__zona">
              Cada mes va partido en tres. Calendario de {ZONAS_INFO[zona].etiqueta.toLowerCase()};
              hoy es {nombreDecada(decadaHoy)}.
            </p>
          </div>

          <div className="ficha__ciclo">
            {e.dias_germinacion && <Dato titulo="Germina" valor={rango(e.dias_germinacion, 'días')} />}
            {e.dias_a_trasplante && (
              <Dato titulo="Trasplante" valor={rango(e.dias_a_trasplante, 'días')} />
            )}
            {e.dias_a_cosecha && <Dato titulo="Cosecha" valor={rango(e.dias_a_cosecha, 'días')} />}
          </div>
        </div>

        <TemperaturaBloque t={e.temperaturas} />

        <DatoSection titulo="Cuándo sembrar" Icono={IconoSembrar} dato={e.fecha_siembra} />
        <DatoSection titulo="Cómo sembrar" Icono={IconoAlmacigo} dato={e.forma_siembra} />
        <DatoSection
          titulo="Trasplante"
          Icono={IconoTrasplantar}
          dato={e.transplante}
          senales={{ titulo: 'Está listo cuando…', texto: e.transplante.signos_listo }}
        />
        <DatoSection titulo="Germinación" Icono={IconoSembrar} dato={e.germinacion} />
        <DatoSection
          titulo="Cosecha"
          Icono={IconoCosechar}
          dato={e.cosecha}
          senales={{ titulo: 'Está lista cuando…', texto: e.cosecha.indicadores_listo }}
        />
        <DatoSection
          titulo="Suelo"
          Icono={() => <IconoSuelo categoria={e.suelo.categoria_suelo} size={20} decorativo />}
          dato={e.suelo}
          advertencia={{ titulo: 'Si no se cumple', texto: e.suelo.que_pasa_si_no }}
        />
        <DatoSection
          titulo="Luz"
          Icono={() => <IconoLuz categoria={e.luz.categoria_luz} size={20} decorativo />}
          dato={e.luz}
          advertencia={{ titulo: 'Si no se cumple', texto: e.luz.que_pasa_si_no }}
        />
        <DatoSection titulo="Ciclo de vida" Icono={IconoFlor} dato={e.longevidad} />
        <DatoSection titulo="Trucos" Icono={IconoAlmacigo} dato={e.trucos} />
        <DatoSection titulo="Riesgos" Icono={IconoAlerta} dato={e.riesgos} />
        <DatoSection titulo="Plagas" Icono={IconoPlaga} dato={e.plagas} />

        {/* --- asociaciones navegables --- */}
        <section className="ficha__asoc">
          <h2 className="dato__titulo">Con quién se lleva bien</h2>
          <Asociaciones refs={e.asociaciones.buenas} tipo="buena" indice={indice!} />
          <p className="dato__valor">{e.asociaciones_buenas.valor}</p>

          <h2 className="dato__titulo">Con quién no</h2>
          <Asociaciones refs={e.asociaciones.malas} tipo="mala" indice={indice!} />
          <p className="dato__valor">{e.asociaciones_malas.valor}</p>
        </section>

        <button className="ficha__agregar" type="button">
          🧺 Agregar a mi huerta
        </button>

        <p className="ficha__pie">
          Cada dato lleva su índice de confianza y sus fuentes. Los datos derivados (calendario y
          temperaturas) se explican en el{' '}
          <Link to="/glosario">glosario</Link>.
        </p>
      </div>
    </div>
  )
}

function Categoria({ Icono, texto }: { Icono: React.ComponentType; texto: string }) {
  return (
    <div className="ficha__categoria">
      <span className="ficha__categoria-icono">
        <Icono />
      </span>
      <span className="ficha__categoria-texto">{texto}</span>
    </div>
  )
}

function Dato({ titulo, valor }: { titulo: string; valor: string }) {
  return (
    <div className="ficha__ciclo-dato">
      <span className="ficha__ciclo-titulo">{titulo}</span>
      <span className="ficha__ciclo-valor">{valor}</span>
    </div>
  )
}

function rango(r: { min: number; max: number }, unidad: string): string {
  return r.min === r.max ? `${r.min} ${unidad}` : `${r.min}–${r.max} ${unidad}`
}

function Asociaciones({
  refs,
  tipo,
  indice,
}: {
  refs: AsocRef[]
  tipo: 'buena' | 'mala'
  indice: { porSlug: Map<string, { nombre_comun: string }> }
}) {
  if (refs.length === 0) {
    return <p className="dato__texto-chico">Sin datos confiables.</p>
  }
  return (
    <ul className="asoc-chips">
      {refs.map((a, i) => {
        const nombre = a.slug ? indice.porSlug.get(a.slug)?.nombre_comun : a.etiqueta
        if (!nombre) return null
        const clase = `asoc-chip es-${tipo}`
        const contenido = (
          <>
            {nombre}
            {a.nota && <em className="asoc-chip__nota"> · {a.nota}</em>}
          </>
        )
        return (
          <li key={a.slug ?? `ext-${i}`}>
            {a.slug ? (
              <Link to={`/explorar/${a.slug}`} className={clase}>
                {contenido}
              </Link>
            ) : (
              <span className={`${clase} es-externa`}>{contenido}</span>
            )}
          </li>
        )
      })}
    </ul>
  )
}

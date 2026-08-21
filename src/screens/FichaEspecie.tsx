import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router'
import { Header } from '../components/Header'
import { DatoSection } from '../components/DatoSection'
import { Cuidados } from '../components/Cuidados'
import { TemperaturaBloque } from '../components/TemperaturaBloque'
import { MonthStrip } from '../components/MonthStrip'
import { ConfidenceBadge } from '../components/ConfidenceBadge'
import { EmptyState } from '../components/EmptyState'
import { AltaPlanta } from '../components/AltaPlanta'
import { useEspecies } from '../lib/useEspecies'
import {
  estadoSiembra,
  germinacionAplica,
  metodoDelMes,
  trasplanteAplica,
} from '../lib/data/especies'
import { METODOS } from '../lib/calendario'
import { decadaDe, mesDeDecada, nombreDecada } from '../lib/fechas'
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
  IconoProtegido,
  IconoTrasplantar,
} from '../icons'
import type { AsocRef, Decada, EspecieEnriquecida, Mes, Zona } from '../lib/data/types'
import './FichaEspecie.css'

export function FichaEspecie() {
  const { slug } = useParams()
  const { indice, cargando } = useEspecies()
  const zona = useZona()
  const navegar = useNavigate()
  const decadaHoy = decadaDe(new Date())
  const [abrirAlta, setAbrirAlta] = useState(false)

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
  const mesHoy = mesDeDecada(decadaHoy)

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
            <MonthStrip
              especie={e}
              zona={zona}
              decadaActual={decadaHoy}
              conTrasplante
              conEtiquetas
              conProteccion
            />
            <p className="ficha__leyenda">
              <span className="punto es-ideal" /> ideal <span className="punto es-posible" /> posible{' '}
              <span className="punto es-trasplante" /> trasplante{' '}
              <span className="punto es-protegido" /> bajo reparo
            </p>
            <p className="ficha__zona">
              Cada mes va partido en tres. Calendario de {ZONAS_INFO[zona].etiqueta.toLowerCase()};
              hoy es {nombreDecada(decadaHoy)}.
            </p>
          </div>

          <AhoraMismo especie={e} zona={zona} decadaHoy={decadaHoy} mes={mesHoy} />

          <div className="ficha__ciclo">
            <Dato
              titulo="Germina"
              valor={e.dias_germinacion}
              porQue={
                germinacionAplica(e)
                  ? undefined
                  : 'Se planta un gajo, un bulbo o una corona: no hay semilla que germinar.'
              }
            />
            <Dato
              titulo="Trasplante"
              valor={e.dias_a_trasplante}
              porQue={
                trasplanteAplica(e) ? undefined : 'Va de siembra directa: no se trasplanta.'
              }
            />
            <Dato titulo="Cosecha" valor={e.dias_a_cosecha} />
          </div>
        </div>

        <TemperaturaBloque t={e.temperaturas} germinaAplica={germinacionAplica(e)} />

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

        <Cuidados cuidados={e.cuidados} />

        <DatoSection
          titulo="Todos los trucos"
          Icono={IconoAlmacigo}
          dato={e.trucos}
          bajada="El texto completo del que salen los cuidados de acá arriba, con lo que no entra en una lista."
        />
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

        <button className="ficha__agregar" type="button" onClick={() => setAbrirAlta(true)}>
          🧺 Agregar a mi huerta
        </button>

        <p className="ficha__pie">
          Cada dato lleva su índice de confianza y sus fuentes. Los datos derivados (calendario y
          temperaturas) se explican en el{' '}
          <Link to="/glosario">glosario</Link>.
        </p>
      </div>

      <AltaPlanta
        abierto={abrirAlta}
        onCerrar={() => setAbrirAlta(false)}
        slug={e.slug}
        onListo={(id) => navegar(`/huerta/${id}`)}
      />
    </div>
  )
}

/**
 * La respuesta directa a "¿la puedo sembrar hoy, y necesito invernadero?".
 * El método vive a resolución mensual, así que esto es lo más preciso que se
 * puede decir sin inventar.
 */
function AhoraMismo({
  especie: e,
  zona,
  decadaHoy,
  mes,
}: {
  especie: EspecieEnriquecida
  zona: Zona
  decadaHoy: Decada
  mes: Mes
}) {
  const estado = estadoSiembra(e, decadaHoy, zona)
  const metodo = metodoDelMes(e, mes)
  const protegido = metodo === 'almacigo_protegido'

  if (!estado) {
    return (
      <p className="ahora es-no">
        <span className="ahora__icono" aria-hidden>
          <IconoCalendario size={20} />
        </span>
        <span>
          <strong>No es época de sembrarla.</strong> Mirá la tira de arriba para ver cuándo se abre la
          ventana.
        </span>
      </p>
    )
  }

  return (
    <p className={`ahora ${protegido ? 'es-protegido' : 'es-si'}`}>
      <span className="ahora__icono" aria-hidden>
        {protegido ? <IconoProtegido size={20} /> : <IconoSembrar size={20} />}
      </span>
      <span>
        <strong>
          {estado === 'ideal' ? 'Es buen momento para sembrarla' : 'Se puede sembrar, no es lo óptimo'}
          {protegido ? ', pero bajo reparo.' : '.'}
        </strong>{' '}
        {metodo && <>{METODOS[metodo]}. </>}
        {protegido && (
          <>Todavía hace frío para que arranque a la intemperie: va en invernadero, cajón con nailon o
          botella cortada, hasta que afloje.</>
        )}
      </span>
    </p>
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

/**
 * Se dibuja siempre: omitirla dejaba la fila entera vacía en romero, menta,
 * laurel y lavanda. `s/d` = la fuente no lo dice; `no aplica` = no corresponde.
 */
function Dato({
  titulo,
  valor,
  porQue,
}: {
  titulo: string
  valor: { min: number; max: number } | null
  /** por qué no corresponde; sin esto y sin valor, es `s/d` */
  porQue?: string
}) {
  const ausencia = valor ? null : porQue ? 'no-aplica' : 'sin-dato'
  const texto = valor ? rango(valor, 'días') : porQue ? 'no aplica' : 's/d'
  const detalle = porQue ?? 'No encontramos una fuente que lo diga para esta especie.'

  return (
    <div className={`ficha__ciclo-dato${ausencia ? ` es-${ausencia}` : ''}`}>
      <span className="ficha__ciclo-titulo">{titulo}</span>
      <span className="ficha__ciclo-valor" title={ausencia ? detalle : undefined}>
        {texto}
        {ausencia && <span className="sr-solo">: {detalle}</span>}
      </span>
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

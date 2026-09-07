import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router'
import { Header } from '../components/Header'
import { EmptyState } from '../components/EmptyState'
import { FuentesCompost } from '../components/FuentesCompost'
import { CAPITULOS, clave, useCompostaje, type Bloque, type Guia, type Material, type SistemaClave } from '../lib/compostaje'
import { IconoCheck, IconoCompost, IconoCruz, IconoGota, IconoHoja, IconoTermo } from '../icons'
import '../components/DatoSection.css'
import './Compost.css'

const ICONO_SENAL = [IconoTermo, IconoCompost, IconoHoja, IconoGota, IconoCompost]

/**
 * Un capítulo de la guía: el molde es uno solo y los textos salen de los dos
 * parámetros. `sd()` es el «sin dato» honesto: un bloque `null` se dice, no se
 * esconde ni se completa.
 */
export function CompostCapitulo() {
  const { capitulo } = useParams()
  const g = useCompostaje()
  const { hash } = useLocation()
  const par = CAPITULOS[capitulo ?? '']

  // el deep-link a una sección (#que-poner, #listo) desde la portada
  useEffect(() => {
    if (!g || !hash) return
    document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
  }, [g, hash])

  if (!par) {
    return (
      <div className="pantalla pantalla--detalle">
        <Header titulo="No encontramos ese capítulo" volver />
        <div className="pantalla__cuerpo">
          <EmptyState
            Icono={IconoCompost}
            titulo="Ese capítulo no existe"
            texto="Volvé a la portada de Compost y elegí material y sistema."
          />
        </div>
      </div>
    )
  }
  const [material, sistema] = par

  if (!g) {
    return (
      <div className="pantalla pantalla--detalle">
        <Header titulo="Cargando…" volver />
      </div>
    )
  }

  const sis = g.sistemas[sistema]
  const mat = g.por_material[material]
  const F = g.meta.fuentes
  const sd = (b: Bloque) => b.valor ?? 's/d'

  return (
    <div className="pantalla pantalla--detalle">
      <Header
        titulo="La receta, paso a paso"
        sobretitulo={`${g.materiales[material].nombre} · ${sis.nombre}`}
        volver
      />

      <div className="pantalla__cuerpo compost">
        {/* Los dos parámetros, cambiables: cuatro capítulos son el mismo molde */}
        <nav className="compost__parametros" aria-label="Material y sistema">
          <Parametro
            opciones={(['cocina', 'jardin'] as Material[]).map((m) => [g.materiales[m].nombre, clave(m, sistema), m === material])}
          />
          <Parametro
            opciones={(['tachos', 'suelo'] as SistemaClave[]).map((s) => [g.sistemas[s].nombre.split(':')[0], clave(material, s), s === sistema])}
          />
        </nav>

        <p className="compost__bajada">{sd(sis.descripcion)}</p>
        <FuentesCompost ids={sis.descripcion.fuentes} confianza={sis.descripcion.confianza} fuentes={F} />

        {/* 1. tres estados */}
        <section className="compost__seccion" id="estados">
          <h2 className="compost__titulo">Tres estados</h2>
          <p className="compost__texto">
            Cuando el primero se llena, pasa a cocinar y empezás a llenar el siguiente. Siempre hay
            uno en cada estado.
          </p>
          <div className="compost__estados">
            {sis.estados.map((e) => (
              <div key={e.clave} className={`compost__estado es-${e.clave}`}>
                <p className="compost__estado-rotulo">{e.nombre}</p>
                <p className="compost__estado-duracion">{sd(e.duracion)}</p>
                <p className="compost__estado-hacer">{sd(e.que_hacer)}</p>
              </div>
            ))}
          </div>
          <FuentesCompost
            ids={[...new Set(sis.estados.flatMap((e) => [...e.duracion.fuentes, ...e.que_hacer.fuentes]))]}
            confianza={Math.min(...sis.estados.flatMap((e) => [e.duracion.confianza ?? 10, e.que_hacer.confianza ?? 10]))}
            fuentes={F}
          />
          <p className="compost__texto">
            <strong>Cuánto.</strong> {sd(sis.volumen)}
          </p>
          <FuentesCompost ids={sis.volumen.fuentes} confianza={sis.volumen.confianza} fuentes={F} />
        </section>

        {/* 2. qué poner */}
        <section className="compost__seccion" id="que-poner">
          <h2 className="compost__titulo">Qué poner</h2>
          <div className="compost__poner">
            <p className="compost__poner-rotulo es-verde">
              Verdes <small>nitrógeno</small>
            </p>
            <ul className="compost__chips">
              {mat.verdes.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className="compost__poner-rotulo es-seco">
              Secos <small>carbono</small>
            </p>
            <ul className="compost__chips">
              {mat.secos.items.map((x) => (
                <li key={x}>{x}</li>
              ))}
            </ul>
            <p className="compost__poner-rotulo">Poco</p>
            <ul className="compost__lista">
              {mat.poco.map((x) => (
                <li key={x.que}>
                  <strong>{x.que}.</strong> {x.porque}
                </li>
              ))}
            </ul>
            <p className="compost__poner-rotulo es-nunca">Nunca</p>
            <ul className="compost__lista">
              {mat.nunca.map((x) => (
                <li key={x.que}>
                  <span className="compost__cruz" aria-hidden>
                    <IconoCruz size={13} />
                  </span>
                  <strong>{x.que}.</strong> {x.porque}
                </li>
              ))}
            </ul>
          </div>
          <FuentesCompost
            ids={[...new Set([...mat.verdes.fuentes, ...mat.secos.fuentes, ...mat.poco.flatMap((x) => x.fuentes), ...mat.nunca.flatMap((x) => x.fuentes)])]}
            confianza={Math.min(mat.verdes.confianza ?? 10, mat.secos.confianza ?? 10, ...mat.poco.map((x) => x.confianza), ...mat.nunca.map((x) => x.confianza))}
            fuentes={F}
          />
          <p className="compost__texto">
            <strong>Proporción.</strong> {sd(g.receta.proporcion)} {sd(g.receta.proporcion_detalle)}
          </p>
          <p className="compost__texto">
            <strong>Humedad.</strong> {sd(g.receta.humedad)} {sd(g.receta.humedad_detalle)}
          </p>
          <p className="compost__texto">
            <strong>Tamaño.</strong> {sd(g.receta.tamano)}
          </p>
          <FuentesCompost
            ids={[...new Set([...g.receta.proporcion.fuentes, ...g.receta.humedad.fuentes, ...g.receta.tamano.fuentes])]}
            confianza={Math.min(g.receta.proporcion.confianza ?? 10, g.receta.humedad.confianza ?? 10, g.receta.tamano.confianza ?? 10)}
            fuentes={F}
          />
        </section>

        {/* 3. girar */}
        <section className="compost__seccion" id="girar">
          <h2 className="compost__titulo">Girar: cuándo y por qué</h2>
          <p className="compost__texto">
            <strong>{sd(sis.girar.cuando)}</strong> {sd(sis.girar.por_que)}
          </p>
          <p className="compost__texto">
            <strong>¿Se puede no girar?</strong> {sd(sis.girar.sin_girar)}{' '}
            {sis.girar.sin_girar_tiempo.valor ? (
              sis.girar.sin_girar_tiempo.valor
            ) : (
              <span className="compost__sd">
                Cuánto más tarda: s/d, ninguna fuente lo dice para este sistema.
              </span>
            )}
          </p>
          <FuentesCompost
            ids={[...new Set([...sis.girar.cuando.fuentes, ...sis.girar.por_que.fuentes, ...sis.girar.sin_girar.fuentes])]}
            confianza={Math.min(sis.girar.cuando.confianza ?? 10, sis.girar.por_que.confianza ?? 10, sis.girar.sin_girar.confianza ?? 10)}
            fuentes={F}
          />
        </section>

        {/* 4. va bien / algo falla */}
        <section className="compost__seccion" id="senales">
          <h2 className="compost__titulo">Va bien, algo falla</h2>
          <div className="compost__tabla" role="table" aria-label="Señales de que va bien y de que algo falla">
            <div className="compost__tabla-cabeza" role="row">
              <span role="columnheader" className="es-bien">Va bien</span>
              <span role="columnheader" className="es-mal">Algo falla</span>
            </div>
            {g.comun.senales.map((s, i) => {
              const Icono = ICONO_SENAL[i % ICONO_SENAL.length]
              return (
                <div key={s.sintoma} className="compost__tabla-fila" role="row">
                  <span role="cell" className="compost__bien">
                    <span className="compost__bien-icono" aria-hidden>
                      <Icono size={15} />
                    </span>
                    {s.bien}
                  </span>
                  <span role="cell" className="compost__mal">
                    <strong>{s.sintoma}.</strong> {s.correccion}
                  </span>
                </div>
              )
            })}
          </div>
          <FuentesCompost
            ids={[...new Set(g.comun.senales.flatMap((s) => s.fuentes))]}
            confianza={Math.min(...g.comun.senales.map((s) => s.confianza))}
            fuentes={F}
          />
          <p className="compost__texto">
            <strong>El líquido de abajo.</strong> {sd(g.comun.lixiviado)}
          </p>
          <FuentesCompost ids={g.comun.lixiviado.fuentes} confianza={g.comun.lixiviado.confianza} fuentes={F} />
        </section>

        {/* 5. ¿está listo? a sangre, invertido */}
        <section className="compost__listo" id="listo" aria-labelledby="listo-titulo">
          <p className="compost__listo-sobre">¿Está listo?</p>
          <h2 id="listo-titulo" className="compost__listo-titulo">
            {g.comun.listo.senales.items.length} señales, todas juntas
          </h2>
          <ul className="compost__listo-lista">
            {g.comun.listo.senales.items.map((x) => (
              <li key={x}>
                <span className="compost__check" aria-hidden>
                  <IconoCheck size={15} />
                </span>
                {x}
              </li>
            ))}
            {g.comun.listo.pruebas.map((p) => (
              <li key={p.que}>
                <span className="compost__check" aria-hidden>
                  <IconoCheck size={15} />
                </span>
                <strong>{p.que}.</strong> {p.como}
              </li>
            ))}
            <li className="es-sd">
              <span className="compost__check" aria-hidden>
                <IconoCruz size={15} />
              </span>
              <strong>Prueba de germinación.</strong>{' '}
              {g.comun.listo.prueba_germinacion.valor ?? 's/d: ninguna de las fuentes la describe.'}
            </li>
          </ul>
          <p className="compost__listo-nota">{sd(g.comun.listo.nota)}</p>
          <div className="compost__listo-fuentes">
            <FuentesCompost
              ids={[...new Set([...g.comun.listo.senales.fuentes, ...g.comun.listo.pruebas.flatMap((p) => p.fuentes), ...g.comun.listo.nota.fuentes])]}
              confianza={Math.min(g.comun.listo.senales.confianza ?? 10, ...g.comun.listo.pruebas.map((p) => p.confianza), g.comun.listo.nota.confianza ?? 10)}
              fuentes={F}
            />
          </div>
        </section>

        <p className="compost__pie">
          Investigado el {g.meta.fecha_investigacion}. Lo que ninguna fuente dice figura como s/d.{' '}
          <Link to="/compost">Volver a la portada</Link>.
        </p>
      </div>
    </div>
  )
}

/** Dos opciones como links: elegir un parámetro es cambiar de capítulo. */
function Parametro({ opciones }: { opciones: [string, string, boolean][] }) {
  return (
    <div className="compost__segmentado">
      {opciones.map(([nombre, ruta, activo]) => (
        <Link key={ruta} to={`/compost/${ruta}`} className={`compost__segmento ${activo ? 'es-activo' : ''}`} aria-current={activo ? 'page' : undefined}>
          {nombre}
        </Link>
      ))}
    </div>
  )
}

export type { Guia }

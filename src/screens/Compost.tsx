import { Link } from 'react-router'
import { Header } from '../components/Header'
import { useCompostaje, type Bloque } from '../lib/compostaje'
import { IconoDesplegar, IconoFruto, IconoGota, IconoHoja, IconoHuerta, IconoTacho, IconoCompost } from '../icons'
import '../components/DatoSection.css'
import './Compost.css'

/**
 * La portada de la guía de compostaje: dos preguntas (qué compostás, en qué
 * sistema), una receta que vale para todo, y los capítulos. Todo reglado: no
 * registra nada, no manda tareas. Cada fila entra al capítulo con ese
 * parámetro elegido y el otro por defecto.
 */
export function Compost() {
  const g = useCompostaje()

  return (
    <div className="pantalla">
      <Header titulo="Compostaje" sobretitulo="Guía de consulta" />

      <div className="pantalla__cuerpo compost">
        {!g ? (
          <p className="compost__cargando">Cargando la guía…</p>
        ) : (
          <>
            <p className="compost__bajada">
              Dos materiales, dos sistemas, una misma receta: verde y seco en proporción, humedad de
              esponja escurrida y aire cada tanto.
            </p>

            <section className="compost__seccion">
              <h2 className="compost__titulo">Qué vas a compostar</h2>
              <ul className="compost__filas">
                <Fila
                  a="/compost/cocina-tachos"
                  Icono={IconoFruto}
                  color="var(--frambuesa)"
                  titulo={g.materiales.cocina.nombre}
                  detalle={g.materiales.cocina.descripcion}
                />
                <Fila
                  a="/compost/jardin-suelo"
                  Icono={IconoHoja}
                  color="var(--verde-hoja)"
                  titulo={g.materiales.jardin.nombre}
                  detalle={g.materiales.jardin.descripcion}
                />
              </ul>
            </section>

            <section className="compost__seccion">
              <h2 className="compost__titulo">En qué sistema</h2>
              <ul className="compost__filas">
                <Fila
                  a="/compost/cocina-tachos"
                  Icono={IconoTacho}
                  color="var(--verde-prof)"
                  titulo={g.sistemas.tachos.nombre}
                  detalle={g.sistemas.tachos.volumen.valor ?? ''}
                />
                <Fila
                  a="/compost/cocina-suelo"
                  Icono={IconoHuerta}
                  color="var(--terracota-texto)"
                  titulo={g.sistemas.suelo.nombre}
                  detalle={g.sistemas.suelo.descripcion.valor ?? ''}
                />
              </ul>
            </section>

            {/* La receta, a sangre: el mismo tinte que un aviso de la semana */}
            <section className="compost__receta" aria-labelledby="receta-titulo">
              <h2 id="receta-titulo" className="compost__titulo">
                La receta
              </h2>
              <div className="compost__barra" aria-hidden>
                <span className="compost__barra-verde">1 verde</span>
                <span className="compost__barra-seco">2 secos</span>
              </div>
              <div className="compost__tres">
                <Columna Icono={IconoHoja} titulo="Proporción" bloque={g.receta.proporcion} />
                <Columna Icono={IconoGota} titulo="Humedad" bloque={g.receta.humedad} />
                <Columna Icono={IconoCompost} titulo="Aire" bloque={g.receta.aire} />
              </div>
              <p className="compost__nota">
                Lo dicen INTI-INTA, la Provincia, la Ciudad, Santa Fe y FAO; el capítulo cita cada bloque.
              </p>
            </section>

            <section className="compost__seccion">
              <h2 className="compost__titulo">Guía</h2>
              <ul className="compost__filas compost__filas--guia">
                <FilaGuia a="/compost/cocina-tachos#que-poner">Qué poner y qué no</FilaGuia>
                <FilaGuia a="/compost/cocina-tachos#estados">Proporción, humedad y los tres estados</FilaGuia>
                <FilaGuia a="/compost/cocina-tachos#girar">Cuándo girar o voltear, y cuándo no hace falta</FilaGuia>
                <FilaGuia a="/compost/cocina-tachos#senales">Qué lo acelera, qué lo frena y los problemas frecuentes</FilaGuia>
                <FilaGuia a="/compost/cocina-tachos#listo">¿Está listo?</FilaGuia>
              </ul>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

function Fila({
  a,
  Icono,
  color,
  titulo,
  detalle,
}: {
  a: string
  Icono: React.ComponentType<{ size?: number }>
  color: string
  titulo: string
  detalle: string
}) {
  return (
    <li>
      <Link to={a} className="compost__fila">
        <span className="compost__pastilla" style={{ color }} aria-hidden>
          <Icono size={22} />
        </span>
        <span className="compost__fila-textos">
          <span className="compost__fila-titulo">{titulo}</span>
          <span className="compost__fila-detalle">{detalle}</span>
        </span>
        <span className="compost__chevron" aria-hidden>
          <IconoDesplegar size={16} />
        </span>
      </Link>
    </li>
  )
}

function FilaGuia({ a, children }: { a: string; children: React.ReactNode }) {
  return (
    <li>
      <Link to={a} className="compost__fila compost__fila--guia">
        <span className="compost__fila-titulo">{children}</span>
        <span className="compost__chevron" aria-hidden>
          <IconoDesplegar size={16} />
        </span>
      </Link>
    </li>
  )
}

function Columna({
  Icono,
  titulo,
  bloque,
}: {
  Icono: React.ComponentType<{ size?: number }>
  titulo: string
  bloque: Bloque
}) {
  return (
    <div className="compost__columna">
      <p className="compost__columna-titulo">
        <Icono size={14} /> {titulo}
      </p>
      <p>{bloque.valor ?? 's/d'}</p>
    </div>
  )
}

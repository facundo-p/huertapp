import { Header } from '../components/Header'
import { elegirZona, useZona, ZONAS_INFO } from '../lib/zona'
import { ZONAS, type Zona } from '../lib/data/types'
import { IconoAlerta } from '../icons'
import './Ajustes.css'

export function Ajustes() {
  const zona = useZona()

  return (
    <div className="pantalla pantalla--detalle">
      <Header titulo="Ajustes" volver />
      <div className="pantalla__cuerpo">
        <section className="ajustes__seccion">
          <h2 className="ajustes__titulo subrayado-onda">¿Dónde está tu huerta?</h2>
          <p className="ajustes__bajada">
            Dentro del GBA la última helada cambia más de un mes según dónde estés, y de eso depende
            todo el calendario. En el centro porteño casi no hiela; en La Plata o Cañuelas, hasta bien
            entrada la primavera.
          </p>

          <div className="opciones" role="radiogroup" aria-label="Zona de la huerta">
            {ZONAS.map((z) => (
              <OpcionZona key={z} zona={z} elegida={zona === z} onElegir={() => elegirZona(z)} />
            ))}
          </div>

          <p className="ajustes__nota">
            <IconoAlerta size={15} />
            <span>
              Si dudás, dejá <strong>Conurbano</strong>: es la opción del medio y cubre la mayor parte
              del GBA. Ante la duda conviene la zona más fría, que atrasa la siembra y arriesga menos.
            </span>
          </p>
        </section>

        <section className="ajustes__seccion">
          <h2 className="ajustes__titulo subrayado-onda">Lo que falta</h2>
          <p className="ajustes__bajada">
            Acá van a estar el backup de tus datos, las notificaciones y la huerta de ejemplo. Todavía
            se están regando.
          </p>
        </section>
      </div>
    </div>
  )
}

function OpcionZona({
  zona,
  elegida,
  onElegir,
}: {
  zona: Zona
  elegida: boolean
  onElegir: () => void
}) {
  const info = ZONAS_INFO[zona]
  return (
    <button
      className={`opcion ${elegida ? 'es-elegida' : ''}`}
      onClick={onElegir}
      role="radio"
      aria-checked={elegida}
    >
      <span className="opcion__marca" aria-hidden />
      <span className="opcion__textos">
        <span className="opcion__nombre">{info.etiqueta}</span>
        <span className="opcion__detalle">{info.detalle}</span>
        <span className="opcion__helada">{info.helada}</span>
      </span>
    </button>
  )
}

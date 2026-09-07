import type { Decada, EspecieEnriquecida, Mes, Zona } from '../lib/data/types'
import { decadasDelAnio, etiquetaMes, estadosDelMes } from '../lib/data/especies'
import { INICIALES_MES, MES_CORTO, NOMBRES_TERCIO, mesDeDecada, tercioDeDecada } from '../lib/fechas'
import { anguloDeDecada, anguloDeMes, marcas, relleno } from '../lib/anillo'
import './AnilloAnual.css'

const MESES = Array.from({ length: 12 }, (_, i) => (i + 1) as Mes)

interface Props {
  especie: EspecieEnriquecida
  zona: Zona
  /** década de hoy: dónde apunta la aguja */
  decadaActual: Decada
  /** 'chico' va en las tarjetas (56 px); 'grande' en la ficha (146 px) */
  tamano?: 'chico' | 'grande'
  /** anillo interno con la ventana de trasplante (solo en el grande) */
  conTrasplante?: boolean
}

/**
 * El año como un reloj. Reemplaza a la tira lineal de meses en las tarjetas
 * de Explorar y en la ficha.
 *
 * Lo visual es decorativo (`aria-hidden`) y el texto por mes que lee el lector
 * de pantalla se conserva entero: es el mismo `etiquetaMes()` que usa la tira.
 */
export function AnilloAnual({
  especie,
  zona,
  decadaActual,
  tamano = 'chico',
  conTrasplante,
}: Props) {
  const grande = tamano === 'grande'
  const siembra = decadasDelAnio(especie, zona, 'siembra')
  const trasplante = conTrasplante ? decadasDelAnio(especie, zona, 'trasplante') : null
  const mesActual = mesDeDecada(decadaActual)

  const capaMarcas = grande
    ? marcas('var(--marca-mes-grande)', 'var(--marca-tercio)')
    : marcas('var(--marca-mes)', 'transparent', 1.5)

  return (
    <div className={`anillo ${grande ? 'anillo--grande' : 'anillo--chico'}`}>
      <span className="sr-solo">
        {MESES.map((m) =>
          etiquetaMes(
            m,
            estadosDelMes(especie, m, zona, 'siembra'),
            conTrasplante ? estadosDelMes(especie, m, zona, 'trasplante') : null,
          ),
        ).join('. ')}
      </span>

      <div className="anillo__disco" aria-hidden>
        <div
          className="anillo__capa anillo__capa--siembra"
          style={{ background: `${capaMarcas}, ${relleno(siembra)}` }}
        />
        {trasplante && (
          <div
            className="anillo__capa anillo__capa--trasplante"
            style={{
              background: `${capaMarcas}, ${relleno(trasplante, 'var(--anillo-vacio-int)')}`,
            }}
          />
        )}

        {grande &&
          MESES.map((m) => (
            <span
              key={m}
              className={`anillo__inicial ${m === mesActual ? 'es-ahora' : ''}`}
              style={{ '--giro': `${anguloDeMes(m)}deg` } as React.CSSProperties}
            >
              {INICIALES_MES[m - 1]}
            </span>
          ))}

        {/* La aguja gira desde su base, que está en el centro del disco: así el
            trazo visible queda solo en la banda y no cruza el hueco. */}
        <span
          className="anillo__aguja"
          style={{ '--giro': `${anguloDeDecada(decadaActual)}deg` } as React.CSSProperties}
        >
          <i />
        </span>

        <span className="anillo__centro">
          {grande ? (
            <>
              <b>{MES_CORTO[mesActual - 1]}</b>
              <small>{NOMBRES_TERCIO[tercioDeDecada(decadaActual) - 1]}</small>
            </>
          ) : (
            <b>{MES_CORTO[mesActual - 1]}</b>
          )}
        </span>
      </div>
    </div>
  )
}

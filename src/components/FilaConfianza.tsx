import { puntosConfianza } from '../lib/data/confianza'
import { nivelConfianza } from '../lib/data/especies'
import './FilaConfianza.css'

const TEXTO = {
  alta: 'confianza alta',
  media: 'confianza media',
  baja: 'confianza baja',
  sin: 'sin dato confiable',
} as const

/**
 * El índice de confianza como diez puntos y el número: ocupa menos que la
 * pastilla y se compara de un vistazo entre campos. Color y cantidad de
 * puntos dicen lo mismo, así que el color nunca es el único canal; el número
 * lo repite y `s/d` marca el sin dato.
 */
export function FilaConfianza({ valor }: { valor: number | null }) {
  const nivel = nivelConfianza(valor)
  const detalle = valor === null ? TEXTO.sin : `${TEXTO[nivel]}: ${valor} de 10`
  return (
    <span className={`fila-conf fila-conf--${nivel}`} title={detalle}>
      <span className="sr-solo">{detalle}</span>
      <span className="fila-conf__puntos" aria-hidden>
        {puntosConfianza(valor).map((p, i) => (
          <i key={i} className={`es-${p}`} />
        ))}
      </span>
      <span className="fila-conf__numero" aria-hidden>
        {valor === null ? 's/d' : valor}
      </span>
    </span>
  )
}

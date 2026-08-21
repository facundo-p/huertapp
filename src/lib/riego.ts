import { REGIMENES_RIEGO, type RegimenRiego } from './data/types'

export { REGIMENES_RIEGO }

/** El eje ordinal, de menos agua a más. El orden es el dibujo de la barrita. */
export const ETIQUETA_RIEGO: Record<RegimenRiego, string> = {
  escaso: 'Escaso',
  espaciado: 'Espaciado',
  parejo: 'Parejo',
  constante: 'Constante',
}

export const QUE_ES_RIEGO: Record<RegimenRiego, string> = {
  escaso: 'Prefiere pasar sed. Regá poco y sólo cuando la tierra está seca hondo.',
  espaciado: 'Dejá que la superficie se seque entre riego y riego.',
  parejo: 'Que la tierra esté húmeda siempre, sin llegar a charco. Es el caso más común.',
  constante: 'No puede secarse nunca, ni un día. Si vive en maceta, en enero es todos los días.',
}

/** Cuántos niveles se rellenan: 1 para el que menos pide, 4 para el que más. */
export function nivelRiego(r: RegimenRiego): number {
  return REGIMENES_RIEGO.indexOf(r) + 1
}

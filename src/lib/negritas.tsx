import type { ReactNode } from 'react'

/**
 * Los textos del glosario marcan lo importante con `**`, que es como se leen
 * bien en el archivo de datos. Acá eso se vuelve `<strong>`. No es un parser
 * de markdown ni pretende serlo: es una negrita, y no hace falta más.
 */
export function conNegritas(texto: string): ReactNode[] {
  return texto.split(/\*\*(.+?)\*\*/g).map((t, i) => (i % 2 ? <strong key={i}>{t}</strong> : t))
}

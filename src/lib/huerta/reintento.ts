/**
 * Comparte una carga entre todos los que la piden, pero **no cachea el
 * fallo**.
 *
 * `promesa ??= cargar()` parece lo mismo y no lo es: guarda también la promesa
 * rechazada, así que un error transitorio de IndexedDB deja la sesión entera
 * sin datos y sin ningún reintento. Le pasa a quien abre la app en el momento
 * equivocado, y desde afuera se ve igual que una huerta borrada.
 */
export function unaVez<T>(cargar: () => Promise<T>): () => Promise<T> {
  let enVuelo: Promise<T> | null = null

  return () => {
    enVuelo ??= cargar().catch((e) => {
      enVuelo = null // el próximo que pida vuelve a intentar
      throw e
    })
    return enVuelo
  }
}

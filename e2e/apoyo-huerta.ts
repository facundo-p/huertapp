import type { Page } from '@playwright/test'

/**
 * Suma a la base una copia de una planta de la demo. `lugar` va por nombre; el
 * resto de los campos pasa tal cual (apodo, sembrada, germino, etapa). La
 * pantalla la ve recién al recargar: ir a otro hash no vuelve a leer la base.
 */
export async function duplicarPlanta(
  page: Page,
  slug: string,
  { sufijo = '-bis', lugar, ...campos }: { sufijo?: string; lugar?: string; [campo: string]: string | undefined },
) {
  await page.evaluate(
    async ({ slug, sufijo, lugar, campos }) => {
      const pedido = indexedDB.open('huerta-gba')
      const base = await new Promise<IDBDatabase>((res, rej) => {
        pedido.onsuccess = () => res(pedido.result)
        pedido.onerror = () => rej(pedido.error)
      })
      const tx = base.transaction(['plantas', 'ubicaciones'], 'readwrite')
      const todas = (almacen: string) =>
        new Promise<Record<string, string>[]>((res) => {
          const g = tx.objectStore(almacen).getAll()
          g.onsuccess = () => res(g.result as Record<string, string>[])
        })
      const p = (await todas('plantas')).find((x) => x.slug === slug)!
      const lugares = await todas('ubicaciones')
      const copia: Record<string, string | undefined> = { ...p, ...campos, id: `${p.id}${sufijo}` }
      if (lugar) copia.ubicacionId = lugares.find((u) => u.nombre === lugar)!.id
      tx.objectStore('plantas').put(copia)
      await new Promise((res) => (tx.oncomplete = res))
      base.close()
    },
    { slug, sufijo, lugar, campos },
  )
}

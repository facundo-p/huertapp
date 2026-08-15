import { createHash } from 'node:crypto'
import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

/**
 * Plugin de Vite que arma el service worker con la lista de archivos del build.
 *
 * Corre en `closeBundle`, que es el único momento en que dist/ está completo:
 * los chunks hasheados, el index.html que emite el plugin de html, y lo que
 * Vite copia desde public/ (íconos y manifest). Antes de eso la lista quedaría
 * incompleta y la app no abriría offline.
 *
 * La versión de la caché es el hash del contenido de todo lo que se precachea.
 * Así el service worker cambia si y solo si cambió algo que se sirve: no hay
 * updates fantasma ni —peor— gente clavada en una versión vieja porque el
 * archivo del worker quedó igual.
 */
export function serviceWorker() {
  const plantilla = fileURLToPath(new URL('./sw.js', import.meta.url))

  return {
    name: 'huerta-sw',
    apply: 'build',
    async closeBundle() {
      const dist = 'dist'
      const archivos = (await listar(dist))
        .map((f) => relative(dist, f).split('\\').join('/'))
        .filter((f) => f !== 'sw.js')
        .sort()

      const hash = createHash('sha256')
      for (const f of archivos) {
        hash.update(f)
        hash.update(await readFile(join(dist, f)))
      }
      const version = hash.digest('hex').slice(0, 10)

      // replaceAll y no replace: si el marcador aparece también en un comentario
      // de la plantilla, replace sustituye ese y deja el código sin tocar. Pasó.
      const sw = (await readFile(plantilla, 'utf8'))
        .replaceAll('__VERSION__', version)
        .replaceAll('__PRECACHE__', JSON.stringify(archivos.map((f) => `./${f}`), null, 2))

      if (sw.includes('__VERSION__') || sw.includes('__PRECACHE__')) {
        this.error('el service worker quedó con marcadores sin reemplazar')
      }
      await writeFile(join(dist, 'sw.js'), sw)

      const bytes = (await Promise.all(archivos.map((f) => readFile(join(dist, f)))))
        .reduce((t, b) => t + b.length, 0)
      console.log(
        `\n  service worker: ${archivos.length} archivos precacheados · ` +
          `${(bytes / 1024).toFixed(0)} KB offline · versión ${version}\n`,
      )
    },
  }
}

async function listar(dir) {
  const entradas = await readdir(dir, { withFileTypes: true })
  const salida = []
  for (const e of entradas) {
    const p = join(dir, e.name)
    if (e.isDirectory()) salida.push(...(await listar(p)))
    else salida.push(p)
  }
  return salida
}

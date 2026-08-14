// Mergea data/huerta_gba.json (fuente) + data/enriquecimiento.json (overlay derivado,
// corregible a mano) → data/huerta_gba_enriquecido.json (lo que consume la app).
// Uso: npm run data:build
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { slugify } from './slugs.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const fuente = JSON.parse(readFileSync(join(root, 'data/huerta_gba.json'), 'utf8'))
const overlay = JSON.parse(readFileSync(join(root, 'data/enriquecimiento.json'), 'utf8'))

const errores = []
const slugsFuente = new Map(fuente.especies.map((e) => [slugify(e.nombre_comun), e]))

for (const slug of Object.keys(overlay)) {
  if (!slugsFuente.has(slug)) errores.push(`Slug del overlay sin especie en la fuente: ${slug}`)
}
for (const slug of slugsFuente.keys()) {
  if (!overlay[slug]) errores.push(`Especie de la fuente sin entrada en el overlay: ${slug}`)
}
if (errores.length) {
  console.error(errores.join('\n'))
  process.exit(1)
}

const especies = fuente.especies.map((e) => {
  const slug = slugify(e.nombre_comun)
  const { revisar, transplante_signos, ...derivado } = overlay[slug]
  const base = transplante_signos
    ? { ...e, transplante: { ...e.transplante, signos_listo: transplante_signos } }
    : e
  return { slug, ...base, ...derivado }
})

const salida = {
  meta: {
    ...fuente.meta,
    enriquecido: {
      descripcion:
        'calendario (siembra/trasplante ideal-posible por mes, método por mes), temperaturas (germinación de suelo y crecimiento de aire, con fuentes propias), dias_a_trasplante, dias_a_cosecha, dias_germinacion y asociaciones resueltas a slugs. Derivado de los textos de la fuente; correcciones en data/enriquecimiento.json.',
      convenciones:
        'Meses 1-12. Estaciones hemisferio sur: verano dic-feb, otoño mar-may, invierno jun-ago, primavera sep-nov. Heladas GBA ~jun-sep, última ~sep. Rango {min,max} en días; null = sin dato confiable.',
    },
  },
  campos_schema: fuente.campos_schema,
  categorias_suelo: fuente.categorias_suelo,
  categorias_luz: fuente.categorias_luz,
  especies,
}

writeFileSync(join(root, 'data/huerta_gba_enriquecido.json'), JSON.stringify(salida, null, 2))
console.log(`OK: ${especies.length} especies → data/huerta_gba_enriquecido.json`)

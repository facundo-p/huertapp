// Mergea data/huerta_gba.json (fuente) + data/enriquecimiento.json (overlay derivado,
// corregible a mano) → data/huerta_gba_enriquecido.json (lo que consume la app).
// Uso: npm run data:build
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { slugify } from './slugs.mjs'
import { afinarEspecie } from './afinar-calendario.mjs'
import { CLIMA, ZONA_DEFAULT } from './clima-gba.mjs'

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

  // El afinado a décadas se genera acá: no vive en el overlay hecho a mano
  // porque es derivado, y así siempre se puede regenerar desde cero.
  const { decadas, afinado } = afinarEspecie(
    slug,
    derivado.calendario,
    derivado.temperaturas,
    derivado.dias_germinacion,
    derivado.dias_a_cosecha,
  )

  return {
    slug,
    ...base,
    ...derivado,
    calendario: { ...derivado.calendario, decadas, afinado },
  }
})

const salida = {
  meta: {
    ...fuente.meta,
    enriquecido: {
      descripcion:
        'calendario en dos capas (fuente_meses = lo que dicen las fuentes, por mes; decadas = afinado a tercios de mes por zona, generado), temperaturas (germinación de suelo y crecimiento de aire, con fuentes propias), dias_a_trasplante, dias_a_cosecha, dias_germinacion y asociaciones resueltas a slugs. Derivado de los textos de la fuente; correcciones en data/enriquecimiento.json.',
      convenciones:
        'Meses 1-12. Décadas 1-36 (tercios de mes: 1 = días 1-10 de enero). Estaciones hemisferio sur: verano dic-feb, otoño mar-may, invierno jun-ago, primavera sep-nov. Rango {min,max} en días; null = sin dato confiable.',
      afinado_por_decadas:
        'El afinado solo puede recortar lo que dijeron las fuentes, nunca agregar décadas fuera de sus meses. Criterio principal: probabilidad de helada por década (FAUBA, umbral agrometeorológico de 3 °C, series de 50-63 años), evaluada en la fecha de emergencia y no en la de siembra. Criterios secundarios: rango de crecimiento contra las normales del SMN 1991-2020 y, como supuesto propio declarado, la media del aire como cota del suelo para germinar. Precisión honesta: ±10 días.',
      zonas: Object.fromEntries(
        Object.entries(CLIMA).map(([z, c]) => [
          z,
          { etiqueta: c.etiqueta, detalle: c.detalle, estacion: c.estacion, ultima_helada: c.ultimaHelada },
        ]),
      ),
      zona_default: ZONA_DEFAULT,
    },
  },
  campos_schema: fuente.campos_schema,
  categorias_suelo: fuente.categorias_suelo,
  categorias_luz: fuente.categorias_luz,
  especies,
}

writeFileSync(join(root, 'data/huerta_gba_enriquecido.json'), JSON.stringify(salida, null, 2))
console.log(`OK: ${especies.length} especies → data/huerta_gba_enriquecido.json`)

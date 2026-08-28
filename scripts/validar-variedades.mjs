/**
 * La regla 2 del proyecto, aplicada a la capa de variedades: una variedad
 * **recorta** lo que dijeron las fuentes de su especie, nunca le suma.
 *
 * La segunda mitad es la menos obvia y la que más protege. Los días no se
 * calculan: se parten de un rango que el padre ya publica. Sin eso, convertir
 * unidades entre dos fuentes —"80-100 desde trasplante" a "150-190 desde
 * siembra"— y publicar el resultado como dato pasa sin que nadie lo vea. Es lo
 * que dejó al apio afuera del catálogo.
 *
 * Devuelve los errores en vez de tirar, para que el build los junte con los
 * suyos y los muestre todos de una.
 */
export function validarRecorte(padre, hija) {
  const errores = []
  const donde = hija.slug

  for (const capa of ['siembra', 'trasplante']) {
    const union = (e) =>
      new Set([
        ...e.calendario.fuente_meses[`${capa}_ideal`],
        ...e.calendario.fuente_meses[`${capa}_posible`],
      ])
    const delPadre = union(padre)
    for (const m of union(hija)) {
      if (!delPadre.has(m)) {
        errores.push(`${donde}: ${capa} en el mes ${m}, que el padre no tiene. Si hace falta, el que está mal es el padre`)
      }
    }
  }

  for (const campo of ['dias_a_cosecha', 'dias_a_trasplante', 'dias_germinacion']) {
    const r = hija[campo]
    const base = padre[campo]
    if (!r) continue
    if (!base) {
      errores.push(`${donde}: ${campo} con el padre en null. Los días se parten, no se inventan`)
    } else if (r.min < base.min || r.max > base.max) {
      errores.push(
        `${donde}: ${campo} ${r.min}-${r.max} se sale del ${base.min}-${base.max} del padre. No se calcula: se parte`,
      )
    }
  }

  return errores
}

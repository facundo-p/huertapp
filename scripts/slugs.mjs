// Regla de slug: minúsculas, sin acentos, se toma el nombre antes de "/" o "(",
// espacios → guiones. Compartida por los scripts de datos; en la app vive en
// src/lib/data/slugs.ts (misma regla, mantener sincronizadas).
export function slugify(nombreComun) {
  return nombreComun
    .split(/[/(]/)[0]
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

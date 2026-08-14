// Misma regla que scripts/slugs.mjs (mantener sincronizadas).
export function slugify(nombreComun: string): string {
  return nombreComun
    .split(/[/(]/)[0]
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Nombre corto para espacios angostos (la matriz del calendario):
 * "Capuchina (taco de reina)" → "Capuchina", "Radicchio / Achicoria" → "Radicchio".
 * Misma regla de corte que el slug, así el nombre corto y el slug coinciden.
 */
export function nombreCorto(nombreComun: string): string {
  return nombreComun.split(/[/(]/)[0].trim()
}

/** Normaliza texto para buscar: sin acentos, minúsculas. */
export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

/** Nombres alternativos por los que el usuario podría buscar una especie. */
export const ALIAS: Record<string, string[]> = {
  pimiento: ['morron', 'morrón', 'aji morron'],
  chaucha: ['poroto', 'judia', 'judía', 'porotos verdes'],
  choclo: ['maiz', 'maíz', 'maiz dulce'],
  copete: ['tagetes', 'clavel de indias', 'copetes'],
  capuchina: ['taco de reina', 'tropaeolum'],
  melisa: ['toronjil'],
  ciboulette: ['cebollin', 'cebollín', 'cive'],
  radicchio: ['achicoria', 'radicheta'],
  kale: ['col rizada', 'berza'],
  'zapallito-de-tronco': ['zapallito', 'calabacin', 'calabacín', 'zucchini'],
  zapallo: ['calabaza', 'anco', 'cabutia'],
  batata: ['camote', 'boniato'],
  'aji-picante': ['aji', 'ají', 'chile', 'picante'],
  'repollitos-de-bruselas': ['bruselas', 'repollito'],
  'cebolla-de-verdeo': ['verdeo', 'cebolla verdeo'],
  rabanito: ['rabano', 'rábano'],
  frutilla: ['fresa'],
  arveja: ['guisante'],
}

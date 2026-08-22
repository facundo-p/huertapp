import { describe, expect, it } from 'vitest'
import { cargarEspecies } from '../src/lib/data/especies'

describe('buscar por nombre de variedad', () => {
  it('"chantenay" encuentra la derivada y no el padre', async () => {
    const { textoBusqueda } = await cargarEspecies()
    expect(textoBusqueda.get('zanahoria-chantenay-nantesa')).toContain('chantenay')
    expect(textoBusqueda.get('zanahoria')).not.toContain('chantenay')
  })

  it('el padre sigue encontrándose por sus alias', async () => {
    const { textoBusqueda } = await cargarEspecies()
    expect(textoBusqueda.get('chaucha')).toContain('poroto')
  })

  it('las derivadas heredan los alias del padre', async () => {
    // quien busca "poroto" espera ver también la enana y la de enrame
    const { textoBusqueda } = await cargarEspecies()
    expect(textoBusqueda.get('chaucha-enana')).toContain('poroto')
  })

  it('padres y todas son listas distintas, y la diferencia son las once', async () => {
    const { todas, padres } = await cargarEspecies()
    expect(padres).toHaveLength(55)
    expect(todas.length - padres.length).toBe(11)
  })
})

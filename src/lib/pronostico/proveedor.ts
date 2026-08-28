// Punto único de cableado del proveedor de pronóstico. Cambiar de proveedor
// es escribir otro adaptador de ProveedorClima y tocar esta línea.
import { openMeteo } from './openMeteo'
import type { ProveedorClima } from './tipos'

export const proveedor: ProveedorClima = openMeteo

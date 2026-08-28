// El GPS del navegador, aparte del proveedor de datos: no es de nadie.
// Redondea a 2 decimales (~1 km) — para un pronóstico alcanza y no señala
// una casa. Errores con nombre para que la UI explique sin adivinar.

const redondear2 = (n: number): number => Math.round(n * 100) / 100

export function ubicarPorGPS(
  geo: Geolocation | undefined = typeof navigator !== 'undefined' ? navigator.geolocation : undefined,
): Promise<{ lat: number; lon: number }> {
  return new Promise((resolver, rechazar) => {
    if (!geo) {
      rechazar(new Error('no-disponible'))
      return
    }
    geo.getCurrentPosition(
      (pos) => resolver({ lat: redondear2(pos.coords.latitude), lon: redondear2(pos.coords.longitude) }),
      (e) => rechazar(new Error(e.code === 1 ? 'denegado' : 'no-disponible')),
      { timeout: 10_000, maximumAge: 5 * 60_000 },
    )
  })
}

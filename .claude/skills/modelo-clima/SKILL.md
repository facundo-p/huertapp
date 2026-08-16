---
name: modelo-clima
description: Tocar el modelo climático del GBA o el afinado del calendario a décadas. Usar cuando el pedido involucre riesgo de helada, temperaturas por década, zonas del AMBA, o por qué una especie tiene tal ventana de siembra.
---

# El modelo climático y el afinado

Es la parte más delicada del repo: la que convierte meses citados en ventanas
de 10 días. Todo lo que hace es **defendible o no lo hace**.

| Archivo | Qué es |
|---|---|
| `scripts/clima-gba.mjs` | El modelo. Normales SMN 1991-2020 + estadística de heladas FAUBA + fotoperíodo. Cada constante citada en el propio archivo. |
| `scripts/afinar-calendario.mjs` | Las reglas de recorte, mes → décadas. |
| `tests/clima.test.ts` | 26 tests: monotonía, rangos plausibles, coincidencia con las normales en los anclajes. |

## La regla de oro

**El modelo solo puede recortar lo que dijeron las fuentes, nunca agregar.**

No es un lineamiento: hay un `throw` en runtime si una década cae fuera de los
meses de origen, y un test que lo verifica sobre 55 especies × 3 zonas. Si lo
que querés hacer necesita agregar una década, **no es trabajo del modelo**: es
un cambio en `data/enriquecimiento.json`, con fuente. Ver `/especie`.

## Lo que el modelo sabe y lo que no

**Bien fundado — el criterio primario:** las heladas. Portal *Heladas en la
Argentina* (CIAg-FAUBA), umbral agrometeorológico de 3 °C, series de 50 a 63
años, con fecha media y desvío. Es lo que gobierna las ventanas de primavera,
que son las que importan.

**Razonable — secundario:** la temperatura del aire, de las normales SMN
1991-2020, interpolada linealmente entre anclajes de mitad de mes. Se compara
contra `crecimiento`, que también es aire: manzanas con manzanas.

**Declaradamente supuesto:** no existe temperatura de suelo publicada para el
AMBA (verificado: la palabra "suelo" no aparece en las 847 páginas de las
normales, y no hay offset aire→suelo publicado para la región pampeana). El
modelo **no estima temperatura de suelo**. La suposición que hay está escrita en
el código y solo puede **degradar** una década, nunca descartarla. No la
asciendas sin una fuente nueva.

**Las tres zonas no son un lujo:** entre el centro porteño y La Plata hay **71
días** de diferencia en la última helada. Sin zona, la precisión sub-mensual le
erraría a media ciudad.

## Cada criterio se evalúa donde actúa

Este es el error que más veces se repitió, y siempre se ve igual: el modelo
contradice a una fuente y el umbral parece el culpable. Casi nunca lo es.

| Criterio | Momento | Por qué |
|---|---|---|
| Germinación | siembra | Es cuando la semilla está en tierra. |
| Helada | **emergencia** (`corrida()`) | Una semilla enterrada no se hiela; el plantín sí. |
| Crecimiento | **mitad de ciclo** | La sandía se siembra en octubre pero necesita los 21 °C de noviembre. |

Más las exenciones, que también son criterio y no atajo:

- `almacigo` y `almacigo_protegido` → **exentos totales** de helada. Protegerlas
  es exactamente lo que significan.
- `directa|almacigo` → **exento** también. Tener dos varas para el mismo riesgo
  fue el bug del hueco de octubre del tomate.
- `tolera_min <= 0` → no se penaliza por frío aunque diga `sensible`.
- Ciclo > 150 días → no se evalúa "mitad de ciclo", porque cae en invierno y eso
  es justamente el punto (frutilla).

## Cuando el modelo contradice a una fuente

**Gana la fuente.** Pasó cinco veces y las cinco el modelo estaba mal. El
procedimiento:

1. Identificá **en qué momento del ciclo** está actuando el criterio que
   recorta. El bug suele ser *cuándo*, no *cuánto*.
2. Recién si el momento es correcto, mirá el umbral y el margen.
3. Escribí la razón en un comentario junto al cambio. Los márgenes actuales
   (`MARGEN = 1.5`, `MARGEN_CRECIMIENTO = 4` ≈ 2σ de la variabilidad
   interanual) están así por hallazgos concretos, no por gusto.

## Después de cualquier cambio

```bash
npm run data:build      # tira si se violó la regla de oro
npm test                # 26 tests de clima + 441 de estructura
npm run data:tabla      # → data/REVISION_CALENDARIO.md
```

Y revisá en `REVISION_CALENDARIO.md`, sin saltearte ninguno:

- **Cuántos recortes hay en total.** Bajaron de 40 a 6 cuando se arregló la
  coherencia de helada. Si de golpe suben mucho, el modelo se volvió agresivo.
- **Huecos**: una década degradada con vecinas ideales de los dos lados es un
  criterio incoherente. La pasada de monotonía debería atajarlos —el riesgo de
  helada baja de forma monótona en primavera— pero verificá.
- **Ventanas vacías**: ninguna especie puede quedar sin décadas ideales en
  ninguna de las tres zonas.
- **Las especies `SIN_AFINAR`** siguen a resolución mensual a propósito
  (perennes leñosas, y las gobernadas por fotoperíodo). Un "sin afinar" honesto
  es mejor que una precisión falsa.

Y mirá el calendario dibujado, en las tres zonas:

```bash
npm run shots
```

→ `calendario-completo.png`, `calendario-zona-periurbano.png`.

## Al contarlo

La precisión honesta del afinado es **±10 días** y va declarada. Nunca lo
presentes como dato de fuente: es un modelo, y lo que lo hace defendible es que
la capa citable de abajo queda intacta y auditable.

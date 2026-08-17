# Changelog

Qué cambió en cada versión de Huerta GBA.

Está escrito **para quien usa la app**, no como volcado de commits: si un cambio
no se nota desde afuera, no va acá (para eso está el historial de git). Formato
inspirado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/), y las
versiones siguen [SemVer](https://semver.org/lang/es/) de tres partes.

Qué significa cada parte en este proyecto:

- **MAYOR** — cambia lo que ya sabías usar, o los datos guardados necesitan
  migración.
- **MENOR** — funciones nuevas, y **también datos nuevos o corregidos**: sumar
  una especie o corregir una ventana de siembra no es un detalle técnico, es de
  lo que se trata la app.
- **PARCHE** — arreglos, textos, accesibilidad, performance.

---

> Mientras se trabaja en `staging`, los cambios se anotan bajo una sección
> `## [Sin publicar]` acá arriba. Al hacer un release, esa sección pasa a ser la
> versión nueva con su fecha.

## [Sin publicar]

### Agregado

- **"Mientras crece" en cada ficha**: qué hay que ir haciendo entre la siembra
  y la cosecha, práctica por práctica y con el momento en que toca. Raleo,
  aporque, tutorado, poda, mulch, blanqueo, riego, abonado, desmalezado,
  rotación, polinización, reparo, contención y división de mata: **123
  cuidados en las 55 especies**. La información estaba, pero en un párrafo
  corrido que servía para leer una vez y no para el sábado a la mañana con la
  tijera en la mano.

### Cambiado

- Al pie de Ajustes ahora va **solo el número de versión**. El código raro que
  lo acompañaba era el commit del build; no le decía nada a nadie y le sacaba
  claridad a la única línea que tiene que poder leerse de un vistazo.

---

## [1.0.0] — 2026-08-17

La primera versión completa. La app hace las tres cosas para las que se pensó:
decir qué sembrar esta semana, seguir lo que ya plantaste, y explicar de dónde
sale cada dato.

### Agregado

**El calendario, que es el corazón.** 55 especies con sus ventanas de siembra y
trasplante, afinadas a **períodos de 10 días** en vez de meses enteros — porque
no es lo mismo sembrar a principios que a fines de septiembre. El afinado sale
de un modelo climático del GBA construido sobre las normales 1991-2020 del SMN y
la estadística de heladas de FAUBA.

**Tres zonas del AMBA.** Entre el centro porteño y La Plata hay 71 días de
diferencia en la última helada. Se elige en Ajustes; por defecto, Conurbano.

**Trazabilidad completa.** Cada dato lleva sus fuentes con link y su índice de
confianza del 1 al 10, accesibles desde la ficha. El calendario afinado nunca
agrega una fecha que las fuentes no dijeran: solo puede recortar.

**Mi huerta.** Tus plantas con su etapa, fechas estimadas de trasplante y
cosecha, diario con fotos, y avisos de compatibilidad entre lo que tenés
plantado.

**Vigilancia de germinación.** Si una siembra se pasó del plazo, la app lo dice
y explica las causas posibles — distinguiendo lo que puede afirmar con datos
(la temperatura estuvo por debajo del óptimo) de lo que es una lista para ir a
chequear (humedad, profundidad, edad de la semilla).

**Hoy y el motor de tareas.** Qué toca hacer cada día, derivado de tus plantas y
del clima de tu zona. Toda tarea dice de dónde sale.

**Backup completo.** Un archivo JSON con todo adentro, fotos incluidas. Es la
red de seguridad: los datos viven solo en tu aparato.

**Funciona sin internet.** Después de la primera visita entra completa —las 55
especies incluidas— y se instala en la pantalla de inicio.

**Avisos opcionales**, con la letra chica adelante: en iPhone no llegan con la
app cerrada, y se dice antes de que toques el botón.

**Número de versión** al pie de Ajustes, con el commit exacto del build — para
que un reporte se pueda reproducir.

### Notas

- Precisión declarada del afinado: **±10 días**. Es un modelo, y está dicho en
  el glosario y al pie de cada ficha.
- Nada de cuentas, servidores ni nube. Dos teléfonos son dos huertas distintas;
  se pasan con el archivo de backup.

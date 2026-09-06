# Handoff · Huerta GBA — "Cantero de noche" y "Cantero de día"

## Qué es esto

El rediseño de Huerta GBA en **dos temas idénticos e intercambiables**: `noche`
(fondo tierra oscura) y `día` (papel claro). Misma estructura, misma tipografía,
mismas medidas: **lo único que cambia son los colores**, y se cambian con un
control. Además del tema, el rediseño cambia varias **funcionalidades** respecto
de la versión actual (`facundo-p/huertapp@staging`, a la fecha del handoff: 1.2.0).

Por eso el paquete viene partido en dos:

| Documento | Qué cubre |
|---|---|
| [`01-diseno-dos-temas.md`](01-diseno-dos-temas.md) | Los dos temas: tokens, tipografía, medidas, componentes nuevos, y cómo montar el switch de un click |
| [`02-funcionalidad.md`](02-funcionalidad.md) | Lo que cambia de comportamiento pantalla por pantalla, contra el código actual, con lo que hay que agregar al modelo de datos y a los motores |

`cantero-referencia.html` es el prototipo: abrilo en el navegador y navegá las
cinco pantallas de cada tema, una al lado de la otra.

## Sobre los archivos de diseño

`cantero-referencia.html` es una **referencia de diseño hecha en HTML**: un
prototipo que muestra el aspecto y el comportamiento buscados, no código para
copiar. Los estilos están inline y los datos están hardcodeados a propósito —
sirven para medir, no para importar.

La tarea es **rehacer estas pantallas en el código real** (`React 19 + Vite +
react-router`, CSS por componente, tokens en `src/theme.css`) siguiendo los
patrones que ya tiene el repo: un `.css` por componente, tokens sin excepción,
íconos de `src/icons`, y los motores puros de `src/lib`.

## Fidelidad

**Alta (hifi).** Colores, tipografías, tamaños, radios y espaciados son finales
y están medidos: el documento de diseño trae los valores exactos. Donde el
prototipo se aparta de lo implementable, está marcado como tal.

Dos salvedades honestas:

- Los íconos del prototipo son redibujados; **usá los de `src/icons`**, que son
  los definitivos (trazo 1.75, `currentColor`).
- Las fotos del diario son gradientes de relleno. En la app son `Foto` blobs
  desde IndexedDB.

## Alcance

Cinco pantallas, en los dos temas:

1. **Hoy** — carril vertical de la semana (clima y tareas en el mismo eje)
2. **Explorar** — catálogo con anillo anual por especie
3. **Mi huerta** — gantt del ciclo de cada planta
4. **Ficha de especie** (Tomate) — los 13 campos del catálogo con confianza y fuentes
5. **Detalle de planta** (Los del cajón) — ciclo, germinación y diario

**Fuera de alcance, sin diseñar todavía:** Calendario, Glosario, Ajustes, alta
de planta (`AltaPlanta`), ficha de ubicación (`FichaUbicacion`), backup. Para
esas pantallas, aplicá los tokens del tema y los patrones de este documento; no
inventes layouts nuevos sin consultar.

## Capturas

Las capturas **no están en el repo**: están adjuntas en el issue del epic,
[#66](https://github.com/facundo-p/huertapp/issues/66). Son las cinco pantallas
en los dos temas, a 2× (780 × 1688), en el mismo orden en los dos juegos para
poder compararlas de a pares:

| | Cantero de día | Cantero de noche |
|---|---|---|
| Hoy | `dia-01-hoy.png` | `noche-01-hoy.png` |
| Explorar | `dia-02-explorar.png` | `noche-02-explorar.png` |
| Mi huerta | `dia-03-mi-huerta.png` | `noche-03-mi-huerta.png` |
| Ficha de especie | `dia-04-ficha-tomate.png` | `noche-04-ficha-tomate.png` |
| Detalle de planta | `dia-05-detalle-planta.png` | `noche-05-detalle-planta.png` |

Son el estado inicial de cada pantalla, sin scrollear: la ficha de especie y el
detalle de planta siguen bastante más abajo (13 campos y el diario). Para ver el
resto, y para medir, abrí `cantero-referencia.html`.

## Orden sugerido

1. Los dos bloques de tokens y el switch (`01`, sección 1 y 2) — sin eso, nada
   más se puede evaluar.
2. Tipografía y `TabBar` flotante (`01`, secciones 3 y 6).
3. `AnilloAnual` (`01`, sección 5.1), que es el componente que más se reusa:
   reemplaza a `MonthStrip` en las tarjetas y aparece doble en la ficha.
4. Mi huerta con el gantt (`02`, sección 3), que es el cambio funcional más
   grande porque necesita ventanas completas de `estimar()`.
5. Hoy con el carril semanal (`02`, sección 1), que necesita fechar las tareas.

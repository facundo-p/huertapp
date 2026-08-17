---
name: release
description: Publicar una versión nueva de la app. Usar cuando la persona dé la orden de release, diga "sacá una versión", "publicá lo que hay en staging", "hacé el release" o equivalente.
---

# Sacar un release

Un release lleva lo que hay en `staging` a `main`, y eso **publica**: el push a
main dispara el deploy y le cambia la app a todo el que ya la tiene instalada.
Por eso es un acto deliberado, y por eso lo pide la persona — nunca se hace por
iniciativa propia.

## Antes de empezar

```bash
git checkout staging && git pull
git log --oneline origin/main..staging      # qué se va a publicar
```

Si no hay nada por delante de main, decilo y no sigas.

## 1 · Decidir la versión

SemVer de tres partes. La parte que sube se decide **por lo que cambió**, no por
cuánto tiempo pasó:

| Sube | Cuándo |
|---|---|
| **MAYOR** | Cambia lo que la gente ya sabía usar, o los datos guardados necesitan migración. En una app con IndexedDB local, cualquier cambio de esquema que no sea retrocompatible es mayor. |
| **MENOR** | Funciones nuevas. Y **datos nuevos o corregidos**: sumar una especie, cambiar una ventana de siembra, corregir una temperatura. En esta app los datos *son* el producto. |
| **PARCHE** | Arreglos, textos, accesibilidad, performance, dependencias. |

Los commits ya usan prefijos convencionales, así que el borrador sale de ahí:

```bash
git log --format='%s' origin/main..staging
```

`feat:` → menor · `fix:`/`chore:`/`docs:`/`test:` → parche · `data:` → **menor**
(ver arriba) · un `!` o `BREAKING CHANGE` → mayor.

**Decilo antes de aplicarlo**, con el motivo en una línea: *"va 1.1.0 porque
entran dos especies nuevas"*. Si la persona quiere otra, manda ella.

## 2 · Preparar el release en staging

```bash
npm version <nueva> --no-git-tag-version    # actualiza package.json y el lock
```

Y en `CHANGELOG.md`: la sección `## [Sin publicar]` pasa a
`## [X.Y.Z] — AAAA-MM-DD` con la fecha de hoy.

**El changelog se escribe para quien usa la app, no para quien lee commits.** Si
un cambio no se nota desde afuera, no va. Nada de listas de mensajes de commit
pegados: una frase que diga qué cambia para la persona, y por qué le importa.
Mirá las entradas anteriores para el tono.

```bash
git add -A && git commit -m "release: X.Y.Z" && git push
```

## 3 · Verificar antes de publicar

```bash
npx tsc -b && npm test && npm run e2e
```

En verde las tres. Si algo falla, se arregla en staging: no se publica y se
avisa.

## 4 · El PR

```bash
gh pr create --base main --head staging \
  --title "Release X.Y.Z" \
  --body "<la sección del changelog de esta versión>"
```

El cuerpo del PR es la sección del changelog, tal cual: así queda registrado en
GitHub sin escribir dos veces lo mismo.

## 5 · Merge y etiqueta

```bash
gh pr merge --merge          # merge commit, no squash: conserva la historia
gh run watch                 # el deploy corre solo con el push a main
```

Esperá a que el workflow termine **en verde**. Si falla, no se publicó nada
—los tests corren antes del deploy— y hay que arreglar en staging y repetir.

Con el deploy publicado:

```bash
git checkout main && git pull
git tag -a vX.Y.Z -m "X.Y.Z"
git push origin vX.Y.Z
gh release create vX.Y.Z --title "X.Y.Z" --notes "<la sección del changelog>"
```

## 6 · Cerrar el ciclo

```bash
git checkout staging && git merge main && git push
```

Y abrí una sección `## [Sin publicar]` vacía arriba del changelog, para que la
próxima tanda tenga dónde anotarse.

## 7 · Verificar lo publicado de verdad

No alcanza con que el workflow esté verde:

```bash
curl -s https://facundo-p.github.io/huertapp/ | grep -o '<title>[^<]*'
```

Y sobre todo: **abrir la app y mirar que la versión al pie de Ajustes sea la
nueva**. Es el único chequeo que prueba que lo que se publicó es lo que se
quería publicar. Al pie va solo `Huerta GBA X.Y.Z`: el hash del commit se sacó
a propósito, no es que falte.

Avisale a la persona que quien ya tenga la app instalada va a ver el cartel de
"Hay una versión nueva" la próxima vez que la abra — no se actualiza sola, y eso
es a propósito.

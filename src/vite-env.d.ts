/// <reference types="vite/client" />

/** Versión semántica de la app (de package.json), inyectada en el build. */
declare const __VERSION_APP__: string
/** Commit corto con el que se compiló. `sin-git` si no hay repo. */
declare const __COMMIT_APP__: string

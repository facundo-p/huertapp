import type { CategoriaSuelo, Fuente, TipoCuidado } from './data/types'

/**
 * El vocabulario de la huerta, explicado.
 *
 * La app venía usando palabras como "raleo", "aporque" o "blanqueo" dando por
 * sentado que se entienden. Para quien arranca no se entienden, y la ficha
 * queda diciendo qué hacer sin decir cómo.
 *
 * Distinción que vale la pena tener presente al editar esto: **una definición
 * no es un dato agronómico**. "Raleo es sacar plantitas de más" es lo que la
 * palabra significa, y no necesita fuente. Una proporción, una temperatura o
 * un plazo sí: ahí van con su cita y su confianza, como todo lo demás
 * (ver `SUSTRATO`).
 */

export interface Termino {
  termino: string
  que_es: string
  /** el paso a paso, cuando la palabra nombra algo que se hace */
  como?: string
}

/** Las catorce labores de la sección "Mientras crece" de cada ficha. */
export const LABORES: Record<TipoCuidado, Termino> = {
  riego: {
    termino: 'Riego',
    que_es:
      'Regar "parejo" no es regar mucho: es que el sustrato no pase de charco a polvo y de vuelta. Casi todo lo que se raja, se pudre o amarga viene de ese vaivén, no de la cantidad total de agua.',
    como: 'Meté un dedo en la tierra: si sale seco, regá. Mejor temprano o al atardecer, al pie de la planta y no sobre las hojas —el agua sobre la hoja al sol es la puerta de entrada de los hongos.',
  },
  raleo: {
    termino: 'Raleo',
    que_es:
      'Sacar plantitas de más para que a las que quedan les sobre espacio, luz y comida. Cuesta —son plantas sanas— y es de las cosas que más cambian el resultado en zanahoria, remolacha, nabo y rabanito.',
    como: 'Cuando tienen sus primeras hojas de verdad y ya se estorban, **cortá al ras** las más débiles con tijera. No las arranques: tirando movés la raíz de la que se queda.',
  },
  aporque: {
    termino: 'Aporque',
    que_es:
      'Arrimarle tierra a la base de la planta. Según el cultivo hace tres cosas distintas: le da sostén para que no se tumbe, tapa lo que no tiene que ver la luz (la papa), o blanquea lo que se come tierno (el puerro).',
    como: 'Con la mano o con una azadita, juntá tierra alrededor del tallo formando un montoncito. De a poco y varias veces, no todo junto.',
  },
  tutorado: {
    termino: 'Tutorado',
    que_es:
      'Darle a la planta algo a qué agarrarse: una caña, un hilo tenso, una espaldera, unas ramas. Lo piden las que trepan y las que se cargan de fruta.',
    como: 'Clavá el tutor **al plantar** y no después, para no cortarle raíces ya hechas. Atá flojo y en forma de ocho, con el cruce entre el tallo y la caña: así el tallo puede engordar sin que el hilo lo estrangule.',
  },
  poda: {
    termino: 'Poda',
    que_es:
      'Sacarle partes vivas a la planta para que la energía vaya a otro lado. Tiene nombres según qué se saca: **desbrote** son los chupones del tomate, **despunte** es cortarle la punta a una guía o a una rama, **pinzado** es hacerlo con los dedos en algo tierno, como la albahaca.',
    como: 'Cuanto más chico el brote, mejor: sale con los dedos y la herida cierra sola. Si ya está grueso, tijera limpia y en día seco.',
  },
  mulch: {
    termino: 'Mulch (acolchado o cobertura)',
    que_es:
      'Taparle la tierra con algo: paja, hojas secas, cartón, chips de poda, plástico negro. Un suelo tapado retiene la humedad, no deja crecer yuyos, amortigua el golpe de calor y evita que la lluvia salpique tierra —y hongos— sobre las hojas de abajo.',
    como: 'Cubrí toda la superficie dejando libre un anillo alrededor del tallo, para que el cuello de la planta no quede en contacto con material húmedo.',
  },
  blanqueo: {
    termino: 'Blanqueo',
    que_es:
      'Dejar sin luz una parte de la planta para que salga blanca, tierna y menos amarga. Es lo que hace que el puerro tenga esa parte blanca larga y que el apio no sea todo hebra.',
    como: 'Tres maneras según el cultivo: **aporcando** (puerro, cebolla de verdeo), **fajando o atando** la planta (apio), o **tapándola** entera (radicchio, y las hojas sobre la pella en la coliflor).',
  },
  polinizacion: {
    termino: 'Polinización',
    que_es:
      'Que el polen llegue de la flor masculina a la femenina. En zapallo, zapallito, melón, sandía y pepino lo hacen las abejas, y si no aparecen, los frutitos amarillean y se caen. El maíz es aparte: lo poliniza el viento.',
    como: 'A mano: cortá una flor macho (la del tallito fino, sin fruto atrás), sacale los pétalos y pasá el polen sobre el centro de la flor hembra (la que ya tiene el fruto chiquito). Temprano a la mañana, que es cuando están abiertas.',
  },
  abonado: {
    termino: 'Abonado',
    que_es:
      'Reponerle al suelo lo que las plantas se llevan. En una huerta que produce todo el año no alcanza con la tierra que había.',
    como: 'Compost o humus de lombriz bien hechos, incorporados antes de plantar o esparcidos alrededor de la planta. **Nunca estiércol fresco**: quema las raíces y deforma las de zanahoria y remolacha.',
  },
  desmalezar: {
    termino: 'Desmalezado (carpida)',
    que_es:
      'Sacar lo que crece sin haberlo sembrado. No es prolijidad: los yuyos le ganan el agua, la luz y el nitrógeno a lo que sí sembraste, sobre todo a las plantas de hoja fina como cebolla y puerro, que no dan sombra y no pueden competir.',
    como: 'De raíz y con la tierra húmeda, que salen enteros. Cuanto más chicos, menos raíz mueven al salir.',
  },
  proteger: {
    termino: 'Reparo',
    que_es:
      'Ponerle a la planta algo entre ella y lo que la castiga: media sombra en el calor, una cobertura de noche cuando puede helar, un rincón sin viento.',
    como: 'Para el calor, media sombra de malla o de una planta más alta al oeste. Para la helada, una tela o una botella cortada **puesta antes de que caiga el sol** y sacada a la mañana: el daño se hace de madrugada, y tapar a las diez de la noche es tarde.',
  },
  contener: {
    termino: 'Contención',
    que_es:
      'Ponerle un límite físico a las que se expanden solas. La menta y la melisa avanzan por debajo de la tierra con rizomas y, si las dejás sueltas en un bancal, en dos temporadas es un bancal de menta.',
    como: 'Maceta —incluso enterrada— o una barrera hundida en el suelo alrededor del cantero. Y a las que se expanden por semilla, como la borraja, cortarles las flores antes de que semillen.',
  },
  dividir: {
    termino: 'División de mata',
    que_es:
      'Partir en varias una planta que ya hizo mata. Sirve para dos cosas a la vez: multiplicarla sin pasar por la semilla, y rejuvenecerla cuando el centro se aclaró y ya no tira brotes nuevos.',
    como: 'Desenterrala entera, separala en gajos que tengan **raíz y brotes**, y volvé a plantar. Mejor en otoño o a fin de invierno, cuando la planta está tranquila.',
  },
  rotacion: {
    termino: 'Rotación',
    que_es:
      'No repetir la misma familia de plantas en el mismo lugar temporada tras temporada. Las enfermedades y las plagas del suelo son bastante específicas de cada familia: si les dejás el mismo cantero, se acumulan.',
    como: 'Anotá qué familia hubo en cada cantero y hacelas girar. Las cinco que más aparecen en esta app: **solanáceas** (tomate, papa, pimiento, ají, berenjena), **crucíferas** (repollo, brócoli, coliflor, kale, rúcula, rabanito, nabo), **cucurbitáceas** (zapallo, zapallito, pepino, melón, sandía), **aliáceas** (ajo, cebolla, puerro, ciboulette) y **leguminosas** (chaucha, arveja, haba). Después de una leguminosa el suelo queda mejor que antes: fijan nitrógeno.',
  },
}

/** Palabras que aparecen en las fichas y que no son labores. */
export const PALABRAS: Termino[] = [
  {
    termino: 'Almácigo',
    que_es:
      'Criar los plantines juntos y protegidos en un recipiente chico, para después pasarlos a su lugar definitivo. Se hace cuando afuera todavía hace frío, cuando la semilla es cara, o para no ocupar el cantero durante semanas con algo que todavía es un poroto.',
  },
  {
    termino: 'Siembra directa',
    que_es:
      'Sembrar donde la planta se va a quedar. Es obligatorio en las de raíz —zanahoria, rabanito, nabo— y en las de raíz pivotante como el cilantro o la borraja: el trasplante les rompe la raíz principal y la planta ya no se recupera.',
  },
  {
    termino: 'Plantación',
    que_es:
      'Cuando no se siembra semilla sino una parte de otra planta: un diente de ajo, un tubérculo de papa, un gajo de romero, una corona de frutilla. Por eso en esas fichas no hay días de germinación: no hay nada que germinar.',
  },
  {
    termino: 'Plantín',
    que_es: 'La planta chica, lista para pasar del almácigo a la tierra.',
  },
  {
    termino: 'Pan de tierra',
    que_es:
      'El terrón de sustrato que sale pegado a las raíces cuando sacás un plantín de su maceta. Que salga entero es la diferencia entre un trasplante que la planta ni nota y uno del que tarda dos semanas en recuperarse.',
    como: 'Regá un rato antes de trasplantar y sacá el plantín empujando desde abajo, nunca tirando del tallo.',
  },
  {
    termino: 'Hojas verdaderas',
    que_es:
      'Las que salen después de las dos primeras. Esas dos primeras —los cotiledones— venían dentro de la semilla y son la reserva; las verdaderas ya tienen la forma de la especie. Es la señal que marca el momento del raleo y, más adelante, del trasplante.',
  },
  {
    termino: 'Ahilarse (etiolarse)',
    que_es:
      'Estirarse buscando luz. El tallo sale largo y finito, más pálido, con mucha distancia entre una hoja y la siguiente, y la planta queda endeble. Le pasa al plantín en la bandeja germinadora y le pasa igual a la planta grande puesta a la sombra: por eso en tantas fichas vas a leer "con poca luz se ahíla".',
    como: 'No se endereza: ese tramo de tallo ya creció así. Lo único que lo evita es la luz, y desde temprano — apenas asoman los brotes ya tienen que estar recibiendo sol directo un rato del día.',
  },
  {
    termino: 'Espigado (subida a flor)',
    que_es:
      'Cuando una planta de hoja decide que se terminó el asunto y tira una vara con flores. Las hojas se ponen duras y amargas y no vuelven atrás. Lo dispara el calor y los días largos: es la razón por la que la lechuga, la rúcula, la espinaca y el cilantro se siembran en las épocas frescas.',
  },
  {
    termino: 'Acogollar',
    que_es:
      'Armar el cogollo: que las hojas del centro se cierren unas sobre otras formando una cabeza compacta, como en la lechuga capuchina o el repollo.',
  },
  {
    termino: 'Cuaje',
    que_es:
      'El momento en que una flor polinizada empieza a convertirse en fruto. "No cuajó" quiere decir que la flor se cayó sin llegar a eso, casi siempre por falta de polinización o por estrés de agua o calor.',
  },
  {
    termino: 'Pella',
    que_es: 'La cabeza blanca de la coliflor, que en realidad es un ramo de flores sin abrir.',
  },
  {
    termino: 'Escapo floral',
    que_es:
      'El tallito que sube a florecer desde el centro de la planta. En el ajo y en la ciboulette conviene cortarlo: lo que la planta iba a gastar en flor lo pone en el bulbo o en la hoja.',
  },
  {
    termino: 'Chupón',
    que_es:
      'El brote que sale en la axila del tomate, justo en la V entre el tallo y una hoja. Si lo dejás, se hace una planta entera dentro de la planta.',
  },
  {
    termino: 'Estolón',
    que_es:
      'La guía que la frutilla tira por arriba de la tierra y que echa raíz donde toca. Sirve para multiplicarla; mientras da fruta, conviene sacarlos.',
  },
  {
    termino: 'Rizoma',
    que_es:
      'Tallo que crece por debajo de la tierra y va sacando plantas nuevas a medida que avanza. Es lo que hace invasoras a la menta y a la melisa.',
  },
  {
    termino: 'Suelo franco',
    que_es:
      'El suelo equilibrado: ni tan arenoso que el agua lo atraviese sin dejar nada, ni tan arcilloso que se apelmace y se encharque. Es el que pide la mayoría de las hortalizas.',
    como: 'Prueba casera: agarrá un puñado de tierra húmeda y apretalo. Si se deshace apenas abrís la mano es arenoso; si queda un chorizo que se puede doblar sin romperse es arcilloso; si mantiene la forma pero se parte al doblarlo, es franco.',
  },
  {
    termino: 'Drenaje',
    que_es:
      'Con qué facilidad el agua atraviesa el suelo y se va. Sin drenaje las raíces quedan bajo el agua, no respiran y se pudren: es la causa de muerte más común en maceta, y le pasa mucho más a las aromáticas leñosas —romero, lavanda, tomillo— que la sequía.',
    como: 'En maceta: agujeros abajo de verdad, árido en la mezcla, y **el plato vacío**. Un plato con agua permanente anula todo lo demás.',
  },
  {
    termino: 'Materia orgánica',
    que_es:
      'Todo lo que fue vivo y se está descomponiendo en el suelo: compost, humus de lombriz, restos vegetales. Alimenta, esponja la tierra y la ayuda a retener agua. Es lo que se gasta y hay que ir reponiendo.',
  },
  {
    termino: 'pH',
    que_es:
      'Qué tan ácido o alcalino es el suelo, del 0 al 14, con 7 en el medio. Casi todas las hortalizas están cómodas entre 6 y 7,5. Fuera de ese rango los nutrientes pueden estar en la tierra y la planta igual no poder tomarlos.',
  },
  {
    termino: 'Helada agrometeorológica',
    que_es:
      'El umbral que usan los boletines para hablar de helada: 3 °C medidos en el abrigo meteorológico, a metro y medio del suelo. No es un error que no diga 0 °C — al ras del suelo, donde están las plantas, ya está helando. Es el umbral con el que está armado el calendario de esta app.',
  },
]

/**
 * Cómo se arma la tierra.
 *
 * Acá sí hay un dato agronómico y va con su fuente. Ojo con la tentación de
 * dar cinco recetas exactas, una por categoría de suelo: **ninguna fuente da
 * eso**. Lo que hay es una mezcla base citable y la dirección en la que se
 * corre para cada caso, que es lo que se puede afirmar sin inventar.
 */
export const SUSTRATO = {
  base: 'Dos partes de compost o tierra abonada, dos partes de tierra negra y una parte de arena gruesa o perlita.',
  quien:
    'Janine Schonwald, ingeniera agrónoma del CIPAF (INTA), especialista en agroecología.',
  confianza: 7,
  fuente: {
    titulo: 'Huerta urbana: qué necesitás para hacer una en tu balcón, en el patio o la terraza',
    url: 'https://www.lanacion.com.ar/sociedad/huerta-urbana-que-necesitas-hacer-tu-balcon-nid2389761/',
    organizacion: 'La Nación (con Janine Schonwald, CIPAF-INTA)',
  } satisfies Fuente,
  /**
   * La receta de arriba es la del contenedor definitivo, y lleva compost.
   * Quien la lea y la use para llenar la bandeja germinadora va a hacer justo
   * lo que las fuentes de germinación desaconsejan, así que la distinción va
   * dicha y no sobreentendida. No se contradicen: son dos etapas.
   */
  semillero: {
    titulo: 'El de la bandeja germinadora es otro',
    texto:
      'Para germinar, la mezcla va más fina, más liviana y **sin compost ni humus**. No es que el compost sea malo: en la bandeja juega en contra. Aporta sales que frenan la germinación, y si todavía no terminó de hacerse suelta ácidos que le pegan a la plántula. La tierra de jardín tampoco va: las mezclas de germinación son sin tierra justamente para escaparle a los hongos del suelo y para que el agua drene.',
    confianza: 8,
    fuente: {
      titulo: 'Potting Media and Plant Propagation',
      url: 'https://extension.psu.edu/potting-media-and-plant-propagation',
      organizacion: 'Penn State Extension',
    } satisfies Fuente,
  },
  /** Por qué las recetas que circulan no coinciden. */
  advertencia:
    'Vas a encontrar otras proporciones dando vueltas: 1-1-1, 3-2-1, mitad y mitad. No coinciden, y no vale la pena pelearse por eso. En lo que sí coinciden todas es en las tres funciones que tiene que cumplir la mezcla, y con eso alcanza para corregir la tuya mirándola.',
  funciones: [
    { nombre: 'Materia orgánica', para_que: 'alimenta y esponja', ejemplos: 'compost, humus de lombriz, tierra abonada' },
    { nombre: 'Tierra', para_que: 'da cuerpo y sostiene la raíz', ejemplos: 'tierra negra de jardín' },
    { nombre: 'Árido', para_que: 'abre poros para que el agua escurra y entre aire', ejemplos: 'arena gruesa, perlita' },
  ],
}

/** Hacia dónde correr la mezcla base según lo que pide la especie. */
export const AJUSTE_SUELO: Record<CategoriaSuelo, string> = {
  ARENOSO_DRENANTE:
    'Más árido y menos materia orgánica: que el agua pase de largo. Es lo que piden el romero, la lavanda y el tomillo, a los que mata mucho más el agua que la sed.',
  FRANCO_FERTIL: 'La mezcla base tal cual. Es el comodín de la huerta.',
  HUMEDO_RICO:
    'Más materia orgánica y menos árido, para que retenga. Y encima, mulch: es la única forma de que una maceta no se seque todos los días en enero.',
  PROFUNDO_SUELTO:
    'Acá lo que importa no es la receta sino la profundidad y que no haya nada duro abajo. Zanahoria, remolacha y nabo salen bifurcadas cuando chocan con una piedra, un terrón o el fondo de una maceta baja.',
  RUSTICO_TOLERANTE:
    'Se arreglan con lo que haya. En la capuchina y en el cosmos, además, **conviene** que la tierra sea pobre: con mucho nitrógeno hacen hojas y no flores.',
}

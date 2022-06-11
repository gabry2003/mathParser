/**
 * Opzioni per l'inizializzazione di un oggetto di tipo Grafico
 *
 * @typedef {Object} AsseGraficoOptions
 * @property {number} min=-20 - Valore minimo dell'asse
 * @property {number} max=20 - Valore massimo dell'asse
 * @author Gabriele Princiotta <gabriprinciott@gmail.com>
 * @version 1.0
 */

/**
 * Colori che devono avere gli elementi nel grafico
 *
 * @typedef {Object} ColoriGraficoOptions
 * @property {string} assi='#444444' - Colore che devono avere gli assi
 * @property {string} punti='#DD4B44' - Colore che devono avere i punti
 * @property {string} puntiFunzione='4D4DFF' - Colore che devono avere i punti trovati della funzione
 * @property {string} funzione='#484848' - Colore che deve avere la funzione
 * @property {string} testo='#444444'
 * @author Gabriele Princiotta <gabriprinciott@gmail.com>
 * @version 1.0
 */

/**
 * Opzioni dell'animazione del grafico
 *
 * @typedef {Object} AnimazioneGraficoOptions
 * @property {boolean} animazione=false - Se utilizzare un'animazione
 * @property {boolean} loop=false - Se l'animazione deve essere in loop
 * @author Gabriele Princiotta <gabriprinciott@gmail.com>
 * @version 1.0
 */

/**
 * Opzioni per l'inizializzazione di un oggetto di tipo Grafico
 *
 * @typedef {Object} GraficoOptions
 * @property {Array.<AsseGraficoOptions>} assi - Opzioni degli assi
 * @property {ColoriGraficoOptions} colori - Colori da avere nel grafico
 * @property {string} font='Poppins' - Font utilizzato nel testo
 * @property {number} focus=3 - Focus della fotocamera
 * @property {AnimazioneGraficoOptions} animazione - Opzioni dell'animazione
 * @author Gabriele Princiotta <gabriprinciott@gmail.com>
 * @version 1.0
 */

/**
 * Questa classe serve a gestire la visualizzazione del grafico
 *
 * @class Grafico
 * @classdesc Termine di un'espressione
 * @param {GraficoOptions} options Opzioni per la visualizzazione del grafico
 * @author Gabriele Princiotta <gabriprinciott@gmail.com>
 * @version 1.0
 */
function Grafico(options) {
  if (options == null || options == undefined) options = {};

  // Carico i valori di default
  options.font = options.font || "Poppins";
  if (options.focus == undefined || options.focus == null) options.focus = 3;

  if (options.colori == undefined || options.colori == null) {
    options.colori = {
      assi: "#444444",
      punti: "#f400a1",
      puntiFunzione: "#4D4DFF",
      funzione: "#484848",
      testo: "#444444",
    };
  } else {
    if (!options.colori) options.colori = "#444444";
    if (!options.punti) options.punti = "#DD4B44";
    if (!options.puntiFunzione) options.puntiFunzione = "#4D4DFF";
    if (!options.funzione) options.funzione = "#484848";
    if (!options.testo) options.testo = "#444444";
  }

  if (options.assi == undefined || options.assi == null) {
    options.assi = [
      {
        min: -20,
        max: 20,
      },
      {
        min: -20,
        max: 20,
      },
    ];
  } else {
    for (let i = 0; i < options.assi.length; i++) {
      if (options.assi[i] == undefined || options.assi[i] == null) {
        options.assi[i] = {
          min: -20,
          max: 20,
        };
      } else {
        if (options.assi[i].min == undefined || options.assi[i].min == null)
          options.assi[i].min = -20;
        if (options.assi[i].max == undefined || options.assi[i].max == null)
          options.assi[i].max = 20;
      }
    }
  }

  if (options.animazione == undefined || options.animazione == null) {
    options.animazione = {
      animazione: false,
      loop: false,
    };
  } else {
    if (options.animazione == null || options.animazione == undefined)
      options.animazione = false;
    if (options.loop == null || options.loop == undefined) options.loop = false;
  }

  /**
   * Valore minimo dell'asse x
   *
   * @name Grafico#xMin
   * @type {number}
   * @default -20
   */
  this.xMin = options.assi[0].min;
  /**
   * Valore massimo dell'asse x
   *
   * @name Grafico#xMax
   * @type {number}
   * @default 20
   */
  this.xMax = options.assi[0].max;
  /**
   * Valore minimo dell'asse y
   *
   * @name Grafico#yMin
   * @type {number}
   * @default -20
   */
  this.yMin = options.assi[1].min;
  /**
   * Valore massimo dell'asse y
   *
   * @name Grafico#yMax
   * @type {number}
   * @default 20
   */
  this.yMax = options.assi[1].max;

  /**
   * Parametri passati nell'URL
   *
   * @name Grafico#_GET
   * @type {URLSearchParams}
   * @default 20
   */
  this._GET = new URLSearchParams(window.location.search);
  /**
   * Funzioni da disegnare nel grafico
   *
   * @name Grafico#funzioni
   * @type {Array.<string>}
   * @default []
   */
  this.funzioni = JSON.parse(this._GET.get("funzioni"));

  /**
   * punti da disegnare nel grafico
   *
   * @name Grafico#punti
   * @type {Array.<Punto>}
   * @default []
   */
  this.punti = this._GET.get("punti");

  if (this.punti) {
    // Se ci sono punti
    this.punti = JSON.parse(this.punti); // Parso l'array
  }

  let puntiGrafico = [];
  let funzioniGrafico = null;
  let assiGrafico = [];

  // Carico il grafico
  let mathbox = mathBox({
    plugins: ["core", "controls", "cursor", "mathbox", "fullscreen"],
    controls: { klass: THREE.OrbitControls },
  });
  if (mathbox.fallback) throw "WebGL not supported";

  let three = mathbox.three;
  three.renderer.setClearColor(new THREE.Color(0xffffff), 1.0);

  let camera = mathbox.camera({
    proxy: true,
    position: [0, 0, 3],
  });

  // Asse cartesione
  let view = mathbox.cartesian({
    //range: [[-2, 2], [-1, 1]],
    range: [
      [this.xMin, this.xMax],
      [this.yMin, this.yMax],
    ],
    scale: [3, 1.5],
  });

  // Carico la griglia
  let griglia = view.grid({
    width: 1,
    divideX: 40,
    divideY: 20,
    opacity: 0.25,
  });
  mathbox.set("focus", options.focus);

  // Carico gli assi
  let assii = [];

  options.assi.forEach((asse, i) => {
    assii.push(
      view.axis({
        axis: i + 1,
        width: 3,
        detail: asse.max * 2,
        color: options.colori.assi
      })
    );
  });

  const ySplit = "y=";
  const xSplit = "x=";

  let funcs = this.funzioni.map((func) => func.trim());

  // Funzioni che iniziano con x=
  const funzioniDaX = funcs
    .filter((f) => f.startsWith(xSplit))
    .map((f) => f.replace(xSplit, ""));
  // Funzioni che iniziano con y=
  const funzioniDaY = funcs
    .filter((f) => f.startsWith(ySplit))
    .map((f) => f.replace(ySplit, ""));

  const myEmit = (clb, x, y, func, debug = false) => {
    if (debug) {
      console.log(`emit POINT(${x};${y}) for ${func}`);
    }

    clb(x, y);
  };

  // Carico tutte le funzioni
  funzioniGrafico = view.interval({
    expr: function (emit, x, i, t) {
      // Per ogni funzione y=
      // Mi trovo i punti
      funzioniDaY.forEach((funzione) => {
        const y = math.parse(funzione).evaluate({ x });

        myEmit(emit, x, y, `y=${funzione}`);
      });

      // Per ogni funzione x=
      // Se la x e' uguale alla funzione
      funzioniDaX
        .filter(
          (funzione) =>
            parseFloat(funzione).toFixed(1) === parseFloat(x).toFixed(1)
        )
        .forEach((funzione) => {
          const max = options.assi[1].max * 2;

          for (
            let ordinata = options.assi[1].min * 2;
            ordinata <= max;
            ordinata++
          ) {
            const ascissa = parseFloat(funzione);

            myEmit(emit, ascissa, ordinata, `x=${funzione}`);
          }
        });
    },
    // Numero di x per cui trovare la y
    width: 64,
    // 2 = 2D, 3 = 3D, 4 = 4D
    channels: 2,
    items: funcs.length,
  });

  let curve = view.line({
    width: 4,
    color: options.colori.funzione,
  });

  let points = view.point({
    size: 5,
    color: options.colori.puntiFunzione,
  });

  let ticks = view.ticks({
    width: 5,
    size: 15,
    color: options.colori.testo,
  });

  /*let format =
        view.format({
            digits: 2,
            weight: 'bold',
        });

    let labels =
        view.label({
            color: options.colori.testo,
            zIndex: 1,
        });*/

  options.assi.forEach((asse, i) => {
    const nomi = ["x", "y"];
    const offset = [
      [25, 0],
      [0, 25],
    ];
    const offsetTicks = [
      [0, 40],
      [40, 0],
    ];
    const coordinate = [
      [this.xMax, 0],
      [0, this.yMax],
    ];

    const scala = view.scale({
      axis: i + 1,
      divide: asse.max / 2,
      nice: true,
      zero: i == 0,
    });
    const ticks = view.ticks({
      width: 5,
      size: 15,
      color: options.colori.testo,
      zBias: 2,
    });
    const ticksLabel = view.label({
      color: options.colori.testo,
      zIndex: 1,
      offset: offsetTicks[i],
      points: scala,
      text: view.format({
        digits: 2,
        font: options.font,
        weight: "bold",
        style: "normal",
        source: scala,
      }),
    });
    const label = view.label({
      text: view.text({
        width: 1,
        data: [nomi[i]],
        font: options.font,
        weight: "bold",
        style: "normal",
      }),
      points: view.array({
        width: 1,
        channels: 2,
        data: [coordinate[i]],
      }),
      size: 16,
      color: options.colori.testo,
      outline: 0,
      background: "transparent",
      offset: offset[i],
      zIndex: 1,
    });

    assiGrafico.push({
      asse: assii[i],
      scala: scala,
      ticks: ticks,
      ticksLabel: ticksLabel,
      label: label,
    });
  });

  if (this.punti) {
    // Se ci sono punti
    // Li aggiungo nel grafico
    this.punti.forEach((punto) => {
      puntiGrafico.push(
        view.label({
          text: view.text({
            width: 1,
            data: [punto.nome],
            font: options.font,
            weight: "bold",
            style: "normal",
          }),
          points: view.array({
            width: 1,
            channels: 2,
            data: [[punto.x, punto.y]],
          }),
          size: 30,
          color: punto.foreground ? punto.foreground : options.colori.punti, // Se questo punto ha un colore di testo uso quello
          outline: 1,
          background: punto.background ? punto.background : "transparent", // Se questo punto ha un colore di sfondo uso quello
          offset: [10, 10],
          zIndex: 1,
        })
      );
    });
  }

  // Animazione
  if (options.animazione.animazione) {
    // Se devo avere un'animazione
    mathbox.play({
      target: "cartesian",
      pace: 5,
      to: 2,
      loop: options.animazione.loop,
      script: [
        {
          props: {
            range: [
              [-2, 2],
              [-1, 1],
            ],
          },
        },
        {
          props: {
            range: [
              [-4, 4],
              [-2, 2],
            ],
          },
        },
        {
          props: {
            range: [
              [-2, 2],
              [-1, 1],
            ],
          },
        },
      ],
    });
  }
}

export { Grafico };

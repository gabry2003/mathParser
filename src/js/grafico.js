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
 * @property {string} punti='#4D4DFF' - Colore che devono avere i punti
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
    // Carico i valori di default
    options.font = options.font || 'Poppins';
    if (options.focus == undefined || options.focus == null) options.focus = 3;

    if (options.colori == undefined || options.colori == null) {
        options.colori = {
            assi: '#444444',
            punti: '#4D4DFF',
            funzione: '#484848',
            testo: '#444444'
        };
    } else {
        if (!options.colori) options.colori = '#444444';
        if (!options.punti) options.punti = '#4D4DFF';
        if (!options.funzione) options.funzione = '#484848';
        if (!options.testo) options.testo = '#444444';
    }

    if (options.animazione == undefined || options.animazione == null) {
        options.animazione = {
            animazione: false,
            loop: false
        };
    } else {
        if (options.animazione == null || options.loop == undefined) options.animazione = false;
        if (options.loop == null || options.loop == undefined) options.loop = false;
    }

    /**
     * Valore minimo dell'asse x
     * 
     * @name Grafico#xMin
     * @type {number}
     * @default -20
     */
    this.xMin = options.assi ? (options.assi[0].min || -20) : -20;
    /**
     * Valore massimo dell'asse x
     * 
     * @name Grafico#xMax
     * @type {number}
     * @default 20
     */
    this.xMax = options.assi ? (options.assi[0].max || 20) : 20;
    /**
     * Valore minimo dell'asse y
     * 
     * @name Grafico#yMin
     * @type {number}
     * @default -20
     */
    this.yMin = options.assi ? (options.assi[1].min || -20) : -20;
    /**
     * Valore massimo dell'asse y
     * 
     * @name Grafico#yMax
     * @type {number}
     * @default 20
     */
    this.yMax = options.assi ? (options.assi[1].max || 20) : 20;

    /**
     * Indice della lettera attualmente visualizzata, serve a prendere il nome dei punti
     * 
     * @name Grafico#indexLetteraAttuale
     * @type {number}
     * @default 0
     */
    this.indexLetteraAttuale = 0;
    /**
     * Ultima lettera utilizzata
     * 
     * @name Grafico#letteraAttuale
     * @type {string}
     * @default 20
     */
    this.letteraAttuale;

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
    this.funzioni = JSON.parse(_GET.get('funzioni'));

    // Trasformo le funzioni in espressioni
    /**
     * Esppressioni per calcolare cosa disegnare nel grafico
     * 
     * @name Grafico#espressioni
     * @type {Array.<string>}
     * @default []
     */
    this.espressioni = funzioni.map(funzione => funzione.trim().replace('y=', '').replace('x=', ''));

    /**
     * punti da disegnare nel grafico
     * 
     * @name Grafico#punti
     * @type {Array.<Punto>}
     * @default []
     */
    this.punti = _GET.get('punti');

    if (punti) { // Se ci sono punti
        punti = JSON.parse(punti); // Parso l'array
    }

    // console.log('espressioni', espressioni);
    // console.log('funzioni', funzioni);
    // console.log('punti', punti);

    // Carico il grafico
    let mathbox = mathBox({
        plugins: ['core', 'controls', 'cursor', 'mathbox'],
        controls: { klass: THREE.OrbitControls }
    });
    if (mathbox.fallback) throw 'WebGL not supported'

    let three = mathbox.three;
    three.renderer.setClearColor(new THREE.Color(0xFFFFFF), 1.0);

    let camera = mathbox.camera({
        proxy: true,
        position: [0, 0, 3],
    });

    // Asse cartesione
    let view = mathbox.cartesian({
        //range: [[-2, 2], [-1, 1]],
        range: [
            [xMin, xMax],
            [yMin, yMax]
        ],
        scale: [3, 1.5],
    });

    // Carico gli assi
    let asseX = view.axis({ axis: 1, width: 3, detail: 40, color: options.colori.assi });
    let asseY = view.axis({ axis: 2, width: 3, detail: 40, color: options.colori.assi });

    // Carico la griglia
    let griglia = view.grid({ width: 1, divideX: 40, divideY: 20, opacity: 0.25 });
    mathbox.set('focus', options.camera);

    // Carico tutte le funzioni
    this.espressioni.forEach(espressione => {
        const expression = math.parse(espressione); // Interpreto l'espressione

        // La carico nel grafico
        view.interval({
            expr: function(emit, x, i, t) {
                emit(x, expression.evaluate({ x: x }));
            },
            // Numero di x per cui trovare la y
            width: 64,
            // 2 = 2D, 3 = 3D
            channels: 2,
        });
    });

    let curve =
        view.line({
            width: 5,
            color: options.colori.funzione,
        });

    let points =
        view.point({
            size: 6,
            color: options.colori.punti,
        });

    let scale =
        view.scale({
            divide: 10,
        });

    let ticks =
        view.ticks({
            width: 5,
            size: 15,
            color: options.colori.testo,
        });

    let format =
        view.format({
            digits: 2,
            weight: 'bold',
        });

    let labels =
        view.label({
            color: options.colori.testo,
            zIndex: 1,
        });

    // Carico i label degli assi
    options.assi.forEach((asse, i) => {
        const nomi = ['x', 'y'];
        const offset = [
            [16, 0],
            [16, 0]
        ];
        const coordinate = [
            [xMax, 0],
            [0, yMax]
        ];

        view.label({
            text: view.text({ width: 1, data: nomi[i], font: options.font, weight: 'bold', style: 'normal' }),
            points: view.array({
                width: 1,
                channels: 2,
                data: [
                    coordinate[i]
                ]
            }),
            size: 16,
            color: options.colori.testo,
            outline: 1,
            background: options.colori.testo,
            offset: offset[i],
            zIndex: 1
        })
    });

    if (punti) { // Se ci sono punti
        // Li aggiungo nel grafico
        punti.forEach(punto => {
            // Prendo la lettera successiva per dare il nome al punto
            const nomePunto = letteraAttuale ? String.fromCharCode(letteraAttuale.charCodeAt(letteraAttuale.length - 1) + 1) : 'A';
            letteraAttuale = nomePunto;

            view.label({
                text: view.text({ width: 1, data: [nomePunto], font: options.font, weight: 'bold', style: 'normal' }),
                points: view.array({
                    width: 1,
                    channels: 2,
                    data: [
                        [punto.x, punto.y]
                    ]
                }),
                size: 18,
                color: options.colori.punti,
                outline: 1,
                background: options.colori.punti,
                offset: [0, 0],
                zIndex: 1
            });

            indexLetteraAttuale++;
        });
    }

    // Animazione
    if (options.animazione.animazione) { // Se devo avere un'animazione
        mathbox.play({
            target: 'cartesian',
            pace: 5,
            to: 2,
            loop: options.animazione.loop,
            script: [{
                    props: {
                        range: [
                            [-2, 2],
                            [-1, 1]
                        ]
                    }
                },
                {
                    props: {
                        range: [
                            [-4, 4],
                            [-2, 2]
                        ]
                    }
                },
                {
                    props: {
                        range: [
                            [-2, 2],
                            [-1, 1]
                        ]
                    }
                },
            ]
        });
    }
}

export { Grafico };
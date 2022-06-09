import { Punto } from './punto';

/**
 * Opzioni del grafico
 */
export interface GraficoOptions {
    /**
     * Colori che devono avere gli elementi nel grafico
     */
    colori?: {
        /**
         * Colore che devono avere gli assi
         */
        assi?: string;
        /**
         * Colore che devono avere i punti
         */
        punti?: string;
        /**
         * Colore che devono avere i punti trovati della funzione
         */
        puntiFunzione?: string;
        /**
         * Colore che deve avere la funzione
         */
        funzione?: string;
        /**
         * Colore che deve avere il testo
         */
        testo?: string;
    };
    /**
     * Opzioni dell'animazione
     */
    animazione?: {
        /**
         * Se utilizzare un'animazione;
         */
        animazione?: boolean;
        /**
         * Se l'animazione deve essere in loop
         */
        loop?: boolean;
    };
    /**
     *  Font utilizzato nel testo
     */
    font?: string;
    /**
     * Focus della fotocamera
     */
    focus?: number;
    /**
     * Impostazioni degli assi
     */
    assi?: {
        /**
         * Valore minimo dell'asse
         */
        min?: number;
        /**
         * Valore massimo dell'asse
         */
         max?: number;
    }[];
}

export interface IGrafico {
    /**
     * Opzioni per la visualizzazione del grafico
     */
    options?: GraficoOptions;
        /**
     * Valore minimo dell'asse x
     */
         xMin: number;
         /**
          * Valore massimo dell'asse x
          */
         xMax: number;
         /**
          * Valore minimo dell'asse y
          */
         yMin: number;
         /**
          * Valore massimo dell'asse x
          */
         yMax: number;
     
         /**
          * Indice della lettera attualmente visualizzata, serve a prendere il nome dei punti
          */
         indexLetteraAttuale: number;
         /**
          * Ultima lettera utilizzata
          */
         letteraAttuale: string;
     
         /**
          * Parametri passati nell'URL
          */
         _GET: URLSearchParams;
         /**
          * Funzioni da disegnare nel grafico
          */
         funzioni: string[];
         /**
          * Punti da disegnare nel grafico
          */
         punti: Punto[];
}

/**
 * Questa classe serve a gestire la visualizzazione del grafico
 */
export class Grafico implements IGrafico {
    options: GraficoOptions;
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    indexLetteraAttuale: number;
    letteraAttuale: string;
    _GET: URLSearchParams;
    funzioni: string[];
    punti: Punto[];

    constructor(options?: GraficoOptions) {
        if (options == null || options == undefined) options = {};

        // Carico i valori di default
        options.font = options.font || 'Poppins';
        if (options.focus == undefined || options.focus == null) options.focus = 3;
    
        if (options.colori == undefined || options.colori == null) {
            options.colori = {
                assi: '#444444',
                punti: '#f400a1',
                puntiFunzione: '#4D4DFF',
                funzione: '#484848',
                testo: '#444444'
            };
        } else {
            if (!options.colori.assi) options.colori.assi = '#444444';
            if (!options.colori.punti) options.colori.punti = '#DD4B44';
            if (!options.colori.puntiFunzione) options.colori.puntiFunzione = '#4D4DFF';
            if (!options.colori.funzione) options.colori.funzione = '#484848';
            if (!options.colori.testo) options.colori.testo = '#444444';
        }
    
        if (options.assi == undefined || options.assi == null) {
            options.assi = [{
                    min: -20,
                    max: 20
                },
                {
                    min: -20,
                    max: 20
                }
            ];
        } else {
            for (let i = 0; i < options.assi.length; i++) {
                if (options.assi[i] == undefined || options.assi[i] == null) {
                    options.assi[i] = {
                        min: -20,
                        max: 20
                    };
                } else {
                    if (options.assi[i].min == undefined || options.assi[i].min == null) options.assi[i].min = -20;
                    if (options.assi[i].max == undefined || options.assi[i].max == null) options.assi[i].max = 20;
                }
            }
        }
    
        if (options.animazione == undefined || options.animazione == null) {
            options.animazione = {
                animazione: false,
                loop: false
            };
        } else {
            if (options.animazione?.animazione == null || options.animazione?.animazione == undefined) options.animazione.animazione = false;
            if (options.animazione?.loop == null || options.animazione?.loop == undefined) options.animazione.loop = false;
        }

        this.options = options;

        this.xMin = options.assi[0].min;
        this.xMax = options.assi[0].max;
        this.yMin = options.assi[1].min;
        this.yMax = options.assi[1].max;
        this.indexLetteraAttuale = 0;
        this.letteraAttuale;
        this._GET = new URLSearchParams(window.location.search);
        this.funzioni = JSON.parse(this._GET.get('funzioni'));
        const puntiParam = this._GET.get('punti');
    
        if (puntiParam) { // Se ci sono punti
            this.punti = JSON.parse(puntiParam); // Parso l'array
        }
    }

    /**
     * Metodo che carica il grafico
     */
    load(): void {
        let puntiGrafico = [];
        let funzioniGrafico = null;
        let assiGrafico = [];
    
        // Carico il grafico
        let mathbox = mathBox({
            plugins: ['core', 'controls', 'cursor', 'mathbox', 'fullscreen'],
            controls: { klass: THREE.OrbitControls }
        });
        if (mathbox.fallback) throw 'WebGL not supported';
    
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
                [this.xMin, this.xMax],
                [this.yMin, this.yMax]
            ],
            scale: [3, 1.5],
        });
    
        // Carico la griglia
        let griglia = view.grid({ width: 1, divideX: 40, divideY: 20, opacity: 0.25 });
        mathbox.set('focus', this.options.focus);
    
        // Carico gli assi
        let assii = [];
    
        this.options.assi.forEach((asse, i) => {
            assii.push(view.axis({
                axis: (i + 1),
                width: 3,
                detail: asse.max * 2,
                color: this.options.colori.assi
            }));
        });
    
        // Carico tutte le funzioni
        console.log('funzioni', this.funzioni);
        let funcs = this.funzioni;
    
        funzioniGrafico = view.interval({
            expr: function(emit, x, i, t) {
                funcs.forEach(funzione => {
                    const y = math.parse(funzione.trim().replace('y=', '').replace('x=', '')).evaluate({
                        x: x
                    });
    
                    emit(x, y);
                });
            },
            // Numero di x per cui trovare la y
            width: 64,
            // 2 = 2D, 3 = 3D
            channels: 2,
            items: funcs.length
        });
    
        let curve =
            view.line({
                width: 4,
                color: this.options.colori.funzione,
            });
    
        let points =
            view.point({
                size: 5,
                color: this.options.colori.puntiFunzione,
            });
    
        let ticks =
            view.ticks({
                width: 5,
                size: 15,
                color: this.options.colori.testo,
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
    
        this.options.assi.forEach((asse, i) => {
            const nomi = ['x', 'y'];
            const offset = [
                [25, 0],
                [0, 25]
            ];
            const offsetTicks = [
                [0, 40],
                [40, 0]
            ];
            const coordinate = [
                [this.xMax, 0],
                [0, this.yMax]
            ];
    
            const scala = view.scale({
                axis: (i + 1),
                divide: asse.max / 2,
                nice: true,
                zero: i == 0
            });
            const ticks = view.ticks({
                width: 5,
                size: 15,
                color: this.options.colori.testo,
                zBias: 2
            });
            const ticksLabel = view.label({
                color: this.options.colori.testo,
                zIndex: 1,
                offset: offsetTicks[i],
                points: scala,
                text: view.format({
                    digits: 2,
                    font: this.options.font,
                    weight: 'bold',
                    style: 'normal',
                    source: scala,
                })
            });
            const label = view.label({
                text: view.text({
                    width: 1,
                    data: [nomi[i]],
                    font: this.options.font,
                    weight: 'bold',
                    style: 'normal'
                }),
                points: view.array({
                    width: 1,
                    channels: 2,
                    data: [
                        coordinate[i]
                    ]
                }),
                size: 16,
                color: this.options.colori.testo,
                outline: 0,
                background: 'transparent',
                offset: offset[i],
                zIndex: 1
            });
    
            assiGrafico.push({
                asse: assii[i],
                scala: scala,
                ticks: ticks,
                ticksLabel: ticksLabel,
                label: label
            });
        });
    
        console.log('assiGrafico', assiGrafico);
    
        if (this.punti) { // Se ci sono punti
            // Li aggiungo nel grafico
            this.punti.forEach(punto => {
                // Prendo la lettera successiva per dare il nome al punto
                const nomePunto = this.letteraAttuale ? String.fromCharCode(this.letteraAttuale.charCodeAt(this.letteraAttuale.length - 1) + 1) : 'A';
                this.letteraAttuale = nomePunto;
    
                console.log(`${nomePunto}(${punto.x}; ${punto.y})`);
    
                puntiGrafico.push(view.label({
                    text: view.text({ width: 1, data: [nomePunto], font: this.options.font, weight: 'bold', style: 'normal' }),
                    points: view.array({
                        width: 1,
                        channels: 2,
                        data: [
                            [punto.x, punto.y]
                        ]
                    }),
                    size: 30,
                    color: punto.foreground ? punto.foreground : this.options.colori.punti, // Se questo punto ha un colore di testo uso quello
                    outline: 1,
                    background: punto.background ? punto.background : 'transparent', // Se questo punto ha un colore di sfondo uso quello
                    offset: [10, 10],
                    zIndex: 1
                }));
    
                this.indexLetteraAttuale++;
            });
        }
    
        // Animazione
        if (this.options.animazione.animazione) { // Se devo avere un'animazione
            mathbox.play({
                target: 'cartesian',
                pace: 5,
                to: 2,
                loop: this.options.animazione.loop,
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
}
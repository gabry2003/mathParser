import { ParteLetterale } from './parte-letterale';
import { Termine } from './termine';
window.Termine = Termine;

/**
 * Opzioni per l'inizializzazione di un oggetto di tipo Funzione
 * 
 * @typedef {Object} FunzioneOptions
 * @property {Array.<Membro>} membri - membri di cui è composta la funzione
 * @author Gabriele Princiotta <gabriprinciott@gmail.com>
 * @version 1.0
 */

/**
 * Membro di una funzione
 * 
 * @typedef {Object} Membro
 * @property {Array.<Termine>} numeratore - Numeratore del membro
 * @property {Array.<Termine>} denominatore - Numeratore del membro (nel caso in cui non ci sia una funzione fratta è 1)
 * @author Gabriele Princiotta <gabriprinciott@gmail.com>
 * @version 1.0
 */

/**
 * Questa classe serve a definire le funzioni interpretate a partire da una stringa.
 * Si trova quindi i membri di ogni equazione e tutti i termini che ne fanno parte.
 * Aggiunge inoltre dei metodi molto utili per lavorare con le funzioni matematiche, come ad esempio l'ordinazione e la ricerca del termine noto.
 * Al posto di una funzione si può interpretare un'equazione allo stesso modo
 * 
 * @class Funzione
 * @classdesc Funzione matematica
 * @param {FunzioneOptions|string} options Opzioni per inizializzare una funzione
 * @author Gabriele Princiotta <gabriprinciott@gmail.com>
 * @version 1.0
 */
function Funzione(options) {
    /**
     * Membri di cui è composta la funzione.
     * Ogni membro è composto da numeratore e denominatore, a loro volta composti da termini
     * 
     * @name Funzione#membri
     * @type {Array.<Membro>}
     * @default []
     */
    this.membri = [];

    switch (typeof(options)) { // In base al tipo di dato delle opzioni che sono state passate
        case 'FunzioneOptions': // Se ha passato un oggetto di tipo FunzioneOptions
            // Prendo le opzioni
            this.membri = options.membri;
            break;
        case 'string': // Se ha passato una stringa
            // Intrepreto la stringa e mi prendo i dati necessari
            Funzione.interpreta(options, this);
            break;
        default:
            throw 'Per favore passa un oggetto di tipo FunzioneOptions oppure una stringa!';
    }

    /**
     * Metodo che ritorna il termine noto della funzione.
     * Va a cercare tra tutti i termini quello che non ha una parte letterale così da poter tornare poi il coefficiente.
     * 
     * @method
     * @name Funzione#termineNoto
     * @returns {number} Termine noto
     */
    this.termineNoto = function() {
        let termine = 0;
        for (let i = 0; i < this.membri[1].numeratore.length; i++) {
            if (this.membri[1].numeratore[i].parteLetterale == null) return this.membri[1].numeratore[i].coefficiente;
        }
        return termine;
    }

    /**
     * Metodo che ritorna il grado della funzione
     * 
     * @method
     * @name Funzione#grado
     * @return {number} Grado della funzione
     */
    this.grado = function() {
        // Cerco tra tutti i termini quello con il grado maggiore
        let elencoTermini = [];
        this.membri.forEach(membro => {
            membro.numeratore.forEach(termine => {
                elencoTermini.push(termine);
            });

            membro.denominatore.forEach(termine => {
                elencoTermini.push(termine);
            })
        })

        return Math.max(...elencoTermini.map(termine => {
            if (termine.parteLetterale) {
                return termine.parteLetterale.esponente;
            } else {
                return 0;
            }
        }));
    }

    /**
     * Metodo che ritorna il termine con un determinato esponente nella parte letterale
     * 
     * @method
     * @name Funzione#getByExp
     * @param {number} exp Esponente che deve avere il termine nella parte letterale
     * @return {Termine} Termine con quell'esponente
     */
    this.getByExp = function(exp, membro = 1) {
        let elencoTermini = [];
        membro = this.membri[membro];
        membro.numeratore.forEach(termine => {
            elencoTermini.push(termine);
        });

        membro.denominatore ? membro.denominatore.forEach(termine => {
            elencoTermini.push(termine);
        }) : null;

        let result = elencoTermini.filter(termine => {
            if (termine.parteLetterale) {
                return termine.parteLetterale.esponente == exp;
            }
        });
        if (result.length == 1) return result[0];
        return result;
    }

    /**
     * Metodo che ordina l'array di termini in modo decrescente in base all'esponente della parte letterale
     * Non ritorna nulla perché modifica direttamente l'oggetto
     * 
     * @method
     * @name Funzione#ordina
     */
    this.ordina = function() {
        // Ordino l'array dei termini in modo decrescente in base all'esponente della parte letterale
        // Devo ordinare quindi i termini del numeratore e del denominatore di ogni membro
        this.membri.forEach(membro => {
            membro.numeratore.sort((a, b) => (b.parteLetterale ? b.parteLetterale.esponente : 0) - (a.parteLetterale ? a.parteLetterale.esponente : 0));
            membro.denominatore ? membro.denominatore.sort((a, b) => (b.parteLetterale ? b.parteLetterale.esponente : 0) - (a.parteLetterale ? a.parteLetterale.esponente : 0)) : null;
        });
    }

    /**
     * Metodo che completa la funzione aggiungendo gli esponenti mancanti in modo tale che ci sia un termine per ogni esponente a partire dal grado della funzione
     * Es: x^3+0x^2+x
     * 
     * @method
     * @name Funzione#completa
     */
    this.completa = function() {
        const gradoFunzione = this.grado(); // Prendo il grado
        const complete = (parteFrazione) => {
            for (let i = gradoFunzione; i > 0; i--) { // Parto dal grado fino ad esponente 1
                // Se non c'è un termine con questo esponente
                if (parteFrazione.filter(termine => {
                        if (termine.parteLetterale) {
                            return termine.parteLetterale.esponente == i;
                        }
                    }).length == 0) {
                    // Lo aggiungo
                    parteFrazione.push(new Termine({
                        coefficiente: 0,
                        parteLetterale: new ParteLetterale({
                            lettera: 'x',
                            esponente: i
                        })
                    }));
                }
            }
            // Se manca il coefficiente
            if (parteFrazione.length < (gradoFunzione + 1)) {
                // Lo aggiungo
                parteFrazione.push(new Termine({
                    coefficiente: 0,
                    parteLetterale: new ParteLetterale({
                        lettera: 'x',
                        esponente: 0
                    })
                }));
            }
        };

        // Completo tutti i membri
        this.membri.forEach(membro => {
            // E per ogni membro completo sia il numeratore che il denominatore
            complete(membro.numeratore);
            complete(membro.denominatore);
        });

        // Ordino la funzione
        this.ordina();
    }

    /**
     * Metodo che ritorna il coefficiente angolare di una retta.
     * Se la funzione non è una retta ritorna null
     * 
     * @method
     * @name Funzione#coefficienteAngolare
     */
    this.coefficienteAngolare = function() {
        if (this.grado() !== 1) { // Se non è una retta
            return null;
        }

        // Prendo il coefficiente del termine di grado 1
        const coefficiente = this.getByExp(1).coefficiente;
        let radianti = Math.atan(coefficiente);
        let gradi = radianti * 180 / Math.PI;

        return {
            numero: coefficiente,
            gradi: gradi,
            radianti: radianti,
            angoloAcuto: coefficiente > 0,
            angoloRetto: coefficiente == 0,
            angoloOttuso: coefficiente < 0
        }
    }

    /**
     * Metodo che trova il dominio della funzione
     * 
     * @method
     * @name Funzione#dominio
     */
    this.dominio = function() {

    }

    /**
     * Metodo che trova la tipologia della funzione
     * 
     * @method
     * @name Funzione#tipologia
     */
    this.tipologia = function() {

    }

    /**
     * Metodo che semplifica la funzione
     * 
     * @method
     * @name Funzione#semplifica
     */
    this.semplifica = function() {
        const semplificaParteFrazione = (parte) => {
            // Se ci sono termini che hanno la stessa esatta parte letterale sommo i coefficienti e trovo un nuovo termine
            let terminiDaTogliere = [];
            let valori = {};

            // Prendo tutti i termini
            for (let i = 0; i < parte.length; i++) {
                const parteLetteraleString = parte[i].parteLetterale ? parte[i].parteLetterale.toString() : ''; // parte letterale come stringa
                // Se ho già memorizzato un valore per questa parte letterale, parto da quel valore + il coefficiente, altrimenti parto dal coefficiente
                let valore = valori[parteLetteraleString] ? (valori[parteLetteraleString] + parte[i].coefficiente) : parte[i].coefficiente;

                // Per ogni termine prendo il termine successivo
                for (let j = i; j < parte.length; j++) {
                    const parteLetteraleString2 = parte[j].parteLetterale ? parte[j].parteLetterale.toString() : '';
                    if (parteLetteraleString == parteLetteraleString2) { // Se i due termini hanno la stessa parte letterale
                        // Sommo il coefficiente
                        valore += parte[j].coefficiente;
                        terminiDaTogliere.push(parteLetteraleString);
                        terminiDaTogliere.push(parteLetteraleString2);
                    }
                }

                // memorizzo il valore
                valori[parteLetteraleString] = valore;
            }

            // Aggiungo i termini nuovi
            for (let key in Object.keys(valori)) {
                parte.push(new Termine({
                    coefficiente: valori[key],
                    parteLetterale: new ParteLetterale(key)
                }))
            }

            // Elimino tutti i termini che hanno coefficiente zero e quelli nella lista da tgogliere
            parte = parte.filter(termine => !terminiDaTogliere.includes(termine.toString() && termine.coefficiente !== 0));
        };

        // Per ogni membro
        this.membri.forEach(membro => {
            // Semplifico il numeratore e il denominatore
            semplificaParteFrazione(membro.numeratore);
            semplificaParteFrazione(membro.denominatore);
        });
    }

    /**
     * Metodo che dice se la funzione è in forma esplicita
     * 
     * @method
     * @name Funzione#isFormaEsplicita
     */
    this.isFormaEsplicita = function() {
        // La funzione è in forma esplicita quando a primo membro è presente solo la y di grado 1 e nessun altro termine
        return this.membri[0].numeratore.length == 1 &&
            this.membri[0].numeratore[0].parteLetterale.lettera == 'y' &&
            this.membri[0].numeratore[0].parteLetterale.esponente == 1;
    }

    /**
     * Metodo che dice se la funzione è in forma implicita
     * 
     * @method
     * @name Funzione#isFormaImplicita
     */
    this.isFormaImplicita = function() {
        // Fondamentalmente una funzione è in forma implicita se non è in forma esplicita
        return !this.isFormaEsplicita();
    }

    /**
     * Metodo che trasforma la funzione in forma esplicita, utilizzato nelle rette
     * 
     * @method
     * @name Funzione#formaEsplicita
     */
    this.formaEsplicita = function() {
        if (!this.isFormaEsplicita()) { // Se la funzione è già in forma esplicita non faccio nulla
            // Per portare la funzione in forma esplicita sposto tutti i termini del primo membro al secondo membro tranne la y
            this.membri[0].numeratore.forEach(termine => {
                if (termine.parteLetterale.lettera == 'y' && termine.parteLetterale.esponente == 1) return;

                this.membri[1].numeratore.push(new Termine({
                    coefficiente: -termine.coefficiente,
                    parteLetterale: termine.parteLetterale
                }));
            });

            // Elimino tutto tranne la y al primo membro
            this.membri[0].numeratore = this.membri[0].numeratore.filter(termine => termine.parteLetterale.lettera == 'y' && termine.parteLetterale.esponente == 1);

            this.ordina(); // Ordino la funzione
        }
    }

    /**
     * Metodo che trasforma la funzione in forma implicita
     * 
     * @method
     * @name Funzione#formaImplicita
     */
    this.formaImplicita = function() {
        if (!this.isFormaImplicita()) { // Se la funzione è giä in forma implicita non faccio nulla
            // Per portare la funzione in forma implicita sposto tutti i termini del secondo membro al primo e nel secondo lascio lo zero
            this.membri[1].numeratore.forEach(termine => {
                this.membri[0].numeratore.push(new Termine({
                    coefficiente: -termine.coefficiente,
                    parteLetterale: termine.parteLetterale
                }));
            });

            this.membri[1].numeratore = [
                new Termine({
                    coefficiente: 0,
                    parteLetterale: null
                })
            ];

            this.ordina(); // Ordino la funzione
        }
    }

    /**
     * Metodo che ritorna la funzione come stringa.
     * Molto utile nel caso in cui la funzione sia stata modificata da uno dei metodi per poterla stampare a schermo con le modifiche
     * 
     * @method
     * @name Funzione#toString
     * @returns {string} Funzione scritta sotto forma di stringa
     */
    this.toString = function() {
        /**
         * Funzione che stampa a schermo un membro
         * 
         * @param {*} membro 
         */
        const membroString = (membro) => {
            /**
             * Funzione che stampa a schermo una parte della frazione
             * 
             * @param {*} frazione 
             */
            const terminiString = (termini) => {
                let string = ``;
                termini.forEach(termine => {
                    string += termine.toString();
                });

                // Se il primo carattere è un +  lo rimuovo
                if (string[0] == '+') string = string.substring(1);
                return string;
            };

            let string = ``;

            // Se il denominatore è presente
            if (membro.denominatore ? membro.denominatore.length > 0 : false) {
                // Stampo a schermo il numeratore e il denominatore
                string += `\\frac {${terminiString(membro.numeratore)}} {${terminiString(membro.denominatore)}}`;
            } else { // Altrimenti
                string += terminiString(membro.numeratore);
            }

            return string;
        };

        return `${membroString(this.membri[0])}=${membroString(this.membri[1])}`;
    }
}

/**
 * Interpreta una funzione scritta come stringa.
 * Serve nel caso in cui si passi una stringa al costruttore e si voglia fare il passaggio di interpretazione in automatico
 * 
 * @param {string} funzione Funzione da intepretare
 * @param {Funzione} [obj] Oggetto da modificare
 * @name Funzione#interpreta
 * @static
 * @returns {Funzione} Funzione interpretata
 */
Funzione.interpreta = function(funzione, obj) {
    funzione = funzione.trim(); // Levo tutti gli spazi dalla funzione
    let membri = funzione.split('='); // Prendo i membri separando dall'uguale
    // Intepretro ogni membro
    const interpretaMembro = function(membro) {
        let numeratore;
        let denominatore;
        let partiStringa;

        const interpretaEspressione = (espressione) => {
            // Splitto per il + o per il - l'espressione in più termini (es. termine con la x^2 ecc...)
            partiStringa = MathSolver.splittaEspressione(espressione, ['+', '-']);

            return partiStringa.map(string => Termine.interpreta(string));
        };

        // Se il membro contiene una frazione
        if (membro.includes('frac')) {
            const getWordsBetweenCurlies = (str) => {
                var results = [],
                    re = /{([^}]+)}/g,
                    text;

                while (text = re.exec(str)) {
                    results.push(text[1]);
                }
                return results;
            };
            let membriFrazione = getWordsBetweenCurlies(membro);
            numeratore = interpretaEspressione(membriFrazione[0]);
            denominatore = interpretaEspressione(membriFrazione[1]);
        } else { // Altrimenti
            // Adesso divido ogni termine in parte letterale e numerica
            numeratore = interpretaEspressione(membro);
            denominatore = null;
        }

        return {
            numeratore: numeratore,
            denominatore: denominatore
        };
    };

    membri = membri.map(membro => interpretaMembro(membro));

    if (obj) { // Se devo modificare un oggetto
        obj.membri = membri;

        return obj;
    } else { // Altrimenti
        return new Funzione({
            membri: membri
        });
    }
}

export { Funzione };
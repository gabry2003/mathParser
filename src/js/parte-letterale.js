/**
 * Opzioni per l'inizializzazione di un oggetto di tipo ParteLetterale
 * 
 * @typedef {Object} ParteLetteraleOptions
 * @property {string} lettera - Lettera della parte letterale
 * @property {number} esponente - Esponente della parte letterale
 * @author Gabriele Princiotta <gabriprinciott@gmail.com>
 * @version 1.0
 */

/**
 * Questa classe serve a definire la parte letterale intpretata da un'espressione, letta come stringa
 * 
 * @class ParteLetterale
 * @classdesc ParteLetterale di un termine
 * @param {ParteLetteraleOptions|string} options Opzioni per inizializzare la parte letterale
 * @author Gabriele Princiotta <gabriprinciott@gmail.com>
 * @version 1.0
 */
function ParteLetterale(options) {
    /**
     * Letterale della parte letterale
     * 
     * @name ParteLetterale#lettera
     * @type {string}
     * @default 0
     */
    this.lettera = null;
    /**
     * Esponente della parte letterale
     * 
     * @name ParteLetterale#esponente
     * @type {number}
     * @default {}
     */
    this.esponente = 0;

    switch (typeof(options)) { // In base al tipo di dato delle opzioni che sono state passate
        case 'string': // Se ha passato una stringa
            // Intrepreto la stringa e mi prendo i dati necessari
            ParteLetterale.interpreta(options, this);
            break;
        default: // Se ha passato un oggetto di tipo ParteLetteraleOptions
            // Prendo le opzioni
            this.lettera = options.lettera;
            this.esponente = options.esponente;
    }

    /**
     * Metodo che ritorna la parte letterale come stringa.
     * Molto utile nel caso in cui la parte letterale sia stata modificata da uno dei metodi per poterlo stampare a schermo con le modifiche
     * 
     * @method
     * @name ParteLetterale#toString
     * @returns {string} Parte letterale scritta sotto forma di stringa
     */
    this.toString = function() {
        if (this.esponente !== 0) {
            if (this.esponente !== 1) {
                return `${this.lettera}^${this.esponente}`;
            } else {
                return `${this.lettera}`;
            }
        } else {
            return this.lettera;
        }
    }
}

/**
 * Interpreta la parte letterale scritta come stringa.
 * Serve nel caso in cui si passi una stringa al costruttore e si voglia fare il passaggio di interpretazione in automatico
 * 
 * @param {string} parteLetterale Parte letterale da intepretare
 * @param {ParteLetterale} [obj] Oggetto da modificare
 * @name ParteLetterale#interpreta
 * @static
 * @returns {ParteLetterale} Parte letterale interpretata
 */
ParteLetterale.interpreta = function(parteLetterale, obj) {
    // Se non c'è nessuna parte letterale
    if (parteLetterale == null) {
        if (obj) { // Se devo modificare un oggetto
            obj = null;
        }

        return null;
    }

    let split = parteLetterale.split('^');
    let esponente = 1;
    let lettera = split[0];

    if (split.length > 1) {
        esponente = parseFloat(split[1]);
    }

    if (obj) { // Se devo modificare un oggetto
        obj.lettera = lettera;
        obj.esponente = esponente;

        return obj;
    } else { // Altrimenti
        return new ParteLetterale({
            lettera: lettera,
            esponente: esponente
        });;
    }
}

export { ParteLetterale };
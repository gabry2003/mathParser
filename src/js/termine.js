import { ParteLetterale } from './parte-letterale';
window.ParteLetterale = ParteLetterale;

/**
 * Opzioni per l'inizializzazione di un oggetto di tipo Termine
 * 
 * @typedef {Object} TermineOptions
 * @property {number} coefficiente - Coefficiente del termine
 * @property {ParteLetterale} parteLetterale - Parte letterale del termine
 * @author Gabriele Princiotta <gabriprinciott@gmail.com>
 * @version 1.0
 */

/**
 * Questa classe serve a definire i termini interpretati da un'espressione, letta come stringa
 * 
 * @class Termine
 * @classdesc Termine di un'espressione
 * @param {TermineOptions|string} options Opzioni per inizializzare un termine
 * @author Gabriele Princiotta <gabriprinciott@gmail.com>
 * @version 1.0
 */
function Termine(options) {
    /**
     * Coefficiente del termine (il numero scritto accanto alla parte letterale)
     * 
     * @name Termine#coefficiente
     * @type {number}
     * @default 0
     */
    this.coefficiente = 0;
    /**
     * Parte letterale del termine, è divisa a sua volta in lettera ed esponente
     * 
     * @name Termine#parteLetterale
     * @type {ParteLetterale}
     * @default {}
     */
    this.parteLetterale = {};

    switch (typeof(options)) { // In base al tipo di dato delle opzioni che sono state passate
        case 'string': // Se ha passato una stringa
            // Intrepreto la stringa e mi prendo i dati necessari
            Termine.interpreta(options, this);
            break;
        default:    // Se ha passato un oggetto di tipo TermineOptions
            // Prendo le opzioni
            this.coefficiente = options.coefficiente;
            this.parteLetterale = options.parteLetterale;
    }

    /**
     * Metodo che ritorna il termine come stringa.
     * Molto utile nel caso in cui il termine sia stata modificato da uno dei metodi per poterlo stampare a schermo con le modifiche
     * 
     * @method
     * @returns {string} Termine scritto sotto forma di stringa
     */
    this.toString = function() {
        let string;

        if (this.coefficiente == 1) {
            string = `+${this.parteLetterale.toString()}`;
        } else if (this.coefficiente == -1) {
            string = `-${this.parteLetterale.toString()}`;
        } else {
            string = MathSolver.numeroRazionale(this.coefficiente) + this.parteLetterale.toString()
        }

        return string;
    }
}

/**
 * Interpreta un termine scritta come stringa.
 * Serve nel caso in cui si passi una stringa al costruttore e si voglia fare il passaggio di interpretazione in automatico
 * 
 * @param {string} termine Termine da intepretare
 * @param {Termine} [obj] Oggetto da modificare
 * @name Termine#interpreta
 * @static
 * @returns {Termine} Termine interpretato
 */
Termine.interpreta = function(termine, obj) {
    console.log('termine', termine);
    console.log('obj', obj);

    let coefficiente = '';
    let parteLetterale = '';
    let prendiCoefficiente = true;

    for (let i = 0; i < termine.length; i++) { // Leggo tutti i caratteri del termine
        // Se è una lettera
        if (termine[i].isAlpha()) {
            prendiCoefficiente = false; // Smettiamo di prendere il coefficiente
        }

        if (prendiCoefficiente) { // Se posso prendere il coefficiente
            coefficiente += termine[i];
        } else { // Altrimenti
            parteLetterale += termine[i];
        }
    }

    switch (coefficiente) { // In base al valore del coefficiente
        case '+':
        case '':
            // Se non c'è o è un + vale 1
            coefficiente = 1;
            break;
        case '-':
            // Se è un meno vale -1
            coefficiente = -1;
            break;
        default:
            // Altrimenti lo intrepreto come float
            coefficiente = parseFloat(coefficiente);
    }

    if (parteLetterale == '') parteLetterale = null;
    parteLetterale = ParteLetterale.interpreta(parteLetterale);

    if (obj) { // Se devo modificare un oggetto
        obj.coefficiente = coefficiente;
        obj.parteLetterale = parteLetterale;

        return obj;
    } else { // Altrimenti
        return new Termine({
            coefficiente: coefficiente,
            parteLetterale: parteLetterale
        });;
    }
}

export { Termine };
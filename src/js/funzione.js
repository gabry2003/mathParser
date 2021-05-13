import { Termine } from './termine';
window.Termine = Termine;

/**
 * Opzioni per l'inizializzazione di un oggetto di tipo Funzione
 * 
 * @typedef {Object} FunzioneOptions
 * @property {Array.<Termine>} termini - Termini di cui è composta la funzione
 * @property {Array.<string>} membri - membri di cui è composta la funzione
 * @property {string} parteFissa - parte della funzione che non viene modificata
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
     * Termini di cui è composta la funzione
     * 
     * @name Funzione#termini
     * @type {Array.<Termine>}
     * @default []
     */
    this.termini = [];
    /**
     * Membri di cui è composta la funzione.
     * Di solito viene utilizzato nel caso in cui sia un equazione perché nel caso di una funzione si sa già qual è il primo membro.
     * 
     * @name Funzione#membri
     * @type {Array.<string>}
     * @default []
     */
    this.membri = [];
    /**
     * Parte fissa della funzione o dell'equazione, ovvero quella parte che non viene modificata.
     * Es. y=2x^2+2
     * La parte fissa è y
     * 
     * x=33
     * La parte fissa è x
     * 
     * Serve per poter stampare la funzione sotto forma di stringa salvandosi la parte che non viene mai modificata.
     * 
     * @name Funzione#parteFissa
     * @type {string}
     * @default y
     * @example
     * let funzione = new Funzione('y=2x^2+2');
     * // Completo la funzione
     * funzione.completa();
     * // Stampo la funzione come stringa
     * console.log(funzione.toString());
     * // y=2x^2+0x+2
     */
    this.parteFissa = 'y';

    switch (typeof(options)) { // In base al tipo di dato delle opzioni che sono state passate
        case 'FunzioneOptions': // Se ha passato un oggetto di tipo FunzioneOptions
            // Prendo le opzioni
            this.termini = options.termini;
            this.membri = options.membri;
            this.parteFissa = options.parteFissa;
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
        for (let i = 0; i < this.termini.length; i++) {
            if (this.termini[i].parteLetterale == null) return this.termini[i].coefficiente;
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
        return Math.max(...this.termini.map(termine => {
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
    this.getByExp = function(exp) {
        return this.termini.filter(termine => {
            if (termine.parteLetterale) {
                return termine.parteLetterale.esponente == exp;
            }
        })[0];
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
        this.termini.sort((a, b) => (b.parteLetterale ? b.parteLetterale.esponente : 0) - (a.parteLetterale ? a.parteLetterale.esponente : 0));
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
        for (let i = gradoFunzione; i > 0; i--) { // Parto dal grado fino ad esponente 1
            // Se non c'è un termine con questo esponente
            if (this.termini.filter(termine => {
                    if (termine.parteLetterale) {
                        return termine.parteLetterale.esponente == i;
                    }
                }).length == 0) {
                // Lo aggiungo
                this.termini.push(new Termine({
                    coefficiente: 0,
                    parteLetterale: new ParteLetterale({
                        lettera: 'x',
                        esponente: i
                    })
                }));
            }
        }
        // Se manca il coefficiente
        if (this.termini.length < (gradoFunzione + 1)) {
            // Lo aggiungo
            this.termini.push(new Termine({
                coefficiente: 0,
                parteLetterale: new ParteLetterale({
                    lettera: 'x',
                    esponente: 0
                })
            }));
        }
        // Ordino la funzione
        this.ordina();
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
        let string;
        this.termini.forEach(termine => {
            string += termine.toString()
        });
        // Se il primo carattere è un +  lo rimuovo
        if (string[0] == '+') string = string.substring(1);

        return string;
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
    const membri = funzione.split('='); // Prendo i membri separando dall'uguale
    const parteFissa = funzione.includes('x=') ? 'x' : 'y'; // Prendo la parte fissa della funzione

    funzione = funzione.trim(); // Levo tutti gli spazi
    funzione = funzione.replace('x=', '').replace('y=', ''); // Lascio solo l'equazione
    // Splitto per il + o per il - l'espressione in più termini (es. termine con la x^2 ecc...)
    let partiStringa = MathSolver.splittaEspressione(funzione, ['+', '-']);
    // Adesso divido ogni termine in parte letterale e numerica
    const termini = partiStringa.map(Termine.interpreta);

    if (obj) { // Se devo modificare un oggetto
        obj.membri = membri;
        obj.parteFissa = parteFissa;
        obj.termini = termini;

        return obj;
    } else { // Altrimenti
        return new Funzione({
            membri: membri,
            parteFissa: parteFissa,
            termini: termini
        });
    }
}

export { Funzione };
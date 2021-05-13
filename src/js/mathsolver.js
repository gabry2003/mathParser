import { Funzione } from './funzione';
window.Funzione = Funzione;

String.prototype.isAlpha = function() {
    return this.match('^[a-zA-Z\(\)]+$');
};

/**
 * Punto da visualizzare nel grafico
 * 
 * @typedef {Object} Punto
 * @property {string} x - Ascissa del punto
 * @property {string} y - Ordinata punto
 * @property {string} nome - Nome del punto (opzionale)
 * @author Gabriele Princiotta <gabriprinciott@gmail.com>
 * @version 1.0
 */

/**
 * Risultato di una scomposizione
 * 
 * @typedef {Object} RisultatoScomposizione
 * @property {string} equazioneScomposta - Equazione scomposta, come stringa
 * @property {string} scomposizione - Codice HTML da inserire dentro un elemento per visualizzare i passaggi della scomposizione
 * @author Gabriele Princiotta <gabriprinciott@gmail.com>
 * @version 1.0
 */

/**
 * Opzioni per il disegno del grafico con MathSolver
 * 
 * @typedef {Object} MathSolverGraficoOptions
 * @property {HTMLElement} elemento - Elemento del frame dove viene visualizzato il grafico
 * @property {string} pagina - Pagina html dove viene visualizzato il grafico, da inserire all'interno del frame
 * @property {boolean} punti - Se aggiungere i punti nel grafico o no
 * @property {boolean} asintoti - Se visualizzare anche gli asintoti nel grafico
 * @property {boolean} direttrice - Se visualizzare anche la direttrice nel grafico (solamente nella parabola)
 * @property {boolean} asse - Se visualizzare anche l'asse nel grafico (solamente nella parabola)
 * @property {boolean} vertice - Se visualizzare anche il vertice nel grafico (solamente nella parabola)
 * @property {boolean} fuoco - Se visualizzare anche il fuoco nel grafico (solamente nella parabola)
 * @author Gabriele Princiotta <gabriprinciott@gmail.com>
 * @version 1.0
 */

/**
 * Opzioni per il disegno del grafico con MathSolver
 * 
 * @typedef {Object} MathSolverElementiOptions
 * @property {HTMLElement} listaPunti - Lista non ordinata dove inserire i punti
 * @property {HTMLElement} passaggiScomposizione - Elemento dove vengono visualizzati i passaggi della scomposizione    (es. '#scomposizione')
 * @property {HTMLElement} equazioniRisolte - Elemento dove vengono visualizzata la risoluzione di equazioni per risolverne una di grado maggiore   (es. '#equazioni-risolte')
 * @property {HTMLElement} risultato - Elemento dove viene visualizzato il risultato
 * @author Gabriele Princiotta <gabriprinciott@gmail.com>
 * @version 1.0
 */

/**
 * Opzioni per l'inizializzazione di un oggetto di tipo MathSolver.
 * Prende tutte le opzioni necessarie per disegnare le funzioni ecc...
 * 
 * @typedef {Object} MathSolverOptions
 * @property {MathSolverGraficoOptions} grafico - Opzioni del grafico
 * @property {MathSolverElementiOptions} elementi - Elementi dove inserire i valori
 * @author Gabriele Princiotta <gabriprinciott@gmail.com>
 * @version 1.0
 */

/**
 * Libreria che permette di eseguire diverse operazioni matematiche, come la risoluzione di equazioni e l'intersezione con gli assi
 * 
 * @class MathSolver
 * @author Gabriele Princiotta <gabriprinciott@gmail.com>
 * @param {MathSolverOptions} options Opzioni per inizializzare MathSolver
 * @version 1.0
 */
function MathSolver(options) {
    /**
     * Lettera attualemente scelta e stampata a schermo
     * 
     * @name MathSolver#letteraAttuale
     * @type {string}
     */
    this.letteraAttuale;
    /**
     * Elenco completo dei punti visualizzati sullo schermo
     * 
     * @name MathSolver#puntiAttivi
     * @type {Array.<Punto>}
     */
    this.puntiAttivi = [];

    /**
     * Metodo che aggiunge un punto nello schermo
     * 
     * @method
     * @name MathSolver#aggiungiPunto
     * @param {string} x Funzioni da disegnare a schermo
     * @param {string} y Eventuali punti da aggiungere al grafico
     * @param {string} [nome] Nome del punto
     */
    this.aggiungiPunto = function(x, y, nome) {
        if (puntiAttivi.filter(punto => punto.x == x && punto.y == y).length == 0) { // Se questo punto non esiste già
            // Lo aggiungo
            puntiAttivi.push({
                x: x,
                y: y
            });

            // Prendo la lettera successiva per dare il nome al punto
            const nomePunto = this.letteraAttuale ? String.fromCharCode(this.letteraAttuale.charCodeAt(this.letteraAttuale.length - 1) + 1) : 'A';
            this.letteraAttuale = nomePunto;
            let code = `${options.elementi.listaPunti.innerHTML}<li style="list-style-type: none;">`;
            code += this.toLatex(`${nomePunto}(${this.numeroRazionale(x)}, ${this.numeroRazionale(y)})`);
            code += `</li>`;
            options.elementi.listaPunti.innerHTML = code;
        }
    }

    /**
     * Metodo che svuota la lista dei punti aggiunti
     * 
     * @method
     * @name MathSolver#pulisciPunti
     */
    this.pulisciPunti = function() {
        options.elementi.listaPunti.innerHTML = '';
        this.letteraAttuale = null;
        this.puntiAttivi.length = 0;
    }

    /**
     * Metodo che nasconde il risultato dallo schermo
     * 
     * @method
     * @name MathSolver#togliRisultato
     */
    this.togliRisultato = function() {
        options.elementi.risultato.style.display = 'none';
        options.elementi.passaggiScomposizione.style.display = 'none';
        options.elementi.equazioniRisolte.style.display = 'none';
        options.elementi.passaggiScomposizione.innerHTML = '';
        options.elementi.equazioniRisolte.innerHTML = '';
        pulisciPunti();
    }

    /**
     * Metodo che mostra il risultato nello schermo
     * 
     * @method
     * @name MathSolver#mostraRisultato
     */
    this.mostraRisultato = function() {
        options.elementi.risultato.style.display = 'block';
    }

    /**
     * Questo metodo permette di disegnare una funzione in un grafico richiamando una pagina impostata nelle opzioni di MathSolver.
     * Prende come parametro solamente la funzione da visualizzare oppure un array di funzioni
     * 
     * @method
     * @name MathSolver#disegnaFunzione
     * @param {string|Array.<string>} funzioni Funzioni da disegnare a schermo
     * @param {Array.<Punto>} [punti] Eventuali punti da aggiungere al grafico
     */
    this.disegnaFunzione = function(funzioni, punti) {
        try {
            if (typeof(funzioni) == 'string') { // Se è stata passata una sola stringa
                funzioni = [funzioni]; // Lo trasformo in array
            }
            let url = new URL(options.grafico.pagina);
            url.searchParams.append('funzioni', encodeURIComponent(JSON.stringify(funzioni))); // Aggiungo le funzioni
            // Se devo aggiungere i punti
            if (options.grafico.punti) {
                url.searchParams.append('punti', encodeURIComponent(JSON.stringify(punti))); // Aggiungo i punti
            }
            url = url.toString();

            console.log('url', url);
            options.grafico.elemento.src = url; // Carico il grafico nella pagina
        } catch (err) {
            console.error(err);
        }
    }

    /**
     * Il codice Latex per essere interpretato correttamente dalla libreria MathJax deve trovarsi in mezzo ai caratteri di apertura e di chiusura.
     * Per risolvere questo problema è stato creato questo metodo
     * 
     * @method
     * @name MathSolver#toLatex
     * @param {string} string Codice Latex
     * @param {boolean} [add=true] Se aggiungere le stringhe iniziali e finali
     * 
     * @returns {string} Stringa di codice in Latex
     */
    this.toLatex = function(string, add = true) {
        let risultato = string;
        if (add) {
            risultato = `\\[${string}\\]`;
        }
        return risultato;
    }

    /**
     * Metodo che ritorna il numero sotto forma di frazione.
     * Al momento questa funzione non fa nulla per continuare il corretto funzionamento del programma in quanto ci sono degli errori
     * 
     * @method
     * @name MathSolver#numeroRazionale
     * @param {number} value Numero da controllare
     * @returns {*} Numero sotto forma di frazione
     */
    this.numeroRazionale = function(value) {
        return value;
        /*const frazione = math.fraction(math.number(value));
        if (frazione.d !== 1) {
            return `\\frac{${frazione.n.toString()}} {${frazione.d.toString()}}`;
        } else {
            return value;
        }*/
    }

    /**
     * Se il numero passato come argomento è negativo lo mette tra parentesti, altrimenti lo lascia com'è
     * 
     * @method
     * @name MathSolver#controllaParentesi
     * @param {number} numero Numero da controllare
     * 
     * @returns {string} Numero come stringa e tra parentesi se negativo
     */
    this.controllaParentesi = function(numero) {
        numero = this.numeroRazionale(numero);

        if (numero < 0) return `(${numero})`;

        return numero.toString();
    }

    /**
     * Questo metodo ritorna tutti i divisori di un numero, utile per la scomposizione con Ruffini
     * 
     * @method
     * @name MathSolver#trovaDivisori
     * @param {number} n Numero di cui trovare i divisori
     * @param {boolean} [negativi=true] Prendere anche valori negativi
     */
    this.trovaDivisori = function(n, negativi = true) {
        n = Math.abs(n); // Faccio il valore assoluto del numero

        let divisori = [];

        for (let i = 1; i <= parseInt(Math.sqrt(n)); i++) {
            if (n % i == 0) {
                if (parseInt(n / i) == i) {
                    divisori.push(i);
                } else {
                    divisori.push(i);
                    divisori.push(parseInt(n / i));
                }
            }
        }

        // Se devo aggiungere anche i numeri negativi
        if (negativi) {
            // Li aggiungo
            divisori = divisori.concat(divisori.map(divisore => -(divisore)));
        }

        // Ordino l'array
        divisori.sort((a, b) => a - b);

        return divisori;
    }

    /**
     * Metodo che controlla se un numero è uno zero del polinomio (ovvero che lo annulla)
     * 
     * @method
     * @name MathSolver#isZeroPolinomio
     * @param {number} numero
     * @param {string} polinomio
     */
    this.isZeroPolinomio = function(numero, polinomio) {
        return math.parse(polinomio).evaluate({
            x: numero
        }) == 0;
    }

    /**
     * Questo metodo scompone un'equazione utilizzando il metodo di Ruffini.
     * Oltre a tornare il risultato visualizza a schermo i passaggi negli elementi passati nelle opzioni
     * 
     * @method
     * @name MathSolver#scomponiConRuffini
     * @param {Funzione} funzione Funzione da scomporre con ruffini
     * @returns {RisultatoScomposizione} risultato della scomposizione
     */
    this.scomponiConRuffini = function(funzione) {
        let equazioneScomposta = [];
        let scomposizione = ``;

        funzione.ordina(); // Ordino la funzione in modo decrescente in base all'esponente della parte letterale
        const polinomio = funzione.membri[0];
        const termineNoto = funzione.termineNoto();
        let zeroPolinomio;
        let divisoriTermineNoto = [];
        let divisoriICoefficiente = [];
        let probabiliZero = [termineNoto];

        if (termineNoto !== 0) { // Se c'è il termine noto
            // Cerco i divisori del termine noto
            divisoriTermineNoto = this.trovaDivisori(funzione.termineNoto());
        }

        /*
        I probabili sono:
        - Termine noto
        - Divisori del termine noto
        - Primo coefficiente
        - Divisori del I coefficiente (con segno +)
        - Rapporti tra divisori del termine noto e divisori del I coefficiente
        */
        // Aggiungo i divisori del termine noto
        probabiliZero = probabiliZero.concat(divisoriTermineNoto);
        // Aggiungo il primo coefficiente
        probabiliZero = probabiliZero.concat(funzione.termini[0].coefficiente);
        // Aggiungo i divisori del I coefficiente
        divisoriICoefficiente = this.trovaDivisori(funzione.termini[0].coefficiente, false);
        probabiliZero = probabiliZero.concat(divisoriICoefficiente);
        // Aggiungo i rapporti tra i divisori del termine noto e i divisori del I coefficiente
        // Per ogni divisore del termine noto
        for (divisore in divisoriTermineNoto) {
            // Per ogni divisore del primo coefficiente
            for (divisore2 in divisoriICoefficiente) {
                probabiliZero.push(divisore / divisore2);
            }
        }

        // Tra i probabili zero del polinomio, cerco quello giusto
        for (let divisore of probabiliZero) {
            if (this.isZeroPolinomio(divisore, polinomio)) { // Se il divisore è lo zero del polinomio
                zeroPolinomio = divisore;
                break;
            }
        }

        // Se lo zero del polinomio esiste
        if (zeroPolinomio !== undefined && zeroPolinomio !== null) {
            // Completo il polinomio con i termini mancanti
            funzione.completa();
            let moltiplicazioni = ``;
            let somme = ``;
            let risultati = [];

            let risultato = funzione.termini[0].coefficiente * (zeroPolinomio); // Moltiplico il primo coefficiente per lo zero del polinomio
            for (let i = 1; i < funzione.termini.length; i++) { // A partire dal secondo termine
                moltiplicazioni += `<td>${this.toLatex(risultato)}</td>`;
                risultato = funzione.termini[i].coefficiente + risultato;
                risultati.push(risultato);
                somme += `<td>${this.toLatex(risultato)}</td>`;
                risultato = risultato * (zeroPolinomio);
            }

            let griglia = `<table class="table tabella-ruffini">
    <tbody>
    <tr>
        <td></td>`;

            for (let i = 0; i < funzione.termini.length; i++) {
                griglia += `<td>${this.toLatex(funzione.termini[i].coefficiente)}</td>`;
            }

            griglia += `</tr>
        <tr>
            <td>${this.toLatex(zeroPolinomio)}</td>
            <td></td>
            ${moltiplicazioni}
        </tr>`;

            griglia += `
        <tr class="somme-ruffini">
            <td></td>
            <td>${this.toLatex(funzione.termini[0].coefficiente)}</td>
            ${somme}`;
            griglia += `
        </tr>
    </tbody>
</table>`;

            // Dopo aver fatto la griglia ci creiamo più equazioni
            risultati = [funzione.termini[0].coefficiente].concat(risultati);
            let exp = funzione.grado() - 1;
            let scomposta = ``;
            for (let i = 0; i < (risultati.length - 1); i++) { // Per ogni risultato
                if (risultati[i] !== 0) { // Se il risultato non è zero
                    // Se il risultato è -1
                    if (risultati[i] == -1) {
                        if (exp !== 0) {
                            scomposta += '-';
                        } else {
                            scomposta += '-1';
                        }
                    } else if (risultati[i] == 1) { // Se è 1
                        // Se non è il primo risultato
                        if (i > 0) {
                            if (exp !== 0) {
                                scomposta += '+';
                            } else {
                                scomposta += '+1';
                            }
                        }
                    } else { // Altrimenti
                        if (risultati[i] > 0) scomposta += '+';
                        scomposta += risultati[i];
                    }
                    if (exp !== 0) {
                        if (exp !== 1) {
                            scomposta += `x^${exp}`;
                        } else {
                            scomposta += `x`;
                        }
                    }
                }
                exp--;
            }
            equazioneScomposta.push(scomposta);

            // Divido il polinomio per "x-(x1)" dove "x1" è lo zero del polinomio
            let controllaMeno = ``;
            // Se lo zero del polinomio è negativo
            if (zeroPolinomio < 0) {
                controllaMeno = `\\frac {${polinomio}} {x+${Math.abs(zeroPolinomio)}}`;
                equazioneScomposta.push(`x+${Math.abs(zeroPolinomio)}`);
            } else {
                equazioneScomposta.push(`x-${zeroPolinomio}`);
            }

            let equazioneScompostaString = ``;
            equazioneScomposta.forEach(eq => {
                equazioneScompostaString += `(${eq})`;
            });

            scomposizione += `<div class="col d-flex justify-content-center">
    <div class="card bg-dark text-white mb-4">
        <div class="card-header">${this.toLatex('\\text{Scomposizione con Ruffini}')}</div>
        <div class="card-body">
            ${this.toLatex('\\frac {' + polinomio + '}' + ' {x-' + this.controllaParentesi(zeroPolinomio) + '}' + (controllaMeno !== '' ? ' = ' + controllaMeno : ' '))}
        
            <br>
            ${griglia}
            <br>
            ${this.toLatex(equazioneScompostaString)}
        </div>
    </div>
</div>`;
        }

        return {
            equazione: equazioneScomposta,
            scomposizione: scomposizione
        };
    }

    /**
     * Questo metodo scompone un'equazione trovando il metodo migliore per scomporla
     * 
     * @method
     * @name MathSolver#scomponi
     * @param {Funzione} funzione Funzione da scomporre
     */
    this.scomponi = function(funzione) {
        // Prima di utilizzare la scomposizione con Ruffini provo con altri metodi di scomposizione

        // Se devo scomporre con Ruffini
        return this.scomponiConRuffini(funzione);
    }

    /**
     * Questo metodo risolve le equazioni di grado superiore al 2, è stato scritto per dividere la risoluzione di equazioni semplici da queste
     * 
     * @method
     * @name MathSolver#risolviEquazioneGradiMaggiori
     * @param {string} equazione Equazione da risolvere
     * @param {number} grado Grado dell'equazione da risolvere
     * @param {string} asse Asse con cui è stata effettuata l'intersezione
     * @param {boolean} [sistema=true] Se risolvere e basta o fare il sistema
     * @param {booolean} [pulisci=true] Se pulire i div
     */
    this.risolviEquazioneGradiMaggiori = function(equazione, grado, asse, sistema = true, pulisci = true) {
        let risultati = [];

        if (pulisci) {
            options.elementi.passaggiScomposizione.innerHTML = '';
            options.elementi.equazioniRisolte.innerHTML = '';
        }

        const scomposta = this.scomponi(new Funzione(equazione));
        // Se l'equazione è scomponibile stampo a schermo la scomposizione
        if (scomposta.scomposizione !== '') {
            options.elementi.passaggiScomposizione.innerHTML += scomposta.scomposizione;
        }
        let equazioneScomposta = ``;

        let code = ``;
        if (sistema) code += `<td class="spazio-sistema"></td>
<td class="graffa-sistema">`;
        code += this.toLatex(equazione);
        if (sistema) code += `${this.toLatex(asse)}
</td>`;

        if (scomposta.equazione.length > 0) { // Se l'equazione è stata scomposta
            options.elementi.passaggiScomposizione.style.css = 'block';
            options.elementi.equazioniRisolte.style.css = 'flex';

            // La stampo a schermo
            risultati = [];
            let equazioniScomposte = [];

            for (let i = 0; i < scomposta.equazione.length; i++) { // per ogni equazione trovata
                // La risolvo e mi salvo i risultati
                equazioneScomposta += `(${scomposta.equazione[i]})`;
                const equazioneRisolta = this.risolviEquazione(`${scomposta.equazione[i]}=0`, null, asse, false, false);
                // Mostro a schermo i passaggi per la risoluzione dell'equazione
                options.elementi.equazioniRisolte.innerHTML += `<div class="col-md-6">
    <div class="card bg-dark text-white mb-4">
        <div class="card-header">${this.toLatex('\\text{Risoluzione equazione}')}</div>
        <div class="card-body">
            ${equazioneRisolta.code}
        </div>
    </div>
</div>`;
                risultati = risultati.concat(equazioneRisolta.risultati);
                if (equazioneRisolta.equazioneScomposta) { // Se è presente un'equazione scomposta
                    equazioniScomposte.push(equazioneRisolta.equazioneScomposta);
                }
            }

            options.elementi.passaggiScomposizione.style.css = 'block';
            options.elementi.equazioniRisolte.style.css = 'flex';

            equazioneScomposta += `=0`;
            // Visualizzo a schermo l'equazione scomposta
            if (sistema) code += `<td class="spazio-sistema"></td>
<td class="graffa-sistema">`;
            code += this.toLatex(`${equazioneScomposta}`);
            if (sistema) code += `${this.toLatex(asse)}
</td>`;

            // Visualizzo a schermo le altre scomposizioni
            if (sistema) {
                let ultimaDaConcatenare;

                if (scomposta.equazione.length > 0) { // Se l'equazione è stata scomposta
                    ultimaDaConcatenare = `(${scomposta.equazione[scomposta.equazione.length - 1]})`;
                }

                equazioniScomposte.forEach(eq => {
                    eq = eq.split('=')[0]; // Prendo il primo membro dell'equazione
                    eq = `${eq}${ultimaDaConcatenare}`; // Concateno

                    code += `<td class="spazio-sistema"></td>
                <td class="graffa-sistema">`;
                    code += this.toLatex(`${eq}=0`);
                    code += `${this.toLatex(asse)}
                </td>`;

                    ultimaDaConcatenare = eq;
                });
            }

            // Rimuovo i doppioni dai risultati
            risultati = [...new Set(risultati)];

            // Ordino l'array di risultati
            risultati.sort((a, b) => a - b);

            risultati.forEach((risultato, i) => {
                if (sistema) code += `<td class="spazio-sistema"></td>
<td class="graffa-sistema">`;
                code += this.toLatex('x_\{' + (i + 1) + '\} = ' + this.numeroRazionale(risultato));
                if (sistema) code += this.toLatex('y_\{' + (i + 1) + '\} = 0');
                if (sistema) code += `
</td>`;
            });
        } else { // Altrimenti
            if (sistema) {
                code += `<td class="spazio-sistema"></td>
            <td>${this.toLatex('\\text{Impossibile scomporre l\'equazione}')}</td>`;
            } else {
                code += this.toLatex('\\text{Impossibile scomporre l\'equazione}');
            }
        }

        return {
            code: code,
            risultati: risultati,
            equazioneScomposta: equazioneScomposta
        };
    }

    /**
     * Risolve un'equazione di qualunque grado.
     * Quando un'equazione è di grado superiore al secondo chiama un'altra funzione che la risolve in un altro modo
     * 
     * @method
     * @name MathSolver#controllaParentesi
     * @param {string} equazione Equazione da risolvere
     * @param {number} grado Grado dell'equazione
     * @param {string} asse Asse con cui è stata fatta l'intersezione
     * @param {boolean} [sistema=true] Se risolvere e basta o fare il sistema
     * @param {booolean} [pulisci=true] Se pulire i div
     * @returns {*} Risultati dell'equazione e il codice da stampare a schermo
     */
    this.risolviEquazione = function(equazione, grado, asse, sistema = true, pulisci = true) {
        // Prendiamo le informazioni di questa equazione
        let espressione = new Funzione(equazione.split('=')[0]);
        let code = ``;
        let risultati = [];
        grado = grado || espressione.grado();

        switch (grado) {
            case 1:
                options.elementi.passaggiScomposizione.style.css = 'none';
                options.elementi.equazioniRisolte.style.css = 'none';
                if (sistema) code += `<td class="spazio-sistema"></td>
<td class="graffa-sistema">`;
                code += this.toLatex(equazione);
                if (sistema) code += `${this.toLatex(asse)}
</td>`;

                const termineNoto = espressione.termineNoto();

                if (termineNoto !== 0) { // Se il termine noto è 0
                    // Sposto il termine noto al secondo membro
                    if (sistema) code += `<td class="spazio-sistema"></td>
                <td class="graffa-sistema">`;
                    code += this.toLatex(espressione.termini[0].toString() + ' = ' + this.numeroRazionale(-(termineNoto)));
                    if (sistema) code += `${this.toLatex(asse)}
                </td>`;

                    // Divido il secondo membro per il coefficiente della x
                    // Se il coefficiente è diverso da 1
                    let ascissa = this.numeroRazionale(Math.round((-(termineNoto) / espressione.termini[0].coefficiente) * 100, 2) / 100);
                    let ordinata = asse.split('=')[1];

                    if (espressione.termini[0].coefficiente !== 1) {
                        if (sistema) code += `<td class="spazio-sistema"></td>
                    <td class="graffa-sistema">`;
                        code += this.toLatex('x = ' + ascissa);
                        if (sistema) code += `${this.toLatex(asse)}
                    </td>`;
                    }

                    this.aggiungiPunto(ascissa, ordinata);

                    risultati = [ascissa];
                } else { // Altrimenti
                    if (sistema) code += `<td class="spazio-sistema"></td>
<td class="graffa-sistema">`;
                    code += this.toLatex('x = 0');
                    if (sistema) code += `${this.toLatex(asse)}
</td>`;
                    this.aggiungiPunto(0, 0);
                }
                break;
            case 2:
                options.elementi.passaggiScomposizione.style.css = 'none';
                options.elementi.equazioniRisolte.style.css = 'none';
                if (sistema) code += `<td class="spazio-sistema"></td>
<td class="graffa-sistema">`;
                code += this.toLatex(equazione);
                if (sistema) code += `${this.toLatex(asse)}
</td>`;
                const a = espressione.getByExp(2);
                const b = espressione.getByExp(1);
                const c = espressione.termineNoto();
                const delta = Math.pow((b ? b.coefficiente : 0), 2) - (4 * a.coefficiente * c);
                const radice = Math.sqrt(delta);
                risultati = [
                    (-(b ? b.coefficiente : 0) - radice) / 2 * a.coefficiente,
                    (-(b ? b.coefficiente : 0) + radice) / 2 * a.coefficiente
                ];

                // Stampo la formula
                if (sistema) code += `<td class="spazio-sistema"></td>
                <td class="graffa-sistema">`;
                code += this.toLatex(`x = \\frac{-b \\pm \\sqrt{b^2-4ac}} {2a}`);

                if (sistema) code += `${this.toLatex(asse)}
                </td>`;
                // Stampo l'equazione con i numeri sostituiti
                if (sistema) code += `<td class="spazio-sistema"></td>
                <td class="graffa-sistema">`;
                code += this.toLatex(`x = \\frac{-${this.controllaParentesi((b ? b.coefficiente : 0))} \\pm \\sqrt{${this.controllaParentesi((b ? b.coefficiente : 0))}^2-4*${this.controllaParentesi(a.coefficiente)}*${this.controllaParentesi(c)}}} {${this.controllaParentesi(a.coefficiente * 2)}} = 0`);

                if (sistema) code += `${this.toLatex(asse)}
                </td>`;
                // Stampo l'equazione con il delta trovato
                if (sistema) code += `<td class="spazio-sistema"></td>
                <td class="graffa-sistema">`;

                code += this.toLatex(`x = \\frac{-${this.controllaParentesi((b ? b.coefficiente : 0))} \\pm \\sqrt{${this.numeroRazionale(delta)}}} {${this.controllaParentesi(a.coefficiente * 2)}}`);

                if (sistema) code += `${this.toLatex(asse)}
                </td>`;
                if (delta < 0) { // Se il delta è minore di zero
                    // L'equazione è impossibile
                    // Stampo l'equazione con la radice risolta
                    if (sistema) code += `<td class="spazio-sistema"></td>
            
            <td class="graffa-sistema">`;
                    code += this.toLatex('\\text{eq. imp. in } \\mathbb{R}');

                    if (sistema) code += `${this.toLatex(asse)}
            </td>`;
                } else { // Altrimenti
                    // Stampo l'equazione con la radice risolta
                    if (sistema) code += `<td class="spazio-sistema"></td>
            
            <td class="graffa-sistema">`;
                    code += this.toLatex(`x = \\frac{-${this.controllaParentesi((b ? b.coefficiente : 0))} \\pm ${this.numeroRazionale(radice)}} {${this.controllaParentesi(a.coefficiente)}}`);
                    if (sistema) code += `${this.toLatex(asse)}
            </td>`;

                    // Se il delta è uguale a zero
                    if (delta == 0) {
                        // Stampo il risultato
                        if (sistema) code += `<td class="spazio-sistema"></td>
            
            <td class="graffa-sistema">`;
                        code += this.toLatex('x_\{1,2\} = \\pm' + this.numeroRazionale(Math.abs(risultati[0])));

                        if (sistema) code += `${this.toLatex(asse)}
            </td>`;
                        this.aggiungiPunto(risultati[0], 0);
                    } else {
                        // Stampo i risultati
                        for (let i = 0; i < 2; i++) {
                            if (sistema) code += `<td class="spazio-sistema"></td>
                        
                        <td class="graffa-sistema">`;
                            code += this.toLatex('x_\{' + (i + 1) + '\} = ' + this.numeroRazionale(risultati[i]));
                            if (sistema) code += this.toLatex('y_\{' + (i + 1) + '\} = 0');
                            if (sistema) code += `</td>`;
                            this.aggiungiPunto(risultati[i], 0);
                        }
                    }
                }
                break;
            default:
                return this.risolviEquazioneGradiMaggiori(equazione, grado, asse, sistema, pulisci);
        }

        return {
            code: code,
            risultati: risultati
        };
    }

    /**
     * Effettua l'intersezione di una funzione con un determinato asse
     * 
     * @method
     * @name MathSolver#intersezioneAsse
     * @param {string} funzione Funzione presa in input
     * @param {string} asse Asse con cui la funzione deve fare l'intersezione
     */
    this.intersezioneAsse = function(funzione, asse) {
        const equazioniAssi = {
            x: 'y = 0',
            y: 'x = 0'
        };

        let code = `<h6>${this.toLatex('\\text{Intersezione con l\'asse ' + asse + '}')}</h6>
<table tborder=0>
    <tbody>
        <tr>
            
            <td class="graffa-sistema">
                ${this.toLatex(funzione)}
                
                ${this.toLatex(equazioniAssi[asse])}
            </td>`;

        funzione = new Funzione(funzione); // Interpretiamo la funzione in un oggetto

        if (asse == 'y') { // Se devo fare l'intersezione con l'asse y
            const termineNoto = funzione.termineNoto();
            code += `<td class="spazio-sistema"></td>
<td class="graffa-sistema">
    ${this.toLatex('y = ' + this.numeroRazionale(termineNoto))}
    ${this.toLatex(equazioniAssi[asse])}
</td>`;
            this.aggiungiPunto(0, termineNoto);
        } else {
            code += this.risolviEquazione(`${funzione.membri[1]}=0`, funzione.grado(), equazioniAssi[asse]).code;
        }

        code += `
        </tr>
    </tbody>
<table>`;
        return code;
    }

}

/**
 * Divide l'espressione in ogni termine di cui è composta in base a dei caratteri delimitanti
 * 
 * @param {string} espressione 
 * @param {Array.<string>} caratteri Caratteri delimitanti
 * @name MathSolver#splittaEspressione
 * @static
 */
MathSolver.splittaEspressione = function(espressione, caratteri) {
    let split = [];
    let stringa = '';

    for (let i = 0; i < espressione.length; i++) { // leggo ogni carattere dell'espressione
        const carattere = espressione[i];

        if (!caratteri.includes(espressione[i]) || i == 0) { // Se non è un carattere da splittare e non è il primo carattere dell'espressione
            stringa += espressione[i];
        } else {
            split.push(stringa); // Aggiungiamo la stringa nell'array
            stringa = `${carattere}`; // Svuotiamo la stringa
        }

        if (i == (espressione.length - 1)) { // Se sono all'ultimo carattere e non ho trovato nulla da splittare
            split.push(stringa); // Aggiungiamo la stringa nell'array
        }
    }

    return split;
}

export { MathSolver };
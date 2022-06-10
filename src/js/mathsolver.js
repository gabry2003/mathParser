import { Funzione } from "./funzione";
window.Funzione = Funzione;

String.prototype.isAlpha = function () {
  return this.match("^[a-zA-Z()]+$");
};

/**
 * Punto da visualizzare nel grafico
 *
 * @typedef {Object} Punto
 * @property {string} x - Ascissa del punto
 * @property {string} y - Ordinata punto
 * @property {string} nome - Nome del punto (opzionale)
 * @property {string} background - Colore di sfondo del punto (opzionale)
 * @property {string} foreground - Colore di testo del punto (opzionale)
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
   * Metodo che ritorna i punti attivi per un determinato asse cartesiano
   *
   * @method
   *
   * @param {string} asse Asse di cui prendere i punti
   * @returns {Array.<Punto>} Array di punti
   */
  this.puntiAsse = function (asse) {
    switch (asse) {
      case "x":
        return this.puntiAttivi.filter((punto) => punto.y == 0);
      case "y":
        return this.puntiAttivi.filter((punto) => punto.x == 0);
    }
  };

  /**
   * Metodo che aggiunge un punto nello schermo
   *
   * @method
   * @name MathSolver#aggiungiPunto
   * @param {string} x Funzioni da disegnare a schermo
   * @param {string} y Eventuali punti da aggiungere al grafico
   * @param {string} [nome] Nome del punto
   */
  this.aggiungiPunto = function (x, y, nome) {
    const found = (this.puntiAttivi || []).find(
      (punto) => punto.x == x && punto.y == y
    );

    // Se il punto esiste gia' lo ritorno
    if (found) {
      return found;
    }

    // Prendo la lettera successiva per dare il nome al punto
    const nomePunto = this.letteraAttuale
      ? String.fromCharCode(
          this.letteraAttuale.charCodeAt(this.letteraAttuale.length - 1) + 1
        )
      : "A";

    // Se questo punto non esiste già
    // Lo aggiungo
    const nuovoPunto = {
      x,
      y,
      nome: nomePunto,
    };
    this.puntiAttivi.push(nuovoPunto);

    this.letteraAttuale = nomePunto;
    let code = `${
      document.querySelector(options.elementi.listaPunti).innerHTML
    }<li style="list-style-type: none;">`;
    code += this.toLatex(
      `${nomePunto}(${MathSolver.numeroRazionale(
        x
      )}, ${MathSolver.numeroRazionale(y)})`
    );
    code += `</li>`;
    document.querySelector(options.elementi.listaPunti).innerHTML = code;

    return nuovoPunto;
  };

  /**
   * Metodo che svuota la lista dei punti aggiunti
   *
   * @method
   * @name MathSolver#pulisciPunti
   */
  this.pulisciPunti = function () {
    document.querySelector(options.elementi.listaPunti).innerHTML = "";
    this.letteraAttuale = null;
    this.puntiAttivi.length = 0;
  };

  /**
   * Metodo che nasconde il risultato dallo schermo
   *
   * @method
   * @name MathSolver#togliRisultato
   */
  this.togliRisultato = function () {
    console.log("bbb");
    document.querySelector(options.elementi.risultato).style.display = "none";
    document.querySelector(
      options.elementi.passaggiScomposizione
    ).style.display = "none";
    document.querySelector(options.elementi.equazioniRisolte).style.display =
      "none";
    document.querySelector(options.elementi.passaggiScomposizione).innerHTML =
      "";
    document.querySelector(options.elementi.equazioniRisolte).innerHTML = "";
    pulisciPunti();
  };

  /**
   * Metodo che mostra il risultato nello schermo
   *
   * @method
   * @name MathSolver#mostraRisultato
   */
  this.mostraRisultato = function () {
    document.querySelector(options.elementi.risultato).style.display = "block";
  };

  /**
   * Questo metodo permette di disegnare una funzione in un grafico richiamando una pagina impostata nelle opzioni di MathSolver.
   * Prende come parametro solamente la funzione da visualizzare oppure un array di funzioni
   *
   * @method
   * @name MathSolver#disegnaFunzione
   * @param {string|Array.<string>} funzioni Funzioni da disegnare a schermo
   * @param {Array.<Punto>} [punti] Eventuali punti da aggiungere al grafico
   */
  this.disegnaFunzione = function (funzioni, punti) {
    try {
      if (typeof funzioni == "string") {
        // Se è stata passata una sola stringa
        funzioni = [funzioni]; // Lo trasformo in array
      }

      let url = new URL(options.grafico.pagina, `https://prova.it/`);
      url.searchParams.append("funzioni", JSON.stringify(funzioni)); // Aggiungo le funzioni
      // Se devo aggiungere i punti
      if (options.grafico.punti && punti) {
        url.searchParams.append("punti", JSON.stringify(punti)); // Aggiungo i punti
      }
      url = url.toString().replace("https://prova.it/", "");

      console.log("url", url);
      options.grafico.elemento.src = url; // Carico il grafico nella pagina
    } catch (err) {
      console.error(err);
    }
  };

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
  this.toLatex = function (string, add = true) {
    if (add) {
      return `\\[${string}\\]`;
    }

    return string;
  };

  /**
   * Se il numero passato come argomento è negativo lo mette tra parentesti, altrimenti lo lascia com'è
   *
   * @method
   * @name MathSolver#controllaParentesi
   * @param {number} numero Numero da controllare
   *
   * @returns {string} Numero come stringa e tra parentesi se negativo
   */
  this.controllaParentesi = function (numero) {
    numero = MathSolver.numeroRazionale(numero);

    if (numero < 0) return `(${numero})`;

    return numero.toString();
  };

  /**
   * Questo metodo ritorna tutti i divisori di un numero, utile per la scomposizione con Ruffini
   *
   * @method
   * @name MathSolver#trovaDivisori
   * @param {number} n Numero di cui trovare i divisori
   * @param {boolean} [negativi=true] Prendere anche valori negativi
   */
  this.trovaDivisori = function (n, negativi = true) {
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
      divisori = divisori.concat(divisori.map((divisore) => -divisore));
    }

    // Ordino l'array
    divisori.sort((a, b) => a - b);

    return divisori;
  };

  /**
   * Metodo che controlla se un numero è uno zero del polinomio (ovvero che lo annulla)
   *
   * @method
   * @name MathSolver#isZeroPolinomio
   * @param {number} numero
   * @param {string} polinomio
   */
  this.isZeroPolinomio = function (numero, polinomio) {
    return (
      math.parse(polinomio).evaluate({
        x: numero,
      }) == 0
    );
  };

  /**
   * Questo metodo scompone un'equazione utilizzando il metodo di Ruffini.
   * Oltre a tornare il risultato visualizza a schermo i passaggi negli elementi passati nelle opzioni
   *
   * @method
   * @name MathSolver#scomponiConRuffini
   * @param {Funzione} funzione Funzione da scomporre con ruffini
   * @returns {RisultatoScomposizione} risultato della scomposizione
   */
  this.scomponiConRuffini = function (funzione) {
    let equazioneScomposta = [];
    let scomposizione = ``;

    funzione.ordina(); // Ordino la funzione in modo decrescente in base all'esponente della parte letterale
    const polinomio = funzione.membri[0];
    const termineNoto = funzione.termineNoto();
    let zeroPolinomio;
    let divisoriTermineNoto = [];
    let divisoriICoefficiente = [];
    let probabiliZero = [termineNoto];

    if (termineNoto !== 0) {
      // Se c'è il termine noto
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
    divisoriICoefficiente = this.trovaDivisori(
      funzione.termini[0].coefficiente,
      false
    );
    probabiliZero = probabiliZero.concat(divisoriICoefficiente);
    // Aggiungo i rapporti tra i divisori del termine noto e i divisori del I coefficiente
    // Per ogni divisore del termine noto
    for (let divisore in divisoriTermineNoto) {
      // Per ogni divisore del primo coefficiente
      for (let divisore2 in divisoriICoefficiente) {
        probabiliZero.push(divisore / divisore2);
      }
    }

    // Tra i probabili zero del polinomio, cerco quello giusto
    for (let divisore of probabiliZero) {
      if (this.isZeroPolinomio(divisore, polinomio)) {
        // Se il divisore è lo zero del polinomio
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

      let risultato = funzione.termini[0].coefficiente * zeroPolinomio; // Moltiplico il primo coefficiente per lo zero del polinomio
      for (let i = 1; i < funzione.termini.length; i++) {
        // A partire dal secondo termine
        moltiplicazioni += `<td>${this.toLatex(risultato)}</td>`;
        risultato = funzione.termini[i].coefficiente + risultato;
        risultati.push(risultato);
        somme += `<td>${this.toLatex(risultato)}</td>`;
        risultato = risultato * zeroPolinomio;
      }

      let griglia = `<table class="table tabella-ruffini text-white">
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
      for (let i = 0; i < risultati.length - 1; i++) {
        // Per ogni risultato
        if (risultati[i] !== 0) {
          // Se il risultato non è zero
          // Se il risultato è -1
          if (risultati[i] == -1) {
            if (exp !== 0) {
              scomposta += "-";
            } else {
              scomposta += "-1";
            }
          } else if (risultati[i] == 1) {
            // Se è 1
            // Se non è il primo risultato
            if (i > 0) {
              if (exp !== 0) {
                scomposta += "+";
              } else {
                scomposta += "+1";
              }
            }
          } else {
            // Altrimenti
            if (risultati[i] > 0) scomposta += "+";
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
      equazioneScomposta.forEach((eq) => {
        equazioneScompostaString += `(${eq})`;
      });

      scomposizione += `<div class="col d-flex justify-content-center">
    <div class="card bg-primary text-white mb-4">
        <div class="card-header">${this.toLatex(
          "\\text{Scomposizione con Ruffini}"
        )}</div>
        <div class="card-body">
            ${this.toLatex(
              "\\frac {" +
                polinomio +
                "}" +
                " {x-" +
                this.controllaParentesi(zeroPolinomio) +
                "}" +
                (controllaMeno !== "" ? " = " + controllaMeno : " ")
            )}
        
            <br>
            ${griglia}
            <br>
            ${this.toLatex(equazioneScompostaString)}
        </div>
    </div>
</div>`;
    } else {
      console.log(
        `Non trovo lo zero del polinomio!`,
        `polinomio`,
        polinomio,
        `probabiliZero`,
        probabiliZero
      );
    }

    return {
      equazione: equazioneScomposta,
      scomposizione: scomposizione,
    };
  };

  /**
   * Questo metodo scompone un'equazione trovando il metodo migliore per scomporla
   *
   * @method
   * @name MathSolver#scomponi
   * @param {Funzione} funzione Funzione da scomporre
   */
  this.scomponi = function (funzione) {
    return this.scomponiConRuffini(funzione);
  };

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
  this.risolviEquazioneGradiMaggiori = function (
    equazione,
    grado,
    asse,
    sistema = true,
    pulisci = true
  ) {
    let risultati = [];

    if (pulisci) {
      document.querySelector(options.elementi.passaggiScomposizione).innerHTML =
        "";
      document.querySelector(options.elementi.equazioniRisolte).innerHTML = "";
    }

    const scomposta = this.scomponi(new Funzione(equazione));
    // Se l'equazione è scomponibile stampo a schermo la scomposizione
    if (scomposta.scomposizione !== "") {
      document.querySelector(
        options.elementi.passaggiScomposizione
      ).innerHTML += scomposta.scomposizione;
    }
    let equazioneScomposta = ``;

    let code = ``;
    if (sistema)
      code += `<td class="spazio-sistema"></td>
<td class="graffa-sistema">`;
    code += this.toLatex(equazione);
    if (sistema)
      code += `${this.toLatex(asse)}
</td>`;

    if (scomposta.equazione.length > 0) {
      // Se l'equazione è stata scomposta
      // La stampo a schermo
      risultati = [];
      let equazioniScomposte = [];

      for (let i = 0; i < scomposta.equazione.length; i++) {
        // per ogni equazione trovata
        // La risolvo e mi salvo i risultati
        equazioneScomposta += `(${scomposta.equazione[i]})`;
        const equazioneRisolta = this.risolviEquazione(
          `${scomposta.equazione[i]}=0`,
          null,
          asse,
          false,
          false
        );
        // Mostro a schermo i passaggi per la risoluzione dell'equazione
        document.querySelector(
          options.elementi.equazioniRisolte
        ).innerHTML += `<div class="col-md-6">
    <div class="card bg-primary text-white mb-4">
        <div class="card-header">${this.toLatex(
          "\\text{Risoluzione equazione}"
        )}</div>
        <div class="card-body">
            ${equazioneRisolta.code}
        </div>
    </div>
</div>`;
        risultati = risultati.concat(equazioneRisolta.risultati);
        if (equazioneRisolta.equazioneScomposta) {
          // Se è presente un'equazione scomposta
          equazioniScomposte.push(equazioneRisolta.equazioneScomposta);
        }
      }

      // VIsualizzo a schermo i passaggi
      document.querySelector(
        options.elementi.passaggiScomposizione
      ).style.display = "block";
      document.querySelector(options.elementi.equazioniRisolte).style.display =
        "flex";

      /*console.log(document.querySelector(options.elementi.passaggiScomposizione));
            console.log(document.querySelector(options.elementi.equazioniRisolte));*/

      equazioneScomposta += `=0`;
      // Visualizzo a schermo l'equazione scomposta
      if (sistema)
        code += `<td class="spazio-sistema"></td>
<td class="graffa-sistema">`;
      code += this.toLatex(`${equazioneScomposta}`);
      if (sistema)
        code += `${this.toLatex(asse)}
</td>`;

      // Visualizzo a schermo le altre scomposizioni
      if (sistema) {
        let ultimaDaConcatenare;

        if (scomposta.equazione.length > 0) {
          // Se l'equazione è stata scomposta
          ultimaDaConcatenare = `(${
            scomposta.equazione[scomposta.equazione.length - 1]
          })`;
        }

        equazioniScomposte.forEach((eq) => {
          eq = eq.split("=")[0]; // Prendo il primo membro dell'equazione
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
        if (sistema)
          code += `<td class="spazio-sistema"></td>
<td class="graffa-sistema">`;
        code += this.toLatex(
          "x_{" + (i + 1) + "} = " + MathSolver.numeroRazionale(risultato)
        );
        if (sistema) code += this.toLatex("y_{" + (i + 1) + "} = 0");
        if (sistema)
          code += `
</td>`;
      });
    } else {
      // Altrimenti
      if (sistema) {
        code += `<td class="spazio-sistema"></td>
            <td>${this.toLatex(
              "\\text{Impossibile scomporre l'equazione}"
            )}</td>`;
      } else {
        code += this.toLatex("\\text{Impossibile scomporre l'equazione}");
      }
    }

    return {
      code: code,
      risultati: risultati,
      equazioneScomposta: equazioneScomposta,
    };
  };

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
   * @param {boolean} [pulisci=true] Se pulire i div
   * @returns {*} Risultati dell'equazione e il codice da stampare a schermo
   */
  this.risolviEquazione = function (
    equazione,
    grado,
    asse,
    sistema = true,
    pulisci = true,
    aggiungiPunto = true
  ) {
    // Prendiamo le informazioni di questa equazione
    let delta;
    let espressione = new Funzione(equazione.split("=")[0]);
    let code = ``;
    let risultati = [];

    grado = grado || espressione.grado();

    const a = espressione.getByExp(grado);
    const b = espressione.getByExp(grado - 1);

    switch (grado) {
      case 1:
        if (pulisci) {
          document.querySelector(
            options.elementi.passaggiScomposizione
          ).style.display = "none";
          document.querySelector(
            options.elementi.equazioniRisolte
          ).style.display = "none";
        }

        if (sistema)
          code += `<td class="spazio-sistema"></td>
<td class="graffa-sistema">`;
        code += this.toLatex(equazione);
        if (sistema)
          code += `${this.toLatex(asse)}
</td>`;

        const termineNoto = espressione.termineNoto();

        if (termineNoto !== 0) {
          // Se il termine noto è 0
          // Sposto il termine noto al secondo membro
          if (sistema)
            code += `<td class="spazio-sistema"></td>
              <td class="graffa-sistema">`;
          code += this.toLatex(
            espressione.termini[0].toStringWithoutPlus() +
              " = " +
              MathSolver.numeroRazionale(-termineNoto)
          );
          if (sistema)
            code += `${this.toLatex(asse)}
              </td>`;

          // Divido il secondo membro per il coefficiente della x
          // Se il coefficiente è diverso da 1
          let ascissa = MathSolver.numeroRazionale(
            Math.round(
              (-termineNoto / espressione.termini[0].coefficiente) * 100,
              2
            ) / 100
          );
          let ordinata = asse.split("=")[1];

          if (espressione.termini[0].coefficiente !== 1) {
            if (sistema)
              code += `<td class="spazio-sistema"></td>
                  <td class="graffa-sistema">`;
            code += this.toLatex("x = " + ascissa);
            if (sistema)
              code += `${this.toLatex(asse)}
                  </td>`;
          }

          if (aggiungiPunto) {
            this.aggiungiPunto(ascissa, ordinata);
          }

          risultati = [ascissa];
        } else {
          // Altrimenti
          if (sistema)
            code += `<td class="spazio-sistema"></td>
<td class="graffa-sistema">`;
          code += this.toLatex("x = 0");
          if (sistema)
            code += `${this.toLatex(asse)}
</td>`;
          this.aggiungiPunto(0, 0);
        }
        break;
      case 2:
        if (pulisci) {
          document.querySelector(
            options.elementi.passaggiScomposizione
          ).style.display = "none";
          document.querySelector(
            options.elementi.equazioniRisolte
          ).style.display = "none";
        }

        if (sistema)
          code += `<td class="spazio-sistema"></td>
<td class="graffa-sistema">`;
        code += this.toLatex(equazione);
        if (sistema)
          code += `${this.toLatex(asse)}
</td>`;

        const c = espressione.termineNoto();
        delta = Math.pow(b ? b.coefficiente : 0, 2) - 4 * a.coefficiente * c;
        const radice = Math.sqrt(delta);
        const menoCoefficienteB = -(b ? b.coefficiente : 0);
        const coefficienteA = a ? a.coefficiente : 0;

        risultati = [
          (menoCoefficienteB - radice) / (2 * coefficienteA),
          (menoCoefficienteB + radice) / (2 * coefficienteA),
        ];

        const coefficienteB = b ? b.coefficiente : 0;
        const menoB = coefficienteB
          ? `-${this.controllaParentesi(coefficienteB)}`
          : "";
        const bQuadro = coefficienteB
          ? `${this.controllaParentesi(coefficienteB)}^2`
          : "";

        // Stampo la formula
        if (sistema)
          code += `<td class="spazio-sistema"></td>
              <td class="graffa-sistema">`;
        code += this.toLatex(`x_{1,2} = \\frac{-b \\pm \\sqrt{b^2-4ac}} {2a}`);

        if (sistema)
          code += `${this.toLatex(asse)}
              </td>`;
        // Stampo l'equazione con i numeri sostituiti
        if (sistema)
          code += `<td class="spazio-sistema"></td>
              <td class="graffa-sistema">`;
        code += this.toLatex(
          `x_{1,2} = \\frac{${menoB} \\pm \\sqrt{${bQuadro}-4*${this.controllaParentesi(
            a.coefficiente
          )}*${this.controllaParentesi(c)}}} {${this.controllaParentesi(
            a.coefficiente * 2
          )}} = 0`
        );

        if (sistema)
          code += `${this.toLatex(asse)}
              </td>`;
        // Stampo l'equazione con il delta trovato
        if (sistema)
          code += `<td class="spazio-sistema"></td>
              <td class="graffa-sistema">`;

        code += this.toLatex(
          `x_{1,2} = \\frac{${menoB} \\pm \\sqrt{${MathSolver.numeroRazionale(
            delta
          )}}} {${this.controllaParentesi(a.coefficiente * 2)}}`
        );

        if (sistema)
          code += `${this.toLatex(asse)}
              </td>`;
        if (delta < 0) {
          // Se il delta è minore di zero
          // L'equazione è impossibile
          // Stampo l'equazione con la radice risolta
          if (sistema)
            code += `<td class="spazio-sistema"></td>
          
          <td class="graffa-sistema">`;
          code += this.toLatex("\\text{eq. imp. in } \\mathbb{R}");

          if (sistema)
            code += `${this.toLatex(asse)}
          </td>`;
        } else {
          // Altrimenti
          // Stampo l'equazione con la radice risolta
          if (sistema)
            code += `<td class="spazio-sistema"></td>
          
          <td class="graffa-sistema">`;
          code += this.toLatex(
            `x_{1,2} = \\frac{${menoB} \\pm ${MathSolver.numeroRazionale(
              radice
            )}} {${this.controllaParentesi(a.coefficiente * 2)}}`
          );
          if (sistema)
            code += `${this.toLatex(asse)}
          </td>`;

          // Se il delta è uguale a zero
          if (delta == 0) {
            // Stampo il risultato
            if (sistema)
              code += `<td class="spazio-sistema"></td>
          
          <td class="graffa-sistema">`;
            code += this.toLatex(
              "x_{1,2} = \\pm" +
                MathSolver.numeroRazionale(Math.abs(risultati[0]))
            );

            if (sistema)
              code += `${this.toLatex(asse)}
          </td>`;
            if (aggiungiPunto) {
              this.aggiungiPunto(risultati[i], 0);
            }
          } else {
            // Stampo i risultati
            for (let i = 0; i < 2; i++) {
              if (sistema)
                code += `<td class="spazio-sistema"></td>
                      
                      <td class="graffa-sistema">`;
              code += this.toLatex(
                "x_{" +
                  (i + 1) +
                  "} = " +
                  MathSolver.numeroRazionale(risultati[i])
              );
              if (sistema) code += this.toLatex("y_{" + (i + 1) + "} = 0");
              if (sistema) code += `</td>`;

              if (aggiungiPunto) {
                this.aggiungiPunto(risultati[i], 0);
              }
            }
          }
        }
        break;
      default:
        return this.risolviEquazioneGradiMaggiori(
          equazione,
          grado,
          asse,
          sistema,
          pulisci
        );
    }

    return {
      code: code,
      risultati: risultati,
      a: a ? a.coefficiente : 0,
      b: b ? b.coefficiente : 0,
      delta,
    };
  };

  /**
   * Effettua l'intersezione di una funzione con un determinato asse
   *
   * @method
   * @name MathSolver#intersezioneAsse
   * @param {string} funzione Funzione presa in input
   * @param {string} asse Asse con cui la funzione deve fare l'intersezione
   */
  this.intersezioneAsse = function (funzione, asse) {
    const equazioniAssi = {
      x: "y = 0",
      y: "x = 0",
    };

    let code = `<h5>${this.toLatex(
      "\\text{Intersezione con l'asse " + asse + "}"
    )}</h5>
<table tborder=0>
    <tbody>
        <tr>
            
            <td class="graffa-sistema">
                ${this.toLatex(funzione)}
                
                ${this.toLatex(equazioniAssi[asse])}
            </td>`;

    funzione = new Funzione(funzione); // Interpretiamo la funzione in un oggetto

    if (asse == "y") {
      // Se devo fare l'intersezione con l'asse y
      const termineNoto = funzione.termineNoto();
      code += `<td class="spazio-sistema"></td>
<td class="graffa-sistema">
    ${this.toLatex("y = " + MathSolver.numeroRazionale(termineNoto))}
    ${this.toLatex(equazioniAssi[asse])}
</td>`;
      this.aggiungiPunto(0, termineNoto);
    } else {
      code += this.risolviEquazione(
        `${funzione.membri[1]}=0`,
        funzione.grado(),
        equazioniAssi[asse]
      ).code;
    }

    code += `
        </tr>
    </tbody>
<table>`;
    return code;
  };

  /**
   * Metodo che data una funzione dice se e' pari o dispari
   *
   * @method
   * @param {Funzione} funzione Funzione di cui calcolare se e' pari o ispari
   * @name Funzione#funzionePariODispari
   */
  this.funzionePariODispari = function (funzione) {
    let code = ``;

    const funzioneString = funzione.membri[1];

    // -f(x)
    let menoFDiX = new Funzione(`y=${funzioneString}`);
    // Moltiplico tutti i termini per -1
    menoFDiX.termini.forEach((termine) => {
      termine.coefficiente = termine.coefficiente * -1;
    });
    menoFDiX = menoFDiX.toString(false).replace("y=", "");

    // f(-x)
    let fDiMenoX = new Funzione(`y=${funzioneString}`);
    // Moltiplico per -1 tutti i termini dove l'esponente della parte letterale e' dispari
    fDiMenoX.termini
      .filter(
        (termine) =>
          termine.parteLetterale && termine.parteLetterale.esponente % 2 === 1
      )
      .forEach((termine) => {
        termine.coefficiente = termine.coefficiente * -1;
      });
    fDiMenoX = fDiMenoX.toString(false).replace("y=", "");

    let menoFDiXCalc = this.toLatex(`-f(x) = -(${funzioneString})`);
    menoFDiXCalc += this.toLatex(`-f(x) = ${menoFDiX}`);
    let fDiMenoXCalc = this.toLatex(
      `f(-x) = ${funzioneString.replace(/x/g, "(-x)")}`
    );
    fDiMenoXCalc += this.toLatex(`f(-x) = ${fDiMenoX}`);

    code += fDiMenoXCalc;
    code += `<hr>`;
    code += menoFDiXCalc;
    code += `<hr>`;

    const pari = fDiMenoX === funzioneString;
    const dispari = fDiMenoX === menoFDiX;

    if (pari) {
      code += this.toLatex(`\\text{La funzione è pari}`);
      code += this.toLatex(`\\text{f(-x)=f(x)}`);
      code += this.toLatex(`${fDiMenoX} = ${funzioneString}`);
    } else {
      code += this.toLatex(`\\text{La funzione non è pari}`);
      code += this.toLatex(`f(-x) \\neq f(x)`);
      code += this.toLatex(`${fDiMenoX} \\neq ${funzioneString}`);
    }

    if (dispari) {
      code += this.toLatex(`\\text{La funzione è dispari}`);
      code += this.toLatex(`\\text{f(-x)=-f(x)}`);
      code += this.toLatex(`${fDiMenoX} = ${menoFDiX}`);
    } else {
      code += this.toLatex(`\\text{La funzione non è dispari}`);
      code += this.toLatex(`f(-x) \\neq -f(x)`);
      code += this.toLatex(`${fDiMenoX} \\neq ${menoFDiX}`);
    }

    if (!pari && !dispari) {
      code += this.toLatex(`\\text{La funzione non è né pari né dispari}`);
    }

    return code;
  };

  /**
   * Metodo che converte un insieme da array a stringa in linguaggio latex
   *
   * @method
   * @param {Array<any>} insieme Insieme matematico da convertire in stringa
   * @returns
   */
  this.insiemeToString = function (insieme) {
    if (insieme.length == 0) {
      return `\\emptyset`;
    }

    return insieme
      .map((el) => {
        let intervallo = ``;

        if (Array.isArray(el)) {
          intervallo = el
            .filter((a) => a)
            .map((a) =>
              MathSolver.numeroRazionale(
                a
                  .toString()
                  .replace("-Infinity", "-\\infty")
                  .replace("Infinity", "+\\infty")
              )
            )
            .join(";");
        }

        return `(${intervallo})`;
      })
      .join("\\cup");
  };

  /**
   * Metodo che risolve le disequazioni
   *
   * @method
   * @param {Array<string>} disequazioni Disequazioni da risolvere
   * @param {string} segnoPositivo Segno da utilizzare quando il valore e' positivo alla fine
   * @param {string} segnoNegativo Segno da utilizzare quando il valore e' negativo alla fine
   * @returns
   */
  this.risolviDisequazioni = function (
    disequazioni,
    segnoPositivo = "+",
    segnoNegativo = "-"
  ) {
    let insiemePositivo = [];
    let insiemeNegativo = [];
    let insiemiInOrdine = [];
    let code = ``;

    // Prendo i numeri presenti nelle disequazioni
    let numeriDisequazioni = [];

    disequazioni
      .filter((d) => d.includes("x"))
      .forEach((d) => {
        // Separo per il simbolo maggiore o minore per ogni disequazione
        d.split(/&&|OR/)
          .map((dd) => dd.replace(/\s/g, ""))
          .forEach((dd) => {
            const split = dd.split(/>|</);

            // Prendo solamente il numero utilizzato
            // Che sara' sempre il secondo elemento dell'array
            numeriDisequazioni.push(split[1]);
          });
      });

    numeriDisequazioni.sort((a, b) => a - b);

    // Costruisco una tabella
    code += `<div class="table-responsive">
          <table class="table tabella-disequazione">
            <thead>
              <tr class="d-flex">
              <th scope="col" class="th-lg"></th>
              ${numeriDisequazioni
                .filter((n) => n)
                .map(
                  (n) =>
                    '<th scope="col" class="th-lg th-numero">' +
                    this.toLatex(MathSolver.numeroRazionale(n)) +
                    "</th>"
                )
                .join("")}
              <th scope="col" class="th-lg"></th>
              </tr>
            </thead>
            <tbody>`;

    const cellaRiga = (
      cella,
      borderLeft = true,
      circle = false,
      mostraSegno = true,
      borderBottom = true
    ) => {
      const segno = cella
        ? circle
          ? segnoPositivo
          : "+"
        : circle
        ? segnoNegativo
        : "-";

      code += `               <td`;

      if (!circle && borderBottom) {
        code += ` style="border-bottom: 2px ${
          cella ? "solid" : "dotted"
        } #000;"`;
      }

      if (borderLeft) {
        code += ` class="td-border-left"`;
      }

      // ${!cella ? 'background-color: #f2f2f2 !important;' : ''}

      code += `>${
        circle
          ? '<span class="circle circle-' +
            (cella ? "positive" : "negative") +
            '">'
          : ""
      }${mostraSegno ? (circle ? segno : this.toLatex(segno)) : ""}${
        circle ? "</span>" : ""
      }</td>`;
    };

    numeriDisequazioni = [Number.NEGATIVE_INFINITY, ...numeriDisequazioni];

    // Righe della tabella, col + e il - per ogni riga
    // Validando la disequazione presente
    const righe = [];

    disequazioni
      .filter((d) => d.includes("x"))
      .forEach((condition) => {
        // Aggiungo le condizioni per ogni numero
        righe.push(
          numeriDisequazioni.map((n) => {
            let newCondition = condition
              .replace(/x/g, `${n}`)
              .replace(/OR/g, ` || `);

            if (newCondition.includes(">")) {
              newCondition = `${newCondition} || ${newCondition.replace(
                ">",
                "==="
              )}`;
            }

            return eval(newCondition);
          })
        );
      });

    // Aggiungo le righe per ogni disequazione senza incognita
    disequazioni
      .filter((d) => !d.includes("x"))
      .forEach((d) => {
        let value;

        if (d === "ALL_VALUES") {
          value = true;
        } else if (d === "NO_VALUES") {
          value = false;
        } else {
          value = eval(d);
        }

        righe.push(numeriDisequazioni.map((_) => value));
      });

    righe.forEach((riga) => {
      code += `             <tr class="d-flex">`;

      riga.forEach((a, i) => cellaRiga(a, i > 0));

      code += `             </tr>`;
    });

    code += `<tr class="d-flex"></tr>`;

    // Costruisco l'ultima riga effettuando le operazioni per ogni colonna
    const ultimaRiga = [];

    // Per ogni colonna
    for (let i = 0; i < numeriDisequazioni.length; i++) {
      // Effettuo le operazioni
      let res = 1;

      // Per ogni cella presente in quella colonna
      for (let j = 0; j < righe.length; j++) {
        res = res * (righe[j][i] ? 1 : -1);
      }

      ultimaRiga.push(res > 0);
    }

    code += `             <tr class="d-flex">`;
    ultimaRiga.forEach((a) => cellaRiga(a, false, true));
    // cellaRiga(ultimaRiga[ultimaRiga.length - 1], false, false, false, false);
    code += `             </tr>`;

    code += `            </tbody>
    </table></div>`;

    // Dall'ultima riga (ovvero quella dei risultati)
    // costruisco l'insieme positivo e l'insieme negativo

    // Se sono tutti positivi

    // if (ultimaRiga.filter((r) => r).length === ultimaRiga.length) {
    //   insiemePositivo.push([Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]);
    //   insiemiInOrdine = [{ positive: insiemePositivo }];
    // } else if (ultimaRiga.filter((r) => !r).length === ultimaRiga.length) {
    //   insiemeNegativo.push([Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]);
    //   insiemiInOrdine = [{ negative: insiemeNegativo }];
    // } else {
      let lastIsPositivo;
      let lastIsNegativo;

      for (let i = 0; i < ultimaRiga.length; i++) {
        const res = ultimaRiga[i];

        const numero = numeriDisequazioni[i];
        const numeroSuccessivo = ![null, undefined].includes(
          numeriDisequazioni[i + 1]
        )
          ? numeriDisequazioni[i + 1]
          : Number.POSITIVE_INFINITY;

        // Se è +
        if (res) {
          if (lastIsPositivo) {
            // Altrimenti
            // Se il numero precedente era positivo
            // vado a cambiare il valore finale dell'ultimo intervallo
            insiemePositivo[insiemePositivo.length - 1][1] = numero;
            insiemiInOrdine[insiemiInOrdine.length - 1].positive[1] = numero;
          } else {
            // Altrimenti l'intervallo è dal numero precedente al numero successivo
            insiemePositivo.push([numero, numeroSuccessivo]);
            insiemiInOrdine.push({ positive: [numero, numeroSuccessivo] });
          }

          // Mi memorizzo che l'ultimo è positivo
          lastIsPositivo = true;
          lastIsNegativo = false;
        } else {
          if (lastIsNegativo) {
            // Altrimenti
            // Se il numero precedente era positivo
            // vado a cambiare il valore finale dell'ultimo intervallo
            insiemeNegativo[insiemeNegativo.length - 1][1] = numero;
            insiemiInOrdine[insiemiInOrdine.length - 1].negative[1] = numero;
          } else {
            // Altrimenti l'intervallo è dal numero precedente al numero successivo
            insiemeNegativo.push([numero, numeroSuccessivo]);
            insiemiInOrdine.push({ negative: [numero, numeroSuccessivo] });
          }

          // Mi memorizzo che l'ultimo + negativo
          lastIsPositivo = false;
          lastIsNegativo = true;
        }
      }
    // }

    insiemePositivo = insiemePositivo.filter(el => el.length > 0);
    insiemeNegativo = insiemeNegativo.filter(el => el.length > 0);
    insiemiInOrdine = insiemiInOrdine.filter(el => (el.positive || el.negative).length > 0);

    return { code, insiemePositivo, insiemeNegativo, insiemiInOrdine };
  };

  /**
   * Metodo che pone una funzione maggiore di zero e risolve la disequazione
   *
   * @method
   * @param {Funzione} funzione Funzione da porre maggiore di zero
   * @param {string} segnoPositivo Segno da utilizzare quando il valore e' positivo alla fine
   * @param {string} segnoNegativo Segno da utilizzare quando il valore e' negativo alla fine
   * @returns
   */
  this.funzioneMaggioreDiZero = function (
    funzione,
    segnoPositivo = "+",
    segnoNegativo = "-"
  ) {
    let code = this.toLatex(`${funzione.membri[1]} > 0`);

    // Effettuo la scomposizione portando tutte le parti massimo fino al primo grado

    let partiTemp = [];

    if (funzione.grado() > 1) {
      const scomp = this.scomponi(new Funzione(`${funzione.membri[1]}=0`));
      partiTemp = scomp.equazione;
    }

    let parti = [];

    partiTemp.forEach((parte) => {
      const func = new Funzione(`${parte}=0`);
      if (func.grado() == 2) {
        this.scomponi(func).equazione.forEach((p) => {
          parti.push(p);
        });
      } else {
        parti.push(parte);
      }
    });

    let equazioneScomposta;

    if (parti.length === 0) {
      if (funzione.grado() > 2) {
        return {
          insiemePositivo: [],
          insiemeNegativo: [],
          insiemiInOrdine: [],
          code: this.toLatex(`\\text{Impossibile scomporre l'espressione}`),
        };
      } else {
        parti = [`${funzione.membri[1]}`];
        equazioneScomposta = `${funzione.membri[1]}`;
      }
    } else {
      equazioneScomposta = parti.map((e) => `(${e})`).join("");
      code += this.toLatex(`${equazioneScomposta} > 0`);
    }

    code += `<hr>`;

    let disequazioni = [];

    parti.forEach((parte) => {
      if (parti.length > 1) {
        code += this.toLatex(`${parte}>0`);
      }

      const func = new Funzione(`y=${parte}`);
      func.ordina();

      const grado = func.grado();

      if (grado === 0) {
        // Se la funzione non ha la x
        const disequazione = `${parte}>0`;
        disequazioni.push(disequazione);

        code += this.toLatex(`${MathSolver.numeroRazionale(parte)}>0`);

        code += `<hr>`;
      }else if (grado === 1) {
        // Se la funzione è di primo grado
        // Risolvo la disequazione solamente spostando dal primo al secondo membro
        const secondoMembro =
          (func.termineNoto() * -1) / func.termini[0].coefficiente;
        const disequazione = `x>${secondoMembro}`;
        disequazioni.push(disequazione);

        code += this.toLatex(`x>${MathSolver.numeroRazionale(secondoMembro)}`);

        code += `<hr>`;
      } else if (grado === 2) {
        // Se la funzione è di secondo grado
        // La scrivo sotto forma di equazione
        const equazione = `${parte}=0`;

        code += this.toLatex(equazione);

        const soluzioneEquazione = this.risolviEquazione(
          equazione,
          null,
          "y=0",
          false,
          false,
          false
        );
        const {
          risultati,
          a,
          b,
          delta,
          code: codeEquazione,
        } = soluzioneEquazione;

        code += `<hr>`;
        code += codeEquazione;
        code += this.toLatex(`\\Delta = ${MathSolver.numeroRazionale(delta)}`);
        code += `<hr>`;
        code += this.toLatex(`a ${a > 0 ? ">" : "<"} 0`);
        code += this.toLatex(`\\Delta ${delta > 0 ? ">" : "<"} 0`);
        code += this.toLatex(`dis > 0`);
        code += `<hr>`;

        // Adesso risolvo la disequazione di secondo grado in base ai dati
        if (a > 0) {
          if (delta > 0) {
            disequazioni.push(`x<` + risultati[0] + ` OR x>${risultati[1]}`);

            code += this.toLatex(
              `x<` +
                MathSolver.numeroRazionale(risultati[0]) +
                ` \\bigvee x>${MathSolver.numeroRazionale(risultati[1])}`
            );
          } else if (delta === 0) {
            disequazioni.push("ALL_VALUES");

            code += this.toLatex(
              `x \\neq ${MathSolver.numeroRazionale(((b * -1) / 2) * a)}`
            );
          } else if (delta < 0) {
            disequazioni.push("ALL_VALUES");

            code += this.toLatex(`\\forall x \\in \\bbR`);
          }
        } else {
          if (delta > 0) {
            disequazioni.push(`x>${risultati[0]} OR x<` + risultati[1]);

            code += this.toLatex(
              `${MathSolver.numeroRazionale(risultati[0])}<x \\bigvee x<` +
                MathSolver.numeroRazionale(risultati[1])
            );
          } else if (delta <= 0) {
            disequazioni.push("NO_VALUES");

            code += this.toLatex(`\\nexists x \\in \\bbR`);
          }
        }

        code += `<hr>`;
      }
    });

    if (disequazioni.length === 0) {
      return {
        insiemePositivo: [],
        insiemeNegativo: [],
        insiemiInOrdine: [],
        code: this.toLatex(`\\text{Impossibile risolvere la disequazione}`),
      };
    }

    let {
      insiemePositivo,
      insiemeNegativo,
      insiemiInOrdine,
      code: codeTabella,
    } = this.risolviDisequazioni(disequazioni, segnoPositivo, segnoNegativo);

    code += codeTabella;

    return { insiemePositivo, insiemeNegativo, insiemiInOrdine, code };
  };

  /**
   * Metodo che trova gli insiemi positivi e gli insiemi negativi di una funzione
   *
   * @method
   * @param {Funzione} funzione Funzione di cui calcolare gli insiemi positivi e negativi
   * @name Funzione#positivitaENegativita
   */
  this.positivitaENegativita = function (funzione) {
    let { insiemePositivo, insiemeNegativo, code } =
      this.funzioneMaggioreDiZero(funzione);

    funzione.insiemePositivo = insiemePositivo;
    funzione.insiemeNegativo = insiemeNegativo;

    code += `<br>`;
    code += this.toLatex(`I.P.=${this.insiemeToString(insiemePositivo)}`);
    code += this.toLatex(`I.N.=${this.insiemeToString(insiemeNegativo)}`);

    return code;
  };

  /**
   * Metodo che trova gli insiemi di crescenza e decrescenza di una funzione
   *
   * @method
   * @param {Funzione} funzione Funzione di cui calcolare gli insiemi di crescenza e decrescenza di una funzione
   * @name Funzione#crescenzaEDecrescenza
   */
  this.crescenzaEDecrescenza = function (funzione) {
    const derivata = funzione.derivata();

    let code = ``;

    code += this.toLatex(`f^{\\prime}(x)=${derivata.membri[1]}`);

    let {
      insiemePositivo,
      insiemeNegativo,
      insiemiInOrdine,
      code: codeFunc,
    } = this.funzioneMaggioreDiZero(derivata, "⬈", "⬊");

    code += codeFunc;
    code += `<br>`;

    // Controllo tutti gli intervalli per capire dov'e' crescente e dove decrescente
    // Prendo quelle dei punti massimi
    // Prendo tutti gli intervalli positivi che sono seguiti da un intervallo negativo
    let ascissePuntiMassimi = insiemiInOrdine
      .filter(
        (el, i) =>
          el.positive &&
          insiemiInOrdine[i + 1] &&
          insiemiInOrdine[i + 1].negative
      )
      .map((el) => el.positive[1])
      .filter((el) => el);
    ascissePuntiMassimi = [...new Set(ascissePuntiMassimi)];

    // E quelle dei punti minimi
    // Prendo tutti gli intervalli negativi che sono seguiti da un intervallo positivo
    let ascissePuntiMinimi = insiemiInOrdine
      .filter(
        (el, i) =>
          el.negative &&
          insiemiInOrdine[i + 1] &&
          insiemiInOrdine[i + 1].positive
      )
      .map((el) => el.negative[1])
      .filter((el) => el);
    ascissePuntiMinimi = [...new Set(ascissePuntiMinimi)];

    console.log("ascissePuntiMinimi", ascissePuntiMinimi);
    console.log("ascissePuntiMassimi", ascissePuntiMassimi);

    if (insiemePositivo.length > 0) {
      code += this.toLatex(
        `\\text{La funzione è crescente in } ${this.insiemeToString(
          insiemePositivo
        )}`
      );
    }

    const puntiMassimi = ascissePuntiMassimi.map((x) =>
      this.aggiungiPunto(x, math.parse(funzione.membri[1]).evaluate({ x }))
    );

    if (puntiMassimi.length > 0) {
      code += this.toLatex(`\\text{La funzione ha punti di massimo in: }`);
      code += puntiMassimi
        .map((p) =>
          this.toLatex(
            `${p.nome}(${MathSolver.numeroRazionale(
              p.x
            )};${MathSolver.numeroRazionale(p.y)})`
          )
        )
        .join(" , ");
    }

    if (insiemeNegativo.length > 0) {
      code += this.toLatex(
        `\\text{La funzione è decrescente in } ${this.insiemeToString(
          insiemeNegativo
        )}`
      );
    }

    const puntiMinimi = ascissePuntiMinimi.map((x) =>
      this.aggiungiPunto(x, math.parse(funzione.membri[1]).evaluate({ x }))
    );

    if (puntiMinimi.length > 0) {
      code += this.toLatex(`\\text{La funzione ha punti di minimo in: }`);
      code += puntiMinimi
        .map((p) =>
          this.toLatex(
            `${p.nome}(${MathSolver.numeroRazionale(
              p.x
            )};${MathSolver.numeroRazionale(p.y)})`
          )
        )
        .join(" , ");
    }

    return code;
  };

  /**
   * Metodo che trova la concavita di una funzione
   *
   * @method
   * @param {Funzione} funzione Funzione di cui trovare la concavita'
   * @name Funzione#concavitaFunzione
   */
  this.concavitaFunzione = function (funzione) {
    const derivata = funzione.derivata(2);

    let code = ``;

    code += this.toLatex(`f^{\\prime\\prime}(x)=${derivata.membri[1]}`);

    let {
      insiemePositivo,
      insiemeNegativo,
      code: codeFunc,
    } = this.funzioneMaggioreDiZero(derivata, "⬈", "⬊");

    code += codeFunc;
    code += `<br>`;

    if (insiemePositivo.length > 0) {
      code += this.toLatex(
        `\\text{La funzione ha la concavità rivolta verso l'alto (è convessa) in } ${this.insiemeToString(
          insiemePositivo
        )}`
      );
    }

    if (insiemeNegativo.length > 0) {
      code += this.toLatex(
        `\\text{La funzione ha la concavità rivolta verso il basso (è concava) in } ${this.insiemeToString(
          insiemeNegativo
        )}`
      );
    }

    return code;
  };
  /**
   * Metodo che calcola l'area di una funzione in un'intervallo
   *
   * @method
   * @param {Funzione} funzione Funzione di cui calcolare l'area
   * @param {Array<Punto>} punti Punti dell'intervallo
   */
  this.areaFunzione = function (funzione, punti) {
    if (punti.length < 2) {
      return this.toLatex(`\\text{Impossibile trovare l'area!}`);
    }

    punti.sort((a, b) => a.x - b.x);

    const secondoMembroFunzione = funzione.membri[1];
    const primitiva = funzione.primitiva();
    const funzionePrimitiva = primitiva.func;

    const ascisse = [...new Set(punti.map((p) => p.x))];
    const primitiveCalcolate = {};
    let primitiveCalcolateCode = ``;

    ascisse.forEach((ascissa) => {
      const primitivaDaParsare = funzionePrimitiva
        .toString(false)
        .replace("y=", "");

      const primitivaCalcolata = math.parse(primitivaDaParsare).evaluate({
        x: ascissa,
      });

      primitiveCalcolate[ascissa] = primitivaCalcolata;

      const ascissaRazionale = MathSolver.numeroRazionale(ascissa);
      primitiveCalcolateCode += this.toLatex(
        `F(${ascissaRazionale})=${funzionePrimitiva
          .toString(true)
          .replace(/x/g, `(${ascissaRazionale})`)}=${MathSolver.numeroRazionale(
          primitivaCalcolata
        )}`
      );
    });

    let soluzioniIntegrali = ``;
    let soluzioneFinale = 0;

    const integrali = punti
      .filter((_, i) => i !== punti.length - 1)
      .map((p, i) => {
        const a = p.x;
        const b = punti[i + 1].x;
        const aRazionale = MathSolver.numeroRazionale(a);
        const bRazionale = MathSolver.numeroRazionale(b);

        const Fb = primitiveCalcolate[b];
        const Fa = primitiveCalcolate[a];
        const res = Fb - Fa;
        const abs = Math.abs(res);

        soluzioniIntegrali +=
          this.toLatex(
            `\\int_{${aRazionale}}^{${bRazionale}} f(x) dx = F(${bRazionale}) - F(${aRazionale}) = ${
              res < 0 ? "\\lvert" : ""
            }${MathSolver.numeroRazionale(Fb)} - ${MathSolver.numeroRazionale(
              Fa
            )}${res < 0 ? "\\rvert" : ""} = ${MathSolver.numeroRazionale(abs)}`
          ) + "\n";

        const code = `\\int_{${aRazionale}}^{${bRazionale}} f(x) dx`;
        soluzioneFinale += abs;

        return {
          code,
          res: abs,
        };
      });

    const ultimoPassaggio = integrali
      .map((i) => {
        const res = MathSolver.numeroRazionale(i.res);

        if (res[0] === "-") {
          return `(${res})`;
        }

        return res;
      })
      .join(" + ");

    let code = ``;

    // Scrivo la funzione
    code += this.toLatex(`f(x)=${secondoMembroFunzione}`);
    // Poi scrivo la primitiva con tutti i passaggi per trovarla
    code += primitiva.passaggi.map((p) => this.toLatex(p, true)).join("\n");

    // Adesso calcolo la primitiva per ogni ascissa
    code += primitiveCalcolateCode;
    code += soluzioniIntegrali;

    code += `<hr>`;
    code += this.toLatex(
      `Area = \\int_{${MathSolver.numeroRazionale(
        punti[0].x
      )}}^{${MathSolver.numeroRazionale(punti[punti.length - 1].x)}} f(x) dx`
    );
    code += this.toLatex(`Area = ` + integrali.map((i) => i.code).join(" + "));
    code += this.toLatex(`Area = ` + ultimoPassaggio);
    code += this.toLatex(
      `\\textbf{Area = } \\mathbf{${MathSolver.numeroRazionale(
        soluzioneFinale
      )}}`
    );

    return code;
  };
}

/**
 * Divide l'espressione in ogni termine di cui è composta in base a dei caratteri delimitanti
 *
 * @param {string} espressione
 * @param {Array.<string>} caratteri Caratteri delimitanti
 * @name MathSolver#splittaEspressione
 * @static
 */
MathSolver.splittaEspressione = function (espressione, caratteri) {
  let split = [];
  let stringa = "";

  for (let i = 0; i < espressione.length; i++) {
    // leggo ogni carattere dell'espressione
    const carattere = espressione[i];

    if (!caratteri.includes(espressione[i]) || i == 0) {
      // Se non è un carattere da splittare e non è il primo carattere dell'espressione
      stringa += espressione[i];
    } else {
      split.push(stringa); // Aggiungiamo la stringa nell'array
      stringa = `${carattere}`; // Svuotiamo la stringa
    }

    if (i == espressione.length - 1) {
      // Se sono all'ultimo carattere e non ho trovato nulla da splittare
      split.push(stringa); // Aggiungiamo la stringa nell'array
    }
  }

  return split;
};

MathSolver.numeroInFrazione = function (value) {
  const gcd = function (a, b) {
    if (b < 0.0000001) return a;

    return gcd(b, Math.floor(a % b));
  };

  const fraction = Math.abs(parseFloat(parseFloat(value).toFixed(2)));
  const len = fraction.toString().length - 2;

  let denominator = Math.pow(10, len);
  let numerator = fraction * denominator;

  const divisor = gcd(numerator, denominator);

  numerator /= divisor;
  denominator /= divisor;

  return { n: numerator, d: denominator };
};

/**
 * Metodo che ritorna il numero sotto forma di frazione.
 * Al momento questa funzione non fa nulla per continuare il corretto funzionamento del programma in quanto ci sono degli errori
 *
 * @method
 * @name MathSolver#numeroRazionale
 * @param {number} value Numero da controllare
 * @returns {*} Numero sotto forma di frazione
 * @static
 */
MathSolver.numeroRazionale = function (value) {
  if (value == undefined) {
    return "1";
  }

  if (
    value.toString().includes("Infinity") ||
    Number.isNaN(parseFloat(value))
  ) {
    return value;
  }

  const numeroConDueDecimali = parseFloat(value.toString())
    .toFixed(2)
    .replace(".00", "");

  const frazione = MathSolver.numeroInFrazione(value);

  if (frazione.d === 1) {
    return numeroConDueDecimali;
  }

  const numeratore = frazione.n.toString();
  const denominatore = frazione.d.toString();

  // Se il denominatore o il numeratore sono troppo grandi ritorno il numero con due decimali
  const maxLarge = 2;
  if (numeratore.length > maxLarge || denominatore.length > maxLarge) {
    return numeroConDueDecimali;
  }

  const simbolo = value < 0 ? "-" : "";
  return `${simbolo}\\frac{${numeratore}} {${denominatore}}`;
};

export { MathSolver };

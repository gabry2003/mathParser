import { Polinomio } from "./termine";
import { Funzione } from "./funzione";
import { membroString } from "./functions";
import { Punto } from "./punto";

/**
 * Risultato di una scomposizione
 */
export interface RisultatoScomposizione {
  /**
   * Equazione scomposta, come array di stringhe
   */
  equazione?: string[];
  /**
   * Codice HTML da inserire dentro un elemento per visualizzare i passaggi della scomposizione
   */
  scomposizione: string;
}

/**
 * Soluzione di un equazione
 */
export interface SoluzioneEquazione {
  /**
   * Codice HTML
   */
  code: string;
  /**
   * risultati dell'equazione
   */
  risultati: number[];
  /**
   * Equazione scomposta, come stringa
   */
  equazioneScomposta?: string;
}

/**
 * Opzioni per l'inizializzazione di un oggetto di tipo MathSolver.
 * Prende tutte le opzioni necessarie per disegnare le funzioni ecc...
 */
export interface MathSolverOptions {
  /**
   * Opzioni del grafico
   */
  grafico: {
    /**
     * Elemento del frame dove viene visualizzato il grafico
     */
    elemento: HTMLIFrameElement;
    /**
     * Pagina html dove viene visualizzato il grafico, da inserire all'interno del frame
     */
    pagina: string;
    /**
     * Se aggiungere i punti nel grafico o no
     */
    punti: boolean;
    /**
     * Se visualizzare anche gli asintoti nel grafico
     */
    asintoti: boolean;
    /**
     * Se visualizzare anche la direttrice nel grafico (solamente nella parabola)
     */
    direttrice: boolean;
    /**
     * Se visualizzare anche l'asse nel grafico (solamente nella parabola)
     */
    asse: boolean;
    /**
     * Se visualizzare anche il vertice nel grafico (solamente nella parabola)
     */
    vertice: boolean;
    /**
     * Se visualizzare anche il fuoco nel grafico (solamente nella parabola)
     */
    fuoco: boolean;
  };
  /**
   * Elementi dove inserire i valori
   */
  elementi: {
    /**
     * Lista non ordinata dove inserire i punti
     */
    listaPunti: string;
    /**
     * Elemento dove vengono visualizzati i passaggi della scomposizione    (es. '#scomposizione')
     */
    passaggiScomposizione: string;
    /**
     * Elemento dove vengono visualizzata la risoluzione di equazioni per risolverne una di grado maggiore   (es. '#equazioni-risolte')
     */
    equazioniRisolte: string;
    /**
     * Elemento dove viene visualizzato il risultato
     */
    risultato: string;
  };
}

/**
 * Libreria che permette di eseguire diverse operazioni matematiche, come la risoluzione di equazioni e l'intersezione con gli assi
 */
export interface IMathSolver {
  /**
   * Lettera attualemente scelta e stampata a schermo
   */
  letteraAttuale: string;
  /**
   * Elenco completo dei punti visualizzati sullo schermo
   */
  puntiAttivi: Punto[];
}

export class MathSolver implements IMathSolver {
  letteraAttuale: string;
  puntiAttivi: Punto[] = [];

  constructor(public options: MathSolverOptions) {}

  /**
   * Metodo che aggiunge un punto nello schermo
   *
   * @param x Funzioni da disegnare a schermo
   * @param y Eventuali punti da aggiungere al grafico
   * @param nome Nome del punto
   */
  aggiungiPunto(x: number, y: number, nome?: string) {
    if (
      this.puntiAttivi.filter((punto) => punto.x == x && punto.y == y).length ==
      0
    ) {
      // Se questo punto non esiste già
      // Lo aggiungo
      this.puntiAttivi.push({
        x: x,
        y: y,
      });

      // Prendo la lettera successiva per dare il nome al punto
      const nomePunto = this.letteraAttuale
        ? String.fromCharCode(
            this.letteraAttuale.charCodeAt(this.letteraAttuale.length - 1) + 1
          )
        : "A";
      this.letteraAttuale = nomePunto;
      let code = `${
        document.querySelector(this.options.elementi.listaPunti).innerHTML
      }<li style="list-style-type: none;">`;
      code += this.toLatex(
        `${nomePunto}(${MathSolver.numeroRazionale(
          x
        )}, ${MathSolver.numeroRazionale(y)})`
      );
      code += `</li>`;
      document.querySelector(this.options.elementi.listaPunti).innerHTML = code;
    }
  }

  /**
   * Metodo che svuota la lista dei punti aggiunti
   */
  pulisciPunti() {
    document.querySelector(this.options.elementi.listaPunti).innerHTML = "";
    this.letteraAttuale = null;
    this.puntiAttivi.length = 0;
  }

  /**
   * Metodo che nasconde il risultato dallo schermo
   */
  togliRisultato() {
    (
      document.querySelector(this.options.elementi.risultato) as HTMLElement
    ).style.display = "none";
    (
      document.querySelector(
        this.options.elementi.passaggiScomposizione
      ) as HTMLElement
    ).style.display = "none";
    (
      document.querySelector(
        this.options.elementi.equazioniRisolte
      ) as HTMLElement
    ).style.display = "none";
    document.querySelector(
      this.options.elementi.passaggiScomposizione
    ).innerHTML = "";
    document.querySelector(this.options.elementi.equazioniRisolte).innerHTML =
      "";
    this.pulisciPunti();
  }

  /**
   * Metodo che mostra il risultato nello schermo
   */
  mostraRisultato() {
    (
      document.querySelector(this.options.elementi.risultato) as HTMLElement
    ).style.display = "block";
  }

  /**
   * Questo metodo permette di disegnare una funzione in un grafico richiamando una pagina impostata nelle opzioni di MathSolver.
   * Prende come parametro solamente la funzione da visualizzare oppure un array di funzioni
   *
   * @param funzioni Funzioni da disegnare a schermo
   * @param punti Eventuali punti da aggiungere al grafico
   */
  disegnaFunzione(funzioni: string | string[], punti?: Punto[]) {
    try {
      if (typeof funzioni == "string") {
        // Se è stata passata una sola stringa
        funzioni = [funzioni]; // Lo trasformo in array
      }

      let url: URL | string = new URL(
        this.options.grafico.pagina,
        `https://prova.it/`
      );
      url.searchParams.append("funzioni", JSON.stringify(funzioni)); // Aggiungo le funzioni
      // Se devo aggiungere i punti
      if (this.options.grafico.punti && punti) {
        url.searchParams.append("punti", JSON.stringify(punti)); // Aggiungo i punti
      }
      url = url.toString().replace("https://prova.it/", "");

      console.log("url", url);
      this.options.grafico.elemento.src = url; // Carico il grafico nella pagina
    } catch (err) {
      console.error(err);
    }
  }

  /**
   * Il codice Latex per essere interpretato correttamente dalla libreria MathJax deve trovarsi in mezzo ai caratteri di apertura e di chiusura.
   * Per risolvere questo problema è stato creato questo metodo
   *
   * @param codice Codice Latex
   * @param add Se aggiungere le stringhe iniziali e finali
   *
   * @returns Stringa di codice in Latex
   */
  toLatex(codice: string | number, add = true): string {
    let risultato = codice.toString();
    if (add) {
      risultato = `\\[${codice}\\]`;
    }
    return risultato;
  }

  /**
   * Se il numero passato come argomento è negativo lo mette tra parentesti, altrimenti lo lascia com'è
   *
   * @param numero Numero da controllare
   *
   * @returns Numero come stringa e tra parentesi se negativo
   */
  controllaParentesi(numero: number | string): string {
    numero = MathSolver.numeroRazionale(numero);

    if (parseInt(numero.toString()) < 0) return `(${numero})`;

    return numero.toString();
  }

  /**
   * Questo metodo ritorna tutti i divisori di un numero, utile per la scomposizione con Ruffini
   *
   * @param n Numero di cui trovare i divisori
   * @param negativi Prendere anche valori negativi
   */
  trovaDivisori(n: number, negativi = true): number[] {
    n = Math.abs(n); // Faccio il valore assoluto del numero

    let divisori: number[] = [];

    for (let i = 1; i <= parseInt(Math.sqrt(n).toString()); i++) {
      if (n % i == 0) {
        if (parseInt((n / i).toString()) == i) {
          divisori.push(i);
        } else {
          divisori.push(i);
          divisori.push(parseInt((n / i).toString()));
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
  }

  /**
   * Metodo che controlla se un numero è uno zero del polinomio (ovvero che annulla la funzione)
   *
   * @param numero Numero da controllare
   * @param polinomio Polinomio
   */
  isZeroPolinomio(numero: number, polinomio: string | Polinomio): boolean {
    polinomio =
      typeof polinomio !== "string" ? membroString(polinomio) : polinomio;

    console.log(`isZeroPolinomio`, numero, polinomio);

    const evaluate = math.parse(polinomio).evaluate({
      x: numero,
    });
    return evaluate == 0;
  }

  /**
   * Questo metodo scompone un'equazione utilizzando il metodo di Ruffini.
   * Oltre a tornare il risultato visualizza a schermo i passaggi negli elementi passati nelle opzioni
   *
   * @param funzione Funzione da scomporre con ruffini
   * @returns risultato della scomposizione
   */
  scomponiConRuffini(funzione: Funzione): RisultatoScomposizione {
    let equazioneScomposta: string[] = [];
    let scomposizione = ``;

    funzione.ordina(); // Ordino la funzione in modo decrescente in base all'esponente della parte letterale
    const polinomio = funzione.membri[0];
    const termineNoto = funzione.termineNoto;

    let zeroPolinomio;
    let divisoriTermineNoto: number[] = [];
    let divisoriICoefficiente: number[] = [];
    let probabiliZero = [termineNoto];

    if (termineNoto !== 0) {
      // Se c'è il termine noto
      // Cerco i divisori del termine noto
      divisoriTermineNoto = this.trovaDivisori(funzione.termineNoto);
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
    probabiliZero = probabiliZero.concat(funzione.membri[0][0].coefficiente);
    // Aggiungo i divisori del I coefficiente
    divisoriICoefficiente = this.trovaDivisori(
      funzione.membri[0][0].coefficiente,
      false
    );
    probabiliZero = probabiliZero.concat(divisoriICoefficiente);
    // Aggiungo i rapporti tra i divisori del termine noto e i divisori del I coefficiente
    // Per ogni divisore del termine noto
    for (let divisore in divisoriTermineNoto) {
      // Per ogni divisore del primo coefficiente
      for (let divisore2 in divisoriICoefficiente) {
        probabiliZero.push(parseFloat(divisore) / parseFloat(divisore2));
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

      let risultato = funzione.membri[0][0].coefficiente * zeroPolinomio; // Moltiplico il primo coefficiente per lo zero del polinomio
      for (let i = 1; i < funzione.membri[0].length; i++) {
        // A partire dal secondo termine
        moltiplicazioni += `<td>${this.toLatex(risultato)}</td>`;
        risultato = funzione.membri[0][i].coefficiente + risultato;
        risultati.push(risultato);
        somme += `<td>${this.toLatex(risultato)}</td>`;
        risultato = risultato * zeroPolinomio;
      }

      let griglia = `<table class="table tabella-ruffini text-white">
    <tbody>
    <tr>
        <td></td>`;

      for (let i = 0; i < funzione.membri[0].length; i++) {
        griglia += `<td>${this.toLatex(
          funzione.membri[0][i].coefficiente
        )}</td>`;
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
            <td>${this.toLatex(funzione.membri[0][0].coefficiente)}</td>
            ${somme}`;
      griglia += `
        </tr>
    </tbody>
</table>`;

      // Dopo aver fatto la griglia ci creiamo più equazioni
      risultati = [funzione.membri[0][0].coefficiente].concat(risultati);
      let exp = funzione.grado - 1;
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
    }

    return {
      equazione: equazioneScomposta,
      scomposizione: scomposizione,
    };
  }

  /**
   * Questo metodo scompone un'equazione trovando il metodo migliore per scomporla
   *
   * @param funzione Funzione da scomporre
   */
  scomponi(funzione: Funzione): RisultatoScomposizione {
    // Prima di utilizzare la scomposizione con Ruffini provo con altri metodi di scomposizione
    // TODO: da sviluppare

    // Se devo scomporre con Ruffini
    return this.scomponiConRuffini(funzione);
  }

  /**
   * Questo metodo risolve le equazioni di grado superiore al 2, è stato scritto per dividere la risoluzione di equazioni semplici da queste
   *
   * @param equazione Equazione da risolvere
   * @param grado Grado dell'equazione da risolvere
   * @param asse Asse con cui è stata effettuata l'intersezione
   * @param sistema Se risolvere e basta o fare il sistema
   * @param pulisci Se pulire i div
   */
  risolviEquazioneGradiMaggiori(
    equazione: string,
    grado: number,
    asse: string,
    sistema = true,
    pulisci = true
  ): SoluzioneEquazione {
    let risultati = [];

    if (pulisci) {
      document.querySelector(
        this.options.elementi.passaggiScomposizione
      ).innerHTML = "";
      document.querySelector(this.options.elementi.equazioniRisolte).innerHTML =
        "";
    }

    const scomposta = this.scomponi(new Funzione(equazione));
    // Se l'equazione è scomponibile stampo a schermo la scomposizione
    if (scomposta.scomposizione !== "") {
      document.querySelector(
        this.options.elementi.passaggiScomposizione
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
          this.options.elementi.equazioniRisolte
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
      (
        document.querySelector(
          this.options.elementi.passaggiScomposizione
        ) as HTMLElement
      ).style.display = "block";
      (
        document.querySelector(
          this.options.elementi.equazioniRisolte
        ) as HTMLElement
      ).style.display = "flex";

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
  }

  /**
   * Risolve un'equazione di qualunque grado.
   * Quando un'equazione è di grado superiore al secondo chiama un'altra funzione che la risolve in un altro modo
   *
   * @parame quazione Equazione da risolvere
   * @param grado Grado dell'equazione
   * @param asse Asse con cui è stata fatta l'intersezione
   * @param sistema Se risolvere e basta o fare il sistema
   * @param pulisci Se pulire i div
   * @returns Risultati dell'equazione e il codice da stampare a schermo
   */
  risolviEquazione(
    equazione: string,
    grado: number,
    asse: string,
    sistema = true,
    pulisci = true
  ): SoluzioneEquazione {
    // Prendiamo le informazioni di questa equazione
    let espressione = new Funzione(equazione.split("=")[0]);
    let code = ``;
    let risultati = [];
    grado = grado || espressione.grado;

    switch (grado) {
      case 1:
        if (pulisci) {
          (
            document.querySelector(
              this.options.elementi.passaggiScomposizione
            ) as HTMLElement
          ).style.display = "none";
          (
            document.querySelector(
              this.options.elementi.equazioniRisolte
            ) as HTMLElement
          ).style.display = "none";
        }

        if (sistema)
          code += `<td class="spazio-sistema"></td>
<td class="graffa-sistema">`;
        code += this.toLatex(equazione);
        if (sistema)
          code += `${this.toLatex(asse)}
</td>`;

        const termineNoto = espressione.termineNoto;

        if (termineNoto !== 0) {
          // Se il termine noto è 0
          // Sposto il termine noto al secondo membro
          if (sistema)
            code += `<td class="spazio-sistema"></td>
                <td class="graffa-sistema">`;
          code += this.toLatex(
            espressione.membri[0][0].toString() +
              " = " +
              MathSolver.numeroRazionale(-termineNoto)
          );
          if (sistema)
            code += `${this.toLatex(asse)}
                </td>`;

          // Divido il secondo membro per il coefficiente della x
          // Se il coefficiente è diverso da 1
          const ascissa = parseFloat(
            MathSolver.numeroRazionale(
              parseFloat(
                (
                  (-termineNoto / espressione.membri[0][0].coefficiente) *
                  100
                ).toFixed(2)
              ) / 100
            )
          );
          const ordinata = parseFloat(asse.split("=")[1]);

          if (espressione.membri[0][0].coefficiente !== 1) {
            if (sistema)
              code += `<td class="spazio-sistema"></td>
                    <td class="graffa-sistema">`;
            code += this.toLatex("x = " + ascissa);
            if (sistema)
              code += `${this.toLatex(asse)}
                    </td>`;
          }

          this.aggiungiPunto(ascissa, ordinata);

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
          (
            document.querySelector(
              this.options.elementi.passaggiScomposizione
            ) as HTMLElement
          ).style.display = "none";
          (
            document.querySelector(
              this.options.elementi.equazioniRisolte
            ) as HTMLElement
          ).style.display = "none";
        }

        if (sistema)
          code += `<td class="spazio-sistema"></td>
<td class="graffa-sistema">`;
        code += this.toLatex(equazione);
        if (sistema)
          code += `${this.toLatex(asse)}
</td>`;
        const a = espressione.getByExp(2);
        const b = espressione.getByExp(1);
        const c = espressione.termineNoto;
        const delta =
          Math.pow(b ? b.coefficiente : 0, 2) - 4 * a.coefficiente * c;
        const radice = Math.sqrt(delta);
        const a2 = 2 * a.coefficiente;
        const bNeg = (b ? b.coefficiente : 0) * -1;

        risultati = [(bNeg - radice) / a2, (bNeg + radice) / a2];

        // Stampo la formula
        if (sistema)
          code += `<td class="spazio-sistema"></td>
                <td class="graffa-sistema">`;
        code += this.toLatex(`x = \\frac{-b \\pm \\sqrt{b^2-4ac}} {2a}`);

        if (sistema)
          code += `${this.toLatex(asse)}
                </td>`;
        // Stampo l'equazione con i numeri sostituiti
        if (sistema)
          code += `<td class="spazio-sistema"></td>
                <td class="graffa-sistema">`;
        code += this.toLatex(
          `x = \\frac{-${this.controllaParentesi(
            b ? b.coefficiente : 0
          )} \\pm \\sqrt{${this.controllaParentesi(
            b ? b.coefficiente : 0
          )}^2-4*${this.controllaParentesi(
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
          `x = \\frac{-${this.controllaParentesi(
            b ? b.coefficiente : 0
          )} \\pm \\sqrt{${MathSolver.numeroRazionale(
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
            `x = \\frac{-${this.controllaParentesi(
              b ? b.coefficiente : 0
            )} \\pm ${MathSolver.numeroRazionale(
              radice
            )}} {${this.controllaParentesi(a2)}}`
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
            this.aggiungiPunto(risultati[0], 0);
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
              this.aggiungiPunto(risultati[i], 0);
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
    };
  }

  /**
   * Effettua l'intersezione di una funzione con un determinato asse
   *
   * @param funzione Funzione presa in input
   * @param asse Asse con cui la funzione deve fare l'intersezione
   */
  intersezioneAsse(funzione: string | Funzione, asse: string) {
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
                ${this.toLatex(funzione.toString())}
                
                ${this.toLatex(equazioniAssi[asse])}
            </td>`;

    if (!(funzione instanceof Funzione)) {
      funzione = new Funzione(funzione); // Interpretiamo la funzione in un oggetto
    }

    if (asse == "y") {
      // Se devo fare l'intersezione con l'asse y
      const termineNoto = funzione.termineNoto;
      code += `<td class="spazio-sistema"></td>
<td class="graffa-sistema">
    ${this.toLatex("y = " + MathSolver.numeroRazionale(termineNoto))}
    ${this.toLatex(equazioniAssi[asse])}
</td>`;
      this.aggiungiPunto(0, termineNoto);
    } else {
      code += this.risolviEquazione(
        `${membroString(funzione.membri[1])}=0`,
        funzione.grado,
        equazioniAssi[asse]
      ).code;
    }

    code += `
        </tr>
    </tbody>
<table>`;
    return code;
  }

  /**
   * Divide l'espressione in ogni termine di cui è composta in base a dei caratteri delimitanti
   *
   * @param espressione
   * @param caratteri Caratteri delimitanti
   */
  static splittaEspressione(
    espressione: string,
    caratteri: string[]
  ): string[] {
    const split = [];
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
  }

  /**
   * Metodo che ritorna il numero sotto forma di frazione.
   * Al momento questa funzione non fa nulla per continuare il corretto funzionamento del programma in quanto ci sono degli errori
   *
   * @param value Numero da controllare
   * @returns Numero sotto forma di frazione
   */
  static numeroRazionale(value: string | number) {
    return value.toString();
  }
}

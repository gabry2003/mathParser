import { ParteLetterale } from "./parte-letterale";
import { Termine, Termini } from "./termine";
import { membroString } from "./functions";
import { Membri } from "./membro";
import { CoefficienteAngolare, ICoefficienteAngolare } from "./coefficiente-angolare";
import { MathSolver } from "./mathsolver";

/**
 * Questa classe serve a definire le funzioni interpretate a partire da una stringa.
 * Si trova quindi i membri di ogni equazione e tutti i termini che ne fanno parte.
 * Aggiunge inoltre dei metodi molto utili per lavorare con le funzioni matematiche, come ad esempio l'ordinazione e la ricerca del termine noto.
 * Al posto di una funzione si può interpretare un'equazione allo stesso modo
 */
export interface IFunzione {
  /**
   * Membri di cui è composta la funzione.
   * Ogni membro è composto da termini
   */
  membri: Membri;
}

export class Funzione implements IFunzione {
  constructor(options?: IFunzione | string) {
    if (typeof options === "string") {
      // Intrepreto la stringa e mi prendo i dati necessari
      Funzione.interpreta(options, this);
    } else {
      Object.assign(this, options);
    }
  }

  membri: Membri;

  /**
   * Metodo che ritorna il termine noto della funzione.
   * Va a cercare tra tutti i termini quello che non ha una parte letterale così da poter tornare poi il coefficiente.
   *
   * @returns Termine noto
   */
  get termineNoto(): number {
    const idxMembro = this.isFormaImplicita ? 0 : 1;
    const membro = this.membri[idxMembro];

    const termine = membro.find((termine) => !termine.parteLetterale);

    return termine?.coefficiente || 0;
  }

  /**
   * Metodo che ritorna il grado della funzione
   *
   * @return Grado della funzione
   */
  get grado(): number {
    // Cerco tra tutti i termini quello con il grado maggiore
    let elencoTermini = [];
    this.membri.forEach((membro) => {
      membro.forEach((termine) => {
        elencoTermini.push(termine);
      });
    });

    return Math.max(
      ...elencoTermini.map((termine) => {
        if (termine.parteLetterale) {
          return termine.parteLetterale.esponente;
        } else {
          return 0;
        }
      })
    );
  }

  /**
   * Metodo che ritorna il termine con un determinato esponente nella parte letterale
   *
   * @param exp Esponente che deve avere il termine nella parte letterale
   * @param membro Membro da cui prendere il termine
   * @return Termine con quell'esponente
   */
  getByExp(exp, membro = 0): Termine | undefined {
    let elencoTermini: Termini = [];

    if (!this.membri[membro]) {
      membro = 0;
    }

    this.membri[membro].forEach((termine) => {
      elencoTermini.push(termine);
    });

    let result = elencoTermini.filter((termine) => {
      if (termine.parteLetterale) {
        return termine.parteLetterale.esponente == exp;
      }
    });

    if (result.length == 1) return result[0];
  }

  /**
   * Metodo che ordina l'array di termini in modo decrescente in base all'esponente della parte letterale
   * Non ritorna nulla perché modifica direttamente l'oggetto
   */
  ordina(): void {
    // Ordino l'array dei termini in modo decrescente in base all'esponente della parte letterale
    this.membri.forEach((membro) => {
      membro.sort(
        (a, b) =>
          (b.parteLetterale ? b.parteLetterale.esponente : 0) -
          (a.parteLetterale ? a.parteLetterale.esponente : 0)
      );
    });
  }

  /**
   * Metodo che completa la funzione aggiungendo gli esponenti mancanti in modo tale che ci sia un termine per ogni esponente a partire dal grado della funzione
   * Es: x^3+0x^2+x
   */
  completa(): void {
    const gradoFunzione = this.grado; // Prendo il grado
    const complete = (parteFrazione) => {
      for (let i = gradoFunzione; i > 0; i--) {
        // Parto dal grado fino ad esponente 1
        // Se non c'è un termine con questo esponente
        if (
          parteFrazione.filter((termine) => {
            if (termine.parteLetterale) {
              return termine.parteLetterale.esponente == i;
            }
          }).length == 0
        ) {
          // Lo aggiungo
          parteFrazione.push(
            new Termine({
              coefficiente: 0,
              parteLetterale: new ParteLetterale({
                lettera: "x",
                esponente: i,
              }),
            })
          );
        }
      }
      // Se manca il coefficiente
      if (parteFrazione.length < gradoFunzione + 1) {
        // Lo aggiungo
        parteFrazione.push(
          new Termine({
            coefficiente: 0,
            parteLetterale: new ParteLetterale({
              lettera: "x",
              esponente: 0,
            }),
          })
        );
      }
    };

    // Completo tutti i membri
    this.membri.forEach((membro) => {
      complete(membro);
    });

    // Ordino la funzione
    this.ordina();
  }

  /**
   * Metodo che ritorna il coefficiente angolare di una retta.
   * Se la funzione non è una retta non ritorna niente
   */
  get coefficienteAngolare(): ICoefficienteAngolare | undefined {
    if (this.grado !== 1) {
      // Se non è una retta
      return;
    }

    // Prendo il coefficiente del termine di grado 1
    return new CoefficienteAngolare(this.getByExp(1).coefficiente);
  }

  /**
   * Metodo che trova il dominio della funzione
   */
  dominio() {}

  /**
   * Metodo che trova la tipologia della funzione
   */
  get tipologia(): string {
    return `Funzione razionale intera`;
  }

  /**
   * Metodo che semplifica la funzione
   */
  semplifica(): void {
    const semplificaParteFrazione = (parte) => {
      // Se ci sono termini che hanno la stessa esatta parte letterale sommo i coefficienti e trovo un nuovo termine
      let terminiDaTogliere = [];
      let valori = {};

      // Prendo tutti i termini
      for (let i = 0; i < parte.length; i++) {
        const parteLetteraleString = parte[i].parteLetterale
          ? parte[i].parteLetterale.toString()
          : ""; // parte letterale come stringa
        // Se ho già memorizzato un valore per questa parte letterale, parto da quel valore + il coefficiente, altrimenti parto dal coefficiente
        let valore = valori[parteLetteraleString]
          ? valori[parteLetteraleString] + parte[i].coefficiente
          : parte[i].coefficiente;

        // Per ogni termine prendo il termine successivo
        for (let j = i; j < parte.length; j++) {
          const parteLetteraleString2 = parte[j].parteLetterale
            ? parte[j].parteLetterale.toString()
            : "";
          if (parteLetteraleString == parteLetteraleString2) {
            // Se i due termini hanno la stessa parte letterale
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
        parte.push(
          new Termine({
            coefficiente: valori[key],
            parteLetterale: new ParteLetterale(key),
          })
        );
      }

      // Elimino tutti i termini che hanno coefficiente zero e quelli nella lista da tgogliere
      parte = parte.filter(
        (termine) =>
          !terminiDaTogliere.includes(
            termine.toString() && termine.coefficiente !== 0
          )
      );
    };

    // Per ogni membro
    this.membri.forEach((membro) => {
      semplificaParteFrazione(membro);
    });
  }

  /**
   * Metodo che dice se la funzione è in forma esplicita
   */
  get isFormaEsplicita(): boolean {
    // La funzione è in forma esplicita quando a primo membro è presente solo la y di grado 1 e nessun altro termine
    try {
      return (
        this.membri[0].length == 1 &&
        this.membri[0][0]?.parteLetterale?.lettera == "y" &&
        this.membri[0][0]?.parteLetterale?.esponente == 1
      );
    } catch(e) {
      return false;
    }
  }

  /**
   * Metodo che dice se la funzione è in forma implicita
   */
  get isFormaImplicita(): boolean {
    // Fondamentalmente una funzione è in forma implicita se non è in forma esplicita
    return !this.isFormaEsplicita;
  }

  /**
   * Metodo che trasforma la funzione in forma esplicita, utilizzato nelle rette
   */
  formaEsplicita(): void {
    if (!this.isFormaEsplicita) {
      // Se la funzione è già in forma esplicita non faccio nulla
      // Per portare la funzione in forma esplicita sposto tutti i termini del primo membro al secondo membro tranne la y
      this.membri[0].forEach((termine) => {
        if (
          termine.parteLetterale?.lettera == "y" &&
          termine.parteLetterale?.esponente == 1
        )
          return;

        this.membri[1]?.push(
          new Termine({
            coefficiente: -termine.coefficiente,
            parteLetterale: termine.parteLetterale,
          })
        );
      });

      // Elimino tutto tranne la y al primo membro
      this.membri[0] = this.membri[0].filter(
        (termine) =>
          termine.parteLetterale?.lettera == "y" &&
          termine.parteLetterale?.esponente == 1
      );

      this.ordina(); // Ordino la funzione
    }
  }

  /**
   * Metodo che trasforma la funzione in forma implicita
   */
  formaImplicita(): void {
    if (!this.isFormaImplicita) {
      // Se la funzione è giä in forma implicita non faccio nulla
      // Per portare la funzione in forma implicita sposto tutti i termini del secondo membro al primo e nel secondo lascio lo zero
      this.membri[1].forEach((termine) => {
        this.membri[0].push(
          new Termine({
            coefficiente: -termine.coefficiente,
            parteLetterale: termine.parteLetterale,
          })
        );
      });

      this.membri[1] = [
        new Termine({
          coefficiente: 0,
          parteLetterale: null,
        }),
      ];

      this.ordina(); // Ordino la funzione
    }
  }

  /**
   * Metodo che ritorna la funzione come stringa.
   * Molto utile nel caso in cui la funzione sia stata modificata da uno dei metodi per poterla stampare a schermo con le modifiche
   */
  toString(): string {
    return `${membroString(this.membri[0])}=${membroString(this.membri[1])}`;
  }

  /**
   * Interpreta una funzione scritta come stringa.
   * Serve nel caso in cui si passi una stringa al costruttore e si voglia fare il passaggio di interpretazione in automatico
   *
   * @param funzione Funzione da intepretare
   * @param [obj] Oggetto da modificare
   * @returns Funzione interpretata
   */
  static interpreta(funzione, obj): Funzione {
    // console.debug(`interpreta`, funzione, obj);
    funzione = funzione.trim(); // Levo tutti gli spazi dalla funzione
    let membri = funzione.split("="); // Prendo i membri separando dall'uguale
    // Intepretro ogni membro
    const interpretaMembro = function (membro) {
      // console.debug(`interpretaMembro`, membro);
      let partiStringa;

      const interpretaEspressione = (espressione) => {
        // console.debug(`interpretaEspressione`, espressione);
        // Splitto per il + o per il - l'espressione in più termini (es. termine con la x^2 ecc...)
        partiStringa = MathSolver.splittaEspressione(espressione, ["+", "-"]);
        // console.debug(`partiStringa`, JSON.stringify(partiStringa, null, 4));

        return partiStringa.map((string) => Termine.interpreta(string));
      };

      // Adesso divido ogni termine in parte letterale e numerica
      const res = interpretaEspressione(membro);
      // console.debug(res);
      return res;
    };

    membri = membri.map((membro) => interpretaMembro(membro));

    if (obj) {
      // Se devo modificare un oggetto
      obj.membri = membri;

      return obj;
    } else {
      // Altrimenti
      return new Funzione({
        membri: membri,
      });
    }
  }
}

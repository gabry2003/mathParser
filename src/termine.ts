import { isAlpha } from "./functions/is-alpha";
import { MathSolver } from "./mathsolver";
import { ParteLetterale } from "./parte-letterale";

/**
 * Termini interpretati da un'espressione, letta come stringa
 */
export interface ITermine {
  /**
   * Coefficiente del termine
   */
  coefficiente: number;
  /**
   * Parte letterale del termine, è divisa a sua volta in lettera ed esponente
   */
  parteLetterale: ParteLetterale;
}

export class Termine implements ITermine {
  coefficiente = 0;
  parteLetterale = null;

  constructor(options?: string | ITermine) {
    if (options) {
      if (typeof options == "string") {
        // Intrepreto la stringa e mi prendo i dati necessari
        Termine.interpreta(options, this);
      } else {
        Object.assign(this, options);
      }
    }
  }

  /**
   * Metodo che ritorna il termine come stringa.
   * Molto utile nel caso in cui il termine sia stata modificato da uno dei metodi per poterlo stampare a schermo con le modifiche
   */
  toString(): string {
    let string;

    if (this.coefficiente == 1 && this.parteLetterale) {
      string = `+${this.parteLetterale.toString()}`;
    } else if (this.coefficiente == -1 && this.parteLetterale) {
      string = `-${this.parteLetterale.toString()}`;
    } else {
      string = `${MathSolver.numeroRazionale(this.coefficiente)}`;

      if (string[0] !== "-" && string[0] !== "+") {
        string = `+${string}`;
      }

      if (this.parteLetterale) {
        string += `${this.parteLetterale}`;
      }
    }

    return string;
  }

  /**
   * Interpreta un termine scritta come stringa.
   * Serve nel caso in cui si passi una stringa al costruttore e si voglia fare il passaggio di interpretazione in automatico
   *
   * @param termine Termine da intepretare
   * @param obj Oggetto da modificare
   * @returns Termine interpretato
   */
  static interpreta(termine: string, obj?: Termine): Termine {
    // console.debug(`interpreta termine`, termine, obj);
    let coefficiente: number | string = ``;
    let parteLetterale: ParteLetterale | string = ``;
    let prendiCoefficiente = true;

    for (let i = 0; i < termine.length; i++) {
      // Leggo tutti i caratteri del termine
      // Se è una lettera
      if (isAlpha(termine[i])) {
        // console.debug(`if (isAlpha(${termine[i]})) === true`);
        prendiCoefficiente = false; // Smettiamo di prendere il coefficiente
      }else {
        // console.debug(`if (isAlpha(${termine[i]})) === false`);
      }

      if (prendiCoefficiente) {
        // Se posso prendere il coefficiente
        coefficiente += termine[i];
      } else {
        // Altrimenti
        parteLetterale += termine[i];
      }
    }

    switch (
      coefficiente // In base al valore del coefficiente
    ) {
      case "+":
      case "":
        // Se non c'è o è un + vale 1
        coefficiente = 1;
        break;
      case "-":
        // Se è un meno vale -1
        coefficiente = -1;
        break;
      default:
        // Altrimenti lo intrepreto come float
        // console.debug(`coefficiente = parseFloat(${coefficiente}.toString());`);

        coefficiente = parseFloat(coefficiente.toString());
    }

    if (parteLetterale == "") parteLetterale = null;
    parteLetterale = ParteLetterale.interpreta(parteLetterale as string);

    // console.debug(`coefficiente`, coefficiente);
    // console.debug(`parteLetterale`, JSON.stringify(parteLetterale, null, 4));

    if (obj) {
      // Se devo modificare un oggetto
      obj.coefficiente = coefficiente;
      obj.parteLetterale = parteLetterale;

      return obj;
    } else {
      // Altrimenti
      return new Termine({
        coefficiente: coefficiente,
        parteLetterale: parteLetterale,
      });
    }
  }
}

export type Termini = Termine[];
/**
 * Polinomio, ovvero un insieme di termini
 */
export type Polinomio = Termini;
/**
 * Parte letterale intpretata da un'espressione, letta come stringa
 */
export interface IParteLetterale {
  /**
   * Lettera della parte letterale
   */
  lettera: string;
  /**
   * Esponente della parte letterale
   */
  esponente: number;
}

export class ParteLetterale implements IParteLetterale {
  lettera: string;
  esponente: number = 0;

  constructor(options?: IParteLetterale | string) {
    if(options) {
      if (typeof options == "string") {
        // Intrepreto la stringa e mi prendo i dati necessari
        ParteLetterale.interpreta(options, this);
      } else {
        Object.assign(this, options);
      }
    }
  }

  toString() {
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

  /**
   * Interpreta la parte letterale scritta come stringa.
   * Serve nel caso in cui si passi una stringa al costruttore e si voglia fare il passaggio di interpretazione in automatico
   *
   * @param parteLetterale Parte letterale da intepretare
   * @param obj Oggetto da modificare
   * @returns Parte letterale interpretata
   */
  static interpreta(
    parteLetterale: string,
    obj?: ParteLetterale
  ): ParteLetterale {
    // Se non c'è nessuna parte letterale
    if (parteLetterale == null) {
      if (obj) {
        // Se devo modificare un oggetto
        obj = null;
      }

      return null;
    }

    let split = parteLetterale.split("^");
    let esponente = 1;
    let lettera = split[0];

    if (split.length > 1) {
      esponente = parseFloat(split[1]);
    }

    lettera = lettera.replace(",", "").replace(".", "");

    if (obj) {
      // Se devo modificare un oggetto
      obj.lettera = lettera;
      obj.esponente = esponente;

      return obj;
    } else {
      // Altrimenti
      return new ParteLetterale({
        lettera: lettera,
        esponente: esponente,
      });
    }
  }
}

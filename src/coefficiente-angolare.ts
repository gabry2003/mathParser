/**
 * Coefficiente angolare di una retta
 */
export interface ICoefficienteAngolare {
  /**
   * Valore numerico del coefficiente angolare
   */
  numero: number;
  /**
   * Valore sotto forma di gradi
   */
  gradi: number;
  /**
   * Valore sottof orma di radianti
   */
  radianti: number;
  /**
   * Se forma un angolo acuto con il semi asse positivo delle x
   */
  angoloAcuto: boolean;
  /**
   * Se forma un angolo retto con il semi asse positivo delle x
   */
  angoloRetto: boolean;
  /**
   * Se forma un angolo ottuso con il semi asse positivo delle x
   */
  angoloOttuso: boolean;
}

export class CoefficienteAngolare implements ICoefficienteAngolare {
  numero: number;
  gradi: number;
  radianti: number;

  constructor(coefficiente: number | ICoefficienteAngolare) {
    // Se viene passato solamente il valore come numero
    // MI calcolo gli altri attributi
    if (typeof coefficiente === "number") {
      const radianti = Math.atan(coefficiente);
      const gradi = (radianti * 180) / Math.PI;

      this.numero = coefficiente;
      this.gradi = gradi;
      this.radianti = radianti;
    } else {
      // Altrimenti
      // Assegno tutti gli attributi
      Object.assign(this, coefficiente);
    }
  }

  get angoloAcuto(): boolean {
    return this.numero > 0;
  }

  get angoloRetto(): boolean {
    return this.numero === 0;
  }

  get angoloOttuso(): boolean {
    return this.numero < 0;
  }
}

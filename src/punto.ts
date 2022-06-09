/**
 * Punto da visualizzare nel grafico
 */
export interface Punto {
  /**
   * Ascissa del punto
   */
  x: number;
  /**
   * Ordinata punto
   */
  y: number;
  /**
   * Nome del punto
   */
  nome?: string;
  /**
   * Colore di sfondo del punt
   */
  background?: string;
  /**
   * Colore del testo del punto
   */
  foreground?: string;
}

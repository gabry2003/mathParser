import { Termini } from "../termine";

/**
 * Funzione che stampa a schermo un membro
 *
 * @param membro
 */
export function membroString(membro: Termini) {
  let string = membro.join("");

  //   membro.forEach((termine) => {
  //     if (termine[0] !== "-" && termine[0] !== "+") {
  //       string += `+${termine}`;
  //     } else {
  //       string += termine;
  //     }
  //   });

  // Se il primo carattere è un +  lo rimuovo
  if (string[0] == "+") string = string.substring(1);
  return string;
}

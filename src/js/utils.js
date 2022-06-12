/**
 * Metodo che elimina il + se e' il primo carattere
 * 
 * @param {string} stringa Stringa da controllare
 */
function stringWithoutPlus(stringa) {
    if (stringa[0] == '+') {
      return stringa.substring(1);
    }

    return stringa;
}

export { stringWithoutPlus };
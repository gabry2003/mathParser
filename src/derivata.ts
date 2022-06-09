import { Funzione } from "./funzione";
import { ParteLetterale } from "./parte-letterale";
import { Termine } from "./termine";

/**
 * Funzione che applica le regole di derivazione ad un termine
 * 
 * @param {Termine} termine Termine da derivare
 */
export function deriva(termine) {
    // x^n = nx^(n-1)
    let nuovoTermine = new Termine({
        parteLetterale: null,
        coefficiente: termine.coefficiente
    });
    
    if(!termine.parteLetterale) {   // Se non esiste la parte letterale
        // Elimino il termine
        return null;
    }

    if(termine.parteLetterale.esponente) {
        nuovoTermine.coefficiente = nuovoTermine.coefficiente * termine.parteLetterale.esponente;
    }

    if(termine.parteLetterale.esponente > 1) {
        nuovoTermine.parteLetterale = new ParteLetterale({
            lettera: termine.parteLetterale.lettera,
            esponente: termine.parteLetterale.esponente
        });
        
        nuovoTermine.parteLetterale.esponente = termine.parteLetterale.esponente - 1;
    }

    return nuovoTermine;
};

/**
 * Funzione che permette di calcolare la derivata di una funzione
 * 
 * @param {Funzione} funzione Funzione di cui calolare la derivate
 * @returns {Funzione} nuova funzione
 */
export function derivata(funzione) {
    const nuovaFunc = new Funzione(`${funzione}`);
    nuovaFunc.formaEsplicita();

    // Innazitutto scrivo y' al posto di y
    nuovaFunc.membri[0][0].parteLetterale.lettera = `y'`;

    // Poi applico le regole di derivazione per ogni termine del secondo membro
    nuovaFunc.membri[1] = nuovaFunc.membri[1].map(deriva).filter(termine => termine);

    return nuovaFunc;
};

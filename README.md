# MathSolver
MathSolver è una libreria JavaScript che permette di risolvere operazioni matematiche con tutti i passaggi.
**È stata creata per hobby per utilizzarla in un progetto scolastico**

Ti permette di:
- Risolvere equazioni di ogni grado
- Scomporre un'equazione utilizzando:
    - Ruffini
- Trovare i punti di intersezione di una funzione con gli assi
- Fare il grafico della funzione

## Dipendenze
Per il corretto funzionamento di MathSolver è necessario includere anche **MathJax** e **math.js**

``` html
<script src="https://unpkg.com/mathjs@9.3.2/lib/browser/math.js"></script>
<script src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-AMS_HTML"></script>
```

## Guida
Prima di tutto installa i pacchetti
``` bash
npm install
```

### Creazione documentazione
``` bash
npm run generate-docs
```

### Creazione file output
``` bash
npm run build
```

Dopo l'esecuzione di questo comando viene generato il file **dist/mathsolver.min.js**
# Robot React — Contesto Progetto

## Cos'è Robot?
**Robot** è un assistente per l'apprendimento dei bambini nei primi anni di scuola.
Il robot accoglie i bambini nella home page e li guida verso diverse materie.

## Materie
- **Matematica** (attiva — prima da sviluppare)
- Lingua italiana
- Scienze
- Inglese
- Arte
- Musica

## Personaggi
- **Robot**: accoglie i bambini nella home, faccia simpatica, occhi cyan
- **Maestro Gufo (Prof. Gufo)**: maestro di matematica, gufetto con occhiali,
  simpatico e friendly. Fa l'onboarding chiedendo nome ed età del bambino.

## Flusso UX
1. **Home page**: sfondo scuro, il Robot accoglie il bambino con faccina simpatica
2. I cerchi orbitano attorno al Robot, ognuno rappresenta una materia
3. Il bambino clicca su una materia (es. Matematica)
4. **Transizione**: la materia "caccia via" il Robot con un'animazione divertente
5. Si apre la **schermata Matematica** colorata
6. **Onboarding** (se primo accesso): il Prof. Gufo chiede nome e poi età
7. In base all'età si imposta la difficoltà
8. **Selezione attività**: 4 mini-giochi visuali tra cui scegliere
9. Si gioca al mini-gioco scelto (5 round, poi stelle di valutazione)

## Fasce di difficoltà Matematica

**Età minima**: 5 anni (un bambino di 3-4 anni non è ancora pronto per la matematica)

### Piccoli Esploratori (5 anni)
- Conoscere i numeri da 1 a 10
- Contare oggetti
- Riconoscere i numeri scritti
- Confrontare: di più / di meno
- Ordinare numeri in sequenza

### Giovani Matematici (6 anni)
- Contare da 1 a 20
- Scrivere numeri
- Addizioni e sottrazioni entro il 10
- Riconoscere pattern e sequenze
- Concetti spaziali (sopra, sotto, prima, dopo)
- Introduzione alla geometria (figure piane)

### Super Matematici (7-8 anni)
- Operazioni entro il 100
- Addizione e sottrazione fluente
- Introduzione alla moltiplicazione (tabelline)
- Problemi semplici con parole
- Frazioni semplici (metà, un quarto)
- Misure e confronti (lungo, corto, pesante, leggero)

## Attività Matematica (5 anni — Piccoli Esploratori)

Poiché il bambino di 5 anni non sa ancora leggere, tutte le attività
sono visive, con emoji grandi e interazione tramite tocco.

### 1. 🧸 Conta i Giocattoli — Contare
- Mostra N giocattoli sullo schermo
- Il bambino li conta e sceglie il numero giusto
- Difficoltà progressiva: da 2-4 fino a 5-8 oggetti

### 2. ⚽ Quanti Palloni? — Riconoscimento numeri → quantità
- Mostra un numero target (es. "4")
- Il bambino deve toccare esattamente quel numero di palloni
- Insegna l'associazione numero-quantità

### 3. 🎎 Bambole in Fila — Sequenze numeriche
- Mostra bambole numerate in ordine casuale
- Il bambino le tocca nell'ordine giusto (1, 2, 3...)
- Insegna l'ordinamento dei numeri

### 4. 🐻 Chi ha di più? — Confronto quantità
- Mostra due gruppi di pupazzi/animali
- "Chi ha di più?" — il bambino tocca il gruppo più numeroso
- Insegna il concetto di confronto (di più / di meno)

## Design Principles
- Colorato e divertente per bambini
- Animazioni giocose e coinvolgenti
- Interfaccia semplice e intuitiva
- Apprendimento tramite gioco
- Ogni materia ha un maestro-personaggio dedicato
- Domande una alla volta, mai sovraccaricare il bambino
- Nessuna lettura richiesta per i più piccoli (tutto visivo)

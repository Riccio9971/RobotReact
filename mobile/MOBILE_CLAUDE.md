# MOBILE_CLAUDE.md — Documentazione Mobile RobotReact

## Panoramica

La versione mobile di RobotReact è un'app React Native / Expo che replica l'esperienza web per dispositivi iOS. Un robot amichevole accoglie i bambini nella schermata iniziale e li guida verso attività di apprendimento della matematica attraverso un menu orbitale interattivo.

## Stack Tecnologico

| Layer | Tecnologia |
|-------|-----------|
| Framework | React Native 0.81.5 |
| Piattaforma | Expo SDK 54 |
| Navigazione | React Navigation 7 (Native Stack) |
| Grafica SVG | react-native-svg 15 |
| Animazioni | React Native Animated API |
| Haptics | expo-haptics |
| Gradienti | expo-linear-gradient |
| Safe Area | react-native-safe-area-context |

## Struttura del Progetto

```
mobile/
├── App.js                        # Entry point (SafeAreaProvider + Navigation)
├── app.json                      # Configurazione Expo (bundle ID: com.robotreact.app)
├── package.json                  # Dipendenze e script
├── babel.config.js               # Babel config per Expo
├── patches/                      # Patch per React Native (patch-package)
│
└── src/
    ├── navigation/
    │   └── AppNavigator.js       # Stack Navigator (Home → Math) con fade transition
    │
    ├── screens/
    │   ├── HomeScreen.js         # Schermata iniziale: particelle, robot, menu orbitale
    │   │                         # - 4 fasi animazione: particelle → robot → testo → menu
    │   │                         # - LinearGradient scuro come sfondo
    │   │                         # - Naviga a MathScreen quando si tocca "Matematica"
    │   │
    │   └── MathScreen.js        # Contenitore matematica: onboarding → attività → giochi
    │                             # - Numeri fluttuanti come sfondo decorativo
    │                             # - Gestisce routing interno (student/activity state)
    │                             # - Gradiente pastello chiaro
    │
    ├── components/
    │   ├── RobotFace.js          # Robot SVG animato (occhi cyan, antenna, LED)
    │   │                         # - Blinking animato degli occhi
    │   │                         # - Floating verticale con loop
    │   │                         # - Pulsazione antenna LED
    │   │
    │   ├── OrbitalMenu.js        # Menu circolare 6 materie con rotazione touch
    │   │                         # - PanResponder per gesti di rotazione
    │   │                         # - Items posizionati trigonometricamente su cerchio
    │   │                         # - Anello decorativo con rotazione continua
    │   │                         # - Scale-on-press per feedback tattile
    │   │
    │   ├── ParticleField.js      # Particelle fluttuanti dal basso (sfondo passivo)
    │   │
    │   ├── TypewriterText.js     # Effetto macchina da scrivere "Ciao! Sono RoBot"
    │   │
    │   ├── OwlTeacher.js         # Prof. Gufo SVG (gufo con occhiali, becco animato)
    │   │                         # - Prop `speaking` attiva animazione becco
    │   │                         # - Prop `size` per dimensionamento
    │   │
    │   ├── MathOnboarding.js     # Onboarding 3 step: nome → età → conferma
    │   │                         # - Step 0: TextInput per nome
    │   │                         # - Step 1: Bolle età (5, 6, 7, 8)
    │   │                         # - Step 2: Livello difficoltà + bottone "Iniziamo!"
    │   │                         # - KeyboardAvoidingView per iOS
    │   │
    │   ├── MathActivities.js     # Griglia 4 card attività con gradienti
    │   │                         # - Conta! (counting), Prendi! (balloons)
    │   │                         # - In fila! (sequence), Di più! (compare)
    │   │                         # - Emoji animate con bounce nelle card
    │   │
    │   ├── CountingGame.js       # "Conta!" — conta oggetti e scegli il numero
    │   │                         # - Campo giocattoli con posizionamento a griglia
    │   │                         # - Collision detection per evitare sovrapposizioni
    │   │                         # - 3 bottoni risposta
    │   │                         # - Esporta GameHeader e ConfettiOverlay (condivisi)
    │   │
    │   ├── BalloonGame.js        # "Prendi!" — seleziona esattamente N palloni
    │   │                         # - Griglia flex-wrap con spaziatura adeguata
    │   │                         # - Contatore selezione + bottone "Fatto!"
    │   │                         # - Toggle selezione con feedback haptic
    │   │
    │   ├── SequenceGame.js       # "In fila!" — ordina numeri in sequenza
    │   │                         # - Slot target in alto (tratteggiati)
    │   │                         # - Items toccabili sotto con bounce indipendente
    │   │                         # - Animazione shake per risposta sbagliata
    │   │                         # - Spin-in quando item si posiziona nello slot
    │   │
    │   ├── CompareGame.js        # "Di più!" — scegli il gruppo più grande
    │   │                         # - Due gruppi affiancati (A vs B)
    │   │                         # - Animali con bounce indipendente per delay
    │   │                         # - Slide-in animazione per i gruppi
    │   │                         # - Shake per risposta sbagliata
    │   │
    │   └── GameComplete.js       # Schermata risultati con stelle e coriandoli
    │                             # - 1-3 stelle basate sul punteggio
    │                             # - Animazione spin-in per stelle
    │                             # - Effetto coriandoli animati
    │                             # - Bottone "Torna ai giochi"
    │
    └── theme/
        └── colors.js             # Palette colori centralizzata
                                  # - Colori app principale (cyan, purple, pink, orange, green)
                                  # - Gradienti per pagina matematica
                                  # - Gradienti per card attività
                                  # - Colori condivisi (corretto/sbagliato)
```

## Flusso di Navigazione

```
HomeScreen
  ├── (tocca Matematica) → MathScreen
  │     ├── MathOnboarding (nome → età → livello)
  │     ├── MathActivities (4 card giochi)
  │     │     ├── CountingGame → GameComplete
  │     │     ├── BalloonGame → GameComplete
  │     │     ├── SequenceGame → GameComplete
  │     │     └── CompareGame → GameComplete
  │     └── ← Torna a Robot (navigazione indietro)
  └── (altre materie) → Placeholder (non implementate)
```

## Pattern Architetturali

### Gestione Stato
- `useState` + `useMemo` + `useCallback` — nessuna libreria esterna
- Stato passa top-down via props (albero poco profondo, max 3 livelli)
- Dati sessione non persistiti — tutto in memoria

### Sistema Animazioni
- **Animated API** nativa per tutte le transizioni
- Spring physics per movimenti naturali (tension/friction)
- `Animated.loop` + `Animated.sequence` per cicli
- `Animated.parallel` per animazioni concorrenti
- `useNativeDriver: true` ovunque possibile per performance

### Feedback Haptic
- **Light**: tap su elementi (giocattoli, palloni)
- **Medium**: selezione risposte, età
- **Heavy**: bottone "Iniziamo!"
- **Success notification**: risposta corretta
- **Error notification**: risposta sbagliata

### Pattern Giochi (tutti e 4)
1. 5 round per sessione
2. Generazione round con `useMemo` su numero round
3. Feedback visivo (coriandoli/shake) + haptic
4. Punteggio tracciato come contatore risposte corrette
5. GameComplete con 1-3 stelle (≥4 corrette = 3 stelle)
6. `onBack` callback per tornare alla selezione attività

### Livelli Difficoltà (basati sull'età)
- **5 anni**: "Piccoli Esploratori" — numeri 1-10
- **6 anni**: "Giovani Matematici" — numeri 1-20, operazioni base
- **7-8 anni**: "Super Matematici" — operazioni fino a 100, moltiplicazione intro

## Componenti Condivisi (esportati da CountingGame.js)

- `GameHeader` — barra con bottone uscita, progress dots, punteggio
- `ConfettiOverlay` — effetto coriandoli animati per risposta corretta/sbagliata

## Comandi di Sviluppo

```bash
cd mobile
npm install                    # Installa dipendenze
npx expo start                 # Avvia server dev Expo
npx expo start --ios           # Avvia con simulatore iOS
npx expo start --clear         # Avvia con cache pulita
```

## Convenzioni

- **Lingua UI**: tutto in italiano
- **Componenti**: funzionali con hooks
- **Naming**: PascalCase componenti, camelCase variabili/funzioni
- **Indentazione**: 2 spazi
- **Export**: default per componenti principali, named per condivisi
- **SVG**: inline con react-native-svg
- **Stili**: `StyleSheet.create()` in fondo a ogni file
- **Sicurezza bambini**: nessun link esterno, nessuna raccolta dati

## Vincoli

- Solo la materia **Matematica** è implementata
- Nessun backend/API — tutto client-side
- Nessun framework di test configurato
- Nessun linting/formatting tool
- Target iOS tramite Expo
- Nessuna persistenza dati — sessione only

# Robot React Native — App iOS per App Store

## Panoramica

Versione **React Native + Expo** di Robot React, pensata per essere pubblicata
sull'**App Store** come app nativa per iPhone. L'app usa componenti nativi
(non è una web view), si testa con **Expo Go** direttamente sull'iPhone
e si pubblica tramite **EAS Build**.

---

## 1. Stack tecnologico

| Tecnologia | Ruolo |
|---|---|
| **Expo SDK 54** | Framework e toolchain |
| **React Native** | UI nativa |
| **react-native-svg** | Robot Face e Owl Teacher (SVG) |
| **React Navigation** | Navigazione tra schermate |
| **Animated API** | Animazioni (native driver, UI thread) |
| **expo-linear-gradient** | Sfondi sfumati |
| **expo-haptics** | Feedback tattile sui tocchi |
| **react-native-safe-area-context** | Safe area (notch, Dynamic Island) |

---

## 2. Come testare su iPhone

### Prerequisiti
- **Expo Go** installato sull'iPhone (gratuito dall'App Store)
- PC e iPhone sulla **stessa rete WiFi**
- Node.js 18+ installato sul PC

### Avvio

```bash
cd mobile
npm install
npx expo start
```

Apparirà un **QR code** nel terminale.

### Apertura su iPhone

1. Apri la **fotocamera** dell'iPhone
2. Inquadra il **QR code**
3. Tocca il banner "Apri in Expo Go"
4. L'app si avvia istantaneamente

> **Hot Reload**: ogni modifica al codice si riflette sull'iPhone in tempo reale.

### Alternativa: tunnel (reti diverse)

```bash
npx expo start --tunnel
```

Funziona anche se PC e iPhone sono su reti diverse (usa un tunnel ngrok).

---

## 3. Struttura del progetto

```
mobile/
├── App.js                          ← entry point
├── app.json                        ← configurazione Expo
├── package.json                    ← dipendenze
├── babel.config.js                 ← config Babel
├── assets/
│   ├── icon.png                    ← icona app (1024x1024)
│   ├── splash.png                  ← splash screen
│   └── adaptive-icon.png           ← icona Android (opzionale)
└── src/
    ├── navigation/
    │   └── AppNavigator.js         ← stack navigator
    ├── screens/
    │   ├── HomeScreen.js           ← homepage con Robot
    │   └── MathScreen.js           ← container matematica
    ├── components/
    │   ├── RobotFace.js            ← SVG faccia robot
    │   ├── OrbitalMenu.js          ← menu circolare materie
    │   ├── ParticleField.js        ← particelle decorative
    │   ├── TypewriterText.js       ← testo typewriter
    │   ├── OwlTeacher.js           ← SVG gufo maestro
    │   ├── MathOnboarding.js       ← onboarding nome + età
    │   ├── MathActivities.js       ← selezione 4 attività
    │   ├── GameComplete.js         ← schermata stelle fine gioco
    │   ├── CountingGame.js         ← conta i giocattoli
    │   ├── BalloonGame.js          ← prendi i palloni
    │   ├── SequenceGame.js         ← metti in fila
    │   └── CompareGame.js          ← chi ha di più?
    └── theme/
        └── colors.js               ← palette colori condivisa
```

---

## 4. Differenze chiave Web → React Native

| Web (React) | React Native |
|---|---|
| `<div>` | `<View>` |
| `<p>`, `<span>` | `<Text>` |
| `<button>` | `<Pressable>` o `<TouchableOpacity>` |
| `<input>` | `<TextInput>` |
| CSS / className | `StyleSheet.create({})` |
| `framer-motion` | `Animated` API (native driver) |
| HTML Canvas | Animated `<View>` (particelle semplificate) |
| SVG (HTML) | `react-native-svg` |
| CSS `@keyframes` | `Animated.loop()` |
| `linear-gradient` CSS | `<LinearGradient>` componente |
| `position: fixed` | `position: 'absolute'` + dimensioni schermo |
| `vh` / `vw` | `Dimensions.get('window')` |
| `:hover` | Non esiste (solo touch) |
| `cursor: pointer` | Non necessario |

---

## 5. Strategia animazioni

### Sostituzioni

| Web (framer-motion) | React Native |
|---|---|
| `initial + animate` | `Animated.timing()` in `useEffect` |
| `whileTap={{ scale: 0.95 }}` | `Pressable` + `Animated.spring()` |
| `AnimatePresence` | Fade in/out manuale con `Animated.timing` |
| `transition: { type: 'spring' }` | `Animated.spring({ useNativeDriver: true })` |
| `repeat: Infinity` | `Animated.loop()` |
| CSS `@keyframes playBounce` | `Animated.loop(Animated.sequence([...]))` |

### Regola d'oro
Usare sempre `useNativeDriver: true` per animazioni su `transform` e `opacity`.
Questo sposta l'animazione dal thread JS al thread UI nativo → 60fps garantiti.

---

## 6. Pubblicazione su App Store

### Requisiti
1. **Apple Developer Account** — $99/anno
2. **Mac con Xcode** — per la build finale (oppure EAS Build cloud)
3. **App Store Connect** — per sottomettere l'app

### Con EAS Build (senza Mac)

```bash
npm install -g eas-cli
eas login
eas build --platform ios
eas submit --platform ios
```

EAS Build compila nel cloud — non serve un Mac per lo sviluppo.

### Con Xcode (build locale)

```bash
npx expo prebuild --platform ios
cd ios && pod install
# Apri in Xcode:
open ios/RobotReact.xcworkspace
# Product → Archive → Distribute to App Store
```

### Icone richieste

| Dimensione | Uso |
|---|---|
| 1024x1024 | App Store |
| 180x180 | iPhone home screen |
| 120x120 | iPhone Spotlight |
| 87x87 | iPhone Settings |
| 60x60 | Notification |

Expo genera automaticamente tutte le dimensioni da `icon.png` (1024x1024).

### App per bambini — regole App Store

- **Kids Category**: richiede conformità COPPA
- **Nessuna pubblicità** nella versione Kids
- **Nessun link esterno** senza parental gate
- **Nessuna raccolta dati** dei minori
- **Privacy Policy** obbligatoria
- **Age Rating**: 4+ (dato che il nostro contenuto è educativo)

---

## 7. Comandi utili

```bash
# Installare dipendenze
cd mobile && npm install

# Avviare con Expo Go (QR code)
npx expo start

# Avviare con tunnel (reti diverse)
npx expo start --tunnel

# Build iOS per App Store (cloud)
eas build --platform ios

# Submit all'App Store
eas submit --platform ios

# Generare progetto nativo (per Xcode)
npx expo prebuild --platform ios

# Pulire cache
npx expo start --clear
```

---

## 8. Checklist implementazione

### Fase 1 — Setup progetto ✅
- [x] Inizializzare progetto Expo
- [x] Installare dipendenze (svg, navigation, gradient, haptics)
- [x] Configurare navigazione (Home → Math)
- [x] Definire tema colori

### Fase 2 — Homepage ✅
- [x] RobotFace (SVG nativo)
- [x] ParticleField (particelle animate)
- [x] OrbitalMenu (menu circolare materie)
- [x] TypewriterText (effetto macchina da scrivere)

### Fase 3 — Matematica ✅
- [x] OwlTeacher (SVG gufo)
- [x] MathOnboarding (nome + età)
- [x] MathActivities (selezione 4 giochi)
- [x] GameComplete (stelle di valutazione)

### Fase 4 — Giochi ✅
- [x] CountingGame (conta i giocattoli)
- [x] BalloonGame (prendi i palloni)
- [x] SequenceGame (metti in fila)
- [x] CompareGame (chi ha di più?)

### Fase 5 — Polish e pubblicazione
- [ ] Testare su iPhone fisico via Expo Go
- [ ] Creare icona app 1024x1024
- [ ] Creare splash screen
- [ ] Configurare EAS Build
- [ ] Creare Apple Developer Account
- [ ] Build e submit all'App Store
- [ ] Scrivere Privacy Policy

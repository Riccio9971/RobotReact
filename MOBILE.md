# Robot React — Versione Mobile iPhone

## Panoramica

Questa guida documenta come preparare, testare e ottimizzare Robot React
come **Progressive Web App (PWA)** per iPhone. L'app sarà installabile
sulla home screen dell'iPhone, funzionerà in modalità standalone (senza
la barra di Safari) e sarà ottimizzata per l'interazione touch dei bambini.

---

## 1. Come testare localmente su iPhone

### Prerequisiti
- PC e iPhone sulla **stessa rete WiFi**
- Node.js installato sul PC
- L'IP locale del PC (es. `192.168.1.100`)

### Avvio del server di sviluppo

Vite deve esporre il server sulla rete locale:

```bash
npm run dev:mobile
```

Lo script `dev:mobile` avvia Vite con `--host 0.0.0.0`, rendendo il
server accessibile dalla rete locale.

### Accesso da iPhone

1. Apri Safari sull'iPhone
2. Vai all'indirizzo: `http://<IP-DEL-PC>:3000`
   - es. `http://192.168.1.100:3000`
3. L'app si carica come una pagina web normale

### Per trovare il tuo IP locale

```bash
# macOS
ipconfig getifaddr en0

# Windows
ipconfig | findstr "IPv4"

# Linux
hostname -I
```

### Installazione sulla Home Screen (PWA)

1. Apri l'app in Safari sull'iPhone
2. Tocca il pulsante **Condividi** (icona rettangolo con freccia)
3. Scorri e tocca **"Aggiungi alla schermata Home"**
4. Conferma il nome e tocca **"Aggiungi"**
5. L'app appare come un'icona sulla home screen
6. Aprendola si avvia in **modalità standalone** (senza barra di Safari)

> **Nota iOS 26+**: Ogni sito aggiunto alla home screen si apre
> automaticamente come web app per default.

---

## 2. Configurazione PWA

### Manifest (`manifest.webmanifest`)

Il file manifest definisce come l'app appare quando installata:

```json
{
  "name": "Robot React — Impara Giocando",
  "short_name": "RoBot",
  "description": "Assistente per l'apprendimento dei bambini",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "theme_color": "#0a0a0f",
  "background_color": "#0a0a0f",
  "lang": "it",
  "icons": [
    {
      "src": "/pwa-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    },
    {
      "src": "/pwa-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable"
    }
  ]
}
```

**Campi critici per iOS**:
- `"scope": "/"` — obbligatorio, altrimenti i link escono dalla PWA
- `"display": "standalone"` — iOS ignora `"fullscreen"` e `"minimal-ui"`
- `"orientation": "portrait"` — blocca l'orientamento in verticale

### Meta tag HTML per iOS

Aggiungere in `index.html` dentro `<head>`:

```html
<!-- PWA manifest -->
<link rel="manifest" href="/manifest.webmanifest">

<!-- iOS: abilita modalità standalone -->
<meta name="apple-mobile-web-app-capable" content="yes">

<!-- iOS: nome dell'app sulla home screen -->
<meta name="apple-mobile-web-app-title" content="RoBot">

<!-- iOS: status bar trasparente (per il tema scuro della home) -->
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

<!-- iOS: icona 180x180 per la home screen -->
<link rel="apple-touch-icon" href="/apple-touch-icon-180x180.png">

<!-- Viewport con supporto safe area (notch/Dynamic Island) -->
<meta name="viewport"
  content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">
```

### Plugin Vite PWA

Per generare automaticamente il service worker e il manifest:

```bash
npm install vite-plugin-pwa -D
```

Configurazione in `vite.config.js`:

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['apple-touch-icon-180x180.png'],
      manifest: {
        name: 'Robot React — Impara Giocando',
        short_name: 'RoBot',
        description: 'Assistente per l apprendimento dei bambini',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#0a0a0f',
        background_color: '#0a0a0f',
        lang: 'it',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}']
      }
    })
  ],
  server: {
    port: 3000,
    host: '0.0.0.0',
    open: true,
  },
  build: {
    outDir: 'build',
  },
});
```

---

## 3. Safe Area — iPhone Notch e Dynamic Island

L'iPhone ha zone "non sicure" dove il contenuto può essere coperto
dal notch, dalla Dynamic Island o dalla barra Home.

### CSS per le safe area

```css
/* Corpo dell'app: estendi fino ai bordi */
.app {
  min-height: 100dvh; /* dvh = dynamic viewport height (Safari) */
  padding-top: env(safe-area-inset-top);
  padding-bottom: env(safe-area-inset-bottom);
  padding-left: env(safe-area-inset-left);
  padding-right: env(safe-area-inset-right);
}

/* Pulsanti fissi in alto (es. back button) */
.math-back-btn {
  top: calc(24px + env(safe-area-inset-top));
}

/* Header dei giochi */
.game-header {
  padding-top: env(safe-area-inset-top);
}
```

### Perché serve `viewport-fit=cover`

Senza `viewport-fit=cover` nel meta viewport, tutte le variabili
`env(safe-area-inset-*)` restituiscono `0`. Il contenuto non si
estende fino ai bordi, lasciando barre nere ai lati.

---

## 4. Ottimizzazioni Touch per Bambini

### Principi chiave

I bambini di 5 anni hanno motricità fine limitata. Le linee guida:

| Parametro | Standard (adulti) | Bambini (5 anni) |
|---|---|---|
| Tap target minimo | 44x44 pt | **60x60 pt o più** |
| Spaziatura tra elementi | 8px | **16-24px** |
| Gesture supportate | Tap, swipe, pinch | **Solo tap** |
| Feedback | Opzionale | **Obbligatorio su ogni tocco** |

### CSS globale per iOS touch

```css
/* Disabilita selezione testo su elementi interattivi */
button, .interactive {
  -webkit-user-select: none;
  user-select: none;
  -webkit-touch-callout: none;
}

/* Elimina il ritardo di 300ms sul tap */
html {
  touch-action: manipulation;
}

/* Rimuovi l'evidenziazione azzurra di iOS sul tap */
* {
  -webkit-tap-highlight-color: transparent;
}

/* Impedisci pull-to-refresh durante i giochi */
body {
  overscroll-behavior: none;
}

/* Impedisci lo zoom con doppio tap */
html {
  touch-action: manipulation;
}
```

### Dimensioni minime per Robot React

Tutte le aree toccabili nell'app devono rispettare queste dimensioni:

| Elemento | Desktop attuale | Mobile target |
|---|---|---|
| Giocattoli (counting) | 90x90px | **100x100px** |
| Palloni (balloon) | 84x84px | **96x96px** |
| Bambole (sequence) | 96x110px | **104x120px** |
| Pupazzi (compare) | 3.2rem | **3.6rem** |
| Bottoni risposta | 90x90px | **100x100px** |
| Carte attività | 180px min-h | **200px min-h** |
| Bottoni età | 64x64px | **72x72px** |
| Input nome | 320px max-w | **100% width** |
| Back button | 48x48px | **52x52px** |

---

## 5. Layout Mobile

### Differenze chiave rispetto al desktop

| Aspetto | Desktop | Mobile iPhone |
|---|---|---|
| Viewport | Landscape/grande | **Portrait 375-430px** |
| Particle field | Canvas pieno | **Ridotto o disabilitato** (risparmio batteria) |
| Orbital menu | 380-600px scene | **320px scene max** |
| Font size | clamp() standard | **Soglie più alte** |
| Animazioni | Tutte attive | **Ridurre `will-change`** |

### Breakpoint CSS consigliati

```css
/* iPhone SE (375px) */
@media (max-width: 375px) { }

/* iPhone 12/13/14 standard (390px) */
@media (max-width: 390px) { }

/* iPhone 14 Pro Max / 15 Plus (430px) */
@media (max-width: 430px) { }

/* Generico mobile */
@media (max-width: 480px) { }
```

### Performance su mobile

Per evitare lag su iPhone:

1. **Ridurre le particelle**: da 100 a 40-50 sul canvas
2. **Disabilitare backdrop-filter** sui dispositivi lenti:
   ```css
   @media (max-width: 480px) {
     .orbit-item-inner {
       backdrop-filter: none;
       background: rgba(10, 10, 30, 0.6);
     }
   }
   ```
3. **Usare `will-change` con parsimonia**: solo sugli elementi animati attivamente
4. **CSS animations > framer-motion infinite**: già fatto con `@keyframes playBounce`
5. **Usare `100dvh`** invece di `100vh` (Safari mobile ha la barra che cambia altezza)

---

## 6. Icone e Splash Screen

### Icone necessarie

| File | Dimensione | Uso |
|---|---|---|
| `apple-touch-icon-180x180.png` | 180x180 | Icona home screen iPhone |
| `pwa-192x192.png` | 192x192 | Icona PWA standard |
| `pwa-512x512.png` | 512x512 | Icona PWA grande + maskable |
| `favicon.ico` | 32x32 | Tab del browser |

**Nota**: L'icona 180x180 deve essere un PNG quadrato **senza angoli arrotondati**.
iOS applica automaticamente la maschera con gli angoli arrotondati.

### Splash Screen iOS

iOS richiede immagini di splash screen statiche per ogni dimensione
di dispositivo. Senza, l'utente vede uno schermo bianco all'avvio.

Generare con tool come:
- [Progressier PWA Generator](https://progressier.com/pwa-icons-and-ios-splash-screen-generator)
- [pwa-asset-generator](https://github.com/nicedoc/pwa-asset-generator)

```html
<!-- Esempio per iPhone 15 Pro -->
<link rel="apple-touch-startup-image"
  media="screen and (device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)"
  href="/splash-1179x2556.png">
```

---

## 7. Limitazioni iOS da considerare

| Funzionalità | Supporto iOS |
|---|---|
| Cache API | Si (limite 50 MB) |
| Push notifications | Si (iOS 16.4+, solo da home screen) |
| Background Sync | No |
| Storage persistente | 7 giorni se non installata |
| Condivisione dati Safari ↔ PWA | No (storage isolato) |
| `display: fullscreen` | No (fallback a standalone) |
| OAuth redirect in standalone | Problematico |

### Conseguenze pratiche per Robot React

1. **Salvare i progressi**: Usare `localStorage` per nome/età del bambino.
   I dati persistono nella PWA installata, ma NON sono condivisi con Safari.
2. **Non superare 50 MB di cache**: Le nostre emoji SVG e JS sono leggere (~300 KB).
3. **Nessun audio di background**: Pianificare feedback visivo, non audio
   (almeno per la v1).

---

## 8. Struttura file per la versione mobile

```
RobotReact/
├── public/
│   ├── apple-touch-icon-180x180.png    ← icona home screen
│   ├── pwa-192x192.png                 ← icona PWA
│   ├── pwa-512x512.png                 ← icona PWA grande
│   ├── favicon.ico                     ← favicon browser
│   └── splash-*.png                    ← splash screen (opzionale)
├── index.html                          ← + meta tag iOS + manifest link
├── vite.config.js                      ← + VitePWA plugin + host 0.0.0.0
├── package.json                        ← + script dev:mobile + vite-plugin-pwa
└── src/
    ├── App.css                         ← + safe area + touch CSS + breakpoint
    ├── App.jsx                         ← + rilevamento standalone mode
    └── components/
        └── (tutti i componenti esistenti, ottimizzati per touch)
```

---

## 9. Checklist implementazione

### Fase 1 — Setup PWA base
- [ ] Installare `vite-plugin-pwa`
- [ ] Creare `manifest.webmanifest` (via plugin)
- [ ] Aggiungere meta tag iOS in `index.html`
- [ ] Aggiungere `viewport-fit=cover` al meta viewport
- [ ] Creare icone (180, 192, 512)
- [ ] Aggiungere script `dev:mobile` a package.json
- [ ] Testare accesso da iPhone via WiFi

### Fase 2 — CSS mobile
- [ ] Aggiungere CSS touch globale (tap highlight, user-select, overscroll)
- [ ] Supporto safe area (notch, home indicator)
- [ ] Breakpoint per iPhone (375px, 390px, 430px)
- [ ] Usare `100dvh` al posto di `100vh`
- [ ] Ingrandire tap target per bambini

### Fase 3 — Performance
- [ ] Ridurre particelle canvas su mobile
- [ ] Rimuovere `backdrop-filter` su mobile
- [ ] Verificare fps su iPhone reale (60fps target)
- [ ] Ottimizzare caricamento font (preload)

### Fase 4 — UX mobile
- [ ] Impedire zoom accidentale
- [ ] Impedire scroll elastico durante i giochi
- [ ] Testare ogni gioco su iPhone
- [ ] Verificare che le carte attività siano scrollabili se necessario
- [ ] Gestire orientamento landscape (bloccare o adattare)

### Fase 5 — Distribuzione
- [ ] Build di produzione (`npm run build`)
- [ ] Testare con `npm run preview` su rete locale
- [ ] Verificare installazione su home screen
- [ ] Verificare modalità standalone
- [ ] Verificare persistenza dati (localStorage)

---

## 10. Comandi utili

```bash
# Avvio sviluppo su rete locale (iPhone)
npm run dev:mobile

# Build di produzione
npm run build

# Preview build su rete locale
npm run preview -- --host 0.0.0.0

# Trovare IP locale (macOS)
ipconfig getifaddr en0

# Debug Safari iOS da macOS
# 1. iPhone: Impostazioni > Safari > Avanzate > Web Inspector ON
# 2. Mac: Safari > Sviluppo > [nome iPhone] > [pagina web]
```

# CLAUDE.md — AI Assistant Guide for RobotReact

## Project Overview

**RobotReact** is an interactive educational web application for Italian-speaking children (ages 5-8). A friendly robot character greets children on the home screen and guides them to subject-specific learning activities. Currently only the **Mathematics** subject is implemented; the other five subjects (Italian, Science, English, Art, Music) are UI placeholders in the orbital menu.

There is also a **React Native / Expo** mobile version under `mobile/` targeting iOS.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18.3.1 |
| Build tool | Vite 6.0.7 |
| Language | JavaScript (JSX) — no TypeScript |
| Animations | Framer Motion 11.15.0 |
| Styling | Single global CSS file (`src/App.css`) |
| State management | React hooks only (useState, useEffect, useMemo, useCallback) |
| Routing | Custom state-based (no router library) |
| Mobile | React Native 0.81.5 + Expo SDK 54 (in `mobile/`) |

## Quick Reference Commands

```bash
# Web development
npm install          # Install dependencies
npm run dev          # Start dev server on port 3000
npm run build        # Production build to ./build/
npm run preview      # Preview production build locally

# Mobile development (from mobile/ directory)
cd mobile && npm install
npx expo start       # Start Expo dev server
npx expo start --ios # Start with iOS simulator
```

## Project Structure

```
RobotReact/
├── index.html                 # Entry HTML (lang="it", loads Orbitron + Rajdhani fonts)
├── package.json               # Web dependencies and scripts
├── vite.config.js             # Vite config: port 3000, output to ./build
├── PROJECT_CONTEXT.md         # Product spec, UX flow, difficulty tiers (Italian)
├── MOBILE.md                  # React Native implementation guide
│
├── src/
│   ├── main.jsx               # React entry point (renders App into #root)
│   ├── App.jsx                # Root component: phase animations, routing state, home scene
│   ├── App.css                # All component styles (~1400 lines, single file)
│   ├── index.css              # Global reset, body defaults
│   └── components/
│       ├── RobotFace.jsx      # SVG robot character (cyan eyes, antenna, LEDs)
│       ├── OrbitalMenu.jsx    # Circular 6-subject menu orbiting the robot
│       ├── ParticleField.jsx  # Canvas-based particle network with mouse interaction
│       ├── TypewriterText.jsx # Typewriter "Ciao! Sono RoBot" greeting
│       ├── MathPage.jsx       # Math subject container (manages student state + activity)
│       ├── MathOnboarding.jsx # Collects child's name + age, sets difficulty level
│       ├── MathActivities.jsx # Activity card selection screen (4 games)
│       ├── OwlTeacher.jsx     # Prof. Gufo SVG (owl teacher with glasses, animated beak)
│       ├── CountingGame.jsx   # "Conta!" — count objects and pick the right number
│       ├── BalloonGame.jsx    # "Prendi!" — tap exactly N balls
│       ├── SequenceGame.jsx   # "In fila!" — order numbers in sequence
│       └── CompareGame.jsx    # "Di piu!" — pick the larger group
│
└── mobile/                    # React Native + Expo version
    ├── package.json
    ├── app.json               # Expo config (bundle ID: com.robotreact.app)
    ├── App.js                 # Entry point
    ├── babel.config.js
    ├── patches/               # patch-package fixes for React Native
    └── src/
        ├── navigation/
        │   └── AppNavigator.js
        ├── screens/
        │   ├── HomeScreen.js
        │   └── MathScreen.js
        ├── components/        # Mobile equivalents of web components
        │   ├── RobotFace.js
        │   ├── OrbitalMenu.js
        │   ├── ParticleField.js
        │   ├── TypewriterText.js
        │   ├── OwlTeacher.js
        │   ├── MathOnboarding.js
        │   ├── MathActivities.js
        │   ├── GameComplete.js
        │   ├── CountingGame.js
        │   ├── BalloonGame.js
        │   ├── SequenceGame.js
        │   └── CompareGame.js
        └── theme/
            └── colors.js      # Centralized color palette
```

## Architecture & Patterns

### Routing (state-based, no library)

Navigation is driven by `useState` in `App.jsx`:

- `currentPage === null` → Home screen (robot, orbital menu, particles)
- `currentPage === 'math'` → `<MathPage>` renders

Within `MathPage.jsx`, further state determines what's shown:

- `student === null` → `<MathOnboarding>` (name + age form)
- `student && !activity` → `<MathActivities>` (game selection cards)
- `student && activity` → One of the four game components

### State Management

Pure React hooks throughout. No Redux, Context API, or external state library. State flows top-down via props and callbacks, with a shallow component tree (max 3 levels deep).

### Animation System

Framer Motion handles all transitions:
- `AnimatePresence` wraps conditionally rendered sections for enter/exit
- Components use `initial`, `animate`, `exit` props
- Spring physics (`stiffness`, `damping`) for natural motion
- `whileHover` / `whileTap` for interactivity
- CSS `@keyframes` used for simpler loops (floating, pulsing)

### Styling Conventions

- **Single CSS file** (`src/App.css`) contains all component styles
- Class-based naming: `.app`, `.robot-container`, `.orbital-menu`, `.math-page`, etc.
- CSS custom properties for dynamic values: `--btn-color`, `--card-bg`, `--item-color`
- Dark theme base: `#0a0a0f` background
- Neon accent colors: cyan `#00f0ff`, purple `#7b2fff`, pink `#ff2d7b`, orange `#ff6b35`, green `#00ff88`
- Math pages use softer pastel tones for a child-friendly feel
- Fonts: **Orbitron** (tech headings), **Rajdhani** (body text)
- Responsive: media queries at `< 480px` width and `< 600px` height

### Game Architecture

All four math games follow the same pattern:
1. 5 rounds per session
2. Track selections via `tappedItems` (Set)
3. Visual emoji feedback on answer (correct/incorrect)
4. Score tracked as count of correct answers
5. Completion screen with 1-3 star rating (3 stars requires >= 4 correct)
6. `onBack` callback to return to activity selection

Difficulty is determined by the child's age (set during onboarding):
- Age 5: "Piccoli Esploratori" — numbers 1-10
- Age 6: "Giovani Matematici" — numbers 1-20, basic operations
- Age 7-8: "Super Matematici" — operations to 100, multiplication intro

## Code Conventions

- **Language**: All UI text is in Italian
- **Components**: Functional components with hooks (no class components)
- **Naming**: PascalCase for components, camelCase for variables/functions
- **Indentation**: 2 spaces
- **Exports**: Default exports for all components
- **SVG characters**: Hand-built inline SVG with animated elements (RobotFace, OwlTeacher)
- **No prop drilling issues**: Shallow tree, callbacks passed 1-2 levels max
- **Performance**: `useMemo` for expensive computations (particles, floating numbers), `useCallback` for handlers

## Important Constraints

- **No testing framework** is configured. No test files exist.
- **No linting/formatting** tools (no ESLint, Prettier, or editorconfig).
- **No backend/API**. Entirely client-side. Scores and student data are session-only (not persisted).
- **No environment variables** are used. No `.env` files.
- **Only Math is functional**. The other 5 subjects in the orbital menu are visual placeholders.
- **Target audience is pre-literate children** (age 5+). All game interactions must be visual — no reading required.
- **Italian-only** interface. All strings are hardcoded in Italian.

## When Making Changes

1. **All styles go in `src/App.css`** — there are no CSS modules or component-scoped styles.
2. **New components** go in `src/components/` as `.jsx` files with default exports.
3. **Adding a new subject** requires: a new page component, wiring it into `App.jsx`'s `currentPage` state, and handling the corresponding click in `OrbitalMenu`.
4. **Adding a new math game** requires: creating the game component, adding its card in `MathActivities.jsx`, and adding the activity case in `MathPage.jsx`.
5. **Mobile parity**: When adding features to web, consider whether the equivalent should be added to `mobile/src/` as well. Mobile components mirror web components but use React Native primitives and `StyleSheet.create()`.
6. **Child safety**: No external links, no data collection, no ads. This targets the Kids/Educational app category.
7. **Animation consistency**: Use Framer Motion for enter/exit transitions and spring physics. Match existing animation timings and easing curves.

## Build & Deployment

- **Web**: `npm run build` outputs static files to `./build/`. Deployable to any static host (Vercel, Netlify, GitHub Pages, S3).
- **Mobile**: Uses Expo EAS for cloud builds and App Store submission. See `MOBILE.md` for full deployment workflow.
- **Vite dev server** runs on port 3000 with auto-open.

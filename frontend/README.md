# CodeArena — Coding Contest Platform (React)

A multi-page React app (Vite + React Router) implementing the CodeArena design brief: Home, Contests, Contest Details, Leaderboard, Code Editor, Login, Signup, Subscription, Settings, Developers, and More — all as separate routed pages/files, not a single-page mock.

## Run it

```bash
npm install
npm run dev
```

Then open the URL Vite prints (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## Project structure

```
src/
  main.jsx              # React Router entry point
  App.jsx                # Route definitions + layout shell
  components/
    Navbar.jsx
    Footer.jsx
    ContestCard.jsx
    LoginRequiredModal.jsx
    StatCounter.jsx
  pages/
    Home.jsx
    Contests.jsx
    ContestDetails.jsx
    Leaderboard.jsx
    CodeEditor.jsx
    Login.jsx
    Signup.jsx
    Subscription.jsx
    Settings.jsx
    Developers.jsx
    More.jsx
    NotFound.jsx
  data/
    mockData.js          # Contests, leaderboard, plans, dev profiles
```

## About the "inbuilt compiler"

The Code Editor page (`/editor`) really executes **JavaScript** in the browser (sandboxed `Function()` call, capturing `console.log`).

Python, Java, and C++ **can't actually compile inside a browser** — there's no JVM, GCC, or CPython runtime available client-side. For those languages the editor currently returns a clearly-labeled **simulated** result so the UI/UX is complete and demoable end-to-end.

To make all languages actually run, wire `simulateRun()` in `src/pages/CodeEditor.jsx` up to a real remote judge, e.g.:

- [Judge0](https://judge0.com/) (self-hosted or RapidAPI)
- [Piston](https://github.com/engineer-man/piston) (free, open-source)
- Your own Docker-sandboxed execution service

They all follow the same pattern: POST the source code + stdin to an API, poll or await the result, then show it in the console panel exactly like the JavaScript path already does.

## Styling

Tailwind is loaded via CDN in `index.html` with the brand palette (`accent`, `ink`, `bg-soft`, etc.) configured directly in the Tailwind config block, so no separate PostCSS build step is needed.

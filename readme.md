# Aawaiz — Portfolio Website V2

This is my personal portfolio website, built with **React**, **TypeScript**, and **Vite**.  
It serves as a central place to highlight my projects, research, and experiences in robotics, embedded systems, and applied machine learning.

## 🎨 Design

One theme throughout: rounded pastel tiles (Ayu Mirage accents, `src/data/palette.ts`) with dark ink type, a corner icon and a round ink arrow button, on a flat dark page. Heavy condensed type (Archivo variable). The shared tile is `src/components/Tile.tsx`.

- **Hero**: a board of tiles that tip into place: name, a halftone portrait (`src/components/PortraitField.tsx`, data in `public/portrait.bin`), role, status, and a way in. The portrait's ink dots fly in and assemble, sway, flee from the pointer or a finger, and burst on a tap.
- **Projects**: stacking cards. **FYP**: a mint tile with count-up stats. **Skills**: scroll-reactive rows of outlined type.
- **Experience / Education**: one tile per entry, with a date pill.
- **Contact**: email bar, copy button and social tiles; the signature (traced into vector strokes) is written out at the end.
- Motion respects `prefers-reduced-motion`.

## ⚡ Tech Stack

- **React 19 + TypeScript + Vite**
- **Tailwind CSS v4** (CSS-first config via `@theme`, no `tailwind.config.js`)
- **GitHub Pages** for hosting, deployed from `main`

## 🚀 Development Setup

This project started from the Vite + React + TypeScript template. It supports hot module replacement (HMR) and linting out of the box.

To run locally:

```bash
npm install
npm run dev
```

## 🛠 ESLint Configuration

The repo uses @vitejs/plugin-react and includes ESLint rules for TypeScript/React projects.
For production-grade apps, consider expanding the configuration with type-aware lint rules:

```bash
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      ...tseslint.configs.recommendedTypeChecked,
      // or stricter rules:
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
])
```
You can also use:
	•	eslint-plugin-react-x
	•	eslint-plugin-react-dom

for React-specific lint rules.

## 🌐 Deployment

The site is deployed through GitHub Pages using default github domain.

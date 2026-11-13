# Aawaiz — Portfolio Website V2

This is my personal portfolio website, built with **React**, **TypeScript**, and **Vite**.  
It serves as a central place to highlight my projects, research, and experiences in robotics, embedded systems, and applied machine learning.

## 🎨 Design

One system: a flat dark ground, rounded colour blocks in Ayu Mirage accents (`src/data/palette.ts`), dark ink on the blocks, and heavy condensed type (Archivo variable).

- **Opening**: my signature, traced into vector strokes (`src/data/signature.ts`), is written out; when the panel lifts it stays printed on the hero.
- **Hero**: a single block that repaints itself, with a new colour flooding out from wherever you tap or click.
- **Headings**: letters rise thin and ink in to full weight once, then react to hover or a tap.
- **Projects**: stacking cards. **Skills**: scroll-reactive rows. **Experience**: rows that fill with colour.
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

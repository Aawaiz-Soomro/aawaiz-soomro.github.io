# Aawaiz — Portfolio Website V2

This is my personal portfolio website, built with **React**, **TypeScript**, and **Vite**.  
It serves as a central place to highlight my projects, research, and experiences in robotics, embedded systems, and applied machine learning.

## 🎨 Design

- **Opening**: grain assembles into my signature while a counter runs to 100, then the page lifts in. Plays once per session and is skipped with reduced motion.
- **Hero**: a slow WebGL noise field that follows the pointer, with my name set in heavy condensed type whose letters thin out under the cursor.
- **Type**: Archivo (variable width and weight) for display and body, Fira Code for small bracketed labels.
- **Color**: deep slate with the mint accent from the Ayu Mirage palette, cream "paper" cards for projects, and film grain over everything.
- **Projects**: a drag/swipe carousel of cards; each opens its own page.

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

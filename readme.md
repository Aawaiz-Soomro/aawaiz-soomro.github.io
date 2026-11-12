# Aawaiz — Portfolio Website V2

This is my personal portfolio website, built with **React**, **TypeScript**, and **Vite**.  
It serves as a central place to highlight my projects, research, and experiences in robotics, embedded systems, and applied machine learning.

## 🎨 Design

The site is built around one idea: it behaves like the systems I build.

- **Vector field hero**: every project and skill is a point, placed by similarity. The cursor is a nearest-neighbour query: the closest points connect to it and show a similarity score, and clicking a project point opens it. With no cursor, the query drifts on its own. It respects reduced motion and pauses when off screen (`src/components/VectorField.tsx`).
- **Command menu**: press `⌘K`, `Ctrl+K` or `/` anywhere to jump to a section, open a project, copy my email or switch theme.
- **Color**: Ayu Mirage (dark) and Ayu Light, each color with one job: yellow for actions, cyan for data. All text meets 4.5:1 contrast. Tokens live in `src/styles/global.css`.
- **Type**: Fira Code for headings and labels, Instrument Sans for reading.

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

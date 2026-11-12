# Portfolio redesign plan

> **Status: implemented.** Built as a more aggressive version than first drafted:
> Tailwind v4, a full-screen vector-field hero, a `⌘K` command menu, and every
> section rebuilt. All four decisions below went with the recommendation.

Brief: a developer/tech look that is clean, but dynamic and catchy.

Stack stays the same: React 19, Vite, TypeScript, Tailwind v3, GitHub Pages.
The site only deploys from `main`, so all of this can be built and reviewed on
a branch first.

---

## 1. Design direction

**Concept: the site behaves like the systems you build.**
Your strongest work (Influenza) matches people by embedding them as vectors and
finding nearest neighbours. The redesign borrows that idea for one signature
interactive element and keeps everything else quiet and readable.

### The one bold thing: an "embedding field" hero

A canvas of points behind the hero. Each point is one of your projects or
skills, placed so that similar things sit near each other.

- The cursor acts as a query: the nearest few points light up, connect to the
  cursor with thin lines, and show their name and a similarity score.
- Clicking a project point opens that project.
- On touch screens and with reduced motion it renders as a still image.
- It replaces the current mouse glow, which is borrowed from another portfolio.

This is the only decorative motion on the site. Everything else moves only in
response to the visitor.

### Color: Ayu Mirage, with roles

Keep your Ayu Mirage base. The change is that each color gets one job, instead
of seven accents appearing at random on tags.

| Token | Value | Job | Contrast on background |
|---|---|---|---|
| `bg` | `#1f2430` | Page background | – |
| `panel` | `#232a36` | Raised surfaces | – |
| `border` | `#3d4659` (was `#2b3240`) | Dividers, outlines | 1.64 (was 1.21, nearly invisible) |
| `text` | `#cbccc6` | Headings, body | 9.60 |
| `subtext` | `#a3abba` (was `#828997`) | Secondary text | 6.72 (was 4.41, below the 4.5 minimum) |
| `accent` | `#ffcc66` | Links, buttons, active states | 10.41 |
| `signal` | `#5ccfe6` | The embedding field and data only | 8.51 |

- Yellow is Ayu's own signature accent, and warm yellow on slate is less common
  than the mint/green-on-dark look the site has now.
- Green and red remain only for status (active, archived).
- Tags become neutral. Today they are a rainbow that carries no meaning.
- Light theme: rebuild from Ayu Light with the same roles, and check every pair
  for contrast before shipping.

### Type

| Role | Typeface | Notes |
|---|---|---|
| Headings, labels, numbers | Fira Code (keep) | Used large and tight in the hero; ligatures on |
| Paragraphs | Instrument Sans (new) | Replaces monospace body text, which is tiring to read |
| Wordmark | Your signature logo | Once per screen, not twice |

Scale: 14 / 16 / 20 / 28 / 40 / 64 px. Paragraph width capped at about 70
characters. Labels in sentence case ("Currently hacking on", not all caps).

### Motion rules

- One load sequence in the hero: the field settles, then the headline appears.
- No fade-and-slide-up on every section as you scroll.
- Interaction motion only: accordion open/close, project filter, nav indicator,
  theme switch. 150–250 ms, ease-out.
- Everything respects `prefers-reduced-motion`.
- Plain CSS and the Web Animations API. No animation library unless the project
  filter needs layout animation.

---

## 2. Page structure

Seven sections become five. The FYP section and the Influenza project are the
same piece of work, and Education has a single entry.

| Now | After |
|---|---|
| About | **Hero** (short) |
| Projects | **Work** – Influenza featured, FYP paper folded in |
| FYP / Research | merged into Work |
| Skills | **Stack** – a compact table, no cards |
| Experience | **Timeline** – experience and education together |
| Education | merged into Timeline |
| Contact | **Contact** – a proper closing section |

Nav: `Work · Stack · Timeline · Contact`, plus theme toggle and social links.

### Hero

```
┌──────────────────────────────────────────────────────────────┐
│ Aawaiz.S        Work  Stack  Timeline  Contact      ☼ gh in  │
├──────────────────────────────────────────────────────────────┤
│  ·    ·  ·        ·      ·   ·        ·    ·  ·     ·    ·   │
│     ·      Aawaiz Soomro            ·  ╭─ Influenza 0.92     │
│  ·     ·   Backend and AI engineer.   ·│   ·     ·           │
│    ·       I build systems that     ───●  ·   ╭─ pgvector    │
│  ·    ·    match, rank and scale.      ·  ·   │      0.87    │
│       ·                              ·     ·  ·    ·    ·    │
│  ·         [ See my work ]  Résumé ↓      (photo, small)     │
│    ·   ·   Currently hacking on: fyp.          ·     ·    ·  │
└──────────────────────────────────────────────────────────────┘
```

- A real headline replaces the typing effect ("Aspiring…"), which reads as
  generic and undersells you.
- The glitching "currently hacking on" line stays. It is yours and it is good.
- The photo shrinks to a small, straight portrait. It no longer dominates.
- The three-paragraph bio is cut to two sentences. Hobbies move to Contact.
- Mobile: name, headline and button are all visible on the first screen, with a
  small round photo beside the name.
- The loading screen is removed. It delays a page that should appear instantly.

### Work

```
┌──────────────────────────────────────────────────────────────┐
│ Work                                 All  Personal  Uni  AI  │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ Influenza — final year project            [logo, dark]   │ │
│ │ AI matching of influencers and brands.                   │ │
│ │ 9.5M posts    33K influencers    256-d vectors           │ │
│ │ React · FastAPI · pgvector · OpenCLIP    Paper  Code     │ │
│ └──────────────────────────────────────────────────────────┘ │
│ Karachi Transit Guide   Transit planner…   React    Demo Code│
│ Crypto Price Predictor  Price forecasts…   Node.js       Code│
│ Focus Sentinel          …                                    │
│ Four Bishops AI         …                                    │
└──────────────────────────────────────────────────────────────┘
```

- One large featured card with real numbers from your own write-up.
- The other seven projects become compact rows that expand on hover or tap.
  Eight identical cards is the most template-looking part of the current site.
- Logos sit on a dark tinted tile, not a white one.
- Project detail pages get the same type and color treatment.

### Stack

```
Languages   Python  C++  TypeScript  JavaScript  SQL
Frontend    React  Vue  Tailwind  Next.js
Backend     FastAPI  Flask  PostgreSQL  SQLite  Supabase
AI          PyTorch  OpenCV  TensorFlow  YOLO  scikit-learn
Tools       Git  Docker  Linux  Vercel
```

A plain table. This removes the empty slot in the current 5-card grid.
Hovering a row highlights the matching points in the hero field.

### Timeline

One vertical line: teaching assistant, internships, degree, societies. The
current accordion behaviour stays, with the newest entry open.

### Contact

Email in large type with a copy button, résumé download, social links, and one
line about life outside tech.

---

## 3. Build phases

Each phase is one commit, checked with screenshots at 375, 768 and 1440 px in
both themes, plus `npm run lint` and `npm run build`.

| # | Phase | What changes | Main files |
|---|---|---|---|
| 0 | Cleanup | Remove leftover Vite template CSS (`index.css`, `App.css`) that fights Tailwind; make `global.css` the only source of tokens; delete the duplicate palette in `data/theme.ts` | `src/index.css`, `src/App.css`, `src/styles/global.css`, `src/data/theme.ts` |
| 1 | Tokens and type | New color roles, Instrument Sans, type scale, spacing scale, focus rings | `global.css`, `tailwind.config.js`, `vite.config.ts` |
| 2 | Nav and shell | Five-item nav, mobile menu, verify and fix the active-section highlight, remove loading screen | `NavBar.tsx`, `useScrollSpy.tsx`, `App.tsx`, `LoadingScreen.tsx` |
| 3 | Hero | New headline and layout, small portrait, static version of the field | `About.tsx`, `TypingEffect.tsx`, `data/links.ts` |
| 4 | Embedding field | Canvas, cursor query, labels, click-through, reduced-motion and touch fallbacks | new `EmbeddingField.tsx`, remove `MouseGlow.tsx` |
| 5 | Work | Featured card, compact rows, filter, merge FYP paper, restyle detail page | `Projects.tsx`, `Research.tsx`, `ProjectDetail.tsx`, `data/projects.ts` |
| 6 | Stack, Timeline, Contact | Table, merged timeline, new closing section | `Skills.tsx`, `Experience.tsx`, `Education.tsx`, `Contact.tsx`, `Footer.tsx` |
| 7 | Light theme | Rebuild from Ayu Light, contrast-check every pair | `global.css`, `ThemeContext.tsx` |
| 8 | Audit | Run the `web-design-guidelines` and `improve-animations` skills, fix findings, keyboard and screen-reader pass, update `readme.md` | all |

Order matters: 0–1 first, since every later phase depends on the tokens. Phase
4 is the riskiest and is isolated, so the site still works if it slips.

The 817-item `MOBILE_RESPONSIVENESS_TASKS.md` is superseded by this plan. Each
phase is built mobile-first, and the file can be deleted in phase 8.

---

## 4. Definition of done

- Name, headline and main button visible without scrolling on a 375 px phone.
- All text meets 4.5:1 contrast in both themes.
- Every interactive element reachable and visible with the keyboard.
- Site is fully usable with reduced motion turned on.
- No layout shift on load; performance no worse than today.
- The nav highlights the section you are actually in.

---

## 5. Decisions for you

1. **Accent color** – yellow `#ffcc66` (recommended) or keep the current mint
   `#95e6cb`.
2. **Section merge** – fold FYP into Work and Education into Timeline
   (recommended), or keep all seven sections.
3. **Headline wording** – "Backend and AI engineer. I build systems that match,
   rank and scale." is a draft; it should be in your words.
4. **Tailwind v4** – stay on v3 for the redesign (recommended) and upgrade
   afterwards as a separate change.

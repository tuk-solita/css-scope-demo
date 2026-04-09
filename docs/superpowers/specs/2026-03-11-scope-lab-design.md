# Scope Lab — Design Specification

An interactive web app that teaches CSS `@scope` through progressive exercises with live code editing and visual feedback.

## Overview

**Goal:** Teach how the CSS `@scope` at-rule works through hands-on exercises that progress from guided fill-in-the-blank to freeform challenges.

**Target audience:** CSS beginners through intermediate developers. Early exercises assume only basic selector knowledge; later exercises require familiarity with specificity and the cascade.

**Name:** Scope Lab

## Technology Stack

- **Vite** — build tool, dev server with HMR
- **Vanilla JS** — no framework, direct DOM manipulation
- **CodeMirror 6** (lite) — `@codemirror/view`, `@codemirror/state`, `@codemirror/lang-html`, `@codemirror/lang-css`, plus a dark theme. No autocomplete or heavy plugins.
- **Vanilla CSS** — the app's own styling
- **Google Fonts** — JetBrains Mono (code), Inter (UI)

## Architecture

### Project Structure

```
src/
├── index.html              # Entry point
├── main.js                 # App initialization, exercise routing
├── styles/
│   ├── index.css           # Design tokens, global styles
│   ├── layout.css          # Tutorial stacked layout
│   ├── editors.css         # CodeMirror overrides, editor panels
│   └── exercises.css       # Exercise UI: instructions, validation, progress
├── editor/
│   ├── html-editor.js      # HTML CodeMirror instance (read-only in guided mode)
│   ├── css-editor.js       # CSS CodeMirror instance
│   └── preview.js          # iframe sandboxed preview renderer
├── exercises/
│   ├── index.js            # Exercise registry, ordering, progression
│   ├── 01-basic-scope.js   # Exercise modules (one per exercise)
│   ├── 02-scope-vs-descendant.js
│   ├── 03-donut-hole.js
│   ├── 04-scope-pseudo.js
│   ├── 05-nested-themes.js
│   ├── 06-component-isolation.js
│   ├── 07-precise-boundaries.js
│   ├── 08-multiple-roots.js
│   ├── 09-inline-scope.js
│   ├── 10-real-world.js
│   └── exercise-schema.js  # Shared shape definition for exercise data
├── validation/
│   ├── checker.js          # Runs CSS checks against the preview iframe
│   └── rules.js            # Reusable validation predicates
└── ui/
    ├── progress.js         # Progress bar, exercise navigation
    ├── instructions.js     # Renders exercise instructions panel
    └── goal-preview.js     # Renders the "goal" preview iframe
```

### Key Design Decisions

- **Exercise modules:** Each exercise is a JS module exporting a standard shape (see Exercise Module Shape below). This makes exercises self-contained and easy to add/remove/reorder.
- **Sandboxed iframes:** The preview uses `srcdoc` to combine the user's HTML + CSS into a complete document. This isolates user code from the app's own styles.
- **Two iframes:** One for the user's live result, one for the goal state. Both render the same HTML but with different CSS.
- **Editor modes:** The HTML editor is read-only in Tier 1 and Tier 2 exercises. In Tier 3, both editors are editable.
- **State in localStorage:** Exercise progress and the user's latest CSS per exercise persist across sessions.

## Exercise Module Shape

Each exercise module exports an object with this structure:

```js
{
  id: string,              // Unique identifier, e.g. 'donut-hole'
  title: string,           // Display title, e.g. 'The Donut Hole'
  tier: 1 | 2 | 3,        // Difficulty tier
  concept: string,         // Badge text, e.g. '🍩 Donut Scope'
  instructions: string,    // Markdown or HTML instructions
  html: string,            // HTML content for the exercise
  htmlEditable: boolean,   // Whether the HTML editor is editable (default: false)
  starterCss: string,      // Pre-filled CSS (may include blanks for guided exercises)
  goalCss: string,         // The ideal CSS solution (used to render goal preview)
  checks: Check[],         // Array of validation checks
  hints: string[],         // Progressive hints, revealed one at a time
}
```

## Exercise Curriculum

### Tier 1 — Foundations (Guided, fill-in-the-blank)

HTML is read-only. CSS editor has starter code with gaps to fill in.

| # | Title | Concept Taught | Task |
|---|-------|---------------|------|
| 1 | Your First Scope | Basic `@scope (.selector) { }` syntax | Fill in a `@scope` rule to style only paragraphs inside `.card` |
| 2 | Scoping vs. Descendant Selectors | Why `@scope` beats `.parent .child` | Demonstrate how a descendant selector leaks, then fix with `@scope` |
| 3 | The Donut Hole | `@scope (.root) to (.limit)` | Style elements inside `.article-body` but not inside `figure` |
| 4 | Styling the Root with :scope | `:scope` pseudo-class | Apply styles directly to the scope root element using `:scope` |

### Tier 2 — Intermediate (Partially guided → freeform)

HTML is read-only. CSS editor has minimal or no starter code.

| # | Title | Concept Taught | Task |
|---|-------|---------------|------|
| 5 | Nearest Ancestor Problem | Scope proximity | Show why `.light-theme a` and `.dark-theme a` fall back to source order, then replace them with `@scope` so the nearest themed ancestor wins |
| 6 | Component Isolation | Scoping for components | Scope `.title` and `.body` classes inside `.card` so they don't collide with global uses |
| 7 | Precise Boundaries | Inclusive/exclusive bounds with `> *` | Adjust scope boundaries to include or exclude the limit element |
| 8 | Multiple Scope Roots | Selector lists as scope root | Write one `@scope` rule that applies to both `.hero` and `.article-body` |

### Tier 3 — Advanced (Freeform)

Both HTML and CSS editors are editable.

| # | Title | Concept Taught | Task |
|---|-------|---------------|------|
| 9 | Inline Scope | `@scope` inside `<style>` without selector | Edit HTML to add inline `<style>` with prelude-less `@scope` |
| 10 | Real-World Challenge | Everything combined | Style a complex component page with scoped styles, no class collisions |

## UI/UX Design

### Visual Identity

- **Dark theme** — dark background, high-contrast editors, colorful previews
- **Accent color** — purple/violet gradient (inspired by CSS's `rebeccapurple`)
- **Typography** — JetBrains Mono for code, Inter for UI text
- **Name** — "Scope Lab" with a flask/beaker (⚗) icon

### Layout (Stacked Tutorial)

The page reads top-to-bottom like a lesson:

1. **Header bar** — Logo, progress bar (e.g., "4/10"), exercise navigation menu
2. **Instructions panel** — Exercise title, tier badge, description, hint buttons
3. **Editor panels** — HTML editor (left) and CSS editor (right), side-by-side
4. **Preview panels** — User's live result (left) and goal preview (right), side-by-side
5. **Action bar** — "Check Solution" button, "Reset" button, prev/next navigation, validation checklist

### Navigation

- **Free navigation** — all exercises are accessible at all times via next/prev buttons and the exercise menu
- **Progress tracking** — progress bar shows how many exercises have been completed (all checks passed), but does not gate access
- **Exercise menu** (hamburger icon) — lists all exercises with their completion status

### Responsive Behavior

- On narrow screens: editors stack vertically (HTML on top, CSS below), previews stack vertically
- Instructions panel collapses into an expandable accordion on mobile

### Interactions

- **Live preview** updates on every keystroke (debounced ~300ms)
- **"Check Solution"** is explicit — validation checklist only appears when clicked. Keyboard shortcut: `Cmd/Ctrl+Enter`
- **Smooth transitions** between exercises (fade/slide)
- **Micro-animations:** progress bar fills smoothly, badges pulse on earn, check marks scale-in, "Next" button glows when exercise is completed

## Validation System

### Check Types

| Type | Purpose | Parameters |
|------|---------|------------|
| `hasComputedStyle` | Assert a computed CSS property on a target element | `selector`, `property`, `expected` |
| `hasNoComputedStyle` | Assert an element does NOT have a specific computed style | `selector`, `property`, `notExpected` |
| `cssContains` | Check user's raw CSS text matches a regex pattern | `pattern`, `message` |
| `cssNotContains` | Check user's CSS does NOT contain a forbidden pattern | `pattern`, `message` |

### Validation Flow

1. User clicks "Check Solution" (or presses `Cmd/Ctrl+Enter`)
2. For each check in the exercise:
   - `cssContains`/`cssNotContains`: test against the raw CSS string from the editor
   - `hasComputedStyle`/`hasNoComputedStyle`: query the preview iframe's DOM via `contentDocument.querySelector()` and `getComputedStyle()`
3. Display checklist with ✅/❌ per check, each ❌ includes a human-readable error message
4. If all checks pass: mark exercise as completed, animate concept badge, persist to localStorage

### Hint System

- Each exercise defines 2-3 progressive hints
- Hints are revealed one at a time via a button
- First hints are subtle nudges; last hints are nearly the full answer
- Hint reveal count is persisted per exercise

### State Persistence

- **localStorage key:** `scope-lab-progress`
- **Stored data per exercise:** `{ completed: boolean, userCss: string, userHtml: string, hintsRevealed: number }`
- "Reset Exercise" button clears user's code back to starter values for that exercise

## Error Handling

- **Invalid CSS** — the preview iframe renders whatever the browser can parse. No explicit CSS validation error is shown; the user sees the visual result of their (possibly broken) CSS.
- **iframe errors** — if the preview iframe fails to render, show a subtle "Preview unavailable" message in the preview panel.
- **localStorage unavailable** — fall back gracefully; progress simply won't persist across sessions. No error shown to user.

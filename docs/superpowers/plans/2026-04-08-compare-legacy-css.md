# Compare Legacy CSS Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a compare icon button to the CSS editor header that opens a modal showing exercise-specific legacy CSS beside the learner's current scoped CSS.

**Architecture:** Extend exercise data with canonical `legacyCss` examples, add a dedicated `compare-dialog` UI module, and wire it into `main.js` as a small app-level feature. Reuse the existing CodeMirror CSS editor stack in read-only mode so the compare panes match the main editing experience.

**Tech Stack:** Vite, Vanilla JS, CodeMirror 6, Vitest, jsdom, Vanilla CSS

**Spec:** `docs/superpowers/specs/2026-04-08-compare-legacy-css-design.md`

---

## File map

- Modify: `package.json` — add test scripts and dev dependencies for Vitest
- Create: `vitest.config.js` — jsdom test environment for UI modules
- Create: `src/ui/compare-dialog.test.js` — modal behavior tests
- Create: `src/exercises/legacy-css.test.js` — exercise metadata coverage for `legacyCss`
- Modify: `src/editor/css-editor.js` — support read-only CSS editors for compare panes
- Create: `src/ui/compare-dialog.js` — modal creation, focus management, open/close API, read-only viewers
- Modify: `src/exercises/exercise-schema.js` — document `legacyCss`
- Modify: `src/exercises/01-basic-scope.js`
- Modify: `src/exercises/02-scope-vs-descendant.js`
- Modify: `src/exercises/03-donut-hole.js`
- Modify: `src/exercises/04-scope-pseudo.js`
- Modify: `src/exercises/05-nested-themes.js`
- Modify: `src/exercises/06-component-isolation.js`
- Modify: `src/exercises/07-precise-boundaries.js`
- Modify: `src/exercises/08-multiple-roots.js`
- Modify: `src/exercises/09-inline-scope.js`
- Modify: `src/exercises/10-real-world.js`
- Modify: `src/main.js` — add compare button, create dialog, update dialog state from exercise and CSS changes
- Modify: `src/styles/editors.css` — CSS header action styles and compare trigger styling
- Modify: `src/styles/exercises.css` — modal layout, backdrop, responsive compare panes

---

## Chunk 1: Test harness and failing tests

### Task 1: Add browser-style test support

**Files:**
- Modify: `package.json`
- Create: `vitest.config.js`

- [ ] **Step 1: Add test dependencies and scripts**

Update `package.json` to add:
- `vitest`
- `jsdom`
- scripts:
  - `test: "vitest run"`
  - `test:watch: "vitest"`

- [ ] **Step 2: Configure Vitest for DOM tests**

Create `vitest.config.js` with jsdom environment and `src/**/*.test.js` coverage.

- [ ] **Step 3: Run the test command to verify the harness starts**

Run: `npm test`
Expected: Vitest starts successfully and reports no test files or failing placeholder tests.

- [ ] **Step 4: Commit**

```bash
git add package.json vitest.config.js
git commit -m "test: add Vitest harness for compare feature"
```

### Task 2: Write failing tests for compare behavior

**Files:**
- Create: `src/ui/compare-dialog.test.js`
- Create: `src/exercises/legacy-css.test.js`

- [ ] **Step 1: Write dialog behavior tests first**

Create `src/ui/compare-dialog.test.js` with tests covering:
- dialog is closed by default
- `open()` shows the dialog with current legacy CSS and user CSS labels
- `close()` hides the dialog and restores focus to the trigger
- missing `legacyCss` keeps the trigger disabled state or prevents open
- exercise changes can update state and closing behavior remains correct

Use Vitest + jsdom assertions such as:
- `expect(dialogRoot.hidden).toBe(true)` for the default closed state
- `expect(screenOrContainer.textContent).toContain('Before: legacy CSS')`
- `expect(document.activeElement).toBe(triggerButton)` after close
- `expect(compareButton.disabled).toBe(true)` when `legacyCss` is absent

- [ ] **Step 2: Write exercise metadata coverage test**

Create `src/exercises/legacy-css.test.js` with tests covering:
- every registered exercise has a non-empty `legacyCss`
- no `legacyCss` string contains `@scope`

- [ ] **Step 3: Run tests to verify they fail for the expected reason**

Run: `npm test`
Expected: FAIL because `compare-dialog.js` does not exist yet and exercises do not yet define `legacyCss`.

- [ ] **Step 4: Commit**

```bash
git add src/ui/compare-dialog.test.js src/exercises/legacy-css.test.js
git commit -m "test: define compare dialog and legacy CSS expectations"
```

---

## Chunk 2: Data model and reusable read-only editor support

### Task 3: Add `legacyCss` to exercise data

**Files:**
- Modify: `src/exercises/exercise-schema.js`
- Modify: `src/exercises/01-basic-scope.js`
- Modify: `src/exercises/02-scope-vs-descendant.js`
- Modify: `src/exercises/03-donut-hole.js`
- Modify: `src/exercises/04-scope-pseudo.js`
- Modify: `src/exercises/05-nested-themes.js`
- Modify: `src/exercises/06-component-isolation.js`
- Modify: `src/exercises/07-precise-boundaries.js`
- Modify: `src/exercises/08-multiple-roots.js`
- Modify: `src/exercises/09-inline-scope.js`
- Modify: `src/exercises/10-real-world.js`

- [ ] **Step 1: Document `legacyCss` in the schema**

Add JSDoc for `legacyCss` to `src/exercises/exercise-schema.js`.

- [ ] **Step 2: Add canonical legacy CSS strings to all exercises**

For each exercise, add a short `legacyCss` value that:
- solves the same exercise goal as `goalCss`
- avoids `@scope`
- is realistic and readable in a comparison pane

Use these examples as templates for the rest:

```js
// 01-basic-scope
legacyCss: `.card p {
  color: blue;
}`

// 03-donut-hole
legacyCss: `.article-body > img {
  border: 3px solid coral;
  border-radius: 8px;
}`

// 06-component-isolation
legacyCss: `.card .title {
  font-size: 1.5rem;
  color: navy;
}

.card .body {
  color: gray;
}`
```

- [ ] **Step 3: Run tests and confirm the metadata test still drives remaining failures**

Run: `npm test src/exercises/legacy-css.test.js`
Expected: PASS for legacy CSS coverage, while dialog tests still fail because the dialog is not implemented yet.

- [ ] **Step 4: Commit**

```bash
git add src/exercises/exercise-schema.js src/exercises/*.js
git commit -m "feat: add legacy CSS solutions to exercises"
```

### Task 4: Make the CSS editor reusable in read-only mode

**Files:**
- Modify: `src/editor/css-editor.js`

- [ ] **Step 1: Add a failing expectation for read-only viewer behavior**

Extend `src/ui/compare-dialog.test.js` with an assertion that dialog code panes do not mutate app state through change callbacks while rendered read-only.

- [ ] **Step 2: Add read-only support to `createCssEditor`**

Update `createCssEditor(container, { initialDoc, onChange, readOnly = false })` so it can:
- skip change callbacks in read-only mode
- initialize read-only editor state
- expose `setDoc(str)` for viewer refresh
- optionally expose `setReadOnly(bool)` if it simplifies dialog setup

- [ ] **Step 3: Run relevant tests**

Run: `npm test`
Expected: dialog tests still fail on missing dialog behavior, but the editor module supports the required read-only usage.

- [ ] **Step 4: Commit**

```bash
git add src/editor/css-editor.js
git commit -m "refactor: support read-only CSS editors"
```

---

## Chunk 3: Compare dialog module

### Task 5: Implement the modal dialog from the tests

**Files:**
- Create: `src/ui/compare-dialog.js`
- Modify: `src/styles/exercises.css`

- [ ] **Step 1: Implement the minimal compare dialog API**

Create `src/ui/compare-dialog.js` exporting `createCompareDialog(container, options)` or a similarly small factory that:
- renders the backdrop, modal shell, title, close button, and two labeled code panes
- starts hidden
- tracks the last trigger element for focus restoration
- disables compare opening if the current exercise has no `legacyCss`

Use a DOM structure along these lines:

```html
<div class="compare-dialog" hidden>
  <div class="compare-dialog__backdrop"></div>
  <div class="compare-dialog__panel" role="dialog" aria-modal="true" aria-labelledby="compare-dialog-title">
    <div class="compare-dialog__header">
      <h2 id="compare-dialog-title">Scoped CSS vs. legacy CSS</h2>
      <button type="button" class="compare-dialog__close">Close</button>
    </div>
    <div class="compare-dialog__body">
      <section class="compare-pane compare-pane--legacy"></section>
      <section class="compare-pane compare-pane--scoped"></section>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Add open/close, focus, and keyboard behavior**

Implement:
- `open(triggerEl)`
- `close()`
- `setExercise(exercise)`
- `setUserCss(cssText)`
- backdrop click close
- `Escape` close
- focus trap within the modal
- focus return to the compare button on close

- [ ] **Step 3: Add modal styles**

Update `src/styles/exercises.css` with:
- backdrop and modal positioning
- two-pane comparison layout
- `max-width: 1100px` and `max-height: 80vh` on wider screens
- narrow-screen stacking below `900px`
- scrollable code panes
- disabled and hover styles for the compare trigger if needed there

- [ ] **Step 4: Run tests to verify the dialog goes green**

Run: `npm test src/ui/compare-dialog.test.js`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/ui/compare-dialog.js src/styles/exercises.css
git commit -m "feat: add compare dialog for legacy CSS"
```

---

## Chunk 4: App integration and styling polish

### Task 6: Add the compare trigger to the CSS editor header

**Files:**
- Modify: `src/main.js`
- Modify: `src/styles/editors.css`

- [ ] **Step 1: Add a CSS header actions area in `main.js`**

Update the CSS editor panel header markup to include an icon button with:
- visible compare glyph such as `⇆`
- `aria-label="Compare with legacy CSS"`
- tooltip text/title

- [ ] **Step 2: Wire dialog lifecycle into the app controller**

In `src/main.js`:
- create the compare dialog once during startup
- pass the active exercise into the dialog on `loadExercise(index)`
- pass the latest CSS editor content into the dialog on CSS changes
- close the dialog when exercises change
- disable the button when `legacyCss` is missing

- [ ] **Step 3: Style the header button**

Update `src/styles/editors.css` for:
- header action alignment
- compact icon button appearance
- hover/focus/disabled states matching the existing UI

- [ ] **Step 4: Run the full automated test suite**

Run: `npm test`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/main.js src/styles/editors.css
git commit -m "feat: wire compare dialog into CSS editor header"
```

---

## Chunk 5: End-to-end verification

### Task 7: Verify behavior manually and in production build

**Files:**
- No code changes required unless issues are found

- [ ] **Step 1: Run the production build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 2: Manually verify representative exercises**

Run the app and verify:
- a simple root-scope exercise such as `01-basic-scope`
- a boundary exercise such as `03-donut-hole` or `07-precise-boundaries`
- an editable HTML exercise such as `09-inline-scope`

Check:
- compare button appears in the CSS header
- dialog opens with the correct legacy CSS on the left
- dialog shows current user CSS on the right
- close button, backdrop click, and `Escape` all close the dialog
- focus returns to the compare button after close
- panes stack correctly on narrow width

- [ ] **Step 3: Fix any issues found and re-run affected tests/build**

- [ ] **Step 4: Commit final polish if needed**

```bash
git add -A
git commit -m "test: verify compare dialog behavior"
```

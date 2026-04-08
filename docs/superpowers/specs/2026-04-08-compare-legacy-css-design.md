# Compare Legacy CSS — Design Specification

Add an exercise-specific compare experience that helps learners contrast scoped CSS with the older, non-`@scope` way of solving the same styling problem.

## Goal

Help users understand the practical value of `@scope` by letting them compare their current scoped solution against a canonical legacy CSS solution for the active exercise.

## Summary

Each exercise gets a small compare icon button in the `CSS` editor header. Activating it opens a modal dialog with two read-only code panes:

- **Left:** the canonical legacy CSS solution for the current exercise
- **Right:** the learner's current CSS from the editor

This dialog is intended as a teaching aid, not an alternate editing surface. The dialog is closed by default on app load.

## User Experience

### Entry point

- The compare trigger lives in the `CSS` editor header.
- The button uses an icon-only treatment with accessible text via `aria-label` and tooltip text.
- Use a simple built-in compare glyph such as `⇆` rather than introducing an icon dependency.
- The trigger remains available throughout the exercise, even before completion.

### Dialog layout

- Dialog title clarifies the comparison, e.g. **Scoped CSS vs. legacy CSS**.
- The layout is side-by-side on desktop.
- On narrow screens, the panes stack vertically.
- Each pane includes a short label:
  - **Before: legacy CSS**
  - **Now: your scoped CSS**

### Dialog behavior

- The dialog can be opened from the current exercise at any time.
- The dialog can be closed by:
  - clicking the close button
  - pressing `Escape`
  - clicking the backdrop
- If the active exercise changes while the dialog is open, the dialog closes. The next open shows the new exercise's content.
- The right-hand pane always reflects the latest editor content when opened.

### Dialog sizing and scrolling

- The modal is centered and constrained to a comfortable reading width.
- On wider screens, use a two-column layout with `max-width: 1100px` and `max-height: 80vh`.
- Each code pane scrolls independently so one long solution does not push the other out of view.
- On narrow screens, the panes stack and the dialog body remains vertically scrollable.
- Stack the panes below `900px` viewport width.

## Data Model

### Exercise metadata

Extend the exercise shape with a `legacyCss` field:

```js
/** @property {string} legacyCss */
```

Each exercise module defines one canonical pre-`@scope` solution that demonstrates the older technique for that same problem, such as:

- explicit ancestor selectors
- repeated class prefixes
- manually constrained descendant selectors
- global selectors that are more verbose or more fragile than the scoped solution

### Content rules

- `legacyCss` should solve the same exercise intent as `goalCss`.
- `legacyCss` must not use `@scope`.
- `legacyCss` should be realistic and instructional, not intentionally bad or broken.
- Every exercise should provide `legacyCss` so the compare experience is consistent.

### Legacy solution review checklist

Each `legacyCss` example should be reviewed against the same checklist:

- solves the same exercise target as `goalCss`
- avoids `@scope`
- uses a plausible pre-`@scope` approach a learner might recognize
- is specific enough to avoid obvious leakage for the given exercise
- remains short enough to compare quickly in the dialog

## Architecture

### New UI module

Create a dedicated dialog module at `src/ui/compare-dialog.js` to keep compare behavior isolated from `src/main.js`.

Responsibilities:

- render the modal shell
- manage open / close interactions
- render or update both read-only code panes
- expose a small API to the app controller such as:
  - `setExercise(exercise)`
  - `setUserCss(cssText)`
  - `open()`
  - `close()`

### Main app integration

`src/main.js` remains the composition layer:

- adds the compare button to the CSS editor header
- creates the compare dialog once during app startup
- updates dialog state when the current exercise or CSS changes
- opens the dialog when the compare button is clicked

### Code rendering strategy

Use the existing CodeMirror-based CSS editor stack in read-only mode for both dialog panes so syntax highlighting, fonts, and theme remain consistent with the main editor experience.

Design constraints:

- the dialog is not a second editing surface
- the active editor remains the source of truth
- the dialog should remain lightweight enough for instant open/close interactions

## Accessibility

- The icon button includes an accessible name.
- The dialog uses semantic modal structure with clear title text.
- Focus should move to the dialog close button on open and return to the compare button on close.
- Focus is trapped inside the dialog while it is open.
- Keyboard dismissal with `Escape` is required.
- Color contrast must remain readable in the dark UI.

## Responsive behavior

- Desktop/tablet: two-column code comparison
- Mobile/narrow widths: stacked panes, full-width dialog body, scrollable code areas

## Error handling

- If an exercise somehow has no `legacyCss`, disable the compare button and expose that state with accessible tooltip or assistive text.
- Prefer defining `legacyCss` for all exercises so fallback logic is rarely needed.
- Invalid user CSS is still displayed as raw text in the right pane; the dialog does not attempt to lint or normalize it.

## Verification

### Manual verification

- Open at least one simple scope exercise and confirm the dialog shows the expected legacy solution.
- Open an exercise with scope boundaries such as `to (...)` and confirm the legacy pane shows the exercise-specific non-`@scope` approach.
- Open an exercise with editable HTML and confirm the dialog still compares CSS correctly.
- Confirm the dialog opens and closes with mouse and keyboard.
- Confirm focus is trapped inside the modal and returns to the compare button after close.
- Confirm the button trigger works with keyboard activation.
- Confirm the layout adapts on narrow screens.
- Confirm the missing-`legacyCss` fallback behaves gracefully if exercised during development.

### Repository verification

- Run `npm run build` successfully.
- Check for any editor or style errors introduced by the new module.

## Non-goals

- Inline editing inside the compare dialog
- Diff highlighting between the two panes
- Comparison of HTML solutions
- Multiple compare modes or persistent docked compare panels

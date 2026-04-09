# Final Exercise Refresh — Design Specification

Refresh `src/exercises/10-real-world.js` so the last exercise feels like a true capstone that reuses more syntax and tactics from earlier exercises without becoming dramatically longer or harder to read.

## Goal

Keep the current dashboard scenario, but expand the exercise so learners must combine several earlier `@scope` ideas in one place:

- `:scope` for styling the scope root
- donut scoping with a `to (...)` clause
- the precise-boundary `> *` trick so the limit container stays included while its children stay excluded
- multiple roots in a single scope prelude
- nested theme scopes where proximity determines the winning text color

## Approved direction

Use a focused dashboard remix rather than a full rewrite:

1. Keep the main `.dashboard` storyline.
2. Add a sibling `.dashboard-sidebar` card so one rule can demonstrate multiple roots.
3. Change the dashboard boundary to `to (.legacy-view > *)` so the shell is included but the legacy content is excluded.
4. Add light and dark themed widgets, including a nested light section inside a dark widget, so learners must write separate light/dark scopes and observe scope proximity.
5. Update instructions, goal CSS, checks, and hints to match the richer exercise.

## Validation targets

The upgraded exercise should verify that:

- the goal CSS uses a multi-root scope for `.dashboard` and `.dashboard-sidebar`
- the goal CSS uses `to (.legacy-view > *)`
- the dashboard and sidebar roots receive the intended surface styling
- the legacy view shell can still be styled while its inner widget remains unaffected
- dark and light themed content resolve correctly through scope proximity
- legacy content inside `.legacy-view` does not accidentally inherit the new theme styles

## Non-goals

- requiring inline `<style>` editing in the final exercise
- adding new validation rule types
- turning the exercise into a full layout or app-building challenge

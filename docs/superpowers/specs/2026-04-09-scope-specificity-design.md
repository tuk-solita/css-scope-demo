# Scope Specificity Exercise — Design Specification

Add a dedicated lesson that teaches a subtle but important `@scope` rule: the scope prelude constrains where selectors apply, but it does not add to selector specificity.

## Goal

Teach learners that a scoped rule such as `@scope (.profile-card) { .title { ... } }` keeps the specificity of `.title`, not `.profile-card .title`.

## Approved direction

Use a standalone Tier 2 exercise inserted after the current exercise 4.

The lesson should create a small, intentional specificity trap:

1. A pre-existing global rule wins because it has genuinely higher specificity.
2. A learner adds a scoped rule and sees that it still loses.
3. The exercise guidance nudges them to compare the actual selector specificity rather than assuming the scope root increases weight.
4. The learner fixes the problem by using a stronger selector inside the scope for a legitimate reason.

This keeps the lesson focused on the requested rule rather than drifting into a broader cascade-order exercise.

## Exercise structure

### Placement

Insert the new exercise between the current exercises 4 and 5.

This makes the progression:

- Tier 1: syntax, donut scopes, and `:scope`
- new Tier 2 entry: scoped selectors do not gain extra specificity from the scope prelude
- later Tier 2 entries: scope proximity, component isolation, precise boundaries, and multiple roots

That order is deliberate. Learners should understand that scoped selectors do not become heavier before they encounter exercises where scope proximity resolves conflicts between otherwise competing scoped rules.

### Format

- Tier 2
- HTML editor remains read-only
- CSS editor starts with lightweight starter CSS and a visible losing global rule
- The exercise should remain smaller than the capstone and comparable in scope to the existing Tier 2 lessons

### Scenario

Use a compact component scene such as a card, panel, or profile module with:

- one scoped root element
- a target element such as `.title`
- at least one competing global rule with higher actual specificity
- one nearby element that should not be affected by the learner's final selector

The exact theme can change during implementation if a clearer HTML structure emerges, but the exercise must preserve the core teaching sequence above.

## Curriculum and file impact

To keep the numbered curriculum coherent, shift later exercises down by one slot.

Expected file updates:

- create one new exercise module for the specificity lesson
- insert it into `src/exercises/index.js` after current exercise 4
- renumber the current exercise files 5 through 10 so their filenames continue to match the visible exercise order
- update tests and docs that reference exercise numbers or direct numbered exercise files

This is more churn than appending a new exercise at the end, but it keeps the repository easier to understand and avoids numbering drift.

## Validation targets

The new exercise should verify that:

- the learner uses an `@scope` rule for the intended scope root
- the learner does not rely on the scope prelude as if it adds specificity
- the final winning selector inside the scope is genuinely more specific for the target element
- the target element receives the expected computed style
- nearby content outside the intended structure stays unchanged

Implementation can use a mix of `cssContains`, `cssNotContains`, `hasComputedStyle`, and `hasNoComputedStyle` checks, but should not require new validation rule types.

## Instruction and hint goals

The written instructions should make the teaching point explicit without giving away the final selector.

They should help learners notice:

- `@scope` limits reach, but does not inflate selector specificity
- if a global rule is more specific, a scoped rule can still lose
- the correct fix is to strengthen the selector inside the scope honestly, not to abandon scoping

Hints should progress from conceptual nudge to near-solution, matching the style of the existing exercise set.

## Testing and documentation expectations

Add or update automated tests so the repository proves that:

- the new exercise is registered in the correct order
- the exercise metadata is complete and coherent
- the lesson copy reflects the specificity teaching goal
- any affected tests for shifted exercise modules continue to reference the correct files

Update curriculum-facing docs so the exercise list now teaches specificity explicitly before scope proximity.

## Non-goals

- teaching every part of the CSS cascade in one lesson
- replacing the existing scope proximity exercise
- adding new editor capabilities or validation rule types
- turning the new lesson into a second capstone

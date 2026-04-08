export default {
  id: 'precise-boundaries',
  title: 'Precise Boundaries',
  tier: 2,
  concept: '✂️ Exclusive Limits',
  instructions: `
    By default, the scope limit element is <strong>excluded</strong> from the scope — 
    it and everything inside it are out of bounds.
    You can use the <code>&gt; *</code> universal child selector to shift the boundary inward, 
    making the limit element itself <strong>included</strong> while its children remain excluded.
    <br><br>
    Below, we want to highlight elements inside <code>.article</code> with a green left border. 
    The <code>.sidebar</code> container should also get the border to show it belongs to the article, 
    but the sidebar's inner content should remain unstyled.
    <br><br>
    Right now <code>to (.sidebar)</code> excludes the sidebar container entirely — it has no border. 
    Fix the <code>to</code> clause so that <code>.sidebar</code> itself is <strong>included</strong> in the scope, 
    but its children are excluded.
  `,
  html: `<article class="article">
  <p>Article introduction paragraph.</p>

  <div class="sidebar">
    <p>Sidebar content. Should NOT be highlighted.</p>
  </div>
</article>`,
  htmlEditable: false,
  starterCss: `/* .sidebar itself should be IN scope (get the border),
   but its children should be OUT of scope.
   How can you shift the limit boundary inward? */
@scope (.article) to (.sidebar) {
  :is(p, div) {
    border-left: 3px solid green;
    padding-left: 0.5rem;
  }
  p {
    color: green;
  }
}`,
  goalCss: `@scope (.article) to (.sidebar > *) {
  :is(p, div) {
    border-left: 3px solid green;
    padding-left: 0.5rem;
  }
  p {
    color: green;
  }
}`,
  checks: [
    { type: 'cssContains', pattern: 'to\\s*\\(\\s*\\.sidebar\\s*>\\s*\\*\\s*\\)', message: 'Use `.sidebar > *` as the scope limit' },
    { type: 'hasComputedStyle', selector: '.article > p', property: 'color', expected: 'rgb(0, 128, 0)', message: 'Article intro paragraph should be green' },
    { type: 'hasComputedStyle', selector: '.sidebar', property: 'borderLeftColor', expected: 'rgb(0, 128, 0)', message: 'Sidebar container should have a green border (included in scope)' },
    { type: 'hasNoComputedStyle', selector: '.sidebar p', property: 'color', notExpected: 'rgb(0, 128, 0)', message: 'Sidebar content should NOT be green (excluded from scope)' },
  ],
  hints: [
    '`to (.limit)` excludes `.limit` itself from the scope.',
    '`to (.limit > *)` shifts the boundary: `.limit` is now IN scope, but its direct children become the new (exclusive) limits.',
    'Change the to clause to `to (.sidebar > *)`',
  ],
};

export default {
  id: 'donut-hole',
  title: 'The Donut Hole',
  tier: 1,
  concept: '🍩 Donut Scope',
  instructions: `
    Sometimes you want to scope styles to a component, but exclude a nested sub-component. This is called a "donut scope".
    <br><br>
    The <code>@scope</code> rule has a <code>to (selector)</code> clause that sets a lower boundary.
    <br><br>
    Complete the <code>@scope</code> rule below to style only the <code>img</code> inside <code>.article-body</code>, 
    but <strong>exclude</strong> any <code>img</code> inside the <code>&lt;figure&gt;</code>.
  `,
  html: `<article class="article">
  <section class="article-body">
    <p>Article text...</p>
    <img src="https://picsum.photos/id/1/200/100" alt="Photo">
    
    <figure>
      <img src="https://picsum.photos/id/2/200/100" alt="Diagram">
      <figcaption>A diagram</figcaption>
    </figure>
  </section>
</article>`,
  htmlEditable: false,
  starterCss: `@scope (.article-body) {
  img {
    border: 3px solid coral;
    border-radius: 8px;
  }
}`,
  goalCss: `@scope (.article-body) to (figure) {
  img {
    border: 3px solid coral;
    border-radius: 8px;
  }
}`,
  legacyCss: `.article-body > img {
  border: 3px solid coral;
  border-radius: 8px;
}`,
  checks: [
    { type: 'cssContains', pattern: 'to\\s*\\(\\s*figure\\s*\\)', message: 'Use the "to" keyword and "figure" as the scope limit' },
    { type: 'hasComputedStyle', selector: '.article-body > img', property: 'borderColor', expected: 'rgb(255, 127, 80)', message: 'Article body images should have the coral border' },
    { type: 'hasNoComputedStyle', selector: 'figure img', property: 'borderColor', notExpected: 'rgb(255, 127, 80)', message: 'Figure images should NOT have the coral border' },
  ],
  hints: [
    'The "to" keyword defines the lower limit of the scope.',
    'The syntax is: @scope (.root) to (.limit) { }',
    'Replace ____ with `to (figure)`',
  ],
};

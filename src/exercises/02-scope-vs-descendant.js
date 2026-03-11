export default {
  id: 'scope-vs-descendant',
  title: 'Scoping vs. Descendant Selectors',
  tier: 1,
  concept: '🥊 Scope vs Descendant',
  instructions: `
    Descendant selectors (like <code>.parent .child</code>) are \"leaky\" — they style 
    any matching elements, no matter how deeply nested they are. 
    <br><br>
    The page below has a <code>.nav</code> with links, but there's secondary navigation nested 
    inside the <code>.content</code>. The currently written descendant CSS accidentally styles the secondary links too.
    <br><br>
    Change the CSS to use <code>@scope</code> with the root of <code>.nav</code> so that 
    the <code>.content</code> links revert to their default styles.
  `,
  html: `<div class="nav">
  <a href="#">Home</a>
  <a href="#">About</a>
</div>

<div class="content">
  <p>Here are some other links that should be default colored:</p>
  <div class="secondary-nav">
    <a href="#">Privacy Policy</a>
    <a href="#">Terms of Service</a>
  </div>
</div>`,
  htmlEditable: false,
  starterCss: `.nav a {
  color: coral;
  font-weight: bold;
  text-decoration: none;
}`,
  goalCss: `@scope (.nav) {
  a {
    color: coral;
    font-weight: bold;
    text-decoration: none;
  }
}`,
  checks: [
    { type: 'cssContains', pattern: '@scope\\s*\\(\\s*\\.nav\\s*\\)', message: 'Use @scope with .nav as the scope root' },
    { type: 'cssNotContains', pattern: '\\.nav\\s+a', message: 'Remove the leaky .nav a descendant selector' },
    { type: 'hasComputedStyle', selector: '.nav a', property: 'color', expected: 'rgb(255, 127, 80)', message: 'Primary .nav links should be coral' },
    { type: 'hasNoComputedStyle', selector: '.content a', property: 'color', notExpected: 'rgb(255, 127, 80)', message: 'Secondary links inside .content should NOT be coral' },
  ],
  hints: [
    'Remove the `.nav a` selector.',
    'Wrap the `a { }` block inside an `@scope (.nav) { ... }` block.',
  ],
};

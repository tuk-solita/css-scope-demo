export default {
  id: 'scope-vs-descendant',
  title: 'Scoping vs. Descendant Selectors',
  tier: 1,
  concept: '🥊 Scope vs Descendant',
  instructions: `
    Descendant selectors (like <code>header a</code>) are "leaky" — they style 
    any matching elements, no matter where they are within the parent. 
    <br><br>
    The page below has a <code>header</code> that contains a primary <code>.nav</code>, but also 
    some secondary links in the <code>.content</code>. The currently written descendant CSS 
    accidentally styles all the links inside the header!
    <br><br>
    Change the CSS to use <code>@scope</code> with the root of <code>.nav</code> so that 
    the <code>.content</code> links revert to their default styles.
  `,
  html: `<header>
  <div class="nav">
    <a href="#">Home</a>
    <a href="#">About</a>
  </div>

  <div class="content">
    <p>Here are some other links that should be default colored:</p>
    <div class="secondary-nav">
      <a href="#">Privacy Policy</a>
      <a href="#">Terms of Service</a>
    </div>
  </div>
</header>`,
  htmlEditable: false,
  starterCss: `header a {
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
    { type: 'cssNotContains', pattern: 'header\\s+a', message: 'Remove the leaky header a descendant selector' },
    { type: 'hasComputedStyle', selector: '.nav a', property: 'color', expected: 'rgb(255, 127, 80)', message: 'Primary .nav links should be coral' },
    { type: 'hasNoComputedStyle', selector: '.content a', property: 'color', notExpected: 'rgb(255, 127, 80)', message: 'Secondary links inside .content should NOT be coral' },
  ],
  hints: [
    'Remove the <code>header a</code> selector.',
    'Wrap the <code>a { }</code> block inside an <code>@scope (.nav) { ... }</code> block.',
  ],
};

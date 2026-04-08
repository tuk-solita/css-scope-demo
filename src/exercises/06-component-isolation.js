export default {
  id: 'component-isolation',
  title: 'Component Isolation',
  tier: 2,
  concept: '📦 Component Scoping',
  instructions: `
    Often you'll want to use simple class names like <code>.title</code> and <code>.body</code> 
    inside a component without worrying about them colliding with global styles.
    <br><br>
    The HTML has a <code>.card</code> component and some generic global elements.
    Write a single <code>@scope</code> block for the <code>.card</code> that sets:
    <ul>
      <li><code>.title</code> font-size to 1.5rem and color to navy</li>
      <li><code>.body</code> color to gray</li>
    </ul>
    The global title and body should remain unstyled.
  `,
  html: `<h1 class="title">Global Page Title</h1>
<p class="body">This is just some global body text.</p>

<div class="card">
  <h2 class="title">Card Title</h2>
  <p class="body">This is the card body text, safely scoped!</p>
</div>`,
  htmlEditable: false,
  starterCss: `.card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
}

/* Add your @scope rule for .card here */
`,
  goalCss: `.card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
}

@scope (.card) {
  .title {
    font-size: 1.5rem;
    color: navy;
  }
  .body {
    color: gray;
  }
}`,
  legacyCss: `.card {
  border: 1px solid #ddd;
  padding: 1rem;
  border-radius: 8px;
}

.card .title {
  font-size: 1.5rem;
  color: navy;
}

.card .body {
  color: gray;
}`,
  checks: [
    { type: 'cssContains', pattern: '@scope\\s*\\(\\s*\\.card\\s*\\)', message: 'Use @scope targeting .card' },
    { type: 'hasComputedStyle', selector: '.card .title', property: 'color', expected: 'rgb(0, 0, 128)', message: 'Card title should be navy (rgb(0,0,128))' },
    { type: 'hasComputedStyle', selector: '.card .title', property: 'fontSize', expected: '24px', message: 'Card title should be 1.5rem (24px)' },
    { type: 'hasComputedStyle', selector: '.card .body', property: 'color', expected: 'rgb(128, 128, 128)', message: 'Card body should be gray' },
    { type: 'hasNoComputedStyle', selector: 'h1.title', property: 'color', notExpected: 'rgb(0, 0, 128)', message: 'Global title should NOT be navy' },
  ],
  hints: [
    'Create an `@scope` rule defining `.card` as the root.',
    'Inside the scope block, you can just use `.title` and `.body` selectors without prefixing them.',
  ],
};

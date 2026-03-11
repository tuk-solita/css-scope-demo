export default {
  id: 'precise-boundaries',
  title: 'Precise Boundaries',
  tier: 2,
  concept: '✂️ Exclusive Limits',
  instructions: `
    By default, a donut scope includes the scope root elements, but <strong>excludes</strong> the scope limit element. 
    You can use the <code>&gt; *</code> universal child selector to modify this!
    <br><br>
    The page below has an <code>.article</code> with nested <code>.component</code> sections. 
    We want to style all paragraphs inside the article, but right now the first paragraph of each component 
    (the component itself) is getting excluded because it acts as the scope limit.
    <br><br>
    Fix the bounds in the ` + "`to`" + ` clause so that the scope limit itself is **included** in the scope, but its children are not.
  `,
  html: `<article class="article">
  <p>Article introduction paragraph.</p>
  
  <div class="component">
    <p>This component is the limit. It SHOULD be styled.</p>
    <div class="component-inner">
      <p>This is INSIDE the limit. It should NOT be styled.</p>
    </div>
  </div>
</article>`,
  htmlEditable: false,
  starterCss: `/* The current scope limit entirely excludes .component.
   Change the limit to exclude ONLY its children! */
@scope (.article) to (.component) {
  p {
    color: green;
  }
}`,
  goalCss: `@scope (.article) to (.component > *) {
  p {
    color: green;
  }
}`,
  checks: [
    { type: 'cssContains', pattern: 'to\\s*\\(\\s*\\.component\\s*>\\s*\\*\\s*\\)', message: 'Use `.component > *` as the scope limit' },
    { type: 'hasComputedStyle', selector: '.article > p', property: 'color', expected: 'rgb(0, 128, 0)', message: 'Article intro p should be green' },
    { type: 'hasComputedStyle', selector: '.component > p', property: 'color', expected: 'rgb(0, 128, 0)', message: 'The component limit p should be green too' },
    { type: 'hasNoComputedStyle', selector: '.component-inner p', property: 'color', notExpected: 'rgb(0, 128, 0)', message: 'Paragraphs deeper inside component should NOT be styled' },
  ],
  hints: [
    '`@scope (.root) to (.limit)` means `.limit` is excluded.',
    '`@scope (.root) to (.limit > *)` means `.limit` is INCLUDED, but its children are excluded.',
    'Change the to clause to `to (.component > *)`',
  ],
};

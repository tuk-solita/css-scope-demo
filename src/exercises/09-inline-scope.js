export default {
  id: 'inline-scope',
  title: 'Inline Scope',
  tier: 3,
  concept: '💨 Inline Scope',
  instructions: `
    If you put a <code>&lt;style&gt;</code> element directly inside an HTML element, you can use 
    an <code>@scope</code> block <strong>without a selector prelude</strong>. The browser will automatically use the 
    parent element of the <code>&lt;style&gt;</code> tag as the scope root!
    <br><br>
    The HTML editor is unlocked for this exercise. Edit the HTML below to add a <code>&lt;style&gt;</code> tag 
    inside the <code>.card</code>.
    <br><br>
    Write a prelude-less <code>@scope</code> block inside it, and style the <code>p</code> to have <code>color: crimson</code>.
  `,
  html: `<div class="card">
  <h2>Inline Scoped Component</h2>
  <p>I should have crimson text.</p>
  
  <!-- Add your <style> element here -->
  
</div>

<div class="other">
  <p>I should remain completely unstyled.</p>
</div>`,
  htmlEditable: true,
  starterCss: `/* Leave this blank. 
   Write your CSS directly in the HTML editor inside a <style> block!
*/`,
  goalCss: `/* The goal is evaluated via the HTML injects */`,
  checks: [
    { type: 'hasComputedStyle', selector: '.card p', property: 'color', expected: 'rgb(220, 20, 60)', message: 'The card paragraph should be crimson.' },
    { type: 'hasNoComputedStyle', selector: '.other p', property: 'color', notExpected: 'rgb(220, 20, 60)', message: 'The other paragraph should NOT be styled.' },
    // A quick check that they didn't cheat by typing it in the CSS editor
    { type: 'cssNotContains', pattern: 'color\\s*:\\s*crimson', message: 'Put your CSS in the HTML editor, inside a <style> tag!' },
  ],
  hints: [
    'Add `<style>` under the `<!-- Add your <style> ...` comment.',
    'Inside it, write `@scope { p { color: crimson; } }` (notice there are no parentheses after @scope!).',
  ],
};

export function createInstructions(container) {
  let hints = [];
  let currentHintsRevealed = 0;

  container.innerHTML = `
    <div class="exercise-meta">
      <span class="tier-badge" id="instruction-tier">Tier 1</span>
      <span class="concept-badge" id="instruction-concept">Concept</span>
    </div>
    <h2 class="exercise-title" id="instruction-title">Title</h2>
    <div class="instruction-text" id="instruction-text">Instructions here...</div>
    <div class="hints-container" id="hints-container"></div>
  `;

  const renderHints = () => {
    const hintsContainer = container.querySelector('#hints-container');
    hintsContainer.innerHTML = '';
    hints.forEach((hint, index) => {
      if (index < currentHintsRevealed) {
        hintsContainer.innerHTML += `<div class="hint-text visible">💡 ${hint}</div>`;
      } else if (index === currentHintsRevealed) {
        const btn = document.createElement('button');
        btn.className = 'hint-btn';
        btn.innerHTML = `💡 Show Hint ${index + 1}`;
        btn.onclick = () => {
          currentHintsRevealed++;
          renderHints();
        };
        hintsContainer.appendChild(btn);
      }
    });
  };

  return {
    update(exercise) {
      container.querySelector('#instruction-tier').textContent = `Tier ${exercise.tier}`;
      container.querySelector('#instruction-concept').textContent = exercise.concept;
      container.querySelector('#instruction-title').textContent = exercise.title;
      container.querySelector('#instruction-text').innerHTML = exercise.instructions;
      
      hints = exercise.hints || [];
      // we reset local state but main app can overwrite via setHintsRevealed
      currentHintsRevealed = 0;
      renderHints();
    },
    setHintsRevealed(count) {
      currentHintsRevealed = count;
      renderHints();
    },
    getHintsRevealed() {
      return currentHintsRevealed;
    }
  };
}

export function createProgress(container, exercises) {
  const total = exercises.length;
  let completedIds = new Set();
  let navigateCb = null;

  container.innerHTML = `
    <div class="app-logo"><span>⚗</span> Scope Lab</div>
    <div class="progress-container">
      <div class="progress-text"><span id="completed-count">0</span>/${total}</div>
      <div class="progress-bar-bg">
        <div id="progress-fill" class="progress-bar-fill" style="width: 0%"></div>
      </div>
    </div>
    <button id="menu-btn" class="menu-btn">≡ Menu</button>
  `;

  // Note: We skip implementing a full drop-down menu for now to keep things simple,
  // but we can add an overlay or modal if needed. Let's just hook up a basic alert
  // or simple select list as the menu for simplicity in the vanilla setup.
  container.querySelector('#menu-btn').addEventListener('click', () => {
    // Basic implementation: let's prompt the user or toggle a simple dialog.
    const idx = prompt('Enter exercise number to jump to (1-' + total + '):');
    if (idx && parseInt(idx) >= 1 && parseInt(idx) <= total) {
      if (navigateCb) navigateCb(parseInt(idx) - 1);
    }
  });

  return {
    update(completedSet) {
      completedIds = completedSet;
      const count = completedSet.size;
      container.querySelector('#completed-count').textContent = count;
      container.querySelector('#progress-fill').style.width = `${(count / total) * 100}%`;
    },
    onNavigate(cb) {
      navigateCb = cb;
    }
  };
}

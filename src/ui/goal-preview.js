export function createGoalPreview(container) {
  const iframe = document.createElement('iframe');
  iframe.className = 'preview-iframe';
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  container.appendChild(iframe);

  return {
    update(html, goalCss) {
      const srcdoc = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: system-ui, sans-serif; margin: 20px; color: #333; }
    ${goalCss}
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
      iframe.srcdoc = srcdoc;
    }
  };
}

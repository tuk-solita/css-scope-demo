export function createPreview(container) {
  const iframe = document.createElement('iframe');
  iframe.className = 'preview-iframe';
  // Use sandbox to prevent user scripts from escaping or causing issues
  iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
  container.appendChild(iframe);

  let debounceTimer;

  return {
    iframe,
    getDocument: () => {
      return iframe.contentDocument || iframe.contentWindow.document;
    },
    update: (html, cssText) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const srcdoc = `
<!DOCTYPE html>
<html>
<head>
  <style>
    /* Reset injected into preview to ensure consistent baseline */
    body { font-family: system-ui, sans-serif; margin: 20px; color: #333; }
    ${cssText}
  </style>
</head>
<body>
  ${html}
</body>
</html>`;
        iframe.srcdoc = srcdoc;
      }, 300);
    }
  };
}

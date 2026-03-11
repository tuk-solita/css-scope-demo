export function checkCssContains(css, pattern, message) {
  const regex = new RegExp(pattern);
  return {
    passed: regex.test(css),
    message
  };
}

export function checkCssNotContains(css, pattern, message) {
  const regex = new RegExp(pattern);
  return {
    passed: !regex.test(css),
    message
  };
}

export function checkComputedStyle(iframeDoc, selector, property, expected, message) {
  const el = iframeDoc.querySelector(selector);
  if (!el) {
    return { passed: false, message: `Could not find element matching '${selector}'` };
  }
  const computed = iframeDoc.defaultView.getComputedStyle(el);
  return {
    passed: computed[property] === expected,
    message
  };
}

export function checkNoComputedStyle(iframeDoc, selector, property, notExpected, message) {
  const el = iframeDoc.querySelector(selector);
  if (!el) {
    return { passed: false, message: `Could not find element matching '${selector}'` };
  }
  const computed = iframeDoc.defaultView.getComputedStyle(el);
  return {
    passed: computed[property] !== notExpected,
    message
  };
}

function getLayoutSpacing(spacing) {
  if (spacing === undefined || String.prototype.toLowerCase.call(spacing) === 'default' || String.prototype.toLowerCase.call(spacing) === 'true') {
    return 'mb-component';
  }

  if (spacing === undefined || String.prototype.toLowerCase.call(spacing) === 'lg') {
    return 'mb-component-lg';
  }

  return '';
}

export default getLayoutSpacing;

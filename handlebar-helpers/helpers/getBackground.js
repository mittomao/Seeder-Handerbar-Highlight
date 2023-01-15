function getBackground(background) {
  if (!background) {
    return '';
  }

  if ([ 'primary', 'secondary', 'tertiary', ].indexOf(background) > -1) {
    return `bg-${background} content--inverse section--layout`;
  }

  return `bg-${background} section--layout`;
}

export default getBackground;

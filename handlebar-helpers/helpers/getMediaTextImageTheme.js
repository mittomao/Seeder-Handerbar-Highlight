function getMediaTextImageTheme(theme) {
  if (!theme) {
    return 'media-text-image--theme-primary content--inverse';
  }

  if ([ 'primary', 'secondary', 'tertiary', ].indexOf(theme) > -1) {
    return `media-text-image--theme-${theme} content--inverse`;
  }

  return '';
}

export default getMediaTextImageTheme;

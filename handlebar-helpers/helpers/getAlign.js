function getAlign(align) {
  if (!align) {
    return '';
  }
  return `justify-content-${align}`;
}

export default getAlign; 

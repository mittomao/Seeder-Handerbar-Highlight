function getValign(valign) {
  if (!valign) {
    return '';
  }
  return `align-items-${valign}`;
}

export default getValign; 

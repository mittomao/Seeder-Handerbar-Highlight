function getActiveItem(list, activeId, context) {
  let activeElement = null;
  list.forEach((element) => {
    if (element.id === activeId) {
      activeElement = element;
    }
  });
  return activeElement ? context.fn(activeElement) : context.inverse(this);
}

export default getActiveItem;

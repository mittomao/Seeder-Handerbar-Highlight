function reorder(array, sortByField) {
  array.sort((item1, item2) => {
    return item1[sortByField] > item2[sortByField];
  });
  return array;
}

export default reorder;

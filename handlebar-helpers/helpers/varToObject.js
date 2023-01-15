function varToObject(variable, key) {
  const result = {};
  result[key] = variable;

  return result;
}

export default varToObject;

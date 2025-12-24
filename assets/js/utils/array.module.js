function numberToArray(num) {
  const result = Array.from({ length: num }, (_, i) => i + 1);
  return result;
}

export default {
  numberToArray,
};

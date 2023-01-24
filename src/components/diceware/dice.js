let getRandom = function () {
  let input = new Uint32Array(1);
  window.crypto.getRandomValues(input);
  return input[0];
};

export default getRandom;

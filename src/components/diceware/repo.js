let getWordsMap = function (language) {
  let url = location.href + "diceware-" + language + ".txt";
  return loadWordsList(url).then((data) => data);
};

// returns list (array) of words
function getWordsListFromString(data) {
  let list = Array.from(data.split(/\n/));
  let newList = null;

  list.forEach((line, index) => {
    let [k, v] = line.split(/\s+/);
    if (newList == null) {
      newList = new Array(list.length);
    }
    newList[index] = v ? v : k;
  });
  return newList;
}

function loadWordsList(url) {
  return new Promise((resolve) => {
    let headers = new Headers();
    headers.append("Content-type", "text/plain; charset=UTF-8");
    fetch(url, headers)
      .then((res) => res.text())
      .then((data) => {
        let result = getWordsListFromString(data);
        resolve(result);
      });
  });
}

export default getWordsMap;

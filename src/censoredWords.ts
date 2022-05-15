const nodeFetch = require("node-fetch");

const censoredWordsUrl =
  "https://cdn.jsdelivr.net/gh/drrouen/NouBan-js/censoredWords.js";

module.exports = async function () {
  const censoredWords = await new Promise(async (resolve, reject) => {
    const resp = await nodeFetch(censoredWordsUrl);
    if (!resp.ok) {
      reject("Could not download " + censoredWordsUrl);
    }
    resolve(await resp.text());
  });

  return {
    code: censoredWords + "module.exports = {wordsArray, whiteList};",
    cacheable: true,
  };
};

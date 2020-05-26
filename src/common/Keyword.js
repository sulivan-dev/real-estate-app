export const createKeyword = text => {
  const keywordArray = [];
  const wordsArray = text.match(/("[^"]+"|[^"\s]+)/g);

  wordsArray.forEach(word => {
    let summaryWord = "";

    word.split("").forEach(letter => {
      summaryWord += letter;
      keywordArray.push(summaryWord.toLocaleLowerCase());
    })
  })

  let summaryLetter = "";
  text.split("").forEach(letter => {
    summaryLetter += letter;
    keywordArray.push(summaryLetter);
  })

  return keywordArray;
}

'use strict';
//select HTML elements
const displayFile = document.querySelector('#display-file');
const input = document.querySelector('.form__input');
const formCont = document.querySelector('.form-container');
const cardArt = document.querySelector('.cards-article');
const card = document.querySelector('.card__side');
const cardFront = document.querySelector('.card__side--front');
const cardBack = document.querySelector('.card__side--back');
const close = document.querySelector('.card__icon--back');
const listen = document.querySelector('.card__icon--front');
const cardTextFront = document.querySelector('.card__text--front');
const cardTextBack = document.querySelector('.card__text--back');
const formBtn = document.querySelector('.card__btn');
const nextBtn = document.querySelector('.cards-article__btn--next');
const cancelBtn = document.querySelector('.cards-article__btn--cancel');
const rememberedWordsCont = document.querySelector('.remembered-words');
const rememberedWordsList = document.querySelector('.remembered-words__list');

const wordsCounter = document.querySelector('.words-counter');
const rememberedWordsBtn = document.querySelector(
  '.cards-article__btn--remembered-words'
);
const rememberedWordsBtnCont = document.querySelector(
  '.cards-article__btn-cont'
);
let dataArr;
let randNum;
let rememberedWords = [];
const totalWords = 333;
let timer = 0;
//initialize web speech API
let speech = new SpeechSynthesisUtterance();
//function to generate random number based on the array length
const genRanNum = l => Math.floor(Math.random() * l);
const showWord = () => {
  if (dataArr.length === 0) {
    alert(
      `Congradulations!!! New words list is empty, your stats: ${totalWords} words remembered, time spent:${timer} spent on learing :)`
    );
    return;
  }
  randNum = genRanNum(dataArr.length);
  const engWord = dataArr[randNum][0];
  cardTextFront.innerText = engWord;
  speech.text = engWord;
  cardTextBack.innerText = dataArr[randNum][1];
};

////////////////////////////////////////////////
//////////////////Event listeners///////////////
////////////////////////////////////////////////
window.addEventListener('load', function () {
  const storageData = sessionStorage.getItem('wordsData');
  const storageRemeberedWords = sessionStorage.getItem('rememberedWords');
  if (!storageData) return;
  dataArr = JSON.parse(storageData);
  rememberedWords = JSON.parse(storageRemeberedWords);
  formCont.classList.add('hidden');
  cardArt.classList.remove('hidden');
  showWord();

  const html = rememberedWords.map(word => {
    return `<li>${word[0]} - ${word[1]}</li>`;
  });

  rememberedWordsList.insertAdjacentHTML('afterbegin', html.join(''));
  if (rememberedWords.length > 0)
    wordsCounter.innerHTML = `<span class="words-counter__num">${rememberedWords.length}</span>`;
});
input.addEventListener('change', function () {
  // const wordsNum = +prompt(
  //   'Please enter how many word you want to remember today?'
  // );

  const filename = this.value.split('\\').at(-1);
  if (!filename) return;
  // displayFile.insertAdjacentText('afterbegin', `Uploaded file: ${filename}\n`);
  const [file] = input.files;
  Papa.parse(file, {
    dynamicTyping: true,
    // preview: wordsNum,
    complete: function (results) {
      dataArr = results.data.map(wordArr => wordArr.splice(2, 2));
      dataArr = dataArr.map(word => [
        word[0].toLowerCase(),
        word[1].toLowerCase(),
      ]);

      formCont.classList.add('hidden');
      cardArt.classList.remove('hidden');
      showWord();
    },
  });
});
formBtn.addEventListener('click', function () {
  cardFront.classList.add('rotate');
  cardBack.classList.add('rotate');
});
close.addEventListener('click', function () {
  cardFront.classList.remove('rotate');
  cardBack.classList.remove('rotate');
});
listen.addEventListener('click', function () {
  window.speechSynthesis.speak(speech);
});
nextBtn.addEventListener('click', function () {
  card.classList.add('slide-out');

  setTimeout(() => {
    card.classList.remove('slide-out');
    showWord();
  }, 700);
});

cancelBtn.addEventListener('click', function () {
  if (dataArr.length > 0) {
    rememberedWords.push(dataArr[randNum]);
    const html = `<li>${dataArr[randNum][0]} - ${dataArr[randNum][1]}</li>`;
    dataArr.splice(randNum, 1);
    rememberedWordsList.insertAdjacentHTML('afterbegin', html);
    wordsCounter.innerHTML = `<span class="words-counter__num">${rememberedWords.length}</span>`;
  }

  card.classList.add('shake-animation');
  setTimeout(() => {
    card.classList.remove('shake-animation');
    showWord();
  }, 500);
});

rememberedWordsBtn.addEventListener('click', function (e) {
  e.preventDefault();
  rememberedWordsCont.classList.contains('hidden')
    ? (rememberedWordsBtn.innerHTML = '🗃')
    : (rememberedWordsBtn.innerHTML = '🗄');
  rememberedWordsCont.classList.toggle('hidden');
  rememberedWordsCont.classList.toggle('slide-in');
});

//makes sure if page reloads data is not lost
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('wordsData', JSON.stringify(dataArr));
  sessionStorage.setItem('rememberedWords', JSON.stringify(rememberedWords));
});

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
const showBtn = document.querySelector('.card__btn');
const nextBtn = document.querySelector('.cards-article__btn--next');
const cancelBtn = document.querySelector('.cards-article__btn--cancel');
const rememberedWordsCont = document.querySelector('.remembered-words');
const rememberedWordsList = document.querySelector('.remembered-words__list');
const wordsCounter = document.querySelector('.words-counter');
//prettier-ignore
const rememberedWordsBtn = document.querySelector('.cards-article__btn--remembered-words');
//prettier-ignore
const rememberedWordsBtnCont = document.querySelector('.cards-article__btn-cont');

//create variables
let dataArr;
let randNum;
let rememberedWords = [];

//initialize web speech API
const speech = new SpeechSynthesisUtterance();

////////////////////////////////////////////////
//////////////////FUNCTIONS/////////////////////
////////////////////////////////////////////////

//function to generate random number based on the array length
const genRanNum = l => Math.floor(Math.random() * l);

//hide input and show card
const hideInputShowCard = () => {
  formCont.classList.add('hidden');
  cardArt.classList.remove('hidden');
};

// Shows words on the front and back of the card.
const showWord = () => {
  if (dataArr.length === 0) {
    alert(`Congradulations!!! You remembered all words :)`);
    return;
  }
  randNum = genRanNum(dataArr.length);
  const engWord = dataArr[randNum][0];
  const transaltion = dataArr[randNum][1];
  cardTextFront.innerText = engWord;
  speech.text = engWord;
  cardTextBack.innerText = transaltion;
};
// functions to initiate animation
const rotateCard = () => {
  cardFront.classList.add('rotate');
  cardBack.classList.add('rotate');
};
const returnCard = () => {
  cardFront.classList.remove('rotate');
  cardBack.classList.remove('rotate');
};
const slideCardAnimation = () => {
  card.classList.add('slide-out');
  setTimeout(() => {
    card.classList.remove('slide-out');
    showWord();
  }, 700);
};
const cardShakeAnimation = () => {
  card.classList.add('shake-animation');
  setTimeout(() => {
    card.classList.remove('shake-animation');
    showWord();
  }, 500);
};
const rememberedWordContAnimation = () => {
  rememberedWordsCont.classList.contains('hidden')
    ? (rememberedWordsBtn.innerHTML = '🗃')
    : (rememberedWordsBtn.innerHTML = '🗄');
  rememberedWordsCont.classList.toggle('hidden');
  rememberedWordsCont.classList.toggle('slide-in');
};

const updateCounter = () =>
  (wordsCounter.innerHTML = `<span class="words-counter__num">${rememberedWords.length}</span>`);
////////////////////////////////////////////////
//////////////////EVENT LISTENERS///////////////
////////////////////////////////////////////////
window.addEventListener('load', function () {
  const storageData = sessionStorage.getItem('wordsData');
  const storageRemeberedWords = sessionStorage.getItem('rememberedWords');
  //GUARD CLAUSE
  if (!storageData) return;
  // parse data from session storage
  dataArr = JSON.parse(storageData);
  rememberedWords = JSON.parse(storageRemeberedWords);
  //hiding input and showing card
  hideInputShowCard();
  showWord();
  // create new array of list items
  const rememberedWordsListItems = rememberedWords.map(word => {
    return `<li>${word[0]} - ${word[1]}</li>`;
  });
  // add list items to list
  rememberedWordsList.insertAdjacentHTML(
    'afterbegin',
    rememberedWordsListItems.join('')
  );

  rememberedWords.length > 0 && updateCounter();
});
// convert uploaded CSV file into the object using papaparse library
input.addEventListener('change', function () {
  const filename = this.value.split('\\').at(-1);
  if (!filename) return;
  //destructure files array
  const [file] = input.files;
  Papa.parse(file, {
    dynamicTyping: true,
    complete: function (results) {
      dataArr = results.data.map(wordArr => wordArr.splice(2, 2));
      dataArr = dataArr.map(word => [
        word[0].toLowerCase(),
        word[1].toLowerCase(),
      ]);
      hideInputShowCard();
      showWord();
    },
  });
});
showBtn.addEventListener('click', rotateCard);
close.addEventListener('click', returnCard);
listen.addEventListener('click', () => window.speechSynthesis.speak(speech));
nextBtn.addEventListener('click', slideCardAnimation);

cancelBtn.addEventListener('click', function () {
  if (dataArr.length > 0) {
    rememberedWords.push(dataArr[randNum]);
    const html = `<li>${dataArr[randNum][0]} - ${dataArr[randNum][1]}</li>`;
    dataArr.splice(randNum, 1);
    rememberedWordsList.insertAdjacentHTML('afterbegin', html);
    updateCounter();
  }
  cardShakeAnimation();
});

// Remembered words container functionality
rememberedWordsBtn.addEventListener('click', function (e) {
  // prevents page from reloading
  e.preventDefault();
  rememberedWordContAnimation();
});

//saves data before page loads
window.addEventListener('beforeunload', () => {
  sessionStorage.setItem('wordsData', JSON.stringify(dataArr));
  sessionStorage.setItem('rememberedWords', JSON.stringify(rememberedWords));
});

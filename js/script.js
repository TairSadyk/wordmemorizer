'use strict';

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
let dataArr;
let speech = new SpeechSynthesisUtterance();
const genRanNum = () => Math.floor(Math.random() * 20);
const showWord = () => {
  const randNum = genRanNum();
  const engWord = dataArr[randNum][0];
  cardTextFront.innerText = engWord;
  speech.text = engWord;
  cardTextBack.innerText = dataArr[randNum][1];
};
input.addEventListener('change', function () {
  const filename = this.value.split('\\').at(-1);
  if (!filename) return;
  displayFile.insertAdjacentText('afterbegin', `Uploaded file: ${filename}\n`);
  const [file] = input.files;
  Papa.parse(file, {
    dynamicTyping: true,
    complete: function (results) {
      dataArr = results.data;
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
  card.classList.add('shake-animation');
  setTimeout(() => {
    card.classList.remove('shake-animation');
  }, 550);
});

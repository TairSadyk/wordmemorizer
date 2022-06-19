'use strict';

const displayFile = document.querySelector('#display-file');
const input = document.querySelector('.form__input');
const formCont = document.querySelector('.form-container');
const cardArt = document.querySelector('.cards-article');
const cardTextFront = document.querySelector('.card__text--front');
const cardTextBack = document.querySelector('.card__text--back');
let dataArr;
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
      const randNum = Math.floor(Math.random() * 20);
      cardTextFront.innerText = dataArr[randNum][0];
      cardTextBack.innerText = dataArr[randNum][1];
    },
  });
});

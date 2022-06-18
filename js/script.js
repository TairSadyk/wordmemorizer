'use strict';

const displayFile = document.querySelector('#display-file');
const input = document.querySelector('.form__input');
let dataArr;
input.addEventListener('change', function () {
  const filename = this.value.split('\\').at(-1);
  if (!filename) return;
  displayFile.insertAdjacentText('afterbegin', `Uploaded file: ${filename}\n`);
  const [file] = input.files;
  Papa.parse(file, {
    dynamicTyping: true,
    complete: function (results) {
      console.log('Finished:', results.data);
      dataArr = results.data;
    },
  });
});

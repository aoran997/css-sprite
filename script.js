/**
 * @type {HTMLInputElement}
 */
let fileIn = document.querySelector('#in')

fileIn.addEventListener('change', function (ev) {
  // console.log(fileIn.files)
})

fileIn.addEventListener('dragenter', function (ev) {
  document.querySelector('.file-in').classList.add('active')
})

fileIn.addEventListener('dragleave', function (ev) {
  document.querySelector('.file-in').classList.remove('active')
})

fileIn.addEventListener('drop', function (ev) {
  document.querySelector('.file-in').classList.remove('active')
})
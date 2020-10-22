import './assets/file_css.css'

function onChange(e) {
  globalThis.proxy.files = e.target.files
}

let div = document.createElement('div')
let input = document.createElement('input')
input.type = 'file'
input.multiple = true
input.onchange = onChange
input.accept = 'image/*'
div.append(input)
div.className = 'set-file'

const filejs = () => {
  globalThis.body.append(div)
}

export default filejs
let result = document.createElement('div')
result.className = 'result'

globalThis.showResult = (res) => {
  for (let i = 0; i < res.length; i++) {
    result.innerText = result.innerText + '\n' + res[i].name
  }
}

const resultjs = () => {
  globalThis.body.append(result)
}

export default resultjs
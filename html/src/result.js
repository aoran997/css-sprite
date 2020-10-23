import { FORP } from './assets/algo'
const panel = document.createElement('div')
panel.className = 'result'

globalThis.showResult = (res) => {
  panel.innerHTML = ''
  let params = new FormData()
  for (let i = 0; i < res.length; i++) {
    params.append('files', res[i])
  }
  
  fetch('http://127.0.0.1:5000/uploads', {
    method: 'post',
    body: params
  }).then(r => r.json()).then(res => {
    let div = document.createElement('div')
    div.className = 'assemble_img'
    let img = new Image()
    img.src = res.assembleImg
    div.append(img)
    img.onload = () => {
      setCanvasTrasnparentBackground(div)
    }
    let filesPanel = document.createElement('div')
    let files = params.getAll('files')
    for (let i in files) {
      let div = document.createElement('div')
      div.innerText = files[i].name
      filesPanel.append(div)
    }
    panel.append(filesPanel, div)
    // r.blob().then(blob => {
    //   console.log(r, x)
    //   let downFile = new FileReader()
    //   downFile.onload = function (e) {
    //     let elink = document.createElement('a')
    //     elink.download = r.headers.get('Content-Disposition').split('filename=')[1]
    //     elink.href = URL.createObjectURL(blob)

    //     document.body.append(elink)
    //     elink.click()
    //   }
    //   downFile.readAsDataURL(blob)
    // })
  })
}

function setCanvasTrasnparentBackground(panel) {
  let canvas = document.createElement('canvas')
    let ctx = canvas.getContext('2d')
    canvas.width = panel.clientWidth
    canvas.height = panel.clientHeight
    ctx.fillStyle = '#e5e5e5'
    let { width, height } = canvas
    width = width / 10
    height = height / 10
    for (let i = 0; i < width + 20; i+=2) {
      for (let j = 0; j < height + 20; j++) {
        ctx.rect((i - j % 2) * 10, j * 10, 10, 10)
      }
    }
    ctx.fill()
    panel.append(canvas)
}

const resultjs = () => {
  globalThis.body.append(panel)
}

export default resultjs
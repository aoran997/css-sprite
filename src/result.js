import { FORP } from './assets/algo'
const canvas = document.createElement('canvas')
canvas.className = 'result'
const ctx = canvas.getContext('2d')
let imgs = []

globalThis.showResult = (res) => {
  let position = new Proxy([], {
    set(target, key, value) {
      target[key] = value
      if (Number(key) === res.length - 1) {
        // FORP(target, (nice) => {
        //   canvas.width = nice.w
        //   canvas.height = nice.h
        //   nice.r.forEach(v => {
        //     ctx.drawImage(imgs[v.p], v.x, v.y, v.w, v.h)
        //   })
        // })
      }
      return true
    }
  })
  let params = new FormData()
  for (let i = 0; i < res.length; i++) {
    params.append('files', res[i])
  }
  
  fetch('http://localhost:5000/uploads', {
    method: 'post',
    // headers: {
    //   'Content-Type': 'multipart/form-data'
    // },
    body: params
  })

  for (let i = 0; i < res.length; i++) {
    // result.innerText = result.innerText + '\n' + res[i].name
    let reader = new FileReader()
    reader.readAsDataURL(res[i])
    reader.onload = () => {
      let img = new Image()
      img.src = reader.result
      imgs.push(img)
      position.push([img.naturalWidth, img.naturalHeight])
    }
  }
}

const resultjs = () => {
  globalThis.body.append(canvas)
}

export default resultjs
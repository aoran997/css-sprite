<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import {
    canvasSpan,
    putCanvasImg,
    uploadedList,
    type RendererData,
  } from '../store'
  import GrowingPacker from '../utils/packer.growing'
  import { get } from 'svelte/store'

  let list: RendererData[] = []
  let canvasSize = 1
  let showStyle = false
  let havCss = false

  function draw() {
    let packer = new GrowingPacker()
    let dom = document.querySelector('#puzzle') as HTMLCanvasElement
    if (!list.length) {
      return
    }
    canvasSize = 1
    let size = canvasSize
    let lastX = 0
    let lastY = 0
    dom.onwheel = (e) => {
      if (e.deltaY > 0) {
        size += 0.1
      } else {
        size -= 0.1
      }
      if (size < 0.5) {
        size = 0.5
      }
      if (size >= 5) {
        size = 5
      }
      if (size <= 1) {
        lastX = 0
        lastY = 0
      }
      dom.style.transform = `scale(${size}) translateX(${lastX / size}px) translateY(${lastY / size}px)`
      canvasSize = size
    }
    dom.style.transform = ''
    let draging = false
    dom.onmousedown = (md: MouseEvent) => {
      draging = true
      md.preventDefault()
      let offsetW = (dom.clientWidth * size - dom.clientWidth) / 2
      let offsetY = (dom.clientHeight * size - dom.clientHeight) / 2
      if (canvasSize <= 1) {
        return
      }
      let startX = md.clientX - lastX
      let startY = md.clientY - lastY
      function mousemove(mm: MouseEvent) {
        lastX = mm.clientX - startX
        lastY = mm.clientY - startY
        dom.style.transform = `scale(${size}) translateX(${lastX / size}px) translateY(${lastY / size}px)`
      }
      document.addEventListener('mousemove', mousemove)
      function recover() {
        if (draging) {
          return
        }
        let tmpX = Math.abs(lastX)
        let flagX = false
        if (tmpX > offsetW) {
          tmpX = tmpX - (tmpX - offsetW) / 10
          flagX = tmpX - offsetW <= 1
          if (lastX < 0) {
            tmpX = -tmpX
          }
          lastX = tmpX
        }

        let tmpY = Math.abs(lastY)
        let flagY = false
        if (tmpY > offsetY) {
          tmpY = tmpY - (tmpY - offsetY) / 10
          flagY = tmpY - offsetY <= 1
          if (lastY < 0) {
            tmpY = -tmpY
          }
          lastY = tmpY
        }

        dom.style.transform = `scale(${size}) translateX(${tmpX / size}px) translateY(${tmpY / size}px)`
        if (flagX && flagY) {
          return
        }
        requestAnimationFrame(recover)
      }
      window.addEventListener(
        'mouseup',
        () => {
          draging = false
          document.removeEventListener('mousemove', mousemove)
          recover()
        },
        { once: true }
      )
    }
    let span = Number(get(canvasSpan))
    let tmp = list.map((v) => {
      return {
        ...v,
        w: v.w + span,
        h: v.h + span,
      }
    })
    packer.fit(tmp, span)
    dom.width = Number(packer.root.w) - span
    dom.height = Number(packer.root.h) - span
    let [parentWidth, parentHeight] = [
      dom.parentElement?.clientWidth! - 20,
      dom.parentElement?.clientHeight! - 20,
    ]
    dom.style.width = packer.root.w + 'px'
    dom.style.height = packer.root.h + 'px'
    dom.style.backgroundSize = `${dom.width / 40}px ${dom.width / 40}px`
    let flag = 1
    if (packer.root.w > parentWidth) {
      flag = parentWidth / packer.root.w
    }
    if (packer.root.h > parentHeight) {
      flag =
        parentHeight / packer.root.h < flag
          ? parentHeight / packer.root.h
          : flag
    }
    //@ts-ignore
    dom.style.zoom = flag
    let ctx = dom.getContext('2d')
    let sty = ''
    console.log(tmp)
    for (let i = 0; i < tmp.length; i++) {
      ctx?.drawImage(
        tmp[i].img,
        tmp[i].fit.x,
        tmp[i].fit.y,
        tmp[i].rw,
        tmp[i].rh
      )
      let title = tmp[i].img.title
      title = title.replaceAll('.', '_').replaceAll(' ', '_')
      sty += `{name: ${title}} {  object-fit: none;  object-position:-${tmp[i].fit.x}px -${tmp[i].fit.y}px;  width: ${tmp[i].w}px;  height: ${tmp[i].h}px;}\n`
    }
    if (tmp.length) {
      putCanvasImg(dom.toDataURL())
    }
    styleHandle(sty)
  }

  function styleHandle(str: string) {
    if (str.length) {
        havCss = true
    } else {
        havCss = false
    }
    let dom = document.querySelector('.style .content')
    dom?.replaceChildren()
    let regex = new RegExp('({name: (.*?)}) ({{1})(.*)(}{1})')
    let regexResult = regex.exec(str)
    while (regexResult !== null) {
      let divFirst = document.createElement('div')
      let divLast = document.createElement('div')
      let a = document.createElement('a')
      a.innerText = `.${regexResult[2]}`
      a.className = 'class-title'
      a.setAttribute('title', '预览')
      divLast.innerText = regexResult[5]
      let regexDiv = new RegExp('.*?:{1}.*?;{1}')
      let str2 = regexResult[4]
      let regexDivResult = regexDiv.exec(str2)
      let divCenter: HTMLDivElement[] = []
      while (regexDivResult !== null) {
        let div = document.createElement('div')
        div.innerText = regexDivResult[0]
        dom?.appendChild(div)
        str2 = str2.replace(regexDivResult[0], '')
        regexDivResult = regexDiv.exec(str2)
        divCenter.push(div)
      }
      let className = regexResult[2]
      a.onclick = () => {
        // let img = new Image()
        // img.src = imgSrc
        // let style = ''
        // divCenter.forEach((v) => {
        //   style += v.innerText
        // })
        // img.style.cssText = style
        // let imgTag = document.createElement('div')
        // imgTag.innerText = `<img src="example" class="${className}" >`
        // document.querySelector('#preview')?.replaceChildren(imgTag, img)
      }
      divFirst.append(a, ' ', regexResult[3])
      dom?.append(divFirst, ...divCenter, divLast)
      str = str.replace(regexResult[0], '')
      regexResult = regex.exec(str)
    }
  }

  uploadedList.subscribe((value) => {
    list = value
    draw()
  })

  canvasSpan.subscribe((value) => {
    draw()
  })

  function showCss() {
    showStyle = !showStyle
  }
</script>

<div class="center-content">
  <div class="puzzle">
    <canvas id="puzzle" class:scale={canvasSize > 1} />
  </div>
  <div class="style">
    <!-- svelte-ignore a11y-click-events-have-key-events -->
    <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div class="title" on:click={showCss} style={!havCss ? 'none' : ''}>Css</div>
    <div class="content" style={`height:${showStyle ? '300px' : '0'}; padding: ${showStyle ? '10px': '0 10px'}`}></div>
  </div>
</div>

<style scoped>
  .center-content {
    flex: 6;
    overflow: hidden;
    position: relative;
  }
  .puzzle {
    padding: 10px;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  #puzzle {
    background-image: conic-gradient(
      #828282 0 25%,
      #424242 0 50%,
      #828282 0 75%,
      #424242 0
    );
    background-size: 16px 16px;
    width: 0;
    height: 0;
  }

  #puzzle.scale {
    cursor: grab;
  }
  #puzzle.scale:active {
    cursor: grabbing;
  }

  .style {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
  }

  .style .title {
    background-color: #2b2e36;
    color: #e5e5e5;
    display: inline-block;
    padding: 2px 15px 25px 15px;
    font-size: 14px;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    transform: skew(2deg) translateY(21px);
    transition: transform .2s;
    cursor: pointer;
    box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.5);
    margin: 0 10px
  }

  .style .title:hover {
    transform: skew(2deg) translateY(17px);
  }

  .style .content {
    background: #2b2e36;
    z-index: 2;
    position: relative;
    color: #d8d8d8;
    padding: 0 10px;
    overflow: auto;
    height: 0;
    transition: height .2s;
    white-space: pre-wrap;
  }

  .style .content::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  .style .content::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: rgb(221, 222, 224);
    transition: 0.3s ease-in-out;
  }
</style>

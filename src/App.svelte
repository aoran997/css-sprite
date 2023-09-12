<script lang="ts">
  import './app.css'
  import FileIn from './lib/fileIn.svelte'
  import Puzzle from './lib/puzzle.svelte'
  import { canvasImgData } from './store'

  let puzzleHidden = true
  let styleFlag = false
  let cssStyle: any = null

  function puzzleHiddenHandle(event: CustomEvent) {
    puzzleHidden = event.detail
  }

  let list: Array<{ w: number; h: number; img: HTMLImageElement; fit?: any }> =
    []

  function loadImg(img: HTMLImageElement, i: number) {
    return new Promise<number[]>((resolve) => {
      img.onload = () => {
        resolve([img.naturalWidth, img.naturalHeight])
      }
    })
  }

  function styleHandle(event: CustomEvent<string>) {
    styleFlag = !!event.detail
    let dom = document.createElement('div')
    let regex = new RegExp('({name: (.*?)}) ({{1})(.*)(}{1})')
    let str = event.detail
    let regexResult = regex.exec(str)
    while (regexResult !== null) {
        let divFirst = document.createElement('div')
        let divLast = document.createElement('div')
        let a = document.createElement('a')
        a.innerText = `.${regexResult[2]}`
        a.className = 'class-title'
        a.setAttribute('title', '预览')
        divFirst.append(a, ' ', regexResult[3])
        divLast.innerText = regexResult[5]
        let regexDiv = new RegExp('.*?:{1}.*?;{1}')
        let str2 = regexResult[4]
        let regexDivResult = regexDiv.exec(str2)
        let divCenter = []
        while(regexDivResult !== null) {
            let div = document.createElement('div')
            div.innerText = regexDivResult[0]
            dom?.appendChild(div)
            str2 = str2.replace(regexDivResult[0], '')
            regexDivResult = regexDiv.exec(str2)
            divCenter.push(div)
        }
        a.onclick = () => {
            console.log(canvasImgData)
        }
        dom?.append(divFirst, ...divCenter, divLast)
        str = str.replace(regexResult[0], '')
        regexResult = regex.exec(str) 
    }
    cssStyle = dom.outerHTML
  }
  

  async function fileList(
    event: CustomEvent<Array<{ name: string; size: number; img: string }>>
  ) {
    list = []
    let tmp = []
    for (let i = 0; i < event.detail.length; i++) {
      let img = new Image()
      img.src = event.detail[i].img
      img.title = event.detail[i].name
      let size = await loadImg(img, i)
      tmp[i] = {
        img,
        w: size[0],
        h: size[1],
      }
    }
    function sort(a: { w: number }, b: { w: number }) {
      return b.w - a.w
    }
    tmp.sort(sort)
    list = tmp
  }
</script>

<main>
  <h1 class="title" style="text-align: center;">CSS Sprite</h1>
  <p style="text-align: center;">雪碧图生成器</p>
  <div class="content">
    <FileIn on:puzzleHidden={puzzleHiddenHandle} on:fileList={fileList} />
    <Puzzle {puzzleHidden} {list} on:styleHandle={styleHandle} />
  </div>
  {#if styleFlag}
  <div id="code">
    {@html cssStyle}
  </div>
  {/if}
  <div id="preview" />
</main>

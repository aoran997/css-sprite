<script lang="ts">
  import { get } from 'svelte/store'
  import './app.css'
  import CenterContent from './lib/centerContent.svelte'
  import FileIn from './lib/fileIn.svelte'
  import LeftContent from './lib/leftContent.svelte'
  import Puzzle from './lib/puzzle.svelte'
  import RightContent from './lib/rightContent.svelte'
  import Title from './lib/title.svelte'
  import { imgSrc, uploadedList, type RendererData } from './store'

  let puzzleHidden = true
  let styleFlag = true
  let codeButtonStatus = 'normal'

  function puzzleHiddenHandle(event: CustomEvent) {
    puzzleHidden = event.detail
  }

  let list: Array<RendererData> = []

  uploadedList.subscribe(val => {
    list = val
  })

  function loadImg(img: HTMLImageElement, i: number) {
    return new Promise<number[]>((resolve) => {
      img.onload = () => {
        resolve([img.naturalWidth, img.naturalHeight])
      }
    })
  }

  function styleHandle(event: CustomEvent<string>) {
    styleFlag = !event.detail
    let dom = document.querySelector('#code .styles')
    dom?.replaceChildren()
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
        let img = new Image()
        img.src = imgSrc
        let style = ''
        divCenter.forEach((v) => {
          style += v.innerText
        })
        img.style.cssText = style
        let imgTag = document.createElement('div')
        imgTag.innerText = `<img src="example" class="${className}" >`
        document.querySelector('#preview')?.replaceChildren(imgTag, img)
      }
      divFirst.append(a, ' ', regexResult[3])
      dom?.append(divFirst, ...divCenter, divLast)
      str = str.replace(regexResult[0], '')
      regexResult = regex.exec(str)
    }
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
    // list = tmp
  }

  function copy() {
    let dom = document.querySelector('#code .styles') as HTMLDivElement
    //@ts-ignore
    navigator.permissions.query({ name: 'clipboard-write' }).then((res) => {
      if (res.state !== 'denied') {
        codeButtonStatus = 'loading'
        navigator.clipboard.writeText(dom.innerText).then(() => {
          codeButtonStatus = 'success'
        })
      }
    })
  }
</script>

<main>
  <div class="page-title">
    <Title />
  </div>
  <div class="content">
    <LeftContent />
    <CenterContent />
    <RightContent />
  </div>
</main>

<style scoped>
  .page-title {
    height: 3rem;
  }

  .content {
    height: calc(100vh - 3rem);
    display: flex;
  }
</style>

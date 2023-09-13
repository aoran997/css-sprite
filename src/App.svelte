<script lang="ts">
  import './app.css'
  import FileIn from './lib/fileIn.svelte'
  import Puzzle from './lib/puzzle.svelte'
  import Title from './lib/title.svelte'
  import { imgSrc } from './store'

  let puzzleHidden = true
  let styleFlag = true
  let codeButtonStatus = 'normal'

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
    list = tmp
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
    <FileIn on:puzzleHidden={puzzleHiddenHandle} on:fileList={fileList} />
    <Puzzle {puzzleHidden} {list} on:styleHandle={styleHandle} />
  </div>
  <div id="code" hidden={styleFlag}>
    <div class="styles" />
    <button
      class="copy"
      on:click={copy}
      on:mouseenter={() => (codeButtonStatus = 'normal')}
      on:touchstart={() => (codeButtonStatus = 'normal')}
    >
      <div>Copy</div>
      <div class="icon">
        {#if codeButtonStatus === 'normal'}
          <svg
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="200"
            ><path
              d="M672 832 224 832c-52.928 0-96-43.072-96-96L128 160c0-52.928 43.072-96 96-96l448 0c52.928 0 96 43.072 96 96l0 576C768 788.928 724.928 832 672 832zM224 128C206.368 128 192 142.368 192 160l0 576c0 17.664 14.368 32 32 32l448 0c17.664 0 32-14.336 32-32L704 160c0-17.632-14.336-32-32-32L224 128z"
              fill="currentColor"
            /><path
              d="M800 960 320 960c-17.664 0-32-14.304-32-32s14.336-32 32-32l480 0c17.664 0 32-14.336 32-32L832 256c0-17.664 14.304-32 32-32s32 14.336 32 32l0 608C896 916.928 852.928 960 800 960z"
              fill="currentColor"
            /><path
              d="M544 320 288 320c-17.664 0-32-14.336-32-32s14.336-32 32-32l256 0c17.696 0 32 14.336 32 32S561.696 320 544 320z"
              fill="currentColor"
            /><path
              d="M608 480 288.032 480c-17.664 0-32-14.336-32-32s14.336-32 32-32L608 416c17.696 0 32 14.336 32 32S625.696 480 608 480z"
              fill="currentColor"
            /><path
              d="M608 640 288 640c-17.664 0-32-14.304-32-32s14.336-32 32-32l320 0c17.696 0 32 14.304 32 32S625.696 640 608 640z"
              fill="currentColor"
            /></svg
          >
        {/if}
        {#if codeButtonStatus === 'loading'}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            width="200px"
            height="200px"
            viewBox="0 0 100 100"
            preserveAspectRatio="xMidYMid"
          >
            <path
              d="M10 50A40 40 0 0 0 90 50A40 42 0 0 1 10 50"
              fill="currentColor"
              stroke="none"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                dur="1s"
                repeatCount="indefinite"
                keyTimes="0;1"
                values="0 50 51;360 50 51"
              />
            </path>
          </svg>
        {/if}
        {#if codeButtonStatus === 'success'}
          <svg
            class="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            width="200"
            height="200"
            ><path
              d="M887.904 298.208c-12.864-12.064-33.152-11.488-45.216 1.408L415.936 753.984l-233.12-229.696C170.208 511.872 149.952 512 137.536 524.608c-12.416 12.576-12.256 32.864 0.352 45.248l256.48 252.672c0.096 0.096 0.224 0.128 0.32 0.224 0.096 0.096 0.128 0.224 0.224 0.32 2.016 1.92 4.448 3.008 6.784 4.288 1.152 0.672 2.144 1.664 3.36 2.144 3.776 1.472 7.776 2.24 11.744 2.24 4.192 0 8.384-0.832 12.288-2.496 1.312-0.544 2.336-1.664 3.552-2.368 2.4-1.408 4.896-2.592 6.944-4.672 0.096-0.096 0.128-0.256 0.224-0.352 0.064-0.096 0.192-0.128 0.288-0.224l449.184-478.208C901.44 330.592 900.768 310.336 887.904 298.208z"
              fill="currentColor"
            /></svg
          >
        {/if}
      </div>
    </button>
  </div>
  <div id="preview" />
</main>

<style scoped>
  .page-title {
    height: 3rem;
  }
</style>

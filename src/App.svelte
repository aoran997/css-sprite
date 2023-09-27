<script lang="ts">
  import './app.css'
  import CenterContent from './lib/centerContent.svelte'
  import LeftContent from './lib/leftContent.svelte'
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

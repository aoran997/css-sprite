<script lang="ts">
  import './app.css'
  import FileIn from './lib/fileIn.svelte'
  import Puzzle from './lib/puzzle.svelte'

  let puzzleHidden = true

  function puzzleHiddenHandle(event: CustomEvent) {
    puzzleHidden = event.detail
  }

  let list: Array<{ w: number; h: number; img: HTMLImageElement; fit: any }> =
    []

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
      let size = await loadImg(img, i)
      tmp[i] = {
        img,
        w: size[0],
        h: size[1],
        fit: {},
      }
    }
    list = tmp
  }
</script>

<main>
  <h1 class="title" style="text-align: center;">CSS Sprite</h1>
  <p style="text-align: center;">雪碧图生成器</p>
  <div class="content">
    <FileIn on:puzzleHidden={puzzleHiddenHandle} on:fileList={fileList} />
    <Puzzle {puzzleHidden} {list} />
  </div>
  <div class="code">
  </div>
</main>

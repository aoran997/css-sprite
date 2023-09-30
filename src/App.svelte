<script lang="ts">
  import './app.css'
  import CenterContent from './lib/centerContent.svelte'
  import LeftContent from './lib/leftContent.svelte'
  import RightContent from './lib/rightContent.svelte'
  import Title from './lib/title.svelte'

  function loadImg(img: HTMLImageElement, i: number) {
    return new Promise<number[]>((resolve) => {
      img.onload = () => {
        resolve([img.naturalWidth, img.naturalHeight])
      }
    })
  }

  function copy() {
    let dom = document.querySelector('#code .styles') as HTMLDivElement
    //@ts-ignore
    navigator.permissions.query({ name: 'clipboard-write' }).then((res) => {
      if (res.state !== 'denied') {
        // codeButtonStatus = 'loading'
        navigator.clipboard.writeText(dom.innerText).then(() => {
        //   codeButtonStatus = 'success'
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

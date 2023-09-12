<script lang="ts">
  import { afterUpdate, beforeUpdate, createEventDispatcher } from 'svelte'
  import GrowingPacker from '../utils/packer.growing'
  import { canvasImgData, putCanvasImageData } from '../store'

  export let puzzleHidden: boolean
  export let list: Array<{
    fit?: any
    w: number
    h: number
    img: HTMLImageElement
  }>

  const dispatch = createEventDispatcher()
  
  afterUpdate(() => {
    let packer = new GrowingPacker()
    let dom = document.querySelector('#puzzle') as HTMLCanvasElement
    packer.fit(list)
    dom.width = packer.root.w
    dom.height = packer.root.h
    dom.style.width = packer.root.w + 'px'
    dom.style.height = packer.root.h + 'px'
    let ctx = dom.getContext('2d')
    let sty = ''
    for (let i = 0; i < list.length; i++) {
        ctx?.drawImage(list[i].img, list[i].fit.x, list[i].fit.y, list[i].w, list[i].h)
        sty += `{name: ${list[i].img.title}} {  object-fit: none;  object-position:-${list[i].fit.x}px -${list[i].fit.y}px;  width: ${list[i].w}px;  height: ${list[i].h}px;}\n`
    }
    console.log(0, 0, packer.root.w, packer.root.h)
    if (!puzzleHidden) {
        putCanvasImageData(ctx?.getImageData(0, 0, packer.root.w, packer.root.h))
    }
    dispatch('styleHandle', sty)
  })
</script>

<div class="puzzle" hidden={puzzleHidden}>
  <canvas id="puzzle" />
</div>

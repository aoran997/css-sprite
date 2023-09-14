<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { canvasSpan, putCanvasImg, uploadedList } from '../store'
  import GrowingPacker from '../utils/packer.growing'
  import { get } from 'svelte/store'
  const dispatch = createEventDispatcher()

  let list: {
    img: HTMLImageElement
    w: number
    h: number
    fit?: any
  }[] = []

  function draw() {
    let packer = new GrowingPacker()
    let dom = document.querySelector('#puzzle') as HTMLCanvasElement
    console.log(list)
    if (!list.length) {
      return
    }
    let span = get(canvasSpan)
    packer.fit(list, Number(span))
    console.log(list, packer)
    dom.width = packer.root.w
    dom.height = packer.root.h
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
    for (let i = 0; i < list.length; i++) {
      ctx?.drawImage(
        list[i].img,
        list[i].fit.x,
        list[i].fit.y,
        list[i].w,
        list[i].h
      )
      sty += `{name: ${list[i].img.title}} {  object-fit: none;  object-position:-${list[i].fit.x}px -${list[i].fit.y}px;  width: ${list[i].w}px;  height: ${list[i].h}px;}\n`
    }
    if (list.length) {
      putCanvasImg(dom.toDataURL())
    }
    dispatch('styleHandle', sty)
  }

  uploadedList.subscribe((value) => {
    list = value
    draw()
  })

//   canvasSpan.subscribe(value => {
//     draw()
//   })
</script>

<div class="center-content">
  <div class="puzzle">
    <canvas id="puzzle" />
  </div>
</div>

<style scoped>
  .center-content {
    flex: 6;
    overflow: hidden;
  }
  .puzzle {
    padding: 10px;
    width: calc(100% - 20px);
    height: calc(100% - 20px);
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
</style>

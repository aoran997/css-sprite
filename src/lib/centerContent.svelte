<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import { canvasSpan, putCanvasImg, uploadedList, type RendererData } from '../store'
  import GrowingPacker from '../utils/packer.growing'
  import { get } from 'svelte/store'
  const dispatch = createEventDispatcher()

  let list: RendererData[] = []

  function draw() {
    let packer = new GrowingPacker()
    let dom = document.querySelector('#puzzle') as HTMLCanvasElement
    if (!list.length) {
      return
    }
    let size = 1
    dom.onwheel = (e) => {
        if (e.deltaY > 0) {
            size += 0.1
        } else {
            size -= 0.1
        }
        if (size < 0.5) {
            size = 0.5
        }
        dom.style.transform = `scale(${size})`
    }
    let span = Number(get(canvasSpan))
    let tmp = list.map(v => {
        return {
            ...v,
            w: v.w + span,
            h: v.h + span
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
      sty += `{name: ${tmp[i].img.title}} {  object-fit: none;  object-position:-${tmp[i].fit.x}px -${tmp[i].fit.y}px;  width: ${tmp[i].w}px;  height: ${tmp[i].h}px;}\n`
    }
    if (tmp.length) {
      putCanvasImg(dom.toDataURL())
    }
    dispatch('styleHandle', sty)
  }

  uploadedList.subscribe((value) => {
    list = value
    draw()
  })

  canvasSpan.subscribe(value => {
    draw()
  })
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

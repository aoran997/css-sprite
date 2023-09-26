import { get, writable, type Writable } from 'svelte/store'

export interface RendererData {
  img: HTMLImageElement
  w: number
  h: number
  fit?: any
  rw: number
  rh: number
}

export let uploadedList: Writable<Array<RendererData>> = writable([])
export let canvasSpan = writable(0)

function loadImg(img: HTMLImageElement, i: number) {
  return new Promise<number[]>((resolve) => {
    img.onload = () => {
      resolve([img.naturalWidth, img.naturalHeight])
    }
  })
}

export async function setUploadedList(
  list: Array<{ name: string; size: number; img: string }>
) {
  let tmp: Array<RendererData> = []
  for (let i = 0; i < list.length; i++) {
    let img = new Image()
    img.src = list[i].img
    img.title = list[i].name
    let size = await loadImg(img, i)
    tmp[i] = {
      img,
      w: size[0],
      h: size[1],
      rw: size[0],
      rh: size[1],
    }
  }
  function sort(a: { w: number }, b: { w: number }) {
    return b.w - a.w
  }
  tmp.sort(sort)
  uploadedList.set(tmp)
}

export let imgSrc: string = ''

export function putCanvasImg(img: string) {
  imgSrc = img
}

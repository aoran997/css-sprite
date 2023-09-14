import { writable, type Writable } from 'svelte/store';

export let uploadedList: Writable<Array<{ img: HTMLImageElement; w: number; h: number, fit?: any }>> = writable([])
export let canvasSpan = writable(50)
function loadImg(img: HTMLImageElement, i: number) {
  return new Promise<number[]>((resolve) => {
    img.onload = () => {
      resolve([img.naturalWidth, img.naturalHeight])
    }
  })
}

export async function setUploadedList(list: Array<{ name: string; size: number; img: string }>) {
  let tmp: Array<{ img: HTMLImageElement; w: number; h: number, fit?: any }> = []
  for (let i = 0; i < list.length; i++) {
    let img = new Image()
    img.src = list[i].img
    img.title = list[i].name
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
  uploadedList.set(tmp)
}

export let imgSrc: string = ''

export function putCanvasImg(img: string) {
  imgSrc = img
}
import App from './App.svelte'
import './app.css'

const app = new App({
  target: document.getElementById('app')!,
})

window.addEventListener('click', function (event) {
  let dom = event.target as HTMLElement
  if (dom.tagName === 'BUTTON') {
    let pointer = this.document.createElement('div')
    let max = Math.max(dom.clientHeight, dom.clientWidth)
    let scale = dom.clientHeight / dom.clientWidth > 1 ? dom.clientHeight / dom.clientWidth : dom.clientWidth / dom.clientHeight
    pointer.className = 'pointer'
    pointer.style.cssText = `width: ${max}px; height: ${max}px; left: ${event.clientX - max / 2}px;top: ${event.clientY - dom.clientHeight - max / 2}px`
    dom.appendChild(pointer)
    this.requestAnimationFrame(() => {
      pointer.style.opacity = `1`
      pointer.style.transform = `scale(${scale})`
      pointer.addEventListener('transitionend', (e) => {
        if (e.propertyName === 'opacity') {
          pointer.style.opacity = `0`
        }
      })
    })
  }
}, {
  capture: true
})

export default app
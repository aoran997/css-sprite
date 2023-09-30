import App from './App.svelte'
import './app.css'

const app = new App({
  target: document.getElementById('app')!,
})

window.addEventListener('click', function (event) {
  console.log(event)
}, {
  passive: true
})

export default app
import App from './App.svelte'
import './app.css'
import './utils/bin.packer';

const app = new App({
  target: document.getElementById('app')!,
})

export default app
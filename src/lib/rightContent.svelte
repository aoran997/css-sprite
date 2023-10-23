<script lang="ts">
  import { canvasSpan, imgSrc } from '../store'
  import Icon from './icon.svelte'

  let span = 0
  function change() {
    canvasSpan.set(span)
  }

  let src = ''

  imgSrc.subscribe((img) => {
    src = img
  })

  function downloadImg() {
    if (imgSrc) {
      let a = document.createElement('a')
      a.download = 'sprite.png'
      a.href = src
      a.click()
    }
  }
</script>

<div class="right-content">
  <label>
    <div class="title">span</div>
    <input type="text" bind:value={span} on:change={change} />
  </label>
  <button on:click={downloadImg} disabled={!src}>
    <div>export</div>
    <Icon name="download" style="" />
  </button>
</div>

<style scoped>
  .right-content {
    flex: 2;
    border-left: 1px solid var(--border-color);
    color: #9e9e9e;
  }
  input {
    background: transparent;
    border: none;
    outline: none;
    color: #9e9e9e;
  }
  label {
    display: flex;
    align-items: center;
    margin: 5px;
    padding: 5px;
    border: 1px solid var(--border-color);
    border-radius: 5px;
    gap: 5px;
  }

  label .title {
    transform: translateY(-2px);
  }

  label input {
    padding: 0;
  }

  label:hover,
  label:hover input {
    border-color: var(--theme-color);
    color: var(--theme-color);
  }
</style>

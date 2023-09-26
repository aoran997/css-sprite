<script lang="ts">
  import { canvasSpan } from '../store'
  import Icon from './icon.svelte'

    let span = 0
    function change() {
        canvasSpan.set(span)
    }
</script>

<div class="right-content">
  <label>
    <div class="title">span</div>
    <input type="text" bind:value={span} on:change={change}/>
  </label>
  <button>
    <div>export</div>
    <Icon name="download" style=""/>
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

  label:hover {
    border-color: var(--theme-color);
    color: var(--theme-color);
  }

  button {
    color: white;
    position: relative;
    border: 1px solid var(--border-color);
    margin: 5px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc(100% - 10px);
    height: 60px;
    border-radius: 10px;
    overflow: hidden;
    gap: 5px;
    font-size: 14px;
    background-color: transparent;
    cursor: pointer;
  }

  button:hover {
    color: var(--theme-color);
    border-color: var(--theme-color-1);
  }
</style>

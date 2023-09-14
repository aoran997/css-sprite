<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import Icon from './icon.svelte'

  export let name: string
  export let size: number
  export let src: string

  function fileSizeFormat(num: number) {
    let sizes = ['B', 'K', 'M', 'G']
    let index = 0
    let result = 0
    while (num >= 1) {
      result = num
      num = num / 1000
      if (num >= 1) {
        index++
      }
    }
    return result.toFixed(2) + sizes[index]
  }

  const dispatch = createEventDispatcher()

  function close() {
    dispatch('close')
  }
</script>

<div class="item">
  <img class="file-img" {src} alt={name} />
  <div class="name">
    {name}
  </div>
  <div class="size">
    {fileSizeFormat(size)}
  </div>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <span class="close" on:click={() => close()}>
    <Icon name="close" style=""/>
  </span>
</div>

<style scoped>
  .item {
    display: grid;
    height: 40px;
    align-items: center;
    justify-content: space-between;
    grid-template-columns: 60px 1fr 40px 20px;
    grid-template-rows: 40px;
    gap: 2px;
    align-items: center;
    padding: 0 5px;
    font-size: 14px;
  }

  .item .file-img {
    height: 100%;
    width: 100%;
    object-fit: contain;
  }

  .item .close {
    font-size: 20px;
    color: #a2aebe;
    display: flex;
  }

  .item .close:hover {
    color: #7d8794;
  }

  .item .name {
    flex: 1;
  }

  .size {
    font-size: 12px;
  }
</style>

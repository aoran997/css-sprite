<script lang="ts">
  import { createEventDispatcher } from 'svelte'

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

  const dispatch = createEventDispatcher();

  function close() {
    dispatch('close');
  }
</script>

<div class="item">
  <img class="file-img" src={src} alt={name} />
  <div class="name">
    {name}
  </div>
  <div class="size">
    {fileSizeFormat(size)}
  </div>
  <!-- svelte-ignore a11y-no-static-element-interactions -->
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <div class="close" on:click={() => close()}>
    <svg
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
    >
      <path
        d="M512 128C300.8 128 128 300.8 128 512s172.8 384 384 384 384-172.8 384-384S723.2 128 512 128zM672 627.2c12.8 12.8 12.8 32 0 44.8s-32 12.8-44.8 0L512 556.8l-115.2 115.2c-12.8 12.8-32 12.8-44.8 0s-12.8-32 0-44.8L467.2 512 352 396.8C339.2 384 339.2 364.8 352 352s32-12.8 44.8 0L512 467.2l115.2-115.2c12.8-12.8 32-12.8 44.8 0s12.8 32 0 44.8L556.8 512 672 627.2z"
        style="fill: currentColor;"
      /></svg
    >
  </div>
</div>

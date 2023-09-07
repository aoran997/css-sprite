<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import Item from './item.svelte'

  let draging = false
  let uploadPanel = true
  let list: Array<{ name: string; size: number; img: string }> = []

  const dispatch = createEventDispatcher()

  async function change(ev: Event) {
    let input = ev.target as HTMLInputElement
    let files = input.files!
    uploadPanel = false
    for (let i = 0; i < files.length; i++) {
      let src = URL.createObjectURL(files[i])
      list = list.concat({
        name: files[i].name,
        size: files[i].size,
        img: src,
      })
    }
    input.value = ''
    dispatch('fileList', list)
    dispatch('puzzleHidden', false)
  }
  function dragenter() {
    draging = true
  }
  function dragleave() {
    draging = false
  }
  function drop() {
    draging = false
  }

  function closeItem(index: number) {
    list = list.filter((v, k) => k !== index)
    if (!list.length) {
      uploadPanel = true
      dispatch('puzzleHidden', true)
    }
    dispatch('fileList', list)
  }
</script>

<div class="file-in" class:active={draging}>
  <div class="tips">
    <svg
      class="icon"
      viewBox="0 0 1024 1024"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      width="200"
      height="200"
      ><path
        style="fill: currentColor;"
        d="M815.6 441.2C808 299.2 689.9 186 545.9 186c-114.1 0-216.1 73.3-254.2 178.3C165.3 369.3 64 473.6 64 601c0 130.7 106.4 237 237.3 237h113.4a3.3 3.3 0 0 0 1.7-0.4 144.8 144.8 0 0 0 39.8-26c50.3-46.4 54.6-117.4 54.8-122.3V635a4 4 0 0 0-4-4h-68a4 4 0 0 1-3.3-6.2l100.2-152.1a4 4 0 0 1 6.7 0l100.3 152.1a4 4 0 0 1-3.4 6.2H571a4 4 0 0 0-4 4v55.5c-0.1 3.6-2.6 79.1-52.9 141a4 4 0 0 0 3.1 6.5h239.9C869 838 960 747.1 960 635.3a202.3 202.3 0 0 0-144.4-194.1z"
      /></svg
    >
    点击或拖拽上传文件
    <input
      id="in"
      type="file"
      accept="image/png,image/jpg"
      title="点击或拖拽上传文件"
      multiple
      draggable="true"
      on:change={change}
      on:dragenter={dragenter}
      on:dragleave={dragleave}
      on:drop={drop}
    />
  </div>
  <div class="upload-panel" hidden={uploadPanel}>
    <div class="list">
      {#each list as { name, size, img }, i}
        <Item {name} {size} src={img} on:close={() => closeItem(i)} />
      {/each}
    </div>
  </div>
</div>

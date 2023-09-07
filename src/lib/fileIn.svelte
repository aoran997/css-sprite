<script lang="ts">
  import { createEventDispatcher } from 'svelte'
  import Item from './item.svelte'

  let draging = false
  let uploadPanel = true
  let tips = false
  let inputHidden = false
  let list: Array<{ name: string; size: number; img: string }> = []

  const dispatch = createEventDispatcher()

  async function change(ev: Event) {
    let input = ev.target as HTMLInputElement
    let files = input.files!
    uploadPanel = false
    tips = true
    for (let i = 0; i < files.length; i++) {
      let src = URL.createObjectURL(files[i])
      list = list.concat({
        name: files[i].name,
        size: files[i].size,
        img: src
      })
    }
    dispatch('fileList', list)
    dispatch('puzzleHidden', false)
    inputHidden = true
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
      inputHidden = false
      tips = false
      uploadPanel = true
      dispatch('puzzleHidden', true)
    }
  }
</script>

<div class="file-in" class:active={draging}>
  <input
    id="in"
    type="file"
    accept="image/png,image/jpg"
    title="in"
    multiple
    draggable="true"
    hidden={inputHidden}
    on:change={change}
    on:dragenter={dragenter}
    on:dragleave={dragleave}
    on:drop={drop}
  />
  <div class="tips" hidden={tips}>点击或拖拽上传文件</div>
  <div class="upload-panel" hidden={uploadPanel}>
    <div class="list">
      {#each list as { name, size, img }, i}
        <Item {name} {size} src={img} on:close={() => closeItem(i)} />
      {/each}
    </div>
  </div>
</div>

<script lang="ts">
  import { setUploadedList } from '../store'
  import Icon from './icon.svelte'
  import Item from './item.svelte'

  let draging = false
  let uploadPanel = false
  let list: Array<{ name: string; size: number; img: string }> = []

  function load(reader: FileReader) {
    return new Promise<string>((resolve) => {
      reader.onload = () => {
        resolve(reader.result as string)
      }
    })
  }

  function closeItem(index: number) {
    list = list.filter((v, k) => k !== index)
    if (!list.length) {
      uploadPanel = false
    }
    setUploadedList(list)
  }

  async function change(ev: Event) {
    let input = ev.target as HTMLInputElement
    let files = input.files!
    uploadPanel = true
    for (let i = 0; i < files.length; i++) {
      let sameName = list.filter((v) => v.name === files[i].name)
      let name = files[i].name
      if (sameName.length) {
        continue
      }
      var reader = new FileReader()
      reader.readAsDataURL(files[i])
      let src = await load(reader)
      list = list.concat({
        name: name,
        size: files[i].size,
        img: src,
      })
    }
    input.value = ''
    setUploadedList(list)
  }
  function buttonClick(event: MouseEvent) {
    let dom = event.target as HTMLElement
    if (dom.tagName === 'BUTTON') {
        dom.querySelector('input').click()
    }
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
</script>

<div class="left-content">
  <button class="tips" class:active={draging} on:click={(event) => buttonClick(event)}>
    <Icon name="upload" style="font-size: 20px;"/>
    点击或拖拽上传文件
    <input
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
  </button>
  {#if uploadPanel}
    <div class="upload-panel">
      {#each list as { name, size, img }, i}
        <div>
            <Item {name} {size} src={img} on:close={() => closeItem(i)} />
        </div>
      {/each}
    </div>
  {/if}
</div>

<style scoped>
  .left-content {
    height: 100%;
    border-right: 1px solid var(--border-color);
    flex: 2;
  }

  input {
    opacity: 0;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    cursor: pointer;
  }

  .upload-panel {
    height: calc(100% - 82px);
    padding: 5px 0;
    color: #BDBDBD;
  }

  .upload-panel > div:not(:last-child) {
    margin-bottom: 5px;
  }
</style>

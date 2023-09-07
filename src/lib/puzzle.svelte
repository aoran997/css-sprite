<script lang="ts">
  import { afterUpdate, beforeUpdate } from 'svelte'
  import GrowingPacker from '../utils/packer.growing'

  export let puzzleHidden: boolean
  export let list: Array<{
    w?: number
    h?: number
    img: HTMLImageElement
  }>

  var blocks = [
    { w: 400, h: 800, c: 1 },
    { w: 100, h: 100, c: 2 },
    { w: 100, h: 100, c: 3 },
    { w: 80, h: 80, c: 4 },
    { w: 80, h: 80, c: 5 },
  ]
  
  afterUpdate(() => {
    let packer = new GrowingPacker()
    let dom = document.querySelector('#puzzle')
    packer.fit(list)
    console.log(list)
  })
</script>

<div class="puzzle" hidden={puzzleHidden}>
  <canvas id="puzzle" />
</div>

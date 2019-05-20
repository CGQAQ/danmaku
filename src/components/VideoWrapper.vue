<template>
  <section class="video-wrapper">
    <video src="http://localhost:9774/video" controls></video>
  </section>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import { DanmakuMachine } from '../lib/danmakuMachine'

  @Component({
    name: 'Video-wrapper'
  })
  export default class VideoWrapper extends Vue{
    readonly danmakuMachine = new DanmakuMachine(undefined, undefined, 'http://localhost:9774/danmaku')



    mounted() {
      console.log(this.danmakuMachine.danmakuData)
    }
  }
</script>

<style scoped>

</style>

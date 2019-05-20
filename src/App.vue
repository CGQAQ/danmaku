<template>
  <div id="app">
    <video-wrapper/>
  </div>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import Vue from 'vue'
  import VideoWrapper from "@/components/VideoWrapper.vue"

  @Component({
    components: {VideoWrapper}
  })
  export default class App extends Vue{
    mounted(): void {
    }
  }
</script>

<style lang="scss">
#app {
  display: grid;
  place-content: center;
  height: 100vh;
}
</style>

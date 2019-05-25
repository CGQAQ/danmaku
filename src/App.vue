<template>
  <div id="app">
    <video-wrapper/>
  </div>
</template>

<script lang="ts">
  import Component from 'vue-class-component'
  import Vue from 'vue'
  import VideoWrapper from "@/components/VideoWrapper.vue"
  import GlobalEvents from 'vue-global-events'


  Vue.component('GlobalEvents', GlobalEvents)

  @Component({
    components: {VideoWrapper}
  })
  export default class App extends Vue{
    mounted(): void {
    }
  }
</script>

<style lang="scss">
  @font-face {
    font-family: 'Material Icons';
    font-style: normal;
    font-weight: 400;
    src: url(https://fonts.gstatic.com/s/materialicons/v47/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2) format('woff2');
  }

  .material-icons {
    font-family: 'Material Icons', sans-serif;
    font-weight: normal;
    font-style: normal;
    font-size: 24px;
    line-height: 1;
    letter-spacing: normal;
    text-transform: none;
    display: inline-block;
    white-space: nowrap;
    word-wrap: normal;
    direction: ltr;
    -webkit-font-feature-settings: 'liga';
    -webkit-font-smoothing: antialiased;
  }

  * {
    margin: 0;
    padding: 0;
  }

  #app {
    display: grid;
    place-content: center;
    height: 100vh;
  }
</style>

<template>
  <section id="video-controller">
    <section id="video-controller-top">
      <Slider />
    </section>
    <section id="video-controller-bottom"></section>
  </section>
</template>

<script>
  import Slider from './Slider'
  export default {
    name: 'VideoControlbar',
    components: { Slider }
  }
</script>

<style scoped>
  #video-controller{
    display: grid;
    grid-template-rows: 2fr 3fr;
    height: 4rem;
    /*position: relative;*/
  }

  #video-controller-top {
    background-color: gray;
  }

  #video-controller-bottom {
    background-color: cyan;
  }
</style>

<template>
  <section class="danmaku-wrapper" @animationcancel="onAnimationEnd" @animationend="onAnimationEnd">
    {{data.content}}
  </section>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {BilibiliDanmaku} from '@/lib/types/danmaku'

  @Component({
    props: {
      data: BilibiliDanmaku,
    },
    methods: {
      onAnimationEnd(){
        console.log('endddd', this.$props.data.rowID)
        this.$emit('onAnimationEnd',
          {
            id: this.$props.data.rowID,
            mode: this.$props.data.getDanmakuType()
          }
        )
      }
    }
  })
  export default class extends Vue {
    mounted(){
      console.log('mounted', this.$props.data.rowID)
    }
  }
</script>

<style scoped>
  @keyframes move-left {
    from {
      transform: translateX(100vw);
    }
    to{
      transform: translateX(-150vw);
    }
  }

  .danmaku-wrapper{
    animation: move-left linear 5s;
  }
</style>

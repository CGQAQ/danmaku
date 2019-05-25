<template>
  <section
    class="danmaku-wrapper"
    :style="{
      color: color,
      'animation-play-state': this.$props.ongoing? 'running': 'paused',
      animation: animation
    }"

    @animationcancel="onAnimationEnd"
    @animationend="onAnimationEnd"
  >
    {{data.content}}
  </section>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {BilibiliDanmaku, DanmakuType} from '@/lib/types/danmaku'

  @Component({
    props: {
      data: BilibiliDanmaku,
      ongoing: Boolean
    },
  })
  export default class Danmaku extends Vue {
    color: string = "#FFFFFF";
    animation: string = "";

    $style

    mounted(){
      let data = this.$props.data as BilibiliDanmaku
      this.color = `#${(+(data).fontColor).toString(16)}`
      if(data.getDanmakuType() === DanmakuType.RTL){
        this.animation = `${this.$style['move-left']} linear 10s`
      }
      else if(data.getDanmakuType() === DanmakuType.TOP || data.getDanmakuType() === DanmakuType.BOTTOM){
        this.animation = `${this.$style['to-disappear']} linear 5s`
      }
    }

    onAnimationEnd(){
      // console.log('endddd', this.$props.data.rowID)
      this.$emit('onAnimationEnd',
        {
          id: this.$props.data.rowID,
          mode: this.$props.data.getDanmakuType()
        }
      )
    }
  }
</script>

<style module>
  @keyframes move-left {
    from {
      transform: translateX(100vw);
    }
    to{
      transform: translateX(-150vw);
    }
  }

  @keyframes to-disappear {
    to{
      display: none;
    }
  }
</style>

<style scoped>
  .danmaku-wrapper{
    font-weight: bold;
    text-shadow: rgb(0, 0, 0) 1px 0px 1px, rgb(0, 0, 0) 0px 1px 1px,
    rgb(0, 0, 0) 0px -1px 1px, rgb(0, 0, 0) -1px 0px 1px;
    font-size: 1.2rem;
    line-height: 1.2rem;
  }
</style>

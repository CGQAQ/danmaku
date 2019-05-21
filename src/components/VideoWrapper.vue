import { DanmakuType } from '../lib/types/danmaku'
import { DanmakuType } from '../lib/types/danmaku'
import { DanmakuType } from '../lib/types/danmaku'
import { DanmakuType } from '../lib/types/danmaku'
import { DanmakuType } from '../lib/types/danmaku'
import { DanmakuType } from '../lib/types/danmaku'
import { DanmakuType } from '../lib/types/danmaku'
import { DanmakuType } from '../lib/types/danmaku'
import { DanmakuType } from '../lib/types/danmaku'
<template>
  <section class="video-wrapper">
    <video src="http://localhost:9774/video" @timeupdate="timeChange" controls></video>
    <section class="danmaku-column" v-for="(dColumn, i) in  normalDanmakuPool" :key="i">
      <Danmaku
        v-for="(d) in dColumn"
        :key="d.rowID"
        :data="d"
        @onAnimationEnd="onDanmakuShouldRemove"
      />
    </section>
    <section class="danmaku-column">
      <Danmaku
        v-for="(item) in topDanmakuPool"
        :data="item"
        :key="item.rowID"
        @onAnimationEnd="onDanmakuShouldRemove"
      />
    </section>
    <section class="danmaku-column-reversed">
      <Danmaku
        v-for="(item) in bottomDanmakuPool"
        :data="item"
        :key="item.rowID"
        @onAnimationEnd="onDanmakuShouldRemove"
      />
    </section>
  </section>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {DanmakuMachine} from '@/lib/danmakuMachine'
  import {BilibiliDanmaku, DanmakuType} from '@/lib/types/danmaku'
  import Danmaku from "@/components/Danmaku.vue"

  @Component({
    name: 'Video-wrapper',
    components: {Danmaku}
  })
  export default class VideoWrapper extends Vue{
    readonly danmakuMachine = new DanmakuMachine(undefined, undefined, 'http://localhost:9774/danmaku')
    readonly threshold = 1.5

    topDanmakuPool = Array<BilibiliDanmaku>();
    bottomDanmakuPool = Array<BilibiliDanmaku>();
    normalDanmakuPool = Array<BilibiliDanmaku[]>();


    mounted() {
      this.danmakuMachine.danmakuStream.subscribe((danmaku: BilibiliDanmaku) => {
        const mode = danmaku.getDanmakuType()
        if (mode !== DanmakuType.LTR && mode !== DanmakuType.RTL) {
          // handle LTR and RTL separately temporarily
          if (mode === DanmakuType.TOP) {
            this.topDanmakuPool.push(danmaku)
          } else if (mode === DanmakuType.BOTTOM) {
            this.bottomDanmakuPool.push(danmaku)
          }
        } else if (mode === DanmakuType.RTL) {
          const poolLen = this.normalDanmakuPool.length
          if (poolLen === 0) {
            this.normalDanmakuPool.push([danmaku])
          } else {
            const columnLength: number = this.normalDanmakuPool[poolLen - 1].length
            const lastone: BilibiliDanmaku = this.normalDanmakuPool[poolLen - 1][columnLength - 1]
            if (Math.abs(lastone.time - danmaku.time) < this.threshold) {
              // console.log(this.normalDanmakuPool)
              this.normalDanmakuPool[poolLen - 1].push(danmaku)
            } else {
              this.normalDanmakuPool.push([danmaku])
            }
          }
        }
      })
    }

    timeChange(ev: Event) {
      this.danmakuMachine.currentTime = (ev.target as HTMLVideoElement).currentTime
    }

    onDanmakuShouldRemove(data: {id: string, mode: DanmakuType}){
      // console.log(this.normalDanmakuPool)
      if(data.mode !== DanmakuType.RTL && data.mode !== DanmakuType.LTR){
        if(data.mode === DanmakuType.TOP){
          const index = this.topDanmakuPool.findIndex(d => d.rowID === data.id)
          this.topDanmakuPool.splice(index, 1)
        }
        else if(data.mode === DanmakuType.BOTTOM) {
          const index = this.bottomDanmakuPool.findIndex(d => d.rowID === data.id)
          this.bottomDanmakuPool.splice(index, 1)
        }
      }
      else if(data.mode === DanmakuType.RTL){
        if(this.normalDanmakuPool[0].length > 1){
          const index = this.normalDanmakuPool[0].findIndex(d => d.rowID === data.id)
          this.normalDanmakuPool[0].splice(index, 1)
        }
        else {
          this.normalDanmakuPool.splice(0, 1)
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  .video-wrapper {
    position: relative;
  }

  .danmaku-column {
    display: flex;
    flex-direction: column;
    position: absolute;
    /*top: 0;*/
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .danmaku-column-reversed {
    @extend .danmaku-column;
    flex-direction: column-reverse;
  }
</style>

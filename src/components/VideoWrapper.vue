<template>
  <section class="video-wrapper" ref="videoWrapper">
    <section class="danmaku-wrapper">
      <video
        src="http://localhost:9774/video"
        ref="video"
        @timeupdate="timeChange"
        @loadedmetadata="loadedmetadata"
        @durationchange="durationChanged"
        @play="onPlay"
        @playing="onPlay"
        @waiting="onWaiting"
        @pause="onPause"
        controls
      >

      </video>
      <section
        class="danmaku-column"
        v-for="(dColumn, i) in  normalDanmakuPool"
        :key="i"
      >
        <Danmaku
          v-for="(d) in dColumn"
          :key="d.rowID"
          :data="d"
          :ongoing="ongoing"
          @onAnimationEnd="onDanmakuShouldRemove"
        />
      </section>
      <section class="danmaku-column">
        <Danmaku
          v-for="(item) in topDanmakuPool"
          :data="item"
          :key="item.rowID"
          :ongoing="ongoing"
          @onAnimationEnd="onDanmakuShouldRemove"
        />
      </section>
      <section class="danmaku-column-reversed">
        <Danmaku
          v-for="(item) in bottomDanmakuPool"
          :data="item"
          :key="item.rowID"
          :ongoing="ongoing"
          @onAnimationEnd="onDanmakuShouldRemove"
        />
      </section>
    </section>
    <VideoControlbar
      :currentTime="currentTime"
      :duration="totalTime"
      :playState="ongoing"
      @btnPlayClicked="btnPlayClicked"
      @timeChanged="dragged"
      @volumeChanged="volumeChanged"
      @reqFullScreen="reqFullScreen"
    />
  </section>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator'
  import {DanmakuMachine} from '@/lib/danmakuMachine'
  import {BilibiliDanmaku, DanmakuType} from '@/lib/types/danmaku'
  import Danmaku from "@/components/Danmaku.vue"
  import VideoControlbar from "@/components/VideoControlbar.vue"

  @Component({
    name: 'Video-wrapper',
    components: {VideoControlbar, Danmaku}
  })
  export default class VideoWrapper extends Vue{
    readonly danmakuMachine = new DanmakuMachine(undefined, undefined, 'http://localhost:9774/danmaku')
    readonly threshold = 1.5

    topDanmakuPool = Array<BilibiliDanmaku>();
    bottomDanmakuPool = Array<BilibiliDanmaku>();
    normalDanmakuPool = Array<BilibiliDanmaku[]>();
    ongoing = false;

    currentTime: number = 0;
    totalTime: number = 0;


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

    loadedmetadata(ev: Event){
      const duration = (ev.target as HTMLVideoElement).duration
      this.totalTime = duration
      this.currentTime = 0
    }

    durationChanged(ev: Event){
      const duration = (ev.target as HTMLVideoElement).duration
      this.totalTime = duration
      this.currentTime = 0
    }

    timeChange(ev: Event) {
      const time = (ev.target as HTMLVideoElement).currentTime
      this.danmakuMachine.currentTime = time
      this.currentTime = time
    }

    volumeChanged(ev: number){
      (this.$refs.video as HTMLVideoElement).volume = ev
    }

    dragged(ev: number) {
      (this.$refs.video as HTMLVideoElement).currentTime = ev
    }

    btnPlayClicked(ev: boolean){
      const video = this.$refs.video as HTMLVideoElement
      if(ev){
        video.play()
        this.ongoing = true
      }
      else {
        video.pause()
        this.ongoing = false
      }
    }

    reqFullScreen(ev: boolean) {
      (this.$refs.videoWrapper as HTMLElement).requestFullscreen()
    }

    onPlay() {
      this.ongoing = true
    }

    onPause() {
      this.ongoing = false
    }

    onWaiting() {
      this.ongoing = false
    }

    onDanmakuShouldRemove(data: {id: string, mode: DanmakuType}){
      // console.log(this.topDanmakuPool, data.id, data.mode, DanmakuType.TOP)
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
    /*position: relative;*/
    display: grid;
    grid-template-rows: auto auto;
    grid-row-gap: 1rem;
  }

  video {
    display: block; /** prevent extra space of bottom */
  }

  .danmaku-wrapper {
    position: relative;
  }

  .danmaku-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .danmaku-column-reversed {
    @extend .danmaku-column;
    flex-direction: column-reverse;
  }
</style>

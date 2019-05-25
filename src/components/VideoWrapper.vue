<template>
  <section class="video-wrapper" ref="videoWrapper">
    <GlobalEvents
      @mousemove="onMousemove"
    />
    <section
      class="danmaku-wrapper"
      :style="{width: wrapperWidth}"
    >
      <video
        :src="videoURL"
        ref="video"
        @timeupdate="timeChange"
        @loadedmetadata="loadedmetadata"
        @durationchange="durationChanged"
        @play="onPlay"
        @playing="onPlay"
        @waiting="onWaiting"
        @pause="onPause"
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
      :loaded="loaded"
      :duration="totalTime"
      :playState="ongoing"
      :isFullscreen="isFullscreen"
      :style="{width: controlbarWidth}"
      v-show="showControlbar"
      @btnPlayClicked="btnPlayClicked"
      @timeChanged="dragged"
      @volumeChanged="volumeChanged"
      @reqFullScreen="reqFullScreen"
      @danmakuInputValueChanged="danmakuInputValueChanged"
    />
  </section>
</template>

<script lang="ts">
  import {Component, Vue, Prop} from 'vue-property-decorator'
  import {DanmakuMachine} from '@/lib/danmakuMachine'
  import {BilibiliDanmaku, DanmakuType} from '@/lib/types/danmaku'
  import Danmaku from "@/components/Danmaku.vue"
  import VideoControlbar from "@/components/VideoControlbar.vue"

  @Component({
    name: 'Video-wrapper',
    components: {VideoControlbar, Danmaku}
  })
  export default class VideoWrapper extends Vue{
    danmakuMachine: DanmakuMachine|null = null
    readonly threshold = 1.5

    @Prop({type: String, default: '', required: true}) //
    videoURL

    @Prop({type: String, default: '', required: true})
    danmakuURL


    topDanmakuPool = Array<BilibiliDanmaku>();
    bottomDanmakuPool = Array<BilibiliDanmaku>();
    normalDanmakuPool = Array<BilibiliDanmaku[]>();
    ongoing = false;

    currentTime: number = 0;
    totalTime: number = 0;

    loaded: number = 0;

    isFullscreen = false

    wrapperWidth = '100%'
    controlbarWidth: string = 'auto';


    mounted() {
      this.danmakuMachine = new DanmakuMachine(undefined, undefined, this.danmakuURL);

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
      });

      (this.$refs.video as HTMLVideoElement).addEventListener('progress', (e: Event)=> {
        const videoEl = e.target as HTMLVideoElement
        this.loaded = videoEl.buffered.end(0)
        console.log(this.loaded, this.totalTime)
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
      const ele =  (this.$refs.videoWrapper as HTMLElement)
      if(!document.fullscreenElement){
        ele.requestFullscreen().then(() => this.isFullscreen = true)
        this.wrapperWidth = '100vw'
      }
      else{
        document.exitFullscreen().then(() => this.isFullscreen = false)
        this.wrapperWidth = '100%'
      }
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


    danmakuValue = ''
    onTyping = false;
    danmakuInputValueChanged(ev: string){
      this.danmakuValue = ev
      if(ev.length !== 0){
        this.onTyping = true
      } else {
        this.onTyping = false
      }
    }


    showControlbar = false;
    timeoutID: number|null = null
    onMousemove(){
      if(!this.timeoutID) {
        this.showControlbar = true
        this.timeoutID = setTimeout(() => {
          if(!this.onTyping){
            this.timeoutID = null;
            this.showControlbar = false;
          }
          else {
              this.timeoutID = null;
              this.onMousemove();
          }
        }, 2000)
      }
    }
  }
</script>

<style scoped lang="scss">
  .video-wrapper {
    /*position: relative;*/
    display: grid;
    grid-template-rows: auto;
    position: relative;
    justify-items: center;
    width: 75vw;
    height: 70vh;
  }

  video {
    display: inline-block; /** prevent extra space of bottom */
    width: 100%;
    height: 100%;
    object-fit: fill;
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

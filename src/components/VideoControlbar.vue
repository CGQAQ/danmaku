<template>
  <section id="video-controller">
    <section id="video-controller-top">
      <Slider
        :value="currentTime"
        :max="duration"
        @valueChanged="valueChanged"
      />
    </section>
    <section id="video-controller-bottom">
      <button
        id="btn-play"
        class="material-icons"
        @click="btnPlayClicked"
      >
        {{btnPlayContent}}
      </button>
      <section id="danmaku-input">
        <input
          id="input-danmaku"
          v-model="iptDanmakuContent">
        <button id="button-danmaku-send" class="material-icons">send</button>
      </section>
      <section id="video-volume">
        <Slider
          :max="1"
          :min="0"
          :value="volume"
          @valueChanged="volumeChanged"
        />
      </section>
      <section id="video-fullscreen">
        <button id="button-video-fullscreen" class="material-icons" @click="reqFullscreen">fullscreen</button>
      </section>
    </section>
  </section>
</template>

<script lang="ts">
  import Slider from '@/components/Slider'
  import { Component, Vue, Prop} from 'vue-property-decorator'

  @Component({
    name: 'VideoControlbar',
    components: {
      Slider
    }
  })
  export default class VideoControlbar extends Vue{
    @Prop({type: Number, required: true})
    currentTime

    @Prop({type: Number, required: true})
    duration

    @Prop({type: Boolean, required: true})
    playState

    btnPlayContent = 'play_arrow'

    iptDanmakuContent = '';

    volume: number = 0.5

    btnPlayClicked(ev: Event){
      if(this.playState){
        this.btnPlayContent = 'play_arrow'
        this.$emit('btnPlayClicked', false)
      }
      else {
        this.btnPlayContent = 'pause'
        this.$emit('btnPlayClicked', true)
      }
    }

    valueChanged(ev: number){
      this.$emit('timeChanged', ev)
    }

    volumeChanged(ev: number){
      this.$emit('volumeChanged', ev)
    }

    reqFullscreen(){
      this.$emit('reqFullScreen', true);
    }
  }
</script>

<style lang="scss" scoped>
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
    display: grid;
    grid-template-columns: 1fr 5fr 2fr 0.5fr;
    justify-content: space-between;
    align-items: center;
    justify-items: center;
  }

  #btn-play {
    width: 4rem;
    height: 100%;
  }

  #danmaku-input {
    display: flex;
    height: 75%;
    width: 100%;
  }

  #input-danmaku {
    width: 100%;
    font-size: 1rem;
    &:focus {
      outline: darkcyan 5px;
    }
    &:active {
      outline: darkcyan 5px;
    }
  }

  #button-danmaku-send {
    color: lightgreen;
    background-color: lightgrey;
  }

  #video-fullscreen {
    justify-self: center;
  }


  #video-volume {
    height: 75%;
    width: 100%;
  }
</style>

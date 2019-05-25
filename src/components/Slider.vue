<template>
  <section
    id="--slider-wrapper"
    ref="sliderWrapper"
  >
    <GlobalEvents
      @mouseleave="mouseleave"
      @mousemove="mousemove"
      @mouseup="mouseup"
    ></GlobalEvents>
    <div
      id="--slider-main"
      ref="sliderMain"
      :style="{width: mainWidth}"
    ></div>
    <div
      id="--slider-secondary"
      ref="sliderSecondary"
      :style="{width: secondaryWidth}"
    ></div>
    <div
      id="--slider-thumb"
      ref="sliderThumb"
      :style="{left: thumbLeft}"
      @mousedown="mousedown"
    ></div>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue'
  import { Component, Prop, Watch } from 'vue-property-decorator'

  @Component({
    name: 'Slider'
  })
  export default class Slider extends Vue{
    @Prop({type: Number, required: false, default: () => 0})
    min: number

    @Prop({type: Number, required: false, default: () => 100})
    max: number

    @Prop({type: Number, required: false, default: () => 0})
    value: number

    @Prop({type: Number, required: false, default: () => 0})
    secondaryValue: number

    value_: number = 0;

    secondaryValue_: number = 0;

    isConcerned_: boolean = false;

    getWrapperWidth(){
      const sliderWrapper = this.$refs.sliderWrapper as HTMLElement
      if(!sliderWrapper) return 0;
      else return sliderWrapper.clientWidth;
    }

    getThumbWidth(){
      const sliderThumb = this.$refs.sliderThumb as HTMLElement
      if(!sliderThumb) return 0;
      else return sliderThumb.clientWidth;
    }

    get mainWidth() {
      // I'm totally an idiot!
      // if(!this.$refs.sliderMain) return '0px';
      // console.log(this.value_, this.max-this.min, this.getWrapperWidth()-this.getThumbWidth())

      return ( this.value_ / (this.max - this.min) )
        * (this.getWrapperWidth() - this.getThumbWidth())
        / this.getWrapperWidth()
        * 100 + '%';
    }

    get secondaryWidth() {
      return ( this.value_ / (this.max-this.min) ) + '%';
    }

    get thumbLeft() {
      return ( this.value_ / (this.max - this.min) )
        * (this.getWrapperWidth() - this.getThumbWidth())
        / this.getWrapperWidth()
        * 100 + '%';
    }

    @Watch('value')
    valueChanged(val: number){
      this.value_ = val
    }

    mounted() {
      this.value_ = this.value;

      this.$forceUpdate()
    }


    mousedown(ev: Event){
      ev.preventDefault()
      this.isConcerned_ = true;
    }

    mousemove(ev: MouseEvent){
      ev.preventDefault()
      if(this.isConcerned_){
        let x = ev.clientX - (this.$refs.sliderWrapper as HTMLElement).getBoundingClientRect().left - this.getThumbWidth() / 2
        if(x < 0) x = 0;
        if(x > this.getWrapperWidth() - this.getThumbWidth()) x = this.getWrapperWidth() - this.getThumbWidth();
        this.value_ = (x / (this.getWrapperWidth() - this.getThumbWidth())) * (this.max - this.min)
        this.$emit('valueChanged', this.value_)
      }
    }

    mouseup(ev: Event){
      ev.preventDefault()
      this.isConcerned_ = false;
    }

    mouseleave(ev: Event){
      ev.preventDefault()
      this.isConcerned_ = false;
    }
  }
</script>

<style scoped>
  #--slider-wrapper {
    height: 100%;
    position: relative;
    display: flex;
    align-items: center;
  }

  #--slider-main  {
    position: absolute;
    background-color: black;
    z-index: 20;
    height: 100%;
    width: 20%;
  }

  #--slider-secondary {
    position: absolute;
    background-color: darkgray;
    z-index: 10;
    height: 100%;
    width: 40%;
  }

  #--slider-thumb {
    position: absolute;
    background-color: darkcyan;
    width: 2rem;
    height: 2rem;
    z-index: 30;
    left: 20%;
  }
</style>

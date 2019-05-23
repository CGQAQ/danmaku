<template>
  <section id="--slider-wrapper" ref="sliderWrapper">
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
  import { Component, Prop } from 'vue-property-decorator'

  @Component
  export default class Slider extends Vue{
    @Prop({type: Number, required: false, default: () => 0})
    min: number = 0

    @Prop({type: Number, required: false, default: () => 100})
    max: number = 100

    @Prop({type: Number, required: false, default: () => 0})
    value: number = 0

    @Prop({type: Number, required: false, default: () => 0})
    secondaryValue: number = 0

    value_: number = 0;

    secondaryValue_: number = 0;

    isConcerned_: boolean = false;


    get mainWidth() {
      console.log(this.value_)
      if(!this.$refs.sliderMain) return '0px';
      return ( this.value_ / (this.max - this.min) )
        * (this.$refs.sliderWrapper as HTMLDivElement).clientWidth + 'px';
    }

    get secondaryWidth() {
      if(!this.$refs.sliderSecondary) return '0px';
      return ( this.value_ / (this.max-this.min) )
        * (this.$refs.sliderWrapper as HTMLDivElement).clientWidth + 'px';
    }

    get thumbLeft() {
      // 注意看这里！！！！！！！！！！
      // console.log(this.value_)

      if(!this.$refs.sliderThumb) return '0px';
      return ( this.value_ / (this.max-this.min) )
        * (this.$refs.sliderWrapper as HTMLDivElement).clientWidth + 'px';
    }

    mounted() {
      console.log(this.mainWidth, (this.$refs.sliderMain as HTMLDivElement).clientWidth)
    }


    mousedown(ev: Event){
      ev.preventDefault()
      this.isConcerned_ = true;
    }

    mousemove(ev: MouseEvent){
      ev.preventDefault()
      if(this.isConcerned_){
        let x = ev.clientX - (this.$refs.sliderWrapper as HTMLElement).getBoundingClientRect().left
        const width = (this.$refs.sliderWrapper as HTMLElement).clientWidth
        if(x < 0) x = 0;
        if(x > width) x = width;
        this.value_ = (x / width) * (this.max - this.min)
      }
    }

    mouseup(ev: Event){
      ev.preventDefault()
      this.isConcerned_ = false;
      console.log(this.isConcerned_)
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

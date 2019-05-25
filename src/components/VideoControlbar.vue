<template>
    <section id="video-controller">
        <section id="video-controller-top">
            <Slider
                :value="currentTime"
                :max="duration"
                :secondaryValue="loaded"
                @valueChanged="valueChanged"
            />
        </section>
        <section id="video-controller-bottom">
            <button id="btn-play" class="material-icons" @click="btnPlayClicked">{{btnPlayContent}}</button>

            <section
                id="video-time"
                style="color: #FF0000;"
            >{{`${new Date(currentTime * 1000).toISOString().substr(14,5)}`}}</section>

            <section id="danmaku-input">
                <input id="input-danmaku" v-model="iptDanmakuContent">
                <button id="button-danmaku-send" class="material-icons">send</button>
            </section>
            <section id="video-volume">
                <Slider :max="1" :min="0" :value="volume" @valueChanged="volumeChanged"/>
            </section>
            <section
                id="video-totaltime"
                style="color: #FF0000;"
            >{{`${new Date(duration * 1000).toISOString().substr(14,5)}`}}</section>
            <section id="video-fullscreen">
                <button
                    id="button-video-fullscreen"
                    class="material-icons"
                    @click="reqFullscreen"
                >{{isFullscreen?'fullscreen_exit':'fullscreen'}}</button>
            </section>
        </section>
    </section>
</template>

<script lang="ts">
import Slider from "./Slider.vue";
import { Component, Vue, Prop, Watch } from "vue-property-decorator";

@Component({
    name: "VideoControlbar",
    components: {
        Slider
    }
})
export default class VideoControlbar extends Vue {
    @Prop({ type: Number, required: true })
    currentTime;

    @Prop({ type: Number, required: true })
    duration;

    @Prop({ type: Number, required: true })
    loaded;

    @Prop({ type: Boolean, required: true })
    playState;

    @Prop({ type: Boolean, required: true })
    isFullscreen;

    btnPlayContent = "play_arrow";

    iptDanmakuContent = "";

    @Watch("iptDanmakuContent")
    danmakuInputValueChanged() {
        this.$emit("danmakuInputValueChanged", this.iptDanmakuContent);
    }

    volume: number = 0.5;

    mountet() {
        this.volumeChanged(this.volume);
    }

    btnPlayClicked(ev: Event) {
        if (this.playState) {
            this.btnPlayContent = "play_arrow";
            this.$emit("btnPlayClicked", false);
        } else {
            this.btnPlayContent = "pause";
            this.$emit("btnPlayClicked", true);
        }
    }

    valueChanged(ev: number) {
        this.$emit("timeChanged", ev);
    }

    volumeChanged(ev: number) {
        this.$emit("volumeChanged", ev);
    }

    reqFullscreen() {
        this.$emit("reqFullScreen", true);
    }
}
</script>

<style lang="scss" scoped>
#video-controller {
    display: grid;
    grid-template-rows: 2fr 3fr;
    height: 4rem;
    position: absolute;
    bottom: 20px;
    width: 100%;
}

#video-controller-top {
    background-color: gray;
}

#video-controller-bottom {
    background-color: #33333355;

    display: grid;
    grid-template-columns: 1fr 1fr 5fr 2fr 0.5fr 0.5fr;
    justify-content: space-between;
    align-items: center;
    justify-items: center;
}

#btn-play {
    height: 100%;
}

#video-time {
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

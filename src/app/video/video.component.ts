import {
    Component,
    OnInit,
    ElementRef,
    ViewChild,
    ChangeDetectionStrategy
} from '@angular/core';
import { DanmakuService } from '../services/danmaku.service';
import { BilibiliDanmaku } from '../types/danmaku';

import {
    createDanmakuObservable,
    CreateDanmakuObservableReturnType
} from '../Observables/danmaku';
import { Observable } from 'rxjs';

type Video = string;

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss'],
    changeDetection: ChangeDetectionStrategy.Default
})
export class VideoComponent implements OnInit {
    @ViewChild('videoElement')
    videoEle: ElementRef;
    @ViewChild('appVideoControls')
    appVideoControls: ElementRef;

    video: Video = this.danmaku._sources.video;
    danmakuObj: BilibiliDanmaku;
    danmakuObservables: CreateDanmakuObservableReturnType;
    currentTime: number = 0;
    totalTime: number;

    isPlaying: boolean = false;
    constructor(private danmaku: DanmakuService) {}

    canplay(e) {
        this.totalTime = e.target.duration;
    }

    ontimeupdate(e) {
        this.currentTime = e.target.currentTime;
        this.danmakuObservables.danmaku$.subscribe(d => {
            this.danmaku.danmakuMachine.send(d);
        });
    }

    durationchange(e) {
        this.totalTime = e.target.duration;
    }

    btnPlayClick() {
        // console.log('press', this.isPlaying);
        if (this.isPlaying) {
            this.videoEle.nativeElement.pause();
        } else {
            this.videoEle.nativeElement.play();
        }
        this.isPlaying = !this.isPlaying;
    }

    playBegun() {
        this.isPlaying = true;
        // console.log('begun');
    }

    playPaused() {
        this.isPlaying = false;
        // console.log('playPaused');
    }

    playWaiting() {
        this.isPlaying = false;
        // console.log('playWaiting');
    }

    onSeek(e) {
        console.log(e);
    }

    ngOnInit() {
        this.danmaku.getDanmakus().subscribe(d => {
            this.danmakuObservables = createDanmakuObservable(
                this.videoEle.nativeElement,
                d
            );
        });
        this.totalTime = this.videoEle.nativeElement.t;
    }
}

import {
    Component,
    OnInit,
    ElementRef,
    ViewChild,
    ChangeDetectionStrategy,
    Input
} from '@angular/core';
import { DanmakuService } from '../services/danmaku.service';

import { PlayService } from '../services/play-service.service';

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

    @Input() videoSrc: string;

    currentTime: number = 0;
    totalTime: number;

    constructor(
        private danmakuService: DanmakuService,
        private playService: PlayService
    ) {}

    canplay(e) {
        this.totalTime = e.target.duration;
    }

    ontimeupdate(e) {
        this.currentTime = e.target.currentTime;
        this.danmakuService.danmakuMachine.currentTime = this.currentTime;
    }

    durationchange(e) {
        this.totalTime = e.target.duration;
    }

    playBegun() {
        this.playService.isPlaying.next(true);
        // console.log('begun');
    }

    playPaused() {
        this.playService.isPlaying.next(false);
        // console.log('playPaused');
    }

    playWaiting() {
        this.playService.isPlaying.next(false);
        // console.log('playWaiting');
    }

    onSeek(e) {
        console.log(e);
    }

    ngOnInit() {
        this.totalTime = this.videoEle.nativeElement.currentTime;
        this.playService.videoEle = this.videoEle.nativeElement;
    }
}

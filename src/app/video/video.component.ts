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

    video: Video = this.danmakuService._sources.video;
    danmakuObj: BilibiliDanmaku;
    danmakuObservables: CreateDanmakuObservableReturnType;
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
        this.danmakuObservables.danmaku$.subscribe(d => {
            this.danmakuService.danmakuMachine.send(d);
        });
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
        this.danmakuService.getDanmakus().subscribe(d => {
            this.danmakuObservables = createDanmakuObservable(
                this.videoEle.nativeElement,
                d
            );
        });
        this.totalTime = this.videoEle.nativeElement.currentTime;
        this.playService.videoEle = this.videoEle.nativeElement;
    }
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BilibiliDanmaku } from '../lib/types/danmaku';
import { DanmakuService } from '../services/danmaku.service';
import { PlayService } from '../services/play-service.service';

@Component({
    selector: 'app-video-wrapper',
    templateUrl: './video-wrapper.component.html',
    styleUrls: ['./video-wrapper.component.scss']
})
export class VideoWrapperComponent implements OnInit {
    danmakusPool: BilibiliDanmaku[][] = [];
    counter: number = 0;

    _danmakuOngoing = true;

    videoSrc = this.danmakuService.source.video;

    constructor(
        private danmakuService: DanmakuService,
        private playService: PlayService,
        private cdr: ChangeDetectorRef
    ) {}

    animationEnd() {
        // if (this.danmakusPool.length > 0) {
        //     if (this.danmakusPool[0].length > 1) {
        //         this.danmakusPool[0].splice(0, 1);
        //     } else {
        //         this.danmakusPool.splice(0, 1);
        //     }
        // }
        if (this.danmakusPool.length > 0) {
            if (this.danmakusPool[0].length > 1) {
                this.counter++;
                if (this.danmakusPool[0].length <= this.counter) {
                    this.danmakusPool.splice(0, 1);
                    this.counter = 0;
                }
            } else {
                this.danmakusPool.splice(0, 1);
                this.counter = 0;
            }
        }
        // console.log('end', this.danmakusPool);
        this.cdr.detectChanges();
    }

    ngOnInit() {
        this.danmakuService.danmakuMachine.danmakuStream.subscribe(d => {
            // console.log(this);
            if (this.danmakusPool.length === 0) {
                this.danmakusPool.push([d]);
            } else if (this.danmakusPool.length > 0) {
                // this.danmakusPool.push(d);
                if (
                    Math.abs(
                        this.danmakusPool[this.danmakusPool.length - 1][0]
                            .time - d.time
                    ) < 1
                ) {
                    this.danmakusPool[this.danmakusPool.length - 1].push(d);
                } else {
                    this.danmakusPool.push([d]);
                }
            }
            this.cdr.detectChanges();
        });
        // window.dan = this.danmakuService.danmakuMachine;
        // window.t = this.danmakusPool;

        this.playService.isPlaying.subscribe(
            isPlay => (this._danmakuOngoing = isPlay)
        );
    }
}

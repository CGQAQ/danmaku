import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { BilibiliDanmaku, DanmakuType } from '../lib/types/danmaku';
import { DanmakuService } from '../services/danmaku.service';
import { PlayService } from '../services/play-service.service';

@Component({
    selector: 'app-video-wrapper',
    templateUrl: './video-wrapper.component.html',
    styleUrls: ['./video-wrapper.component.scss']
})
export class VideoWrapperComponent implements OnInit {
    _danmakusPool: BilibiliDanmaku[][] = [];
    _topDanmakuPool: BilibiliDanmaku[] = [];
    _bottomDanmakuPool: BilibiliDanmaku[] = [];
    counter: number = 0;

    _danmakuOngoing = true;

    videoSrc = this.danmakuService.source.video;

    constructor(
        private danmakuService: DanmakuService,
        private playService: PlayService,
        private cdr: ChangeDetectorRef
    ) {}

    onended(event) {
        // if (this.danmakusPool.length > 0) {
        //     if (this.danmakusPool[0].length > 1) {
        //         this.danmakusPool[0].splice(0, 1);
        //     } else {
        //         this.danmakusPool.splice(0, 1);
        //     }
        // }

        console.log(event);

        if (event == DanmakuType.TOP) {
            this._topDanmakuPool.splice(0, 1);
        } else if (event == DanmakuType.BOTTOM) {
            this._bottomDanmakuPool.splice(0, 1);
        } else {
            if (this._danmakusPool.length > 0) {
                if (this._danmakusPool[0].length > 1) {
                    this.counter++;
                    if (this._danmakusPool[0].length <= this.counter) {
                        this._danmakusPool.splice(0, 1);
                        this.counter = 0;
                    }
                } else {
                    this._danmakusPool.splice(0, 1);
                    this.counter = 0;
                }
            }
        }
        this.cdr.detectChanges();
    }

    ngOnInit() {
        this.danmakuService.danmakuMachine.danmakuStream.subscribe(d => {
            if (
                d.getMode() != DanmakuType.LTR &&
                d.getMode() != DanmakuType.RTL
            ) {
                console.log(`${d.getMode() + '来了'}`);
                if (d.getMode() == DanmakuType.TOP) {
                    this._topDanmakuPool.push(d);
                } else if (d.getMode() == DanmakuType.BOTTOM) {
                    this._bottomDanmakuPool.push(d);
                }

                return;
            }

            if (this._danmakusPool.length === 0) {
                this._danmakusPool.push([d]);
            } else if (this._danmakusPool.length > 0) {
                // this.danmakusPool.push(d);
                if (
                    Math.abs(
                        this._danmakusPool[this._danmakusPool.length - 1][0]
                            .time - d.time
                    ) < 1
                ) {
                    this._danmakusPool[this._danmakusPool.length - 1].push(d);
                } else {
                    this._danmakusPool.push([d]);
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

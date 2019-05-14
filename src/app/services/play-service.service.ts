import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PlayService {
    private _videoEle: HTMLVideoElement;
    private _isPlaying: Subject<boolean> = new Subject();

    constructor() {}

    public get videoEle() {
        return this._videoEle;
    }

    public set videoEle(v: HTMLVideoElement) {
        this._videoEle = v;
    }

    public get isPlaying() {
        return this._isPlaying;
    }

    public seek(to: number) {
        if (to >= 0 && to <= this._videoEle.duration) {
            this._videoEle.currentTime = to;
        }
    }

    public play() {
        this.videoEle.play();
    }

    public pause() {
        this.videoEle.pause();
    }
}

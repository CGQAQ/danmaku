import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class PlayServiceService {
    _videoEle: HTMLVideoElement;

    constructor() {}

    public get videoEle() {
        return this._videoEle;
    }

    public set videoEle(v: HTMLVideoElement) {
        this._videoEle = v;
    }

    public seek(to: number) {
        if (to >= 0 && to <= this._videoEle.duration) {
            this._videoEle.currentTime = to;
        }
    }
}

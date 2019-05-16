import { Injectable } from '@angular/core';
import { Subject, Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class PlayService {
    private _videoEle: HTMLVideoElement;
    private _isPlaying: Subject<boolean> = new Subject();
    private _timeChange: Observable<number>;
    private _duration: number;
    private _currentTime: number;

    constructor() {}

    public get videoEle() {
        return this._videoEle;
    }

    public set videoEle(v: HTMLVideoElement) {
        this._videoEle = v;
        this._timeChange = fromEvent(v, 'timeupdate').pipe(
            map(_ => v.currentTime)
        );
        v.onloadedmetadata = () => {
            this._duration = v.duration;
        };
        this._timeChange.subscribe(t => {
            this._currentTime = t;
        });
    }

    public get isPlaying() {
        return this._isPlaying;
    }

    public seek(to: number) {
        // console.log(to, this._videoEle.currentTime);
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

    public get timeChange(): Observable<number> {
        return this._timeChange;
    }

    public get duration() {
        return this._duration;
    }

    public get currentTime() {
        console.log(this._currentTime);
        return this._currentTime;
    }
}

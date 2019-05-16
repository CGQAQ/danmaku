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

        v.addEventListener('play', this.playBegun.bind(this));
        v.addEventListener('playing', this.playBegun.bind(this));
        v.addEventListener('pause', this.playPaused.bind(this));
        v.addEventListener('waiting', this.playWaiting.bind(this));
    }

    public get isPlaying() {
        return this._isPlaying.asObservable();
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
        return this._currentTime;
    }

    private playBegun() {
        this._isPlaying.next(true);
        // console.log('begun');
    }

    private playPaused() {
        this._isPlaying.next(false);
        // console.log('playPaused');
    }

    private playWaiting() {
        this._isPlaying.next(false);
        // console.log('playWaiting');
    }
}

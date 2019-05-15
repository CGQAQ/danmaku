import {
    Component,
    OnInit,
    Input,
    OnChanges,
    EventEmitter,
    Output,
    ChangeDetectorRef,
    SimpleChanges,
    ElementRef,
    ViewChild
} from '@angular/core';
import { NgStyle } from '@angular/common';
import { PlayService } from '../services/play-service.service';

@Component({
    selector: 'app-video-controls',
    templateUrl: './video-controls.component.html',
    styleUrls: ['./video-controls.component.scss']
})
export class VideoControlsComponent implements OnInit, OnChanges {
    @Input() videoTotalTime: number;
    @Input() videoTime: number;
    @Input() videoElement: HTMLVideoElement;
    @ViewChild('progress') progressRef: ElementRef<HTMLDivElement>;
    @ViewChild('progressplayed') progressplayedRef: ElementRef<HTMLDivElement>;

    @Output() progressbarDragged: EventEmitter<number> = new EventEmitter();

    progressBufferedStyle;
    progressPlayedStyle;
    progressThumbStyle;

    isDragging: boolean = false;
    _isPlaying: boolean = false;

    public get isPlaying(): boolean {
        return this._isPlaying;
    }

    public set isPlaying(v: boolean) {
        this._isPlaying = v;
        this.cdr.detectChanges();
    }

    btnPlayBackground = `url(../../assets/play.png)`;

    constructor(
        private playService: PlayService,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.progressPlayedStyle = {
            width: (this.videoTime / this.videoTotalTime) * 100 + '%'
        };
        this.playService.isPlaying.subscribe(b => {
            this.isPlaying = b;
            this.btnPlayBackground = b
                ? `url(../../assets/pause.png)`
                : `url(../../assets/play.png)`;
        });
    }

    ngOnChanges() {
        this.progressPlayedStyle = {
            width: (this.videoTime / this.videoTotalTime) * 100 + '%'
        };
        this.progressThumbStyle = {
            left: `calc(${(this.videoTime / this.videoTotalTime) * 100}%)`
        };
        // console.log(this.isPlaying);
    }

    btnPlayClick() {
        if (this.isPlaying) {
            this.playService.pause();
        } else {
            this.playService.play();
        }
    }

    onmousedown() {
        window;
        this.isDragging = true;
        // console.log('onmousedown');
    }
    onmousemove(e: MouseEvent) {
        if (this.isDragging) {
            let dest =
                e.movementX + this.progressplayedRef.nativeElement.clientWidth;
            let a =
                (e.movementX / this.progressRef.nativeElement.clientWidth) *
                this.playService.duration;
            this.progressbarDragged.emit(a);
            this.playService.seek(this.playService.currentTime + a);
            console.log(this.playService.currentTime);
        }
    }
    onmouseup(e: MouseEvent) {
        this.isDragging = false;
        // console.log('onmouseup');
    }

    onmouseout() {
        this.isDragging = false;
        // console.log('onmouseup');
    }
}

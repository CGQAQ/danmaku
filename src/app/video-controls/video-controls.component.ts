import {
    Component,
    OnInit,
    Input,
    OnChanges,
    EventEmitter,
    Output
} from '@angular/core';
import { NgStyle } from '@angular/common';

@Component({
    selector: 'app-video-controls',
    templateUrl: './video-controls.component.html',
    styleUrls: ['./video-controls.component.scss']
})
export class VideoControlsComponent implements OnInit, OnChanges {
    @Input() videoTotalTime: number;
    @Input() videoTime: number;
    @Input() videoElement: HTMLVideoElement;
    @Input() isPlaying: boolean;
    @Output() seek: EventEmitter<number> = new EventEmitter();
    @Output() btnPlayClickEmitter: EventEmitter<any> = new EventEmitter();

    progressBufferedStyle;
    progressPlayedStyle;
    progressThumbStyle;

    isDragging: boolean = false;

    btnPlayBackground = `url(../../assets/play.png)`;

    constructor() {}

    ngOnInit() {
        this.progressPlayedStyle = {
            width: (this.videoTime / this.videoTotalTime) * 100 + '%'
        };
    }

    ngOnChanges() {
        this.progressPlayedStyle = {
            width: (this.videoTime / this.videoTotalTime) * 100 + '%'
        };
        this.progressThumbStyle = {
            left: `calc(${(this.videoTime / this.videoTotalTime) * 100}%)`
        };
        this.btnPlayBackground = this.isPlaying
            ? `url(../../assets/pause.png)`
            : `url(../../assets/play.png)`;
    }

    btnPlayClick() {
        this.btnPlayClickEmitter.emit();
    }

    onmousedown() {
        window;
        this.isDragging = true;
        // console.log('onmousedown');
    }
    onmousemove(e: MouseEvent) {
        if (this.isDragging) {
            console.log('onmousemove', e.movementX);
            e.movementX / this.videoElement;
        }
    }
    onmouseup() {
        this.isDragging = false;
        // console.log('onmouseup');
    }

    onmouseout() {
        this.isDragging = false;
        // console.log('onmouseup');
    }
}

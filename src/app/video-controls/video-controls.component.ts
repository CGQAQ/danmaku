import {
    Component,
    OnInit,
    Input,
    OnChanges,
    EventEmitter,
    Output,
    ChangeDetectorRef
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

    progressBufferedStyle;
    progressPlayedStyle;
    progressThumbStyle;

    isDragging: boolean = false;
    isPlaying: boolean = false;

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
            this.cdr.detectChanges();
            console.log(this.isPlaying, b);
        });
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
        console.log(this.isPlaying);
    }

    btnPlayClick() {
        if (this.isPlaying) {
            this.playService.pause();
        } else {
            this.playService.play();
        }
        // this.cdr.detectChanges();
    }

    onmousedown() {
        window;
        this.isDragging = true;
        // console.log('onmousedown');
    }
    onmousemove(e: MouseEvent) {
        if (this.isDragging) {
            console.log('onmousemove', e.movementX);
            // let a = e.movementX / this.videoElement;
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

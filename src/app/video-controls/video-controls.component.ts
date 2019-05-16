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
    ViewChild,
    HostListener
} from '@angular/core';
import { NgStyle } from '@angular/common';
import { PlayService } from '../services/play-service.service';

@Component({
    selector: 'app-video-controls',
    templateUrl: './video-controls.component.html',
    styleUrls: ['./video-controls.component.scss']
})
export class VideoControlsComponent implements OnInit {
    @Input() videoTotalTime: number;
    @Input() videoTime: number;

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
        this.playService.isPlaying.subscribe(b => {
            this.isPlaying = b;
            this.btnPlayBackground = b
                ? `url(../../assets/pause.png)`
                : `url(../../assets/play.png)`;
        });
    }

    onSeek(e) {
        this.playService.seek(e)
    }

    btnPlayClick() {
        if (this.isPlaying) {
            this.playService.pause();
        } else {
            this.playService.play();
        }
    }
}

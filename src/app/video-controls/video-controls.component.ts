import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {PlayService} from '../services/play-service.service';

@Component({
    selector: 'app-video-controls',
    templateUrl: './video-controls.component.html',
    styleUrls: ['./video-controls.component.scss']
})
export class VideoControlsComponent implements OnInit {
    @Input() videoTotalTime: number;
    @Input() videoTime: number;

    _isDragging: boolean = false;
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
    ) {
    }

    ngOnInit() {
        this.playService.isPlaying.subscribe(b => {
            this.isPlaying = b;
            this.btnPlayBackground = b
                ? `url(../../assets/pause.png)`
                : `url(../../assets/play.png)`;
        });

        // this.playService.volumeChange.subscribe(a => console.log(a));
    }

    onSeek(e) {
        this.playService.seek(e);
    }

    onVolumeChange(e) {
        // console.log(e)
        if (e === undefined || e === null) {
            return;
        } else if (e <= 100 && e >= 0) {
            this.playService.ajustVolume(e);
        } else if (e > 100) {
            this.playService.ajustVolume(100);
        } else if (e < 0) {
            this.playService.ajustVolume(0);
        }
    }

    btnPlayClick() {
        if (this.isPlaying) {
            this.playService.pause();
        } else {
            this.playService.play();
        }
    }
}

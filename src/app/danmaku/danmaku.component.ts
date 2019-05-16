import {
    Component,
    OnInit,
    Input,
    HostBinding,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { BilibiliDanmaku } from '../lib/types/danmaku';

@Component({
    selector: 'app-danmaku',
    templateUrl: './danmaku.component.html',
    styleUrls: ['./danmaku.component.scss']
})
export class DanmakuComponent implements OnInit, OnChanges {
    @Input() data: BilibiliDanmaku;
    @Input() ongoing: boolean = true;

    @HostBinding('style.animation-play-state')
    _state: string;

    @HostBinding('style.color')
    _color: string;

    constructor() {}

    ngOnInit() {
        this._color = this.data.fontColor;
    }

    ngOnChanges(changes: SimpleChanges): void {
        this._state = this.ongoing ? 'running' : 'paused';
    }
}

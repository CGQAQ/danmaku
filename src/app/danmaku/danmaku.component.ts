import {
    Component,
    OnInit,
    Input,
    HostBinding,
    OnChanges,
    SimpleChanges,
    HostListener,
    Output,
    EventEmitter
} from '@angular/core';
import {
    BilibiliDanmaku,
    DanmakuType,
    fontSizeType
} from '../lib/types/danmaku';

@Component({
    selector: 'app-danmaku',
    templateUrl: './danmaku.component.html',
    styleUrls: ['./danmaku.component.scss']
})
export class DanmakuComponent implements OnInit, OnChanges {
    @Input() data: BilibiliDanmaku;
    @Input() ongoing: boolean = true;
    @Input() dtype: string;

    @Output()
    onended: EventEmitter<number> = new EventEmitter();

    @HostBinding('style.animation-play-state')
    _state: string;

    @HostBinding('style.color')
    _color: string;

    @HostBinding('style.animation-name')
    _animation_name: string;

    @HostBinding('style.animation-duration')
    _animation_duration: string;

    @HostBinding('style.animation-timing-function')
    _animation_timing_function: string;

    @HostBinding('style.left')
    _left: string;

    @HostBinding('style.align-self')
    _align_self: string;

    @HostBinding('style.margin-top')
    _margin_top: string;

    @HostBinding('style.font-size')
    _font_size: string;

    constructor() {}

    ngOnInit() {
        this._color = `#${(+this.data.fontColor).toString(16)}`;
        switch (this.data.getMode()) {
            case DanmakuType.RTL:
                this._animation_duration = `${10}s`;
                this._animation_name = 'move-left';
                this._animation_timing_function = 'linear';
                this._left = '90vw';
                this._align_self = 'left';
                this._margin_top = 'unset';
                this._font_size = `${this.data.fontSize}px`;
                break;

            case DanmakuType.TOP:
                this._animation_duration = '4s';
                this._animation_name = 'to-disappear';
                this._animation_timing_function = 'easein';
                this._left = '0';
                this._align_self = 'center';
                this._font_size = `${this.data.fontSize}px`;
                break;
            case DanmakuType.BOTTOM:
                this._animation_duration = '4s';
                this._animation_name = 'to-disappear';
                this._animation_timing_function = 'easein';
                this._left = '0';
                this._align_self = 'center';
                this._font_size = `${this.data.fontSize}px`;
                break;
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        this._state = this.ongoing ? 'running' : 'paused';
    }

    @HostListener('animationend')
    animatiion_end() {
        this.onended.emit(this.data.getMode());
    }
}

import { Component, OnInit, Input } from '@angular/core';
import { BilibiliDanmaku } from '../lib/types/danmaku';

@Component({
    selector: 'app-danmaku',
    templateUrl: './danmaku.component.html',
    styleUrls: ['./danmaku.component.scss']
})
export class DanmakuComponent implements OnInit {
    @Input() data: BilibiliDanmaku;
    constructor() {}

    ngOnInit() {}
}

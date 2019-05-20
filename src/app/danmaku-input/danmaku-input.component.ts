import {Component, Input, OnInit} from '@angular/core';
import { DanmakuService } from './../services/danmaku.service';
import { DanmakuType, BilibiliDanmaku} from './../lib/types/danmaku';

@Component({
    selector: 'app-danmaku-input',
    templateUrl: './danmaku-input.component.html',
    styleUrls: ['./danmaku-input.component.scss']
})
export class DanmakuInputComponent implements OnInit {
    @Input()
    _value: string = '';
    constructor(private danmakuService: DanmakuService) {}

    ngOnInit() {}

    // {
    //     content: this._value,
    //     date: Date.now()/1000,
    //     fontColor: 0xFFFFFF.toString(10),
    //     fontSize: 36,
    //     mode: DanmakuType.RTL,
    //     pool: 0,
    //     rowID: 0,
    //     time: Date.now()/1000,
    //     userID: 100000
    // }
    onSendClick() {
        const data = new BilibiliDanmaku(
            Math.floor(Date.now() / 1000),
            DanmakuType.RTL,
            36,
            0xFFFFFF.toString(10),
            Math.floor(Date.now() / 1000),
            0,
            0,
            0,
            this._value
        );
        // console.log(data)

        this.danmakuService.danmakuMachine.send(data);
        this._value = '';
    }

    onEnterClick() {
        const data = new BilibiliDanmaku(
            Math.floor(Date.now() / 1000),
            DanmakuType.RTL,
            36,
            0xFFFFFF.toString(10),
            Math.floor(Date.now() / 1000),
            0,
            0,
            0,
            this._value
        );
        // console.log(data)

        this.danmakuService.danmakuMachine.send(data);
        this._value = '';
    }
}

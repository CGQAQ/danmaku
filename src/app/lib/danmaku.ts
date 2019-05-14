import { Observable, Subject } from 'rxjs';

import { BilibiliDanmaku } from '../types/danmaku';

export interface IDamakuMachine {
    send(danmu: BilibiliDanmaku);
}

export class DanmakuMachine implements IDamakuMachine {
    state: Subject<BilibiliDanmaku[]>;

    constructor(source: Observable<BilibiliDanmaku[]>) {
        this.state = new Subject();
    }

    send(danmu: BilibiliDanmaku) {
        this.state.next([danmu]);
    }
}

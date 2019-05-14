import { Observable, fromEvent } from 'rxjs';
import { map } from 'rxjs/operators';
import { BilibiliDanmaku } from '../types/danmaku';

function search(source, number) {
    let index = 0,
        last = 0;
    for (let i = 0; i < source.length; i++) {
        if (Math.abs(source[i].time - number) < Math.abs(last - number)) {
            index = i;
        }
        last = source[i].time;
    }
    return index;
}

export type CreateDanmakuObservableReturnType = {
    danmaku$: Observable<BilibiliDanmaku>;
    danmakuLite$: Observable<BilibiliDanmaku>;
};

export const createDanmakuObservable = (
    videoElement: HTMLVideoElement,
    danmakus: BilibiliDanmaku[]
): CreateDanmakuObservableReturnType => {
    const time$ = fromEvent(videoElement, 'timeupdate').pipe(
        map(_ => videoElement.currentTime)
    );

    let lastIndex = 0,
        lastTime = 0;
    const danmaku$ = new Observable<BilibiliDanmaku>(subscriber => {
        // 火力全开
        time$.subscribe(time => {
            const index = search(danmakus, time);
            if (Math.abs(time - lastTime) > 1) {
                // user drag the progress bar
                subscriber.next(danmakus[index]);
            } else {
                for (let i = lastIndex; i < index; i++) {
                    subscriber.next(danmakus[i]);
                }
            }
            lastIndex = index;
            lastTime = time;
        });
    });

    const danmakuLite$ = new Observable<BilibiliDanmaku>(subscriber => {
        time$.subscribe(time => {
            //精简模式
            const dam = danmakus.reduce((p, c) => {
                return Math.abs(c.time - time) < Math.abs(p.time - time)
                    ? c
                    : p;
            });
            // console.log(d.srcElement.currentTime, dam.content);
            subscriber.next(dam);
        });
    });

    return { danmaku$, danmakuLite$ };
};

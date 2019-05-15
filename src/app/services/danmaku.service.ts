import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { xml2js } from 'xml-js';
import { BilibiliDanmaku } from '../lib/types/danmaku';
import { DanmakuMachine } from '../lib/danmakuMachine';

const res = {
    video: 'http://localhost:9774/video',
    danmaku: 'http://localhost:9774/danmaku'
};

@Injectable({
    providedIn: 'root'
})
export class DanmakuService {
    private _danmakuObj: Observable<string>;
    private _sources = res;
    private _danmakuMachine: DanmakuMachine;
    constructor(private http: HttpClient) {
        this._danmakuObj = http.get(res.danmaku, { responseType: 'text' });
        this._danmakuMachine = new DanmakuMachine(this.getDanmakus());
    }

    get source() {
        return this._sources;
    }

    getDanmakus() {
        return this._danmakuObj
            .pipe(map(str => xml2js(str).elements))
            .pipe(
                map(obj => {
                    if (!obj) return [];
                    else {
                        return obj[0].elements;
                    }
                })
            )
            .pipe(
                map(
                    (
                        arr: {
                            elements: Array<{ type: string; text: string }>;
                            attributes?: { p: string };
                            name: string;
                            type: string;
                        }[]
                    ) =>
                        arr
                            .filter(item => {
                                return item.name === 'd';
                            })
                            .map(item => {
                                let danmaku: BilibiliDanmaku;
                                let text = item.elements[0].text;
                                let params = item.attributes.p.split(',');
                                danmaku = new BilibiliDanmaku(
                                    +params[0],
                                    +params[1],
                                    +params[2],
                                    +params[3],
                                    +params[4],
                                    +params[5],
                                    params[6],
                                    params[7],
                                    text
                                );
                                return danmaku;
                            })
                            .sort((a, b) => a.time - b.time)
                )
            );
    }

    public get sources(): { video; danmaku } {
        return this._sources;
    }

    public get danmakuMachine() {
        return this._danmakuMachine;
    }
}

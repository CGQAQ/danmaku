/* eslint-disable */

import { Observable, Subject } from 'rxjs'
import { xml2js } from 'xml-js'

import { BilibiliDanmaku } from './types/danmaku'

import { DanmakuHandler } from './danmakuHandler'

interface IDamakuMachine {
    send(danmu: BilibiliDanmaku): void;
}

export enum DanmakuMode {
    INSANE,
    LITE
}

export class DanmakuMachine implements IDamakuMachine {
    private state: Subject<BilibiliDanmaku>;
    private _currentTime: number = 0;
    // @ts-ignore
    danmakuData: BilibiliDanmaku[];
    danmakuMode: DanmakuMode;

    get danmakuStream(): Observable<BilibiliDanmaku> {
      return this.state.asObservable()
    }

    currentTimeSubject: Subject<number>;
    // @ts-ignore
  danmakuHandler: DanmakuHandler;

    constructor(
      source?: Observable<BilibiliDanmaku[]>,
      sourceJson?: BilibiliDanmaku[],
      url?: string
    ) {
      this.state = new Subject()
      this.currentTimeSubject = new Subject()
      this.danmakuMode = DanmakuMode.INSANE

      if (source) {
        source.subscribe(d => {
          this.danmakuData = d
          this.danmakuHandler = new DanmakuHandler(d)
        })
      } else if (sourceJson) {
        this.danmakuData = sourceJson
        this.danmakuHandler = new DanmakuHandler(sourceJson)
      } else if (url) {
        fetch(url)
          .then(res => res.text())
          .then(text => xml2js(text))
          .then(obj => {
            if (!obj) return []
            else {
              // console.log(obj['elements'])
              // @ts-ignore
              return obj['elements'][0]['elements']
            }
          })
          .then(
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
                  return item.name === 'd'
                })
                .map(item => {
                  let danmaku: BilibiliDanmaku
                  let text = item.elements[0].text
                  // @ts-ignore
                  let params = item.attributes.p.split(',')
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
                  )
                  return danmaku
                })
                .sort((a, b) => a.time - b.time)
          )
          .then(d => {
            this.danmakuData = d
            this.danmakuHandler = new DanmakuHandler(d)
          })
      }
    }

    send(danmu: BilibiliDanmaku) {
      this.state.next(danmu)
    }

    set currentTime(time: number) {
      // set current vide time
      this._currentTime = time
      if (this.danmakuMode == DanmakuMode.INSANE) {
        this.danmakuHandler.insaneMode(time).subscribe(d => {
          if (d instanceof Array) {
            for (let i of d) {
              this.state.next(i)
            }
          } else {
            this.state.next(d)
          }
        })
      } else if (this.danmakuMode === DanmakuMode.LITE) {
        this.state.next(this.danmakuHandler.liteMode(time))
      }
    }

    get currentTIme() {
      return this._currentTime
    }
}

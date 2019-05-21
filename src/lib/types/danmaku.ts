/* eslint-disable */

// 来自 https://zhangshuqiao.org/2018-03/Bilibili%E5%BC%B9%E5%B9%95%E6%96%87%E4%BB%B6%E7%9A%84%E8%A7%A3%E6%9E%90/
export interface IBilibiliDanmaku {
    time: number; // 弹幕出现的时间，以秒为单位
    mode: number; // 弹幕的模式：1～3 滚动弹幕 4 底端弹幕 5 顶端弹幕 6 逆向弹幕 7 精准定位 8 高级弹幕
    fontSize: number; // 字号：12 非常小 16 特小 18 小 25 中 36 大 45 很大 64 特别大
    fontColor: number; // 字体的颜色：将 HTML 六位十六进制颜色转为十进制表示  例如 #FFFFFF 会被存储为 16777215
    date: number; // Unix 时间戳，以毫秒为单位，基准时间为 1970-1-1 08:00:00
    pool: number; // 弹幕池：0 普通池 1 字幕池 2 特殊池（注：目前特殊池为高级弹幕专用）
    userID: string; // 发送者的 ID，用于『屏蔽此弹幕的发送者』功能
    rowID: string; // 弹幕在弹幕数据库中 rowID，用于『历史弹幕』功能
    content: string;
    toString(): string;
}

export enum DanmakuType {
    TOP,
    BOTTOM,
    RTL,
    LTR,
    ABS,
    SUP,
    ERR = -1
}

export enum fontSizeType {
    XXS,
    XS,
    S,
    M,
    L,
    XL,
    XXL,
    ERR
}

export class BilibiliDanmaku implements IBilibiliDanmaku {
  constructor(
        public time: number,
        public mode: number,
        public fontSize: number,
        public fontColor: number,
        public date: number,
        public pool: number,
        public userID: string,
        public rowID: string,
        public content: string
  ) {}

  getDanmakuType() {
    switch (this.mode) {
      case 1:
      case 2:
      case 3:
        return DanmakuType.RTL
      case 4:
        return DanmakuType.BOTTOM
      case 5:
        return DanmakuType.TOP
      case 6:
        return DanmakuType.LTR
      case 7:
        return DanmakuType.ABS
      case 8:
        return DanmakuType.SUP
      default:
        return DanmakuType.ERR
    }
  }

  getFontSize() {
    switch (this.fontSize) {
      case 12:
        return fontSizeType.XXS
      case 16:
        return fontSizeType.XS
      case 18:
        return fontSizeType.S
      case 25:
        return fontSizeType.M
      case 36:
        return fontSizeType.L
      case 45:
        return fontSizeType.XL
      case 64:
        return fontSizeType.XXL
      default:
        return fontSizeType.ERR
    }
  }

  toString() {
    function getMode(num: number) {
      switch (num) {
        case 1:
        case 2:
        case 3:
          return `滚动弹幕 #${num}`
        case 4:
          return '底端弹幕'
        case 5:
          return '顶端弹幕'
        case 6:
          return '逆向弹幕'
        case 7:
          return '精准定位'
        case 8:
          return '高级弹幕'
        default:
          return '模式未识别'
      }
    }
    function getFontSize(num: number) {
      switch (num) {
        case 12:
          return '非常小'
        case 16:
          return '特小'
        case 18:
          return '小'
        case 25:
          return '中'
        case 36:
          return '大'
        case 45:
          return '很大'
        case 64:
          return '特別大'
        default:
          return '字体大小未识别'
      }
    }
    return `    时间： ${this.time}\n
        模式： ${getMode(this.mode)}\n
        字号： ${getFontSize(this.fontSize)}\n
        字体颜色：${this.fontColor}\n
        日期： ${new Date(this.date * 1000).toLocaleString('zh-cn')}\n
        用户ID： ${this.userID}\n
        弹幕池ID: ${this.pool}\n
        ROW ID： ${this.rowID}\n
        内容： ${this.content}
        `
  }
}

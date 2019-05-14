import { Component } from '@angular/core';
import { DanmakuService } from './services/danmaku.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    constructor(private danmaku: DanmakuService) {}
    title = 'danmaku';
}

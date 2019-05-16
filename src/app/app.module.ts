import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideoComponent } from './video/video.component';
import { VideoWrapperComponent } from './video-wrapper/video-wrapper.component';
import { DanmakuComponent } from './danmaku/danmaku.component';
import { VideoControlsComponent } from './video-controls/video-controls.component';
import { ProgressbarComponent } from './progressbar/progressbar.component';

@NgModule({
    declarations: [AppComponent, VideoComponent, VideoWrapperComponent, DanmakuComponent, VideoControlsComponent, ProgressbarComponent],
    imports: [BrowserModule, AppRoutingModule, HttpClientModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}

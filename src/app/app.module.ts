import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { MatInputModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { VideoComponent } from './video/video.component';
import { VideoWrapperComponent } from './video-wrapper/video-wrapper.component';
import { DanmakuComponent } from './danmaku/danmaku.component';
import { VideoControlsComponent } from './video-controls/video-controls.component';
import { ProgressbarComponent } from './progressbar/progressbar.component';
import { DanmakuInputComponent } from './danmaku-input/danmaku-input.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
    declarations: [
        AppComponent,
        VideoComponent,
        VideoWrapperComponent,
        DanmakuComponent,
        VideoControlsComponent,
        ProgressbarComponent,
        DanmakuInputComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        BrowserAnimationsModule,
        MatInputModule
    ],
    exports: [ MatInputModule ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DanmakuComponent } from './danmaku.component';

describe('DanmakuComponent', () => {
  let component: DanmakuComponent;
  let fixture: ComponentFixture<DanmakuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DanmakuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DanmakuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

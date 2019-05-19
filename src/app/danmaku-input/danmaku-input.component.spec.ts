import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DanmakuInputComponent } from './danmaku-input.component';

describe('DanmakuInputComponent', () => {
  let component: DanmakuInputComponent;
  let fixture: ComponentFixture<DanmakuInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DanmakuInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DanmakuInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

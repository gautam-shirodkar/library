import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReaderLayoutComponent } from './reader-layout.component';

describe('ReaderLayoutComponent', () => {
  let component: ReaderLayoutComponent;
  let fixture: ComponentFixture<ReaderLayoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReaderLayoutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReaderLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

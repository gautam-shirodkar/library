import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibrariansComponent } from './librarians.component';

describe('LibrariansComponent', () => {
  let component: LibrariansComponent;
  let fixture: ComponentFixture<LibrariansComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibrariansComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibrariansComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

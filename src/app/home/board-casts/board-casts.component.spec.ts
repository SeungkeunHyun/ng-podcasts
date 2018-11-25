import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardCastsComponent } from './board-casts.component';

describe('BoardCastsComponent', () => {
  let component: BoardCastsComponent;
  let fixture: ComponentFixture<BoardCastsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardCastsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardCastsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

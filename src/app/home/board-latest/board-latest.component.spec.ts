import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardLatestComponent } from './board-latest.component';

describe('BoardLatestComponent', () => {
  let component: BoardLatestComponent;
  let fixture: ComponentFixture<BoardLatestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardLatestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardLatestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

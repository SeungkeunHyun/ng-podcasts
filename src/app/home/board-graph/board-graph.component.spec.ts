import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardGraphComponent } from './board-graph.component';

describe('BoardGraphComponent', () => {
  let component: BoardGraphComponent;
  let fixture: ComponentFixture<BoardGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardGraphComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

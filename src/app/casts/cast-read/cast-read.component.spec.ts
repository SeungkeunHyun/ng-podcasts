import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastReadComponent } from './cast-read.component';

describe('CastReadComponent', () => {
  let component: CastReadComponent;
  let fixture: ComponentFixture<CastReadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CastReadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

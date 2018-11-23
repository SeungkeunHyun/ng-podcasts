import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastEditComponent } from './cast-edit.component';

describe('CastEditComponent', () => {
  let component: CastEditComponent;
  let fixture: ComponentFixture<CastEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CastEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

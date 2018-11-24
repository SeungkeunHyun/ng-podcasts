import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastMainComponent } from './cast-main.component';

describe('CastMainComponent', () => {
  let component: CastMainComponent;
  let fixture: ComponentFixture<CastMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CastMainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

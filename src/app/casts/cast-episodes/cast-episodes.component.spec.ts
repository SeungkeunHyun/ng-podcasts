import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CastEpisodesComponent } from './cast-episodes.component';

describe('CastEpisodesComponent', () => {
  let component: CastEpisodesComponent;
  let fixture: ComponentFixture<CastEpisodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CastEpisodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CastEpisodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

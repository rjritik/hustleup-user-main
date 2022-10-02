import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestJoinComponent } from './request-join.component';

describe('RequestJoinComponent', () => {
  let component: RequestJoinComponent;
  let fixture: ComponentFixture<RequestJoinComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequestJoinComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestJoinComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

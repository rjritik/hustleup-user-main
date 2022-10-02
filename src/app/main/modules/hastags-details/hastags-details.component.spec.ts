import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HastagsDetailsComponent } from './hastags-details.component';

describe('HastagsDetailsComponent', () => {
  let component: HastagsDetailsComponent;
  let fixture: ComponentFixture<HastagsDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HastagsDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HastagsDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

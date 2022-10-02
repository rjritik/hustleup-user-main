import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertintoBusinessaccountComponent } from './convertinto-businessaccount.component';

describe('ConvertintoBusinessaccountComponent', () => {
  let component: ConvertintoBusinessaccountComponent;
  let fixture: ComponentFixture<ConvertintoBusinessaccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConvertintoBusinessaccountComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertintoBusinessaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

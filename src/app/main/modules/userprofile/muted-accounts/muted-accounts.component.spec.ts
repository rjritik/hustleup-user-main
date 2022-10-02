import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MutedAccountsComponent } from './muted-accounts.component';

describe('MutedAccountsComponent', () => {
  let component: MutedAccountsComponent;
  let fixture: ComponentFixture<MutedAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MutedAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MutedAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

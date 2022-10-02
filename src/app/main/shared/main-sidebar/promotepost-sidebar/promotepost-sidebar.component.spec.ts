import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotepostSidebarComponent } from './promotepost-sidebar.component';

describe('PromotepostSidebarComponent', () => {
  let component: PromotepostSidebarComponent;
  let fixture: ComponentFixture<PromotepostSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromotepostSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PromotepostSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharepostSidebarComponent } from './sharepost-sidebar.component';

describe('SharepostSidebarComponent', () => {
  let component: SharepostSidebarComponent;
  let fixture: ComponentFixture<SharepostSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharepostSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharepostSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

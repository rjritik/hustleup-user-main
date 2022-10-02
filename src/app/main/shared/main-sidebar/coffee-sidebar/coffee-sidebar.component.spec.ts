import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoffeeSidebarComponent } from './coffee-sidebar.component';

describe('CoffeeSidebarComponent', () => {
  let component: CoffeeSidebarComponent;
  let fixture: ComponentFixture<CoffeeSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoffeeSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoffeeSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

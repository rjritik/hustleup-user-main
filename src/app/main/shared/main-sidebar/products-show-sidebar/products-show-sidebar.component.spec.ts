import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsShowSidebarComponent } from './products-show-sidebar.component';

describe('ProductsShowSidebarComponent', () => {
  let component: ProductsShowSidebarComponent;
  let fixture: ComponentFixture<ProductsShowSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsShowSidebarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsShowSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

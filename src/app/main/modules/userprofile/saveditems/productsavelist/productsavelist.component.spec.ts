import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsavelistComponent } from './productsavelist.component';

describe('ProductsavelistComponent', () => {
  let component: ProductsavelistComponent;
  let fixture: ComponentFixture<ProductsavelistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductsavelistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsavelistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

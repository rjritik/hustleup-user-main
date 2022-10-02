import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTypeSearchComponent } from './product-type-search.component';

describe('ProductTypeSearchComponent', () => {
  let component: ProductTypeSearchComponent;
  let fixture: ComponentFixture<ProductTypeSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductTypeSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTypeSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

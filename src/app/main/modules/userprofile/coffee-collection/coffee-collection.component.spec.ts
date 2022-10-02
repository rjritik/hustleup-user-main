import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoffeeCollectionComponent } from './coffee-collection.component';

describe('CoffeeCollectionComponent', () => {
  let component: CoffeeCollectionComponent;
  let fixture: ComponentFixture<CoffeeCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoffeeCollectionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoffeeCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

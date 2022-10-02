import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OwlcarouselComponent } from './owlcarousel.component';

describe('OwlcarouselComponent', () => {
  let component: OwlcarouselComponent;
  let fixture: ComponentFixture<OwlcarouselComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OwlcarouselComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OwlcarouselComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

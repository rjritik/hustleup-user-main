import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveditemsComponent } from './saveditems.component';

describe('SaveditemsComponent', () => {
  let component: SaveditemsComponent;
  let fixture: ComponentFixture<SaveditemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveditemsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveditemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

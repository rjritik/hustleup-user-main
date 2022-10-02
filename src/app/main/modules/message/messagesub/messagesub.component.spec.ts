import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MessagesubComponent } from './messagesub.component';

describe('MessagesubComponent', () => {
  let component: MessagesubComponent;
  let fixture: ComponentFixture<MessagesubComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MessagesubComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MessagesubComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

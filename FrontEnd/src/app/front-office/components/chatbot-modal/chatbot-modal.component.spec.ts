import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatbotModalComponent } from './chatbot-modal.component';

describe('ChatbotModalComponent', () => {
  let component: ChatbotModalComponent;
  let fixture: ComponentFixture<ChatbotModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatbotModalComponent]
    });
    fixture = TestBed.createComponent(ChatbotModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

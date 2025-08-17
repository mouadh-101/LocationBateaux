import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewChecked,
} from '@angular/core';
import {
  trigger,
  transition,
  style,
  animate,
} from '@angular/animations';
import { ChatService } from 'src/app/services/chat.service';
import { AuthService } from 'src/app/services/auth.service';

interface Message {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface QuickSuggestion {
  text: string;
  icon: string;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot-modal.component.html',
  styleUrls: ['./chatbot-modal.component.css'],
  animations: [
    trigger('messageAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class ChatbotModalComponent implements OnInit {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;
  @ViewChild('messageInput') messageInput!: ElementRef;

  isOpen = false;
  inputMessage = '';
  messages: Message[] = [];
  isTyping = false;
  unreadCount = 0;
  isLogedIn = false;
  userId: number | null = null;

  quickSuggestions: QuickSuggestion[] = [
    { text: 'Quels types de bateaux proposez-vous ?', icon: '⛵' },
    { text: 'Comment faire une réservation ?', icon: '📅' },
    { text: 'Quels sont vos tarifs ?', icon: '💰' },
    { text: 'Où sont situés vos ports ?', icon: '📍' },
  ];

  constructor(private chatService: ChatService, private authService: AuthService) { }

  ngOnInit() {
    setTimeout(() => {
      if (!this.isOpen && this.messages.length === 0) {
        this.unreadCount = 1;
      }
    }, 3000);
  }
  notificationPush(){
    setTimeout(() => {
      if (!this.isOpen && this.messages.length > 0) {
        this.unreadCount++;
      }
    }, 3000);
    
  }



  toggleOpen() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.unreadCount = 0;
      setTimeout(() => {
        this.messageInput?.nativeElement.focus();
      }, 300);
    }
  }

  send(): void {
    const messageText = this.inputMessage.trim();
    if (!messageText || this.isTyping) return;

    const userMessage: Message = {
      text: messageText,
      isUser: true,
      timestamp: new Date(),
    };
    this.messages.push(userMessage);
    this.inputMessage = '';
    this.isTyping = true;

    this.chatService.sendChatMessage(messageText).subscribe({
      next: (res) => {
        this.messages.push({
          text: res.response,
          isUser: false,
          timestamp: new Date(),
        });
        this.isTyping = false;
        this.scrollToBottom();
        this.notificationPush();

      },
      error: () => {
        this.messages.push({
          text: 'Désolé, une erreur est survenue. Veuillez réessayer plus tard.',
          isUser: false,
          timestamp: new Date(),
        });
        this.isTyping = false;
      },
    });
  }

  sendQuickMessage(suggestion: QuickSuggestion): void {
    this.inputMessage = suggestion.text;
    this.send();
  }

  formatTime(timestamp: Date): string {
    return timestamp.toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  private scrollToBottom(): void {
    try {
      this.messagesContainer.nativeElement.scrollTop =
        this.messagesContainer.nativeElement.scrollHeight;
    } catch (err) {
      console.error('Erreur lors du scroll automatique :', err);
    }
  }
}

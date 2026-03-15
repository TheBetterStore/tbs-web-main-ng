import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ChatService} from '../../services/chat.service';

interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent {
  isOpen = false;
  isLoading = false;
  userInput = '';
  messages: ChatMessage[] = [];

  constructor(private chatService: ChatService) {}

  toggle(): void {
    this.isOpen = !this.isOpen;
  }

  async send(): Promise<void> {
    const text = this.userInput.trim();
    if (!text || this.isLoading) return;

    this.messages.push({role: 'user', text});
    this.userInput = '';
    this.isLoading = true;

    try {
      const reply = await this.chatService.sendMessage(text);
      this.messages.push({role: 'assistant', text: reply});
    } catch (e: any) {
      this.messages.push({role: 'assistant', text: 'Sorry, something went wrong. Please try again.'});
      console.error('Chat error:', e);
    } finally {
      this.isLoading = false;
    }
  }
}

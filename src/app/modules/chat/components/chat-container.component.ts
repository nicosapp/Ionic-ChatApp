import { AuthService } from "./../../../services/auth.service";
import { MessageService } from "./../services/message.service";
import { ChatService } from "../services/chat.service";
import {
  Component,
  OnInit,
  Input,
  OnDestroy,
  AfterViewChecked,
  ElementRef,
  ViewChild,
} from "@angular/core";
import { Message } from "../chat.module";
import { Subscription } from "rxjs";

@Component({
  selector: "app-chat-container",
  template: `
    <div class="chat-container">
      <div class="scroll-container" #scrollMe>
        <app-messages-flow [messages]="messages"></app-messages-flow>
      </div>
      <app-text-box [chatId]="chatId"></app-text-box>
    </div>
  `,
  styles: [
    `
      .chat-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        background-color: var(--ion-color-light-shade);
      }
      .scroll-container {
        overflow: scroll;
        flex-grow: 1;
      }
    `,
  ],
})
export class ChatContainerComponent {
  @ViewChild("scrollMe") private myScrollContainer: ElementRef;
  @Input() chatId: number;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}

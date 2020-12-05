import { AuthService } from "./../../../services/auth.service";
import { MessageService } from "./../services/message.service";
import { ChatService } from "../services/chat.service";
import {
  Component,
  OnInit,
  Input,
  Output,
  OnDestroy,
  AfterViewChecked,
  ElementRef,
  ViewChild,
  EventEmitter,
} from "@angular/core";
import { Message } from "../chat.module";
import { Subscription } from "rxjs";
import { findLastIndex as _findLastIndex } from "lodash";

@Component({
  selector: "app-chat-container",
  template: `
    <div class="chat-container">
      <div class="scroll-container" #scrollMe>
        <app-messages-flow
          [messages]="messages"
          [lastMessageMemberIndex]="lastMessageMemberIndex"
        ></app-messages-flow>
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
      }
      .scroll-container {
        overflow: scroll;
        flex-grow: 1;
      }
    `,
  ],
})
export class ChatContainerComponent implements OnInit, OnDestroy {
  @ViewChild("scrollMe") private myScrollContainer: ElementRef;
  @Input() chatId: number;
  @Input() userId: number;
  @Output() online: EventEmitter<boolean> = new EventEmitter<boolean>();

  private messageSubscription: Subscription;
  private onlineSubscription: Subscription;
  private messages: Message[];
  private lastMessageMemberIndex: number;

  get orderedMessages() {
    return this.messages.reverse();
  }

  constructor(private messageService: MessageService) {}

  ngOnDestroy(): void {
    this.messageSubscription.unsubscribe();
    this.onlineSubscription.unsubscribe();
    this.messageService.unlisten();
  }
  ngOnInit(): void {
    this.messageService.setChatConfig({
      chatId: this.chatId,
      userId: this.userId,
    });
    this.messageSubscription = this.messageService.itemsSubject.subscribe(
      (messages) => {
        this.messages = messages;
        this.lastMessageMemberIndex = _findLastIndex(
          this.messages,
          (m) => m.user_id != this.userId
        );
        console.log(this.lastMessageMemberIndex);
      }
    );
    this.onlineSubscription = this.messageService.memberOnlineSubject.subscribe(
      (online) => {
        this.online.emit(online);
      }
    );
    this.messageService.listen();
    this.messageService.get().subscribe();
    this.messageService.emitItems();
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}

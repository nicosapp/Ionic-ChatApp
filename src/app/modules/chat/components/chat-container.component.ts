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
      <ion-content
        class="scroll-container"
        #scrollMe
        [scrollTop]="scrollMe.scrollHeight"
      >
        <app-messages-flow
          [messages]="messages"
          [lastMessageMemberIndex]="lastMessageMemberIndex"
          *ngIf="messages.length; else loading"
        >
          <ion-infinite-scroll
            infiniteScroll
            position="top"
            (ionInfinite)="doInfinite($event)"
          >
            <ion-infinite-scroll-content
              loadingSpinner="bubbles"
              loadingText="Loading more data..."
            >
            </ion-infinite-scroll-content>
          </ion-infinite-scroll>
        </app-messages-flow>
        <ng-template #loading>
          <chat-loading></chat-loading>
        </ng-template>
      </ion-content>

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
  private messages: Message[] = [];
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
        this.lastMessageMemberIndex = _findLastIndex(
          messages,
          (m) => m.user_id != this.userId
        );
        this.messages = messages;
        // setTimeout(() => {
        //   this.scrollToBottom();
        // }, 200);
      }
    );
    this.onlineSubscription = this.messageService.memberOnlineSubject.subscribe(
      (online) => {
        this.online.emit(online);
      }
    );
    this.messageService.listen();
    this.messageService.getMessages().subscribe();
    this.messageService.emitItems();
  }
  ngAfterViewChecked() {
    // this.scrollToBottom();
  }

  scrollToBottom(): void {
    console.log("ngChecked");
    // console.log(this.myScrollContainer.nativeElement.scrollHeight);
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  doInfinite(infiniteScroll) {
    this.messageService.getMessages().subscribe((payload) => {
      if (payload.finished) {
        infiniteScroll.target.disabled = true;
      } else if (payload.received) {
        infiniteScroll.target.complete();
      }
    });
  }
}

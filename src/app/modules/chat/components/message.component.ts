import { Message } from "./../interface";
import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-message",
  template: `
    <div class="message-box-container">
      <div
        class="message-box-wrapper"
        [ngClass]="{ right: message.me, left: !message.me }"
      >
        <div class="message-box">
          <div class="message-box-inner">
            {{ messageContent }}
          </div>
        </div>
        <ion-icon
          *ngIf="message.me && showIsReadIcon"
          class="is-read-icon"
          [name]="iconName"
          [ngClass]="{ 'is-read': isRead }"
        ></ion-icon>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .message-box-container {
        padding-bottom: 0.3rem;
        padding-right: 1rem;
        padding-left: 1rem;
      }
      .message-box-wrapper {
        display: flex;
      }
      .message-box-wrapper.right {
        justify-content: flex-end;
        align-items: flex-end;
        text-align: right;
      }
      .message-box-wrapper.left .message-box {
        background-color: var(--ion-color-light);
      }
      .message-box-wrapper.right .message-box {
        background-color: var(--ion-color-primary-tint) !important;
        color: var(--ion-color-primary-contrast) !important;
      }
      .message-box {
        background: white;
        max-width: 80%;
        min-width: 50%;
        padding: 8px;
        border-radius: 0.3rem;
      }
      .is-read-icon {
        display: block;
        height: 16px;
        width: 16px;
        margin-right: -0.3rem;
        margin-left: 0.3rem;
        margin-bottom: 0.3rem;
        color: var(--ion-color-light-shade);
      }
      .is-read-icon.is-read {
        color: var(--ion-color-primary-tint);
      }
    `,
  ],
})
export class MessageComponent implements OnInit {
  @Input() message: Message;
  @Input() showIsReadIcon: boolean;

  get iconName() {
    return this.message.id ? "heart-circle" : "heart-circle-outline";
  }
  get isRead() {
    return this.message.is_read;
  }

  get messageContent() {
    return this.message.message || "";
  }
  constructor() {}

  ngOnInit() {}
}

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
          <div class="message-box-inner">{{ messageContent }}</div>
        </div>
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
        margin-right: 1rem;
        margin-left: 1rem;
      }
      .message-box-wrapper {
        display: flex;
      }
      .message-box-wrapper.right {
        justify-content: flex-end;
        text-align: right;
      }
      .message-box-wrapper.right .message-box {
        background-color: var(--ion-color-primary-tint) !important;
        color: var(--ion-color-primary-contrast) !important;
      }
      .message-box {
        background: white;
        width: 80%;
        padding: 8px;
        border-radius: 0.3rem;
        border: solid 1px lightgrey;
      }
    `,
  ],
})
export class MessageComponent implements OnInit {
  @Input() message: Message;

  get messageContent() {
    return this.message.message || "";
  }
  constructor() {}

  ngOnInit() {}
}

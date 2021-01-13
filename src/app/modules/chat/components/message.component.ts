import { Message } from "./../interface";
import { Component, OnInit, Input } from "@angular/core";
import * as moment from "moment";

@Component({
  selector: "app-message",
  template: `
    <div class="message-box-container">
      <div *ngIf="isNewDay" class="message-date">
        {{ messageDate }}
      </div>
      <div
        class="message-box-wrapper"
        [ngClass]="{ right: message.me, left: !message.me }"
      >
        <div class="message-box">
          <div class="message-box-inner">
            {{ messageContent }}
          </div>
          <div class="message-time">{{ messageTime }}</div>
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
      .message-date {
        text-align: center;
        font-weight: 600;
        opacity: 0.6;
        margin: 8px;
      }
      .message-time {
        font-size: 0.8rem;
        opacity: 0.7;
        margin-top: 5px;
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
        padding-bottom: 4px;
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
  @Input() prev?: Message;
  @Input() next?: Message;
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

  get isNewDay() {
    const format = "YYYY-MM-DD";
    if (!this.prev) return true;
    return (
      moment(this.prev.created_at).format(format) !==
      moment(this.message.created_at).format(format)
    );
  }

  get messageDate() {
    let format = "MMMM Do YYYY";
    if (moment().diff(moment(this.message.created_at), "days") < 7)
      return moment(this.message.created_at).calendar(null, {
        lastDay: "[Yesterday]",
        sameDay: "[Today]",
        lastWeek: "[Last] dddd",
        sameElse: "dddd",
      });
    else if (moment().diff(moment(this.message.created_at), "years") < 1) {
      format = "MMMM Do";
    }
    return moment(this.message.created_at).format(format);
  }

  get messageTime() {
    return moment(this.message.created_at).format("HH:mm");
  }

  constructor() {}

  ngOnInit() {}
}

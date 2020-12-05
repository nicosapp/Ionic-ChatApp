import { Chat } from "./../interface";
import { Component, Input, OnInit } from "@angular/core";
import * as moment from "moment";

@Component({
  selector: "app-chats-list-item",
  template: `
    <ion-item>
      <ion-avatar slot="start">
        <img src="assets/avatar.png" />
      </ion-avatar>
      <ion-label [ngClass]="{ bold: !isRead }">
        <h2 *ngIf="friendName" class="name">{{ friendName }}</h2>
        <p *ngIf="createdAt" [ngClass]="{ 'medium--text': isRead }">
          {{ createdAt }}
        </p>
        <p *ngIf="message" [ngClass]="{ 'medium--text': isRead }">
          {{ message }}
        </p>
      </ion-label>
    </ion-item>
  `,
  styles: [
    `
      .name,
      .bold {
        font-weight: bold !important;
        color: black !important;
      }
    `,
  ],
})
export class ChatsListItemComponent implements OnInit {
  @Input() chat: any;

  get friendName() {
    if (this.chat.friend) return this.chat.friend.name;
    return null;
  }
  get lastMessage() {
    return this.chat.last_message || null;
  }
  get createdAt() {
    if (this.lastMessage) {
      let format = "LT";
      return moment(this.lastMessage.created_at).format(format);
    }
    return null;
  }

  get message() {
    if (this.lastMessage) return this.lastMessage.message;
    return null;
  }
  get isRead() {
    if (this.lastMessage)
      return this.chat.me.id === this.lastMessage.user_id
        ? true
        : this.lastMessage.is_read;
    return false;
  }
  constructor() {}

  ngOnInit() {}
}

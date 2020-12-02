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
      <ion-label>
        <h2 *ngIf="friendName" class="name">{{ friendName }}</h2>
        <h3 *ngIf="createdAt">{{ createdAt }}</h3>
        <p *ngIf="message">{{ message }}</p>
      </ion-label>
    </ion-item>
  `,
  styles: [
    `
      .name {
        font-weight: bold;
      }
    `,
  ],
})
export class ChatsListItemComponent implements OnInit {
  @Input() chat: any;
  get createdAt() {
    if (this.chat.last_message) {
      let format = "LT";
      return moment(this.chat.last_message.created_at).format(format);
    }
    return null;
  }
  get friendName() {
    if (this.chat.friend) return this.chat.friend.name;
    return null;
  }
  get message() {
    if (this.chat.last_message) return this.chat.last_message.message;
    return null;
  }
  constructor() {}

  ngOnInit() {}
}

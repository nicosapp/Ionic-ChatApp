import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-chat-modal",
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Chat</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <app-chat-container [chatId]="chatId"></app-chat-container>
    </ion-content>
  `,
  styles: [``],
})
export class ChatModalComponent implements OnInit {
  @Input() chatId: number;
  constructor() {}

  ngOnInit() {}
}

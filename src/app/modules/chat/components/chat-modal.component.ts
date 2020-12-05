import { ModalController } from "@ionic/angular";
import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-chat-modal",
  template: `
    <ion-header>
      <ion-toolbar color="primary">
        <ion-item>
          <ion-avatar slot="start">
            <img src="assets/avatar.png" />
          </ion-avatar>
          <ion-label>
            {{ friendName }}
          </ion-label>
        </ion-item>
        <ion-buttons slot="start">
          <ion-button (click)="close()">
            <ion-icon name="arrow-back" slot="icon-only"></ion-icon>
          </ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button>
            <ion-icon
              slot="icon-only"
              name="ellipse"
              [color]="isOnline ? 'success' : null"
            ></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <app-chat-container
        [chatId]="chatId"
        [userId]="userId"
        (online)="updateOnline($event)"
      ></app-chat-container>
    </ion-content>
  `,
  styles: [
    `
      ion-item {
        --background: transparent;
        --color: var(--ion-color-primary-contrast);
      }
    `,
  ],
})
export class ChatModalComponent implements OnInit {
  @Input() chat: any;

  private isOnline: boolean;

  get chatId() {
    return this.chat.id;
  }

  get userId() {
    return this.chat.me.id;
  }

  get friendName() {
    return this.chat.friend.name;
  }

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  updateOnline(online: boolean) {
    console.log(online);
    this.isOnline = online;
  }
  close() {
    this.modalController.dismiss({
      dismissed: true,
    });
  }
}

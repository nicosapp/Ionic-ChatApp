import { ChatModalComponent } from "./chat-modal.component";
import { ChatService } from "./../services/chat.service";
import { Subscription } from "rxjs";
import { Chat } from "./../interface";
import { Component, OnDestroy, OnInit } from "@angular/core";
import {
  ActionSheetController,
  AlertController,
  ModalController,
} from "@ionic/angular";

@Component({
  selector: "app-chats-list",
  template: `
    <ion-list>
      <app-chats-list-item
        *ngFor="let chat of chats"
        [chat]="chat"
        (click)="openChat(chat)"
        ion-long-press
        [interval]="400"
        (longPressed)="presentActionSheet(chat.id)"
      >
      </app-chats-list-item>
    </ion-list>
  `,
  styles: [``],
})
export class ChatsListComponent implements OnInit, OnDestroy {
  private chats: Chat;
  private chatsSubscription: Subscription;
  constructor(
    private chatService: ChatService,
    private modalController: ModalController,
    private actionSheetController: ActionSheetController,
    private alertController: AlertController
  ) {}

  ngOnDestroy(): void {
    this.chatsSubscription.unsubscribe();
    this.chatService.unlisten();
  }

  ngOnInit() {
    // this.chatService.setConfig({userId:})
    this.chatsSubscription = this.chatService.itemsSubject.subscribe(
      (chats: any) => {
        this.chats = chats;
      }
    );
    this.chatService.listen();
    this.chatService.get().subscribe();
    this.chatService.emitItems();
  }

  async openChat(chat) {
    // console.log(chatId);
    const modal = await this.modalController.create({
      component: ChatModalComponent,
      cssClass: "chat",
      componentProps: {
        chat,
      },
    });
    modal.onWillDismiss().then((res: any) => {
      const { data } = res;
      if (data.success) {
      }
    });
    return await modal.present();
  }

  async presentActionSheet(chatId) {
    const actionSheet = await this.actionSheetController.create({
      header: "Chat",
      cssClass: "chat-action-sheet",
      buttons: [
        {
          text: "Delete",
          role: "destructive",
          icon: "trash",
          handler: () => {
            this.presentAlertConfirmDelete(chatId);
          },
        },
        // {
        //   text: "Block",
        //   icon: "share",
        //   handler: () => {
        //     console.log("Share clicked");
        //   },
        // },
        {
          text: "Cancel",
          icon: "close",
          role: "cancel",
          handler: () => {},
        },
      ],
    });
    await actionSheet.present();
  }

  async presentAlertConfirmDelete(chatId) {
    const alert = await this.alertController.create({
      cssClass: "my-alert",
      header: "Confirm!",
      message: "Do you really want to delete this chat?",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          cssClass: "secondary",
        },
        {
          text: "Okay",
          handler: () => {
            this.chatService.delete(chatId);
          },
        },
      ],
    });

    await alert.present();
  }
}

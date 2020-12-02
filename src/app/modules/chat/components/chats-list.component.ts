import { ChatModalComponent } from "./chat-modal.component";
import { ChatService } from "./../services/chat.service";
import { Subscription } from "rxjs";
import { Chat } from "./../interface";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { ModalController } from "@ionic/angular";

@Component({
  selector: "app-chats-list",
  template: `
    <ion-list>
      <app-chats-list-item
        *ngFor="let chat of chats"
        [chat]="chat"
        (click)="openChat(chat.id)"
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
    private modalController: ModalController
  ) {}

  ngOnDestroy(): void {
    this.chatsSubscription.unsubscribe();
  }

  ngOnInit() {
    this.chatsSubscription = this.chatService.itemsSubject.subscribe(
      (chats: any) => {
        this.chats = chats;
      }
    );
    this.chatService.get().subscribe();
    this.chatService.emitItems();
  }

  async openChat(chatId) {
    // console.log(chatId);
    const modal = await this.modalController.create({
      component: ChatModalComponent,
      cssClass: "chat",
      componentProps: {
        chatId,
      },
    });
    modal.onWillDismiss().then((res: any) => {
      const { data } = res;
      if (data.success) {
      }
    });
    return await modal.present();
  }
}

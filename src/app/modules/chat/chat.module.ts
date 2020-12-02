import { ChatModalComponent } from "./components/chat-modal.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { IonicModule } from "@ionic/angular";
import { FormsModule } from "@angular/forms";

import { HttpClientModule } from "@angular/common/http";

import { ChatService } from "./services/chat.service";
import { MessageService } from "./services/message.service";

import { TextBoxComponent } from "./components/text-box.component";
import { MessageComponent } from "./components/message.component";
import { ChatContainerComponent } from "./components/chat-container.component";
import { MessagesFlowComponent } from "./components/messages-flow.component";
import { ChatsListItemComponent } from "./components/chats-list-item.component";
import { ChatsListComponent } from "./components/chats-list.component";

const declarations = [
  TextBoxComponent,
  MessageComponent,
  ChatContainerComponent,
  MessagesFlowComponent,
  ChatsListComponent,
  ChatsListItemComponent,
  ChatModalComponent,
];

@NgModule({
  declarations: [...declarations],
  imports: [CommonModule, IonicModule, FormsModule],
  providers: [ChatService, MessageService],
  exports: [ChatsListComponent],
})
export class ChatModule {}

export { ChatService } from "./services/chat.service";
export { MessageService } from "./services/message.service";
export { Chat, Message } from "./interface";

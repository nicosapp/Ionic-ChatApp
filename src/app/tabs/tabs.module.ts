import { HttpClientModule } from "@angular/common/http";
import { IonicModule } from "@ionic/angular";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { TabsPageRoutingModule } from "./tabs-routing.module";

import { TabsPage } from "./tabs.page";

import { ChatModule } from "../modules/chat/chat.module";

import { httpInterceptorProviders } from "../services/http/http-interceptor-provider";

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
    ChatModule,
    HttpClientModule,
  ],
  providers: [httpInterceptorProviders],
  declarations: [TabsPage],
})
export class TabsPageModule {}

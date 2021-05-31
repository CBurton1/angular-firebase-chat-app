import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { AngularFireModule } from "@angular/fire";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatButtonModule } from "@angular/material/button";

import { AppComponent } from "./app.component";
import { environment } from "../environments/environment";
import { ConversationsComponent } from "./conversations/conversations.component";
import { ConversationComponent } from "./conversations/conversation/conversation.component";
import { MessageComponent } from "./conversations/conversation/message/message.component";
import { LoginComponent } from "./login/login.component";
import { ScrollableDirective } from "./directives/scrollable.directive";

@NgModule({
  declarations: [
    AppComponent,
    ConversationsComponent,
    ConversationComponent,
    MessageComponent,
    LoginComponent,
    ScrollableDirective,
  ],
  imports: [
    BrowserModule,
    AngularFireModule.initializeApp(environment.firebase),
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

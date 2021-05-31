import { Component, OnInit } from "@angular/core";
import { filter } from "rxjs/operators";

import { ConversationService } from "./services/conversation.service";
import { UserService } from "./services/user.service";

@Component({
  selector: "afca-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent implements OnInit {
  public user: AFCA.User | undefined;
  public users: AFCA.User[] | undefined;
  public conversations: AFCA.Conversation[] | undefined;

  constructor(
    private conversationService: ConversationService,
    private userService: UserService
  ) {}

  public ngOnInit(): void {
    this.userService.checkLogin()
      .pipe(filter((user) => !!user))
      .subscribe((user: AFCA.User | undefined | null) => {
        if (user) {
          this.user = user;
        }
      });

    // get all users and conversations
    // in a real world application we would only get the users our current user has access to
    // and only get the conversations our current user has access to
    this.userService.readUsers().subscribe((users) => this.users = users);
    this.conversationService.readConversations().subscribe((conversations) => this.conversations = conversations);
  }
}

import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "afca-conversations",
  templateUrl: "./conversations.component.html",
  styleUrls: ["./conversations.component.scss"]
})
export class ConversationsComponent implements OnInit {
  @Input() user!: AFCA.User;
  @Input() users!: AFCA.User[];
  @Input() conversations!: AFCA.Conversation[];
  public currentConversation!: AFCA.Conversation;
  public userConversations!: AFCA.Conversation[];

  constructor() {}

  public ngOnInit(): void {
    // filter out any conversations our user does not have access to
    // in a real world app we would only get the conversations our user has access to initially
    this.userConversations = this.conversations
      .filter((conversation: AFCA.Conversation) => {
        return this.user.conversationIds.includes(conversation.id);
      })
      .map((conversation: AFCA.Conversation) => {
        const messageUser = this.users.find((user: AFCA.User) => user.id === conversation.mostRecentMessage.participantId);
        conversation.mostRecentMessage.user = messageUser;

        return conversation;
      });

    this.currentConversation = this.userConversations[0];
  }
}

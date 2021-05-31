import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "afca-message",
  templateUrl: "./message.component.html",
  styleUrls: ["./message.component.scss"]
})
export class MessageComponent implements OnInit {
  @Input() public message!: AFCA.Message;
  @Input() public users!: AFCA.User[];
  @Input() public currentUser!: AFCA.User;
  public user: AFCA.User | undefined;
  public isCurrentUser!: boolean;

  public ngOnInit(): void {
    this.user = this.users.find((user: AFCA.User) => user.id === this.message.participantId);
    this.isCurrentUser = this.user?.id === this.currentUser.id;
  }
}

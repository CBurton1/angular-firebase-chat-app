import { Component, OnInit } from "@angular/core";

@Component({
  selector: "afca-conversation",
  templateUrl: "./conversation.component.html",
  styleUrls: ["./conversation.component.scss"]
})
export class ConversationComponent implements OnInit {

  public ngOnInit(): void {}

  public loadMore(): void {}

  public listenForMessages(): void {}

  public sendMessage(): void {}

  public scrollHandler(e: "top" | "bottom"): void {}

  public trackMessage(index: number, message: AFCA.Message): string | undefined {
    return;
  }
}

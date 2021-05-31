import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { take } from "rxjs/operators";
import { ConversationService } from "src/app/services/conversation.service";

@Component({
  selector: "afca-conversation",
  templateUrl: "./conversation.component.html",
  styleUrls: ["./conversation.component.scss"]
})
export class ConversationComponent implements OnInit {
  @ViewChild("messagesElement") public messagesElement!: ElementRef;
  @Input() conversation!: AFCA.Conversation;
  @Input() user!: AFCA.User;
  @Input() users!: AFCA.User[];
  public conversationForm!: FormGroup;
  public messages: AFCA.Message[] = [];

  public last: any;

  constructor(private conversationService: ConversationService) {}

  public scrollHandler(e: "top" | "bottom"): void {
    if (e === "top") {
      this.loadMore();
    }
  }

  public loadMore(): void {
    // if last is undefined we are at the end of our collection
    // and we do not want to 'fetch' more messages
    if (!this.last) {
      return;
    }

    this.conversationService.readMessages(this.conversation.id, this.last)
      .pipe(take(1))
      .subscribe(({ messages, last }) => {
        this.last = last;
        // add the messages to the beginning of our array
        this.messages?.unshift(...messages.reverse());
      });
  }

  public ngOnInit(): void {
    this.conversationForm = new FormGroup({
      text: new FormControl("", [Validators.required])
    });

    this.conversationService.readMessages(this.conversation.id)
      .pipe(take(1))
      .subscribe(({ messages, last }) => {
        this.messages = messages.reverse();
        this.last = last;

        setTimeout(() => {
          this.messagesElement.nativeElement.scrollTop = this.messagesElement.nativeElement.scrollHeight;
        });
      });

    this.listenForMessages();
  }

  public sendMessage(): void {
    if (!this.conversationForm.valid) {
      return;
    }

    const message: AFCA.CreateMessageRequest = {
      text: this.conversationForm.value.text,
      participantId: this.user.id,
      timeStampCreated: new Date().toString(),
    };

    this.conversationService.sendMessage(this.conversation.id, message)
      .subscribe(() => {
        this.conversationForm.reset();
      });
  }

  public listenForMessages(): void {
    this.conversationService.listenForMessages(this.conversation.id)
      .subscribe((message: AFCA.Message) => {
        const messageExists = this.messages.find((existingMessage: AFCA.Message) => existingMessage.id === message.id);

        if (!messageExists) {
          this.messages.push(message);

          setTimeout(() => {
            this.messagesElement.nativeElement.scrollTop = this.messagesElement.nativeElement.scrollHeight;
          });
        }
      });
  }

  public trackMessage(index: number, message: AFCA.Message): string | undefined {
    return message ? message.id : undefined;
  }
}

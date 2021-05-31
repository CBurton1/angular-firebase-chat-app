import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection, QueryDocumentSnapshot } from "@angular/fire/firestore";
import { Observable, from, of } from "rxjs";

import { switchMap, map, take } from "rxjs/operators";
import { UserService } from "./user.service";

@Injectable({
  providedIn: "root"
})
export class ConversationService {
  public lastVisible: QueryDocumentSnapshot<AFCA.Message> | undefined;
  public start: any;
  public end: any;

  constructor(
    private afs: AngularFirestore,
    private userService: UserService
  ) {}

  public createConversation(createConversationRequest: AFCA.CreateConversationRequest): Observable<AFCA.Conversation> {
    let conversationsCollection: AngularFirestoreCollection<any>;
    conversationsCollection = this.afs.collection<any>("conversations");

    return from(conversationsCollection.add(createConversationRequest))
    .pipe(
      switchMap((documentReference) => {
        return documentReference.get();
      }),
      map((documentSnapshot) => {
        return {
          id: documentSnapshot.id,
          ...documentSnapshot.data()
        } as AFCA.Conversation;
      }),
      switchMap((conversation: AFCA.Conversation) => {
        return this.updateConversation(conversation);
      })
    );
  }

  public readConversations(): Observable<AFCA.Conversation[]> {
    return this.afs.collection<AFCA.Conversation>("conversations").valueChanges();
  }

  public updateConversation(conversation: AFCA.Conversation): Observable<AFCA.Conversation> {
    let conversationsCollection: AngularFirestoreCollection<AFCA.Conversation>;
    conversationsCollection = this.afs.collection<AFCA.Conversation>("conversations");
    conversation.timeStampUpdated = new Date().toString();

    return from(
      conversationsCollection.doc(conversation.id).update(conversation)
    )
    .pipe(
      map(() => {
        return conversation;
      })
    );
  }

  public deleteConversation(conversationId: string): Observable<string> {
    let conversationsCollection: AngularFirestoreCollection<AFCA.Conversation>;
    conversationsCollection = this.afs.collection<AFCA.Conversation>("conversations");

    return from(
      conversationsCollection.doc(conversationId).delete()
    )
    .pipe(
      map(() => conversationId)
    );
  }

  public getConversationById(conversationId: string): Observable<AFCA.Conversation | undefined> {
    let conversationsCollection: AngularFirestoreCollection<AFCA.Conversation>;
    conversationsCollection = this.afs.collection<AFCA.Conversation>("conversations");

    return from(conversationsCollection.doc(conversationId).valueChanges()).pipe(take(1));
  }

  public updateMessage(conversationId: string, message: AFCA.Message): Observable<AFCA.Message> {
    return from(
      this.afs.collection<AFCA.Conversation>("conversations")
        .doc(conversationId)
        .collection<AFCA.Message>("messages")
        .doc(message.id)
        .update(message)
    )
    .pipe(
      map(() => {
        return message;
      })
    );
  }

  public readMessages(
    conversationId: string,
    last?: QueryDocumentSnapshot<AFCA.Message>
  ): Observable<{messages: AFCA.Message[], last: QueryDocumentSnapshot<AFCA.Message>}> {
    return of();
  }

  public listenForMessages(conversationId: string): Observable<AFCA.Message> {
    return of();
  }

  public sendMessage(conversationId: string, message: AFCA.CreateMessageRequest): Observable<AFCA.Message> {
    return of();
  }
}

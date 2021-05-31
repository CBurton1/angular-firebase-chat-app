import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection, QueryDocumentSnapshot, QuerySnapshot, } from "@angular/fire/firestore";
import { Observable, from, of } from "rxjs";

import { switchMap, map, take, filter } from "rxjs/operators";
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

  public readMessages(
    conversationId: string,
    last?: QueryDocumentSnapshot<AFCA.Message>
  ): Observable<{messages: AFCA.Message[], last: QueryDocumentSnapshot<AFCA.Message>}> {
    return this.afs.collection<AFCA.Conversation>("conversations")
      .doc(conversationId)
      .collection<AFCA.Message>("messages", (ref) => {
        if (last) {
          return ref.orderBy("timeStampCreated", "desc")
            .startAfter(last.data().timeStampCreated)
            .limit(25);
        } else {
          return ref.orderBy("timeStampCreated", "desc")
            .limit(25);
        }
      })
      .get()
      .pipe(
        switchMap((snapshot: QuerySnapshot<AFCA.Message>) => {
          const lastSnapshot: QueryDocumentSnapshot<AFCA.Message> = snapshot.docs[snapshot.docs.length - 1];
          const messages = snapshot.docs.map((doc: QueryDocumentSnapshot<AFCA.Message>) => {
            return doc.data();
          }) as AFCA.Message[];

          return of({ messages, last: lastSnapshot });
        }),
      );
  }

  public listenForMessages(conversationId: string): Observable<AFCA.Message> {
    return this.afs.collection<AFCA.Conversation>("conversations")
      .doc(conversationId)
      .valueChanges()
      .pipe(
        filter((conversation) => !!conversation?.mostRecentMessage),
        map((conversation: AFCA.Conversation | undefined) => {
          return conversation?.mostRecentMessage as AFCA.Message;
        })
      );
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

  public sendMessage(conversationId: string, message: AFCA.CreateMessageRequest): any {
    let newMessage: AFCA.Message;
    return from(this.afs.collection<AFCA.Conversation>("conversations")
      .doc(conversationId)
      .collection<AFCA.CreateMessageRequest>("messages")
      .add(message)
    ).pipe(
      switchMap((documentReference) => {
        return documentReference.get();
      }),
      map((documentSnapshot) => {
        return {
          id: documentSnapshot.id,
          ...documentSnapshot.data()
        } as AFCA.Message;
      }),
      switchMap((message: AFCA.Message) => {
        newMessage = message;
        return this.updateMessage(conversationId, message);
      }),
      switchMap((message) => {
        return this.afs.collection<AFCA.Conversation>("conversations")
          .doc(conversationId)
          .update({ mostRecentMessage: message });
      }),
      map(() => newMessage)
    );
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
}

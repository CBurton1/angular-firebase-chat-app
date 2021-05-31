declare namespace AFCA {
  interface Conversation {
    id: string;
    participantIds: string[];
    mostRecentMessage: AFCA.Message;
    timeStampCreated: string;
    timeStampUpdated: string;
    participants?: AFCA.User[];
    messages?: AFCA.Message[];
  }

  interface Message {
    id: string;
    timeStampCreated: string;
    text: string;
    participantId: string;
    user?: AFCA.User
  }

  interface CreateMessageRequest {
    timeStampCreated: string;
    text: string;
    participantId: string;
  }

  interface CreateConversationRequest {

  }

  interface CreateMessageRequest {

  }

}
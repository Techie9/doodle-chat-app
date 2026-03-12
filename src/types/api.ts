export interface Message {
  _id: string;
  message: string;
  author: string;
  createdAt: string;
}

export interface CreateMessageBody {
  message: string;
  author: string;
}

export interface GetMessagesParams {
  limit?: number;
  after?: string;
  before?: string;
}

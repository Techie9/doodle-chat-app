/** Message as returned by the API (GET/POST) */
export interface Message {
  _id: string;
  message: string;
  author: string;
  createdAt: string;
}

/** Body for creating a new message (POST) */
export interface CreateMessageBody {
  message: string;
  author: string;
}

/** Query params for fetching messages (GET) */
export interface GetMessagesParams {
  limit?: number;
  after?: string;
  before?: string;
}

/** API error response shape (4xx/5xx JSON body) */
export interface ApiErrorResponse {
  error?: { message?: string };
  message?: string;
}

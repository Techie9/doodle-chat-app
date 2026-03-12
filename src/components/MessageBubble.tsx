import { decodeHtmlEntities } from '../utils/decodeHtmlEntities';
import './MessageBubble.css';

interface MessageBubbleProps {
  message: string;
  author: string;
  createdAt: string;
  isOwn: boolean;
}

export function MessageBubble({
  message,
  author,
  createdAt,
  isOwn,
}: MessageBubbleProps) {
  const decodedMessage = decodeHtmlEntities(message);
  const decodedAuthor = decodeHtmlEntities(author);
  return (
    <div
      className={`message-bubble ${isOwn ? 'message-bubble--own' : 'message-bubble--incoming'}`}
      data-owned={isOwn}
    >
      {!isOwn && (
        <p className="message-bubble__author">
          {decodedAuthor}
        </p>
      )}
      <p className="message-bubble__text">{decodedMessage}</p>
      <time
        className="message-bubble__time"
        dateTime={createdAt}
        aria-label={`Sent at ${createdAt}`}
      >
        {createdAt}
      </time>
    </div>
  );
}

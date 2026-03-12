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
  return (
    <div
      className={`message-bubble ${isOwn ? 'message-bubble--own' : 'message-bubble--incoming'}`}
      data-owned={isOwn}
    >
      {!isOwn && (
        <p className="message-bubble__author">
          {author}
        </p>
      )}
      <p className="message-bubble__text">{message}</p>
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

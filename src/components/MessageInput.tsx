import { useState, useRef, useCallback } from 'react';
import { AUTHOR_MAX_LENGTH, MESSAGE_MAX_LENGTH } from '../constants';
import './MessageInput.css';

interface MessageInputProps {
  initialAuthor: string;
  onAuthorChange: (value: string) => void;
  onSend: (message: string, author: string) => void | Promise<void>;
  disabled?: boolean;
}

export function MessageInput({
  initialAuthor,
  onAuthorChange,
  onSend,
  disabled = false,
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [author, setAuthor] = useState(initialAuthor);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedMessage = message.trim();
      const trimmedAuthor = author.trim();
      if (!trimmedMessage || !trimmedAuthor || disabled) return;
      onSend(trimmedMessage, trimmedAuthor);
      setMessage('');
      messageInputRef.current?.focus();
    },
    [message, author, disabled, onSend]
  );

  const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.slice(0, AUTHOR_MAX_LENGTH);
    setAuthor(v);
    onAuthorChange(v);
  };

  return (
    <form
      className="message-input"
      onSubmit={handleSubmit}
      aria-label="Send a message"
    >
      <div className="message-input__bar">
        <label htmlFor="chat-author" className="message-input__author-label">
          Your name
        </label>
        <input
          id="chat-author"
          type="text"
          className="message-input__author"
          value={author}
          onChange={handleAuthorChange}
          placeholder="Your name"
          maxLength={AUTHOR_MAX_LENGTH}
          autoComplete="username"
          disabled={disabled}
          aria-required
        />
        <label htmlFor="chat-message" className="message-input__message-label">
          Message
        </label>
        <textarea
          id="chat-message"
          ref={messageInputRef}
          className="message-input__field"
          value={message}
          onChange={(e) =>
            setMessage(e.target.value.slice(0, MESSAGE_MAX_LENGTH))
          }
          placeholder="Message"
          rows={1}
          maxLength={MESSAGE_MAX_LENGTH}
          disabled={disabled}
          aria-required
          aria-describedby="message-char-count"
        />
        <span id="message-char-count" className="message-input__count" aria-live="polite">
          {message.length}/{MESSAGE_MAX_LENGTH}
        </span>
        <button
          type="submit"
          className="message-input__send"
          disabled={
            disabled ||
            !message.trim() ||
            !author.trim()
          }
          aria-label="Send message"
        >
          Send
        </button>
      </div>
    </form>
  );
}

import { useRef, useEffect } from 'react';
import type { Message } from '../types/api';
import { MessageBubble } from './MessageBubble';
import './MessageList.css';

function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const day = d.getDate();
  const month = d.toLocaleString('en-GB', { month: 'short' });
  const year = d.getFullYear();
  const time = d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  return `${day} ${month} ${year} ${time}`;
}

interface MessageListProps {
  messages: Message[];
  currentAuthor?: string;
  onLoadOlder: () => void;
  hasOlder: boolean;
  loadingOlder: boolean;
}

export function MessageList({
  messages,
  currentAuthor,
  onLoadOlder,
  hasOlder,
  loadingOlder,
}: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const prevCountRef = useRef(0);

  useEffect(() => {
    const prev = prevCountRef.current;
    prevCountRef.current = messages.length;
    if (messages.length > prev && prev > 0) {
      const last = messages[messages.length - 1];
      const isOwn = currentAuthor && last.author === currentAuthor;
      if (isOwn) {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [messages.length, currentAuthor]);

  const didInitialScroll = useRef(false);
  useEffect(() => {
    if (messages.length > 0 && !didInitialScroll.current) {
      didInitialScroll.current = true;
      requestAnimationFrame(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'auto' });
      });
    }
  }, [messages.length]);

  return (
    <div className="message-list" ref={listRef}>
      {hasOlder && (
        <div className="message-list-load">
          <button
            type="button"
            onClick={onLoadOlder}
            disabled={loadingOlder}
            className="message-list-load-btn"
            aria-label="Load older messages"
          >
            {loadingOlder ? 'Loading…' : 'Load older messages'}
          </button>
        </div>
      )}
      <ul className="message-list-ul" role="log" aria-live="polite">
        {messages.map((msg) => {
          const isOwn = Boolean(currentAuthor && msg.author === currentAuthor);
          return (
          <li
            key={msg._id}
            className={`message-list-li ${isOwn ? 'message-list-li--own' : 'message-list-li--incoming'}`}
          >
            <MessageBubble
              message={msg.message}
              author={msg.author}
              createdAt={formatTimestamp(msg.createdAt)}
              isOwn={isOwn}
            />
          </li>
          );
        })}
      </ul>
      <div ref={bottomRef} className="message-list-anchor" aria-hidden="true" />
    </div>
  );
}

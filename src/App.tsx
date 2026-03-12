import { useState, useEffect, useCallback } from 'react';
import { fetchMessages, sendMessage } from './api/client';
import type { Message as MessageType } from './types/api';
import { AUTHOR_STORAGE_KEY } from './constants';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import { useAuthor } from './hooks/useAuthor';
import './App.css';

function App() {
  const { author, setAuthor, persistAuthor } = useAuthor();
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [oldestFetched, setOldestFetched] = useState<string | null>(null);
  const [hasMoreOlder, setHasMoreOlder] = useState(true);

  const loadMessages = useCallback(async (before?: string) => {
    try {
      setError(null);
      const limit = 50;
      const list = await fetchMessages(
        before ? { before, limit } : { limit }
      );
      if (list.length < limit) setHasMoreOlder(false);
      setMessages((prev) => {
        const byId = new Map(prev.map((m) => [m._id, m]));
        for (const m of list) byId.set(m._id, m);
        const merged = Array.from(byId.values()).sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        return merged;
      });
      if (list.length > 0) {
        const oldest = list.reduce(
          (min, m) =>
            new Date(m.createdAt) < new Date(min.createdAt) ? m : min
        );
        setOldestFetched(oldest.createdAt);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const loadOlder = useCallback(() => {
    if (!oldestFetched) return;
    setLoading(true);
    loadMessages(oldestFetched).finally(() => setLoading(false));
  }, [oldestFetched, loadMessages]);

  const handleSend = useCallback(
    async (message: string, authorName: string) => {
      if (!message.trim() || !authorName.trim()) return;
      setSending(true);
      try {
        const created = await sendMessage({
          message: message.trim(),
          author: authorName.trim(),
        });
        setMessages((prev) => [...prev, created]);
        persistAuthor(authorName.trim());
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Failed to send message');
      } finally {
        setSending(false);
      }
    },
    [persistAuthor]
  );

  return (
    <div className="app" role="application" aria-label="Chat">
      <main className="chat-main">
        <div className="chat-messages-wrap">
          {error && (
            <div className="chat-error" role="alert">
              <span>{error}</span>
              <button
                type="button"
                className="chat-error__retry"
                onClick={() => {
                  setError(null);
                  setLoading(true);
                  loadMessages().finally(() => setLoading(false));
                }}
              >
                Retry
              </button>
            </div>
          )}
          {loading && messages.length === 0 ? (
            <div className="chat-loading" aria-live="polite" aria-busy="true">
              <div className="chat-loading__spinner" aria-hidden="true" />
              <span>Loading messages…</span>
            </div>
          ) : (
            <MessageList
              messages={messages}
              currentAuthor={author ?? undefined}
              onLoadOlder={loadOlder}
              hasOlder={Boolean(oldestFetched) && hasMoreOlder}
              loadingOlder={loading && messages.length > 0}
            />
          )}
        </div>
        <MessageInput
          initialAuthor={author ?? ''}
          onAuthorChange={setAuthor}
          onSend={handleSend}
          disabled={sending}
        />
      </main>
    </div>
  );
}

export default App;

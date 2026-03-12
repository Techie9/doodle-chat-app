import type { Message, CreateMessageBody, GetMessagesParams, ApiErrorResponse } from '../types/api';

const API_BASE = '/api/v1';
const AUTH_TOKEN = 'super-secret-doodle-token';

function headers(includeJson = true): HeadersInit {
  const h: HeadersInit = {
    Authorization: `Bearer ${AUTH_TOKEN}`,
  };
  if (includeJson) {
    (h as Record<string, string>)['Content-Type'] = 'application/json';
  }
  return h;
}

function getErrorMessage(body: unknown): string {
  const b = body as ApiErrorResponse | undefined;
  return b?.error?.message ?? b?.message ?? 'Request failed';
}

export async function fetchMessages(params?: GetMessagesParams): Promise<Message[]> {
  const url = new URL(`${API_BASE}/messages`, window.location.origin);
  if (params?.limit != null) url.searchParams.set('limit', String(params.limit));
  if (params?.after) url.searchParams.set('after', params.after);
  if (params?.before) url.searchParams.set('before', params.before);

  const res = await fetch(url.toString(), { headers: headers(false) });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(getErrorMessage(body));
  }
  return res.json();
}

export async function sendMessage(body: CreateMessageBody): Promise<Message> {
  const res = await fetch(`${API_BASE}/messages`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(getErrorMessage(body));
  }
  return res.json();
}

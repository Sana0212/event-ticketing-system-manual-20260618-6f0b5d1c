/** Client-side fetch helpers for your API routes. */

export function unwrapApiData<T>(body: unknown): T {
  if (body !== null && typeof body === 'object' && 'data' in body) {
    return (body as { data: T }).data;
  }
  return body as T;
}

/** Unwrap { data: T[] } from list endpoints — never use `json.items || json || []`. */
export function unwrapApiList<T>(body: unknown): T[] {
  const data = unwrapApiData<unknown>(body);
  return Array.isArray(data) ? (data as T[]) : [];
}

export async function apiJson<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(path, {
    credentials: 'include',
    ...init,
    headers: {
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  });
  const body = (await res.json().catch(() => null)) as { error?: string } | null;
  if (!res.ok) throw new Error(body?.error || res.statusText);
  return unwrapApiData<T>(body);
}

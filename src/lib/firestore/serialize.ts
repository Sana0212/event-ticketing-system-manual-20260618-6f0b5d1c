/**
 * Convert Firestore documents to plain JSON-safe objects for Server → Client props.
 * Firestore Timestamp / FieldValue objects cannot cross the RSC boundary.
 */

type TimestampLike = {
  toDate?: () => Date;
  seconds?: number;
  nanoseconds?: number;
  _seconds?: number;
};

function serializeValue(value: unknown): unknown {
  if (value === null || value === undefined) return value;

  if (typeof value === 'object') {
    const ts = value as TimestampLike;
    if (typeof ts.toDate === 'function') {
      return ts.toDate().toISOString();
    }
    if (typeof ts.seconds === 'number') {
      return new Date(ts.seconds * 1000).toISOString();
    }
    if (typeof ts._seconds === 'number') {
      return new Date(ts._seconds * 1000).toISOString();
    }
    if (Array.isArray(value)) {
      return value.map(serializeValue);
    }
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = serializeValue(v);
    }
    return out;
  }

  return value;
}

/** Serialize a Firestore record for API responses and client component props. */
export function serializeRecord<T>(
  id: string,
  data: Record<string, unknown> | undefined,
): T {
  const plain = serializeValue(data ?? {}) as Record<string, unknown>;
  return { id, ...plain } as unknown as T;
}

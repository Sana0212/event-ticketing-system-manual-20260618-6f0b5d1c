import { getAdminFirestore } from '@/lib/firebase/admin';
import { appCollection, ensureAppTables } from '@/lib/firebase/collections';
import { FieldValue } from 'firebase-admin/firestore';
import type { BookingRecord } from '@/data/types';
import { getBooking } from './app-data';

// ==========================================
// BOOKINGS WRITE HELPERS — COMPLETED
// ==========================================

export async function createBooking(input: Omit<BookingRecord, 'id' | 'booked_at' | 'created_at' | 'updated_at' | 'checked_in_at'> & { checked_in_at?: string | null }): Promise<BookingRecord> {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  const ref = appCollection(db, 'bookings').doc();
  const now = FieldValue.serverTimestamp();

  const payload = {
    ...input,
    booked_at: now,
    checked_in_at: input.checked_in_at ? new Date(input.checked_in_at) : null,
    created_at: now,
    updated_at: now,
  };

  await ref.set(payload);
  const fresh = await getBooking(ref.id);
  if (!fresh) throw new Error('Failed to retrieve newly created booking record');
  return fresh;
}

export async function updateBooking(id: string, input: Partial<Omit<BookingRecord, 'id' | 'booked_at' | 'created_at' | 'updated_at'>>): Promise<BookingRecord> {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  const ref = appCollection(db, 'bookings').doc(id);
  const now = FieldValue.serverTimestamp();

  const payload: Record<string, any> = {
    ...input,
    updated_at: now,
  };

  if (input.checked_in_at !== undefined) {
    payload.checked_in_at = input.checked_in_at ? new Date(input.checked_in_at as string) : null;
  }

  await ref.update(payload);
  const fresh = await getBooking(id);
  if (!fresh) throw new Error('Booking to update not found');
  return fresh;
}

export async function deleteBooking(id: string): Promise<void> {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  await appCollection(db, 'bookings').doc(id).delete();
}

import { getAdminFirestore } from '@/lib/firebase/admin';
import { appCollection, ensureAppTables } from '@/lib/firebase/collections';
import { FieldValue } from 'firebase-admin/firestore';
import type {
  UserRecord,
  EventRecord,
  VenueRecord,
  TicketTypeRecord,
  BookingRecord,
  SettingRecord,
} from '@/data/types';
import { getUser, getEvent, getVenue, getTicketType, getBooking, getSetting } from './app-data';

// ==========================================
// USERS WRITE HELPERS
// ==========================================

export async function createUser(input: Omit<UserRecord, 'id' | 'created_at' | 'updated_at'>): Promise<UserRecord> {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  const ref = appCollection(db, 'users').doc();
  const now = FieldValue.serverTimestamp();
  
  const payload = {
    ...input,
    email: input.email.toLowerCase().trim(),
    created_at: now,
    updated_at: now,
  };

  await ref.set(payload);
  const fresh = await getUser(ref.id);
  if (!fresh) throw new Error('Failed to retrieve newly created user record');
  return fresh;
}

export async function updateUser(id: string, input: Partial<Omit<UserRecord, 'id' | 'created_at' | 'updated_at'>>): Promise<UserRecord> {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  const ref = appCollection(db, 'users').doc(id);
  const now = FieldValue.serverTimestamp();

  const payload: Record<string, unknown> = {
    ...input,
    updated_at: now,
  };
  if (input.email) {
    payload.email = input.email.toLowerCase().trim();
  }

  await ref.update(payload);
  const fresh = await getUser(id);
  if (!fresh) throw new Error('User to update not found');
  return fresh;
}

export async function deleteUser(id: string): Promise<void> {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  await appCollection(db, 'users').doc(id).delete();
}

// ==========================================
// EVENTS WRITE HELPERS
// ==========================================

export async function createEvent(input: Omit<EventRecord, 'id' | 'created_at' | 'updated_at'>): Promise<EventRecord> {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  const ref = appCollection(db, 'events').doc();
  const now = FieldValue.serverTimestamp();

  const payload = {
    ...input,
    start_datetime: input.start_datetime ? new Date(input.start_datetime as string) : null,
    end_datetime: input.end_datetime ? new Date(input.end_datetime as string) : null,
    booking_deadline: input.booking_deadline ? new Date(input.booking_deadline as string) : null,
    created_at: now,
    updated_at: now,
  };

  await ref.set(payload);
  const fresh = await getEvent(ref.id);
  if (!fresh) throw new Error('Failed to retrieve newly created event record');
  return fresh;
}

export async function updateEvent(id: string, input: Partial<Omit<EventRecord, 'id' | 'created_at' | 'updated_at'>>): Promise<EventRecord> {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  const ref = appCollection(db, 'events').doc(id);
  const now = FieldValue.serverTimestamp();

  const payload: Record<string, unknown> = {
    ...input,
    updated_at: now,
  };

  if (input.start_datetime) payload.start_datetime = new Date(input.start_datetime as string);
  if (input.end_datetime) payload.end_datetime = new Date(input.end_datetime as string);
  if (input.booking_deadline !== undefined) {
    payload.booking_deadline = input.booking_deadline ? new Date(input.booking_deadline as string) : null;
  }

  await ref.update(payload);
  const fresh = await getEvent(id);
  if (!fresh) throw new Error('Event to update not found');
  return fresh;
}

export async function deleteEvent(id: string): Promise<void> {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  await appCollection(db, 'events').doc(id).delete();
}

// ==========================================
// VENUES WRITE HELPERS
// ==========================================

export async function createVenue(input: Omit<VenueRecord, 'id' | 'created_at' | 'updated_at'>): Promise<VenueRecord> {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  const ref = appCollection(db, 'venues').doc();
  const now = FieldValue.serverTimestamp();

  const payload = {
    ...input,
    created_at: now,
    updated_at: now,
  };

  await ref.set(payload);
  const fresh = await getVenue(ref.id);
  if (!fresh) throw new Error('Failed to retrieve newly created venue record');
  return fresh;
}

export async function updateVenue(id: string, input: Partial<Omit<VenueRecord, 'id' | 'created_at' | 'updated_at'>>): Promise<VenueRecord> {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  const ref = appCollection(db, 'venues').doc(id);
  const now = FieldValue.serverTimestamp();

  const payload = {
    ...input,
    updated_at: now,
  };

  await ref.update(payload);
  const fresh = await getVenue(id);
  if (!fresh) throw new Error('Venue to update not found');
  return fresh;
}

export async function deleteVenue(id: string): Promise<void> {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  await appCollection(db, 'venues').doc(id).delete();
}

// ==========================================
// TICKET TYPES WRITE HELPERS
// ==========================================

export async function createTicketType(input: Omit<TicketTypeRecord, 'id' | 'created_at' | 'updated_at'>): Promise<TicketTypeRecord> {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  const ref = appCollection(db, 'ticket_types').doc();
  const now = FieldValue.serverTimestamp();

  const payload = {
    ...input,
    sales_start: input.sales_start ? new Date(input.sales_start as string) : null,
    sales_end: input.sales_end ? new Date(input.sales_end as string) : null,
    created_at: now,
    updated_at: now,
  };

  await ref.set(payload);
  const fresh = await getTicketType(ref.id);
  if (!fresh) throw new Error('Failed to retrieve newly created ticket type record');
  return fresh;
}

export async function updateTicketType(id: string, input: Partial<Omit<TicketTypeRecord, 'id' | 'created_at' | 'updated_at'>>): Promise<TicketTypeRecord> {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  const ref = appCollection(db, 'ticket_types').doc(id);
  const now = FieldValue.serverTimestamp();

  const payload: Record<string, unknown> = {
    ...input,
    updated_at: now,
  };

  if (input.sales_start !== undefined) {
    payload.sales_start = input.sales_start ? new Date(input.sales_start as string) : null;
  }
  if (input.sales_end !== undefined) {
    payload.sales_end = input.sales_end ? new Date(input.sales_end as string) : null;
  }

  await ref.update(payload);
  const fresh = await getTicketType(id);
  if (!fresh) throw new Error('Ticket type to update not found');
  return fresh;
}

export async function deleteTicketType(id: string): Promise<void> {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  await appCollection(db, 'ticket_types').doc(id).delete();
}

// ==========================================
// BOOKINGS WRITE HELPERS
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

export async function updateBooking(id: string, input: Partial<Omit<BookingRecord, 'id' | 'booked_at' | 'created_at' | 'updated_at' | 'checked_in_at'> & { checked_in_at?: string | null }>): Promise<BookingRecord> {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  const ref = appCollection(db, 'bookings').doc(id);
  const now = FieldValue.serverTimestamp();

  const payload: Record<string, unknown> = {
    ...input,
    updated_at: now,
  };

  if (input.checked_in_at !== undefined) {
    payload.checked_in_at = input.checked_in_at ? new Date(input.checked_in_at) : null;
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

// ==========================================
// SETTINGS WRITE HELPERS
// ==========================================

export async function createSetting(input: Omit<SettingRecord, 'id' | 'created_at' | 'updated_at'>): Promise<SettingRecord> {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  const ref = appCollection(db, 'settings').doc();
  const now = FieldValue.serverTimestamp();

  const payload = {
    ...input,
    created_at: now,
    updated_at: now,
  };

  await ref.set(payload);
  const fresh = await getSetting(ref.id);
  if (!fresh) throw new Error('Failed to retrieve newly created setting record');
  return fresh;
}

export async function updateSetting(id: string, input: Partial<Omit<SettingRecord, 'id' | 'created_at' | 'updated_at'>>): Promise<SettingRecord> {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  const ref = appCollection(db, 'settings').doc(id);
  const now = FieldValue.serverTimestamp();

  const payload = {
    ...input,
    updated_at: now,
  };

  await ref.update(payload);
  const fresh = await getSetting(id);
  if (!fresh) throw new Error('Setting to update not found');
  return fresh;
}

export async function deleteSetting(id: string): Promise<void> {
  const db = getAdminFirestore();
  await ensureAppTables(db);
  await appCollection(db, 'settings').doc(id).delete();
}

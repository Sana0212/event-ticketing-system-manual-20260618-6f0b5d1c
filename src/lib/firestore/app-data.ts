import { getAdminFirestore } from '@/lib/firebase/admin';
import { appCollection } from '@/lib/firebase/collections';
import { serializeRecord } from './serialize';
import type {
  UserRecord,
  EventRecord,
  VenueRecord,
  TicketTypeRecord,
  BookingRecord,
  SettingRecord,
} from '@/data/types';

// ==========================================
// USERS READ HELPERS
// ==========================================

export async function listUsers(): Promise<UserRecord[]> {
  const db = getAdminFirestore();
  const snapshot = await appCollection(db, 'users').orderBy('created_at', 'desc').get();
  return snapshot.docs.map((doc) => {
    return serializeRecord<UserRecord>(doc.id, doc.data() as Record<string, unknown>);
  });
}

export async function getUser(id: string): Promise<UserRecord | null> {
  const db = getAdminFirestore();
  const doc = await appCollection(db, 'users').doc(id).get();
  if (!doc.exists) return null;
  return serializeRecord<UserRecord>(doc.id, doc.data() as Record<string, unknown>);
}

export async function getUserByEmail(email: string): Promise<UserRecord | null> {
  const db = getAdminFirestore();
  const snapshot = await appCollection(db, 'users')
    .where('email', '==', email.toLowerCase().trim())
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return serializeRecord<UserRecord>(doc.id, doc.data() as Record<string, unknown>);
}

// ==========================================
// EVENTS READ HELPERS
// ==========================================

export async function listEvents(): Promise<EventRecord[]> {
  const db = getAdminFirestore();
  const snapshot = await appCollection(db, 'events').orderBy('start_datetime', 'asc').get();
  return snapshot.docs.map((doc) => {
    return serializeRecord<EventRecord>(doc.id, doc.data() as Record<string, unknown>);
  });
}

export async function getEvent(id: string): Promise<EventRecord | null> {
  const db = getAdminFirestore();
  const doc = await appCollection(db, 'events').doc(id).get();
  if (!doc.exists) return null;
  return serializeRecord<EventRecord>(doc.id, doc.data() as Record<string, unknown>);
}

// ==========================================
// VENUES READ HELPERS
// ==========================================

export async function listVenues(): Promise<VenueRecord[]> {
  const db = getAdminFirestore();
  const snapshot = await appCollection(db, 'venues').orderBy('name', 'asc').get();
  return snapshot.docs.map((doc) => {
    return serializeRecord<VenueRecord>(doc.id, doc.data() as Record<string, unknown>);
  });
}

export async function getVenue(id: string): Promise<VenueRecord | null> {
  const db = getAdminFirestore();
  const doc = await appCollection(db, 'venues').doc(id).get();
  if (!doc.exists) return null;
  return serializeRecord<VenueRecord>(doc.id, doc.data() as Record<string, unknown>);
}

// ==========================================
// TICKET TYPES READ HELPERS
// ==========================================

export async function listTicketTypes(): Promise<TicketTypeRecord[]> {
  const db = getAdminFirestore();
  const snapshot = await appCollection(db, 'ticket_types').orderBy('created_at', 'desc').get();
  return snapshot.docs.map((doc) => {
    return serializeRecord<TicketTypeRecord>(doc.id, doc.data() as Record<string, unknown>);
  });
}

export async function listTicketTypesByEvent(eventId: string): Promise<TicketTypeRecord[]> {
  const db = getAdminFirestore();
  const snapshot = await appCollection(db, 'ticket_types')
    .where('event_id', '==', eventId)
    .orderBy('price', 'asc')
    .get();
  return snapshot.docs.map((doc) => {
    return serializeRecord<TicketTypeRecord>(doc.id, doc.data() as Record<string, unknown>);
  });
}

export async function getTicketType(id: string): Promise<TicketTypeRecord | null> {
  const db = getAdminFirestore();
  const doc = await appCollection(db, 'ticket_types').doc(id).get();
  if (!doc.exists) return null;
  return serializeRecord<TicketTypeRecord>(doc.id, doc.data() as Record<string, unknown>);
}

// ==========================================
// BOOKINGS READ HELPERS
// ==========================================

export async function listBookings(): Promise<BookingRecord[]> {
  const db = getAdminFirestore();
  const snapshot = await appCollection(db, 'bookings').orderBy('booked_at', 'desc').get();
  return snapshot.docs.map((doc) => {
    return serializeRecord<BookingRecord>(doc.id, doc.data() as Record<string, unknown>);
  });
}

export async function getBooking(id: string): Promise<BookingRecord | null> {
  const db = getAdminFirestore();
  const doc = await appCollection(db, 'bookings').doc(id).get();
  if (!doc.exists) return null;
  return serializeRecord<BookingRecord>(doc.id, doc.data() as Record<string, unknown>);
}

export async function getBookingByReference(reference: string): Promise<BookingRecord | null> {
  const db = getAdminFirestore();
  const snapshot = await appCollection(db, 'bookings')
    .where('booking_reference', '==', reference.trim())
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return serializeRecord<BookingRecord>(doc.id, doc.data() as Record<string, unknown>);
}

// ==========================================
// SETTINGS READ HELPERS
// ==========================================

export async function listSettings(): Promise<SettingRecord[]> {
  const db = getAdminFirestore();
  const snapshot = await appCollection(db, 'settings').orderBy('key', 'asc').get();
  return snapshot.docs.map((doc) => {
    return serializeRecord<SettingRecord>(doc.id, doc.data() as Record<string, unknown>);
  });
}

export async function getSetting(id: string): Promise<SettingRecord | null> {
  const db = getAdminFirestore();
  const doc = await appCollection(db, 'settings').doc(id).get();
  if (!doc.exists) return null;
  return serializeRecord<SettingRecord>(doc.id, doc.data() as Record<string, unknown>);
}

export async function getSettingByKey(key: string): Promise<SettingRecord | null> {
  const db = getAdminFirestore();
  const snapshot = await appCollection(db, 'settings')
    .where('key', '==', key.trim())
    .limit(1)
    .get();
  if (snapshot.empty) return null;
  const doc = snapshot.docs[0];
  return serializeRecord<SettingRecord>(doc.id, doc.data() as Record<string, unknown>);
}

import { Timestamp } from 'firebase-admin/firestore';

export interface User {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  role_key: string;
  phone?: string;
  status: string;
  created_at: Timestamp | string | null;
  updated_at: Timestamp | string | null;
  [key: string]: any;
}

export type UserRecord = User;

export interface Event {
  id: string;
  name: string;
  description?: string;
  category?: string;
  start_datetime: Timestamp | string | null;
  end_datetime: Timestamp | string | null;
  venue_id: string;
  status: string;
  organizer_id: string;
  capacity?: number;
  timezone?: string;
  booking_deadline?: Timestamp | string | null;
  created_at: Timestamp | string | null;
  updated_at: Timestamp | string | null;
  [key: string]: any;
}

export type EventRecord = Event;

export interface Venue {
  id: string;
  name: string;
  location: string;
  capacity: number;
  description?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  status: string;
  created_at: Timestamp | string | null;
  updated_at: Timestamp | string | null;
  [key: string]: any;
}

export type VenueRecord = Venue;

export interface TicketType {
  id: string;
  event_id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  total_quantity: number;
  max_per_booking?: number;
  sales_start?: Timestamp | string | null;
  sales_end?: Timestamp | string | null;
  status: string;
  created_at: Timestamp | string | null;
  updated_at: Timestamp | string | null;
  [key: string]: any;
}

export type TicketTypeRecord = TicketType;

export interface Booking {
  id: string;
  event_id: string;
  ticket_type_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  quantity: number;
  total_amount: number;
  currency: string;
  status: string;
  payment_status: string;
  booking_reference: string;
  booked_at: Timestamp | string | null;
  checked_in_at?: Timestamp | string | null;
  notes?: string;
  created_at: Timestamp | string | null;
  updated_at: Timestamp | string | null;
  [key: string]: any;
}

export type BookingRecord = Booking;

export interface Setting {
  id: string;
  key: string;
  value: string;
  description?: string;
  created_at: Timestamp | string | null;
  updated_at: Timestamp | string | null;
  [key: string]: any;
}

export type SettingRecord = Setting;

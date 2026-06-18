import { z } from 'zod';

// Users Schemas
export const createUserSchema = z.object({
  email: z.string().email(),
  password_hash: z.string().min(6),
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  role_key: z.string().min(1),
  phone: z.string().optional(),
  status: z.string().min(1),
});

export const updateUserSchema = z.object({
  email: z.string().email().optional(),
  password_hash: z.string().min(6).optional(),
  first_name: z.string().min(1).optional(),
  last_name: z.string().min(1).optional(),
  role_key: z.string().min(1).optional(),
  phone: z.string().optional(),
  status: z.string().min(1).optional(),
});

// Profile Settings Schema
export const profileSettingsSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  phone: z.string().optional(),
});

// Events Schemas
export const createEventSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  category: z.string().optional(),
  start_datetime: z.string().datetime(), // ISO string from frontend
  end_datetime: z.string().datetime(),
  venue_id: z.string().min(1),
  status: z.string().min(1),
  organizer_id: z.string().min(1),
  capacity: z.number().optional(),
  timezone: z.string().optional(),
  booking_deadline: z.string().datetime().optional().nullable(),
});

export const updateEventSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  category: z.string().optional(),
  start_datetime: z.string().datetime().optional(),
  end_datetime: z.string().datetime().optional(),
  venue_id: z.string().min(1).optional(),
  status: z.string().min(1).optional(),
  organizer_id: z.string().min(1).optional(),
  capacity: z.number().optional(),
  timezone: z.string().optional(),
  booking_deadline: z.string().datetime().optional().nullable(),
});

// Venues Schemas
export const createVenueSchema = z.object({
  name: z.string().min(1),
  location: z.string().min(1),
  capacity: z.number().min(1),
  description: z.string().optional(),
  contact_name: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  status: z.string().min(1),
});

export const updateVenueSchema = z.object({
  name: z.string().min(1).optional(),
  location: z.string().min(1).optional(),
  capacity: z.number().min(1).optional(),
  description: z.string().optional(),
  contact_name: z.string().optional(),
  contact_email: z.string().email().optional().or(z.literal('')),
  contact_phone: z.string().optional(),
  status: z.string().min(1).optional(),
});

// Ticket Types Schemas
export const createTicketTypeSchema = z.object({
  event_id: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional(),
  price: z.number().nonnegative(),
  currency: z.string().min(1),
  total_quantity: z.number().int().nonnegative(),
  max_per_booking: z.number().int().positive().optional().nullable(),
  sales_start: z.string().datetime().optional().nullable(),
  sales_end: z.string().datetime().optional().nullable(),
  status: z.string().min(1),
});

export const updateTicketTypeSchema = z.object({
  event_id: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().nonnegative().optional(),
  currency: z.string().min(1).optional(),
  total_quantity: z.number().int().nonnegative().optional(),
  max_per_booking: z.number().int().positive().optional().nullable(),
  sales_start: z.string().datetime().optional().nullable(),
  sales_end: z.string().datetime().optional().nullable(),
  status: z.string().min(1).optional(),
});

// Bookings Schemas
export const createBookingSchema = z.object({
  event_id: z.string().min(1),
  ticket_type_id: z.string().min(1),
  customer_name: z.string().min(1),
  customer_email: z.string().email(),
  customer_phone: z.string().optional(),
  quantity: z.number().int().positive(),
  total_amount: z.number().nonnegative(),
  currency: z.string().min(1),
  status: z.string().min(1),
  payment_status: z.string().min(1),
  booking_reference: z.string().min(1),
  notes: z.string().optional(),
});

export const updateBookingSchema = z.object({
  event_id: z.string().min(1).optional(),
  ticket_type_id: z.string().min(1).optional(),
  customer_name: z.string().min(1).optional(),
  customer_email: z.string().email().optional(),
  customer_phone: z.string().optional(),
  quantity: z.number().int().positive().optional(),
  total_amount: z.number().nonnegative().optional(),
  currency: z.string().min(1).optional(),
  status: z.string().min(1).optional(),
  payment_status: z.string().min(1).optional(),
  notes: z.string().optional(),
  checked_in_at: z.string().datetime().optional().nullable(),
});

// Settings Schemas
export const createSettingSchema = z.object({
  key: z.string().min(1),
  value: z.string().min(1),
  description: z.string().optional(),
});

export const updateSettingSchema = z.object({
  key: z.string().min(1).optional(),
  value: z.string().min(1).optional(),
  description: z.string().optional(),
});

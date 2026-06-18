export type TemplateFieldType = 'string' | 'number' | 'boolean' | 'timestamp' | 'reference';

export type TemplateField = {
  key: string;
  label: string;
  type: TemplateFieldType;
  required?: boolean;
  refTable?: string;
};

export type TemplateTable = {
  key: string;
  label: string;
  order: number;
  fields: TemplateField[];
};

export const appTemplate = {
  key: 'event-ticketing-system',
  label: 'Event & Ticketing System',
  tables: [
    {
      key: 'users',
      label: 'Users',
      order: 10,
      fields: [
        { key: 'email', label: 'Email', type: 'string', required: true },
        { key: 'password_hash', label: 'Password Hash', type: 'string', required: true },
        { key: 'first_name', label: 'First Name', type: 'string', required: true },
        { key: 'last_name', label: 'Last Name', type: 'string', required: true },
        { key: 'role_key', label: 'Role Key', type: 'string', required: true },
        { key: 'phone', label: 'Phone', type: 'string', required: false },
        { key: 'status', label: 'Status', type: 'string', required: true },
        { key: 'created_at', label: 'Created At', type: 'timestamp', required: true },
        { key: 'updated_at', label: 'Updated At', type: 'timestamp', required: true }
      ]
    },
    {
      key: 'events',
      label: 'Events',
      order: 20,
      fields: [
        { key: 'name', label: 'Name', type: 'string', required: true },
        { key: 'description', label: 'Description', type: 'string', required: false },
        { key: 'category', label: 'Category', type: 'string', required: false },
        { key: 'start_datetime', label: 'Start Date & Time', type: 'timestamp', required: true },
        { key: 'end_datetime', label: 'End Date & Time', type: 'timestamp', required: true },
        { key: 'venue_id', label: 'Venue', type: 'reference', required: true, refTable: 'venues' },
        { key: 'status', label: 'Status', type: 'string', required: true },
        { key: 'organizer_id', label: 'Organizer', type: 'reference', required: true, refTable: 'users' },
        { key: 'capacity', label: 'Capacity', type: 'number', required: false },
        { key: 'timezone', label: 'Timezone', type: 'string', required: false },
        { key: 'booking_deadline', label: 'Booking Deadline', type: 'timestamp', required: false },
        { key: 'created_at', label: 'Created At', type: 'timestamp', required: true },
        { key: 'updated_at', label: 'Updated At', type: 'timestamp', required: true }
      ]
    },
    {
      key: 'venues',
      label: 'Venues',
      order: 30,
      fields: [
        { key: 'name', label: 'Name', type: 'string', required: true },
        { key: 'location', label: 'Location', type: 'string', required: true },
        { key: 'capacity', label: 'Capacity', type: 'number', required: true },
        { key: 'description', label: 'Description', type: 'string', required: false },
        { key: 'contact_name', label: 'Contact Name', type: 'string', required: false },
        { key: 'contact_email', label: 'Contact Email', type: 'string', required: false },
        { key: 'contact_phone', label: 'Contact Phone', type: 'string', required: false },
        { key: 'status', label: 'Status', type: 'string', required: true },
        { key: 'created_at', label: 'Created At', type: 'timestamp', required: true },
        { key: 'updated_at', label: 'Updated At', type: 'timestamp', required: true }
      ]
    },
    {
      key: 'ticket_types',
      label: 'Ticket Types',
      order: 40,
      fields: [
        { key: 'event_id', label: 'Event', type: 'reference', required: true, refTable: 'events' },
        { key: 'name', label: 'Ticket Name', type: 'string', required: true },
        { key: 'description', label: 'Description', type: 'string', required: false },
        { key: 'price', label: 'Price', type: 'number', required: true },
        { key: 'currency', label: 'Currency', type: 'string', required: true },
        { key: 'total_quantity', label: 'Total Quantity', type: 'number', required: true },
        { key: 'max_per_booking', label: 'Max Per Booking', type: 'number', required: false },
        { key: 'sales_start', label: 'Sales Start', type: 'timestamp', required: false },
        { key: 'sales_end', label: 'Sales End', type: 'timestamp', required: false },
        { key: 'status', label: 'Status', type: 'string', required: true },
        { key: 'created_at', label: 'Created At', type: 'timestamp', required: true },
        { key: 'updated_at', label: 'Updated At', type: 'timestamp', required: true }
      ]
    },
    {
      key: 'bookings',
      label: 'Bookings',
      order: 50,
      fields: [
        { key: 'event_id', label: 'Event', type: 'reference', required: true, refTable: 'events' },
        { key: 'ticket_type_id', label: 'Ticket Type', type: 'reference', required: true, refTable: 'ticket_types' },
        { key: 'customer_name', label: 'Customer Name', type: 'string', required: true },
        { key: 'customer_email', label: 'Customer Email', type: 'string', required: true },
        { key: 'customer_phone', label: 'Customer Phone', type: 'string', required: false },
        { key: 'quantity', label: 'Quantity', type: 'number', required: true },
        { key: 'total_amount', label: 'Total Amount', type: 'number', required: true },
        { key: 'currency', label: 'Currency', type: 'string', required: true },
        { key: 'status', label: 'Status', type: 'string', required: true },
        { key: 'payment_status', label: 'Payment Status', type: 'string', required: true },
        { key: 'booking_reference', label: 'Booking Reference', type: 'string', required: true },
        { key: 'booked_at', label: 'Booked At', type: 'timestamp', required: true },
        { key: 'checked_in_at', label: 'Checked In At', type: 'timestamp', required: false },
        { key: 'notes', label: 'Notes', type: 'string', required: false },
        { key: 'created_at', label: 'Created At', type: 'timestamp', required: true },
        { key: 'updated_at', label: 'Updated At', type: 'timestamp', required: true }
      ]
    },
    {
      key: 'settings',
      label: 'Settings',
      order: 60,
      fields: [
        { key: 'key', label: 'Setting Key', type: 'string', required: true },
        { key: 'value', label: 'Setting Value', type: 'string', required: true },
        { key: 'description', label: 'Description', type: 'string', required: false },
        { key: 'created_at', label: 'Created At', type: 'timestamp', required: true },
        { key: 'updated_at', label: 'Updated At', type: 'timestamp', required: true }
      ]
    }
  ]
} as const;

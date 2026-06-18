import {
  LayoutDashboard,
  Calendar,
  Building2,
  Tag,
  ClipboardList,
  User,
  Building,
  Users,
  Settings
} from 'lucide-react';

export interface NavItem {
  label: string;
  route: string;
  module: string;
  icon?: any;
}

export const mainNav: NavItem[] = [
  {
    label: 'Dashboard',
    route: '/dashboard',
    module: 'dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Events',
    route: '/events',
    module: 'events',
    icon: Calendar,
  },
  {
    label: 'Venues',
    route: '/venues',
    module: 'venues',
    icon: Building2,
  },
  {
    label: 'Ticket Types',
    route: '/tickets',
    module: 'tickets',
    icon: Tag,
  },
  {
    label: 'Bookings',
    route: '/bookings',
    module: 'bookings',
    icon: ClipboardList,
  },
];

export const secondaryNav: NavItem[] = [
  {
    label: 'Profile',
    route: '/settings', // In our settings routing, Profile is the default section
    module: 'settings',
    icon: User,
  },
];

export const settingsNav: NavItem[] = [
  {
    label: 'Organization Settings',
    route: '/settings?tab=organization',
    module: 'settings',
    icon: Building,
  },
  {
    label: 'User Management',
    route: '/settings?tab=users',
    module: 'settings',
    icon: Users,
  },
];

export const byRoleNavigation: Record<string, string[]> = {
  admin: ['/dashboard', '/events', '/venues', '/tickets', '/bookings'],
  event_organizer: ['/dashboard', '/events', '/tickets', '/bookings'],
  venue_manager: ['/dashboard', '/venues', '/events', '/bookings'],
  support: ['/dashboard', '/events', '/venues', '/bookings'],
};

export const byRoleSettings: Record<string, string[]> = {
  admin: ['/settings?tab=profile', '/settings?tab=organization', '/settings?tab=users'],
  event_organizer: ['/settings?tab=profile'],
  venue_manager: ['/settings?tab=profile'],
  support: ['/settings?tab=profile'],
};

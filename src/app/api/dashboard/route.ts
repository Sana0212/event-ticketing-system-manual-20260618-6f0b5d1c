import { requireAuth } from '@/lib/auth/verify-request';
import { NextResponse } from 'next/server';
import { listEvents, listBookings, listVenues } from '@/lib/firestore/app-data';

export const dynamic = 'force-dynamic';

export async function GET(req: Request): Promise<NextResponse> {
  const authVal = await requireAuth();
  if (authVal instanceof NextResponse) return authVal;

  try {
    const [events, bookings, venues] = await Promise.all([
      listEvents(),
      listBookings(),
      listVenues(),
    ]);

    const now = new Date();
    
    // Upcoming Events: count of events where start_datetime is in the future
    const upcomingEventsCount = events.filter((e) => {
      if (!e.start_datetime) return false;
      const startDate = new Date(e.start_datetime as string);
      return startDate > now;
    }).length;

    // Tickets Sold Today: sum of quantity for book_at on current calendar day
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const ticketsSoldToday = bookings
      .filter((b) => {
        if (!b.booked_at) return false;
        const bookedDate = new Date(b.booked_at as string);
        return bookedDate >= startOfToday && bookedDate <= endOfToday;
      })
      .reduce((sum, b) => sum + (Number(b.quantity) || 0), 0);

    // Revenue This Week: sum of total_amount of bookings from last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const revenueThisWeek = bookings
      .filter((b) => {
        if (!b.booked_at) return false;
        const bookedDate = new Date(b.booked_at as string);
        // Usually revenue counts paid/confirmed bookings
        const isPaid = b.payment_status?.toLowerCase() === 'paid' || b.status?.toLowerCase() === 'confirmed';
        return bookedDate >= sevenDaysAgo && isPaid;
      })
      .reduce((sum, b) => sum + (Number(b.total_amount) || 0), 0);

    // Active Venues: count of venues where status is active
    const activeVenuesCount = venues.filter(
      (v) => v.status?.toLowerCase() === 'active'
    ).length;

    // Additional charts/analytics if needed by UI
    // Let's provide a list of recent bookings and upcoming events for UI convenience
    const recentBookings = bookings.slice(0, 5);
    const upcomingEvents = events
      .filter((e) => {
        if (!e.start_datetime) return false;
        return new Date(e.start_datetime as string) > now;
      })
      .slice(0, 5);

    return NextResponse.json({
      success: true,
      data: {
        widgets: {
          upcoming_events: upcomingEventsCount,
          tickets_sold_today: ticketsSoldToday,
          revenue_this_week: revenueThisWeek,
          active_venues: activeVenuesCount,
        },
        recentBookings,
        upcomingEvents,
      },
    });
  } catch (error: any) {
    console.error('Error generating dashboard stats:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate dashboard stats' },
      { status: 500 }
    );
  }
}

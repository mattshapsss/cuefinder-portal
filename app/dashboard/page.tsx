'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { getTodayStats, getVenueBookings } from '@/lib/firebase/firestore';
import { Booking } from '@/types/booking';
import { Calendar, DollarSign, Grid3x3, TrendingUp, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';
import StatCard from '@/components/ui/StatCard';
import Card from '@/components/ui/Card';

interface DashboardStats {
  bookings: number;
  revenue: number;
  occupied: number;
  total: number;
  utilization: number;
}

export default function DashboardPage() {
  const { userData } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userData?.venueId) {
      loadDashboardData();
      
      // Set up interval for real-time updates
      const interval = setInterval(() => {
        loadDashboardData();
      }, 30000); // Refresh every 30 seconds
      
      return () => clearInterval(interval);
    }
  }, [userData]);

  const loadDashboardData = async () => {
    if (!userData?.venueId) return;

    try {
      const [dashStats, bookings] = await Promise.all([
        getTodayStats(userData.venueId),
        getVenueBookings(userData.venueId, new Date())
      ]);

      setStats(dashStats);
      
      // Get next 5 upcoming bookings
      const upcoming = bookings
        .filter(b => new Date(b.startTime) > new Date())
        .slice(0, 5);
      setUpcomingBookings(upcoming);
    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here&apos;s what&apos;s happening at your venue today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Today's Bookings"
          value={stats?.bookings || 0}
          icon={Calendar}
          color="blue"
        />
        <StatCard
          title="Revenue"
          value={`$${stats?.revenue || 0}`}
          icon={DollarSign}
          color="green"
        />
        <StatCard
          title="Tables Occupied"
          value={`${stats?.occupied || 0}/${stats?.total || 0}`}
          icon={Grid3x3}
          color="orange"
        />
        <StatCard
          title="Utilization"
          value={`${stats?.utilization || 0}%`}
          icon={TrendingUp}
          color="purple"
        />
      </div>

      {/* Upcoming Bookings */}
      <Card padding="lg">
        <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
          Upcoming Bookings
        </h3>
        {upcomingBookings.length === 0 ? (
          <p className="text-gray-500">No upcoming bookings today</p>
        ) : (
          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  return (
    <div className="border border-gray-100 rounded-xl p-4 hover:bg-gray-50 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm font-medium">
              {format(new Date(booking.startTime), 'h:mm a')}
            </span>
            <span className="text-sm text-gray-500">
              ({booking.duration} min)
            </span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <Users className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">
              Party of {booking.partySize}
            </span>
          </div>
          {booking.customerName && (
            <p className="text-sm font-medium mt-1">{booking.customerName}</p>
          )}
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold text-green-600">
            ${booking.totalCost}
          </span>
          <p className="text-xs text-gray-500 mt-1">
            Tables: {booking.tableIds.join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
}
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { getTodayStats, getVenueBookings } from '@/lib/firebase/firestore';
import { Booking } from '@/types/booking';
import { Calendar, DollarSign, Grid3x3, TrendingUp, Clock, Users } from 'lucide-react';
import { format } from 'date-fns';

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
          icon={<Calendar className="h-5 w-5" />}
          color="bg-blue-500"
        />
        <StatCard
          title="Revenue"
          value={`$${stats?.revenue || 0}`}
          icon={<DollarSign className="h-5 w-5" />}
          color="bg-green-500"
        />
        <StatCard
          title="Tables Occupied"
          value={`${stats?.occupied || 0}/${stats?.total || 0}`}
          icon={<Grid3x3 className="h-5 w-5" />}
          color="bg-yellow-500"
        />
        <StatCard
          title="Utilization"
          value={`${stats?.utilization || 0}%`}
          icon={<TrendingUp className="h-5 w-5" />}
          color="bg-purple-500"
        />
      </div>

      {/* Upcoming Bookings */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
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
        </div>
      </div>
    </div>
  );
}

function StatCard({ 
  title, 
  value, 
  icon, 
  color 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode; 
  color: string;
}) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`flex-shrink-0 ${color} rounded-md p-3 text-white`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="text-2xl font-semibold text-gray-900">
                {value}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingCard({ booking }: { booking: Booking }) {
  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50">
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
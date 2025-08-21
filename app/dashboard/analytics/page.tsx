'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/providers/auth-provider';
import { getVenueBookings } from '@/lib/firebase/firestore';
import { Booking } from '@/types/booking';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar,
  DollarSign,
  Users,
  Clock
} from 'lucide-react';

interface AnalyticsData {
  revenue: number;
  bookingCount: number;
  avgPartySize: number;
  avgDuration: number;
  peakHours: number[];
  weeklyRevenue: number[];
}

export default function AnalyticsPage() {
  const { userData } = useAuth();
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('week');

  useEffect(() => {
    if (userData?.venueId) {
      loadAnalytics();
    }
  }, [userData, dateRange]);

  const loadAnalytics = async () => {
    if (!userData?.venueId) return;

    try {
      const endDate = new Date();
      const startDate = new Date();
      
      if (dateRange === 'week') {
        startDate.setDate(startDate.getDate() - 7);
      } else if (dateRange === 'month') {
        startDate.setMonth(startDate.getMonth() - 1);
      }

      // Load bookings for each day in range
      const allBookings: Booking[] = [];
      const dailyRevenue: number[] = [];
      
      for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
        const dayBookings = await getVenueBookings(userData.venueId, new Date(d));
        allBookings.push(...dayBookings);
        
        const dayRevenue = dayBookings
          .filter(b => b.status === 'confirmed' || b.status === 'completed')
          .reduce((sum, b) => sum + b.totalCost, 0);
        dailyRevenue.push(dayRevenue);
      }

      // Calculate analytics
      const confirmedBookings = allBookings.filter(
        b => b.status === 'confirmed' || b.status === 'completed'
      );

      const totalRevenue = confirmedBookings.reduce((sum, b) => sum + b.totalCost, 0);
      const avgParty = confirmedBookings.length > 0
        ? confirmedBookings.reduce((sum, b) => sum + b.partySize, 0) / confirmedBookings.length
        : 0;
      const avgDuration = confirmedBookings.length > 0
        ? confirmedBookings.reduce((sum, b) => sum + b.duration, 0) / confirmedBookings.length
        : 0;

      // Calculate peak hours
      const hourCounts: { [key: number]: number } = {};
      confirmedBookings.forEach(booking => {
        const hour = new Date(booking.startTime).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });

      const peakHours = Object.entries(hourCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3)
        .map(([hour]) => parseInt(hour));

      setAnalytics({
        revenue: totalRevenue,
        bookingCount: confirmedBookings.length,
        avgPartySize: Math.round(avgParty * 10) / 10,
        avgDuration: Math.round(avgDuration),
        peakHours,
        weeklyRevenue: dailyRevenue.slice(-7)
      });
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your venue performance and insights
          </p>
        </div>
        <select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-purple-500 focus:border-purple-500"
        >
          <option value="week">Last 7 Days</option>
          <option value="month">Last 30 Days</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Revenue"
          value={`$${analytics?.revenue || 0}`}
          icon={<DollarSign className="h-5 w-5" />}
          change="+12%"
          trend="up"
        />
        <MetricCard
          title="Total Bookings"
          value={analytics?.bookingCount || 0}
          icon={<Calendar className="h-5 w-5" />}
          change="+8%"
          trend="up"
        />
        <MetricCard
          title="Avg Party Size"
          value={analytics?.avgPartySize || 0}
          icon={<Users className="h-5 w-5" />}
          change="-2%"
          trend="down"
        />
        <MetricCard
          title="Avg Duration"
          value={`${analytics?.avgDuration || 0} min`}
          icon={<Clock className="h-5 w-5" />}
          change="+5%"
          trend="up"
        />
      </div>

      {/* Revenue Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h3>
        <div className="h-64 flex items-end space-x-2">
          {analytics?.weeklyRevenue.map((revenue, index) => (
            <div
              key={index}
              className="flex-1 bg-purple-500 rounded-t"
              style={{
                height: `${(revenue / Math.max(...(analytics.weeklyRevenue || [1]))) * 100}%`,
                minHeight: '4px'
              }}
            >
              <div className="text-center text-xs text-white mt-1">
                ${revenue}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
            <span key={day}>{day}</span>
          ))}
        </div>
      </div>

      {/* Peak Hours */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Peak Hours</h3>
        <div className="space-y-2">
          {analytics?.peakHours.map((hour, index) => (
            <div key={hour} className="flex items-center">
              <span className="text-2xl font-bold text-gray-400 w-8">
                {index + 1}
              </span>
              <div className="ml-4 flex-1">
                <div className="text-sm font-medium text-gray-900">
                  {hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`}
                </div>
                <div className="mt-1 h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-purple-500 rounded"
                    style={{ width: `${100 - (index * 30)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ 
  title, 
  value, 
  icon, 
  change, 
  trend 
}: { 
  title: string; 
  value: string | number; 
  icon: React.ReactNode; 
  change: string;
  trend: 'up' | 'down';
}) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="p-3 bg-purple-100 rounded-md">
              {icon}
            </div>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd className="flex items-baseline">
                <div className="text-2xl font-semibold text-gray-900">
                  {value}
                </div>
                <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                  trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendingUp className={`h-4 w-4 ${trend === 'down' ? 'rotate-180' : ''}`} />
                  {change}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
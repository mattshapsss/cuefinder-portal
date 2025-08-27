import { Venue } from '@/types/venue';
import { Booking } from '@/types/booking';
import { Table } from '@/types/table';
import { addDays, addHours, format } from 'date-fns';

// Demo venue data - Flatstick Pub Seattle
export const DEMO_VENUE: Venue = {
  id: 'demo-venue-001',
  name: 'Flatstick Pub - Pioneer Square',
  address: '240 2nd Ave S, Seattle, WA 98104',
  phone: '(206) 652-0359',
  website: 'https://flatstickpub.com',
  type: 'sports_bar',
  priceRange: 2,
  hours: {
    monday: { open: '11:00', close: '23:00', isOpen24Hours: false },
    tuesday: { open: '11:00', close: '23:00', isOpen24Hours: false },
    wednesday: { open: '11:00', close: '23:00', isOpen24Hours: false },
    thursday: { open: '11:00', close: '00:00', isOpen24Hours: false },
    friday: { open: '11:00', close: '01:00', isOpen24Hours: false },
    saturday: { open: '10:00', close: '01:00', isOpen24Hours: false },
    sunday: { open: '10:00', close: '22:00', isOpen24Hours: false }
  },
  amenities: ['full_bar', 'food', 'mini_golf', 'duffleboard', 'arcade', 'private_events'],
  location: {
    latitude: 47.6001,
    longitude: -122.3313
  },
  tableCount: 12,
  pricePerHour: 35,
  bookingEnabled: true,
  ownerId: 'demo-user',
  ownerEmail: 'demo@cuefinder.app',
  verificationStatus: 'verified',
  cueScore: {
    overall: 4.3,
    tableQuality: 4.2,
    equipment: 4.0,
    atmosphere: 4.7,
    value: 4.3
  },
  reviewCount: 287,
  hasFullBar: true,
  hasPoolTableConfirmed: true,
  description: 'Local chain bar with mini golf, pool tables, and local craft beers. Great for groups and events.',
  stripeAccountId: 'demo_stripe_account'
};

// Demo tables with various statuses
export const DEMO_TABLES: Table[] = [
  { id: 'table-1', venueId: DEMO_VENUE.id, tableNumber: '1', size: '8ft', type: 'standard', hourlyRate: 35, isActive: true, maintenanceStatus: 'good', location: 'Main Floor' },
  { id: 'table-2', venueId: DEMO_VENUE.id, tableNumber: '2', size: '8ft', type: 'standard', hourlyRate: 35, isActive: true, maintenanceStatus: 'good', location: 'Main Floor' },
  { id: 'table-3', venueId: DEMO_VENUE.id, tableNumber: '3', size: '9ft', type: 'tournament', hourlyRate: 45, isActive: true, maintenanceStatus: 'good', location: 'Main Floor' },
  { id: 'table-4', venueId: DEMO_VENUE.id, tableNumber: '4', size: '8ft', type: 'standard', hourlyRate: 35, isActive: true, maintenanceStatus: 'fair', location: 'Main Floor' },
  { id: 'table-5', venueId: DEMO_VENUE.id, tableNumber: '5', size: '7ft', type: 'bar_box', hourlyRate: 30, isActive: true, maintenanceStatus: 'good', location: 'Bar Area' },
  { id: 'table-6', venueId: DEMO_VENUE.id, tableNumber: '6', size: '7ft', type: 'bar_box', hourlyRate: 30, isActive: false, maintenanceStatus: 'under_maintenance', location: 'Bar Area' },
  { id: 'table-7', venueId: DEMO_VENUE.id, tableNumber: '7', size: '8ft', type: 'standard', hourlyRate: 35, isActive: true, maintenanceStatus: 'good', location: 'Back Room' },
  { id: 'table-8', venueId: DEMO_VENUE.id, tableNumber: '8', size: '8ft', type: 'standard', hourlyRate: 35, isActive: true, maintenanceStatus: 'good', location: 'Back Room' },
  { id: 'table-9', venueId: DEMO_VENUE.id, tableNumber: 'VIP-1', size: '9ft', type: 'tournament', hourlyRate: 55, isActive: true, maintenanceStatus: 'good', location: 'VIP Room' },
  { id: 'table-10', venueId: DEMO_VENUE.id, tableNumber: 'VIP-2', size: '9ft', type: 'tournament', hourlyRate: 55, isActive: true, maintenanceStatus: 'good', location: 'VIP Room' },
  { id: 'table-11', venueId: DEMO_VENUE.id, tableNumber: '11', size: '8ft', type: 'standard', hourlyRate: 35, isActive: true, maintenanceStatus: 'good', location: 'Main Floor' },
  { id: 'table-12', venueId: DEMO_VENUE.id, tableNumber: '12', size: '8ft', type: 'standard', hourlyRate: 35, isActive: true, maintenanceStatus: 'good', location: 'Main Floor' }
];

// Generate realistic demo bookings
function generateDemoBookings(): Booking[] {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const bookings: Booking[] = [
    // Past bookings (completed)
    {
      id: 'booking-1',
      venueId: DEMO_VENUE.id,
      userId: 'user-1',
      tableIds: ['table-1'],
      bookingDate: today,
      startTime: addHours(today, 10).toISOString(),
      endTime: addHours(today, 12).toISOString(),
      duration: 120,
      partySize: 4,
      status: 'completed',
      totalCost: 70,
      createdAt: addDays(today, -2).toISOString(),
      updatedAt: addHours(today, 12).toISOString(),
      confirmationCode: 'FLT-A3B',
      customerName: 'John Smith',
      customerEmail: 'john@example.com'
    },
    {
      id: 'booking-2',
      venueId: DEMO_VENUE.id,
      userId: 'user-2',
      tableIds: ['table-3', 'table-4'],
      bookingDate: today,
      startTime: addHours(today, 11).toISOString(),
      endTime: addHours(today, 13).toISOString(),
      duration: 120,
      partySize: 8,
      status: 'completed',
      totalCost: 160,
      createdAt: addDays(today, -1).toISOString(),
      updatedAt: addHours(today, 13).toISOString(),
      confirmationCode: 'FLT-B7K',
      customerName: 'Sarah Johnson',
      customerEmail: 'sarah@example.com'
    },
    // Current/In Progress
    {
      id: 'booking-3',
      venueId: DEMO_VENUE.id,
      userId: 'user-3',
      tableIds: ['table-5'],
      bookingDate: today,
      startTime: addHours(today, Math.floor(now.getHours()) - 1).toISOString(),
      endTime: addHours(today, Math.floor(now.getHours()) + 1).toISOString(),
      duration: 120,
      partySize: 3,
      status: 'in_progress',
      totalCost: 60,
      createdAt: addDays(today, -1).toISOString(),
      updatedAt: today.toISOString(),
      confirmationCode: 'FLT-C9M',
      customerName: 'Mike Chen',
      customerEmail: 'mike@example.com'
    },
    // Upcoming bookings
    {
      id: 'booking-4',
      venueId: DEMO_VENUE.id,
      userId: 'user-4',
      tableIds: ['table-7', 'table-8'],
      bookingDate: today,
      startTime: addHours(now, 1).toISOString(),
      endTime: addHours(now, 3).toISOString(),
      duration: 120,
      partySize: 6,
      status: 'confirmed',
      totalCost: 140,
      createdAt: addDays(today, -3).toISOString(),
      updatedAt: today.toISOString(),
      confirmationCode: 'FLT-D2P',
      customerName: 'Emily Davis',
      customerEmail: 'emily@example.com',
      specialRequests: ['Birthday celebration', 'Need chalk']
    },
    {
      id: 'booking-5',
      venueId: DEMO_VENUE.id,
      userId: 'user-5',
      tableIds: ['table-9'],
      bookingDate: today,
      startTime: addHours(now, 2).toISOString(),
      endTime: addHours(now, 4).toISOString(),
      duration: 120,
      partySize: 4,
      status: 'confirmed',
      totalCost: 110,
      createdAt: today.toISOString(),
      updatedAt: today.toISOString(),
      confirmationCode: 'FLT-E5R',
      customerName: 'Alex Thompson',
      customerEmail: 'alex@example.com'
    },
    {
      id: 'booking-6',
      venueId: DEMO_VENUE.id,
      userId: 'user-6',
      tableIds: ['table-2'],
      bookingDate: today,
      startTime: addHours(now, 3).toISOString(),
      endTime: addHours(now, 5).toISOString(),
      duration: 120,
      partySize: 2,
      status: 'pending',
      totalCost: 70,
      createdAt: addHours(now, -1).toISOString(),
      updatedAt: addHours(now, -1).toISOString(),
      confirmationCode: 'FLT-F8T',
      customerName: 'David Wilson',
      customerEmail: 'david@example.com'
    },
    {
      id: 'booking-7',
      venueId: DEMO_VENUE.id,
      userId: 'user-7',
      tableIds: ['table-11', 'table-12'],
      bookingDate: today,
      startTime: addHours(now, 4).toISOString(),
      endTime: addHours(now, 7).toISOString(),
      duration: 180,
      partySize: 10,
      status: 'confirmed',
      totalCost: 210,
      createdAt: addDays(today, -5).toISOString(),
      updatedAt: today.toISOString(),
      confirmationCode: 'FLT-G3V',
      customerName: 'Corporate Events LLC',
      customerEmail: 'events@company.com',
      notes: 'Team building event',
      specialRequests: ['Reserved signs', 'Tournament setup']
    }
  ];

  return bookings;
}

export const DEMO_BOOKINGS = generateDemoBookings();

// Calculate demo stats
export function getDemoStats() {
  const now = new Date();
  const todayBookings = DEMO_BOOKINGS.filter(b => {
    const bookingDate = new Date(b.startTime);
    return bookingDate.toDateString() === now.toDateString();
  });

  const revenue = todayBookings.reduce((sum, b) => sum + b.totalCost, 0);
  const occupiedTables = DEMO_BOOKINGS.filter(b => b.status === 'in_progress').length;
  const utilization = Math.round((occupiedTables / DEMO_TABLES.filter(t => t.isActive).length) * 100);

  return {
    bookings: todayBookings.length,
    revenue,
    occupied: occupiedTables,
    total: DEMO_TABLES.length,
    utilization
  };
}

// Weekly revenue trend for demo
export function getDemoWeeklyRevenue(): number[] {
  return [850, 1100, 920, 1350, 1480, 1620, 1250]; // Last 7 days
}

// Demo user data
export const DEMO_USER = {
  uid: 'demo-user-001',
  email: 'demo@cuefinder.app',
  displayName: 'Demo Venue Owner',
  venueId: DEMO_VENUE.id,
  venueName: DEMO_VENUE.name,
  role: 'venue_owner' as const,
  isDemo: true
};
export interface Venue {
  id: string;
  name: string;
  type: VenueType;
  address: string;
  phone?: string;
  website?: string;
  email?: string;
  priceRange: number; // 1-4
  hours: Record<string, HoursInfo>;
  amenities: string[];
  
  // Pool-specific
  tableCount: number;
  tableSizes: string[];
  pricePerHour?: number;
  pricePerGame?: number;
  
  // Booking
  bookingEnabled: boolean;
  ownerId?: string;
  ownerEmail?: string;
  requiresApproval?: boolean;
  
  // Venue claiming and verification
  claimedAt?: Date;
  verificationStatus?: 'pending' | 'verified' | 'rejected';
  
  // External booking systems (from enrichment)
  externalBooking?: {
    hasOpenTable?: boolean;
    hasResy?: boolean;
    hasYelp?: boolean;
  };
  
  // Location
  location?: {
    latitude: number;
    longitude: number;
  };
  
  // Analytics
  totalBookings?: number;
  totalRevenue?: number;
}

export interface HoursInfo {
  open: string;
  close: string;
  isOpen24Hours: boolean;
}

export enum VenueType {
  POOL_HALL = 'pool_hall',
  SPORTS_BAR = 'sports_bar',
  BILLIARD_CLUB = 'billiard_club',
  ARCADE = 'arcade',
  BOWLING_ALLEY = 'bowling_alley'
}

export interface Table {
  id: string;
  venueId: string;
  tableNumber: string;
  size: string; // '7ft', '8ft', '9ft'
  type: string;
  hourlyRate: number;
  isActive: boolean;
  maintenanceStatus: MaintenanceStatus;
  features: string[];
}

export enum MaintenanceStatus {
  GOOD = 'good',
  FAIR = 'fair',
  NEEDS_WORK = 'needs_work',
  UNDER_MAINTENANCE = 'under_maintenance'
}
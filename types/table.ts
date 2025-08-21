export interface Table {
  id: string;
  venueId: string;
  number: number;
  size: '7ft' | '8ft' | '9ft';
  type: 'standard' | 'tournament' | 'snooker';
  status: 'available' | 'occupied' | 'maintenance';
  hourlyRate: number;
  isActive: boolean;
  currentBookingId?: string;
  features?: string[];
}
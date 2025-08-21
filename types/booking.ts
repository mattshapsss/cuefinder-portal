export interface Booking {
  id: string;
  venueId: string;
  userId: string;
  tableIds: string[];
  bookingDate: Date;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  partySize: number;
  status: BookingStatus;
  totalCost: number;
  depositAmount?: number;
  createdAt: Date;
  updatedAt: Date;
  confirmationCode: string;
  notes?: string;
  specialRequests: string[];
  cancellationReason?: string;
  noShowFee?: number;
  actualStartTime?: Date;
  gracePeriodMinutes: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
}

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CHECKED_IN = 'checked_in',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
  NO_SHOW = 'no_show',
  IN_PROGRESS = 'in_progress'
}

export const BookingStatusDisplay: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: 'Pending',
  [BookingStatus.CONFIRMED]: 'Confirmed',
  [BookingStatus.CHECKED_IN]: 'Checked In',
  [BookingStatus.CANCELLED]: 'Cancelled',
  [BookingStatus.COMPLETED]: 'Completed',
  [BookingStatus.NO_SHOW]: 'No Show',
  [BookingStatus.IN_PROGRESS]: 'In Progress'
};

export const BookingStatusColors: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: 'orange',
  [BookingStatus.CONFIRMED]: 'green',
  [BookingStatus.CHECKED_IN]: 'blue',
  [BookingStatus.CANCELLED]: 'red',
  [BookingStatus.COMPLETED]: 'gray',
  [BookingStatus.NO_SHOW]: 'red',
  [BookingStatus.IN_PROGRESS]: 'blue'
};
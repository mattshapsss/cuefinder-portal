export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  venueId?: string; // For venue owners
  createdAt: Date;
  phoneNumber?: string;
}

export enum UserRole {
  CUSTOMER = 'customer',
  VENUE_OWNER = 'venue_owner',
  ADMIN = 'admin'
}
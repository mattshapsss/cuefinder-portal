export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  ownedVenueIds: string[]; // Array of venue IDs for venue owners
  createdAt: Date;
  phoneNumber?: string;
  profileImageURL?: string;
  // Backward compatibility - first venue from ownedVenueIds
  venueId?: string;
}

export enum UserRole {
  CUSTOMER = 'customer',
  VENUE_OWNER = 'venue_owner',
  ADMIN = 'admin'
}
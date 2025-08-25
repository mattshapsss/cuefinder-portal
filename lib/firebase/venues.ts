import { 
  collection, 
  query, 
  where, 
  getDocs, 
  doc,
  updateDoc,
  orderBy,
  limit,
  DocumentData
} from 'firebase/firestore';
import { db } from './config';
import { Venue } from '@/types/venue';

export async function searchVenues(searchTerm: string): Promise<Venue[]> {
  if (!searchTerm || searchTerm.length < 2) {
    return [];
  }

  try {
    // Get all venues (we'll do client-side filtering for fuzzy matching)
    const venuesRef = collection(db, 'venues');
    const q = query(
      venuesRef,
      where('isActive', '==', true),
      orderBy('name'),
      limit(100)
    );

    const snapshot = await getDocs(q);
    const venues: Venue[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      // Only include venues that haven't been claimed yet or match search
      if (!data.ownerId) {
        const venue = {
          id: doc.id,
          ...data
        } as Venue;
        
        // Case-insensitive search in name and address
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = venue.name?.toLowerCase().includes(searchLower);
        const addressMatch = venue.address?.toLowerCase().includes(searchLower);
        
        if (nameMatch || addressMatch) {
          venues.push(venue);
        }
      }
    });

    // Sort by best match (name matches first, then address matches)
    venues.sort((a, b) => {
      const searchLower = searchTerm.toLowerCase();
      const aNameMatch = a.name?.toLowerCase().includes(searchLower) ? 1 : 0;
      const bNameMatch = b.name?.toLowerCase().includes(searchLower) ? 1 : 0;
      return bNameMatch - aNameMatch;
    });

    return venues.slice(0, 10); // Return top 10 matches
  } catch (error) {
    console.error('Error searching venues:', error);
    return [];
  }
}

export async function getUnclaimedVenues(): Promise<Venue[]> {
  try {
    const venuesRef = collection(db, 'venues');
    const q = query(
      venuesRef,
      where('isActive', '==', true),
      orderBy('name'),
      limit(20)
    );

    const snapshot = await getDocs(q);
    const venues: Venue[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      if (!data.ownerId) {
        venues.push({
          id: doc.id,
          ...data
        } as Venue);
      }
    });

    return venues;
  } catch (error) {
    console.error('Error fetching unclaimed venues:', error);
    return [];
  }
}

export async function claimVenue(
  venueId: string, 
  userId: string, 
  userEmail: string
): Promise<void> {
  try {
    const venueRef = doc(db, 'venues', venueId);
    
    // Update the venue with owner information
    await updateDoc(venueRef, {
      ownerId: userId,
      ownerEmail: userEmail,
      bookingEnabled: true, // Enable CueFinder booking system
      claimedAt: new Date(),
      verificationStatus: 'verified', // Auto-verify for now
      updatedAt: new Date()
    });
  } catch (error) {
    console.error('Error claiming venue:', error);
    throw new Error('Failed to claim venue');
  }
}

export async function checkVenueOwnership(venueId: string): Promise<boolean> {
  try {
    const venuesRef = collection(db, 'venues');
    const q = query(venuesRef, where('id', '==', venueId));
    const snapshot = await getDocs(q);
    
    if (!snapshot.empty) {
      const venue = snapshot.docs[0].data();
      return !!venue.ownerId;
    }
    return false;
  } catch (error) {
    console.error('Error checking venue ownership:', error);
    return false;
  }
}
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  setDoc,
  query, 
  where, 
  orderBy, 
  limit,
  onSnapshot,
  Timestamp,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './config';
import { Booking, BookingStatus } from '@/types/booking';
import { Venue } from '@/types/venue';
import { Table } from '@/types/table';
import { User } from '@/types/user';

// Booking operations
export async function getVenueBookings(venueId: string, date?: Date): Promise<Booking[]> {
  try {
    let q = query(
      collection(db, 'bookings'),
      where('venueId', '==', venueId),
      orderBy('startTime', 'desc')
    );
    
    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);
      
      q = query(
        collection(db, 'bookings'),
        where('venueId', '==', venueId),
        where('startTime', '>=', Timestamp.fromDate(startOfDay)),
        where('startTime', '<=', Timestamp.fromDate(endOfDay)),
        orderBy('startTime', 'asc')
      );
    }
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startTime: doc.data().startTime?.toDate(),
      endTime: doc.data().endTime?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Booking));
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
}

export async function updateBookingStatus(
  bookingId: string, 
  status: BookingStatus,
  additionalData?: Record<string, unknown>
) {
  try {
    await updateDoc(doc(db, 'bookings', bookingId), {
      status,
      updatedAt: serverTimestamp(),
      ...additionalData
    });
  } catch (error) {
    console.error('Error updating booking status:', error);
    throw error;
  }
}

export async function getVenue(venueId: string): Promise<Venue | null> {
  try {
    const venueDoc = await getDoc(doc(db, 'venues', venueId));
    
    if (!venueDoc.exists()) {
      return null;
    }
    
    return {
      id: venueDoc.id,
      ...venueDoc.data()
    } as Venue;
  } catch (error) {
    console.error('Error fetching venue:', error);
    throw error;
  }
}

// User functions
export async function createUserProfile(userId: string, data: Partial<User>) {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });
}

export async function getUserProfile(userId: string): Promise<User | null> {
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return { id: userSnap.id, ...userSnap.data() } as User;
  }
  return null;
}

// Table functions
export async function getVenueTables(venueId: string): Promise<Table[]> {
  try {
    const q = query(
      collection(db, 'tables'),
      where('venueId', '==', venueId),
      orderBy('number', 'asc')
    );
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Table));
  } catch (error) {
    console.error('Error fetching tables:', error);
    // Return mock data if tables collection doesn't exist yet
    return generateMockTables(venueId);
  }
}

export async function updateTableStatus(
  tableId: string, 
  status: 'available' | 'occupied' | 'maintenance'
) {
  const tableRef = doc(db, 'tables', tableId);
  await updateDoc(tableRef, {
    status,
    updatedAt: serverTimestamp()
  });
}

// Real-time listeners
export function subscribeToBookings(
  venueId: string,
  callback: (bookings: Booking[]) => void
) {
  const q = query(
    collection(db, 'bookings'),
    where('venueId', '==', venueId),
    where('startTime', '>=', Timestamp.fromDate(new Date())),
    orderBy('startTime', 'asc'),
    limit(50)
  );
  
  return onSnapshot(q, (snapshot) => {
    const bookings = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      startTime: doc.data().startTime?.toDate(),
      endTime: doc.data().endTime?.toDate(),
      createdAt: doc.data().createdAt?.toDate(),
      updatedAt: doc.data().updatedAt?.toDate()
    } as Booking));
    
    callback(bookings);
  });
}

// Analytics functions
export async function getTodayStats(venueId: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const bookings = await getVenueBookings(venueId, today);
  const confirmedBookings = bookings.filter(b => b.status === BookingStatus.CONFIRMED);
  
  const revenue = confirmedBookings.reduce((sum, b) => sum + b.totalCost, 0);
  const tables = await getVenueTables(venueId);
  
  // Calculate occupied tables (simplified)
  const now = new Date();
  const currentBookings = bookings.filter(b => 
    b.status === BookingStatus.IN_PROGRESS ||
    (b.status === BookingStatus.CONFIRMED && b.startTime <= now && b.endTime >= now)
  );
  
  const occupiedTableIds = new Set(currentBookings.flatMap(b => b.tableIds));
  
  return {
    bookings: confirmedBookings.length,
    revenue,
    occupied: occupiedTableIds.size,
    total: tables.length,
    utilization: tables.length > 0 ? Math.round((occupiedTableIds.size / tables.length) * 100) : 0
  };
}

// Subscribe to tables
export function subscribeToTables(
  venueId: string,
  callback: (tables: Table[]) => void
) {
  const tablesRef = collection(db, 'tables');
  const q = query(
    tablesRef,
    where('venueId', '==', venueId),
    orderBy('number', 'asc')
  );

  return onSnapshot(q, (snapshot) => {
    const tables = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Table));
    callback(tables);
  });
}

// Helper function to generate mock tables if none exist
function generateMockTables(venueId: string): Table[] {
  const mockTables: Table[] = [];
  for (let i = 1; i <= 8; i++) {
    mockTables.push({
      id: `table-${i}`,
      venueId,
      number: i,
      size: i <= 2 ? '7ft' : i <= 6 ? '8ft' : '9ft',
      type: i <= 6 ? 'standard' : 'tournament',
      hourlyRate: i <= 2 ? 15 : i <= 6 ? 20 : 25,
      status: 'available',
      isActive: true
    });
  }
  return mockTables;
}
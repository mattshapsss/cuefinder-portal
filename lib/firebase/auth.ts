import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { User, UserRole } from '@/types/user';

export async function signIn(email: string, password: string) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
    
    if (!userDoc.exists()) {
      throw new Error('User data not found');
    }
    
    const userData = userDoc.data();
    
    // Check if user is a venue owner
    if (userData.role !== 'venue_owner') {
      await firebaseSignOut(auth);
      throw new Error('Access denied: Venue owner account required');
    }
    
    // Check if venue is assigned
    if (!userData.ownedVenueIds || userData.ownedVenueIds.length === 0) {
      await firebaseSignOut(auth);
      throw new Error('No venue associated with this account');
    }
    
    return {
      user: userCredential.user,
      userData: {
        id: userCredential.user.uid,
        ...userData
      } as User
    };
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}

export async function signUp(email: string, password: string, venueId: string) {
  try {
    // Check if venue exists and is not already claimed
    const venueDoc = await getDoc(doc(db, 'venues', venueId));
    if (!venueDoc.exists()) {
      throw new Error('Venue not found');
    }
    
    const venueData = venueDoc.data();
    if (venueData.ownerId) {
      throw new Error('This venue has already been claimed');
    }
    
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    
    // Update existing venue with owner info
    await setDoc(doc(db, 'venues', venueId), {
      ownerId: uid,
      ownerEmail: email,
      bookingEnabled: true,
      claimedAt: new Date(),
      verificationStatus: 'pending'
    }, { merge: true });
    
    // Create user profile
    const userData: User = {
      id: uid,
      email: email,
      displayName: venueData.name || 'Venue Owner',
      role: UserRole.VENUE_OWNER,
      ownedVenueIds: [venueId],
      createdAt: new Date(),
      phoneNumber: '',
      profileImageURL: undefined
    };
    
    await setDoc(doc(db, 'users', uid), userData);
    
    return {
      user: userCredential.user,
      userData
    };
  } catch (error) {
    console.error('Sign up error:', error);
    throw error;
  }
}

export async function signInWithGoogle() {
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    
    // Check if user exists
    const userDoc = await getDoc(doc(db, 'users', result.user.uid));
    
    if (!userDoc.exists()) {
      // Create new venue owner account WITHOUT venue (they'll claim it later)
      const userData: User = {
        id: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName || 'Venue Owner',
        role: UserRole.VENUE_OWNER,
        ownedVenueIds: [], // Empty - no venue yet
        createdAt: new Date(),
        phoneNumber: '',
        profileImageURL: result.user.photoURL || undefined
      };
      
      await setDoc(doc(db, 'users', result.user.uid), userData);
      
      return {
        user: result.user,
        userData,
        needsVenueClaim: true // Signal that user needs to claim a venue
      };
    } else {
      // Check existing user role
      const userData = userDoc.data() as User;
      
      if (userData.role !== UserRole.VENUE_OWNER) {
        await firebaseSignOut(auth);
        throw new Error('This account is registered as a customer. Please use the mobile app.');
      }
      
      // Check if they have a venue
      if (!userData.ownedVenueIds || userData.ownedVenueIds.length === 0) {
        return {
          user: result.user,
          userData,
          needsVenueClaim: true // Existing user but no venue yet
        };
      }
      
      return {
        user: result.user,
        userData,
        needsVenueClaim: false
      };
    }
  } catch (error) {
    console.error('Google sign in error:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error;
  }
}

export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function getCurrentUser(): Promise<User | null> {
  const firebaseUser = auth.currentUser;
  
  if (!firebaseUser) {
    return null;
  }
  
  try {
    const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
    
    if (!userDoc.exists()) {
      return null;
    }
    
    const userData = userDoc.data() as User;
    
    // Add venueId for backward compatibility
    return {
      ...userData,
      id: firebaseUser.uid,
      venueId: userData.ownedVenueIds?.[0] || undefined
    } as User;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}
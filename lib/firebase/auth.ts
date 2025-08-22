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

export async function signUp(email: string, password: string, venueName: string) {
  try {
    // Create auth user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;
    
    // Create venue document
    const venueId = `venue_${uid}_${Date.now()}`;
    await setDoc(doc(db, 'venues', venueId), {
      id: venueId,
      name: venueName,
      ownerId: uid,
      createdAt: new Date(),
      address: '',
      phone: '',
      email: email,
      bookingEnabled: true,
      isActive: true
    });
    
    // Create user profile
    const userData: User = {
      id: uid,
      email: email,
      displayName: venueName,
      role: UserRole.VENUE_OWNER,
      ownedVenueIds: [venueId],
      createdAt: new Date(),
      phoneNumber: '',
      profileImageURL: null
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
      // Create new venue owner account
      const venueId = `venue_${result.user.uid}_${Date.now()}`;
      
      // Create venue document
      await setDoc(doc(db, 'venues', venueId), {
        id: venueId,
        name: `${result.user.displayName}'s Venue`,
        ownerId: result.user.uid,
        createdAt: new Date(),
        address: '',
        phone: '',
        email: result.user.email,
        bookingEnabled: true,
        isActive: true
      });
      
      // Create user profile as venue owner
      const userData: User = {
        id: result.user.uid,
        email: result.user.email || '',
        displayName: result.user.displayName || 'Venue Owner',
        role: UserRole.VENUE_OWNER,
        ownedVenueIds: [venueId],
        createdAt: new Date(),
        phoneNumber: '',
        profileImageURL: result.user.photoURL
      };
      
      await setDoc(doc(db, 'users', result.user.uid), userData);
      
      return {
        user: result.user,
        userData
      };
    } else {
      // Check existing user role
      const userData = userDoc.data() as User;
      
      if (userData.role !== UserRole.VENUE_OWNER) {
        await firebaseSignOut(auth);
        throw new Error('This account is registered as a customer. Please use the mobile app.');
      }
      
      if (!userData.ownedVenueIds || userData.ownedVenueIds.length === 0) {
        await firebaseSignOut(auth);
        throw new Error('No venue associated with this account');
      }
      
      return {
        user: result.user,
        userData
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
      id: firebaseUser.uid,
      ...userData,
      venueId: userData.ownedVenueIds?.[0] || undefined
    } as User;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}
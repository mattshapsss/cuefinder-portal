import { 
  signInWithEmailAndPassword, 
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { User } from '@/types/user';

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
    if (!userData.venueId) {
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
    
    return {
      id: firebaseUser.uid,
      ...userDoc.data()
    } as User;
  } catch (error) {
    console.error('Get current user error:', error);
    return null;
  }
}
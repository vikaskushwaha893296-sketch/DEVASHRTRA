import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer, setDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// CRITICAL: Must use firestoreDatabaseId from firebase-applet-config.json
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Sign-in failed:', error);
    throw error;
  }
}

export async function signOutFirebase() {
  await fbSignOut(auth);
}

export async function saveProjectInFirestore(project: {
  title: string;
  language: string;
  code: string;
  userId: string;
  userName?: string;
}) {
  try {
    const currentUser = auth.currentUser;
    const authorId = currentUser ? currentUser.uid : project.userId;
    const docId = 'proj_' + Date.now();
    await setDoc(doc(db, 'projects', docId), {
      title: project.title,
      language: project.language,
      code: project.code,
      authorId,
      userName: project.userName || 'Student',
      updatedAt: serverTimestamp(),
    });
    return { success: true, id: docId };
  } catch (err) {
    console.warn('Firestore write omitted or offline:', err);
    return { success: false, fallback: true };
  }
}

// Test connection on boot per Firebase guidelines
export async function testFirestoreConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firestore is running in offline mode.');
    }
  }
}

testFirestoreConnection();

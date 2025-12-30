import { initializeApp, FirebaseApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
  Firestore,
} from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  Auth,
  User,
} from 'firebase/auth';
import type { Task } from '../types';

// Firebase config - user must replace with their own
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

let app: FirebaseApp | null = null;
let db: Firestore | null = null;
let auth: Auth | null = null;

export function initializeFirebase(config?: typeof firebaseConfig) {
  const finalConfig = config || firebaseConfig;

  if (finalConfig.apiKey === "YOUR_API_KEY") {
    console.warn('Firebase not configured. Using local storage fallback.');
    return false;
  }

  try {
    app = initializeApp(finalConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    return true;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return false;
  }
}

export function getFirebaseAuth() {
  return auth;
}

export function getFirebaseDb() {
  return db;
}

export async function signInWithGoogle(): Promise<User | null> {
  if (!auth) {
    console.error('Auth not initialized');
    return null;
  }

  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error('Sign in error:', error);
    return null;
  }
}

export async function signOut(): Promise<void> {
  if (!auth) return;
  await firebaseSignOut(auth);
}

export function onAuthChange(callback: (user: User | null) => void) {
  if (!auth) {
    callback(null);
    return () => {};
  }
  return onAuthStateChanged(auth, callback);
}

// Task CRUD operations
export async function addTask(task: Omit<Task, 'id'>): Promise<string | null> {
  if (!db) return null;

  try {
    const docRef = await addDoc(collection(db, 'tasks'), {
      ...task,
      dueDate: task.dueDate ? Timestamp.fromDate(task.dueDate) : null,
      createdAt: Timestamp.fromDate(task.createdAt),
      updatedAt: Timestamp.fromDate(task.updatedAt),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding task:', error);
    return null;
  }
}

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<boolean> {
  if (!db) return false;

  try {
    const taskRef = doc(db, 'tasks', taskId);
    const updateData: Record<string, unknown> = { ...updates };

    if (updates.dueDate) {
      updateData.dueDate = Timestamp.fromDate(updates.dueDate);
    }
    if (updates.updatedAt) {
      updateData.updatedAt = Timestamp.fromDate(updates.updatedAt);
    }

    await updateDoc(taskRef, updateData);
    return true;
  } catch (error) {
    console.error('Error updating task:', error);
    return false;
  }
}

export async function deleteTask(taskId: string): Promise<boolean> {
  if (!db) return false;

  try {
    await deleteDoc(doc(db, 'tasks', taskId));
    return true;
  } catch (error) {
    console.error('Error deleting task:', error);
    return false;
  }
}

export function subscribeToTasks(
  userId: string,
  callback: (tasks: Task[]) => void
): () => void {
  if (!db) {
    callback([]);
    return () => {};
  }

  const q = query(
    collection(db, 'tasks'),
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const tasks: Task[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        category: data.category,
        completed: data.completed,
        dueDate: data.dueDate?.toDate(),
        dueTime: data.dueTime,
        timeframe: data.timeframe,
        recurrence: data.recurrence,
        priority: data.priority,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
        userId: data.userId,
        notes: data.notes,
      };
    });
    callback(tasks);
  });
}

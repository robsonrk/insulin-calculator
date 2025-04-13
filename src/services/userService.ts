import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User } from 'firebase/auth';
import { db } from '../config/firebase';

export interface InsulinSettings {
  icr: {
    normal: number;
    morning: number;
  };
  isf: number;
  targetGlucose: number;
  rounding: 'floor' | 'round';
}

export type UserPreferences = {
  language: string;
  theme: 'light' | 'dark';
  notifications: boolean;
  insulinSettings: InsulinSettings;
}

export const getUserPreferences = async (user: User): Promise<UserPreferences | null> => {
  const userDoc = doc(db, 'users', user.uid);
  const docSnap = await getDoc(userDoc);

  if (docSnap.exists()) {
    return docSnap.data() as UserPreferences;
  }

  return null;
};

export const updateUserPreferences = async (user: User, preferences: UserPreferences): Promise<void> => {
  const userDoc = doc(db, 'users', user.uid);
  await setDoc(userDoc, preferences, { merge: true });
};

export const createUserProfile = async (user: User): Promise<boolean> => {
  try {
    const defaultPreferences: UserPreferences = {
      language: 'pt-BR',
      theme: 'light',
      notifications: true,
      insulinSettings: {
        icr: {
          normal: 0.6,
          morning: 1.2
        },
        isf: 50,
        targetGlucose: 100,
        rounding: 'round'
      }
    };

    await setDoc(doc(db, 'users', user.uid), defaultPreferences);
    return true;
  } catch (error) {
    console.error('Erro ao criar perfil do usuário:', error);
    return false;
  }
}; 
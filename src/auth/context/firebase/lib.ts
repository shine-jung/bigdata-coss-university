import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

import { FIREBASE_API } from 'src/config-global';

// ----------------------------------------------------------------------

export const firebaseApp = initializeApp(FIREBASE_API);

export const DB = getFirestore(firebaseApp);
export const STORAGE = getStorage(firebaseApp);

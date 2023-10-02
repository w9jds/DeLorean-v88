import { auth, firestore } from 'firebase-functions';
import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

import AuthHandlers from './handlers/auth';

const app = initializeApp();

getFirestore(app).settings({
  timestampsInSnapshots: true
});

const loginHandlers = new AuthHandlers(app);

export const createProfile = auth.user()
  .onCreate(loginHandlers.exportNewUser);

export const updateClaims = firestore.document('/users/{uid}')
  .onUpdate(loginHandlers.onClaimsChange);
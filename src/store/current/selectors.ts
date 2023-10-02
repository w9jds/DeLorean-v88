import { ApplicationState } from 'models/states';
import { createSelector } from 'reselect';

import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

export const getFirebaseApp = (state: ApplicationState) => state.current.firebase;

export const getUser = (state: ApplicationState) => state.current.user;

export const getUserProfile = (state: ApplicationState) => state.current.profile;

export const getCurrentConfig = (state: ApplicationState) => state.current.config;

export const getSponsors = (state: ApplicationState) => state.current.sponsors;


export const getDatabase = createSelector(
  [getFirebaseApp], app => {
    if (app) {
      return getFirestore(app);
    }
  }
);

export const getFirebaseAuth = createSelector(
  [getFirebaseApp], app => {
    if (app) {
      return getAuth(app);
    }
  }
);

export const getFirebaseStorage = createSelector(
  [getFirebaseApp], app => {
    if (app) {
      return getStorage(app);
    }
  }
);
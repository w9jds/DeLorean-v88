import { ApplicationState } from '..';
import { FirebaseFirestore } from '@firebase/firestore-types';
import { FirebaseApp } from '@firebase/app-types';

export const getFirebaseApp = (state: ApplicationState): FirebaseApp => state.current.firebase;
export const getFirestore = (state: ApplicationState): FirebaseFirestore => state.current.firebase.firestore();
export const getUser = (state: ApplicationState) => state.current.user;
export const getUserProfile = (state: ApplicationState) => state.current.profile;
export const getCurrentConfig = (state: ApplicationState) => state.current.config;
export const getIsEditMode = (state: ApplicationState) => state.current.isEditMode;
export const getSponsors = (state: ApplicationState) => state.current.sponsors;
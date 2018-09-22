import { ApplicationState } from '..';

export const getFirebaseApp = (state: ApplicationState) => state.current.firebase;
export const getFirestore = (state: ApplicationState) => state.current.firebase.firestore();
export const getUser = (state: ApplicationState) => state.current.user;
export const getUserProfile = (state: ApplicationState) => state.current.profile;
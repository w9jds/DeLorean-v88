import { ApplicationState } from '..';

export const getFirebaseApp = (state: ApplicationState) => state.current.firebase;
export const getFireStore = (state: ApplicationState) => state.current.firebase.firestore();
export const getUser = (state: ApplicationState) => state.current.user;
import * as functions from 'firebase-functions';
import { auth, initializeApp } from 'firebase-admin';

const firebase = initializeApp();

firebase.firestore().settings({
    timestampsInSnapshots: true
});

export const createProfile = functions.auth.user().onCreate((user: auth.UserRecord) => {
    return firebase.firestore().doc(`/users/${user.uid}`).set({
        name: user.displayName,
        email: user.email,
        admin: false
    });
});
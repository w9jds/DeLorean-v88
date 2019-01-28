import * as functions from 'firebase-functions';
import { initializeApp } from 'firebase-admin';
import AuthHandlers from './handlers/auth';
import PreRenderHandlers from './handlers/render';

const firebase = initializeApp();

firebase.firestore().settings({
    timestampsInSnapshots: true
});

const loginHandlers = new AuthHandlers(firebase);
const renderHandlers = new PreRenderHandlers(firebase);

export const createProfile = functions.auth.user()
    .onCreate(loginHandlers.exportNewUser);
export const updateClaims = functions.firestore.document('/users/{uid}')
    .onUpdate(loginHandlers.onClaimsChange);
export const serverRender = functions.https
    .onRequest(renderHandlers.render);

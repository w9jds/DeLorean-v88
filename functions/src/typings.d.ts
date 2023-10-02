export {};

declare global {
  namespace NodeJS {
    interface Global {
      app: import('firebase-admin').app.App;
      firebase: import('firebase-admin').firestore.Firestore;
    }
  }
}

declare const app: import('firebase-admin').app.App;
declare const firebase: import('firebase-admin').firestore.Firestore;

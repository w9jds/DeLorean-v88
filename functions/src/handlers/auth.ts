
import { auth } from 'firebase-admin';
import { App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore'

import { DocumentSnapshot } from 'firebase-admin/firestore';
import { EventContext, Change } from 'firebase-functions';

export default class AuthHandlers {
  constructor(private app: App) {}

  exportNewUser = (user: auth.UserRecord) => {
    const db = getFirestore(this.app);

    return db.doc(`/users/${user.uid}`).set({
      name: user.displayName,
      email: user.email,
      admin: false
    });
  }

  onClaimsChange = (change: Change<DocumentSnapshot>, context: EventContext) => {
    if (change.before.data()?.admin !== change.after.data()?.admin) {
      console.log(`set ${context.params.uid} to admin: ${change.after.data()?.admin}`);

      return auth().setCustomUserClaims(context.params.uid, {
        admin: change.after.data()?.admin
      });
    }

    return true;
  }
}
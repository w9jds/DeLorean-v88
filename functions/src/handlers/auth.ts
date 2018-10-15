
import { auth, app } from "firebase-admin";
import { EventContext, Change } from 'firebase-functions';
import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore";

export default class AuthHandlers {

    constructor(private firebase: app.App) {}

    exportNewUser = (user: auth.UserRecord) => {
        return this.firebase.firestore().doc(`/users/${user.uid}`).set({
            name: user.displayName,
            email: user.email,
            admin: false
        });
    }

    onClaimsChange = (change: Change<DocumentSnapshot>, context: EventContext) => {
        if (change.before.data().admin !== change.after.data().admin) {
            console.log(`set ${context.params.uid} to admin: ${change.after.data().admin}`);

            return auth().setCustomUserClaims(context.params.uid, {
                admin: change.after.data().admin
            });
        }

        return true;
    }
}
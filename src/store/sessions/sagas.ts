import { takeEvery, all, select, fork } from 'redux-saga/effects';
import { DocumentSnapshot, Firestore, collection } from '@firebase/firestore';
import { Payload, sync } from 'store/firestore';

import { getDatabase } from 'store/current/selectors';
import { getSiteData } from 'store/current/reducer';
import { setSession } from './reducer';

function* loadEventSessions() {
  const db: Firestore = yield select(getDatabase);

  yield fork(sync, collection(db, 'sessions'), {
    successAction: setSession,
    transform: (collection: Payload) => {
      const sessions: Record<string, DocumentSnapshot> = {};
    
      if ('forEach' in collection.snapshot) {
        collection.snapshot.forEach(
          (document) => (sessions[document.id] = document)
        );
      }
    
      return sessions;
    },
  });
}

export function* sagas() {
  yield all([
    takeEvery(getSiteData.type, loadEventSessions)
  ]);
}

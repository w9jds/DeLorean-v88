import { takeEvery, all, select, fork } from 'redux-saga/effects';
import { DocumentSnapshot, Firestore, collection } from '@firebase/firestore';

import { Payload, sync } from 'store/firestore';
import { getDatabase } from 'store/current/selectors';
import { setSpeakers } from './reducer';
import { getSiteData } from 'store/current/reducer';


function* loadEventSpeakers() {
  const db: Firestore = yield select(getDatabase);

  yield fork(sync, collection(db, 'speakers'), {
    successAction: setSpeakers,
    transform: (collection: Payload) => {
      const speakers: Record<string, DocumentSnapshot> = {};
    
      if ('forEach' in collection.snapshot) {
        collection.snapshot.forEach(
          (document) => (speakers[document.id] = document)
        );
      }
    
      return speakers;
    },
  });
}

export function* sagas() {
  yield all([
    takeEvery(getSiteData.type, loadEventSpeakers)]
  );
}

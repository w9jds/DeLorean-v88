import { takeEvery, all, select, fork } from 'redux-saga/effects';
import { DocumentSnapshot, Firestore, collection } from '@firebase/firestore';

import { CurrentEvents } from 'store/events';
import { Payload, sync } from 'store/firestore';
import { getDatabase } from 'store/current/selectors';
import { setSpeakers } from './actions';

function* loadEventSpeakers() {
  const db: Firestore = yield select(getDatabase);

  yield fork(sync, collection(db, 'speakers'), {
    successAction: setSpeakers,
    transform: marshallSpeakers,
  });
}

const marshallSpeakers = (collection: Payload) => {
  const speakers: Record<string, DocumentSnapshot> = {};

  if ('forEach' in collection.snapshot) {
    collection.snapshot.forEach(
      (document) => (speakers[document.id] = document)
    );
  }

  return speakers;
};

export function* sagas() {
  yield all([takeEvery(CurrentEvents.LOAD_SITE_DATA, loadEventSpeakers)]);
}

import { takeEvery, all, select, fork } from 'redux-saga/effects';
import { DocumentSnapshot, Firestore, collection } from '@firebase/firestore';

import { CurrentEvents } from 'store/events';
import { getDatabase } from 'store/current/selectors';
import { Payload, sync } from 'store/firestore';
import { setSession } from './actions';

function* loadEventSessions() {
  const db: Firestore = yield select(getDatabase);

  yield fork(sync, collection(db, 'sessions'), {
    successAction: setSession,
    transform: marshallSessions
  });
}

const marshallSessions = (collection: Payload) => {
  const sessions: Record<string, DocumentSnapshot> = {};

  if ('forEach' in collection.snapshot) {
      collection.snapshot.forEach(
          document => sessions[document.id] = document
      );
  }

  return sessions;
};

export function* sagas() {
  yield all([
    takeEvery(CurrentEvents.LOAD_SITE_DATA, loadEventSessions)
  ]);
}
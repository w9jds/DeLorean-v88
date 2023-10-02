import { takeEvery, all, select, fork } from 'redux-saga/effects';
import { Firestore, DocumentSnapshot, collection, doc } from 'firebase/firestore';

import Sponsor from 'models/sponsor';
import Configuration from 'models/config';

import { getDatabase } from './selectors';
import { setSiteConfig, setSponsors } from './actions';
import { CurrentEvents } from 'store/events';

import { sync, Payload } from '../firestore';

function* loadSiteConfig() {
  const db: Firestore = yield select(getDatabase);

  yield fork(sync, doc(db, 'config/devfest'), {
    successAction: setSiteConfig,
    transform: (payload: Payload) => {
      const snapshot = payload.snapshot as DocumentSnapshot;
      return snapshot.data() as Configuration;
    }
  });
}

function* loadEventSponsors() {
  const db: Firestore = yield select(getDatabase);

  yield fork(sync, collection(db, 'sponsors'), {
    successAction: setSponsors,
    transform: marshallSponsors,
  });
}

const marshallSponsors = (collection: Payload) => {
  const sponsors: Record<string, Sponsor> = {};

  if ('forEach' in collection.snapshot) {
    collection.snapshot.forEach(
      (document) => (sponsors[document.id] = document.data() as Sponsor)
    );
  }

  return sponsors;
};

export function* sagas() {
  yield all([
    takeEvery(CurrentEvents.LOAD_SITE_DATA, loadSiteConfig),
    takeEvery(CurrentEvents.LOAD_SITE_DATA, loadEventSponsors),
  ]);
}

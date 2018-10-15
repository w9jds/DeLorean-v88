import { put, takeEvery, all, select } from 'redux-saga/effects';
import { watchListener } from './firestore';
import { getFirestore } from '../selectors/current';

import Configuration from '../models/config';
import { setSiteConfig, setSponsors } from '../ducks/current';
import { createAction } from 'redux-actions';

import { DocumentSnapshot, FirebaseFirestore, QuerySnapshot } from '@firebase/firestore-types';
import Sponsor from '../models/sponsor';

enum CurrentSagaTypes {
    LOAD_SITE_DATA = 'LOAD_SITE_DATA'
}

function* loadSiteConfig() {
    let firestore = yield select(getFirestore);

    yield put ({
        type: '/config/devfest',
        payload: {
            ref: firestore.doc('/config/devfest'),
            action: emitUpdateConfig
        }
    });
}

function* loadEventSponsors() {
    let firestore: FirebaseFirestore = yield select(getFirestore);

    yield put({
        type: '/sponsors',
        payload: {
            ref: firestore.collection('sponsors'),
            action: emitSponsors
        }
    });
}

const emitUpdateConfig = (snapshot: DocumentSnapshot, emit) => emit(
    setSiteConfig(snapshot.data() as Configuration)
);

const emitSponsors = (snapshot: QuerySnapshot, emit) => {
    let sponsors: Record<string, Sponsor> = {};

    snapshot.forEach(document => {
        sponsors[document.id] = document.data() as Sponsor;
    });

    emit(setSponsors(sponsors));
};

export const getSiteData = createAction(CurrentSagaTypes.LOAD_SITE_DATA);

export function* sagas() {
    yield all([
        takeEvery(CurrentSagaTypes.LOAD_SITE_DATA, loadSiteConfig),
        takeEvery(CurrentSagaTypes.LOAD_SITE_DATA, loadEventSponsors),
        watchListener('/config/devfest'),
        watchListener('/sponsors')
    ]);
}

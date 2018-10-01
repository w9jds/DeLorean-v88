import { put, takeEvery, all, select } from 'redux-saga/effects';
import { watchListener } from './firestore';
import { getFirestore } from '../selectors/current';

import Configuration from '../models/config';
import { setSiteConfig } from '../ducks/current';
import { createAction } from 'redux-actions';

import { DocumentSnapshot } from '@firebase/firestore-types';

enum CurrentSagaTypes {
    GET_SITE_CONFIG = 'GET_SITE_CONFIG'
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

const emitUpdateConfig = (snapshot: DocumentSnapshot, emit) => emit(
    setSiteConfig(snapshot.data() as Configuration)
);

export const getSiteConfig = createAction(CurrentSagaTypes.GET_SITE_CONFIG);

export function* sagas() {
    yield all([
        takeEvery(CurrentSagaTypes.GET_SITE_CONFIG, loadSiteConfig),
        watchListener('/config/devfest')
    ]);
}

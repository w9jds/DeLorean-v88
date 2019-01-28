import { takeEvery, all, select, fork } from 'redux-saga/effects';
import { createAction } from 'redux-actions';

import Sponsor from '../../models/sponsor';
import Configuration from '../../models/config';
import { setSiteConfig, setSponsors, getFirestore } from '../ducks/current';
import { DocumentSnapshot, FirebaseFirestore } from '@firebase/firestore-types';
import { sync, Payload } from './firestore';
import { setSpeakers } from '../ducks/speaker';
import { setSession } from '../ducks/session';

enum CurrentSagaTypes {
    LOAD_SITE_DATA = 'LOAD_SITE_DATA'
}

function* loadSiteConfig() {
    let firestore: FirebaseFirestore = yield select(getFirestore);

    yield fork(sync, firestore.doc('/config/devfest'), {
        successAction: setSiteConfig,
        transform: (payload: Payload) => (<DocumentSnapshot> payload.snapshot).data() as Configuration
    });
}

function* loadEventSponsors() {
    let firestore: FirebaseFirestore = yield select(getFirestore);

    yield fork(sync, firestore.collection('sponsors'), {
        successAction: setSponsors,
        transform: marshallSponsors
    });
}

function* loadEventSpeakers() {
    let firestore: FirebaseFirestore = yield select(getFirestore);

    yield fork(sync, firestore.collection('speakers'), {
        successAction: setSpeakers,
        transform: marshallSpeakers
    });
}

function* loadEventSessions() {
    let firestore: FirebaseFirestore = yield select(getFirestore);

    yield fork(sync, firestore.collection('sessions'), {
        successAction: setSession,
        transform: marshallSessions
    });
}

const marshallSponsors = (collection: Payload) => {
    const sponsors: Record<string, Sponsor> = {};

    if ('forEach' in collection.snapshot) {
        collection.snapshot.forEach(
            document => sponsors[document.id] = document.data() as Sponsor
        );
    }

    return sponsors;
};

const marshallSpeakers = (collection: Payload) => {
    const speakers: Record<string, DocumentSnapshot> = {};

    if ('forEach' in collection.snapshot) {
        collection.snapshot.forEach(
            document => speakers[document.id] = document
        );
    }

    return speakers;
};

const marshallSessions = (collection: Payload) => {
    const sessions: Record<string, DocumentSnapshot> = {};

    if ('forEach' in collection.snapshot) {
        collection.snapshot.forEach(
            document => sessions[document.id] = document
        );
    }

    return sessions;
 };

export const getSiteData = createAction(CurrentSagaTypes.LOAD_SITE_DATA);

export function* sagas() {
    yield all([
        takeEvery(CurrentSagaTypes.LOAD_SITE_DATA, loadSiteConfig),
        takeEvery(CurrentSagaTypes.LOAD_SITE_DATA, loadEventSponsors),
        takeEvery(CurrentSagaTypes.LOAD_SITE_DATA, loadEventSpeakers),
        takeEvery(CurrentSagaTypes.LOAD_SITE_DATA, loadEventSessions)
    ]);
}

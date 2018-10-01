import { eventChannel } from 'redux-saga';
import { put, take, call, cancel, fork, takeEvery } from 'redux-saga/effects';
import { DocumentReference, DocumentSnapshot } from '@firebase/firestore-types';

export const FIREBASE_REMOVE_LISTENER_REQUESTED = 'FIREBASE_REMOVE_LISTENER_REQUESTED';

let tasks = {};

type Payload = {
    ref: DocumentReference,
    action: (snapshot: DocumentSnapshot, emit: any) => void
};

export function* watchListener(eventName: string) {
    yield takeEvery(eventName, forkListener);
}

export function* watchRemove() {
    yield takeEvery(FIREBASE_REMOVE_LISTENER_REQUESTED, closeListener);
}

function* closeListener(listenRequestAction: {type: string, task: string}) {
    if (tasks[listenRequestAction.task]) {
        yield cancel(tasks[listenRequestAction.task]);
        delete tasks[listenRequestAction.task];
    }
}

function* forkListener(listenRequestAction: {type: string, payload: Payload}) {
    tasks[listenRequestAction.type] = yield fork(
        attachListeners,
        listenRequestAction.payload.ref,
        listenRequestAction.payload.action
    );
}

function* attachListeners(reference: DocumentReference, action: (snapshot: DocumentSnapshot, emit: any) => void) {
    let channel = yield call(listener, reference, action);

    try {
        while (true) {
            const data = yield take(channel);
            yield put(data);
        }
    } finally {
        channel.close();
    }
}

const listener = (reference: DocumentReference, action: (snapshot: DocumentSnapshot, emit: any) => void) =>
    eventChannel(emit => reference.onSnapshot((snapshot: DocumentSnapshot) => {
        action(snapshot, emit);
    }));

import { eventChannel, buffers, Channel } from 'redux-saga';
import { put, take, call, fork, cancelled } from 'redux-saga/effects';
import { DocumentSnapshot, DocumentReference, QuerySnapshot, CollectionReference, FirestoreError } from '@firebase/firestore-types';
import { ActionCreator } from 'redux';

export type Payload = {
    snapshot: DocumentSnapshot | QuerySnapshot
};

export type SyncOptions = {
    successAction: ActionCreator<any>;
    errorAction?: ActionCreator<any>;
    transform?: (data: Payload) => any;
};

function createChannel(ref: DocumentReference) {
    const channel = eventChannel(emit => {
        return ref.onSnapshot(
            dataSnapshot => emit({ snapshot: dataSnapshot }),
            (error: FirestoreError) => { throw error; }
        );
    }, buffers.expanding(1));

    return channel;
}

const defaultTransform = (data: Payload) => data.snapshot;

export function* sync(ref: DocumentReference | CollectionReference, options: SyncOptions) {
    const channel = yield call(createChannel, ref);

    yield fork(syncChannel, channel, {
        transform: defaultTransform,
        ...options,
    });
}

function* syncChannel(channel: Channel<any>, options: SyncOptions) {
    const { successAction, errorAction, transform } = options;

    try {
        while (true) {
            const data = yield take(channel);
            const transformedData = transform ? transform(data) : data;
            yield put(successAction(transformedData));
        }
    } catch (err) {
        if (errorAction) {
            yield put(errorAction(err));
        }
        else {
            console.error(
                'The following error has been ignored because no `failureAction` has been set:',
                err,
            );
        }
    } finally {
        if (yield cancelled()) {
            channel.close();
        }
    }
}
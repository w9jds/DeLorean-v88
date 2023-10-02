import { eventChannel, buffers, Channel } from 'redux-saga';
import { put, take, call, fork, cancelled } from 'redux-saga/effects';

import { DocumentReference, Query, FirestoreError, onSnapshot, QuerySnapshot, DocumentSnapshot } from 'firebase/firestore'

import { ActionCreator } from 'redux';

export type Payload = {
  snapshot: DocumentSnapshot | QuerySnapshot;
};

export type SyncOptions = {
  successAction: ActionCreator<any>;
  errorAction?: ActionCreator<any>;
  transform?: (data: Payload) => any;
};

const createChannel = (ref: any) => {
  const channel = eventChannel((emit) => {
    const unsubscribe = onSnapshot(ref, {
      next: (dataSnapshot: DocumentSnapshot | QuerySnapshot) => {
        emit({ snapshot: dataSnapshot });
      },
      error: (error: FirestoreError) => {
        throw error;
      },
    });

    return unsubscribe;
  }, buffers.expanding(1));

  return channel;
}

const defaultTransform = (data: Payload) => data.snapshot;

export function* sync(ref: DocumentReference | Query, options: SyncOptions) {
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
    } else {
      console.error(
        'The following error has been ignored because no `failureAction` has been set:',
        err
      );
    }
  } finally {
    if (yield cancelled()) {
      channel.close();
    }
  }
}

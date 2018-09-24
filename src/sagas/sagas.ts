import { all } from 'redux-saga/effects';
import { sagas as current } from './current';
import { watchRemove } from './firestore';

export default function* rootSaga() {
    yield all([
        current(),
        watchRemove()
    ]);
}

import { all } from 'redux-saga/effects';
import { sagas as current } from './current';

export default function* rootSaga() {
    yield all([
        current()
    ]);
}

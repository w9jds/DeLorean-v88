import { all } from 'redux-saga/effects';
import { sagas as current } from './current';
import { sagas as editor } from './editor'; 

export default function* rootSaga() {
    yield all([
        current(),
        editor()
    ]);
}

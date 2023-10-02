import { all } from 'redux-saga/effects';

import { sagas as current } from './current/sagas';
import { sagas as speakers } from './speakers/sagas';
import { sagas as sessions } from './sessions/sagas';
import { sagas as editors } from './editors/sagas';

export default function* rootSaga() {
  yield all([
    current(),
    speakers(),
    sessions(),
    editors(),
  ]);
}

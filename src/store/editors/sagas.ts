import { takeEvery, all, put } from 'redux-saga/effects';

import { editSession, setSessionEditorInitialState, setSessionEditorOpen } from 'store/sessions/reducer';
import { editSpeaker, setSpeakerEditorInitialState, setSpeakerEditorOpen } from 'store/speakers/reducer';

function* editInSpeakerEditor(action: ReturnType<typeof editSpeaker>) {
  const speaker = action.payload.speaker;

  yield put(setSpeakerEditorInitialState({
    ...speaker,
    ref: action.payload.ref,
    company: speaker.company || '',
    errors: [],
    file: {
      preview: speaker.portraitUrl
    }
  }));

  yield put(setSpeakerEditorOpen(true));
}

function* editInSessionEditor(action: ReturnType<typeof editSession>) {
  const session = action.payload.session;

  yield put(setSessionEditorInitialState({
    ...session,
    startTime: session.startTime ? session.startTime.toDate() : new Date(),
    endTime: session.endTime ? session.endTime.toDate() : new Date(),
    ref: action.payload.ref,
    errors: []
  }));

  yield put(setSessionEditorOpen(true));
}

export function* sagas() {
  yield all([
    takeEvery(editSpeaker.type, editInSpeakerEditor),
    takeEvery(editSession.type, editInSessionEditor),
  ]);
}
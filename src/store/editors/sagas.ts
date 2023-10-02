import { takeEvery, all, put } from 'redux-saga/effects';
import { clearSessionEditorState, setSessionEditorInitialState } from 'store/sessions/actions';
import { setSpeakerEditorInitialState, clearSpeakerEditorState } from 'store/speakers/actions';
import { setSpeakerEditorOpen, setSessionEditorOpen } from 'store/admin/actions';

import { editSession, editSpeaker } from './actions';
import { AdminEvents, EditorEvents } from 'store/events';

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

function* closeSpeakerEditor(action: ReturnType<typeof setSpeakerEditorOpen>) {
  if (action.payload === false) {
    yield put(clearSpeakerEditorState());
  }
}

function* closeSessionEditor(action: ReturnType<typeof setSessionEditorOpen>) {
  if (action.payload === false) {
    yield put(clearSessionEditorState());
  }
}

export function* sagas() {
  yield all([
    takeEvery(EditorEvents.EDIT_SPEAKER, editInSpeakerEditor),
    takeEvery(EditorEvents.EDIT_SESSION, editInSessionEditor),
    takeEvery(AdminEvents.SET_SPEAKER_EDITOR_OPEN, closeSpeakerEditor),
    takeEvery(AdminEvents.SET_SESSION_EDITOR_OPEN, closeSessionEditor)
  ]);
}
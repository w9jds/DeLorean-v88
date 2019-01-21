import { takeEvery, all, put, select } from 'redux-saga/effects';
import { createAction } from 'redux-actions';
import { DocumentReference } from '@firebase/firestore-types';
import { Speaker } from '../models/speaker';
import { setSpeakerEditorInitialState, clearSpeakerEditorState } from '../ducks/speaker';
import { setSpeakerEditorOpen, AdminTypes, setSessionEditorOpen } from '../ducks/admin';
import { clearSessionEditorState, setSessionEditorInitialState } from '../ducks/session';
import { Session } from '../models/session';

enum EditorTypes {
    EDIT_SPEAKER = 'EDIT_SPEAKER',
    EDIT_SESSION = 'EDIT_SESSION'
}

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

export const editSpeaker = createAction(
    EditorTypes.EDIT_SPEAKER, 
    (ref: DocumentReference, speaker: Speaker) => ({ ref, speaker })
);

export const editSession = createAction(
    EditorTypes.EDIT_SESSION,
    (ref: DocumentReference, session: Session) => ({ ref, session})
);

export function* sagas() {
    yield all([
        takeEvery(EditorTypes.EDIT_SPEAKER, editInSpeakerEditor),
        takeEvery(EditorTypes.EDIT_SESSION, editInSessionEditor),
        takeEvery(AdminTypes.SET_SPEAKER_EDITOR_OPEN, closeSpeakerEditor),
        takeEvery(AdminTypes.SET_SESSION_EDITOR_OPEN, closeSessionEditor)
    ]);
}

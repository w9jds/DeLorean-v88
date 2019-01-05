import { takeEvery, all, put, select } from 'redux-saga/effects';
import { createAction } from 'redux-actions';
import { DocumentReference } from '@firebase/firestore-types';
import { Speaker } from '../models/speaker';
import { setSpeakerEditorInitialState, clearSpeakerEditorState } from '../ducks/speaker';
import { setSpeakerEditorOpen, getIsSpeakerEditorOpen, AdminTypes } from '../ducks/admin';

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

function* closeSpeakerEditor(action: ReturnType<typeof setSpeakerEditorOpen>) {
    if (action.payload === false) {
        yield put(clearSpeakerEditorState());
    }
}

export const editSpeaker = createAction(
    EditorTypes.EDIT_SPEAKER, 
    (ref: DocumentReference, speaker: Speaker) => ({ ref, speaker })
);

export function* sagas() {
    yield all([
        takeEvery(EditorTypes.EDIT_SPEAKER, editInSpeakerEditor),
        takeEvery(AdminTypes.SET_SPEAKER_EDITOR_OPEN, closeSpeakerEditor)
    ]);
}

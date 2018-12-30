import { takeEvery, all, put } from 'redux-saga/effects';
import { createAction } from 'redux-actions';
import { DocumentReference } from '@firebase/firestore-types';
import { Speaker } from '../models/speaker';
import { setEditorInitialState } from '../ducks/speaker';
import { toggleSpeakerEditor } from '../ducks/admin';

enum EditorSagaTypes {
    EDIT_SPEAKER = 'EDIT_SPEAKER'
}

function* editInSpeakerEditor(action: ReturnType<typeof editSpeaker>) {
    const speaker = action.payload.speaker;

    yield put(setEditorInitialState({
        ...speaker,
        ref: action.payload.ref,
        company: speaker.company || '',
        errors: [],
        file: {
            preview: speaker.portraitUrl
        }
    }));

    yield put(toggleSpeakerEditor());
}

export const editSpeaker = createAction(
    EditorSagaTypes.EDIT_SPEAKER, 
    (ref: DocumentReference, speaker: Speaker) => ({ ref, speaker })
);

export function* sagas() {
    yield all([
        takeEvery(EditorSagaTypes.EDIT_SPEAKER, editInSpeakerEditor)
    ]);
}

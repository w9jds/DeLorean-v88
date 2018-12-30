import { takeEvery, all, put } from 'redux-saga/effects';
import { createAction } from 'redux-actions';
import { DocumentReference } from '@firebase/firestore-types';
import { Speaker } from '../models/speaker';
import { setEditorInitialState } from '../ducks/speaker';

enum EditorSagaTypes {
    EDIT_SPEAKER = 'EDIT_SPEAKER'
}

function* editInSpeakerEditor(action: ReturnType<typeof editSpeaker>) {
    const speaker = action.payload.speaker;

    yield put(
        setEditorInitialState({
            ...speaker,
            company: speaker.company || '',
            errors: [],
            file: {
                preview: speaker.portraitUrl
            }
        })
    );
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

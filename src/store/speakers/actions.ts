import { createAction } from 'redux-actions';
import { DocumentSnapshot } from '@firebase/firestore';

import { SpeakerEvents } from 'store/events';
import { SpeakerEditorFullState } from 'models/speaker';

export const setSpeakers = createAction<Record<string, DocumentSnapshot>>(SpeakerEvents.SET_SPEAKERS);

export const setSpeakerEditorInitialState = createAction<SpeakerEditorFullState>(SpeakerEvents.SET_EDITOR_STATE);

export const clearSpeakerEditorState = createAction(SpeakerEvents.CLEAR_EDITOR_STATE);
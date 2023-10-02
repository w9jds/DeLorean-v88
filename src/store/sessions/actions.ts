import { createAction } from 'redux-actions';
import { DocumentSnapshot } from '@firebase/firestore';

import { SessionEvents } from 'store/events';
import { SessionEditorFullState } from 'models/session';

export const setSession = createAction<Record<string, DocumentSnapshot>>(SessionEvents.SET_SESSION);

export const setSessionEditorInitialState = createAction<SessionEditorFullState>(SessionEvents.SET_SESSION_STATE);

export const clearSessionEditorState = createAction(SessionEvents.CLEAR_SESSION_STATE);
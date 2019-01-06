import { createAction, handleActions } from 'redux-actions';
import { Reducer } from 'redux';
import { SessionState } from '../models/states';
import { createSelector } from 'reselect';
import { ApplicationState } from '..';
import { DocumentSnapshot } from '@firebase/firestore-types';
import { SessionEditorFullState, SessionEditorState, SessionTypes } from '../models/session';

export const getSessions = (state: ApplicationState) => state.sessions.sessions;
export const getSessionEditorState = (state: ApplicationState) => state.sessions.editor;

export enum SessionActionTypes {
    SET_SESSION = 'SET_SESSION',
    SET_SESSION_STATE = 'SET_SESSION_STATE',
    CLEAR_SESSION_STATE = 'CLEAR_SESSION_STATE'
}

const clearState: SessionEditorFullState = {
    name: '',
    type: SessionTypes.SESSION,
    tracks: [],
    errors: [],
    speakers: [],
    description: ''
};

const initialState: SessionState = {
    editor: clearState,
    sessions: {}
};

const sessions: Reducer<SessionState> = handleActions<any>({
    [SessionActionTypes.SET_SESSION]: (state: SessionState, action: ReturnType<typeof setSession>) => ({
        ...state,
        sessions: action.payload
    }),
    [SessionActionTypes.SET_SESSION_STATE]: (state: SessionState, action: ReturnType<typeof setSessionEditorInitialState>) => ({
        ...state,
        editor: action.payload
    }),
    [SessionActionTypes.CLEAR_SESSION_STATE]: (state: SessionState) => ({
        ...state,
        editor: clearState
    })
}, initialState);

export const setSession = createAction<Record<string, DocumentSnapshot>>(SessionActionTypes.SET_SESSION);
export const setSessionEditorInitialState = createAction<SessionEditorFullState>(SessionActionTypes.SET_SESSION_STATE);
export const clearSessionEditorState = createAction(SessionActionTypes.CLEAR_SESSION_STATE);

export default sessions;

import { createAction, handleActions } from 'redux-actions';
import { Reducer } from 'redux';
import { SessionState } from '../models/states';
import { createSelector } from 'reselect';
import { ApplicationState } from '..';
import { DocumentSnapshot } from '@firebase/firestore-types';
import { SessionEditorFullState, SessionEditorState } from '../models/session';

export const getSessions = (state: ApplicationState) => state.sessions.sessions;
export const getSessionEditorState = (state: ApplicationState) => state.sessions.editor;

export enum SessionTypes {
    SET_SESSION = 'SET_SESSION',
    SET_SESSION_STATE = 'SET_SESSION_STATE',
    CLEAR_SESSION_STATE = 'CLEAR_SESSION_STATE'
}

const clearState: SessionEditorFullState = {
    name: '',
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
    [SessionTypes.SET_SESSION]: (state: SessionState, action: ReturnType<typeof setSession>) => ({
        ...state,
        speakers: action.payload
    }),
    [SessionTypes.SET_SESSION_STATE]: (state: SessionState, action: ReturnType<typeof setSessionEditorInitialState>) => ({
        ...state,
        editor: action.payload
    }),
    [SessionTypes.CLEAR_SESSION_STATE]: (state: SessionState) => ({
        ...state,
        editor: clearState
    })
}, initialState);

export const setSession = createAction<Record<string, DocumentSnapshot>>(SessionTypes.SET_SESSION);
export const setSessionEditorInitialState = createAction<SessionEditorState>(SessionTypes.SET_SESSION_STATE);
export const clearSessionEditorState = createAction(SessionTypes.CLEAR_SESSION_STATE);

export default sessions;

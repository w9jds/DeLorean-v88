import { createAction, handleActions } from 'redux-actions';
import { Reducer } from 'redux';
import { SpeakerState } from '../models/states';
import { ApplicationState } from '..';
import { DocumentSnapshot } from '@firebase/firestore-types';
import { SpeakerEditorState } from '../models/speaker';

export const getSpeakers = (state: ApplicationState) => state.speakers.speakers;
export const getEditorState = (state: ApplicationState) => state.speakers.editor;

export enum SpeakerTypes {
    SET_SPEAKERS = 'SET_SPEAKERS',
    REMOVE_SPEAKERS = 'REMOVE_SPEAKERS',
    SET_EDITOR_STATE = 'SET_EDITOR_STATE',
    CLEAR_EDITOR_STATE = 'CLEAR_EDITOR_STATE'
}

const initialState: SpeakerState = {
    speakers: {},
    editor: {            
        name: '',
        company: '',
        file: undefined,
        featured: false,
        errors: []
    }
};

const config: Reducer<SpeakerState> = handleActions<any>({
    [SpeakerTypes.SET_SPEAKERS]: (state: SpeakerState, action: ReturnType<typeof setSpeakers>) => ({
        ...state,
        speakers: action.payload
    }),
    [SpeakerTypes.SET_EDITOR_STATE]: (state: SpeakerState, action: ReturnType<typeof setEditorInitialState>) => ({
        ...state,
        editor: action.payload
    }),
    [SpeakerTypes.CLEAR_EDITOR_STATE]: (state: SpeakerState) => ({
        ...state,
        editor: {
            name: '',
            company: '',
            file: undefined,
            featured: false,
            errors: []
        }
    })
}, initialState);

export const setSpeakers = createAction<Record<string, DocumentSnapshot>>(SpeakerTypes.SET_SPEAKERS);

export const setEditorInitialState = createAction<SpeakerEditorState>(SpeakerTypes.SET_EDITOR_STATE);

export default config;

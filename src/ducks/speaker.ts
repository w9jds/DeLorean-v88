import { createAction, handleActions } from 'redux-actions';
import { Reducer } from 'redux';
import { SpeakerState } from '../models/states';
import { ApplicationState } from '..';
import { DocumentSnapshot } from '@firebase/firestore-types';
import { SpeakerEditorFullState, Speaker } from '../models/speaker';
import { createSelector } from 'reselect';

export const getSpeakers = (state: ApplicationState) => state.speakers.speakers;
export const getEditorState = (state: ApplicationState) => state.speakers.editor;

export const getSpeakersInOrder = createSelector(getSpeakers, documents => {
    let speakers: DocumentSnapshot[] = [];

    if (documents && Object.keys(documents).length > 0) {
        let keys = Object.keys(documents).sort((a: string, b: string) => {
            const speakerA = documents[a].data() as Speaker;
            const speakerB = documents[b].data() as Speaker;

            if (speakerA.name > speakerB.name) {
                return 1;
            }
            if (speakerB.name > speakerA.name) {
                return -1;
            }

            return 0;
        });

        speakers = keys.map(key => documents[key]);
    }

    return speakers;
});

export enum SpeakerTypes {
    SET_SPEAKERS = 'SET_SPEAKERS',
    SET_EDITOR_STATE = 'SET_EDITOR_STATE',
    CLEAR_EDITOR_STATE = 'CLEAR_EDITOR_STATE'
}

const clearState = { 
    bio: '',
    name: '',
    company: '',
    file: undefined,
    featured: false,
    errors: []
};

const initialState: SpeakerState = {
    editor: clearState,
    speakers: {}
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
        editor: clearState
    })
}, initialState);

export const setSpeakers = createAction<Record<string, DocumentSnapshot>>(SpeakerTypes.SET_SPEAKERS);
export const setEditorInitialState = createAction<SpeakerEditorFullState>(SpeakerTypes.SET_EDITOR_STATE);
export const clearEditorState = createAction(SpeakerTypes.CLEAR_EDITOR_STATE);

export default config;

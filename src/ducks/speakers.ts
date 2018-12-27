import { createAction, handleActions } from 'redux-actions';
import { Reducer } from 'redux';
import { ConfigState, SpeakerState } from '../models/states';
import { ApplicationState } from '..';
import { Speaker } from '../models/speaker';

export enum SpeakerTypes {
    SET_SPEAKERS = 'SET_SPEAKERS',
    REMOVE_SPEAKERS = 'REMOVE_SPEAKERS'
}

const initialState: SpeakerState = {
    speakers: {}
};

const config: Reducer<SpeakerState> = handleActions<any>({
    [SpeakerTypes.SET_SPEAKERS]: () => ({
        isOpen: true
    })
}, initialState);

export const setSpeakers = createAction<Record<string, Speaker>>(SpeakerTypes.SET_SPEAKERS);

export default config;

import { createAction, handleActions } from 'redux-actions';

import { Reducer } from 'redux';
import { CurrentState, ApplicationState } from '../../models/states';
import { Profile } from '../../models/user';
import Configuration from '../../models/config';
import { FirebaseApp } from '@firebase/app-types';
import { User } from '@firebase/auth-types';
import Sponsor from '../../models/sponsor';
import { createSelector } from 'reselect';

export const getFirebaseApp = (state: ApplicationState): FirebaseApp => state.current.firebase;
export const getUser = (state: ApplicationState) => state.current.user;
export const getUserProfile = (state: ApplicationState) => state.current.profile;
export const getCurrentConfig = (state: ApplicationState) => state.current.config;
export const getSponsors = (state: ApplicationState) => state.current.sponsors;

export const getFirestore = createSelector(
    [getFirebaseApp], app => {
        return app && app.firestore ? app.firestore() : undefined;
    }
);

export enum CurrentTypes {
    SET_USER = 'SET_USER',
    SET_PROFILE = 'SET_PROFILE',
    SET_FIREBASE = 'SET_FIREBASE',
    SET_CONFIG = 'SET_CONFIG',
    SET_SPONSORS = 'SET_SPONSORS'
}

const initialState: CurrentState = {
    user: undefined,
    profile: undefined,
    firebase: undefined,
    config: undefined,
    sponsors: undefined
};

const current: Reducer<CurrentState> = handleActions<any>({
    [CurrentTypes.SET_USER]: (state: CurrentState, action: ReturnType<typeof setUser>) => ({
        ...state,
        user: action.payload
    }),
    [CurrentTypes.SET_PROFILE]: (state: CurrentState, action: ReturnType<typeof setUserProfile>) => ({
        ...state,
        profile: action.payload
    }),
    [CurrentTypes.SET_FIREBASE]: (state: CurrentState, action: ReturnType<typeof setFirebaseApplication>) => ({
        ...state,
        firebase: action.payload
    }),
    [CurrentTypes.SET_CONFIG]: (state: CurrentState, action: ReturnType<typeof setSiteConfig>) => ({
        ...state,
        config: action.payload
    }),
    [CurrentTypes.SET_SPONSORS]: (state: CurrentState, action: ReturnType<typeof setSponsors>) => ({
        ...state,
        sponsors: action.payload
    })
}, initialState);

export const setUser = createAction<User>(CurrentTypes.SET_USER);
export const setUserProfile = createAction<Profile>(CurrentTypes.SET_PROFILE);
export const setSponsors = createAction<Record<string, Sponsor>>(CurrentTypes.SET_SPONSORS);
export const setFirebaseApplication = createAction<FirebaseApp>(CurrentTypes.SET_FIREBASE);
export const setSiteConfig = createAction<Configuration>(CurrentTypes.SET_CONFIG);

export default current;

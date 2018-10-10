import { createAction, handleActions } from 'redux-actions';

import { Reducer } from 'redux';
import { CurrentState } from '../models/states';
import { Profile } from '../models/user';
import Configuration from '../models/config';
import { FirebaseApp } from '@firebase/app-types';
import { User } from '@firebase/auth-types';

export enum CurrentTypes {
    SET_USER = 'SET_USER',
    SET_PROFILE = 'SET_PROFILE',
    SET_FIREBASE = 'SET_FIREBASE',
    SET_CONFIG = 'SET_CONFIG',
    TOGGLE_EDIT_MODE = 'TOGGLE_EDIT_MODE'
}

const initialState: CurrentState = {
    user: undefined,
    profile: undefined,
    firebase: undefined,
    config: undefined,
    isEditMode: false
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
    [CurrentTypes.TOGGLE_EDIT_MODE]: (state: CurrentState, action: ReturnType<typeof toggleEditMode>) => ({
        ...state,
        isEditMode: !state.isEditMode
    })
}, initialState);

export const setUser = createAction<User>(CurrentTypes.SET_USER);
export const setUserProfile = createAction<Profile>(CurrentTypes.SET_PROFILE);
export const setFirebaseApplication = createAction<FirebaseApp>(CurrentTypes.SET_FIREBASE);
export const setSiteConfig = createAction<Configuration>(CurrentTypes.SET_CONFIG);
export const toggleEditMode = createAction(CurrentTypes.TOGGLE_EDIT_MODE);

export default current;

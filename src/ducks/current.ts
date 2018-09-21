import { createAction, handleActions } from 'redux-actions';
import { firestore, app } from 'firebase';
import { Reducer } from 'redux';
import { CurrentState } from '../models/states';
import { actionChannel } from 'redux-saga/effects';
import { Profile } from '../models/user';

export enum CurrentTypes {
    SET_USER = 'SET_USER',
    SET_PROFILE = 'SET_PROFILE',
    SET_FIREBASE = 'SET_FIREBASE'
}

const initialState: CurrentState = {
    user: undefined,
    profile: undefined,
    firebase: undefined
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
}, initialState);

export const setUser = createAction<firebase.User>(CurrentTypes.SET_USER);
export const setUserProfile = createAction<Profile>(CurrentTypes.SET_PROFILE);
export const setFirebaseApplication = createAction<app.App>(CurrentTypes.SET_FIREBASE);

export default current;

import { createAction, handleActions } from 'redux-actions';

import { Reducer } from 'redux';
import { AdminState } from '../models/states';
import { ApplicationState } from '..';

export const getIsEditMode = (state: ApplicationState) => state.admin.isEditMode;
export const getIsCreateOpen = (state: ApplicationState) => state.admin.isCreateOpen;
export const getIsSpeakerEditorOpen = (state: ApplicationState) => state.admin.isSpeakerEditorOpen;
export const getIsSessionEditorOpen = (state: ApplicationState) => state.admin.isSessionEditorOpen;

export enum AdminTypes {
    TOGGLE_EDIT_MODE = 'TOGGLE_EDIT_MODE',
    TOGGLE_CREATE_MENU = 'TOGGLE_CREATE_MENU',
    SET_SPEAKER_EDITOR_OPEN = 'SET_SPEAKER_EDITOR_OPEN',
    SET_SESSION_EDITOR_OPEN = 'SET_SESSION_EDITOR_OPEN'
}

const initialState: AdminState = {
    isEditMode: false,
    isCreateOpen: false,
    isSpeakerEditorOpen: false,
    isSessionEditorOpen: false
};

const admin: Reducer<AdminState> = handleActions<any>({
    [AdminTypes.TOGGLE_EDIT_MODE]: (state: AdminState) => ({
        ...state,
        isEditMode: !state.isEditMode,
        isCreateOpen: !state.isEditMode === false ? false : state.isCreateOpen,
        isSpeakerEditorOpen: !state.isEditMode === false ? false : state.isSpeakerEditorOpen
    }),
    [AdminTypes.TOGGLE_CREATE_MENU]: (state: AdminState) => ({
        ...state,
        isCreateOpen: !state.isCreateOpen
    }),
    [AdminTypes.SET_SPEAKER_EDITOR_OPEN]: (state: AdminState, action: ReturnType<typeof setSpeakerEditorOpen>) => ({
        ...state,
        isSpeakerEditorOpen: action.payload
    }),
    [AdminTypes.SET_SESSION_EDITOR_OPEN]: (state: AdminState, action: ReturnType<typeof setSessionEditorOpen>) => ({
        ...state,
        isSessionEditorOpen: action.payload
    })
}, initialState);

export const toggleEditMode = createAction(AdminTypes.TOGGLE_EDIT_MODE);
export const toggleCreateMenu = createAction(AdminTypes.TOGGLE_CREATE_MENU);
export const setSpeakerEditorOpen = createAction<boolean>(AdminTypes.SET_SPEAKER_EDITOR_OPEN);
export const setSessionEditorOpen = createAction<boolean>(AdminTypes.SET_SESSION_EDITOR_OPEN);

export default admin;

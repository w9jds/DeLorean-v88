import { createAction, handleActions } from 'redux-actions';

import { Reducer } from 'redux';
import { AdminState } from '../models/states';
import { ApplicationState } from '..';

export const getIsEditMode = (state: ApplicationState) => state.admin.isEditMode;
export const getIsCreateOpen = (state: ApplicationState) => state.admin.isCreateOpen;
export const getIsSpeakerEditorOpen = (state: ApplicationState) => state.admin.isSpeakerEditorOpen;

export enum AdminTypes {
    TOGGLE_EDIT_MODE = 'TOGGLE_EDIT_MODE',
    TOGGLE_CREATE_MENU = 'TOGGLE_CREATE_MENU',
    TOGGLE_SPEAKER_EDITOR = 'TOGGLE_SPEAKER_EDITOR'
}

const initialState: AdminState = {
    isEditMode: false,
    isCreateOpen: false,
    isSpeakerEditorOpen: false
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
    [AdminTypes.TOGGLE_SPEAKER_EDITOR]: (state: AdminState) => ({
        ...state,
        isSpeakerEditorOpen: !state.isSpeakerEditorOpen
    })
}, initialState);

export const toggleEditMode = createAction(AdminTypes.TOGGLE_EDIT_MODE);
export const toggleCreateMenu = createAction(AdminTypes.TOGGLE_CREATE_MENU);
export const toggleSpeakerEditor = createAction(AdminTypes.TOGGLE_SPEAKER_EDITOR);

export default admin;

import { Reducer } from 'redux';
import { handleActions } from 'redux-actions';

import { AdminState } from 'models/states';
import { AdminEvents } from 'store/events';
import { setSessionEditorOpen, setSpeakerEditorOpen } from './actions';

const initialState: AdminState = {
  isEditMode: false,
  isCreateOpen: false,
  isSpeakerEditorOpen: false,
  isSessionEditorOpen: false
};

const admin: Reducer<AdminState> = handleActions<any>({
  [AdminEvents.TOGGLE_EDIT_MODE]: (state: AdminState) => ({
    ...state,
    isEditMode: !state.isEditMode,
    isCreateOpen: !state.isEditMode === false ? false : state.isCreateOpen,
    isSpeakerEditorOpen: !state.isEditMode === false ? false : state.isSpeakerEditorOpen
  }),
  [AdminEvents.TOGGLE_CREATE_MENU]: (state: AdminState) => ({
    ...state,
    isCreateOpen: !state.isCreateOpen
  }),
  [AdminEvents.SET_SPEAKER_EDITOR_OPEN]: (state: AdminState, action: ReturnType<typeof setSpeakerEditorOpen>) => ({
    ...state,
    isSpeakerEditorOpen: action.payload
  }),
  [AdminEvents.SET_SESSION_EDITOR_OPEN]: (state: AdminState, action: ReturnType<typeof setSessionEditorOpen>) => ({
    ...state,
    isSessionEditorOpen: action.payload
  })
}, initialState);

export default admin;
import { createAction } from 'redux-actions';
import { AdminEvents } from 'store/events';

export const toggleEditMode = createAction(AdminEvents.TOGGLE_EDIT_MODE);

export const toggleCreateMenu = createAction(AdminEvents.TOGGLE_CREATE_MENU);

export const setSpeakerEditorOpen = createAction<boolean>(AdminEvents.SET_SPEAKER_EDITOR_OPEN);

export const setSessionEditorOpen = createAction<boolean>(AdminEvents.SET_SESSION_EDITOR_OPEN);
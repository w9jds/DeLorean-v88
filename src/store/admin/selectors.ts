import { ApplicationState } from 'models/states';

export const getIsEditMode = (state: ApplicationState) => state.admin.isEditMode;

export const getIsCreateOpen = (state: ApplicationState) => state.admin.isCreateOpen;

export const getIsSpeakerEditorOpen = (state: ApplicationState) => state.admin.isSpeakerEditorOpen;

export const getIsSessionEditorOpen = (state: ApplicationState) => state.admin.isSessionEditorOpen;
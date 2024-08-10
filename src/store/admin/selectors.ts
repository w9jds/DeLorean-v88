import { ApplicationState } from 'models/states';

export const isEditMode = (state: ApplicationState) => state.admin.isEditMode;

export const isCreateOpen = (state: ApplicationState) => state.admin.isCreateOpen;

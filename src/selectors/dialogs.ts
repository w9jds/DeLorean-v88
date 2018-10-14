import { ApplicationState } from '..';

export const getDialogViews = (state: ApplicationState) => state.dialogs.views;
export const isDialogVisible = (state: ApplicationState) => state.dialogs.open;
export const isDialogFullscreen = (state: ApplicationState) => state.dialogs.fullscreen;

import { ApplicationState } from 'models/states';

export const isConfigDialogOpen = (state: ApplicationState) => state.config.isOpen;
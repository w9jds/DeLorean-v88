import { createAction } from 'redux-actions';
import { DialogEvents } from 'store/events';

export const closeDialogWindow = createAction(DialogEvents.CLOSE_DIALOG);

export const openDialogWindow = createAction(
  DialogEvents.OPEN_DIALOG,
    (views: React.ReactElement<any> | React.ReactElement<any>[], fullscreen: boolean) => ({ views, fullscreen })
);
import { Reducer } from 'redux';
import { DialogsState } from '../models/States';
import { createAction, handleActions } from 'redux-actions';

enum DialogTypes {
    OPEN_DIALOG = 'OPEN_DIALOG',
    CLOSE_DIALOG = 'CLOSE_DIALOG'
}

const initialState: DialogsState = {
    open: false,
    fullscreen: false,
    views: undefined
};

const dialogs: Reducer<DialogsState> = handleActions<any>({
    [DialogTypes.OPEN_DIALOG]: (_state: DialogsState, action: ReturnType<typeof openDialogWindow>) => ({
        open: true,
        views: action.payload.views,
        fullscreen: action.payload.fullscreen || false
    }),
    [DialogTypes.CLOSE_DIALOG]: () => ({
        open: false,
        views: undefined,
        fullscreen: false
    })
}, initialState);

export const closeDialogWindow = createAction(DialogTypes.CLOSE_DIALOG);
export const openDialogWindow = createAction(
    DialogTypes.OPEN_DIALOG,
    (views: React.ReactElement<any> | React.ReactElement<any>[], fullscreen: boolean) => ({ views, fullscreen })
);

export default dialogs;
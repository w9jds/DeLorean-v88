import { Reducer } from 'redux';
import { handleActions } from 'redux-actions';

import { DialogsState } from 'models/states';
import { DialogEvents } from 'store/events';
import { openDialogWindow } from './actions';

const initialState: DialogsState = {
  open: false,
  fullscreen: false,
  views: undefined
};

const dialogs: Reducer<DialogsState> = handleActions<any>({
  [DialogEvents.OPEN_DIALOG]: (_state: DialogsState, action: ReturnType<typeof openDialogWindow>) => ({
      open: true,
      views: action.payload.views,
      fullscreen: action.payload.fullscreen || false
  }),
  [DialogEvents.CLOSE_DIALOG]: () => ({
      open: false,
      views: undefined,
      fullscreen: false
  })
}, initialState);

export default dialogs;
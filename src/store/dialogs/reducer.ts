import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { DialogsState } from 'models/states';

type DialogConfig = {
  views: React.ReactElement<any> | React.ReactElement<any>[], 
  fullscreen: boolean
}

const initialState: DialogsState = {
  open: false,
  fullscreen: false,
  views: undefined
};

const dialogSlice = createSlice({
  name: 'dialogs',
  initialState,
  reducers: {
    openDialog: (_state, action: PayloadAction<DialogConfig>) => ({
      open: true,
      views: action.payload.views,
      fullscreen: action.payload.fullscreen || false
    }),
    closeDialog: () => ({
      open: false,
      views: undefined,
      fullscreen: false
    })
  }
})

export const { openDialog, closeDialog } = dialogSlice.actions;

export default dialogSlice;
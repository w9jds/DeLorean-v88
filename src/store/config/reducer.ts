import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ConfigState } from 'models/states';

const initialState: ConfigState = {
  isOpen: false
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    toggleConfig: (state) => {
      state.isOpen = !state.isOpen;
    },
  }
});

export const { toggleConfig } = configSlice.actions;

export default configSlice;
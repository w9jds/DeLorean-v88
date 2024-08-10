import { AdminState } from 'models/states';
import { createSlice } from '@reduxjs/toolkit';

const initialState: AdminState = {
  isEditMode: false,
  isCreateOpen: false,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    toggleEditMode: (state) => {
      state.isEditMode = !state.isEditMode;
      state.isCreateOpen = !state.isEditMode === false ? false : state.isCreateOpen;
    },
    toggleCreateMenu: (state) => {
      state.isCreateOpen = !state.isCreateOpen;
    },
  }
})

export const { toggleEditMode, toggleCreateMenu } = adminSlice.actions;

export default adminSlice;
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DocumentSnapshot } from 'firebase/firestore';

import { SessionState } from 'models/states';
import { SessionChanges, SessionEditorFullState, SessionTypes } from 'models/session';

const clearState: SessionEditorFullState = {
  name: '',
  type: SessionTypes.SESSION,
  tracks: [],
  errors: [],
  speakers: [],
  description: '',
  location: '',
};

const initialState: SessionState = {
  isEditorOpen: false,
  editor: clearState,
  sessions: {}
};

const sessionsSlice = createSlice({
  name: 'sessions',
  initialState,
  reducers: {
    setSession: (state, action: PayloadAction<Record<string, DocumentSnapshot>>) => {
      state.sessions = action.payload;
    },
    setSessionEditorInitialState: (state, action: PayloadAction<SessionEditorFullState>) => {
      state.editor = action.payload;
    },
    setSessionEditorOpen: (state, action: PayloadAction<boolean>) => {
      state.isEditorOpen = action.payload;

      if (action.payload === false) {
        state.editor = clearState;
      }
    },

    //Saga Triggers
    editSession: (_, action: PayloadAction<SessionChanges>) => {},
  }
});

export const { setSession, setSessionEditorInitialState, setSessionEditorOpen, editSession } = sessionsSlice.actions;

export default sessionsSlice;
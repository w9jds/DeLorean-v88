import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DocumentSnapshot } from 'firebase/firestore';

import { SpeakerState } from 'models/states';
import { SpeakerChanges, SpeakerEditorFullState } from 'models/speaker';

const clearState = {
  bio: '',
  title: '',
  name: '',
  company: '',
  file: undefined,
  featured: false,
  errors: []
};

const initialState: SpeakerState = {
  isEditorOpen: false,
  editor: clearState,
  speakers: {}
};

const speakerSlice = createSlice({
  name: 'speakers',
  initialState,
  reducers: {
    setSpeakers: (state, action: PayloadAction<Record<string, DocumentSnapshot>>) => {
      state.speakers = action.payload;
    },
    setSpeakerEditorInitialState: (state, action: PayloadAction<SpeakerEditorFullState>) => {
      state.editor = action.payload;
    },
    setSpeakerEditorOpen: (state, action) => {
      state.isEditorOpen = action.payload;

      if (action.payload === false) {
        state.editor = clearState;
      }
    },

    //Saga Triggers
    editSpeaker: (_, action: PayloadAction<SpeakerChanges>) => {},
  }
});

export const { setSpeakers, setSpeakerEditorInitialState, setSpeakerEditorOpen, editSpeaker } = speakerSlice.actions;

export default speakerSlice;
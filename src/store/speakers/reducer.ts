import { Reducer } from 'redux';
import { handleActions } from 'redux-actions';

import { SpeakerState } from 'models/states';
import { SpeakerEvents } from 'store/events';
import { setSpeakerEditorInitialState, setSpeakers } from './actions';

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
  editor: clearState,
  speakers: {}
};

const speakers: Reducer<SpeakerState> = handleActions<any>({
  [SpeakerEvents.SET_SPEAKERS]: (state: SpeakerState, action: ReturnType<typeof setSpeakers>) => ({
      ...state,
      speakers: action.payload
  }),
  [SpeakerEvents.SET_EDITOR_STATE]: (state: SpeakerState, action: ReturnType<typeof setSpeakerEditorInitialState>) => ({
      ...state,
      editor: action.payload
  }),
  [SpeakerEvents.CLEAR_EDITOR_STATE]: (state: SpeakerState) => ({
      ...state,
      editor: clearState
  })
}, initialState);

export default speakers;
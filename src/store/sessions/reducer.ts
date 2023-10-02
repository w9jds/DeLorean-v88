import { Reducer } from 'redux';
import { handleActions } from 'redux-actions';

import { SessionState } from 'models/states';
import { SessionEditorFullState, SessionTypes } from 'models/session';

import { SessionEvents } from 'store/events';
import { setSession, setSessionEditorInitialState } from './actions';

const clearState: SessionEditorFullState = {
  name: '',
  type: SessionTypes.SESSION,
  tracks: [],
  errors: [],
  speakers: [],
  description: ''
};

const initialState: SessionState = {
  editor: clearState,
  sessions: {}
};

const sessions: Reducer<SessionState> = handleActions<any>({
  [SessionEvents.SET_SESSION]: (state: SessionState, action: ReturnType<typeof setSession>) => ({
      ...state,
      sessions: action.payload
  }),
  [SessionEvents.SET_SESSION_STATE]: (state: SessionState, action: ReturnType<typeof setSessionEditorInitialState>) => ({
      ...state,
      editor: action.payload
  }),
  [SessionEvents.CLEAR_SESSION_STATE]: (state: SessionState) => ({
      ...state,
      editor: clearState
  })
}, initialState);

export default sessions;
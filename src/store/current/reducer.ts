import { Reducer } from 'redux';
import { handleActions } from 'redux-actions';

import { CurrentState } from 'models/states';
import { CurrentEvents } from 'store/events';

import { setFirebaseApplication, setSiteConfig, setSponsors, setUser, setUserProfile } from './actions';

const initialState: CurrentState = {
  user: undefined,
  profile: undefined,
  firebase: undefined,
  config: undefined,
  sponsors: undefined
};

const current: Reducer<CurrentState> = handleActions<any>({
  [CurrentEvents.SET_USER]: (state: CurrentState, action: ReturnType<typeof setUser>) => ({
    ...state,
    user: action.payload
  }),
  [CurrentEvents.SET_PROFILE]: (state: CurrentState, action: ReturnType<typeof setUserProfile>) => ({
    ...state,
    profile: action.payload
  }),
  [CurrentEvents.SET_FIREBASE]: (state: CurrentState, action: ReturnType<typeof setFirebaseApplication>) => ({
    ...state,
    firebase: action.payload
  }),
  [CurrentEvents.SET_CONFIG]: (state: CurrentState, action: ReturnType<typeof setSiteConfig>) => {
    return {
      ...state,
      config: action.payload
    }
  },
  [CurrentEvents.SET_SPONSORS]: (state: CurrentState, action: ReturnType<typeof setSponsors>) => ({
    ...state,
    sponsors: action.payload
  })
}, initialState);

export default current;
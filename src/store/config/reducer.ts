import { Reducer } from 'redux';
import { handleActions } from 'redux-actions';

import { ConfigEvents } from 'store/events';
import { ConfigState } from 'models/states';

const initialState: ConfigState = {
  isOpen: false
};

const config: Reducer<ConfigState> = handleActions<any>({
  [ConfigEvents.SET_CONFIG_OPEN]: () => ({
      isOpen: true
  }),
  [ConfigEvents.SET_CONFIG_CLOSE]: () => ({
      isOpen: false
  })
}, initialState);

export default config;
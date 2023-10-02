import { createAction } from 'redux-actions';
import { ConfigEvents } from 'store/events';


export const openConfigDialog = createAction(ConfigEvents.SET_CONFIG_OPEN);

export const closeConfigDialog = createAction(ConfigEvents.SET_CONFIG_CLOSE);
import { createAction, handleActions } from 'redux-actions';
import { Reducer } from 'redux';
import { ConfigState } from '../models/states';

export enum ConfigTypes {
    SET_CONFIG_OPEN = 'SET_CONFIG_OPEN',
    SET_CONFIG_CLOSE = 'SET_CONFIG_CLOSE'
}

const initialState: ConfigState = {
    isOpen: false
};

const config: Reducer<ConfigState> = handleActions<any>({
    [ConfigTypes.SET_CONFIG_OPEN]: () => ({
        isOpen: true
    }),
    [ConfigTypes.SET_CONFIG_CLOSE]: () => ({
        isOpen: false
    })
}, initialState);

export const openConfigDialog = createAction(ConfigTypes.SET_CONFIG_OPEN);
export const closeConfigDialog = createAction(ConfigTypes.SET_CONFIG_CLOSE);

export default config;

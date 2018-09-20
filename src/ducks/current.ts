import { createAction, handleActions } from 'redux-actions';
import { database, app } from 'firebase';
import { Reducer } from 'redux';
import { CurrentState } from '../models/states';

export enum CurrentTypes {

}

const initialState: CurrentState = {

};

const current: Reducer<CurrentState> = handleActions<any>({

}, initialState);


export default current;

import { app } from 'firebase';
import { Profile } from './user';

export type CurrentState = {
    user: firebase.User;
    profile: Profile;
    firebase: app.App;
};

export type ConfigState = {
    open: boolean;
}
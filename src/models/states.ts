import { app } from 'firebase';
import { Profile } from './user';
import Configuration from './config';

export type CurrentState = {
    user: firebase.User;
    profile: Profile;
    firebase: app.App;
    config: Configuration
};

export type ConfigState = {
    open: boolean;
}
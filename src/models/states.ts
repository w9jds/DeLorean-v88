import { app } from 'firebase';
import { Profile } from './user';

export type CurrentState = {
    user: firebase.User;
    profile: Profile;
    firebase: app.App;
};
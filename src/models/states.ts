import { Profile } from './user';
import Configuration from './config';

import { FirebaseApp } from '@firebase/app-types';
import { User } from '@firebase/auth-types';

export type CurrentState = {
    user: User;
    profile: Profile;
    firebase: FirebaseApp;
    config: Configuration;
    isEditMode: boolean;
};

export type ConfigState = {
    isOpen: boolean;
};
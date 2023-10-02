import { createAction } from 'redux-actions';

import { FirebaseApp } from 'firebase/app';
import { User } from 'firebase/auth';
import { CurrentEvents } from 'store/events';

import { Profile } from 'models/user';
import Sponsor from 'models/sponsor';
import Configuration from 'models/config';

export const setUser = createAction<User>(CurrentEvents.SET_USER);

export const setUserProfile = createAction<Profile>(CurrentEvents.SET_PROFILE);

export const setSponsors = createAction<Record<string, Sponsor>>(CurrentEvents.SET_SPONSORS);

export const setFirebaseApplication = createAction<FirebaseApp>(CurrentEvents.SET_FIREBASE);

export const setSiteConfig = createAction<Configuration>(CurrentEvents.SET_CONFIG);

export const getSiteData = createAction(CurrentEvents.LOAD_SITE_DATA);
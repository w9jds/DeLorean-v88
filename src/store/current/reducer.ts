import { User } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Profile } from 'models/user';
import { CurrentState } from 'models/states';
import Configuration from 'models/config';
import Sponsor from 'models/sponsor';

const initialState: CurrentState = {
  user: undefined,
  profile: undefined,
  firebase: undefined,
  config: undefined,
  sponsors: undefined
};

const currentSlice = createSlice({
  name: 'current',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
    setUserProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
    setFirebaseApplication: (state, action: PayloadAction<FirebaseApp>) => {
      state.firebase = action.payload;
    },
    setSiteConfig: (state, action: PayloadAction<Configuration>) => {
      state.config = action.payload;
    },
    setSponsors: (state, action: PayloadAction<Record<string, Sponsor>>) => {
      state.sponsors = action.payload;
    },

    // Saga Triggers
    getSiteData: () => {},
  }
});

export const { setUser, setUserProfile, setFirebaseApplication, setSiteConfig, setSponsors, getSiteData } = currentSlice.actions;

export default currentSlice;
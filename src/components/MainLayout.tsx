import React, { FC, Fragment, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';

import { Profile } from 'models/user';
import { FirebaseConfig } from 'config/delorean.config';

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

import { getUserProfile } from 'store/current/selectors';
import { isEditMode } from 'store/admin/selectors';

import Home from 'pages/Home';
import Conduct from 'pages/Conduct';
import Schedule from 'pages/Schedule';
import Speakers from 'pages/Speakers';

import Header from 'controls/Header';
import Footer from 'controls/Footer';
import Dialogs from 'controls/Dialog';
import EditOverlay from 'controls/EditOverlay';

import SiteConfig from './dialogs/SiteConfig';
import SpeakerEditor from './editors/Speaker';
import SessionEditor from './editors/Session';

import 'stylesheets/main.scss';
import { getSiteData, setFirebaseApplication, setUser, setUserProfile } from 'store/current/reducer';

export enum DeloreanRoutes {
  HOME = '/',
  SPEAKERS = '/speakers',
  SCHEDULE = '/schedule',
  SESSIONS = '/sessions',
  CODE_OF_CONDUCT = '/code-of-conduct'
}

const MainLayout: FC = () => {
  const dispatch = useDispatch();

  const profile = useSelector(getUserProfile);
  const isEditing = useSelector(isEditMode);

  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    const firebaseApp = initializeApp(FirebaseConfig);
    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);

    dispatch(setFirebaseApplication(firebaseApp));

    const verifyLogin = async (user: User) => {
      if (firstLoad && user) {
        dispatch(setUser(user));

        const profile = await getDoc(doc(db, `/users/${user.uid}`));
        dispatch(setUserProfile(profile.data() as Profile))
        setFirstLoad(false);
      }
    }

    onAuthStateChanged(auth, verifyLogin);
    dispatch(getSiteData());
  }, [])

  const buildAdminPanels = () => {
    if (profile && profile.admin === true) {
      return (
        <Fragment>
          <SpeakerEditor />
          <SessionEditor />
        </Fragment>
      );
    }

    return null;
  }

  return (
    <Fragment>
      <Header />

      <Dialogs />
      <SiteConfig />

      {buildAdminPanels()}

      <Routes>
        <Route path={DeloreanRoutes.SPEAKERS} element={<Speakers />} />
        <Route path={DeloreanRoutes.SCHEDULE} element={<Schedule />} />
        <Route path={DeloreanRoutes.CODE_OF_CONDUCT} element={<Conduct />} />
        <Route path="/*" element={<Home />} />
      </Routes>

      {isEditing ? <EditOverlay /> : null}

      <Footer />
    </Fragment>
  )
}

export default MainLayout;
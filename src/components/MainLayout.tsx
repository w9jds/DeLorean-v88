import React, { FC, Fragment, useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { Switch, Route, withRouter, RouteComponentProps, Redirect } from 'react-router';

import { Profile } from 'models/user';
import { ApplicationState } from 'models/states';
import { FirebaseConfig } from 'config/delorean.config';

import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

import { getUser, getUserProfile } from 'store/current/selectors';
import { setFirebaseApplication, getSiteData, setUser, setUserProfile } from 'store/current/actions';
import { getIsEditMode } from 'store/admin/selectors';

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

type MainLayoutProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps;

export enum DeloreanRoutes {
  HOME = '/',
  SPEAKERS = '/speakers',
  SCHEDULE = '/schedule',
  SESSIONS = '/sessions',
  CODE_OF_CONDUCT = '/code-of-conduct'
}

const MainLayout: FC<MainLayoutProps> = ({
  user,
  profile,
  isEditMode,

  setUser,
  setUserProfile,
  setFirebaseApplication,
  getSiteData
}) => {
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    const firebaseApp = initializeApp(FirebaseConfig);
    const auth = getAuth(firebaseApp);
    const db = getFirestore(firebaseApp);

    setFirebaseApplication(firebaseApp);

    const verifyLogin = async (user: User) => {
      if (firstLoad && user) {
        setUser(user);

        let profile = await getDoc(doc(db, `/users/${user.uid}`));
        setUserProfile(profile.data() as Profile);
        setFirstLoad(false);
      }
    }

    onAuthStateChanged(auth, verifyLogin);
    getSiteData();
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

      <Switch>
        <Route exact path={DeloreanRoutes.SPEAKERS}
            component={props => <Speakers {...props} />}
        />
        <Route exact path={DeloreanRoutes.SCHEDULE}
            component={props => <Schedule {...props} />}
        />
        <Route exact path={DeloreanRoutes.SESSIONS}
            component={() => <Redirect to={DeloreanRoutes.SCHEDULE}/>}
        />
        <Route exact path={DeloreanRoutes.CODE_OF_CONDUCT}
            component={Conduct}
        />
        <Route path={DeloreanRoutes.HOME} component={Home} />
      </Switch>

      {isEditMode ? <EditOverlay /> : null}

      <Footer />
    </Fragment>
  )
}

const mapStateToProps = (state: ApplicationState) => ({
  user: getUser(state),
  profile: getUserProfile(state),
  isEditMode: getIsEditMode(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  setUser,
  setUserProfile,
  setFirebaseApplication,
  getSiteData
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainLayout));
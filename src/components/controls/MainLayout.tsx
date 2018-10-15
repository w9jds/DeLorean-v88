import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';

import { ApplicationState } from '../..';
import { FirebaseConfig } from '../../../config/delorean.config';

import firebase from '@firebase/app';
import '@firebase/firestore';
import '@firebase/storage';

import { FirebaseApp } from '@firebase/app-types';
import { User } from '@firebase/auth-types';

import { setFirebaseApplication, setUser, setUserProfile } from '../../ducks/current';
import { getUser, getUserProfile, getIsEditMode } from '../../selectors/current';
import { Profile } from '../../models/user';
import { getSiteData } from '../../sagas/current';
import Header from './Header';
import SiteConfig from '../dialogs/SiteConfig';
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router';
import Footer from './Footer';
import Team from '../pages/Team';
import Home from '../pages/Home';
import Dialogs from '../controls/Dialog';
import Speakers from '../pages/Speakers';
import Schedule from '../pages/Schedule';
import EditOverlay from './EditOverlay';

type MainLayoutProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps;

class MainLayout extends React.Component<MainLayoutProps> {

    private firebase: FirebaseApp;

    constructor(props: MainLayoutProps, context: any) {
        super(props, context);

        this.firebase = firebase.initializeApp(FirebaseConfig);
        this.firebase.firestore().settings({ timestampsInSnapshots: true });

        props.setFirebaseApplication(this.firebase);
        firebase.auth().onAuthStateChanged(this.verifyLogin);
        props.getSiteData();
    }

    verifyLogin = async (user: User) => {
        if (user) {
            this.props.setUser(user);

            let profile = await this.firebase.firestore().doc(`/users/${user.uid}`).get();
            this.props.setUserProfile(profile.data() as Profile);
        }
    }

    render() {
        return (
            <div className="app-frame">
                <Header />

                <SiteConfig />
                <Dialogs />

                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/speakers" component={Speakers} />
                    <Route exact path="/schedule" component={Schedule} />
                    <Route exact path="/team" components={Team} />
                </Switch>

                {
                    this.props.isEditMode ?
                    <EditOverlay /> : null
                }

                <Footer />
            </div>
        );
    }

}

const mapStateToProps = (state: ApplicationState) => ({
    user: getUser(state),
    profile: getUserProfile(state),
    isEditMode: getIsEditMode(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    setUser, setUserProfile,
    setFirebaseApplication,
    getSiteData
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainLayout));
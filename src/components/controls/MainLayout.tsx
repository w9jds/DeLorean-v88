import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';

import { ApplicationState } from '../..';
import { FirebaseConfig } from '../../config/delorean.config';

import firebase from '@firebase/app';
import '@firebase/firestore';
import '@firebase/storage';

import { FirebaseApp } from '@firebase/app-types';
import { User } from '@firebase/auth-types';

import { setFirebaseApplication, setUser, setUserProfile, getUser, getUserProfile, getIsEditMode } from '../../ducks/current';
import { Profile } from '../../models/user';
import { getSiteData } from '../../sagas/current';
import Header from './Header/Header';
import SiteConfig from '../dialogs/SiteConfig/SiteConfig';
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router';
import Footer from './Footer/Footer';
import Team from '../pages/Team';
import Home from '../pages/Home/Home';
import Dialogs from './Dialog/Dialog';
import Schedule from '../pages/Schedule';
import Speakers from '../pages/Speakers/Speakers';
import Conduct from '../pages/Conduct/Conduct';
import EditOverlay from './EditOverlay/EditOverlay';

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
                    <Route exact path="/speakers" render={props => <Speakers {...props} />} />
                    <Route exact path="/schedule" component={Schedule} />
                    <Route exact path="/team" render={props => <Team {...props} />} />
                    <Route exact path="/code-of-conduct" component={Conduct} />
                </Switch>

                {this.props.isEditMode ? <EditOverlay /> : null}

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
    setUser, setUserProfile, setFirebaseApplication, getSiteData
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(MainLayout));
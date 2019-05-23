import '../../stylesheets/main.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { Switch, Route, withRouter, RouteComponentProps, Redirect } from 'react-router';


import firebase from '@firebase/app';
import '@firebase/firestore';
import '@firebase/storage';

import { FirebaseApp } from '@firebase/app-types';
import { User } from '@firebase/auth-types';

import { getIsEditMode } from '../../ducks/admin';
import { setFirebaseApplication, setUser, setUserProfile, getUser, getUserProfile } from '../../ducks/current';

import { Profile } from '../../../models/user';
import { getSiteData } from '../../sagas/current';
import { ApplicationState } from '../../../models/states';
import { FirebaseConfig } from '../../config/delorean.config';

import Header from './Header';
import Footer from './Footer';
import Dialogs from './Dialog';
import Home from '../pages/Home';
import Schedule from '../pages/Schedule';
import Speakers from '../pages/Speakers';
import Conduct from '../pages/Conduct';
import EditOverlay from './EditOverlay';
import SiteConfig from '../dialogs/SiteConfig';
import SpeakerEditor from '../dialogs/SpeakerEditor';
import SessionEditor from '../dialogs/SessionEditor';

type MainLayoutProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps;

export enum DeloreanRoutes {
    HOME = '/',
    SPEAKERS = '/speakers',
    SCHEDULE = '/schedule',
    SESSIONS = '/sessions',
    CODE_OF_CONDUCT = '/code-of-conduct'
}

class MainLayout extends React.Component<MainLayoutProps> {

    private firebase: FirebaseApp;

    constructor(props: MainLayoutProps, context: any) {
        super(props, context);

        this.firebase = firebase.initializeApp(FirebaseConfig);

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

    buildAdminPanels = () => {
        const { profile } = this.props;

        if (profile && profile.admin === true) {
            return (
                <React.Fragment>
                    <SpeakerEditor />
                    <SessionEditor />
                </React.Fragment>
            );
        }

        return null;
    }

    render() {
        return (
            <div className="app-frame">
                <Header />

                <Dialogs />
                <SiteConfig />
                
                {this.buildAdminPanels()}

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
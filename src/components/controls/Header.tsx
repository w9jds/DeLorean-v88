import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux';

import { ApplicationState } from '../..';
import { FirebaseConfig } from '../../../config/delorean.config';
import { app, auth, initializeApp } from 'firebase';

import { StyleRulesCallback, withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';

import { setFirebaseApplication, setUser, setUserProfile } from '../../ducks/current';
import { getUser } from '../../selectors/current';
import { Profile } from '../../models/user';

const styleSheet: StyleRulesCallback = theme => ({ });

type HeaderProps = ReturnType<typeof styleSheet> & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

class Header extends React.Component<HeaderProps> {

    private firebase: app.App;

    constructor(props: HeaderProps) {
        super(props);

        this.firebase = initializeApp(FirebaseConfig);

        props.setFirebaseApplication(this.firebase);

        auth().onAuthStateChanged(this.verifyLogin);
    }

    googleLogin = async () => {
        let provider = new auth.GoogleAuthProvider();
        this.firebase.auth().signInWithPopup(provider);
    }

    verifyLogin = async (user: firebase.User) => {
        // if (this.state.firstLoad) {
        //     this.setState({ firstLoad: false }, this.props.verifyLogins);
        // }

        if (user) {
            this.props.setUser(user);

            let profile = await this.firebase.firestore().doc(`/users/${user.uid}`).get();
            this.props.setUserProfile(profile.data() as Profile)
        }
    }

    buildLoginItems = () => {
        if (!this.props.user) {
            return <Button onClick={this.googleLogin}>Sign In</Button>
        }

        return (
            <div>
                <img src={this.props.user.photoURL} />
            </div>
        )
    }

    render() {
        const { classes } = this.props;

        return (
            <AppBar position="sticky" className="header">
                <Toolbar className="inner container">
                    <div className="logo">
                        <Link to="/">
                            <img src="https://gdg-logo-generator.appspot.com/gdg_icon.svg"/>
                        </Link>
                    </div>

                    <nav className="nav">
                        <div>
                            <Link to="/schedule">Schedule</Link>
                        </div>
                        <div>
                            <Link to="/speakers">Speakers</Link>
                        </div>
                        <div>
                            <a>FAQ</a>
                        </div>
                    </nav>

                    <div className="login">
                        {this.buildLoginItems()}
                    </div>
                </Toolbar>
            </AppBar>
        );
    }

}

const mapStateToProps = (state: ApplicationState) => ({
    user: getUser(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    setFirebaseApplication, setUser, setUserProfile
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Header));
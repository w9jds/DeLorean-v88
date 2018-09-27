import * as React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux';

import { ApplicationState } from '../..';
import { FirebaseConfig } from '../../../config/delorean.config';
import { app, auth, initializeApp } from 'firebase';

import { StyleRulesCallback, withStyles } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';

import { setFirebaseApplication, setUser, setUserProfile } from '../../ducks/current';
import { getUser, getUserProfile } from '../../selectors/current';
import { Profile } from '../../models/user';
import { openConfigDialog } from '../../ducks/config';
import { getSiteConfig } from '../../sagas/current';

const styleSheet: StyleRulesCallback = theme => ({ });

type HeaderProps = ReturnType<typeof styleSheet> & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;
type HeaderState = {
    accountMenuOpen: boolean;
    anchorEl: HTMLElement;
};

class Header extends React.Component<HeaderProps, HeaderState> {

    private firebase: app.App;

    constructor(props: HeaderProps) {
        super(props);

        this.state = {
            accountMenuOpen: false,
            anchorEl: null
        };

        this.firebase = initializeApp(FirebaseConfig);
        this.firebase.firestore().settings({ timestampsInSnapshots: true });

        props.setFirebaseApplication(this.firebase);
        auth().onAuthStateChanged(this.verifyLogin);
        props.getSiteConfig();
    }

    googleLogin = () => {
        let provider = new auth.GoogleAuthProvider();
        this.firebase.auth().signInWithPopup(provider);
    }

    openConfig = () => {
        this.handleClose();
        this.props.openConfigDialog();
    }

    handleClose = () => {
        this.setState({
            accountMenuOpen: false,
            anchorEl: null
        });
    }

    openAccountMenu = (e: React.MouseEvent<HTMLImageElement>) => {
        this.setState({
            anchorEl: e.currentTarget,
            accountMenuOpen: true
        });
    }

    verifyLogin = async (user: firebase.User) => {
        if (user) {
            this.props.setUser(user);

            let profile = await this.firebase.firestore().doc(`/users/${user.uid}`).get();
            this.props.setUserProfile(profile.data() as Profile);
        }
    }

    buildMenuItems = () => {
        let items = [];

        if (this.props.profile && this.props.profile.admin) {
            items = items.concat(
                <MenuItem key="user-management">User management</MenuItem>,
                <MenuItem key="site-config" onClick={this.openConfig}>Site configuration</MenuItem>,
                <MenuItem key="survey-data">Survey data</MenuItem>,
                <Divider key="divider"/>
            );
        }

        return items.concat(
            <MenuItem key="sign-out">Sign out</MenuItem>
        );
    }

    buildLoginItems = () => {
        if (!this.props.user) {
            return <Button onClick={this.googleLogin}>Sign In</Button>;
        }

        return (
            <div>
                <img className={this.state.accountMenuOpen ? 'user-selected' : ''} 
                    onClick={this.openAccountMenu} 
                    src={this.props.user.photoURL} />
                <Popover classes={{ paper: 'user-menu' }}
                    open={this.state.accountMenuOpen}
                    anchorEl={this.state.anchorEl}
                    onClose={this.handleClose}
                    anchorPosition={{ top: 5, left: 0 }}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right'
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right'
                    }}>

                    <Paper>
                        <ClickAwayListener onClickAway={this.handleClose}>
                            <MenuList>
                                {this.buildMenuItems()}
                            </MenuList>
                        </ClickAwayListener>
                    </Paper>

                </Popover>
            </div>
        );
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
    user: getUser(state),
    profile: getUserProfile(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    setUser, setUserProfile,
    setFirebaseApplication,
    openConfigDialog, getSiteConfig
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Header));
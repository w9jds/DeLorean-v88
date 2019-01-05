import './Header.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux';

import { ApplicationState } from '../../..';

import firebase from '@firebase/app';
import '@firebase/auth';

import { StyleRulesCallback, withStyles, WithStyles } from '@material-ui/core';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Paper from '@material-ui/core/Paper';
import Popover from '@material-ui/core/Popover';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { getUser, getUserProfile, getFirebaseApp } from '../../../ducks/current';
import { openConfigDialog } from '../../../ducks/config';
import { EventbriteConfig } from '../../../config/delorean.config';
import { DeloreanRoutes } from '../MainLayout';
import { toggleEditMode, getIsEditMode } from '../../../ducks/admin';

const styleSheet: StyleRulesCallback = theme => ({
    tabs: {
        height: '100%'
    }
});

type HeaderProps = WithStyles<typeof styleSheet> & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps;
type HeaderState = {
    accountMenuOpen: boolean;
    isTicketsVisible: boolean;
    anchorEl: HTMLElement;
    route: number;
};

class Header extends React.Component<HeaderProps, HeaderState> {

    constructor(props: HeaderProps) {
        super(props);

        this.state = {
            accountMenuOpen: false,
            isTicketsVisible: true,
            anchorEl: null,
            route: 0
        };

    }

    componentDidMount() {
        window.addEventListener('scroll', this.onScrollEvent);
        // tslint:disable-next-line:no-string-literal
        window['EBWidgets'].createWidget({
            widgetType: 'checkout',
            eventId: EventbriteConfig.eventId,
            modal: true,
            modalTriggerElementId: `get-header-event-tickets-${EventbriteConfig.eventId}`
        });
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.onScrollEvent);
    }

    static getDerivedStateFromProps(props: HeaderProps, state: HeaderState) {
        let update: HeaderState = { ...state };

        switch (props.location.pathname) {
            case DeloreanRoutes.HOME:
                update.route = 0;
                break;
            case DeloreanRoutes.SPEAKERS:
                update.route = 1;
                break;
            case DeloreanRoutes.SESSIONS:
                update.route = 2;
                break;
            case DeloreanRoutes.SCHEDULE:
                update.route = 3;
                break;
            default:
                update.route = -1;
                break;
        }

        return update;
    }

    googleLogin = () => {
        let provider = new firebase.auth.GoogleAuthProvider();
        this.props.firebase.auth().signInWithPopup(provider);
    }

    signout = async () => {
        this.handleClose();
        await this.props.firebase.auth().signOut();
        window.location.reload();
    }

    onMenuClick = (handler: () => void) => {
        this.handleClose();
        handler();
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

    buildMenuItems = () => {
        let items = [];

        if (this.props.profile && this.props.profile.admin) {
            items = items.concat(
                <MenuItem key="site-config" onClick={() => this.onMenuClick(this.props.openConfigDialog)}>
                    Site configuration
                </MenuItem>,
                <MenuItem key="toggle-edit-mode" onClick={() => this.onMenuClick(this.props.toggleEditMode)}>
                    Toggle Edit Mode
                </MenuItem>,
                <Divider key="divider"/>
            );
        }

        return items.concat(
            <MenuItem key="sign-out" onClick={this.signout}>Sign out</MenuItem>
        );
    }

    buildLoginItems = () => {
        if (!this.props.user) {
            return <Button onClick={this.googleLogin}>Sign In</Button>;
        }

        return (
            <React.Fragment>
                <img className={this.state.accountMenuOpen ? 'user-selected' : ''}
                    onClick={this.openAccountMenu}
                    src={this.props.user.photoURL} />

                {this.state.accountMenuOpen ? this.buildUserMenu() : null}
            </React.Fragment>
        );
    }

    buildUserMenu = () => {
        let { accountMenuOpen, anchorEl } = this.state;

        return (
            <Popover classes={{ paper: 'user-menu' }}
                open={accountMenuOpen}
                anchorEl={anchorEl}
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
        );
    }

    isElementInViewport = (el: Element) => {
        var rect = el.getBoundingClientRect();

        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    onScrollEvent = () => {
        let isVisible = false;
        let intro = document.querySelector(`.intro #get-event-tickets-${EventbriteConfig.eventId}`);

        if (intro) {
            isVisible = this.isElementInViewport(intro);
        }

        if (this.state.isTicketsVisible !== isVisible) {
            this.setState({ isTicketsVisible: isVisible });
        }
    }

    displayTicketButton = () => {
        let display: string = this.state.isTicketsVisible ? 'none' : 'block';

        return (
            <div className="get-tickets-header" style={{ display }}>
                <Button id={`get-header-event-tickets-${EventbriteConfig.eventId}`} variant="contained" color="secondary">
                    Get Tickets
                </Button>
            </div>
        );
    }

    onNavigationChanged = (event, value) => {
        switch (value) {
            case 0:
                this.props.history.push(DeloreanRoutes.HOME);
                break;
            case 1:
                this.props.history.push(DeloreanRoutes.SPEAKERS);
                break;
            case 2:
                this.props.history.push(DeloreanRoutes.SESSIONS);
                break;
            case 3:
                this.props.history.push(DeloreanRoutes.SCHEDULE);
                break;
            default:
                break;
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <AppBar position="sticky" className="header">
                <div className="inner container">
                    <nav className="nav" >
                        <Tabs value={this.state.route} onChange={this.onNavigationChanged}
                              classes={{ flexContainer: classes.tabs, root: classes.tabs }}>

                            <Tab key="home" label="Home" />
                            <Tab key="speakers" label="Speakers" />
                            <Tab key="sessions" label="Sessions" />

                        </Tabs>
                    </nav>

                    {this.displayTicketButton()}

                    <div className="login">
                        {this.buildLoginItems()}
                    </div>
                </div>
            </AppBar>
        );
    }

}

const mapStateToProps = (state: ApplicationState) => ({
    user: getUser(state),
    profile: getUserProfile(state),
    firebase: getFirebaseApp(state),
    isEditMode: getIsEditMode(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    toggleEditMode, openConfigDialog
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Header)));
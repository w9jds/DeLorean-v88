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

import { toggleEditMode, getUser, getUserProfile, getFirebaseApp } from '../../../ducks/current';
import { openConfigDialog } from '../../../ducks/config';
import { EventbriteConfig } from '../../../config/delorean.config';

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
        let intro = document.querySelector(`.intro #get-event-tickets-${EventbriteConfig.eventId}`);

        if (intro) {
            let isVisible = this.isElementInViewport(intro);

            if (this.state.isTicketsVisible !== isVisible) {
                this.setState({
                    isTicketsVisible: isVisible
                });
            }
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
        let route = '/';

        switch (value) {
            case 1:
                route += 'schedule';
                break;
            case 2:
                route += 'speakers';
                break;
            case 3:
                route += 'team';
                break;
            default:
                break;
        }

        this.props.history.push(route);
        this.setState({ route: value });
    }

    render() {
        const { classes } = this.props;

        return (
            <AppBar position="sticky" className="header">
                <div className="inner container">
                    <nav className="nav" >
                        <Tabs value={this.state.route} onChange={this.onNavigationChanged}
                              classes={{ flexContainer: classes.tabs, root: classes.tabs }}>

                            <Tab label="Home" />
                            {
                                /*
                                    <Tab label="Schedule" />
                                    <Tab label="Speakers" />
                                    <Tab label="Team" />
                                */
                            }
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
    firebase: getFirebaseApp(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    toggleEditMode, openConfigDialog
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(Header)));
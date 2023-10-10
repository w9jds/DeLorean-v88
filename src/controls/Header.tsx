import anime from 'animejs';
import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Dispatch, bindActionCreators } from 'redux';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { DeloreanRoutes } from 'components/MainLayout';
import { EventbriteConfig } from 'config/delorean.config';
import { ApplicationState } from 'models/states';

import { FabProps, Fab, Button, ButtonProps, ClickAwayListener, AppBar, Divider, Paper, Popover, MenuItem, MenuList, Tabs, Tab } from '@mui/material';
import { LocalActivity } from '@mui/icons-material';

import { toggleEditMode } from 'store/admin/actions';
import { openConfigDialog } from 'store/config/actions';
import { getIsEditMode } from 'store/admin/selectors';
import { getFirebaseAuth, getUser, getUserProfile } from 'store/current/selectors';

import './Header.scss';
import { getAnalytics, logEvent } from 'firebase/analytics';

type HeaderProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps;
type HeaderState = {
  accountMenuOpen: boolean;
  isTicketsVisible: boolean;
  isFooterVisible: boolean;
  anchorEl: HTMLElement;
  route: number;
};

class Header extends React.Component<HeaderProps, HeaderState> {
  private mobileAnim;

  constructor(props: HeaderProps) {
    super(props);

    this.state = {
      accountMenuOpen: false,
      isTicketsVisible: true,
      isFooterVisible: false,
      anchorEl: null,
      route: 0
    };
  }

  componentDidMount() {
    window.addEventListener('scroll', this.onScrollEvent);

    if (location.pathname !== DeloreanRoutes.HOME) {
      this.props.history.replace(DeloreanRoutes.HOME);
    }

    if ('EBWidgets' in window) {
      // tslint:disable-next-line:no-string-literal
      (window['EBWidgets'] as any).createWidget({
        widgetType: 'checkout',
        eventId: EventbriteConfig.eventId,
        modal: true,
        modalTriggerElementId: `get-event-tickets-${EventbriteConfig.eventId}`
      });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScrollEvent);
  }

  componentDidUpdate(prevProps: HeaderProps, prevState: HeaderState) {
    if (window.innerWidth <= 550) {
      this.handleMobileTicketsButton(prevState);
    }
  }

  handleMobileTicketsButton = (prevState: HeaderState) => {
    let animationBase = {
      targets: '.get-ticket-mobile',
      duration: 725
    };

    if (prevState.isTicketsVisible !== this.state.isTicketsVisible) {
      if (this.state.isTicketsVisible === false) {
        this.mobileAnim = anime({
          targets: '.get-ticket-mobile',
          duration: 725,
          scale: [0, 1]
        });
      }
      if (this.state.isTicketsVisible === true) {
        this.mobileAnim.reverse();
        this.mobileAnim.play();
      }
    }

    if (!this.state.isTicketsVisible && prevState.isFooterVisible !== this.state.isFooterVisible) {
      if (this.state.isFooterVisible === true) {
        this.expandTickets();
      }
      if (this.state.isFooterVisible === false) {
        anime({
          ...animationBase,
          translateY: 0,
          translateX: 0
        });
      }
    }
  }

  expandTickets = () => {
    const targets = document.querySelector('.get-ticket-mobile');
    const footer = document.querySelector('.footer.container-wide');

    const targetBounds = targets.getBoundingClientRect();
    const footerHeight = footer.getBoundingClientRect().height;

    anime({
      targets: targets,
      translateY: [0, -(footerHeight - 10)],
      translateX: () => {
        let left = (window.innerWidth / 2) - (targetBounds.width / 2);
        return [0, left - targetBounds.left];
      },
      duration: 725
    });
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
      case DeloreanRoutes.SCHEDULE:
        update.route = 2;
        break;
      default:
        update.route = -1;
        break;
    }

    return update;
  }

  googleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(this.props.auth, provider);
  }

  signout = async () => {
    this.handleClose();
    await this.props.auth.signOut();
    logEvent(getAnalytics(), 'logout');
    window.location.reload();
  }

  onMenuClick = (handler: () => void) => {
    this.handleClose();
    handler();
  }

  handleClose = () => this.setState({
    accountMenuOpen: false,
    anchorEl: null
  })

  openAccountMenu = (e: React.MouseEvent<HTMLImageElement>) => this.setState({
    anchorEl: e.currentTarget,
    accountMenuOpen: true
  })

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
      <Fragment>
        <img
          className={this.state.accountMenuOpen ? 'user-selected' : ''}
          onClick={this.openAccountMenu}
          src={this.props.user.photoURL}
        />

        {this.state.accountMenuOpen ? this.buildUserMenu() : null}
      </Fragment>
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
        }}
      >
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
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + (rect.height / 2) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }

  onScrollEvent = () => {
    const intro = document.querySelector(`.intro #get-event-tickets-${EventbriteConfig.eventId}`);
    const footer = document.querySelector('.footer.container-wide');

    let isTicketsVisible = intro ? true : false;
    let isFooterVisible = false;

    if (intro) {
      isTicketsVisible = this.isElementInViewport(intro);
    }

    if (footer) {
      isFooterVisible = this.isElementInViewport(footer);
    }

    if (this.state.isTicketsVisible !== isTicketsVisible || this.state.isFooterVisible !== isFooterVisible) {
      this.setState({
        isTicketsVisible,
        isFooterVisible
      });
    }
  }

  buildMobileTicketsButton = () => {
    const classes = classnames('get-ticket-mobile', {
      'extended': this.state.isFooterVisible && window.innerWidth <= 550
    });

    const props = {
      id: `get-header-event-tickets-${EventbriteConfig.eventId}`,
      color: 'secondary',
      variant: this.state.isFooterVisible ? 'extended' : null
    };

    return (
      <div className={classes}>
        <Fab {...props as FabProps}>
          <LocalActivity />
          {this.state.isFooterVisible ? 'Tickets On Sale Soon' : null}
        </Fab>
      </div>
    );
  }

  buildHeaderTicketsButton = () => {
    const classes = classnames('get-tickets-header', {
      'hidden': this.state.isTicketsVisible
    });

    if (window.innerWidth > 550) {
      const props = {
        id: `get-header-event-tickets-${EventbriteConfig.eventId}`,
        color: 'secondary',
        variant: 'contained'
      };

      return (
        <div className={classes}>
          <Button {...props as ButtonProps}>
            Tickets On Sale Soon
          </Button>
        </div>
      );
    }
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
        this.props.history.push(DeloreanRoutes.SCHEDULE);
        break;
      default:
        break;
    }
  }

  render() {
    return (
      <AppBar position="sticky" className="header">
        <div className="inner container">
          <nav className="nav" >
            <Tabs
              value={this.state.route}
              onChange={this.onNavigationChanged}
              classes={{ flexContainer: 'thicc-tab', root: 'thicc-tab' }}
            >
              <Tab key="home" label="Home" />
              <Tab key="speakers" label="Speakers" />
              <Tab key="schedule" label="Schedule" />
            </Tabs>
          </nav>

          {this.buildHeaderTicketsButton()}
          {this.buildMobileTicketsButton()}

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
  auth: getFirebaseAuth(state),
  isEditMode: getIsEditMode(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  toggleEditMode,
  openConfigDialog
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Header));
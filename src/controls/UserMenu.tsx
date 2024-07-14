import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

import { Button, ClickAwayListener, Divider, MenuItem, MenuList, Paper, Popover } from '@mui/material';

import { getFirebaseAuth, getUser, getUserProfile } from 'store/current/selectors';
import { toggleEditMode } from 'store/admin/reducer';
import { toggleConfig } from 'store/config/reducer';

const UserMenu = () => {
  const dispatch = useDispatch();
  const anchorEl = useRef();

  const user = useSelector(getUser);
  const auth = useSelector(getFirebaseAuth);
  const profile = useSelector(getUserProfile);

  const [isOpen, setState] = useState(false);

  const buildMenuItems = () => {
    let items = [];

    if (profile?.admin) {
      items = items.concat(
        <MenuItem key="site-config" onClick={() => onMenuClick(toggleConfig)}>
          Site configuration
        </MenuItem>,
        <MenuItem key="toggle-edit-mode" onClick={() => onMenuClick(toggleEditMode)}>
          Toggle Edit Mode
        </MenuItem>,
        <Divider key="divider"/>
      );
    }

    return items.concat(
      <MenuItem key="sign-out" onClick={onSignout}>
        Sign out
      </MenuItem>
    );
  }

  const onGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
  }

  const onSignout = async () => {
    closeMenu();
    await auth.signOut();
    window.location.reload();
  }

  const onMenuClick = handler => {
    closeMenu();
    dispatch(handler());
  }

  const closeMenu = () => {
    setState(false);
  }

  const openMenu = () => {
    setState(true);
  }

  if (!user) {
    return (
      <Button onClick={onGoogleLogin}>
        Sign In
      </Button>
    );
  }

  return (
    <div className="login">
      <img title="Menu-Anchor" ref={anchorEl}
        className={isOpen ? 'user-selected' : ''}
        onClick={openMenu}
        src={user.photoURL}
      />
      <Popover classes={{ paper: 'user-menu' }}
        open={isOpen}
        anchorEl={anchorEl.current}
        onClose={closeMenu}
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
          <ClickAwayListener onClickAway={closeMenu}>
            <MenuList>
              {buildMenuItems()}
            </MenuList>
          </ClickAwayListener>
        </Paper>
      </Popover>
    </div>
  );
}

export default UserMenu;
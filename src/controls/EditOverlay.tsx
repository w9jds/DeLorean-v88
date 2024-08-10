import React, { FC, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classnames from 'classnames';

import { Fab, Button } from '@mui/material';
import { Add, PersonAdd, CreditCard, CalendarMonth } from '@mui/icons-material';

import CreateSponsor from 'components/editors/Sponsor';

import { openDialog } from 'store/dialogs/reducer';
import { isCreateOpen } from 'store/admin/selectors';
import { toggleCreateMenu } from 'store/admin/reducer';
import { isSpeakerEditorOpen } from 'store/speakers/selectors';
import { setSpeakerEditorOpen } from 'store/speakers/reducer';
import { isSessionEditorOpen } from 'store/sessions/selectors';
import { setSessionEditorOpen } from 'store/sessions/reducer';

import './EditOverlay.scss';

const EditOverlay: FC = () => {
  const dispatch = useDispatch();

  const isOpen = useSelector(isCreateOpen);
  const isSpeakerEditing = useSelector(isSpeakerEditorOpen);
  const isSessionEditing = useSelector(isSessionEditorOpen);

  const onCreateSponsor = () => {
    dispatch(toggleCreateMenu());
    dispatch(
      openDialog({
        views: <CreateSponsor />,
        fullscreen: false
      })
    );
  }

  const onCreateSpeaker = () => {
    dispatch(toggleCreateMenu());
    dispatch(setSpeakerEditorOpen(true));
  }

  const onCreateSession = () => {
    dispatch(toggleCreateMenu());
    dispatch(setSessionEditorOpen(true));
  }

  const actionsClass = classnames('menu-contents', {
    'hidden': !isOpen
  });

  const overlayClass = classnames('menu-overlay', {
    'hidden': !isOpen
  });

  const menuClass = classnames('fab-button', {
    'menu-open': isOpen,
    'hidden': isSpeakerEditing || isSessionEditing
  });

  return (
    <Fragment>
      <div className={overlayClass} onClick={() => dispatch(toggleCreateMenu())} />

      <div className="action-menu">
        <div className={actionsClass}>
          <Button variant="contained" className="label" onClick={onCreateSponsor}>
            Add Sponsor
          </Button>
          <Fab size="medium" color="primary" onClick={onCreateSponsor}>
            <CreditCard />
          </Fab>
        </div>
        <div className={actionsClass}>
          <Button variant="contained" className="label" onClick={onCreateSpeaker}>
            Add Speaker
          </Button>
          <Fab size="medium" color="primary" onClick={onCreateSpeaker}>
            <PersonAdd />
          </Fab>
        </div>
        <div className={actionsClass}>
          <Button variant="contained" className="label" onClick={onCreateSession}>
            Add Session
          </Button>
          <Fab size="medium" color="primary" onClick={onCreateSession} >
            <CalendarMonth />
          </Fab>
        </div>

        <Fab className={menuClass} onClick={() => dispatch(toggleCreateMenu())}>
          <Add />
        </Fab>
      </div>
    </Fragment>
  );
}

export default EditOverlay;
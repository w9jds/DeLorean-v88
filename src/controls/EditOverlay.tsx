import React, { FC, Fragment } from 'react';
import classnames from 'classnames';

import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { ApplicationState } from 'models/states';

import { Fab, Button } from '@mui/material';
import { Add, PersonAdd, CreditCard } from '@mui/icons-material';

import CreateSponsor from 'components/editors/Sponsor';

import { openDialogWindow } from 'store/dialogs/actions';
import { toggleCreateMenu, setSpeakerEditorOpen, setSessionEditorOpen } from 'store/admin/actions';
import { getIsEditMode, getIsCreateOpen, getIsSpeakerEditorOpen, getIsSessionEditorOpen } from 'store/admin/selectors';

import './EditOverlay.scss';

type EditOverlayProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps;

const EditOverlay: FC<EditOverlayProps> = ({
  isOpen,
  isSpeakerEditorOpen,
  isSessionEditorOpen,

  openDialogWindow,
  toggleCreateMenu,
  setSpeakerEditorOpen,
  setSessionEditorOpen
}) => {

  const onCreateSponsor = () => {
    toggleCreateMenu();
    openDialogWindow(<CreateSponsor />, false);
  }

  const onCreateSpeaker = () => {
    toggleCreateMenu();
    setSpeakerEditorOpen(true);
  }

  const onCreateSession = () => {
    toggleCreateMenu();
    setSessionEditorOpen(true);
  }

  const actionsClass = classnames('menu-contents', {
    'hidden': !isOpen
  });

  const overlayClass = classnames('menu-overlay', {
    'hidden': !isOpen
  });

  const menuClass = classnames('fab-button', {
    'menu-open': isOpen,
    'hidden': isSpeakerEditorOpen || isSessionEditorOpen
  });

  return (
    <Fragment>
      <div className={overlayClass} onClick={toggleCreateMenu} />

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

          </Fab>
        </div>

        <Fab className={menuClass} onClick={toggleCreateMenu}>
          <Add />
        </Fab>
      </div>
    </Fragment>
  );
}

const mapStateToProps = (state: ApplicationState) => ({
  isOpen: getIsCreateOpen(state),
  isEditMode: getIsEditMode(state),
  isSpeakerEditorOpen: getIsSpeakerEditorOpen(state),
  isSessionEditorOpen: getIsSessionEditorOpen(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  openDialogWindow,
  toggleCreateMenu,
  setSpeakerEditorOpen,
  setSessionEditorOpen
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditOverlay));
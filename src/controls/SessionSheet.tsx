import React, { FC } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { DocumentReference, deleteDoc } from '@firebase/firestore';
import renderHTML from 'react-render-html';

import { Speaker } from 'models/speaker';
import { Session, SessionTypes } from 'models/session';

import { Accordion, AccordionSummary, AccordionDetails, ListItem, ListItemText, ListItemAvatar, Divider, Typography, Avatar, Tooltip, Button, Paper } from '@mui/material';
import SpeakerDetails from 'components/dialogs/SpeakerDetails';
import { ExpandMore, Delete, Edit } from '@mui/icons-material';

import { ApplicationState } from 'models/states';
import { getIsEditMode } from 'store/admin/selectors';
import { openDialogWindow } from 'store/dialogs/actions';
import { editSession } from 'store/editors/actions';

import './SessionSheet.scss';

type SessionSheetProps = SessionSheetAttribs & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

type SessionSheetAttribs = {
  speakers: Speaker[];
  session: Session;
  reference: DocumentReference;
};

const SessionSheet: FC<SessionSheetProps> = ({
  session,
  speakers,
  isEditMode,
  reference,

  openDialogWindow,
  editSession,
}) => {

  const onSpeakerClicked = (speaker) => () => {
    openDialogWindow(<SpeakerDetails key={speaker.id} speaker={speaker} />, false);
  };

  const onDeleteClicked = async e => {
    e.preventDefault();
    e.stopPropagation();
    await deleteDoc(reference);
  };

  const onEditClicked = e => {
    e.preventDefault();
    e.stopPropagation();
    editSession(reference, session);
  };

  const buildAdminActions = () => (
    <div className="edit-actions">
      <Tooltip title="Edit" placement="top">
        <Button variant="text" className="edit" onClick={onEditClicked}>
          <Edit />
        </Button>
      </Tooltip>
      <Tooltip title="Delete" placement="top">
        <Button variant="text" className="delete" onClick={onDeleteClicked}>
          <Delete />
        </Button>
      </Tooltip>
    </div>
  );

  const formatSessionTitle = () => {
    let title = '';

    if (session.type) {
      title += `[${session.type}] `;
    }

    title += session.name;
    return title;
  };

  const formatSessionLocation = () => {
    if (!session.location) {
      return null;
    }

    if (isNaN(+session.location)) {
      return session.location;
    }

    return `Room ${session.location}`;
  };

  if (session.type === SessionTypes.BREAK || session.type === SessionTypes.REGISTRATION) {
    return (
      <Paper square className="session-card">
        {isEditMode ? buildAdminActions() : null}
        <div className="session-header">
          <Typography variant="h5">{session.name}</Typography>
          <Typography variant="subtitle1">{formatSessionLocation()}</Typography>
        </div>
      </Paper>
    );
  } else {
    return (
      <Accordion className="session">
        <AccordionSummary expandIcon={<ExpandMore />} >
          {isEditMode ? buildAdminActions() : null}
          <div className="session-header">
            <Typography variant="h5">{formatSessionTitle()}</Typography>
            <Typography variant="subtitle1">{formatSessionLocation()}</Typography>
          </div>
        </AccordionSummary>
        <AccordionDetails>
          <div className="session-content">
            {renderHTML(session.description)}

            <Divider className="divider" />

            <div className="speakers">
              <Typography variant="h6" className="header">
                Speakers
              </Typography>
              {
                speakers.map(speaker => (
                  <ListItem key={speaker.name} button onClick={onSpeakerClicked(speaker)}>
                    <ListItemAvatar>
                      <Avatar className="big-avatar" alt={speaker.name} src={speaker.portraitUrl} />
                    </ListItemAvatar>
                    <ListItemText primary={speaker.name} secondary={speaker.company || null} />
                  </ListItem>
                ))
              }
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    );
  }

};

const mapStateToProps = (state: ApplicationState) => ({
  isEditMode: getIsEditMode(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  editSession,
  openDialogWindow
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SessionSheet);
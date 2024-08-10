import React, { FC, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DocumentReference, deleteDoc } from '@firebase/firestore';
import { intervalToDuration } from 'date-fns/fp';
import createDOMPurify from 'dompurify';

import { 
  Accordion, AccordionSummary, AccordionDetails, 
  ListItem, ListItemText, ListItemAvatar, Divider, 
  Typography, Avatar, Tooltip, Button, Paper 
} from '@mui/material';

import SpeakerDetails from '../components/dialogs/Details';

import { Speaker } from 'models/speaker';
import { Session, SessionTypes } from 'models/session';
import { isEditMode } from 'store/admin/selectors';
import { openDialog } from 'store/dialogs/reducer';
import { editSession } from 'store/sessions/reducer';

import { ExpandMore, Delete, Edit } from '@mui/icons-material';

import './SessionSheet.scss';

type Props = {
  speakers: Speaker[];
  session: Session;
  reference: DocumentReference;
};

const DOMPurify = createDOMPurify(window);

const SessionSheet: FC<Props> = ({ session, speakers, reference }) => {
  const dispatch = useDispatch();
  const isEditing = useSelector(isEditMode);

  const onSpeakerClicked = (speaker) => () => {
    dispatch(
      openDialog({
        views: <SpeakerDetails key={speaker.id} speaker={speaker} />,
        fullscreen: false
      })
    );
  };

  const onDeleteClicked = async e => {
    e.preventDefault();
    e.stopPropagation();

    await deleteDoc(reference);
  };

  const onEditClicked = e => {
    e.preventDefault();
    e.stopPropagation();
    
    dispatch(editSession({
      ref: reference, 
      session
    }));
  };

  const hasDescription = useMemo(() => session.description.length > 0, [session.description]);
  const hasSpeakers = useMemo(() => session.speakers.length > 0, [session.speakers]);

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

  const buildSessionHeader = () => {
    return <div className="session-header">
      <Typography variant="h5">{formatSessionTitle()}</Typography>
      <Typography variant="subtitle1">{formatSessionLocation()}</Typography>
      <Typography variant="subtitle2">{formatSessionDuration()}</Typography>
    </div>
  }

  const formatSessionTitle = () => {
    let title = '';

    switch (session.type) {
      case SessionTypes.BREAK:
      case SessionTypes.REGISTRATION:
        break;
      default:
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

  const formatSessionDuration = () => {
    if (!session.startTime || !session.endTime) return null;

    const interval = intervalToDuration({
      start: session.startTime.toDate(),
      end: session.endTime.toDate()
    });

    if (interval.hours > 0) {
      return `${interval.hours} hr ${interval.minutes} mins`;
    } else {
      return `${interval.minutes} mins`;
    }
  }

  if (!hasDescription && !hasSpeakers) {
    return (
      <Paper square className="session-card">
        {isEditing ? buildAdminActions() : null}
        {buildSessionHeader()}
      </Paper>
    );
  } else {
    return (
      <Accordion className="session">
        <AccordionSummary expandIcon={<ExpandMore />} >
          {isEditing ? buildAdminActions() : null}
          {buildSessionHeader()}
        </AccordionSummary>
        <AccordionDetails>
          <div className="session-content">
            { hasDescription ? <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(session.description)}} /> : null }
            { hasDescription && hasSpeakers ? <Divider className="divider" /> : null }

            { hasSpeakers ?
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
              </div> : null
            }
          </div>
        </AccordionDetails>
      </Accordion>
    );
  }
};

export default SessionSheet;
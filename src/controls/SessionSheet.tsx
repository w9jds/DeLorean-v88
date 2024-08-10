import React, { FC, useMemo } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { DocumentReference, deleteDoc } from '@firebase/firestore';
import { intervalToDuration } from 'date-fns/fp';
import createDOMPurify from 'dompurify';

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

const DOMPurify = createDOMPurify(window);

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

  const hasDescription = useMemo(() => session.description.length > 0, [session.description]);
  const hasSpeakers = useMemo(() => session.speakers.length > 0, [session.speakers]);
  const hasSlides = useMemo(() => session.slidesUrl && session.slidesUrl.length > 0, [session.slidesUrl])

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

  const formatSlidesUrl = () => {
    if (!session.slidesUrl) return null;

    var text = session.slidesUrl;
    const length = 30;
    if (text.length > length) {
      text = text.substring(0, length - 3) + "..."
    }

    return (
      <a href={session.slidesUrl} target="_blank">Presentation slides</a>
    );
  }

  if (!hasDescription && !hasSpeakers && !hasSlides) {
    return (
      <Paper square className="session-card">
        {isEditMode ? buildAdminActions() : null}
        {buildSessionHeader()}
      </Paper>
    );
  } else {
    return (
      <Accordion className="session">
        <AccordionSummary expandIcon={<ExpandMore />} >
          {isEditMode ? buildAdminActions() : null}
          {buildSessionHeader()}
        </AccordionSummary>
        <AccordionDetails>
          <div className="session-content">
            { hasSlides ? <div>{formatSlidesUrl()}</div> : null }
            { hasSlides && hasDescription ? <br /> : null }
            { hasDescription ? <div dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(session.description)}} /> : null }
            { (hasDescription || hasSlides) && hasSpeakers ? <Divider className="divider" /> : null }

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

const mapStateToProps = (state: ApplicationState) => ({
  isEditMode: getIsEditMode(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  editSession,
  openDialogWindow
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SessionSheet);
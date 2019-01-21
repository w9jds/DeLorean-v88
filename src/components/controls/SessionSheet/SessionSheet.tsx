import './SessionSheet.scss';

import * as React from 'react';

import { Session } from '../../../models/session';
import { Speaker } from '../../../models/speaker';

import { 
    ExpansionPanel, 
    ExpansionPanelSummary, 
    ExpansionPanelDetails, 
    ListItem, ListItemText, 
    ListItemAvatar, Divider,
    Typography, Avatar, Tooltip, Button
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import renderHTML from 'react-render-html';
import { DocumentReference } from '@firebase/firestore-types';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ApplicationState } from '../../..';
import { getIsEditMode } from '../../../ducks/admin';
import { editSession } from '../../../sagas/editor';
import { Delete, Edit } from '@material-ui/icons';
import SpeakerDetails from '../../dialogs/SpeakerDetails/SpeakerDetails';
import { openDialogWindow } from '../../../ducks/dialogs';

type SessionSheetProps = SessionSheetAttribs & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

type SessionSheetAttribs = {
    speakers: Speaker[];
    session: Session;
    reference: DocumentReference;
};

const SessionSheet = (props: SessionSheetProps) => {
    const {session, speakers, isEditMode} = props;

    const buildSpeakerChips = () => {
        return speakers.map(speaker => (
            <ListItem key={speaker.name} button onClick={onSpeakerClicked(speaker)}>
                <ListItemAvatar>
                    <Avatar className="big-avatar" alt={speaker.name} src={speaker.portraitUrl} />
                </ListItemAvatar>
                <ListItemText primary={speaker.name} secondary={speaker.company || null} />
            </ListItem>
        ));
    };

    const onSpeakerClicked = (speaker) => () => {
        props.openDialogWindow(<SpeakerDetails key={speaker.id} speaker={speaker} />, false);
    };

    const onDeleteClicked = () => {
        props.reference.delete();
    };

    const onEditClicked = () => {
        props.editSession(props.reference, props.session);
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
            return 'To be determined';
        }

        if (isNaN(+session.location)) {
            return session.location;
        }

        return `Room ${session.location}`;
    };

    return (
        <ExpansionPanel className="session">
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} >
                {isEditMode ? buildAdminActions() : null}
                <div className="session-header">
                    <Typography variant="h5">{formatSessionTitle()}</Typography>
                    <Typography variant="subtitle1">{formatSessionLocation()}</Typography>
                </div>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
                <div className="session-content">
                    {renderHTML(session.description)}
                    
                    <Divider className="divider" />

                    <div className="speakers">
                        <Typography variant="h6" className="header">
                            Speakers
                        </Typography>

                        {buildSpeakerChips()}
                    </div>
                </div>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
};

const mapStateToProps = (state: ApplicationState) => ({
    isEditMode: getIsEditMode(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    editSession, openDialogWindow
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SessionSheet);
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
    Typography, Avatar
} from '@material-ui/core';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import renderHTML from 'react-render-html';
import { DocumentSnapshot } from '@firebase/firestore-types';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { ApplicationState } from '../../..';
import { getIsEditMode } from '../../../ducks/admin';
import { editSession } from '../../../sagas/editor';

type SessionSheetProps = SessionSheetAttribs & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

type SessionSheetAttribs = {
    speakers: Speaker[];
    session: Session;
    document: DocumentSnapshot;
};

const SessionSheet = (props: SessionSheetProps) => {
    const {session, speakers} = props;

    const buildSpeakerChips = () => {
        return speakers.map(speaker => (
            <ListItem key={speaker.name} button>
                <ListItemAvatar>
                    <Avatar className="big-avatar" alt={speaker.name} src={speaker.portraitUrl} />
                </ListItemAvatar>
                <ListItemText primary={speaker.name} secondary={speaker.company || null} />
            </ListItem>
        ));
    };

    const buildActions = () => {
        return null;
    };

    return (
        <ExpansionPanel className="session">
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} >
                <div className="session-header">
                    <Typography variant="h5">{session.name}</Typography>
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

                    {buildActions()}
                </div>
            </ExpansionPanelDetails>
        </ExpansionPanel>
    );
};

const mapStateToProps = (state: ApplicationState) => ({
    isEditMode: getIsEditMode(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    editSession
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SessionSheet);
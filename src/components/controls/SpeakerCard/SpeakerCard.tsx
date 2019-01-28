import './SpeakerCard.scss';

import anime from 'animejs';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import classnames from 'classnames';

import { Speaker } from '../../../../models/speaker';

import { Card, Typography, Button, Tooltip } from '@material-ui/core';
import { Delete, Edit } from '@material-ui/icons';

import { getIsEditMode } from '../../../ducks/admin';
import { DocumentReference } from '@firebase/firestore-types';
import { Dispatch, bindActionCreators } from 'redux';
import { editSpeaker } from '../../../sagas/editor';
import { openDialogWindow } from '../../../ducks/dialogs';
import SpeakerDetails from '../../dialogs/SpeakerDetails/SpeakerDetails';
import { ApplicationState } from '../../../../models/states';

type SpeakerCardProps = SpeakerCardAttribs & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

type SpeakerCardAttribs = {
    speaker: Speaker;
    documentRef: DocumentReference;
    index: number;
};

class SpeakerCard extends React.Component<SpeakerCardProps> {

    componentDidMount() {
        window.setTimeout(() => {
            /**
             * Push the animation to the back of the event queue to ensure that
             * react has finished adding the DOMNode.
             */
            anime({
                targets: ReactDOM.findDOMNode(this),
                translateY: [200, 0],
                opacity: [0, 1],
                delay: 100 * (this.props.index + 1),
                duration: 750
            });
        }, 0);
    }

    onSpeakerClicked = () => {
        this.props.openDialogWindow(<SpeakerDetails speaker={this.props.speaker} />, false);
    }

    onDeleteClicked = e => {
        const { documentRef } = this.props;
        documentRef.delete();
    }

    onEditClicked = e => {
        const { documentRef, speaker, editSpeaker } = this.props;

        editSpeaker(documentRef, speaker);
    }

    buildSubTitle = () => {
        const {company, title} = this.props.speaker;
        let subTitle = '';

        if (company && title) {
            subTitle = `${title} @ ${company}`;
        } else if (title) {
            subTitle = `${title}`;
        } else if (company) {
            subTitle = `${company}`;
        }

        if (subTitle) {
            return (
                <Typography variant="subtitle1" >
                    {subTitle}
                </Typography>
            );
        }

        return null;
    }

    buildActionButtons = () => {
        if (this.props.isEditMode) {
            return (
                <React.Fragment>
                    <Tooltip title="Edit" placement="top">
                        <Button variant="text" className="action edit" onClick={this.onEditClicked}>
                            <Edit />
                        </Button>
                    </Tooltip>
                    <Tooltip title="Delete" placement="top">
                        <Button variant="text" className="action delete" onClick={this.onDeleteClicked}>
                            <Delete />
                        </Button>
                    </Tooltip>
                </React.Fragment>
            );
        }

        return null;
    }

    render() {
        const {speaker} = this.props;
        const classes = classnames('speaker-card');

        return (
            <React.Fragment>
                <Card className={classes} onClick={this.onSpeakerClicked}>
                    {this.buildActionButtons()}
                    <div className="header">
                        <img className="portrait-image portrait-avatar" src={speaker.portraitUrl} />
                    </div>
                    <div className="content">
                        <Typography variant="h6">{speaker.name}</Typography>
                        {this.buildSubTitle()}
                    </div>
                </Card>
            </React.Fragment>
        );
    }

}

const mapStateToProps = (state: ApplicationState) => ({
    isEditMode: getIsEditMode(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    editSpeaker, openDialogWindow
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SpeakerCard);
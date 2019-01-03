import * as React from 'react';
import classnames from 'classnames';

import { connect } from 'react-redux';
import { ApplicationState } from '../../..';
import { bindActionCreators, Dispatch } from 'redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import Fab from '@material-ui/core/Fab';
import { Add, PersonAdd, CreditCard } from '@material-ui/icons';
import CreateSponsor from '../../dialogs/Sponsor/Sponsor';

import { openDialogWindow } from '../../../ducks/dialogs';
import Button from '@material-ui/core/Button';
import { getIsEditMode, getIsCreateOpen, toggleCreateMenu, getIsSpeakerEditorOpen, setSpeakerEditorOpen } from '../../../ducks/admin';

type EditOverlayProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps;

class EditOverlay extends React.Component<EditOverlayProps> {

    onCreateSponsor = () => {
        this.props.toggleCreateMenu();
        this.props.openDialogWindow(<CreateSponsor />, false);
    }

    onCreateSpeaker = () => {
        this.props.toggleCreateMenu();
        this.props.setSpeakerEditorOpen(true);
    }

    buildActions = () => {
        const { isOpen } = this.props;
        const actionsClass = classnames('menu-contents', {
            'hidden': !isOpen
        });

        return (
            <React.Fragment>
                <div className={actionsClass}>
                    <Button variant="contained" className="label" onClick={this.onCreateSponsor}>
                        Add Sponsor
                    </Button>
                    <Fab size="medium" color="primary" onClick={this.onCreateSponsor}>
                        <CreditCard />
                    </Fab>
                </div>
                <div className={actionsClass}>
                    <Button variant="contained" className="label" onClick={this.onCreateSpeaker}>
                        Add Speaker
                    </Button>
                    <Fab size="medium" color="primary" onClick={this.onCreateSpeaker}>
                        <PersonAdd />
                    </Fab>
                </div>
            </React.Fragment>
        );
    }

    render() {
        const { isOpen, isSpeakerEditorOpen } = this.props;
        const overlayClass = classnames('menu-overlay', {
            'hidden': !isOpen
        });
        const menuClass = classnames('fab-button', {
            'menu-open': isOpen,
            'hidden': isSpeakerEditorOpen
        });

        return (
            <React.Fragment>
                <div className={overlayClass} onClick={this.props.toggleCreateMenu} />

                <div className="action-menu">
                    {this.buildActions()}

                    <Fab className={menuClass} onClick={this.props.toggleCreateMenu}>
                        <Add />
                    </Fab>
                </div>
            </React.Fragment>

        );
    }
}

const mapStateToProps = (state: ApplicationState) => ({
    isOpen: getIsCreateOpen(state),
    isEditMode: getIsEditMode(state),
    isSpeakerEditorOpen: getIsSpeakerEditorOpen(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    openDialogWindow, toggleCreateMenu, setSpeakerEditorOpen
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditOverlay));
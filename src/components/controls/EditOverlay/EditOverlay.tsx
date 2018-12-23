import * as React from 'react';
import classnames from 'classnames';

import { connect } from 'react-redux';
import { ApplicationState } from '../../..';
import { bindActionCreators, Dispatch } from 'redux';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import Fab from '@material-ui/core/Fab';
import { Add } from '@material-ui/icons';
import CreateSponsor from '../../dialogs/Sponsor/Sponsor';

import { openDialogWindow } from '../../../ducks/dialogs';
import Button from '@material-ui/core/Button';
import { getIsEditMode, getIsCreateOpen, toggleCreateMenu, toggleSponsorEditor } from '../../../ducks/admin';

type EditOverlayProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps;

class EditOverlay extends React.Component<EditOverlayProps> {

    constructor(props: EditOverlayProps) {
        super(props);

    }

    onCreateSponsor = () => {
        this.props.toggleCreateMenu();
        this.props.openDialogWindow(<CreateSponsor />, false);
    }

    onCreateSpeaker = () => {
        this.props.toggleCreateMenu();
        this.props.toggleSponsorEditor();
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
                    <Fab size="medium" color="primary" onClick={this.onCreateSponsor} />
                </div>
                <div className={actionsClass}>
                    <Button variant="contained" className="label" onClick={this.onCreateSpeaker}>
                        Add Speaker
                    </Button>
                    <Fab size="medium" color="primary" onClick={this.onCreateSpeaker}/>
                </div>
            </React.Fragment>
        );
    }

    render() {
        const { isOpen } = this.props;
        const overlayClass = classnames('menu-overlay', {
            'hidden': !isOpen
        });
        const menuClass = classnames('fab-button', {
            'menu-open': isOpen
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
    isEditMode: getIsEditMode(state),
    isOpen: getIsCreateOpen(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    openDialogWindow, toggleCreateMenu, toggleSponsorEditor
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditOverlay));
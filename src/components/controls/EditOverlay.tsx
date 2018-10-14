import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../..';
import { bindActionCreators, Dispatch } from 'redux';

import { Add } from '@material-ui/icons';
import Button from '@material-ui/core/Button';

import CreateSponsor from '../dialogs/create/Sponsor';

import { openDialogWindow } from '../../ducks/dialogs';
import { getIsEditMode } from '../../selectors/current';
import { withRouter, RouteComponentProps } from 'react-router-dom';

type EditOverlayProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & RouteComponentProps;

class EditOverlay extends React.Component<EditOverlayProps> {

    constructor(props: EditOverlayProps) {
        super(props);

    }

    onAddClick = () => {
        // this.props.location.

        this.props.openDialogWindow(
            <CreateSponsor />,
            false
        );
    }

    render() {
        return (
            <div className="overlay">
                <div className="container fab-container">
                    <Button className="edit-fab" variant="fab"
                        onClick={this.onAddClick}>
                        <Add />
                    </Button>
                </div>
            </div>
        );
    }

}

const mapStateToProps = (state: ApplicationState) => ({
    isEditMode: getIsEditMode(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    openDialogWindow
}, dispatch);

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EditOverlay));
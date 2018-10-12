import * as React from 'react';
import { connect } from 'react-redux';
import { ApplicationState } from '../..';

import { getIsEditMode } from '../../selectors/current';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import { Add } from '@material-ui/icons';
import Button from '@material-ui/core/Button';

type EditOverlayProps = ReturnType<typeof mapStateToProps> & RouteComponentProps;

class EditOverlay extends React.Component<EditOverlayProps> {

    constructor(props: EditOverlayProps) {
        super(props);

    }

    render() {
        return (
            <Button className="edit-fab" variant="fab">
                <Add />
            </Button>
        );
    }

}

const mapStateToProps = (state: ApplicationState) => ({
    isEditMode: getIsEditMode(state)
});

export default withRouter(connect(mapStateToProps)(EditOverlay));
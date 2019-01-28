import * as React from 'react';

import Dialog from '@material-ui/core/Dialog';

import { connect } from 'react-redux';
import { withStyles, WithStyles, StyleRules } from '@material-ui/core/styles';
import { isDialogVisible, getDialogViews, isDialogFullscreen } from '../../ducks/dialogs';
import { ApplicationState } from '../../../models/states';

const styleSheet: StyleRules = {
    paper: {
        minWidth: '50vw',
        overflow: 'visible'
    }
};

type DialogWindowProps = WithStyles<typeof styleSheet> & ReturnType<typeof mapStateToProps>;

const UniversalDialog = (props: DialogWindowProps) => {
    let { visible, classes, fullscreen } = props;

    return (
        <Dialog fullScreen={fullscreen} open={visible} classes={{ paper: classes.paper }}>
            {props.views ? props.views : <div/>}
        </Dialog>
    );
};

const mapStateToProps = (state: ApplicationState) => ({
    visible: isDialogVisible(state),
    views: getDialogViews(state),
    fullscreen: isDialogFullscreen(state)
});

export default withStyles(styleSheet)(connect(mapStateToProps)(UniversalDialog));

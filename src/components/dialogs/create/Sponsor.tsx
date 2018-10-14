import * as React from 'react';
import { ApplicationState } from '../../..';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { WithStyles, withStyles, StyleRulesCallback } from '@material-ui/core/styles';

import Dropzone from 'react-dropzone';
import { getFirestore } from '../../../selectors/current';
import { closeDialogWindow } from '../../../ducks/dialogs';

const stylesheet: StyleRulesCallback = theme => ({
    formControl: {
        margin: theme.spacing.unit,
        width: '75%',
        minWidth: '120px'
    },
    sponsorDetails: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: 'auto',
        marginBottom: 'auto'
    }
});

type SponsorDialogProps = WithStyles<typeof stylesheet> & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

interface SponsorDialogState {
    name?: string;
    site?: string;
}

class SponsorDialog extends React.Component<SponsorDialogProps, SponsorDialogState> {

    constructor(props: SponsorDialogProps) {
        super(props);

        this.state = {
            name: '',
            site: ''
        };

    }

    onSettingChange = (e, name: string) => this.setState({
        [name]: e.target.value
    })

    onSaveSponsor = () => {

        this.props.closeDialogWindow();
    }

    render() {
        const { classes, closeDialogWindow } = this.props;

        return (
            <React.Fragment>
                <DialogTitle id="responsive-dialog-title">{'Create New Sponsor'}</DialogTitle>
                <DialogContent>

                    <div className="create-sponsor-form">
                        <Dropzone className="drag-drop-logo">
                            <p>Drop sponsor logo</p>
                        </Dropzone>

                        <div className="sponsor-details">
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="name">Name</InputLabel>
                                <Input id="name" value={this.state.name} onChange={e => this.onSettingChange(e, 'name')} />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="site">Site</InputLabel>
                                <Input id="site" value={this.state.site} onChange={e => this.onSettingChange(e, 'site')} />
                            </FormControl>
                        </div>
                    </div>

                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialogWindow}>Cancel</Button>
                    <Button onClick={this.onSaveSponsor} color="primary" autoFocus>Save</Button>
                </DialogActions>
            </React.Fragment>
        );
    }

}

const mapStateToProps = (state: ApplicationState) => ({
    firestore: getFirestore(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    closeDialogWindow
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(stylesheet)(SponsorDialog));
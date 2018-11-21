import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';

import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import { WithStyles, withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import { UploadTaskSnapshot } from '@firebase/storage-types';

import { ApplicationState } from '../../..';
import { getFirestore, getFirebaseApp } from '../../../ducks/current';
import { closeDialogWindow } from '../../../ducks/dialogs';

import Dropzone from 'react-dropzone';

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
    file?: {
        preview: string;
        contents: File;
    };
}

class SponsorDialog extends React.Component<SponsorDialogProps, SponsorDialogState> {

    constructor(props: SponsorDialogProps) {
        super(props);

        this.state = {
            name: '',
            site: '',
            file: null
        };

    }

    onSettingChange = (e, name: string) => this.setState({
        [name]: e.target.value
    })

    onFileLoaded = (preview: string, file: File) => this.setState({
        file: { preview, contents: file }
    })

    onSaveSponsor = async () => {
        let storage = this.props.firebase.storage().ref('sponsors');
        let sponsor = await this.props.firestore.doc(`/sponsors/${this.state.name}`).get();

        if (!sponsor.exists && this.state.name && this.state.site && this.state.file) {
            storage.child(this.state.name)
                .put(this.state.file.contents)
                .then(this.onImageStored);
        }
    }

    onImageStored = async (task: UploadTaskSnapshot) => {
        await this.props.firestore.doc(`/sponsors/${this.state.name}`).set({
            name: this.state.name,
            siteUrl: this.state.site,
            logoUrl: await task.ref.getDownloadURL()
        });

        this.props.closeDialogWindow();
    }

    onFileDrop = (accepted, rejected, e: React.DragEvent<HTMLDivElement>) => {
        if (accepted && accepted.length > 0 && e.dataTransfer.files.length > 0) {
            this.onFileLoaded(accepted[0].preview, e.dataTransfer.files[0]);
        }
    }

    buildDropZone = () => {
        if (!this.state.file) {
            return (
                <Dropzone onDrop={this.onFileDrop} className="drag-drop-logo">
                    <p>Drop sponsor logo</p>
                </Dropzone>
            );
        }

        return (
            <div className="drag-drop-preview">
                <div>
                    <img src={this.state.file.preview} />
                </div>
            </div>
        );
    }

    render() {
        const { classes, closeDialogWindow } = this.props;

        return (
            <React.Fragment>
                <DialogTitle id="responsive-dialog-title">{'Create New Sponsor'}</DialogTitle>
                <DialogContent>

                    <div className="create-sponsor-form">
                        {this.buildDropZone()}

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
    firestore: getFirestore(state),
    firebase: getFirebaseApp(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    closeDialogWindow
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(stylesheet)(SponsorDialog));
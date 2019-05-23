import './SponsorEditor.scss';

import * as React from 'react';
import classnames from 'classnames';
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

import { getFirestore, getFirebaseApp } from '../../ducks/current';
import { closeDialogWindow } from '../../ducks/dialogs';

import Dropzone from 'react-dropzone';
import { ApplicationState } from '../../../models/states';

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
        metadata: File;
        preview: string;
        contents: ArrayBuffer;
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

    onSaveSponsor = async () => {
        let storage = this.props.firebase.storage().ref('sponsors');
        let sponsor = await this.props.firestore.doc(`/sponsors/${this.state.name}`).get();

        if (!sponsor.exists && this.state.name && this.state.site && this.state.file) {
            storage.child(this.state.name)
                .put(this.state.file.contents, {
                    contentType: this.state.file.metadata.type
                })
                .then(this.onImageStored);
        }
    }

    onImageStored = async (task: UploadTaskSnapshot) => {
        await this.props.firestore.doc(`/sponsors/${this.state.name}`).set({
            name: this.state.name,
            siteUri: this.state.site,
            logoUri: await task.ref.getDownloadURL()
        });

        this.props.closeDialogWindow();
    }

    onFileDrop = files => {
        if (files.length > 0 && files[0].type.startsWith('image')) {
            const reader = new FileReader();

            reader.onload = () => this.setState({
                file: {
                    metadata: files[0],
                    preview: URL.createObjectURL(files[0]),
                    contents: reader.result as ArrayBuffer
                }
            });

            reader.onabort = () => console.error('file reading was aborted');
            reader.onerror = () => console.error('file reading has failed');

            reader.readAsArrayBuffer(files[0]);
        }
    }

    dropZoneRender = ({ getRootProps, getInputProps, isDragActive }) => {
        return (
            <div {...getRootProps()} className={classnames('dropzone', 'drag-drop-logo', {'dropzone--isActive': isDragActive})}>
                <input {...getInputProps()} />
                <p>Drop sponsor logo</p>
            </div>
        );
    }

    buildDropZone = () => {
        if (!this.state.file) {
            return (
                <Dropzone accept="image/*" onDrop={this.onFileDrop}>
                    {this.dropZoneRender}
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
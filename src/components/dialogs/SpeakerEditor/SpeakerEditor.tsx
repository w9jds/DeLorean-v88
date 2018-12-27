import './SpeakerEditor.scss';

import * as React from 'react';
import classnames from 'classnames';

import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';

import { Close, Face } from '@material-ui/icons';
import { WithStyles, withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import { DocumentSnapshot } from '@firebase/firestore-types';

import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/modern/theme';
import '../../../stylesheets/modern-dark/content.min.css';
import '../../../stylesheets/modern-dark/skin.min.css';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/advlist';

import { Dispatch, bindActionCreators } from 'redux';
import { getFirestore, getFirebaseApp } from '../../../ducks/current';
import { ApplicationState } from '../../..';
import { getIsSpeakerEditorOpen, toggleSponsorEditor } from '../../../ducks/admin';
import { closeConfigDialog } from '../../../ducks/config';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import { UploadTaskSnapshot } from '@firebase/storage-types';

const Transition = (props) => <Slide direction="up" {...props} />;
const styleSheet: StyleRulesCallback = theme => ({
    appBar: {
        position: 'relative'
    },
    fullscreen: {
        padding: '0 !important',
        margin: '0 !important'
    },
    dialogForm: {
        display: 'flex',
        flexFlow: 'column',
        padding: '20px'
    },
    flex: {
        flex: 1,
        textAlign: 'center'
    },
    headerFields: {
        width: '50%',
        margin: 'auto 0'
    },
    formControl: {
        margin: theme.spacing.unit,
        display: 'block'
    }
});

type SpeakerEditorProps = WithStyles<typeof styleSheet> & SpeakerEditorAttrs & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

type EditableTypes = 'medium'
    | 'name'
    | 'company'
    | 'twitter'
    | 'github'
    | 'facebook'
    | 'linkedin'
    | 'blog';

type SpeakerEditorState = {
    name: string,
    company: string,
    featured: boolean,
    file: {
        metadata: File,
        contents: ArrayBuffer,
        preview: string
    },
    twitter?: string,
    github?: string,
    facebook?: string,
    medium?: string,
    linkedin?: string,
    blog?: string,
    errors: string[]
};

type SpeakerEditorAttrs = {
    speaker?: DocumentSnapshot;
};

class SpeakerEditor extends React.PureComponent<SpeakerEditorProps, SpeakerEditorState> {

    private editor;

    constructor(props: SpeakerEditorProps) {
        super(props);

        this.state = {
            name: '',
            company: '',
            file: undefined,
            featured: false,
            errors: []
        };
    }

    componentDidUpdate(prevProps: SpeakerEditorProps) {
        if (!prevProps.isOpen && this.props.isOpen) {
            /**
             * Push the initialize to the back of the event queue to ensure that
             * react has finished adding the dialog to the DOM.
             */
            setTimeout(this.initTinyMce, 0);
        }

        if (prevProps.isOpen && !this.props.isOpen) {
            tinymce.remove('textarea.bio-editor');
        }
    }

    initTinyMce = () => {
        this.editor = tinymce.init({
            selector: 'textarea.bio-editor',
            skin: 'modern-dark',
            plugins: [ 'autolink', 'lists', 'advlist' ],
            menubar: false,
            statusbar: false,
            toolbar: 'undo redo | bold italic underline strikethrough | bullist numlist | outdent indent'
        });
    }

    isSpeakerValid = () => {
        let errors = [];

        if (!this.state.name) {
            errors.push('name');
        }

        if (!this.state.file) {
            errors.push('portrait');
        }

        if (errors.length > 0) {
            this.setState({ errors });
        }

        return errors.length == 0;
    }

    onSaveClicked = () => {
        if (this.isSpeakerValid()) {
            let storage = this.props.firebase.storage().ref('speakers');

            storage.child(this.state.name.replace(' ', '_'))
                .put(this.state.file.contents, {
                    contentType: this.state.file.metadata.type
                })
                .then(this.onImageStored);
        }
    }

    onImageStored = async (task: UploadTaskSnapshot) => {
        this.props.firestore.collection('/speakers').add({
            name: this.state.name,
            company: this.state.company || null,
            twitter: this.state.twitter || null,
            github: this.state.github || null,
            facebook: this.state.facebook || null,
            medium: this.state.medium || null,
            linkedin: this.state.linkedin || null,
            portraitUrl: await task.ref.getDownloadURL(),
            featured: this.state.featured,
            blog: this.state.blog || null,
            bio: tinymce.activeEditor.getContent()
        });

        this.clearForm();
        this.props.toggleSponsorEditor();
    }

    clearForm = () => {
        this.setState({
            name: '',
            company: '',
            featured: false,
            file: undefined,
            twitter: undefined,
            github: undefined,
            facebook: undefined,
            medium: undefined,
            linkedin: undefined,
            blog: undefined,
            errors: []
        });
    }

    onValueChanged = (name: EditableTypes) =>
        (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => this.setState({
            [name]: e.target.value
        } as Pick<SpeakerEditorState, EditableTypes>)

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
        const { file } = this.state;

        return (
            <div {...getRootProps()} className={classnames('dropzone', 'editor-portrait', {'dropzone--isActive': isDragActive})}>
                <input {...getInputProps()} />
                {file && file.preview ? <img src={file.preview} className="portrait-image" /> : <Face />}
            </div>
        );
    }

    buildFieldInput = (id: EditableTypes) => {
        const { errors } = this.state;

        return (
            <Input id={id}
                error={errors.indexOf(id) >= 0}
                value={this.state[id]}
                onChange={this.onValueChanged(id)} />
        );
    }

    render() {
        const { classes, isOpen, toggleSponsorEditor } = this.props;

        return(
            <Dialog fullScreen
                open={isOpen}
                TransitionComponent={Transition}
                classes={{ paperFullScreen: classes.fullscreen }}>

                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton color="inherit" aria-label="Close" onClick={toggleSponsorEditor}>
                            <Close />
                        </IconButton>
                        <Typography variant="h6" color="inherit" className={classes.flex}>
                            Speaker Editor
                        </Typography>
                        <Button color="inherit" onClick={this.onSaveClicked}>save</Button>
                    </Toolbar>
                </AppBar>

                <DialogContent>
                    <div className="editor-profile-header">
                        <Dropzone accept="image/*" onDrop={this.onFileDrop} >
                            {this.dropZoneRender}
                        </Dropzone>

                        <div className="field-containers">
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="name">Name</InputLabel>
                                {this.buildFieldInput('name')}
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="company">Company</InputLabel>
                                {this.buildFieldInput('company')}
                            </FormControl>
                        </div>
                        <div className="field-containers">
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="twitter">Twitter Handle</InputLabel>
                                {this.buildFieldInput('twitter')}
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="github">Github Username</InputLabel>
                                {this.buildFieldInput('github')}
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="facebook">Facebook Username</InputLabel>
                                {this.buildFieldInput('facebook')}
                            </FormControl>
                        </div>
                        <div className="field-containers">
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="medium">Medium Username</InputLabel>
                                {this.buildFieldInput('medium')}
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="linkedin">LinkedIn Username</InputLabel>
                                {this.buildFieldInput('linkedin')}
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="blog">Blog Url</InputLabel>
                                {this.buildFieldInput('blog')}
                            </FormControl>
                        </div>
                    </div>

                    <FormControl className={classes.formControl}>
                        <textarea className="bio-editor" />
                    </FormControl>
                </DialogContent>
            </Dialog>
        );
    }

}

const mapStateToProps = (state: ApplicationState) => ({
    isOpen: getIsSpeakerEditorOpen(state),
    firestore: getFirestore(state),
    firebase: getFirebaseApp(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    closeConfigDialog, toggleSponsorEditor
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(SpeakerEditor));
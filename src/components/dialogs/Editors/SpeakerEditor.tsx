import './SpeakerEditor.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Dispatch, bindActionCreators } from 'redux';
import Dropzone from 'react-dropzone';

import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';

import { Close, Face } from '@material-ui/icons';
import { WithStyles, withStyles, StyleRulesCallback } from '@material-ui/core/styles';

import { DocumentSnapshot } from '@firebase/firestore-types';
import { UploadTaskSnapshot } from '@firebase/storage-types';

import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/silver';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/advlist';

import { SpeakerEditorState, Speaker } from '../../../../models/speaker';
import { getFirestore, getFirebaseApp } from '../../../ducks/current';
import { closeConfigDialog } from '../../../ducks/config';
import { getEditorState } from '../../../ducks/speaker';
import { getIsSpeakerEditorOpen, setSpeakerEditorOpen } from '../../../ducks/admin';
import { ApplicationState } from '../../../../models/states';

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

enum ErrorTypes {
    PORTRAIT = 'portrait',
    NAME = 'name'
}

type EditableTypes = 'medium'
    | 'name'
    | 'title'
    | 'company'
    | 'twitter'
    | 'github'
    | 'facebook'
    | 'linkedin'
    | 'blog';

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
            title: '',
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
            this.setState(this.props.initState);
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
            extended_valid_elements : 'span[!class]',
            invalid_styles: 'color font-size font-family background-color',
            toolbar: 'undo redo | bold italic underline strikethrough | bullist numlist | outdent indent'
        });

        tinymce.activeEditor.setContent(this.props.initState.bio);
    }

    isSpeakerValid = () => {
        let errors = [];

        if (!this.state.name) {
            errors.push(ErrorTypes.NAME);
        }

        if (!this.state.file) {
            errors.push(ErrorTypes.PORTRAIT);
        }

        if (errors.length > 0) {
            this.setState({ errors });
        }

        return errors.length == 0;
    }

    onSaveClicked = () => {
        const { initState } = this.props;
        const storage = this.props.firebase.storage().ref('speakers');

        if (this.isSpeakerValid()) {
            if (!initState || !initState.ref) {
                storage.child(this.state.name.replace(' ', '_'))
                    .put(this.state.file.contents, { contentType: this.state.file.metadata.type })
                    .then(this.createSpeaker);
            }
            else if (this.state.file.contents) {
                storage.child(this.state.name.replace(' ', '_'))
                    .put(this.state.file.contents, {contentType: this.state.file.metadata.type })
                    .then(this.updateSpeaker);
            }
            else {
                this.updateSpeaker();
            }
        }
    }

    buildChanges = () => ({
        name: this.state.name.trim(),
        title: this.state.title ? this.state.title.trim() : null,
        company: this.state.company ? this.state.company.trim() : null,
        twitter: this.state.twitter ? this.state.twitter.trim() : null,
        github: this.state.github ? this.state.github.trim() : null,
        facebook: this.state.facebook ? this.state.facebook.trim() : null,
        medium: this.state.medium ? this.state.medium.trim() : null,
        linkedin: this.state.linkedin ? this.state.linkedin.trim() : null,
        featured: this.state.featured,
        blog: this.state.blog ? this.state.blog.trim() : null,
        bio: tinymce.activeEditor.getContent()
    })

    updateSpeaker = async (task?: UploadTaskSnapshot) => {
        const { initState } = this.props;
        let changes: Speaker = {
            ...this.buildChanges(),
            portraitUrl: initState.file.preview
        };

        if (task) {
            changes.portraitUrl = await task.ref.getDownloadURL();
        }

        initState.ref.update(changes);
        this.closeSpeakerEditor();
    }

    createSpeaker = async (task: UploadTaskSnapshot) => {
        this.props.firestore.collection('/speakers').add({
            ...this.buildChanges(),
            portraitUrl: await task.ref.getDownloadURL()
        });

        this.closeSpeakerEditor();
    }

    closeSpeakerEditor = () => this.props.setSpeakerEditorOpen(false);

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
        const style = classnames('dropzone', 'editor-portrait', {
            'dropzone--isActive': isDragActive,
            'portrait-error': this.state.errors.indexOf(ErrorTypes.PORTRAIT) > -1
        });

        return (
            <div {...getRootProps()} className={style}>
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
        const { classes, isOpen } = this.props;

        return(
            <Dialog fullScreen
                open={isOpen}
                TransitionComponent={Transition}
                classes={{ paperFullScreen: classes.fullscreen }}>

                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton color="inherit" aria-label="Close" onClick={this.closeSpeakerEditor}>
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
                                <InputLabel htmlFor="title">Title</InputLabel>
                                {this.buildFieldInput('title')}
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
    firebase: getFirebaseApp(state),
    initState: getEditorState(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    closeConfigDialog, setSpeakerEditorOpen
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(SpeakerEditor));
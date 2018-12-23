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

import CloseIcon from '@material-ui/icons/Close';
import { WithStyles, withStyles, StyleRulesCallback } from '@material-ui/core/styles';
import { DocumentSnapshot } from '@firebase/firestore-types';

import tinymce from 'tinymce/tinymce';
import 'tinymce/plugins/autolink';
import 'tinymce/skins/lightgray/content.min.css';
import 'tinymce/skins/lightgray/skin.min.css';

import { Dispatch, bindActionCreators } from 'redux';
import { getFirestore } from '../../../ducks/current';
import { ApplicationState } from '../../..';
import { getIsSpeakerEditorOpen, toggleSponsorEditor } from '../../../ducks/admin';
import { closeConfigDialog } from '../../../ducks/config';
import { connect } from 'react-redux';
import Dropzone from 'react-dropzone';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';

const Transition = (props) => <Slide direction="up" {...props} />;
const styleSheet: StyleRulesCallback = theme => ({
    appBar: {
        position: 'relative'
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
    blog?: string
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
            featured: false
        };
    }

    componentDidMount() {
        this.editor = tinymce.init({
            selector: 'div.bio-editor .editor',
            theme: 'modern',
            plugins: [ 'autolink' ]
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
        return (
            <div {...getRootProps()} className={classnames('dropzone', 'drag-drop-logo', {'dropzone--isActive': isDragActive})}>
                <input {...getInputProps()} />
                <p>Drop sponsor logo</p>
            </div>
        );
    }

    render() {
        const { classes, isOpen, toggleSponsorEditor } = this.props;

        return(
            <Dialog fullScreen open={isOpen} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <IconButton color="inherit" aria-label="Close" onClick={toggleSponsorEditor}>
                            <CloseIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" className={classes.flex}>
                            Speaker Editor
                        </Typography>
                        <Button color="inherit" >save</Button>
                    </Toolbar>
                </AppBar>

                <DialogContent>
                    <div className="editor-profile-header">
                        <Dropzone accept="image/*" onDrop={this.onFileDrop} >
                            {this.dropZoneRender}
                        </Dropzone>

                        <div>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="name">Name</InputLabel>
                                <Input id="name" value={this.state.name} onChange={this.onValueChanged('name')} />
                            </FormControl>
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="company">Company</InputLabel>
                                <Input id="company" value={this.state.company} onChange={this.onValueChanged('company')} />
                            </FormControl>
                        </div>
                    </div>

                    <FormControl>
                        <FormControl>
                            <InputLabel htmlFor="twitter">Twitter Handle</InputLabel>
                            <Input id="twitter" value={this.state.twitter} onChange={this.onValueChanged('twitter')} />
                        </FormControl>
                        <FormControl>
                            <InputLabel htmlFor="github">Github Username</InputLabel>
                            <Input id="github" value={this.state.github} onChange={this.onValueChanged('github')} />
                        </FormControl>
                    </FormControl>

                    <FormControl className={classes.formControl}>
                        <div className="bio-editor">
                            <div className="editor" />
                        </div>
                    </FormControl>
                </DialogContent>
            </Dialog>
        );
    }

}

const mapStateToProps = (state: ApplicationState) => ({
    isOpen: getIsSpeakerEditorOpen(state),
    firestore: getFirestore(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    closeConfigDialog, toggleSponsorEditor
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(SpeakerEditor));
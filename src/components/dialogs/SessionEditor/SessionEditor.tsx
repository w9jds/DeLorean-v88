import './SessionEditor.scss';

import * as React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { Dispatch, bindActionCreators } from 'redux';

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

import { Close } from '@material-ui/icons';
import { WithStyles, withStyles, StyleRulesCallback } from '@material-ui/core/styles';

import { DocumentSnapshot } from '@firebase/firestore-types';
import { UploadTaskSnapshot } from '@firebase/storage-types';

import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/modern/theme';
import '../../../stylesheets/modern-dark/content.min.css';
import '../../../stylesheets/modern-dark/skin.min.css';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/advlist';

import { ApplicationState } from '../../..';
import { Speaker } from '../../../models/speaker';
import { getFirestore } from '../../../ducks/current';
import { closeConfigDialog } from '../../../ducks/config';
import { getSpeakers } from '../../../ducks/speaker';
import { getIsSessionEditorOpen, setSessionEditorOpen } from '../../../ducks/admin';
import { Select, MenuItem } from '@material-ui/core';
import { SessionEditorState } from '../../../models/session';
import { getSessionEditorState } from '../../../ducks/session';

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
    headerFields: {
        width: '50%',
        margin: 'auto 0'
    },
    formControl: {
        margin: theme.spacing.unit,
        display: 'block'
    },
    control: {
        minWidth: '200px'
    }
});

type SessionEditorProps = WithStyles<typeof styleSheet> & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

enum ErrorTypes {
    NAME = 'name',
    SPEAKER = 'speaker',
    DESCRIPTION = 'description'
}

type EditableTypes = 'name';

class SessionEditor extends React.PureComponent<SessionEditorProps, SessionEditorState> {

    private editor;

    constructor(props: SessionEditorProps) {
        super(props);

        this.state = {
            name: '',
            speakers: [],
            tracks: [],
            errors: []
        };
    }

    componentDidUpdate(prevProps: SessionEditorProps) {
        if (!prevProps.isOpen && this.props.isOpen) {
            /**
             * Push the initialize to the back of the event queue to ensure that
             * react has finished adding the dialog to the DOM.
             */
            setTimeout(this.initTinyMce, 0);
            this.setState(this.props.initState);
        }

        if (prevProps.isOpen && !this.props.isOpen) {
            tinymce.remove('textarea.description-editor');
        }
    }

    initTinyMce = () => {
        this.editor = tinymce.init({
            selector: 'textarea.description-editor',
            skin: 'modern-dark',
            plugins: [ 'autolink', 'lists', 'advlist' ],
            menubar: false,
            statusbar: false,
            toolbar: 'undo redo | bold italic underline strikethrough | bullist numlist | outdent indent'
        });

        tinymce.activeEditor.setContent(this.props.initState.description);
    }

    isSessionValid = () => {
        let errors = [];

        if (!this.state.name) {
            errors.push(ErrorTypes.NAME);
        }

        if (this.state.speakers.length === 0) {
            errors.push(ErrorTypes.SPEAKER);
        }

        if (errors.length > 0) {
            this.setState({ errors });
        }

        return errors.length == 0;
    }

    onSaveClicked = () => {
        const { initState } = this.props;

        if (this.isSessionValid()) {
            this.createSession();
        }
    }

    buildChanges = () => ({
        name: this.state.name.trim(),
        speakers: this.state.speakers,
        description: tinymce.activeEditor.getContent()
    })

    createSession = async () => {
        await this.props.firestore.collection('/sessions').add({
            ...this.buildChanges()
        });

        this.closeSessionEditor();
    }

    closeSessionEditor = () => this.props.setSessionEditorOpen(false);

    onValueChanged = (name: EditableTypes) =>
        (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => this.setState({
            [name]: e.target.value
        } as Pick<SessionEditorState, EditableTypes>)

    onSpeakersChanged = event => this.setState({ 
        [event.target.name as EditableTypes]: event.target.value 
    })

    buildFieldInput = (id: EditableTypes) => {
        const { errors } = this.state;

        return (
            <Input id={id}
                error={errors.indexOf(id) >= 0}
                value={this.state[id]}
                onChange={this.onValueChanged(id)} />
        );
    }

    buildSpeakerItems = () => {
        const {speakers} = this.props;

        return Object.keys(speakers).map(key => {
            let speaker = speakers[key].data() as Speaker;

            return (
                <MenuItem key={key} value={key}>
                    {speaker.name}
                </MenuItem>
            );
        });
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
                        <IconButton color="inherit" aria-label="Close" onClick={this.closeSessionEditor}>
                            <Close />
                        </IconButton>
                        <Typography variant="h6" color="inherit" className={classes.flex}>
                            Session Editor
                        </Typography>
                        <Button color="inherit" onClick={this.onSaveClicked}>save</Button>
                    </Toolbar>
                </AppBar>

                <DialogContent>
                    <div className="editor-session-header">

                        <div className="field-containers">
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="name">Name</InputLabel>
                                {this.buildFieldInput('name')}
                            </FormControl>

                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="speakers">Speakers</InputLabel>
                                <Select multiple displayEmpty
                                    classes={{select: classes.control}}
                                    value={this.state.speakers}
                                    onChange={this.onSpeakersChanged}
                                    inputProps={{ name: 'speakers' }}
                                    renderValue={ (selected: any[]) => {
                                        let {speakers} = this.props;
                                        
                                        return selected.map(
                                            key => speakers[key].data().name
                                        ).join(', ');
                                    }}>
                                    
                                    {this.buildSpeakerItems()}

                                </Select>
                            </FormControl>
                        </div>

                    </div>

                    <FormControl className={classes.formControl}>
                        <textarea className="description-editor" />
                    </FormControl>
                </DialogContent>
            </Dialog>
        );
    }

}

const mapStateToProps = (state: ApplicationState) => ({
    isOpen: getIsSessionEditorOpen(state),
    initState: getSessionEditorState(state),
    speakers: getSpeakers(state),
    firestore: getFirestore(state)
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
    closeConfigDialog, setSessionEditorOpen
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styleSheet)(SessionEditor));
import './SessionEditor.scss';

import * as React from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';

import {
    Dialog, AppBar, Toolbar, Button, Slide, Typography,
    IconButton, DialogContent, FormControl, InputLabel, Input,
    Select, MenuItem, Chip, Avatar
} from '@material-ui/core';

import { InputProps } from '@material-ui/core/Input';
import { Close } from '@material-ui/icons';
import { WithStyles, withStyles, StyleRulesCallback } from '@material-ui/core/styles';

import tinymce from 'tinymce/tinymce';
import 'tinymce/themes/silver';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/advlist';

import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, DateTimePicker } from 'material-ui-pickers';

import { getSpeakers } from '../../ducks/speaker';
import { getFirestore } from '../../ducks/current';
import { closeConfigDialog } from '../../ducks/config';
import { getSessionEditorState } from '../../ducks/session';
import { getIsSessionEditorOpen, setSessionEditorOpen } from '../../ducks/admin';

import { Speaker } from '../../../models/speaker';
import { ApplicationState } from '../../../models/states';
import { SessionEditorState, SessionTypes } from '../../../models/session';

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
        margin: theme.spacing(1.6),
        display: 'block'
    },
    chips: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    chip: {
        margin: theme.spacing(1.6) / 4,
    }
});

type SessionEditorProps = WithStyles<typeof styleSheet> & ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

enum ErrorTypes {
    NAME = 'name',
    SPEAKER = 'speaker',
    DESCRIPTION = 'description'
}

type InputEditableTypes = 'name' | 'location';
type DateTimeTypes = 'startTime' | 'endTime';

class SessionEditor extends React.PureComponent<SessionEditorProps, SessionEditorState> {

    private editor;

    constructor(props: SessionEditorProps) {
        super(props);

        this.state = {
            name: '',
            type: SessionTypes.SESSION,
            startTime: new Date(),
            endTime: new Date(),
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
            plugins: [ 'autolink', 'lists', 'advlist' ],
            skin: 'dark',
            resize: false,
            menubar: false,
            statusbar: false,
            browser_spellcheck: true,
            invalid_styles: 'color font-size font-family background-color',
            toolbar: 'undo redo | bold italic underline strikethrough | bullist numlist | outdent indent'
        });

        tinymce.activeEditor.setContent(this.props.initState.description);
    }

    isSessionValid = () => {
        let errors = [];

        if (!this.state.name) {
            errors.push(ErrorTypes.NAME);
        }

        if (this.state.type === SessionTypes.SESSION || this.state.type === SessionTypes.WORKSHOP) {
            if (this.state.speakers.length === 0) {
                errors.push(ErrorTypes.SPEAKER);
            }
        }

        if (errors.length > 0) {
            this.setState({ errors });
        }

        return errors.length == 0;
    }

    onSaveClicked = async () => {
        const { initState } = this.props;
        const changes = this.buildChanges();

        if (this.isSessionValid()) {
            if (!initState || !initState.ref) {
                await this.props.firestore.collection('/sessions').add(changes);
            } else {
                await this.props.initState.ref.update(changes);
            }

            this.closeSessionEditor();
        }
    }

    buildChanges = () => ({
        type: this.state.type,
        name: this.state.name.trim(),
        speakers: this.state.speakers,
        location: this.state.location,
        startTime: this.state.startTime,
        endTime: this.state.endTime,
        description: tinymce.activeEditor.getContent()
    })

    closeSessionEditor = () => this.props.setSessionEditorOpen(false);

    onValueChanged = (name: InputEditableTypes) =>
        (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => this.setState({
            [name]: e.target.value
        } as Pick<SessionEditorState, InputEditableTypes>)

    onDateTimeChanged = (field: DateTimeTypes) => 
        (date: Date) => this.setState({
            [field]: date
        } as Pick<SessionEditorState, DateTimeTypes>)

    onSelectChanged = event => {
        let update = { 
            [event.target.name]: event.target.value
        };

        this.setState(update as SessionEditorState);
    }

    buildFieldInput = (id: InputEditableTypes, props: InputProps) => {
        const { errors } = this.state;

        return (
            <Input id={id} {...props}
                error={errors.indexOf(id) >= 0}
                value={this.state[id]}
                onChange={this.onValueChanged(id)} />
        );
    }

    buildSessionTypes = () => {
        let items = [];

        for (let item in SessionTypes) {
            items.push(
                <MenuItem key={item} value={SessionTypes[item]}>
                    {SessionTypes[item]}
                </MenuItem>
            );
        }

        return items;
    }

    buildSpeakerSelect = () => {
        const { classes } = this.props;
        const { type } = this.state;

        if (type !== SessionTypes.SESSION && type !== SessionTypes.WORKSHOP) {
            return null;
        }

        return (
            <FormControl fullWidth className={classes.formControl}>
                <InputLabel htmlFor="speakers">Speakers</InputLabel>
                <Select multiple displayEmpty
                    classes={{select: 'speaker-selector'}}
                    value={this.state.speakers}
                    inputProps={{ name: 'speakers' }}
                    onChange={this.onSelectChanged}
                    renderValue={this.onRenderSpeakers}>
                    
                    {this.buildSpeakerItems()}
                </Select>
            </FormControl>
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

    onRenderSpeakers = selected => {
        let {speakers, classes} = this.props;
                                        
        return (
            <div className={classes.chips}>
                {selected.map(key => {
                    let speaker = speakers[key].data() as Speaker;

                    return (
                        <Chip key={key} className={classes.chip}
                            avatar={<Avatar src={speaker.portraitUrl} />}
                            label={speaker.name} />
                    );
                })}
            </div>
        );
    }

    render() {
        const { classes, isOpen } = this.props;
        const editor = classnames(classes.formControl, 'tinymce')

        return(
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                        <div className="editor-session-title">
                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="name">Name</InputLabel>
                                {this.buildFieldInput('name', { className: 'session-title' })}
                            </FormControl>

                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="location">Location</InputLabel>
                                {this.buildFieldInput('location', { className: 'session-location' })}
                            </FormControl>

                            <FormControl className={classes.formControl}>
                                <InputLabel htmlFor="type">Type</InputLabel>
                                <Select classes={{ select: 'type-selector' }}
                                    value={this.state.type}
                                    inputProps={{ name: 'type' }}
                                    onChange={this.onSelectChanged}>

                                    {this.buildSessionTypes()}
                                </Select>
                            </FormControl>
                        </div>

                        <div className="editor-session-header">
                            {this.buildSpeakerSelect()}

                            <div className="session-schedule">
                                <FormControl className={classes.formControl}>
                                    <DateTimePicker 
                                        label="Start Time"
                                        value={this.state.startTime} 
                                        onChange={this.onDateTimeChanged('startTime')} />
                                </FormControl>

                                <FormControl className={classes.formControl}>
                                    <DateTimePicker
                                        label="End Time"
                                        value={this.state.endTime}
                                        onChange={this.onDateTimeChanged('endTime')} />
                                </FormControl>
                            </div>
                        </div>

                        <FormControl className={editor}>
                            <textarea className="description-editor" />
                        </FormControl>
                    </DialogContent>
                </Dialog>
            </MuiPickersUtilsProvider>
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
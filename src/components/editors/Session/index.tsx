import React, { FC, useRef, useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { addDoc, collection, updateDoc } from 'firebase/firestore';

import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Dialog, AppBar, Toolbar, Button, Slide, Typography, IconButton, DialogContent, FormControl, InputLabel, Select, MenuItem, Chip, Avatar, TextField } from '@mui/material';
import { Close } from '@mui/icons-material';

import tinymce from 'tinymce';
import 'tinymce/themes/silver';
import 'tinymce/icons/default';
import 'tinymce/models/dom';
import 'tinymce/skins/ui/oxide-dark/skin.css';
import 'tinymce/plugins/autolink';
import 'tinymce/plugins/lists';
import 'tinymce/plugins/advlist';

import { Speaker } from 'models/speaker';
import { ApplicationState } from 'models/states';
import { SessionEditorState, SessionTypes } from 'models/session';

import { getDatabase } from 'store/current/selectors';
import { getSpeakers } from 'store/speakers/selectors';
import { getIsSessionEditorOpen } from 'store/admin/selectors';
import { setSessionEditorOpen } from 'store/admin/actions';
import { getSessionEditorState } from 'store/sessions/selectors';

import './index.scss';


const Transition = (props) => <Slide direction="up" {...props} />;
// const styleSheet: StyleRulesCallback = theme => ({
//     dialogForm: {
//         display: 'flex',
//         flexFlow: 'column',
//         padding: '20px'
//     },
//     headerFields: {
//         width: '50%',
//         margin: 'auto 0'
//     },
//     formControl: {
//         margin: theme.spacing.unit,
//         display: 'block'
//     },

// });

type DateTimeTypes = 'startTime' | 'endTime';
type InputEditableTypes = 'name' | 'location';
type SessionEditorProps = ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps>;

enum ErrorTypes {
  NAME = 'name',
  SPEAKER = 'speaker',
  DESCRIPTION = 'description'
}

const SessionEditor: FC<SessionEditorProps> = ({
  db,
  isOpen,
  initState,
  speakers,

  setSessionEditorOpen
}) => {

  const prevOpen = useRef(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [fields, setFields] = useState<Record<string, any>>({
    name: '',
    type: SessionTypes.SESSION,
    startTime: new Date(),
    endTime: new Date(),
    speakers: [],
    tracks: [],
  });

  useEffect(() => {
    if (!prevOpen.current && isOpen) {
      setTimeout(initTinyMce, 0);
      setFields(initState);
    }

    if (prevOpen.current && !isOpen) {
      tinymce.remove('textarea.description-editor');
    }

    prevOpen.current = isOpen;
  }, [isOpen])

  const closeSessionEditor = () => setSessionEditorOpen(false);

  const initTinyMce = () => {
    tinymce.init({
      selector: 'textarea.description-editor',
      plugins: [ 'autolink', 'lists', 'advlist' ],
      resize: false,
      menubar: false,
      statusbar: false,
      font_family_formats: 'Roboto',
      invalid_styles: 'color font-size font-family background-color',
      toolbar: 'undo redo | bold italic underline strikethrough | bullist numlist | outdent indent'
    });

    tinymce.activeEditor.setContent(initState.description);
  }

  const buildFieldInput = (label: string, id: InputEditableTypes, props) => (
    <TextField id={id} {...props}
      label={label}
      value={fields[id]}
      error={errors.indexOf(id) >= 0}
      onChange={onValueChanged(id)}
    />
  );

  const onRenderSpeakers = selected => (
    <div className="speaker-chips">
      {selected.map(key => {
        let speaker = speakers[key].data() as Speaker;

        return (
          <Chip key={key} className="chip"
            label={speaker.name}
            avatar={<Avatar src={speaker.portraitUrl} />}
          />
        );
      })}
    </div>
  );

  const getChanges = () => ({
    ...fields,
    name: fields.name.trim(),
    description: tinymce.activeEditor.getContent()
  });

  const onValueChanged = (name: InputEditableTypes) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFields({ ...fields, [name]: e.target.value } as Pick<SessionEditorState, InputEditableTypes>)
  };

  const onDateTimeChanged = (field: DateTimeTypes) => (date: Date) => {
    setFields({ ...fields, [field]: date } as Pick<SessionEditorState, DateTimeTypes>)
  };

  const onSelectChanged = event => {
    setFields({ ...fields, [event.target.name]: event.target.value } as SessionEditorState);
  };

  const isSessionValid = () => {
    let errors = [];

    if (!fields.name) {
      errors.push(ErrorTypes.NAME);
    }

    if (fields.type === SessionTypes.SESSION || fields.type === SessionTypes.WORKSHOP) {
      if (fields.speakers.length === 0) {
        errors.push(ErrorTypes.SPEAKER);
      }
    }

    if (errors.length > 0) {
      setErrors(errors);
    }

    return errors.length == 0;
  }

  const onSaveClicked = async () => {
    const changes = getChanges();

    if (isSessionValid()) {
      if (!initState || !initState.ref) {
        await addDoc(collection(db, '/sessions'), changes);
      } else {
        await updateDoc(initState.ref, changes);
      }

      closeSessionEditor();
    }
  }

  const buildSessionTypes = () => {
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

  const buildSpeakerSelect = () => {
    if (fields.type !== SessionTypes.SESSION && fields.type !== SessionTypes.WORKSHOP) {
      return null;
    }

    return (
      // className={classes.formControl}
      <FormControl fullWidth >
        <InputLabel htmlFor="speakers">Speakers</InputLabel>
        <Select multiple displayEmpty
          classes={{select: 'speaker-selector'}}
          value={fields.speakers}
          inputProps={{ name: 'speakers' }}
          onChange={onSelectChanged}
          renderValue={onRenderSpeakers}
        >
          {buildSpeakerItems()}
        </Select>
      </FormControl>
    );
  }

  const buildSpeakerItems = () => {
    return Object.keys(speakers).map(key => {
      let speaker = speakers[key].data() as Speaker;

      return (
        <MenuItem key={key} value={key}>
          {speaker.name}
        </MenuItem>
      );
    });
  }

  return(
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      {/* classes={{ paperFullScreen: classes.fullscreen }} */}
      <Dialog fullScreen
        open={isOpen}
        className="session-editor"
        TransitionComponent={Transition}>
        <AppBar className="header">
          <Toolbar>
            <IconButton color="inherit" aria-label="Close" onClick={closeSessionEditor}>
              <Close />
            </IconButton>
            <Typography variant="h6" color="inherit">
              Session Editor
            </Typography>
            <Button color="inherit" onClick={onSaveClicked}>
              Save
            </Button>
          </Toolbar>
        </AppBar>

        <DialogContent>
          <div className="editor-session-title">
            {buildFieldInput('Name', 'name', { className: 'session-title' })}
            {buildFieldInput('Location', 'location', { className: 'session-location' })}
            <FormControl>
              <InputLabel htmlFor="type">Type</InputLabel>
              <Select classes={{ select: 'type-selector' }}
                value={fields.type}
                inputProps={{ name: 'type' }}
                onChange={onSelectChanged}>
                {buildSessionTypes()}
              </Select>
            </FormControl>
          </div>

          <div className="editor-session-header">
            {buildSpeakerSelect()}

            <div className="session-schedule">
              <DateTimePicker
                label="Start Time"
                value={fields.startTime}
                onChange={onDateTimeChanged('startTime')}
              />
              <DateTimePicker
                label="End Time"
                value={fields.endTime}
                onChange={onDateTimeChanged('endTime')}
              />
            </div>
          </div>

          {/* className={classes.formControl} */}
          <FormControl>
            <textarea className="description-editor" />
          </FormControl>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
}

const mapStateToProps = (state: ApplicationState) => ({
  db: getDatabase(state),
  isOpen: getIsSessionEditorOpen(state),
  initState: getSessionEditorState(state),
  speakers: getSpeakers(state),
});

const mapDispatchToProps = (dispatch: Dispatch) => bindActionCreators({
  setSessionEditorOpen
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(SessionEditor);
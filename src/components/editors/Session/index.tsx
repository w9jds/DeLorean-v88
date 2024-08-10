import React, { FC, useRef, useEffect, useState, useMemo } from 'react';
import { connect, useDispatch } from 'react-redux';
import { addDoc, collection, updateDoc } from 'firebase/firestore';

import { Close } from '@mui/icons-material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import {
  Dialog, AppBar, Toolbar, Button, Slide, Typography, IconButton,
  DialogContent, FormControl, InputLabel, Select, MenuItem, Chip, Avatar, TextField, FormControlLabel, Checkbox
} from '@mui/material';

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
import { setSessionEditorOpen } from 'store/sessions/reducer';
import { getSessionEditorState, isSessionEditorOpen } from 'store/sessions/selectors';

import './index.scss';

const Transition = (props) => <Slide direction="up" {...props} />;

type DateTimeTypes = 'startTime' | 'endTime';
type InputEditableTypes = 'name' | 'location' | 'slidesUrl';
type SessionEditorProps = ReturnType<typeof mapStateToProps>;

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
}) => {
  const dispatch = useDispatch();

  const prevOpen = useRef(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [fields, setFields] = useState<Record<string, any>>({
    name: '',
    type: SessionTypes.SESSION,
    isUnscheduled: false,
    startTime: new Date(),
    endTime: new Date(),
    speakers: [],
    tracks: [],
  });

  useEffect(() => {
    if (!prevOpen.current && isOpen) {
      setFields(initState);
      setTimeout(initTinyMce, 0);
    }

    if (prevOpen.current && !isOpen) {
      tinymce.remove('.description-editor > textarea');
    }

    prevOpen.current = isOpen;
  }, [isOpen])

  const types = useMemo(() => {
    let items = [];

    for (let item in SessionTypes) {
      items.push(
        <MenuItem key={item} value={SessionTypes[item]}>
          {SessionTypes[item]}
        </MenuItem>
      );
    }

    return items;
  }, []);

  const closeSessionEditor = () => {
    dispatch(setSessionEditorOpen(false));
  }

  const initTinyMce = () => {
    tinymce.init({
      selector: '.description-editor > textarea',
      plugins: [ 'autolink', 'lists', 'advlist' ],
      resize: false,
      menubar: false,
      statusbar: false,
      font_family_formats: 'Roboto',
      invalid_styles: 'color font-size font-family background-color',
      toolbar: 'undo redo | bold italic underline strikethrough | bullist numlist | outdent indent'
    }).then(() => {
      if (initState?.description) {
        tinymce.activeEditor.setContent(initState.description);
      }
    });
  }

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
    description: tinymce.activeEditor.getContent(),
  });

  // const onValueChanged = (name: keyof SessionEditorState) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
  //   setFields({ ...fields, [name as keyof SessionEditorState]: e.target.value })
  // };

  const onValueChanged = (name: InputEditableTypes) => (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFields({ ...fields, [name]: e.target.value } as Pick<SessionEditorState, InputEditableTypes>)
  };

  const onDateTimeChanged = (field: DateTimeTypes) => (date: Date) => {
    setFields({ ...fields, [field]: date } as Pick<SessionEditorState, DateTimeTypes>)
  };

  const onSelectChanged = (name: string) => event => {
    setFields({ ...fields, [name]: event.target.value } as SessionEditorState);
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

  const buildSpeakerSelect = () => {
    if (fields.type !== SessionTypes.SESSION && fields.type !== SessionTypes.LIGHTNING_TALK && fields.type !== SessionTypes.WORKSHOP) {
      return null;
    }

    return (
      <div className="speaker-row">
        <FormControl>
          <InputLabel id="session-speakers-label">Speakers</InputLabel>
          <Select multiple displayEmpty
            labelId="session-speakers-label"
            label="Speakers"
            className="speaker-selector"
            value={fields.speakers}
            onChange={onSelectChanged('speakers')}
            renderValue={onRenderSpeakers}
          >
            {
              Object.keys(speakers).map(key => {
                let speaker = speakers[key].data() as Speaker;

                return (
                  <MenuItem key={key} value={key}>
                    {speaker.name}
                  </MenuItem>
                );
              })
            }
          </Select>
        </FormControl>
        <TextField label="Slides"
          className="speaker-slides"
          value={fields?.slidesUrl}
          onChange={onValueChanged('slidesUrl')}
        />
      </div>
    );
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Dialog fullScreen open={isOpen}
        className="session-editor"
        TransitionComponent={Transition}
      >
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
            <TextField label="Name"
              className="session-title"
              value={fields?.name}
              error={errors.indexOf('name') >= 0}
              onChange={onValueChanged('name')}
            />
            <TextField label="Location"
              className="session-location"
              value={fields?.location}
              error={errors.indexOf('location') >= 0}
              onChange={onValueChanged('location')}
            />
            <FormControl>
              <InputLabel id="session-type-label">Type</InputLabel>
              <Select className="type-selector"
                labelId="session-type-label"
                label="Type"
                value={fields.type}
                onChange={onSelectChanged('type')}>
                {types}
              </Select>
            </FormControl>
          </div>

          <div className="editor-session-header">
            {buildSpeakerSelect()}

            <div className="session-schedule">
              <DateTimePicker
                label="Start Time"
                disabled={fields.isUnscheduled}
                value={fields.startTime}
                onChange={onDateTimeChanged('startTime')}
              />
              <span className="divider"> - </span>
              <DateTimePicker
                label="End Time"
                disabled={fields.isUnscheduled}
                value={fields.endTime}
                onChange={onDateTimeChanged('endTime')}
              />

              <FormControlLabel
                className="scheduled-switch"
                label="Unannounced/TBD"
                control={
                  <Checkbox
                    onChange={e => setFields({ ...fields, isUnscheduled: e.target.checked })}
                    checked={fields?.isUnscheduled || false} />
                }/>
            </div>
          </div>

          <FormControl className="description-editor">
            <textarea placeholder="Session Details" />
          </FormControl>
        </DialogContent>
      </Dialog>
    </LocalizationProvider>
  );
}

const mapStateToProps = (state: ApplicationState) => ({
  db: getDatabase(state),
  isOpen: isSessionEditorOpen(state),
  initState: getSessionEditorState(state),
  speakers: getSpeakers(state),
});

export default connect(mapStateToProps)(SessionEditor);